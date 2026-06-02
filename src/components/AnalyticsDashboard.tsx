import React, { useState, useEffect } from "react";
import {
  Zap,
  TrendingUp,
  BarChart3,
  Link as LinkIcon,
  Cpu,
  ShieldCheck,
  Eye,
  Search,
  ArrowRight,
  Coffee,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { cn, MOCK_STATS } from "../lib/utils";
import { useSquad } from "../context/SquadContext";
import { supabase } from "../lib/supabase";

interface AnalyticsDashboardProps {
  onNavigate: (view: any) => void;
  stats: { links: number; approved: number };
}

export const AnalyticsDashboard = ({
  onNavigate,
  stats: legacyStats,
}: AnalyticsDashboardProps) => {
  const { getStats, profile } = useSquad();
  const [showBriefing, setShowBriefing] = useState(true);
  const [realStats, setRealStats] = useState<any>(null);

  useEffect(() => {
    getStats().then(setRealStats);
  }, []);

  const handleSimulateConversion = async () => {
    if (!legacyStats.approved) {
      alert("Crie uma campanha primeiro para simular conversões!");
      return;
    }
    const { data: campaignsData } = await supabase.from('campaigns').select('id, user_id').limit(1);
    if (!campaignsData?.length) return;

    await supabase.from('conversions').insert({
      campaign_id: campaignsData[0].id,
      user_id: campaignsData[0].user_id,
      amount: Math.floor(Math.random() * 100) + 50,
      currency: 'BRL',
      external_id: 'SIM-' + Math.random().toString(36).substr(2, 5)
    });

    const newData = await getStats();
    setRealStats(newData);
    alert("Venda simulada com sucesso! Verifique os gráficos.");
  };

  const dashboardStats = [
    {
      label: "Publicações Ativas",
      value: legacyStats.approved,
      trend: "+3",
      icon: Zap,
      color: "bg-primary",
      view: "approved",
    },
    {
      label: "Links de Tracking",
      value: legacyStats.links,
      trend: "Novo",
      icon: LinkIcon,
      color: "bg-secondary",
      view: "links",
    },
    {
      label: "Cliques Totais",
      value: realStats?.totalClicks ?? "...",
      trend: "+24.8%",
      icon: TrendingUp,
      color: "bg-primary-container text-on-primary-container",
      view: "analytics",
    },
    {
      label: "Resultado Est.",
      value: realStats ? `R$ ${realStats.revenue.toLocaleString()}` : "...",
      trend: "+15.2%",
      icon: BarChart3,
      color: "bg-secondary-container text-on-secondary-container",
      view: "analytics",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Lala Daily Briefing */}
      {showBriefing && (
        <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="absolute top-4 left-4 z-20">
             <button
              onClick={handleSimulateConversion}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 transition-all"
             >
               Simular Venda
             </button>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Cpu className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black font-headline tracking-tight">Lala Daily Briefing</h2>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest">
                08:30 AM • Squad Online
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2 text-left">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Radar de Oportunidades</p>
                <p className="text-sm font-medium leading-relaxed">
                  {realStats?.totalClicks > 0
                    ? `O Scout encontrou novos itens em ${profile?.niche || 'seu nicho'} com margem alta.`
                    : `O Scout está minerando ${profile?.niche || 'oportunidades'} agora. Já temos recomendações prontas.`
                  }
                </p>
                <button
                  onClick={() => onNavigate('pending')}
                  className="flex items-center gap-2 text-xs font-black text-amber-300 hover:gap-3 transition-all mt-4"
                >
                  REVISAR NO RADAR <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-left">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Status Criativo</p>
                <p className="text-sm font-medium leading-relaxed">
                  {legacyStats.approved} campanhas estão prontas para <span className="text-green-300 font-bold">Lançamento Orgânico</span>. O Spy detectou queda de CPM no TikTok.
                </p>
                <button
                  onClick={() => onNavigate('approved')}
                  className="flex items-center gap-2 text-xs font-black text-green-300 hover:gap-3 transition-all mt-4"
                >
                  IR PARA CAMPANHAS <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-left">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Dica do Mentor</p>
                <p className="text-sm font-medium leading-relaxed italic">
                  "O segredo da escala em 2026 é o Business DNA. Menos produto, mais desejo."
                </p>
                <button
                  onClick={() => onNavigate('mentor')}
                  className="flex items-center gap-2 text-xs font-black text-white/80 hover:gap-3 transition-all mt-4"
                >
                  VER INSIGHTS <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowBriefing(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>
      )}

      <div className="text-left">
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
          Dashboard Lala
        </h1>
        <p className="text-on-surface-variant font-body mt-1">
          Acompanhe o desempenho da sua infraestrutura de afiliados.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, i) => (
          <button
            key={i}
            onClick={() => onNavigate(stat.view as any)}
            className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-black/5 text-left hover:scale-[1.02] transition-transform"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl text-white", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-secondary font-black text-xs">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black font-headline text-on-surface mt-1">
                {stat.value}
              </h3>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-sm border border-black/5">
          <div className="flex justify-between items-center mb-10 text-left">
            <div>
              <h3 className="font-headline font-black text-2xl text-on-surface">
                Performance do Squad
              </h3>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Estatísticas Reais das suas campanhas</p>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={realStats?.dailyStats || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0061A4" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0061A4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#0061A4" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {!realStats?.dailyStats?.length && (
            <div className="mt-8 p-10 border border-dashed border-black/10 rounded-[2rem] text-center">
              <BarChart3 className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-on-surface-variant">Aguardando as primeiras vendas reais para gerar o gráfico.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
