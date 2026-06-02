import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabase.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURAÇÃO DE AFILIADOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AFFILIATES = {
  amazon: { tag: 'galdino1307-20' },
  mercadolivre: { id: 'galdinoalex20230130204122' }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOGGER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function log(agent: string, action: string, data?: any) {
  const logPath = path.join(process.cwd(), 'squad_intel.log');
  const ts = new Date().toISOString();
  const entry = `[${ts}] ${agent} | ${action}\n${data ? JSON.stringify(data, null, 2) : ''}\n${'-'.repeat(50)}\n`;
  fs.appendFileSync(logPath, entry);
  console.log(`[${agent}] ${action}`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MERCADO LIVRE API — DADOS REAIS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Monta link de afiliado real do ML
function mlAffiliateLink(permalink: string): string {
  const url = new URL(permalink);
  url.searchParams.set('matt_tool', AFFILIATES.mercadolivre.id);
  url.searchParams.set('matt_word', '');
  url.searchParams.set('matt_source', 'lala_filiados');
  return url.toString();
}

// Busca produtos reais na ML API
async function searchMercadoLivre(query: string, limit = 10): Promise<any[]> {
  log('ML_API', 'SEARCHING', { query, limit });
  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&sort=sold_quantity_desc&limit=${limit}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'LalaFiliados/1.0' }
    });

    if (!response.ok) throw new Error(`ML API status: ${response.status}`);
    const data = await response.json();
    const results = data.results || [];

    log('ML_API', 'RESULTS', { count: results.length, query });
    return results.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      currency: item.currency_id,
      sold: item.sold_quantity || 0,
      condition: item.condition,
      thumbnail: item.thumbnail?.replace('I.jpg', 'O.jpg') || item.thumbnail,
      permalink: item.permalink,
      affiliateLink: mlAffiliateLink(item.permalink),
      platform: 'Mercado Livre',
      category: item.category_id,
      installments: item.installments?.amount || null,
      rating: item.seller?.seller_reputation?.transactions?.total || 0,
    }));
  } catch (e: any) {
    log('ML_API', 'ERROR', { message: e.message });
    throw new Error(`Erro na ML API: ${e.message}`);
  }
}

// Busca os mais vendidos de uma categoria
async function getMlTrending(categoryId: string, limit = 5): Promise<any[]> {
  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&sort=sold_quantity_desc&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    return (data.results || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      sold: item.sold_quantity || 0,
      thumbnail: item.thumbnail?.replace('I.jpg', 'O.jpg'),
      permalink: item.permalink,
      affiliateLink: mlAffiliateLink(item.permalink),
      platform: 'Mercado Livre',
    }));
  } catch (e: any) {
    log('ML_API', 'TRENDING_ERROR', { categoryId, error: e.message });
    return [];
  }
}

// Categorias ML mais relevantes para afiliados (Brasil)
const ML_CATEGORIES: Record<string, string> = {
  'saude': 'MLB1246',
  'beleza': 'MLB1246',
  'eletronicos': 'MLB1051',
  'informatica': 'MLB1648',
  'esportes': 'MLB1276',
  'casa': 'MLB1574',
  'cozinha': 'MLB218519',
  'fitness': 'MLB1276',
  'livros': 'MLB1196',
  'brinquedos': 'MLB1132',
  'pets': 'MLB1648',
  'automoveis': 'MLB1743',
  'ferramentas': 'MLB1294',
  'moda': 'MLB1430',
};

