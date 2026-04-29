/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Cpu, 
  MessageSquare, 
  Play, 
  Plus, 
  Image as ImageIcon, 
  Bell, 
  BellRing,
  Clock,
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
  Zap,
  TrendingUp,
  Link as LinkIcon,
  CheckSquare,
  Settings2,
  Code,
  HelpCircle,
  LogOut,
  Calendar,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  Share2,
  BarChart3,
  Settings,
  User,
  Box,
  FileCode,
  ShieldCheck,
  Flame,
  Target,
  Trophy
} from 'lucide-react';
import { cn, MOCK_PRODUCTS, MOCK_STATS, MOCK_TRENDS, MOCK_AGENTS, MOCK_CREATIVES, MOCK_NOTIFICATIONS } from './lib/utils';
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
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// --- Types ---
type View = 'analytics' | 'pending' | 'approved' | 'studio' | 'agents' | 'creatives' | 'links' | 'checklist' | 'settings';

// --- Components ---

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 hover:translate-x-1 group text-left",
      active 
        ? "bg-white dark:bg-slate-800 text-primary dark:text-blue-300 font-bold shadow-sm" 
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
    )}
  >
    <Icon className={cn("w-5 h-5", active && "fill-current")} />
    <span className="text-sm">{label}</span>
  </button>
);

