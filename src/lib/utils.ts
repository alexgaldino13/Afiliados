import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MOCK_PRODUCTS = [
  {
    id: 'AFF-9021',
    title: 'Minimalist Chrono Series',
    price: 189.00,
    category: 'Lifestyle',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBf3XwgVQf1TNiUQiMdrg7HZ4n211nYr9eIMy0IW0cwMgSZCRYmcwBZp_v8-8uc9KYwPWOQ9BISS4YIDFt8M5lvDymVB-TX3Csj4w08yyy8WSXp4rKXUoixwy_EmmZEhVF-acTfRmij0Z2BNB3dPgrvFbk2Nuq2xSdet8BIy7gDLTaJIIKmojJoKsA2nqsdmYPb0gURqKm4sFngHh5qfiNWpGjlQGcBwoEXKyN5Rz_fONAkolGaNpOZGLuOFRrv7kUgkaMMaX-lsg',
    tiktok: 'Upgrade your style with the Chrono Series. #luxury #lifestyle',
    instagram: 'The perfect balance of precision and elegance. Direct link in bio.',
    status: 'pending',
    views: '12.4k',
    ctr: '4.2%',
    spyInsight: 'Crescimento de 40% em Ad Libraries na última semana.',
    optimizerScore: 92
  },
  {
    id: 'AFF-5590',
    title: 'Aero-Speed Pro Runner',
    price: 125.00,
    category: 'Fitness',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDabI2Gy0K_EjSWy7C9tzDAyL0J-SgUhwT-WkWTNco080WK-qTvmp-raGmi6emy1TbUO-se6o3TeTP-Sf3O6mBlivGozX2YLLvR-uF6P-RYs6459-aQbWjZUnQnXaeifzXcXkyf0kcS205cCHrw_jUj0nbx8M38D_yMDv4r6mb0FKrrtsHFx7x_Yzwhd_XKg_V6Nex9CgohSsGg9Hg1sxGp3RHSLeYdXmgejmsc-Qi2dDQF8d111UfMg0B6uBmkmHQKwSovlbNER6I',
    tiktok: 'Unleash your speed. New drops at 12pm. #fitness #running',
    instagram: 'Designed for the elite. Engineered for speed. Shop the collection.',
    status: 'pending',
    spyInsight: 'Vencedor no TikTok UK. Baixa saturação no Brasil.',
    optimizerScore: 88
  },
  {
    id: 'AFF-8812',
    title: 'Sonic-HD Studio Wireless',
    price: 349.99,
    category: 'Tech',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrDQ0yOHCbFbyCGcTaEglGsI-GyeIL_HYetezxQD4O2gQcJ1X4FOMa9CGIPJojYV8aIIe4DNobwSCFT-AI12iLUpnp-rJeQwL2Z4ufcUEiCGPDtsJEtb2xHOCsMC8fAjtrnA1mRHsfSF7MUYeO9_Z8sZKTPHfksRQPJBP3QwepYqq0pyEpkZdcVDEuWjeheRMpmxMo7okWZt9jpCvdOEzFnlcJrZ3tdcAWC0XbrLxjHKpD9ZLDnvm0---7NZj3_JFyT9KSl7GCeOo',
    tiktok: 'Experience sound like never before. #audio #techreview',
    instagram: 'Pure acoustic perfection. Wireless freedom meets studio quality.',
    status: 'pending',
    spyInsight: 'Anúncios de concorrentes rodando há +15 dias.',
    optimizerScore: 95
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'gold', message: 'Scout encontrou gap de lucro em Câmeras Retrô.', time: '2m' },
  { id: 2, type: 'spy', message: 'Spy detectou escala agressiva de "Glow Skin" na Meta.', time: '15m' },
  { id: 3, type: 'optimizer', message: 'Conversão de Cozinha subiu 12%. Focar scripts lá.', time: '1h' }
];

export const MOCK_STATS = [
  { name: 'Seg', clicks: 4200, revenue: 1200, conversion: 2.1 },
  { name: 'Ter', clicks: 5100, revenue: 1500, conversion: 2.4 },
  { name: 'Qua', clicks: 4800, revenue: 1350, conversion: 2.2 },
  { name: 'Qui', clicks: 5900, revenue: 1800, conversion: 2.6 },
  { name: 'Sex', clicks: 7500, revenue: 2200, conversion: 2.8 },
  { name: 'Sáb', clicks: 8200, revenue: 2600, conversion: 3.0 },
  { name: 'Dom', clicks: 12482, revenue: 4290, conversion: 3.5 },
];