function getCategoryId(niche: string): string {
  const lower = niche.toLowerCase();
  for (const [key, id] of Object.entries(ML_CATEGORIES)) {
    if (lower.includes(key)) return id;
  }
  return 'MLB1246'; // Saúde como fallback
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOTOR DE IA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function generateJson(prompt: string, model = 'google/gemini-2.0-flash-001'): Promise<any> {
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "LalaFiliados",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt + "\nRetorne APENAS JSON puro, sem markdown." }]
        })
      });
      const data = await response.json();
      if (data.choices?.[0]) {
        const content = data.choices[0].message.content.replace(/```json|```/g, "").trim();
        return JSON.parse(content);
      }
    } catch (e: any) {
      log('IA_ENGINE', 'OPENROUTER_ERROR', { message: e.message });
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await geminiModel.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, "").trim();
      const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/) || text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (e: any) {
      log('IA_ENGINE', 'GEMINI_ERROR', { message: e.message });
    }
  }

  throw new Error("Nenhuma API de IA disponível. Verifique .env");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCOUT — DADOS REAIS DO MERCADO LIVRE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/scout', async (req, res) => {
  const { niche, manualProduct } = req.body;

  if (manualProduct) {
    return res.json([{
      ...manualProduct,
      id: "MAN-" + Math.random().toString(36).substr(2, 9),
      status: "pending"
    }]);
  }

  try {
    log('SCOUT', 'START', { niche });

    // 1. Busca produtos REAIS no ML
    const mlProducts = await searchMercadoLivre(niche || 'mais vendidos', 9);

    if (mlProducts.length === 0) {
      return res.status(404).json({ error: "Nenhum produto encontrado no Mercado Livre para este nicho." });
    }

    // 2. IA analisa os produtos REAIS e atribui score de oportunidade
    const analysisPrompt = `
Você é um especialista em marketing de afiliados no Brasil.
Analise estes produtos REAIS do Mercado Livre e identifique os 3 com maior potencial para afiliados:

${JSON.stringify(mlProducts.map(p => ({
  title: p.title,
  price: p.price,
  sold: p.sold,
  condition: p.condition
})), null, 2)}

Para cada produto escolhido, analise:
- Comissão estimada ML (2-12% dependendo da categoria)
- Ticket médio x volume = potencial de ganho
- Motivo de estar em alta agora

Retorne APENAS este JSON (exatamente 3 itens):
[{
  "title": "título exato do produto da lista acima",
  "commissionRate": "X%",
  "estimatedEarningPerSale": "R$ X,XX",
  "opportunityScore": 85,
  "verdict": "OURO|PRATA|BRONZE",
  "whyNow": "motivo concreto em 1 linha",
  "campaignAngle": "ângulo de campanha sugerido em 1 linha"
}]`;

    const analysis = await generateJson(analysisPrompt);

    // 3. Combina dados reais com análise da IA
    const finalProducts = analysis.map((a: any) => {
      const realProduct = mlProducts.find(p =>
        p.title.toLowerCase().includes(a.title?.toLowerCase().split(' ').slice(0, 3).join(' '))
      ) || mlProducts[0];

      return {
        id: realProduct.id,
        title: realProduct.title,
        price: realProduct.price,
        platform: 'Mercado Livre',
        commission: a.commissionRate,
        estimatedEarning: a.estimatedEarningPerSale,
        reason: a.whyNow,
        campaignAngle: a.campaignAngle,
        image: realProduct.thumbnail,
        affiliate_link: realProduct.affiliateLink, // LINK REAL
        optimizerScore: (a.opportunityScore || 75) / 100,
        verdict: a.verdict,
        sold: realProduct.sold,
        status: "pending",
        dataSource: "Mercado Livre API", // transparência: dado real
      };
    });

    log('SCOUT', 'COMPLETE', { count: finalProducts.length, niche });
    res.json(finalProducts);

  } catch (e: any) {
    log('SCOUT', 'ERROR', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AFILIAMINER — PIPELINE 5 AGENTES COM DADOS REAIS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/garimpo', async (req, res) => {
  const { niche, userId } = req.body;
  if (!niche) return res.status(400).json({ error: "Informe o nicho." });

  log('AFILIAMINER', 'PIPELINE_START', { niche, userId });

  try {
    // ── M1: GARIMPEIRO — busca real no ML ────────
    log('M1', 'START', { niche });
    const categoryId = getCategoryId(niche);
    const [searchResults, trendingResults] = await Promise.all([
      searchMercadoLivre(niche, 8),
      getMlTrending(categoryId, 5)
    ]);

    // Combina e deduplica
    const allProducts = [...searchResults];
    for (const t of trendingResults) {
      if (!allProducts.find(p => p.id === t.id)) allProducts.push(t);
    }

    log('M1', 'COMPLETE', { total: allProducts.length });

    // ── M2: ANALISTA — score baseado em dados reais
    log('M2', 'START', {});
    const m2Prompt = `
Você é o Analista de Oportunidades de afiliados no Brasil.
Analise estes produtos REAIS do Mercado Livre no nicho "${niche}":

${JSON.stringify(allProducts.map(p => ({
  id: p.id,
  title: p.title,
  price: p.price,
  sold: p.sold,
  condition: p.condition
})), null, 2)}

Pontue cada produto (0-100) com:
- Comissão estimada x ticket (30 pts)
- Volume de vendas (25 pts)
- Concorrência na busca (25 pts)
- Tendência de mercado (20 pts)

Retorne APENAS este JSON (top 5):
[{
  "productId": "id do produto",
  "title": "título",
  "score": 85,
  "verdict": "OURO|PRATA|BRONZE|DESCARTADO",
  "commissionRate": "8%",
  "estimatedMonthlyEarning": "R$ XXX",
  "justification": "motivo em 1 linha"
}]`;

    const m2 = await generateJson(m2Prompt);
    const top1Analysis = m2.sort((a: any, b: any) => b.score - a.score)[0];
    const top1Product = allProducts.find(p => p.id === top1Analysis?.productId) || allProducts[0];

    log('M2', 'COMPLETE', { top1: top1Product?.title, score: top1Analysis?.score });

    // ── M3: POMELLI — DNA do produto real ────────
    log('M3', 'START', {});
    const m3Prompt = `
Você é a Pomelli Engine, especialista em DNA de marketing.
Produto REAL analisado: "${top1Product?.title}"
Preço: R$ ${top1Product?.price}
Vendas: ${top1Product?.sold} unidades
Plataforma: Mercado Livre Brasil

Extraia o DNA completo de marketing deste produto.

Retorne APENAS este JSON:
{
  "brandVoice": "tom de comunicação ideal",
  "usp": "proposta única em 1 frase",
  "marketGap": "o que os concorrentes não oferecem",
  "avatarPains": ["dor 1", "dor 2", "dor 3"],
  "buyerProfile": "perfil do comprador em 2 linhas",
  "priceJustification": "como justificar o preço de R$ ${top1Product?.price} para o comprador"
}`;

    const m3 = await generateJson(m3Prompt);
    log('M3', 'COMPLETE', {});

    // ── M4: ESTRATEGISTA ──────────────────────────
    log('M4', 'START', {});
    const m4Prompt = `
Você é o Estrategista de campanhas de afiliados.
Produto: "${top1Product?.title}" | R$ ${top1Product?.price} | ${top1Analysis?.commissionRate} comissão
DNA: ${JSON.stringify(m3)}
Canal atual: apenas orgânico

Crie o plano de campanha.

Retorne APENAS este JSON:
{
  "hook": "frase de abertura irresistível",
  "angle": "abordagem + motivo",
  "targetAudience": "público em 2 linhas",
  "recommendedChannel": "Blogger SEO|Reels|TikTok|WhatsApp|YouTube Shorts",
  "contentFormat": "artigo de blog|vídeo curto|carrossel|comparativo",
  "seoKeyword": "termo exato de busca no Google",
  "articleHeadline": "título SEO completo",
  "contentOutline": ["tópico 1", "tópico 2", "tópico 3", "tópico 4"]
}`;

    const m4 = await generateJson(m4Prompt);
    log('M4', 'COMPLETE', {});

    // ── M5: RELATOR — card final com dados reais ──
    const card = {
      generatedAt: new Date().toISOString(),
      niche,
      dataSource: 'Mercado Livre API — dados reais',

      product: {
        id: top1Product?.id,
        title: top1Product?.title,
        price: top1Product?.price,
        sold: top1Product?.sold,
        condition: top1Product?.condition,
        platform: 'Mercado Livre',
        image: top1Product?.thumbnail,
        affiliateLink: top1Product?.affiliateLink, // LINK REAL
        permalink: top1Product?.permalink,
      },

      analysis: {
        score: top1Analysis?.score,
        verdict: top1Analysis?.verdict,
        commissionRate: top1Analysis?.commissionRate,
        estimatedMonthlyEarning: top1Analysis?.estimatedMonthlyEarning,
        justification: top1Analysis?.justification,
        allScores: m2,
      },

      dna: m3,
      strategy: m4,

      links: {
        affiliateLink: top1Product?.affiliateLink,
        affiliateId: AFFILIATES.mercadolivre.id,
        productPage: top1Product?.permalink,
        mlDashboard: 'https://www.mercadolivre.com.br/afiliados',
      },

      allProducts: allProducts.slice(0, 5).map(p => ({
        title: p.title,
        price: p.price,
        sold: p.sold,
        affiliateLink: p.affiliateLink,
        image: p.thumbnail,
      })),

      nextStep: `Publique um artigo no Blogger com a keyword "${m4?.seoKeyword}" e insira o link de afiliado real do produto.`
    };

    // Salva no Supabase
    if (userId) {
      await supabase.from('scouted_products').upsert({
        title: top1Product?.title,
        price: top1Product?.price,
        platform: 'Mercado Livre',
        commission: top1Analysis?.commissionRate,
        description: top1Analysis?.justification,
        image_url: top1Product?.thumbnail,
        affiliate_link_template: top1Product?.affiliateLink,
        score: (top1Analysis?.score || 75) / 100,
        category: niche,
        external_id: top1Product?.id,
        raw_data: card,
      }, { onConflict: 'external_id' });

      log('M5', 'SUPABASE_SAVED', { productId: top1Product?.id });
    }

    log('AFILIAMINER', 'PIPELINE_COMPLETE', { score: top1Analysis?.score });
    res.json({ success: true, card });

  } catch (e: any) {
    log('AFILIAMINER', 'PIPELINE_ERROR', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MENTOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/mentor', async (req, res) => {
  const { url, topic } = req.body;
  try {
    const prompt = url
      ? `Analise esta URL de produto afiliado e extraia: título, plataforma, comissão estimada, público-alvo e ângulo de campanha. URL: ${url}. Retorne JSON.`
      : `Explique como um afiliado brasileiro iniciante pode começar com: ${topic}. Retorne JSON com: {steps: [], tips: [], platforms: []}`;
    const data = await generateJson(prompt);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Mentor Error" });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORCHESTRATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/orchestrate', async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.query;
  try {
    const { data: product } = await supabase
      .from('products').select('*').eq('id', productId).single();

    if (!product) throw new Error("Produto não encontrado");

    const { data: campaign } = await supabase
      .from('campaigns')
      .insert({ user_id: userId, product_id: productId, title: product.title, status: 'ready', progress: 100 })
      .select().single();

    res.json({ success: true, campaignId: campaign.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