interface ProductCardProps {
  product: any;
  status: 'pending' | 'approved';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, status }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0px_24px_48px_-12px_rgba(25,28,30,0.06)] group transition-all duration-300 hover:translate-y-[-4px]"
    >
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-2/5 relative h-48 md:h-auto">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur text-primary text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase">
              {product.category}
            </span>
            {product.optimizerScore && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-primary text-white text-[9px] font-black rounded-full border border-white/20 shadow-lg">
                <Sparkles className="w-2.5 h-2.5" />
                ROI: {product.optimizerScore}%
              </div>
            )}
          </div>
        </div>
        <div className="md:w-3/5 p-8 flex flex-col justify-between">
          <div>
            {product.spyInsight && (
              <div className="mb-4 bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-secondary" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Spy Intel: {product.spyInsight}</span>
              </div>
            )}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-headline text-xl font-bold text-on-surface">{product.title}</h3>
              <span className="font-headline text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                R$ {product.price.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3 mt-6">
              {[
                { label: 'Copiar TikTok', content: product.tiktok, id: 'tiktok' },
                { label: 'Copiar Instagram', content: product.instagram, id: 'instagram' }
              ].map((item) => (
                <div key={item.id}>
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-1.5 ml-1">
                    {item.label}
                  </label>
                  <div className="flex items-center gap-2 bg-surface-container-low px-4 py-3 rounded-xl">
                    <p className="text-sm font-medium text-on-surface truncate flex-1">{item.content}</p>
                    <button 
                      onClick={() => handleCopy(item.content, item.id)}
                      className="text-primary hover:scale-110 transition-transform"
                    >
                      {copied === item.id ? <Check className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <button className="flex-1 bg-gradient-to-br from-secondary to-[#004d34] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-full transition-all active:scale-[0.98] shadow-lg shadow-secondary/20">
              Aprovar Postagem
            </button>
            <button className="px-6 py-4 border-2 border-error/20 text-error hover:bg-error/5 text-xs font-bold uppercase tracking-widest rounded-full transition-all">
              Rejeitar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Views ---

const PendingApprovals = () => (
  <div className="space-y-8">
    <div className="mb-10 text-left">
      <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Radar de Oportunidades</h1>
      <p className="text-on-surface-variant font-body mt-1">Produtos minerados pelo Scout e validados pelo Spy. Prontos para sua aprovação estratégica.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="md:col-span-2 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm flex justify-between items-center border border-primary/10">
        <div>
          <span className="text-[10px] font-black tracking-widest text-primary uppercase block mb-1">Potencial do Radar</span>
          <span className="font-headline text-3xl font-black text-on-surface">R$ 14.280,00 EST.</span>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-black tracking-widest text-secondary uppercase block mb-1">Score de Mercado</span>
          <span className="font-headline text-3xl font-black text-secondary">A+ EXCELENTE</span>
        </div>
      </div>
      <div className="bg-primary p-8 rounded-[2rem] text-white flex flex-col justify-center shadow-lg shadow-primary/20">
        <span className="text-[10px] font-black tracking-widest text-white/50 uppercase block mb-1">Ações Necessárias</span>
        <span className="font-headline text-3xl font-bold">{MOCK_PRODUCTS.length} ITEMS</span>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
      {MOCK_PRODUCTS.map(p => <ProductCard key={p.id} product={p} status="pending" />)}
    </div>
  </div>
);

const ApprovedPosts = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-left">
      <div>
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Fila de Publicação</h1>
        <p className="text-on-surface-variant font-body mt-1">Seus criativos aprovados com camadas de segurança e compliance.</p>
      </div>
      <div className="flex items-center gap-3 text-left">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-green-50 text-green-700 rounded-2xl font-bold text-sm border border-green-100">
          <ShieldCheck className="w-4 h-4" />
          Protocolo Seguro Ativo
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
      {MOCK_PRODUCTS.slice(0, 2).map((product, i) => (
        <div key={i} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-bl-[5rem] -mr-6 -mt-6 transition-transform group-hover:scale-110">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="font-headline font-bold text-xl mb-6 text-on-surface text-left font-headline leading-tight">{product.title}</h3>
          
          {/* Compliance Checklist */}
          <div className="bg-surface-container-low p-6 rounded-3xl space-y-3 mb-8 border border-black/5 text-left">
            <h4 className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-4">Verificações do Squad</h4>
            {[
              'Link de Afiliado Validado (UTM Otimizada)',
              'Disclaimer de Publicidade (COPPA/CONAR)',
              'Hashtags de Alta Relevância (SEO Hunter)',
              'Script de Retenção (Copywriter Expert)'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-on-surface/80">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
              Agendar para Redes
            </button>
            <button className="px-6 py-4 bg-surface-container-low text-on-surface font-bold rounded-2xl text-sm hover:bg-slate-100 transition-colors">
              Ajustar
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsDashboard = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Painel Executivo</h1>
        <p className="text-on-surface-variant font-body mt-1">Bem-vindo de volta! Aqui está o pulso da sua operação.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-surface-container-lowest px-4 py-2.5 rounded-2xl border border-black/5 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-on-surface">Abril 2026</span>
        </div>
      </div>
    </div>

    {/* Quick Start Guide */}
    <div className="bg-gradient-to-r from-primary to-primary-container p-1 rounded-[2.5rem] shadow-xl shadow-primary/10">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-[2.3rem] flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center shrink-0">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-headline font-bold text-2xl text-on-surface mb-2">Guia de Início Rápido</h3>
          
          {/* Squad Insights: Spy & Optimizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-secondary/5 p-3 rounded-2xl border border-secondary/10 flex items-start gap-3">
              <Eye className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <div>
                <p className="text-[11px] font-bold text-on-surface leading-tight">Spy: Anúncio "Home Office" escalando na Meta há 12 dias.</p>
              </div>
            </div>
            <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="text-[11px] font-bold text-on-surface leading-tight">Optimizer: Nicho "Cozinha" converteu 45% mais agora.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
             {[
               { step: '1', label: 'Conectar Lojas', desc: 'Ajustes de API' },
               { step: '2', label: 'Ativar Radar', desc: 'Oportunidades' },
               { step: '3', label: 'Lançar Squad', desc: 'Gerar Conteúdo' },
               { step: '4', label: 'Publicar', desc: 'Aprovar Criativos' },
             ].map((s, i) => (
               <div key={i} className="bg-surface-container-low p-4 rounded-2xl border border-black/5">
                 <span className="text-[10px] font-black text-primary bg-primary/10 w-5 h-5 flex items-center justify-center rounded-full mb-2">{s.step}</span>
                 <p className="text-xs font-bold text-on-surface">{s.label}</p>
                 <p className="text-[10px] text-on-surface-variant font-medium">{s.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>

    {/* Quick Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Receita Total', value: 'R$ 42.190', trend: '+15.2%', icon: Zap, color: 'bg-primary' },
        { label: 'Cliques Ativos', value: '184.2k', trend: '+24.8%', icon: TrendingUp, color: 'bg-secondary' },
        { label: 'Taxa de Conv.', value: '3.8%', trend: '+0.5%', icon: CheckCircle2, color: 'bg-primary-container text-on-primary-container' },
        { label: 'Lucro Líquido', value: 'R$ 28.500', trend: '+12.4%', icon: LayoutDashboard, color: 'bg-secondary-container text-on-secondary-container' },
      ].map((stat, i) => (
        <div key={i} className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-black/5">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-2xl", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-secondary font-black text-xs">{stat.trend}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black font-headline text-on-surface mt-1">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Revenue Trend Chart */}
      <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-headline font-bold text-xl text-on-surface">Tendência de Receita</h3>
          <select className="bg-surface-container-low border-0 text-xs font-bold rounded-full px-4 py-1.5 focus:ring-2 focus:ring-primary/20">
            <option>Semanal</option>
            <option>Mensal</option>
          </select>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_STATS}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00236f" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#00236f" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#00236f', strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#00236f" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth Metric */}
      <div className="lg:col-span-4 bg-primary text-white p-8 rounded-[2.5rem] flex flex-col justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="font-headline font-bold text-lg mb-2">Crescimento de Afiliados</h3>
          <p className="text-white/70 text-sm">Desempenho histórico nos últimos 6 meses.</p>
        </div>
        <div className="h-48 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_TRENDS}>
              <Bar dataKey="growth" radius={[4, 4, 0, 0]}>
                {MOCK_TRENDS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.growth > 0 ? '#5eead4' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="relative z-10 flex items-end justify-between">
          <div>
            <span className="block text-4xl font-black font-headline">22%</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">Este Mês</span>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>

    {/* Top Performing Products */}
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6 px-4">
        <h3 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Produtos com Melhor Desempenho</h3>
        <button className="text-sm font-bold text-primary hover:underline">Ver Todos</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PRODUCTS.map((product, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm hover:translate-y-[-2px] transition-all">
            <div className="flex gap-4 mb-4">
              <img src={product.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
              <div className="flex-1">
                <h4 className="font-bold text-on-surface leading-tight mb-1">{product.title}</h4>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded">R$ {product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-container-low">
              <div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Cliques</span>
                <span className="font-headline font-bold text-on-surface">{product.views || '4.2k'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Conversão</span>
                <span className="font-headline font-bold text-on-surface">{product.ctr || '2.8%'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-on-surface-variant hover:bg-slate-50 rounded-xl transition-all relative"
      >
        <BellRing className="w-5 h-5" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 z-50 text-left"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-on-surface">Radar In-App</h3>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Tempo Real</span>
              </div>
              <div className="space-y-4">
                {MOCK_NOTIFICATIONS.map((notif) => (
                  <div key={notif.id} className="flex gap-4 group cursor-pointer">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                      notif.type === 'gold' ? 'bg-amber-100 text-amber-600' : 
                      notif.type === 'spy' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                    )}>
                      {notif.type === 'gold' ? <Trophy className="w-5 h-5" /> : 
                       notif.type === 'spy' ? <Eye className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{notif.message}</p>
                      <span className="text-[10px] text-on-surface-variant font-medium mt-1 inline-block">{notif.time} atrás</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2.5 bg-surface-container-low text-on-surface text-xs font-bold rounded-xl hover:bg-slate-100 transition-all text-center">
                Ver Todas as Atividades
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const AgentSquadView = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div>
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Squad de Agentes</h1>
        <p className="text-on-surface-variant font-body mt-1">Sua força tarefa de IA trabalhando 24/7 na sua conta de afiliado.</p>
      </div>
      
      {/* Strategy Selector */}
      <div className="bg-surface-container-low p-2 rounded-[2rem] flex items-center gap-1 border border-black/5 shadow-inner">
        {[
          { id: 'stealth', icon: ShieldCheck, label: 'Evergreen' },
          { id: 'blitz', icon: Flame, label: 'Blitzkrieg' },
          { id: 'precision', icon: Target, label: 'ROI Focus' }
        ].map((strat) => (
          <button 
            key={strat.id}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tighter transition-all",
              strat.id === 'blitz' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <strat.icon className="w-3.5 h-3.5" />
            {strat.label}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Agents List */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="font-headline font-bold text-lg text-on-surface ml-2">Agentes Disponíveis</h3>
        {MOCK_AGENTS.map((agent) => (
          <div key={agent.id} className="bg-surface-container-lowest p-5 rounded-3xl border border-black/5 shadow-sm hover:border-primary/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-3">
              <img src={agent.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
              <div>
                <h4 className="font-bold text-on-surface leading-tight">{agent.name}</h4>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{agent.role}</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{agent.goal}</p>
          </div>
        ))}
      </div>

      {/* Squad Workspace */}
      <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5 min-h-[600px] flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">Workspace do Squad</h3>
              <p className="text-xs text-on-surface-variant">Configure e execute uma missão conjunta.</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {MOCK_AGENTS.map(agent => (
              <img key={agent.id} src={agent.avatar} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="" />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto pr-2 max-h-[500px]">
          <div className="space-y-4">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block ml-2">Nova Missão</label>
            <div className="relative group">
              <textarea 
                className="w-full bg-surface-container-low border-0 rounded-3xl px-8 py-6 focus:ring-2 focus:ring-primary/20 text-on-surface min-h-[120px] resize-none transition-all group-hover:bg-surface-container-high"
                placeholder="Ex: Encontrar e preparar campanha para produto de Saúde Natural com foco em TikTok..."
              />
              <div className="absolute right-4 bottom-4">
                <Sparkles className="w-5 h-5 text-primary opacity-30" />
              </div>
            </div>
          </div>

          {/* Golden Opportunity Simulation */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-[2.5rem] border border-amber-200/50 shadow-xl shadow-amber-950/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
               <div className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Oportunidade de Ouro</div>
            </div>
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-sm shrink-0">
                <img src={MOCK_PRODUCTS[1].image} className="w-full h-full object-cover rounded-2xl" alt="" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Chief of Staff Delivery</span>
                  <div className="w-1 h-1 rounded-full bg-amber-300"></div>
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">94% Score</span>
                </div>
                <h4 className="font-headline font-bold text-xl text-amber-900 mb-2">Escova Sanitária Premium (Minimalista)</h4>
                <p className="text-sm text-amber-800/70 leading-relaxed mb-4">"O Scout encontrou um gap de SEO no nicho de Home Decor. O Trend Hunter confirmou alta no Pinterest. O Copy preparou 3 variações de anúncios."</p>
                
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1.5 bg-white/60 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-900 uppercase">3 Carrosséis Prontos</div>
                  <div className="px-3 py-1.5 bg-white/60 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-900 uppercase">Keywords Mapeadas</div>
                  <div className="px-3 py-1.5 bg-white/60 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-900 uppercase">Link de Afiliado Gerado</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-amber-200/30 flex justify-end gap-3">
              <button className="px-6 py-3 bg-white/80 hover:bg-white text-amber-900 text-sm font-bold rounded-2xl transition-all border border-amber-200">Revisar</button>
              <button className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-black rounded-2xl transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Aprovar e Publicar
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Play className="w-4 h-4 text-secondary fill-current" />
              </div>
              <h5 className="font-bold text-sm text-on-surface">Visualizar Processamento do Squad</h5>
            </div>
            <div className="space-y-3">
              {[
                { agent: 'Spy', task: 'Varredura em Ad Libraries: Detectados 14 anúncios ativos há +7 dias para "Minimalist Home".' },
                { agent: 'Scout', task: 'Mineração de produtos similares na Amazon com margem superior a 25%.' },
                { agent: 'Trend Hunter', task: 'Validação de timing: #HomeDecor minimalista com 2M de visualizações no TikTok esta semana.' },
                { agent: 'Conversion Optimizer', task: 'Ajuste de Prioridade: Carrosséis de Home Decor converteram 15% melhor no último mês.' },
                { agent: 'Copywriter Psicográfico', task: 'Geração de headlines agressivas baseadas em anúncios vencedores mapeados pelo Spy.' },
                { agent: 'Visual Designer', task: 'Criação de prompts visuais inspirados no estilo gráfico que mais converte no seu perfil.' },
                { agent: 'Chief of Staff', task: 'Finalização do pacote "Oportunidade de Ouro" orientada por ROI.' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-black/5">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-tighter">{step.agent}</span>
                    <p className="text-xs font-medium text-on-surface">{step.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-xs font-bold">
              <MessageSquare className="w-4 h-4" />
              Logs de Interação
            </div>
          </div>
          <button className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            Lançar Squad
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CreativeGallery = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Galeria de Criativos</h1>
        <p className="text-on-surface-variant font-body mt-1">Gerencie todos os assets visuais e copies gerados pelo Squad.</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2.5 bg-surface-container-low text-on-surface rounded-xl hover:bg-surface-container-high transition-colors">
          <Filter className="w-5 h-5" />
        </button>
        <button className="px-6 py-2.5 bg-primary text-white rounded-2xl font-bold flex items-center gap-2">
          <Search className="w-4 h-4" />
          Buscar
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
      {MOCK_CREATIVES.map((creative) => (
        <div key={creative.id} className="group bg-surface-container-lowest rounded-[2.5rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500">
          <div className="relative aspect-[3/4] overflow-hidden">
            <img src={creative.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/20">{creative.type}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-white text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
                <button className="p-3 bg-white/20 backdrop-blur-md text-white rounded-xl">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-on-surface leading-tight text-lg mb-1">{creative.title}</h3>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">{creative.agent}</span>
              </div>
              <div className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                creative.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              )}>
                {creative.status}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Empty State / Add New */}
      <div className="border-4 border-dashed border-surface-container-high rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-primary/30 transition-colors">
        <div className="p-4 bg-surface-container-low rounded-3xl group-hover:bg-primary/10 transition-colors mb-4">
          <ImageIcon className="w-8 h-8 text-on-surface-variant group-hover:text-primary" />
        </div>
        <h4 className="font-bold text-on-surface mb-2">Solicitar Novo Criativo</h4>
        <p className="text-xs text-on-surface-variant max-w-[200px]">Ative o Squad para gerar novos designs e posts.</p>
      </div>
    </div>
  </div>
);

const CreationStudio = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div>
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Studio de Criação</h1>
        <p className="text-on-surface-variant font-body mt-1">Refine copies e artes em tempo real com o Squad de Agentes.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {MOCK_AGENTS.slice(0, 4).map((agent, i) => (
            <img key={i} src={agent.avatar} className="w-9 h-9 rounded-full border-4 border-white object-cover shadow-sm" alt="" />
          ))}
        </div>
        <button className="ml-4 px-6 py-2.5 bg-primary/5 text-primary rounded-2xl font-bold text-xs border border-primary/10 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Chat Ativo
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 h-[650px]">
      {/* Interaction Panel */}
      <div className="lg:col-span-8 bg-slate-950 rounded-[3rem] p-8 relative overflow-hidden flex flex-col shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Sparkles className="w-80 h-80 text-primary" />
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-8 mb-8 pr-4 custom-scrollbar">
          <div className="flex gap-4 text-left">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] rounded-tl-none max-w-[85%] border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Spy & Scout</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-body">Detectei uma nova tendência de **"Home Refresh"** que está explodindo no TikTok. O produto **Minimalist Watch** combina perfeitamente com esse estilo *Clean Girl*. Gere sugestões de copy focadas em Minimalismo?</p>
            </div>
          </div>
          
          <div className="flex gap-4 flex-row-reverse text-right">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/10">
              <User className="w-5 h-5" />
            </div>
            <div className="bg-primary p-6 rounded-[2.5rem] rounded-tr-none max-w-[85%] shadow-2xl shadow-primary/20">
              <p className="text-sm text-white font-medium">Excelente sacada! Crie 3 variações de script para esse nicho. Foque em organização e estética.</p>
            </div>
          </div>

          <div className="flex gap-4 text-left">
            <div className="w-10 h-10 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0 border border-secondary/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] rounded-tl-none max-w-[85%] border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 mb-2 text-secondary">
                <span className="text-[10px] font-black uppercase tracking-widest">Copywriter Agente</span>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-white/70 italic">"Menos é tudo. ✨ Conheça o design que vai organizar sua rotina sem poluir seu espaço."</p>
                </div>
                <p className="text-xs text-white/80">Processando visuais para o Instagram...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-auto">
          <input 
            type="text" 
            placeholder="Mande instruções para o Squad..." 
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 text-white placeholder-white/30 focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-36 text-sm"
          />
          <div className="absolute right-3 top-3 bottom-3 flex gap-2">
            <button className="bg-primary text-white px-6 rounded-2xl font-bold text-xs hover:bg-primary-container hover:text-primary transition-all">ENVIAR</button>
          </div>
        </div>
      </div>

      {/* Asset Preview Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-surface-container-lowest p-8 rounded-[3rem] border border-black/5 shadow-sm h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-headline font-bold text-lg text-on-surface text-left">Monitor de Output</h4>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
          </div>
          <div className="flex-1 bg-surface-container-low rounded-[2rem] overflow-hidden relative group cursor-pointer ring-1 ring-black/5">
             <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&h=600&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 text-white">
                <button className="bg-white text-black px-6 py-2 rounded-xl font-bold text-xs">Baixar Arte</button>
                <button className="bg-white/20 backdrop-blur px-6 py-2 rounded-xl font-bold text-xs ring-1 ring-white/30">Pedir Ajuste</button>
             </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
              <span>Token Usage</span>
              <span>42%</span>
            </div>
            <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[42%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LinkManagement = () => (
  <div className="space-y-8">
    <div className="mb-12">
      <h1 className="font-headline font-bold text-4xl tracking-tight text-on-surface mb-2">Gestão de Links</h1>
      <p className="text-on-surface-variant font-body">Manage your API credentials and affiliate tracking codes.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      <div className="lg:col-span-8 space-y-6">
        <div className="p-8 rounded-[2.5rem] bg-surface-container-lowest shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Arquitetura de Jornada</span>
            <h2 className="text-3xl font-bold font-headline text-on-surface">Novo Link de Afiliado</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-on-surface-variant block ml-1 font-bold text-[10px] uppercase">URL de Destino</label>
              <input className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/40 text-on-surface" placeholder="https://plataforma.com/produto/..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input className="w-full bg-surface-container-low border-0 rounded-2xl px-4 py-3 text-sm" placeholder="Origem (Source)" />
              <input className="w-full bg-surface-container-low border-0 rounded-2xl px-4 py-3 text-sm" placeholder="Meio (Medium)" />
              <input className="w-full bg-surface-container-low border-0 rounded-2xl px-4 py-3 text-sm" placeholder="Campanha (Name)" />
            </div>
          </div>
          <button className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-headline font-bold text-lg shadow-xl shadow-primary/10 flex items-center justify-center gap-3">
            <Sparkles className="w-5 h-5 fill-current" />
            Gerar Link Rastreável
          </button>
        </div>
      </div>

      <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-secondary font-bold text-sm">+24.8%</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Desempenho Semanal</h3>
            <p className="text-4xl font-black font-headline text-on-surface mt-1">12,482</p>
            <p className="text-xs text-slate-500 mt-2">Total clicks on active links</p>
          </div>
        </div>
        <div className="h-24 w-full mt-6 bg-slate-50 rounded-xl overflow-hidden relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_STATS}>
              <Area type="monotone" dataKey="clicks" stroke="#00236f" fill="#00236f" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const Checklist = () => (
  <div className="space-y-8">
    <div className="mb-12">
      <h1 className="text-4xl font-extrabold text-primary tracking-tighter leading-none mb-2">Checklist de Publicação</h1>
      <p className="text-on-surface-variant font-medium max-w-md">Gerencie a distribuição e o status de publicação dos seus produtos.</p>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
      <div className="xl:col-span-1 bg-surface-container-lowest p-8 rounded-3xl shadow-sm space-y-6">
        <h3 className="font-headline font-bold text-primary flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros Rápidos
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Todos', 'Pendente', 'Concluído', 'Revisão'].map((label, i) => (
            <span key={i} className={cn("px-4 py-1.5 text-xs font-bold rounded-full border cursor-pointer transition-all", i === 0 ? "bg-primary text-white border-primary" : "bg-white text-on-surface-variant border-surface-container-highest hover:border-primary")}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="xl:col-span-2 space-y-4">
        {MOCK_PRODUCTS.map(product => (
          <div key={product.id} className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={product.image} className="w-full h-full object-cover" alt="Product" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase">Aprovado</span>
                  <span className="text-xs text-on-surface-variant font-medium">ID: #{product.id}</span>
                </div>
                <h4 className="text-lg font-extrabold text-primary tracking-tight">{product.title}</h4>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", i < 3 ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-low text-on-surface-variant")}>
                    {i === 1 && <Sparkles className="w-5 h-5" />}
                    {i === 2 && <TrendingUp className="w-5 h-5" />}
                    {i === 3 && <Calendar className="w-5 h-5" />}
                    {i === 4 && <BarChart3 className="w-5 h-5" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="space-y-8">
    <div className="mb-12">
      <h1 className="font-headline font-bold text-4xl tracking-tight text-on-surface mb-2">Conexões Estratégicas</h1>
      <p className="text-on-surface-variant font-body">Configure suas fontes de renda e canais de distribuição para o Squad.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      <div className="lg:col-span-8 space-y-8">
        {/* Marketplaces Section */}
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-primary/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-700">
               <Box className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-xl">Marketplaces (Afiliado)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Amazon Associates', 'Hotmart', 'ClickBank', 'Digistore24'].map(store => (
              <div key={store} className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                <span className="font-bold text-sm text-on-surface">{store}</span>
                <button className="text-[10px] font-black text-primary px-3 py-1 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">CONECTAR</button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-secondary/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-700">
               <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-xl">Redes Sociais (Distribuição)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'TikTok', icon: MessageSquare },
              { name: 'Instagram', icon: ImageIcon },
              { name: 'YouTube', icon: Play },
              { name: 'Pinterest', icon: Search }
            ].map(social => (
              <div key={social.name} className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <social.icon className="w-4 h-4 text-on-surface-variant" />
                  <span className="font-bold text-sm text-on-surface">{social.name}</span>
                </div>
                <button className="text-[10px] font-black text-secondary px-3 py-1 bg-secondary/10 rounded-full group-hover:bg-secondary group-hover:text-white transition-colors">ATIVAR API</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-primary/5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Ouvinte de Webhook Ativo</span>
              <h2 className="font-headline font-bold text-2xl text-on-surface">URL de Recepção de Dados</h2>
            </div>
            <div className="bg-secondary-container/30 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-[10px] font-bold text-on-secondary-container uppercase">Operacional</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4">
            <code className="text-primary font-mono text-sm overflow-x-auto whitespace-nowrap flex-1">https://api.stitch.app/webhook/affiliate</code>
            <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copiar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] border border-primary/5">
             <TrendingUp className="w-8 h-8 text-secondary mb-4" />
             <div className="text-3xl font-headline font-bold text-on-surface">99.9%</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">SLA de Uptime</div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] border border-primary/5">
             <Zap className="w-8 h-8 text-primary mb-4" />
             <div className="text-3xl font-headline font-bold text-on-surface">124ms</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Resposta Média</div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 text-white relative h-fit overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
             <Code className="w-6 h-6 text-primary-container" />
             <h3 className="font-headline font-bold text-lg">Payload JSON</h3>
          </div>
          <pre className="text-[11px] font-mono leading-relaxed bg-black/30 p-4 rounded-xl overflow-x-auto text-slate-300">
{`{
  "produto_id": "AFF-9842-X",
  "titulo": "Executive Planner",
  "price": 89.90,
  "niche": "Productivity",
  "url": "https://stch.io/a/77",
  "copy_tiktok": "High-level tools."
}`}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<View>('analytics');

  const navItems = [
    { id: 'analytics', label: 'Monitor de Ganhos', icon: BarChart3 },
    { id: 'pending', label: 'Radar de Oportunidades', icon: Zap },
    { id: 'agents', label: 'Squad de Agentes', icon: Cpu },
    { id: 'creatives', label: 'Aprovação de Posts', icon: ImageIcon },
    { id: 'links', label: 'Meus Links', icon: LinkIcon },
    { id: 'settings', label: 'Fontes de Dados', icon: Settings2 },
  ];

  return (
    <div className="min-h-screen flex text-on-surface">
      {/* Desktop Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 hidden lg:flex flex-col bg-slate-50 border-r border-slate-100 z-50">
        <div className="p-8">
          <h1 className="text-xl font-black text-primary font-headline uppercase tracking-tighter">The Executive</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Affiliate Platform</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <SidebarItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={currentView === item.id}
              onClick={() => setCurrentView(item.id as View)}
            />
          ))}
        </nav>

        <div className="p-6 border-t border-slate-200 mt-auto">
          <SidebarItem icon={HelpCircle} label="Suporte" onClick={() => {}} />
          <SidebarItem icon={LogOut} label="Sair" onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-surface-container-low">
          <div className="flex items-center justify-between h-20 px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-black/5 hidden md:flex">
                <Search className="w-4 h-4 text-slate-400" />
                <input className="bg-transparent border-0 text-sm focus:ring-0 p-0 w-32" placeholder="Buscar..." />
              </div>
              <h1 className="font-headline font-black text-lg text-primary tracking-tighter sm:block hidden">SQUAD ATIVO</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex flex-col items-end text-right mr-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1 text-[8px]">Squad Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-on-surface">Ativo (6/6)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <NotificationCenter />
                <div className="h-8 w-[1px] bg-slate-200 hidden md:block mx-1"></div>
                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-on-surface leading-none group-hover:text-primary transition-colors">Alex Galdino</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-1 uppercase tracking-tighter">Executive Affiliate</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-container p-[0.5px]">
                    <div className="w-full h-full rounded-[11px] bg-white p-0.5">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop" className="w-full h-full rounded-[9px] object-cover" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* View Container */}
        <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {currentView === 'analytics' && <AnalyticsDashboard />}
              {currentView === 'pending' && <PendingApprovals />}
              {currentView === 'approved' && <ApprovedPosts />}
              {currentView === 'studio' && <CreationStudio />}
              {currentView === 'agents' && <AgentSquadView />}
              {currentView === 'creatives' && <CreativeGallery />}
              {currentView === 'links' && <LinkManagement />}
              {currentView === 'checklist' && <Checklist />}
              {currentView === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="w-full py-12 border-t border-surface-container-low px-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-8">
              {['Privacidade', 'Termos de Serviço', 'Docs API'].map(f => (
                <a key={f} href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">{f}</a>
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">© 2024 The Executive Affiliate. Todos os direitos reservados.</p>
          </div>
        </footer>
      </main>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl flex items-center justify-around px-2 z-[60]">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setCurrentView(item.id as View)}
            className={cn(
              "p-3 rounded-xl transition-all duration-300",
              currentView === item.id ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "text-slate-400"
            )}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>
    </div>
  );
}
