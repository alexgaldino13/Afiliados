import { supabase } from '../lib/supabase.js';

/**
 * Baixa um arquivo de uma URL e faz upload para o Supabase Storage.
 * Retorna a URL pública permanente.
 */
export async function persistAsset(url: string, path: string, contentType: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Falha ao baixar asset: ${response.statusText}`);

    const buffer = await response.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('assets')
      .upload(path, buffer, {
        contentType,
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error(`[StorageError] Falha ao persistir asset ${url}:`, error);
    return url; // Fallback para a URL original se falhar
  }
}
