import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabase.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

function logSquadIntel(agent: string, action: string, data: any) {
  const logPath = path.join(process.cwd(), 'squad_intel.log');
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] AGENTE: ${agent} | AÇÃO: ${action}\nDATA: ${JSON.stringify(data, null, 2)}\n${'-'.repeat(50)}\n`;
  fs.appendFileSync(logPath, logEntry);
}

// Helper to generate content using OpenRouter or Gemini
async function generateJson(prompt: string, model: string = 'google/gemini-2.0-flash-001') {
  logSquadIntel('IA_ENGINE', 'PROMPT_SENT', { prompt, model });

  // 1. Tentar via OpenRouter (Geralmente mais estável e suporta vários modelos)
  if (process.env.OPENROUTER_API_KEY) {
    try {
      logSquadIntel('IA_ENGINE', 'TRY_OPENROUTER', { model });
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "LalaFiliados",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": model,
          "messages": [{ "role": "user", "content": prompt + "\nRetorne APENAS o JSON puríssimo, sem explicações." }]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const content = data.choices[0].message.content;
        logSquadIntel('IA_ENGINE', 'OPENROUTER_RESPONSE', { content });
        const cleanJson = content.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
      }
    } catch (error: any) {
      logSquadIntel('IA_ENGINE', 'OPENROUTER_ERROR', { message: error.message });
    }
  }

  // 2. Fallback para Gemini Direto (AI Studio)
  if (process.env.GEMINI_API_KEY) {
    try {
      logSquadIntel('IA_ENGINE', 'TRY_GEMINI_DIRECT', { model: 'gemini-1.5-flash' });
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Tentamos o nome do modelo sem o prefixo 'models/' que às vezes causa 404
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await geminiModel.generateContent(prompt);
      const text = result.response.text();
      logSquadIntel('IA_ENGINE', 'GEMINI_RESPONSE', { text });

      const cleanText = text.replace(/```json|```/g, "").trim();
      const jsonMatch = cleanText.match(/\[\s*\{[\s\S]*\}\s*\]/) || cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (error: any) {
      logSquadIntel('IA_ENGINE', 'GEMINI_ERROR', { message: error.message });
    }
  }

  throw new Error("Falha total na IA. Verifique suas chaves de API no arquivo .env");
}

router.post('/scout', async (req, res) => {
  const { niche, manualProduct } = req.body;
  if (manualProduct) {
    return res.json([{ ...manualProduct, id: "MAN-" + Math.random().toString(36).substr(2, 9), status: "pending" }]);
  }

  try {
    const prompt = `
      Você é o "Agente Trend Hunter" da Amazon Brasil.
      Sua missão é identificar 3 produtos FÍSICOS REAIS e ESPECÍFICOS no nicho: ${niche || 'Geral'}.

      REGRAS:
      1. Títulos reais (ex: 'Echo Dot 5', 'Fritadeira Mondial AF-31').
      2. Affiliate link no padrão: https://www.amazon.com.br/dp/[ASIN]/?tag=galdino1307-20
      3. Imagem no padrão: https://m.media-amazon.com/images/I/[ID].jpg

      Retorne APENAS um Array JSON:
      [{ "title": "...", "price": 0.0, "platform": "Amazon", "commission": "10%", "reason": "...", "image": "...", "affiliate_link": "..." }]
    `;
    const data = await generateJson(prompt);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/mentor', async (req, res) => {
  const { url, topic } = req.body;
  try {
    const prompt = url ? `Analise a URL: ${url}` : `Explique como conectar: ${topic}`;
    const data = await generateJson(prompt);
    res.json(data);
  } catch (e) { res.status(500).json({ error: "Mentor Error" }); }
});

router.post('/orchestrate', async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.query;
  try {
    const { data: product } = await supabase.from('products').select('*').eq('id', productId).single();
    if (!product) throw new Error("Produto não encontrado");

    const { data: campaign } = await supabase.from('campaigns').insert({
      user_id: userId,
      product_id: productId,
      title: product.title,
      status: 'ready',
      progress: 100
    }).select().single();

    res.json({ success: true, campaignId: campaign.id });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
