// server/lib/mlAuth.ts
// Autenticação automática com Mercado Livre via Client Credentials

import dotenv from 'dotenv';
dotenv.config();

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getMlAccessToken(): Promise<string> {
  // Retorna token em cache se ainda válido (margem de 5 minutos)
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  const clientId = process.env.ML_CLIENT_ID;
  const clientSecret = process.env.ML_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('ML_CLIENT_ID ou ML_CLIENT_SECRET não configurados no .env');
  }

  const response = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Falha ao obter token ML: ${response.status} — ${err}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000);

  console.log('[ML_AUTH] Token obtido com sucesso. Expira em', data.expires_in, 'segundos');
  return cachedToken!;
}

// Busca autenticada na ML API
export async function mlSearch(query: string, limit = 10): Promise<any[]> {
  const token = await getMlAccessToken();

  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&sort=sold_quantity_desc&limit=${limit}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'LalaFiliados/1.0',
    }
  });

  if (!response.ok) {
    throw new Error(`ML Search falhou: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

// Busca por categoria autenticada
export async function mlSearchByCategory(categoryId: string, limit = 5): Promise<any[]> {
  const token = await getMlAccessToken();

  const url = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&sort=sold_quantity_desc&limit=${limit}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'LalaFiliados/1.0',
    }
  });

  if (!response.ok) {
    throw new Error(`ML Category Search falhou: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}
