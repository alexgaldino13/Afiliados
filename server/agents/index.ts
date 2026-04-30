import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// Initialize the GenAI client
// It automatically picks up GEMINI_API_KEY from process.env
let aiClient: GoogleGenAI | null = null;
try {
  aiClient = new GoogleGenAI();
} catch (error) {
  console.warn("Failed to initialize GoogleGenAI. Is GEMINI_API_KEY set?", error);
}

// Helper to generate content and parse JSON
async function generateJson(prompt: string) {
  if (!aiClient) throw new Error("Gemini API not initialized");
  
  const response = await aiClient.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const text = response.text || "";
  try {
    // Attempt to extract JSON from markdown if present
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse JSON from AI response:", text);
    throw new Error("Invalid response format from AI");
  }
}

router.post('/scout', async (req, res) => {
  const { niche } = req.body;
  try {
    const prompt = `
      Você é um agente "Scout" especializado em mineração e arbitragem de produtos para afiliados (Hotmart, Amazon, TikTok Shop, etc).
      O nicho escolhido é: ${niche || 'Geral'}.
      Identifique 3 produtos físicos ou digitais que estão em alta ou têm potencial de arbitragem agora.
      Retorne APENAS um array JSON válido, onde cada objeto tenha a estrutura:
      {
        "id": "gerar_um_id_unico_ex_AFF-1234",
        "title": "Nome do Produto",
        "price": 100.00,
        "category": "Categoria curta",
        "platform": "Ex: Amazon, Hotmart",
        "commission": "Ex: 40%",
        "reason": "Frase curta de por que vender agora",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=400&auto=format&fit=crop" (use placeholders do unsplash genéricos para o nicho),
        "status": "pending",
        "optimizerScore": 90
      }
    `;

    const data = await generateJson(prompt);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/strategist', async (req, res) => {
  const { product } = req.body;
  try {
    const prompt = `
      Você é o agente "Strategist" de marketing digital, operando com a lógica de extração do "Google Labs Pomelli". 
      Analise o seguinte produto: ${JSON.stringify(product)}.
      Sua principal função é extrair o "Business DNA" deste produto e definir as dores/desejos do público.
      Retorne APENAS um JSON válido com a seguinte estrutura:
      {
        "businessDna": {
          "brandVoice": "Ex: Jovem e Dinâmico, ou Autoridade Clássica",
          "coreValues": "Ex: Praticidade, Sustentabilidade, Luxo Acessível",
          "uniqueSellingProposition": "Ex: A única ferramenta que faz X sem Y"
        },
        "painPoints": "Frase curta descrevendo as dores do público (ex: Sente que as fotos digitais não têm personalidade...)",
        "desires": "Frase curta descrevendo os desejos (ex: Busca status através da estética...)",
        "channels": [
          {
            "name": "TikTok (Organic)",
            "format": "Vídeo Curto / Trend",
            "match": "95%"
          },
          {
            "name": "Instagram (Reels)",
            "format": "Aesthetic / Lifestyle",
            "match": "89%"
          }
        ]
      }
    `;

    const data = await generateJson(prompt);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/creative', async (req, res) => {
  const { product, strategy } = req.body;
  try {
    const prompt = `
      Você é o agente "Creative" (Copywriter e Visual Designer), operando com as capacidades de geração do "Google Labs Pomelli".
      Produto: ${JSON.stringify(product)}
      Business DNA & Estratégia: ${JSON.stringify(strategy)}
      
      Usando o "Business DNA" fornecido, crie uma campanha autêntica e alinhada à voz da marca.
      Crie uma copy AIDA de alta conversão para as redes sociais e um prompt de IA generativa de imagens que represente perfeitamente os Core Values da marca.
      Retorne APENAS um JSON válido com a estrutura:
      {
        "campaignName": "Nome criativo para a campanha baseado no DNA",
        "copy": "Texto da legenda usando emojis e hashtags. Pule linhas usando \\n. Deve soar natural com a brandVoice.",
        "prompt": "cinematic unboxing of a sleek portable mixer, kitchen aesthetic, bright morning light, 4k --ar 9:16",
        "seoTags": "#nicho #produto #viral"
      }
    `;

    const data = await generateJson(prompt);

    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
