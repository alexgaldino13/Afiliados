import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  tiktok?: string;
  instagram?: string;
  status: 'pending' | 'approved' | 'published';
  views?: string;
  ctr?: string;
  spyInsight?: string;
  optimizerScore?: number;
  agent?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'new_product' | 'conversion' | 'system' | 'gold' | 'spy' | 'optimizer';
  read: boolean;
  created_at: string;
}

export interface SquadContextType {
  products: Product[];
  approvedItems: Product[];
  campaigns: any[];
  profile: any;
  notifications: Notification[];
  fetchData: () => Promise<void>;
  approveProduct: (id: string) => Promise<void>;
  publishProduct: (id: string) => Promise<void>;
  scheduleCampaign: (id: string, date: Date) => Promise<void>;
  scoutProducts: (niche: string) => Promise<Product[]>;
  getScoutedProducts: () => Promise<any[]>;
  importScoutedProduct: (scoutedProduct: any) => Promise<void>;
  forceScout: () => Promise<void>;
  generateStrategy: (product: Product) => Promise<any>;
  generateCreative: (product: Product, strategy: any) => Promise<any>;
  generateMediaPlan: (product: Product, strategy: any) => Promise<any>;
  chatWithSquad: (messages: any[], context: any) => Promise<any>;
  saveCampaign: (campaignData: any) => Promise<void>;
  updateCampaign: (id: string, updates: any) => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
  getStats: () => Promise<any>;
  markNotificationRead: (id: string) => Promise<void>;
  addNotification: (title: string, message: string, type: string) => Promise<void>;
  addKnowledge: (title: string, content: string, tags?: string[]) => Promise<void>;
  getKnowledge: () => Promise<any[]>;
  mentorContext: any;
  setMentorContext: (context: any) => void;
}

const SquadContext = createContext<SquadContextType | undefined>(undefined);

// Configuração de API Inteligente: Procura o backend em localhost, 127.0.0.1 ou no IP da rede atual
const getInitialApiUrl = () => {
  const host = window.location.hostname;
  return `http://${host}:3001/api`;
};