export const MOCK_TRENDS = [
  { date: '2024-01', revenue: 12000, growth: 5 },
  { date: '2024-02', revenue: 15000, growth: 8 },
  { date: '2024-03', revenue: 14000, growth: -2 },
  { date: '2024-04', revenue: 19000, growth: 12 },
  { date: '2024-05', revenue: 24000, growth: 15 },
  { date: '2024-06', revenue: 32000, growth: 22 },
];

export const MOCK_AGENTS = [
  { 
    id: 'scout', 
    name: 'Scout', 
    role: 'Mineração e Arbitragem', 
    goal: 'Identificar produtos com alta margem e baixa concorrência em marketplaces globais.',
    backstory: 'Especialista em análise de mercado e arbitragem, capaz de varrer Amazon, Hotmart e ClickBank em segundos.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop'
  },
  { 
    id: 'trend-hunter', 
    name: 'Trend Hunter', 
    role: 'Contextualização', 
    goal: 'Validar tendências no TikTok Creative Center, Google Trends e YouTube.',
    backstory: 'Analista de comportamento digital focado em captar o timing exato de curvas de crescimento.',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&h=200&auto=format&fit=crop'
  },
  { 
    id: 'copywriter', 
    name: 'Copywriter Psicográfico', 
    role: 'Persuasão AIDA/PAS', 
    goal: 'Criar legendas e scripts focados na dor e desejo do cliente ideal.',
    backstory: 'Redator publicitário mestre em gatilhos mentais e variações de tom para diferentes audiências.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop'
  },
  { 
    id: 'visual-designer', 
    name: 'Visual Designer', 
    role: 'Prompt Engineer', 
    goal: 'Gerar prompts otimizados para Midjourney/DALL-E e estruturar layouts de carrosséis.',
    backstory: 'Designer focado em estética de alta conversão e engenharia de prompts visuais.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop'
  },
  { 
    id: 'seo-tech', 
    name: 'SEO & Tech Strategist', 
    role: 'Estrategista de Alcance', 
    goal: 'Definir keywords, hashtags e plataformas ideais para cada produto.',
    backstory: 'Especialista em algoritmos de redes sociais e SEO de busca semântica.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop'
  },
  { 
    id: 'chief-staff', 
    name: 'Chief of Staff', 
    role: 'Orquestrador', 
    goal: 'Consolidar outputs dos outros agentes e gerenciar o fluxo de aprovação e postagem.',
    backstory: 'O cérebro do Squad. Garante que você receba apenas a "Oportunidade de Ouro" pronta para lucrar.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=200&auto=format&fit=crop'
  },
  { 
    id: 'spy', 
    name: 'Spy', 
    role: 'Monitor de Concorrência', 
    goal: 'Monitorar bibliotecas de anúncios (Meta/TikTok) para identificar criativos vencedores em escala.',
    backstory: 'Especialista em inteligência competitiva, focado em detectar anúncios com alto tempo de veiculação (lucrativos).',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&h=200&auto=format&fit=crop'
  },
  { 
    id: 'optimizer', 
    name: 'Conversion Optimizer', 
    role: 'Analista de Métricas', 
    goal: 'Analisar posts passados e priorizar produtos similares aos que geraram mais cliques e lucro.',
    backstory: 'Cientista de dados focado em loops de feedback positivo e maximização de ROI por nicho.',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: 'media-buyer',
    name: 'Media Buyer',
    role: 'Estrategista de Tráfego',
    goal: 'Criar planos de mídia otimizados para ROI, definindo orçamentos e segmentações.',
    backstory: 'Ex-gestor de contas em grandes agências, especialista em arbitragem de tráfego pago.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop'
  }
];

export const MOCK_CREATIVES = [
  {
    id: 'c1',
    title: 'Minimalist Kitchen Hack',
    type: 'Instagram Reel',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400&h=600&auto=format&fit=crop',
    status: 'Ready',
    agent: 'Visual Designer',
    isVideo: true
  },
  {
    id: 'c2',
    title: 'Eco-Friendly Gadget Showcase',
    type: 'TikTok Ad',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=400&h=600&auto=format&fit=crop',
    status: 'Generated',
    agent: 'Visual Designer',
    isVideo: true
  },
  {
    id: 'c3',
    title: 'Business Strategy Series',
    type: 'LinkedIn Carousel',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&h=600&auto=format&fit=crop',
    status: 'In Review',
    agent: 'Visual Designer',
    isVideo: false
  },
  {
    id: 'c4',
    title: 'Unboxing Premium Watch',
    type: 'YouTube Short',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&h=600&auto=format&fit=crop',
    status: 'Ready',
    agent: 'Chief of Staff',
    isVideo: true
  }
];
