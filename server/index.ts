import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import agentsRouter from './agents/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(process.cwd(), 'server', 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    products: [],
    approvedItems: [],
    publishedIds: []
  }));
}

// Data endpoints
app.get('/api/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  res.json(data);
});

app.post('/api/data', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

// Agents endpoint
app.use('/api/agents', agentsRouter);

// Automated Scout Function
async function runAutomatedScout() {
  console.log('[Scout Autônomo] Iniciando varredura por novas oportunidades...');
  try {
    // Para simplificar, vamos importar a função localmente ou fazer um fetch no próprio servidor.
    // Como estamos no mesmo app, vamos simular uma chamada POST interna ou extrair a lógica.
    // O mais seguro é chamar o próprio endpoint (precisamos do IP ou localhost).
    const niches = ['Cozinha Prática', 'Gadgets de Produtividade', 'Pets', 'Beleza e Estética'];
    const randomNiche = niches[Math.floor(Math.random() * niches.length)];
    
    const response = await fetch(`http://localhost:${PORT}/api/agents/scout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche: randomNiche })
    });

    if (response.ok) {
      const newProducts = await response.json();
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      
      // Adiciona os novos produtos ao radar, evitando duplicatas por ID ou Título
      newProducts.forEach((p: any) => {
        if (!data.products.find((existing: any) => existing.title === p.title)) {
          p.status = 'pending';
          data.products.unshift(p);
        }
      });
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      console.log(`[Scout Autônomo] Varredura concluída. Encontrados ${newProducts.length} itens no nicho ${randomNiche}.`);
    } else {
      console.error('[Scout Autônomo] Erro na resposta da API de Agentes.');
    }
  } catch (error) {
    console.error('[Scout Autônomo] Falha ao executar:', error);
  }
}

// Endpoint manual para acionar a automação
app.post('/api/force-scout', async (req, res) => {
  await runAutomatedScout();
  res.json({ message: 'Scout autônomo executado com sucesso.' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Roda o Scout Automático a cada 4 horas (14400000 ms)
  setInterval(runAutomatedScout, 14400000);
});