export const SquadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(getInitialApiUrl());
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  // Probe Backend (Procura definitiva pela API)
  useEffect(() => {
    const probeBackend = async () => {
      const candidates = [
        `http://${window.location.hostname}:3001/api`,
        "http://localhost:3001/api",
        "http://127.0.0.1:3001/api"
      ];

      for (const url of candidates) {
        try {
          const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(1500) });
          if (res.ok) {
            console.log(`[LALA] Backend encontrado em: ${url}`);
            setApiUrl(url);
            setIsBackendOnline(true);
            return;
          }
        } catch (e) {}
      }
      setIsBackendOnline(false);
    };

    probeBackend();
  }, []);
  const [products, setProducts] = useState<Product[]>([]);
  const [approvedItems, setApprovedItems] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mentorContext, setMentorContext] = useState<any>(null);
  const { user } = useAuth();

  const fetchData = async () => {
    if (!user) return;

    try {
      // 1. Fetch ou Criar Perfil (Garante que o usuário tenha um perfil)
      let { data: profileData, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profError || !profileData) {
        console.log("[SquadContext] Criando perfil inicial para o usuário...");
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({ id: user.id, full_name: user.email?.split('@')[0], role: 'affiliate' })
          .select()
          .single();
        profileData = newProfile;
      }
      setProfile(profileData);

      // 2. Fetch Products (Radar)
      const { data: productsData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (prodError) throw prodError;
      setProducts(productsData || []);

      // 3. Fetch Campaigns e Notifications
      const [campRes, notifRes] = await Promise.all([
        supabase.from('campaigns').select('*, assets(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
      ]);

      setCampaigns(campRes.data || []);
      setNotifications(notifRes.data || []);

      // Removendo mapeamento "Legacy" e unificando no estado de campanhas
      setApprovedItems([]); // Este estado será descontinuado em favor do campaigns

    } catch (err) {
      console.error("[SquadContext] Falha ao sincronizar dados:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();

      // Real-time Notifications & Campaigns
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, () => fetchData())
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'campaigns',
          filter: `user_id=eq.${user.id}`
        }, () => fetchData())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const approveProduct = async (id: string) => {
    if (!user) return;
    let product = products.find(p => p.id === id);
    if (!product) return;

    try {
      console.log("[Squad] Iniciando aprovação de:", product.title);

      // 1. GARANTIR QUE O PRODUTO EXISTE NO BANCO
      // Verificação segura de ID (se for temporário ou inexistente)
      const isTemporaryId = !id || typeof id !== 'string' || id.length < 20;

      if (isTemporaryId) {
        const { data: newProd, error: insertErr } = await supabase
          .from('products')
          .insert({
            user_id: user.id,
            title: product.title || "Produto",
            price: product.price || 0,
            image_url: product.image_url || product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            description: product.description || "",
            platform: product.platform || 'Amazon',
            status: 'approved'
          })
          .select()
          .single();

        if (insertErr) throw new Error("Erro Supabase: " + insertErr.message);
        product = newProd;
      } else {
        const { error: updErr } = await supabase.from('products').update({ status: 'approved' }).eq('id', id);
        if (updErr) throw new Error("Erro Supabase Update: " + updErr.message);
      }

      setProducts(prev => prev.filter(p => p.id !== id));

      // 2. Chamar o Squad (Orquestração Direta)
      fetch(`${apiUrl}/agents/orchestrate?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          profile: { niche: profile?.niche, brand_voice: profile?.brand_voice }
        })
      }).then(res => {
        if (!res.ok) console.error("Falha ao entregar missão.");
      }).catch(err => console.error("Squad AI failed:", err));

      // 3. Notificação local imediata
      addNotification("Squad em Ação", `O Squad está criando os ativos para "${product.title}".`, "spy").catch(() => {});

    } catch (err: any) {
      console.error("Erro na aprovação:", err);
      alert("Falha: " + err.message);
    }
  };

  const publishProduct = async (id: string) => {
    try {
      await supabase
        .from('campaigns')
        .update({ status: 'published' })
        .eq('id', id);

      setApprovedItems(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));
    } catch (err) {
      console.error("Error publishing product:", err);
    }
  };

  const scheduleCampaign = async (id: string, date: Date) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          scheduled_at: date.toISOString(),
          status: 'scheduled'
        })
        .eq('id', id);

      if (error) throw error;

      await supabase.from('notifications').insert({
        user_id: user?.id,
        title: '📅 Postagem Agendada',
        message: `A campanha foi agendada para ${date.toLocaleString('pt-BR')}. O Agente Media Buyer monitorará a performance.`,
        type: 'info'
      });

      await fetchData();
    } catch (err) {
      console.error("Error scheduling campaign:", err);
      throw err;
    }
  };

  const saveCampaign = async (campaignData: any) => {
    if (!user) return;

    try {
      const { data: campaign, error: cError } = await supabase
        .from('campaigns')
        .upsert({
          id: campaignData.id,
          user_id: user.id,
          product_id: campaignData.product_id,
          title: campaignData.title,
          copy_aida: campaignData.copy_aida,
          business_dna: campaignData.business_dna,
          status: campaignData.status || 'draft'
        })
        .select()
        .single();

      if (cError) throw cError;

      if (campaignData.assets && campaignData.assets.length > 0) {
        const assetsToInsert = campaignData.assets.map((asset: any) => ({
          campaign_id: campaign.id,
          type: asset.type,
          url: asset.url,
          prompt: asset.prompt,
          metadata: asset.metadata || {}
        }));

        const { error: aError } = await supabase
          .from('assets')
          .insert(assetsToInsert);

        if (aError) throw aError;
      }

      await fetchData();
    } catch (err) {
      console.error("Error saving campaign:", err);
      throw err;
    }
  };

  const updateCampaign = async (id: string, updates: any) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err) {
      console.error("Error updating campaign:", err);
      throw err;
    }
  };

  const scoutProducts = async (niche: string) => {
    if (!user) return [];

    const targetNiche = niche || profile?.niche || 'Geral';

    try {
      const res = await fetch(`${apiUrl}/agents/scout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: targetNiche })
      });

      let newProducts;
      if (!res.ok) {
        console.warn("[SquadContext] Backend offline ou erro. Usando dados de demonstração.");
        newProducts = [
          { title: "Ventilador Portátil USB", price: 45.90, platform: "Amazon", commission: "10%", reason: "Tendência de verão e home office." },
          { title: "Lâmpada Inteligente RGB", price: 79.90, platform: "Amazon", commission: "10%", reason: "Alta procura para setup gamer." }
        ];
      } else {
        newProducts = await res.json();
      }

      const formattedForDB = (Array.isArray(newProducts) ? newProducts : [newProducts]).map((p: any) => ({
        title: p.title || "Produto Encontrado",
        price: parseFloat(p.price) || 0,
        commission: p.commission || "10%",
        image_url: p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        user_id: user.id,
        description: p.reason || p.description || "Oportunidade detectada.",
        platform: p.platform || "Amazon",
        affiliate_link: p.affiliate_link || "",
        status: 'pending',
        external_id: p.id?.toString() || Math.random().toString()
      }));

      // ATUALIZAÇÃO IMEDIATA DA TELA
      setProducts(prev => [...formattedForDB, ...prev]);

      // Tenta persistir no banco (silencioso)
      supabase.from('products').insert(formattedForDB).then(() => {
        console.log("[SquadContext] Produtos persistidos com sucesso.");
      });

      return formattedForDB;
    } catch (err: any) {
      console.error("[SquadContext] Erro Crítico no Scout:", err);
      alert(`Erro de Conexão: ${err.message}. \n\nO servidor em ${apiUrl} não respondeu. Verifique se o terminal está com a mensagem 'Server running on port 3001'.`);
      return [];
    }
  };

  const getScoutedProducts = async () => {
    const { data, error } = await supabase
      .from('scouted_products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error("Error fetching scouted products:", error);
      return [];
    }
    return data || [];
  };

  const importScoutedProduct = async (scoutedProduct: any) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          title: scoutedProduct.title,
          price: scoutedProduct.price,
          commission: scoutedProduct.commission,
          image_url: scoutedProduct.image_url,
          description: scoutedProduct.description,
          platform: scoutedProduct.platform,
          external_id: scoutedProduct.external_id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => [...prev, data]);

      // Se houver uma recomendação associada, marcar como aceita
      await supabase
        .from('scout_recommendations')
        .update({ status: 'accepted' })
        .eq('user_id', user.id)
        .eq('product_id', scoutedProduct.id);

    } catch (err) {
      console.error("Error importing product:", err);
    }
  };

  const forceScout = async () => {
    try {
      await fetch(`${apiUrl}/force-scout`, { method: 'POST' });
    } catch (err) {
      console.error("Force scout failed:", err);
    }
  };

  const generateStrategy = async (product: Product) => {
    const res = await fetch(`${apiUrl}/agents/strategist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product,
        context: mentorContext,
        profile: {
          niche: profile?.niche,
          brandVoice: profile?.brand_voice
        }
      })
    });
    return await res.json();
  };

  const generateCreative = async (product: Product, strategy: any) => {
    const res = await fetch(`${apiUrl}/agents/creative`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product,
        strategy,
        context: mentorContext,
        profile: {
          niche: profile?.niche,
          brandVoice: profile?.brand_voice
        }
      })
    });
    return await res.json();
  };

  const generateMediaPlan = async (product: Product, strategy: any) => {
    const res = await fetch(`${apiUrl}/agents/media-buyer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, strategy })
    });
    return await res.json();
  };

  const chatWithSquad = async (messages: any[], context: any) => {
    const res = await fetch(`${apiUrl}/agents/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context })
    });
    return await res.json();
  };

  const updateProfile = async (profileData: any) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;
      setProfile(prev => ({ ...prev, ...profileData }));
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const addNotification = async (title: string, message: string, type: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title,
          message,
          type,
          read: false
        })
        .select()
        .single();

      if (!error && data) {
        setNotifications(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error("Error adding notification:", err);
    }
  };

  const addKnowledge = async (title: string, content: string, tags?: string[]) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .insert({ user_id: user.id, title, content, tags });
      if (error) throw error;

      // Notificar o Squad que nova inteligência foi adicionada
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: '🧠 Cérebro Atualizado',
        message: `Seu método "${title}" foi integrado ao Squad. As próximas campanhas seguirão essa lógica.`,
        type: 'gold'
      });
    } catch (err) {
      console.error("Error adding knowledge:", err);
      throw err;
    }
  };

  const getKnowledge = async () => {
    if (!user) return [];
    const { data } = await supabase
      .from('knowledge_base')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  };

  const getStats = async () => {
    if (!user) return null;

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [clicksRes, convRes] = await Promise.all([
        supabase.from('clicks').select('*').eq('user_id', user.id).gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('conversions').select('*').eq('user_id', user.id).gte('created_at', sevenDaysAgo.toISOString())
      ]);

      const totalClicks = (clicksRes.data || []).length;
      const totalConv = (convRes.data || []).length;
      const revenue = (convRes.data || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);

      // Process daily data
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const dailyStats = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const dayName = days[d.getDay()];

        const dayClicks = (clicksRes.data || []).filter(c => c.created_at.startsWith(dateStr)).length;
        const dayConv = (convRes.data || []).filter(c => c.created_at.startsWith(dateStr)).length;
        const dayRevenue = (convRes.data || []).filter(c => c.created_at.startsWith(dateStr))
          .reduce((acc, curr) => acc + (curr.amount || 0), 0);

        return {
          name: dayName,
          clicks: dayClicks,
          revenue: dayRevenue,
          conversion: dayClicks > 0 ? (dayConv / dayClicks) * 100 : 0
        };
      });

      return {
        totalClicks,
        totalConv,
        revenue,
        conversionRate: totalClicks > 0 ? ((totalConv / totalClicks) * 100).toFixed(2) : 0,
        dailyStats
      };
    } catch (err) {
      console.error("Error fetching stats:", err);
      return null;
    }
  };

  return (
    <SquadContext.Provider value={{
      products,
      approvedItems,
      campaigns,
      profile,
      notifications,
      fetchData,
      approveProduct,
      publishProduct,
      scheduleCampaign,
      scoutProducts,
      getScoutedProducts,
      importScoutedProduct,
      generateStrategy,
      generateCreative,
      generateMediaPlan,
      chatWithSquad,
      saveCampaign,
      updateCampaign,
      updateProfile,
      getStats,
      markNotificationRead,
      forceScout,
      mentorContext,
      setMentorContext
    }}>
      {children}
    </SquadContext.Provider>
  );
};

export const useSquad = () => {
  const context = useContext(SquadContext);
  if (!context) throw new Error("useSquad must be used within SquadProvider");
  return context;
};
