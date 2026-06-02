import { fal } from "@fal-ai/client";
import dotenv from 'dotenv';

dotenv.config();

// Configure the client
// The library automatically looks for FAL_KEY or FAL_API_KEY in process.env
// But we can also set it explicitly if needed.

export async function generateImage(prompt: string): Promise<string> {
  try {
    // Se houver chave, tentamos o Fal.ai primeiro (pago/premium)
    if (process.env.FAL_KEY && !process.env.FAL_KEY.includes('YOUR_')) {
      console.log(`[Fal.ai] Gerando imagem (Premium): "${prompt}"`);
      const result: any = await fal.subscribe("fal-ai/flux/schnell", {
        input: { prompt, image_size: "landscape_4_3", num_inference_steps: 4 },
        logs: false,
      });
      if (result.images?.[0]?.url) return result.images[0].url;
    }
    
    // Fallback ou modo gratuito: Pollinations Flux (Custo Zero)
    return generateFreeImage(prompt);
  } catch (error) {
    console.error("[CreativeAPI] Erro no Fal.ai. Usando Pollinations...");
    return generateFreeImage(prompt);
  }
}

/**
 * Geração de Imagem Gratuita (Custo Zero)
 */
export async function generateFreeImage(prompt: string): Promise<string> {
  const seed = Math.floor(Math.random() * 1000000);
  const encodedPrompt = encodeURIComponent(prompt);
  // Usando 'flux' ou 'gptimage-large' que são free no Pollinations 2026
  return `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=768&seed=${seed}&model=flux&nologo=true&enhance=true`;
}

/**
 * Geração de Vídeo Curto (Custo Zero) - Novidade 2026
 */
export async function generateVideo(prompt: string): Promise<string> {
  console.log(`[Pollinations] Gerando VÍDEO gratuito: "${prompt}"`);
  const encodedPrompt = encodeURIComponent(prompt);
  // wan-fast é o modelo gratuito de 5s do Pollinations
  return `https://gen.pollinations.ai/video/${encodedPrompt}?model=wan-fast&width=720&height=1280`;
}

/**
 * Geração de Trilha Sonora (Custo Zero) - Novidade 2026
 */
export async function generateMusic(prompt: string): Promise<string> {
  console.log(`[Pollinations] Gerando MÚSICA gratuita: "${prompt}"`);
  const encodedPrompt = encodeURIComponent(prompt);
  // ACE-Step 1.5 Turbo para música grátis
  return `https://gen.pollinations.ai/audio/${encodedPrompt}?model=ace-step&duration=15`;
}
