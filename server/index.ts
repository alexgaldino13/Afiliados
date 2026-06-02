import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agentsRouter from './agents/index.js';
import { createCampaignZip } from './utils/exporter.js';
import { supabase } from './lib/supabase.js';

dotenv.config();

const app = express();

// Configuração de CORS ultra-permissiva para redes locais
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rota de Teste de Vida (Health Check)
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use('/api/agents', agentsRouter);

// --- WEBHOOK DE VENDAS (Hotmart, Kiwify, etc) ---
app.post('/api/webhooks/sale', async (req, res) => {
  const data = req.body;
  console.log('[Webhook] Nova venda detectada:', data);

  try {
    // 1. Extrair dados (Lógica universal simples)
    // Tenta pegar o ID da campanha que enviamos no checkout (tracking parameter)
    const campaignId = data.tracking_id || data.external_id || data.campaign_id || data.off;
    const amount = data.amount || data.full_price || data.value || 0;
    const status = data.status || 'approved';

    if (status === 'approved' || status === 'completed' || status === 'paid') {
      // 2. Buscar dono da campanha
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('user_id, title')
        .eq('id', campaignId)
        .single();

      if (campaign) {
        // 3. Registrar Conversão
        await supabase.from('conversions').insert({
          campaign_id: campaignId,
          user_id: campaign.user_id,
          amount: amount,
          currency: data.currency || 'BRL',
          external_id: data.transaction_id || data.id
        });

        // 4. Notificar Usuário em tempo real
        await supabase.from('notifications').insert({
          user_id: campaign.user_id,
          title: '💰 VENDA REALIZADA!',
          message: `Parabéns! Sua campanha "${campaign.title}" acaba de gerar R$ ${amount}.`,
          type: 'gold'
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Webhook Error]:', error);
    res.status(500).json({ error: 'Internal processing error' });
  }
});

app.post('/api/export', async (req, res) => {
  const { item } = req.body;
  try {
    const zipBuffer = await createCampaignZip(item);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=lala-campaign-${item.id}.zip`);
    res.send(zipBuffer);
  } catch (error) {
    console.error("Export failed:", error);
    res.status(500).json({ error: "Failed to generate ZIP" });
  }
});

app.get('/api/l/:campaignId', async (req, res) => {
  const { campaignId } = req.params;
  try {
    const { data: campaign, error: cError } = await supabase
      .from('campaigns')
      .select('*, product:products(*)')
      .eq('id', campaignId)
      .single();

    if (cError || !campaign) return res.status(404).send('Link expirado ou não encontrado.');

    // 1. RASTREAMENTO: Registrar o clique
    const clickData = {
      campaign_id: campaignId,
      user_id: campaign.user_id,
      ip_address: req.ip || req.headers['x-forwarded-for'] || '0.0.0.0',
      user_agent: req.headers['user-agent'],
      referrer: req.headers['referer'] || 'direct'
    };

    supabase.from('clicks').insert(clickData).then(({ error }) => {
      if (error) console.error('[Tracker] Erro ao gravar clique:', error);
    });

    // 2. INTELIGÊNCIA: Injetar parâmetros de tracking conforme a plataforma
    let finalUrl = campaign.product?.affiliate_link || 'https://lala.ai/error';
    const platform = campaign.product?.platform?.toLowerCase();

    // Se for Amazon, injetar TAG se não tiver
    if (platform === 'amazon' && !finalUrl.includes('tag=')) {
       const urlObj = new URL(finalUrl);
       urlObj.searchParams.set('tag', 'galdino1307-20');
       finalUrl = urlObj.toString();
    }

    // Injetar ID da Campanha para o Webhook reconhecer depois (Postback)
    const urlObj = new URL(finalUrl);
    if (platform === 'hotmart') urlObj.searchParams.set('src', campaignId);
    else if (platform === 'kiwify') urlObj.searchParams.set('src', campaignId);
    else urlObj.searchParams.set('off', campaignId); // Parâmetro universal lala

    finalUrl = urlObj.toString();

    // 3. REDIRECIONAMENTO
    res.redirect(finalUrl);
  } catch (error) {
    console.error('[Link Error]:', error);
    res.status(500).send('Erro no sistema de rastreamento.');
  }
});

async function runAutomatedScout() {
  console.log('[Scout Autônomo] Iniciando varredura...');
  try {
    const niches = ['Cozinha Prática', 'Gadgets', 'Pets', 'Beleza', 'Saúde Natural', 'Produtividade'];
    const randomNiche = niches[Math.floor(Math.random() * niches.length)];
    
    const response = await fetch(`http://localhost:3001/api/agents/scout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche: randomNiche })
    });

    if (response.ok) {
      const newProducts = await response.json();
      const productsToInsert = newProducts.map((p: any) => ({
        title: p.title,
        price: p.price,
        commission: p.commission,
        image_url: p.image,
        description: p.reason,
        platform: p.platform,
        external_id: p.id,
        category: p.category,
        affiliate_link_template: p.affiliate_link,
        score: p.optimizerScore,
        raw_data: p
      }));

      const { data: insertedProducts, error: upsertError } = await supabase
        .from('scouted_products')
        .upsert(productsToInsert, { onConflict: 'external_id' })
        .select();

      if (upsertError) throw upsertError;
      console.log(`[Scout Autônomo] Sucesso! ${insertedProducts?.length} itens sincronizados.`);

      // --- MATCHING ENGINE ---
      // 1. Buscar todos os perfis ativos
      const { data: profiles } = await supabase.from('profiles').select('id, niche, brand_voice');

      if (profiles && insertedProducts) {
        for (const profile of profiles) {
          for (const product of insertedProducts) {
            // Lógica simples de matching por categoria/nicho
            const isMatch = product.category?.toLowerCase().includes(profile.niche?.toLowerCase()) ||
                            product.description?.toLowerCase().includes(profile.niche?.toLowerCase());

            if (isMatch) {
              // 2. Criar recomendação se não existir
              const { error: recError } = await supabase
                .from('scout_recommendations')
                .upsert({
                  user_id: profile.id,
                  product_id: product.id,
                  match_reason: `Este produto combina 100% com seu nicho de ${profile.niche}. Detectamos alta demanda para "${product.category}".`,
                  match_score: product.score || 0.85,
                  status: 'pending'
                }, { onConflict: 'user_id,product_id' });

              if (!recError) {
                // 3. Gerar Notificação
                await supabase.from('notifications').insert({
                  user_id: profile.id,
                  title: '🚀 Nova Oportunidade Encontrada!',
                  message: `O Scout detectou que "${product.title}" é perfeito para sua audiência de ${profile.niche}.`,
                  type: 'new_product',
                  metadata: { product_id: product.id }
                });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('[Scout Autônomo] Falha:', error);
  }
}

app.post('/api/force-scout', async (req, res) => {
  await runAutomatedScout();
  res.json({ message: 'Scout executado com sucesso.' });
});

const PORT = 3001;

async function checkDatabaseHealth() {
  console.log('[LALA DOCTOR] Verificando saúde do sistema...');

  // 1. Verificar Tabelas
  const { error: tableError } = await supabase.from('profiles').select('id').limit(1);
  if (tableError) {
    console.error('❌ ERRO CRÍTICO: Tabela "profiles" não encontrada. Rode o schema.sql no Supabase.');
  } else {
    console.log('✅ Banco de Dados: Tabelas ok.');
  }

  // 2. Verificar Storage
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  const assetsBucket = buckets?.find(b => b.name === 'assets');
  if (bucketError || !assetsBucket) {
    console.error('❌ ERRO CRÍTICO: Bucket "assets" não encontrado. Crie um bucket público chamado "assets" no Supabase Storage.');
  } else {
    console.log('✅ Storage: Bucket "assets" ok.');
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[LALA SERVER] Ouvindo em toda a rede: http://0.0.0.0:${PORT}`);
  checkDatabaseHealth();
  runAutomatedScout().catch(() => {
    console.log('[Scout Autônomo] Falha na inicialização — servidor continua rodando.');
  });
  setInterval(runAutomatedScout, 14400000);
});
