import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("[Supabase] Aviso: Chave service_role não encontrada. O servidor pode ter problemas para salvar dados devido ao RLS.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
