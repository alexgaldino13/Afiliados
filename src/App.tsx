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
  Trophy,
  MapPin,
  Globe,
  X,
  Video,
  Clapperboard
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
  onApprove?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, status, onApprove }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const isApproved = status === 'approved';
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0px_24px_48px_-12px_rgba(25,28,30,0.06)] group transition-all duration-300 relative",
        !isApproved && "hover:translate-y-[-4px]"
      )}
    >
      {showConfetti && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
           <div className="bg-primary/95 text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-sm animate-bounce flex items-center gap-2">
             <Trophy className="w-5 h-5 text-amber-400" /> OPORTUNIDADE APROVADA!
           </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur text-primary text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase">
              {product.category}
            </span>
            {isApproved && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-full border border-white/20 shadow-lg animate-in zoom-in duration-300">
                <CheckCircle2 className="w-3 h-3" />
                APROVADO
              </div>
            )}
            {!isApproved && product.optimizerScore && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-primary text-white text-[9px] font-black rounded-full border border-white/20 shadow-lg">
                <Sparkles className="w-2.5 h-2.5" />
                ROI: {product.optimizerScore}%
              </div>
            )}
          </div>
        </div>
        <div className="md:w-3/5 p-8 flex flex-col justify-between text-left">
          <div>
            {product.spyInsight && (
              <div className="mb-4 bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-secondary" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Spy Intel: {product.spyInsight}</span>
              </div>
            )}
            <div className="flex justify-between items-start mb-2 text-left">
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

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-surface-container-low p-4 rounded-3xl border border-black/5">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-1">ROI Est.</span>
                <span className="text-lg font-black text-secondary">320%</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-3xl border border-black/5">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-1">CPA Ideal</span>
                <span className="text-lg font-black text-on-surface">R$ 14,90</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-slate-100 rounded-3xl border border-black/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Budget p/ Teste (Ads)</span>
                <span className="text-xs font-bold text-primary">R$ 150,00</span>
              </div>
              <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[65%]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8">
            {!isApproved ? (
              <>
                <button 
                  onClick={handleApprove}
                  className="flex-1 bg-gradient-to-br from-secondary to-[#004d34] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-full transition-all active:scale-[0.98] shadow-lg shadow-secondary/20 hover:opacity-90"
                >
                  Aprovar Postagem
                </button>
                <button className="px-6 py-4 border-2 border-error/20 text-error hover:bg-error/5 text-xs font-bold uppercase tracking-widest rounded-full transition-all">
                  Rejeitar
                </button>
              </>
            ) : (
              <button 
                className="flex-1 bg-surface-container-low text-on-surface text-xs font-bold uppercase tracking-widest py-4 rounded-full cursor-default border border-black/5"
              >
                Item na Fila de Postagem
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Views ---

const PendingApprovals = ({ products, onApprove }: { products: any[], onApprove: (id: string) => void }) => {
  const [isSpyActive, setIsSpyActive] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-left">
        <div>
          <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Radar Nexus</h1>
          <p className="text-on-surface-variant font-body mt-1">Oportunidades mineradas e validadas. Ative o Spy para ver dados secretos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIsSpyActive(!isSpyActive);
              if (!isSpyActive) alert('Modo SPY Ativado! Escaneando bibliotecas de anúncios em tempo real...');
            }}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-lg",
              isSpyActive ? "bg-secondary text-white shadow-secondary/20" : "bg-surface-container-low text-on-surface border border-black/5 hover:bg-slate-100"
            )}
          >
            <Eye className="w-4 h-4" />
            {isSpyActive ? 'SPY ATIVO' : 'LIGAR SPY'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm flex justify-between items-center border border-primary/10 relative overflow-hidden">
          {isSpyActive && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-transparent w-1/2 skew-x-[-20deg]"
            />
          )}
          <div>
            <span className="text-[10px] font-black tracking-widest text-primary uppercase block mb-1">Faturamento Estimado</span>
            <span className="font-headline text-3xl font-black text-on-surface">R$ 14.280,00</span>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-black tracking-widest text-secondary uppercase block mb-1">Taxa de Conversão Spy</span>
            <span className="font-headline text-3xl font-black text-secondary">{isSpyActive ? '4.8%' : '---'}</span>
          </div>
        </div>
        <div className="bg-primary p-8 rounded-[2rem] text-white flex flex-col justify-center shadow-lg shadow-primary/20">
          <span className="text-[10px] font-black tracking-widest text-white/50 uppercase block mb-1">Ações Necessárias</span>
          <span className="font-headline text-3xl font-bold">{products.filter(p => p.status === 'pending').length} ITEMS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        {products.map(p => <ProductCard key={p.id} product={p} status={p.status} onApprove={() => onApprove(p.id)} />)}
      </div>
    </div>
  );
};

const ApprovedPosts = ({ approvedItems, onReview, onPublish }: { 
  approvedItems: any[], 
  onReview: (item: any) => void,
  onPublish?: (title: string) => void
}) => {
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishedIds, setPublishedIds] = useState<string[]>([]);

  const handlePublish = (id: string, title: string) => {
    setPublishingId(id);
    // Simulating API call to networks
    setTimeout(() => {
      setPublishingId(null);
      setPublishedIds(prev => [...prev, id]);
      if (onPublish) onPublish(title);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-left">
        <div>
          <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Fila de Publicação</h1>
          <p className="text-on-surface-variant font-body mt-1">Seus criativos aprovados. Prontos para sincronização com as redes.</p>
        </div>
        <div className="flex items-center gap-3 text-left">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-green-50 text-green-700 rounded-2xl font-bold text-sm border border-green-100">
            <ShieldCheck className="w-4 h-4" />
            Protocolo Seguro Ativo
          </button>
        </div>
      </div>

      {approvedItems.length === 0 ? (
        <div className="bg-surface-container-low/50 border-2 border-dashed border-black/5 p-20 rounded-[3rem] text-center">
          <CheckCircle2 className="w-12 h-12 text-on-surface-variant mx-auto mb-6 opacity-20" />
          <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Nenhuma publicação aprovada</h3>
          <p className="text-sm text-on-surface-variant max-w-sm mx-auto">Vá até a Galeria de Criativos e aprove as artes geradas pelo Squad para que elas apareçam aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
          {approvedItems.map((item, i) => {
            const isPublishing = publishingId === item.id;
            const isPublished = publishedIds.includes(item.id);

            return (
              <div key={item.id || i} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm relative overflow-hidden group">
                {isPublished && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center animate-in fade-in duration-500">
                    <div className="bg-green-500 text-white px-8 py-4 rounded-3xl shadow-xl font-headline font-black text-lg flex items-center gap-3 animate-bounce">
                      <CheckCircle2 className="w-6 h-6" /> PUBLICADO!
                    </div>
                  </div>
                )}
                
                <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-bl-[5rem] -mr-6 -mt-6 transition-transform group-hover:scale-110">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                
                <div className="flex gap-4 mb-6">
                  <img src={item.image} className="w-20 h-24 object-cover rounded-2xl ring-1 ring-black/5" />
                  <div className="text-left">
                    <h3 className="font-headline font-bold text-xl mb-1 text-on-surface">{item.title}</h3>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.agent}</span>
                  </div>
                </div>
                
                {/* Compliance Checklist */}
                <div className="bg-surface-container-low p-6 rounded-3xl space-y-3 mb-6 border border-black/5 text-left">
                  <h4 className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-4">Canais de Distribuição</h4>
                  <div className="flex gap-2 mb-4">
                    {['TikTok', 'Instagram', 'Google'].map(network => (
                      <button key={network} className="flex-1 py-2 bg-white border border-black/5 rounded-xl text-[10px] font-black text-primary hover:bg-primary hover:text-white transition-all">
                        {network}
                      </button>
                    ))}
                  </div>
                  
                  <h4 className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-4">Configuração de Campanha (Ads)</h4>
                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-primary/10">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-on-surface">Orçamento Sugerido</span>
                    </div>
                    <span className="text-sm font-black text-primary">R$ 50,00 / dia</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="p-2 bg-slate-50 rounded-xl border border-black/5">
                      <p className="text-[8px] font-black text-slate-400 uppercase">CPA Alvo</p>
                      <p className="text-xs font-bold text-on-surface">R$ 12,40</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-black/5">
                      <p className="text-[8px] font-black text-slate-400 uppercase">ROAS Est.</p>
                      <p className="text-xs font-bold text-green-600">3.2x</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handlePublish(item.id, item.title)}
                    disabled={isPublishing || isPublished}
                    className={cn(
                      "flex-1 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all",
                      isPublishing 
                        ? "bg-slate-200 text-slate-500 cursor-wait" 
                        : "bg-primary text-white shadow-primary/20 hover:opacity-90 active:scale-95"
                    )}
                  >
                    {isPublishing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        SINCRONIZANDO...
                      </div>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4" />
                        Aprovar & Publicar
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => onReview(item)}
                    className="px-6 py-4 bg-surface-container-low text-on-surface font-bold rounded-2xl text-sm hover:bg-slate-100 transition-colors"
                  >
                    Revisar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const NexusAssistant = ({ onNavigate }: { onNavigate: (view: View) => void }) => {
  const [step, setStep] = useState<'invite' | 'scout' | 'strategist' | 'creative' | 'seo' | 'final'>('invite');
  const [niche, setNiche] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const nextStepMap = {
    'invite': 'scout',
    'scout': 'strategist',
    'strategist': 'creative',
    'creative': 'seo',
    'seo': 'final',
    'final': 'invite'
  };

  const handleNext = () => {
    setStep(nextStepMap[step] as any);
  };

  const finalSummary = `
📌 **PRODUTO:** ${selectedProduct?.name || 'Câmera Retrô 4K'} (${selectedProduct?.platform || 'Amazon'})
💰 **COMISSÃO:** ${selectedProduct?.commission || '8%'}
🎯 **ESTRATÉGIA:** ${selectedProduct?.name === 'Mixer Portátil Pro' ? 'Foco em rotina saudável e praticidade (Reels/TikTok)' : 'Foco em aesthetic "Old Money" (TikTok/Reels)'}

---
✍️ **LEGENDA AIDA:**
${selectedProduct?.name === 'Mixer Portátil Pro' 
  ? 'Cansado de mixers fracos que não aguentam nada? 🌪️\nConheça a potência que cabe na sua bolsa. O Mixer Portátil Pro foi feito para quem não abre mão da praticidade.\nPegue o seu com desconto exclusivo no link da bio! ✨ #mixerportatil #cozinha #fitness'
  : 'Você já sentiu que suas fotos digitais estão perdendo a alma? 📸\nPare de acumular arquivos e comece a colecionar momentos reais. A Câmera Retrô 4K une a nostalgia do filme.\nÚltimas unidades com o link de desconto na bio! ⏳ #retro #aesthetic'}

🖼️ **PROMPT IA:**
${selectedProduct?.name === 'Mixer Portátil Pro'
  ? 'cinematic unboxing of a sleek portable mixer, juice swirling inside, kitchen aesthetic, bright morning light, 4k --ar 9:16'
  : 'cinematic shot of a vintage digital camera on a wooden table, warm sunlight, soft bokeh background, 4k --ar 9:16'}

📈 **SEO & TAGS:**
Keywords: ${selectedProduct?.name === 'Mixer Portátil Pro' ? 'melhor mixer portátil 2026, cozinha prática, shake academia' : 'melhor câmera digital retrô 2026, fotos aesthetic, gadgets fotografia'}.
Tags: ${selectedProduct?.name === 'Mixer Portátil Pro' ? '#mixerportatil #cozinhapratica #fitlife #achadinhos' : '#fotografiaretrô #aestheticvibes #achadinhosamazon #techbrasil'}.
  `;

  return (
    <div className="bg-slate-950 rounded-[3rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden mb-12 border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <Sparkles className="w-80 h-80 text-primary" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'invite' && (
            <motion.div 
              key="invite"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/30 shadow-lg shadow-primary/10">
                <Cpu className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-6xl font-black text-white mb-8 font-headline tracking-tighter leading-tight">
                Nexus Orchestrator
              </h2>
              <p className="text-xl lg:text-2xl text-white/70 mb-12 font-body leading-relaxed max-w-3xl mx-auto">
                Olá! Sou o Nexus. Estou pronto para minerar as melhores oportunidades de afiliados para você. <br/>
                Para começarmos: <span className="text-white font-bold underline decoration-primary underline-offset-4">qual é o NICHO de hoje</span> ou você já tem um <span className="text-white font-bold underline decoration-secondary underline-offset-4">PRODUTO</span> em mente?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                <input 
                  type="text" 
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Ex: Cozinha, Gadgets, Pets..." 
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-8 py-5 text-white focus:ring-2 focus:ring-primary outline-none text-xl font-bold"
                />
                <button 
                  onClick={handleNext}
                  className="w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  MINERAR <Zap className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'scout' && (
            <motion.div 
              key="scout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-8">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-4 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                    <Search className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white font-headline leading-tight">🔎 AGENTE SCOUT</h3>
                    <p className="text-white/50 text-sm font-bold uppercase tracking-widest mt-1">Radar de Oportunidades: {niche || 'Geral'}</p>
                  </div>
                </div>
                <div className="hidden lg:block text-right">
                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">Status do Escaneamento</span>
                   <span className="text-white font-bold">100% CONCLUÍDO</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                <table className="w-full text-left text-white/90">
                  <thead className="bg-white/5">
                    <tr className="text-[10px] font-black uppercase tracking-widest text-white/40">
                      <th className="py-6 px-8">Produto Campeão</th>
                      <th className="py-6 px-4">Plataforma</th>
                      <th className="py-6 px-4">Comissão %</th>
                      <th className="py-6 px-8">Por que vender agora?</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {(niche.toLowerCase().includes('cozinha') || niche.toLowerCase().includes('mixer')) ? (
                      [
                        { name: 'Mixer Portátil Pro', platform: 'Hotmart', commission: '40%', reason: 'Alta conversão em anúncios de rotina' },
                        { name: 'Fritadeira Air-Ultra', platform: 'Amazon', commission: '10%', reason: 'Nicho lifestyle saudável' },
                        { name: 'Conjunto de Facas Chef', platform: 'Amazon', commission: '12%', reason: 'Público apaixonado por culinária' }
                      ].map((p, i) => (
                        <tr 
                          key={i} 
                          onClick={() => setSelectedProduct(p)}
                          className={cn(
                            "border-b border-white/5 transition-all cursor-pointer group relative",
                            selectedProduct?.name === p.name ? "bg-primary/20 scale-[1.01] z-10" : "hover:bg-white/10"
                          )}
                        >
                          <td className="py-6 px-8 font-black text-lg group-hover:text-primary transition-colors flex items-center gap-3">
                            {selectedProduct?.name === p.name && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                            {p.name}
                          </td>
                          <td className="py-6 px-4"><span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black">{p.platform}</span></td>
                          <td className="py-6 px-4 font-black text-amber-500 text-lg">{p.commission}</td>
                          <td className="py-6 px-8 text-white/50 italic leading-relaxed">
                            {p.reason}
                            {selectedProduct?.name === p.name && (
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-primary text-white text-[9px] font-black px-2 py-1 rounded-lg animate-in fade-in slide-in-from-right-2">
                                SELECIONADO
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      [
                        { name: 'Câmera Retrô 4K', platform: 'Amazon', commission: '8%', reason: 'Trending no TikTok UK / Gap no BR' },
                        { name: 'Mixer Portátil Pro', platform: 'Hotmart', commission: '40%', reason: 'Alta conversão em anúncios de rotina' },
                        { name: 'Planner Executivo 2026', platform: 'Braip', commission: '50%', reason: 'Nicho organizacional em escala' }
                      ].map((p, i) => (
                        <tr 
                          key={i} 
                          onClick={() => setSelectedProduct(p)}
                          className={cn(
                            "border-b border-white/5 transition-all cursor-pointer group relative",
                            selectedProduct?.name === p.name ? "bg-primary/20 scale-[1.01] z-10" : "hover:bg-white/10"
                          )}
                        >
                          <td className="py-6 px-8 font-black text-lg group-hover:text-primary transition-colors flex items-center gap-3">
                            {selectedProduct?.name === p.name && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                            {p.name}
                          </td>
                          <td className="py-6 px-4"><span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black">{p.platform}</span></td>
                          <td className="py-6 px-4 font-black text-amber-500 text-lg">{p.commission}</td>
                          <td className="py-6 px-8 text-white/50 italic leading-relaxed">
                            {p.reason}
                            {selectedProduct?.name === p.name && (
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-primary text-white text-[9px] font-black px-2 py-1 rounded-lg animate-in fade-in slide-in-from-right-2">
                                SELECIONADO
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left">
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary" fill="currentColor" /> 👉 PRÓXIMO PASSO
                </h4>
                {selectedProduct ? (
                  <div className="mb-6 p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-between animate-in zoom-in duration-300">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                          <Target className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="text-[10px] text-primary font-black uppercase tracking-widest">Produto Selecionado</p>
                         <p className="text-white font-bold text-lg leading-none">{selectedProduct.name}</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedProduct(null)} className="text-[10px] font-black text-white/40 hover:text-white transition-colors">LIMPAR</button>
                  </div>
                ) : (
                  <p className="text-white/40 text-xs font-bold mb-6 italic">Clique em um produto da tabela para iniciar a orquestração.</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleNext} 
                    disabled={!selectedProduct}
                    className={cn(
                      "px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg",
                      selectedProduct 
                        ? "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95" 
                        : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                    )}
                  >
                    DEFINIR ESTRATÉGIA <Target className="w-4 h-4" />
                  </button>
                  <button onClick={() => setStep('invite')} className="bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all">
                    AJUSTAR NICHO
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'strategist' && (
            <motion.div 
              key="strategist"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4 text-left border-b border-white/10 pb-8">
                <div className="p-4 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white font-headline leading-tight">🎯 AGENTE STRATEGIST</h3>
                  <p className="text-white/50 text-sm font-bold uppercase tracking-widest mt-1">Mapeamento para: {selectedProduct?.name || 'Geral'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 text-left">
                  <h4 className="text-primary font-black text-[12px] uppercase tracking-widest mb-6 px-4 py-1 bg-primary/10 w-fit rounded-full">Público-Alvo</h4>
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <strong className="text-white block text-lg mb-2">😫 Dores</strong>
                      <p className="text-white/60 text-sm leading-relaxed">Sente que as fotos digitais não têm personalidade e quer algo tangível.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <strong className="text-white block text-lg mb-2">✨ Desejos</strong>
                      <p className="text-white/60 text-sm leading-relaxed">Busca status através da estética "Vintage/Retro" e exclusividade visual.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 text-left">
                  <h4 className="text-secondary font-black text-[12px] uppercase tracking-widest mb-6 px-4 py-1 bg-secondary/10 w-fit rounded-full">Canais Estratégicos</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">TikTok (Organic)</p>
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Vídeo Curto / Trend</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-green-400">95% MATCH</span>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 via-purple-600 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">Instagram (Reels)</p>
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Aesthetic / Lifestyle</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-green-400">89% MATCH</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left">
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary" fill="currentColor" /> 👉 PRÓXIMO PASSO
                </h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleNext} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    GERAR CRIATIVOS <Zap className="w-4 h-4 text-white" fill="currentColor" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'creative' && (
            <motion.div 
              key="creative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4 text-left border-b border-white/10 pb-8">
                <div className="p-4 bg-purple-500 rounded-2xl text-white shadow-lg shadow-purple-500/20">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white font-headline leading-tight">✍️ AGENTE CREATIVE</h3>
                  <p className="text-white/50 text-sm font-bold uppercase tracking-widest mt-1">Geração de Copy para {selectedProduct?.name || 'seu produto'}</p>
                </div>
              </div>

              <div className="space-y-8 text-left">
                <div>
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span> Legenda de Alta Conversão (Modelo AIDA)
                  </label>
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 relative group hover:border-primary/30 transition-all">
                    <p className="text-white/80 text-lg leading-relaxed font-medium italic">
                      {selectedProduct?.name === 'Mixer Portátil Pro' ? (
                        <>
                          "Cansado de mixers fracos que não aguentam nada? 🌪️ <br/><br/>
                          Conheça a potência que cabe na sua bolsa. O Mixer Portátil Pro foi feito para quem não abre mão da praticidade, seja na academia ou no escritório. 💪 <br/><br/>
                          Pegue o seu com desconto exclusivo no link da bio! ✨ #mixerportatil #cozinha #fitness"
                        </>
                      ) : (
                        <>
                          "Você já sentiu que suas fotos digitais estão perdendo a alma? 📸 <br/><br/>
                          Pare de acumular arquivos e comece a colecionar momentos reais. A {selectedProduct?.name || 'Câmera Retrô 4K'} une a nostalgia do filme com a tecnologia que você precisa hoje. ✨ <br/><br/>
                          Últimas unidades com o link de desconto na bio! ⏳ #retro #aesthetic"
                        </>
                      )}
                    </p>
                    <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-xl hover:bg-primary transition-colors hover:scale-110 active:scale-95">
                      <Copy className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                     <span className="w-2 h-2 bg-secondary rounded-full"></span> Prompt Estruturado para IA (Flux/Midjourney)
                  </label>
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 font-mono text-sm text-slate-300 leading-relaxed">
                    <code>
                      {selectedProduct?.name === 'Mixer Portátil Pro' 
                        ? `cinematic unboxing of a sleek portable mixer, juice swirling inside, kitchen aesthetic, bright morning light, 4k, minimalist design --ar 9:16`
                        : `cinematic shot of a vintage digital camera on a wooden table, warm golden hour sunlight, soft bokeh background, 4k, hyper-realistic, instagram aesthetic, high quality design --ar 9:16`
                      }
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left">
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">👉 PRÓXIMO PASSO</h4>
                <div className="flex gap-4">
                  <button onClick={handleNext} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    SINCRO DE SEO <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'seo' && (
            <motion.div 
              key="seo"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4 text-left border-b border-white/10 pb-8">
                <div className="p-4 bg-green-500 rounded-2xl text-white shadow-lg shadow-green-500/20">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white font-headline leading-tight">📈 AGENTE SEO</h3>
                  <p className="text-white/50 text-sm font-bold uppercase tracking-widest mt-1">Otimização de Retenção & Busca</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <h4 className="text-white font-black text-[12px] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Search className="w-4 h-4 text-primary" /> Keywords de Cauda Longa
                  </h4>
                  <div className="space-y-3">
                    {[
                      'melhor câmera digital retrô 2026',
                      'como tirar fotos aesthetic 2026',
                      'gadgets de fotografia para iniciantes',
                      'unboxing câmera retrô amazon brasil',
                      'filtro de filme em camera digital pro'
                    ].map((kw, i) => (
                      <div key={i} className="text-sm text-white/50 py-3 border-b border-white/5 hover:text-white transition-colors cursor-default">• {kw}</div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <h4 className="text-white font-black text-[12px] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-secondary" /> Hashtags de Alta Relevância
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['#fotografiaretrô', '#aestheticvibes', '#achadinhosamazon', '#techbrasil', '#unboxingbrasil', '#videography', '#vintagevibes', '#affiliatemarketing'].map((tag, i) => (
                      <span key={i} className="bg-primary/20 text-primary px-4 py-2 rounded-full text-xs font-black border border-primary/20 hover:bg-primary hover:text-white transition-colors cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-10 rounded-[3rem] border border-primary/20 text-center">
                <h3 className="text-2xl font-black text-white mb-4 font-headline">Validação Final Estratégica</h3>
                <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto italic font-body">"Deseja aprovar esta oportunidade ou ajustar algum detalhe?"</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={handleNext} className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                    APROVAR OPORTUNIDADE
                  </button>
                  <button onClick={() => setStep('invite')} className="bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all">
                    AJUSTAR DETALHES
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'final' && (
            <motion.div 
              key="final"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="text-center">
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 font-headline tracking-tighter">Missão Concluída!</h2>
                <p className="text-white/50 text-lg font-body max-w-xl mx-auto">Sua oportunidade foi validada e está sendo processada pelo Squad. Confira o plano de ação:</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                <div className="bg-surface-container-highest/10 p-8 rounded-[2.5rem] border border-white/10 relative group">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FileCode className="w-4 h-4" /> Resumo Estratégico
                  </h4>
                  <pre className="text-xs font-mono text-white/80 leading-relaxed whitespace-pre-wrap bg-black/40 p-6 rounded-2xl border border-white/5 overflow-y-auto max-h-96">
                     {finalSummary}
                  </pre>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(finalSummary);
                      alert('Copiado para a área de transferência!');
                    }}
                    className="absolute top-12 right-12 bg-primary text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-secondary font-black text-[10px] uppercase tracking-widest mb-8 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Automação Agendada
                    </h4>
                    <div className="space-y-8">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xs shrink-0">1</div>
                        <div>
                          <p className="text-white font-bold text-sm">Geração de Creative Assets</p>
                          <p className="text-white/40 text-[10px] mt-1 italic">O Designer Squad está renderizando 5 variações em 4K no momento.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-black text-xs shrink-0">2</div>
                        <div>
                          <p className="text-white font-bold text-sm">Distribuição Multi-canal</p>
                          <p className="text-white/40 text-[10px] mt-1">Sincronização agendada para Google Labs e TikTok Ads Manager em 2h.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-black text-xs shrink-0">3</div>
                        <div>
                          <p className="text-white font-bold text-sm">Monitoramento de ROI</p>
                          <p className="text-white/40 text-[10px] mt-1">Primeiro relatório de performance esperado para amanhã às 08:30.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-4">
                    <button onClick={() => onNavigate('creatives')} className="bg-secondary text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                      VER CRIATIVOS <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onNavigate('analytics')} className="bg-white/10 text-white py-4 rounded-2xl font-black text-xs hover:bg-white/20 transition-all">
                      PAINEL DE MÍDIA
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 text-center border-t border-white/10">
                 <button onClick={() => setStep('invite')} className="text-white/40 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                   Iniciar Nova Orquestração Global
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const AnalyticsDashboard = ({ onNavigate, stats }: { onNavigate: (view: View) => void, stats: { links: number, approved: number } }) => (
  <div className="space-y-8">
    <NexusAssistant onNavigate={onNavigate} />
    
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Painel de Controle</h1>
        <p className="text-on-surface-variant font-body mt-1">Otimização técnica e orquestração de bônus.</p>
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
          <h3 className="font-headline font-bold text-2xl text-on-surface mb-2">Fluxo de Trabalho</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-secondary/5 p-3 rounded-2xl border border-secondary/10 flex items-start gap-3">
              <Eye className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <div>
                <p className="text-[11px] font-bold text-on-surface leading-tight">Sugestão: 12 novos criativos aguardam sua aprovação hoje.</p>
              </div>
            </div>
            <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="text-[11px] font-bold text-on-surface leading-tight">ROI Tracker: Posts aprovados geraram R$ 1.200 extras em 24h.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
             {[
               { step: '1', label: 'Radar', desc: 'Ver Oportunidades', view: 'pending' },
               { step: '2', label: 'Gerar', desc: 'Orquestrador IA', view: 'agents' },
               { step: '3', label: 'Criativos', desc: 'Aprovar Imagens', view: 'creatives' },
               { step: '4', label: 'Links', desc: 'Gerir Rastreadores', view: 'links' },
             ].map((s, i) => (
               <button 
                key={i} 
                onClick={() => onNavigate(s.view as View)}
                className="bg-surface-container-low p-4 rounded-2xl border border-black/5 text-left hover:bg-primary/5 hover:border-primary/20 transition-all hover:translate-y-[-2px] active:scale-[0.98]"
               >
                 <span className="text-[10px] font-black text-primary bg-primary/10 w-5 h-5 flex items-center justify-center rounded-full mb-2">{s.step}</span>
                 <p className="text-xs font-bold text-on-surface">{s.label}</p>
                 <p className="text-[10px] text-on-surface-variant font-medium">{s.desc}</p>
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>

    {/* Quick Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Publicações Ativas', value: stats.approved, trend: '+3', icon: Zap, color: 'bg-primary', view: 'approved' },
        { label: 'Links de Tracking', value: stats.links, trend: 'Novo', icon: LinkIcon, color: 'bg-secondary', view: 'links' },
        { label: 'Cliques Totais', value: '184.2k', trend: '+24.8%', icon: TrendingUp, color: 'bg-primary-container text-on-primary-container', view: 'analytics' },
        { label: 'Resultado Est.', value: 'R$ 42.190', trend: '+15.2%', icon: BarChart3, color: 'bg-secondary-container text-on-secondary-container', view: 'analytics' },
      ].map((stat, i) => (
        <button 
          key={i} 
          onClick={() => onNavigate(stat.view as View)}
          className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-black/5 text-left hover:scale-[1.02] transition-transform"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-2xl text-white", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-secondary font-black text-xs">{stat.trend}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black font-headline text-on-surface mt-1">{stat.value}</h3>
          </div>
        </button>
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

const NotificationCenter = ({ notifications }: { notifications?: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const items = notifications || MOCK_NOTIFICATIONS;
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
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">{items.length} NOVAS</span>
              </div>
              <div className="space-y-4">
                {items.map((notif: any) => (
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
                      <span className="text-[10px] text-on-surface-variant font-medium mt-1 inline-block">{notif.time}</span>
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

const AgentSquadView = ({ onMissionComplete, onNavigate }: { onMissionComplete: (item: any) => void, onNavigate: (view: any) => void }) => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div>
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Orquestrador de Missões</h1>
        <p className="text-on-surface-variant font-body mt-1">Sua força tarefa de IA pronta para orquestrar novos ativos.</p>
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
        <h3 className="font-headline font-bold text-lg text-on-surface ml-2">SQUAD Especializado</h3>
        {MOCK_AGENTS.map((agent) => (
          <div key={agent.id} className="bg-surface-container-lowest p-5 rounded-3xl border border-black/5 shadow-sm hover:border-primary/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-3">
              <img src={agent.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
              <div>
                <h4 className="font-bold text-on-surface leading-tight text-left">{agent.name}</h4>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-left">{agent.role}</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed text-left">{agent.goal}</p>
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
            <div className="text-left">
              <h3 className="font-headline font-bold text-xl text-on-surface">Orquestração Global</h3>
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
          <div className="space-y-4 text-left">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block ml-2 text-left">Resumo da Missão</label>
            <div className="relative group">
              <textarea 
                className="w-full bg-surface-container-low border-0 rounded-3xl px-8 py-6 focus:ring-2 focus:ring-primary/20 text-on-surface min-h-[120px] resize-none transition-all group-hover:bg-surface-container-high font-medium"
                placeholder="Ex: Encontrar e preparar campanha para produto de Saúde Natural com foco em TikTok..."
              />
              <div className="absolute right-4 bottom-4">
                <Sparkles className="w-5 h-5 text-primary opacity-30" />
              </div>
            </div>
          </div>

          <button 
            id="agent-mission-btn"
            onClick={() => {
              const btn = document.getElementById('agent-mission-btn');
              if (btn) {
                btn.innerHTML = '<span class="animate-spin flex items-center gap-2"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v4m0 12v4M2 12h4m12 0h4"></path></svg> Orquestrando...</span>';
                btn.style.opacity = '0.7';
                btn.style.pointerEvents = 'none';
                setTimeout(() => {
                  const newId = Math.random().toString(36).substr(2, 9);
                  onMissionComplete({
                    id: newId,
                    title: 'New Mission Asset ' + newId.substr(0, 4),
                    type: 'TikTok Ad',
                    image: 'https://images.unsplash.com/photo-1512446816042-444d641267d4?q=80&w=400&h=600&auto=format&fit=crop',
                    status: 'Ready',
                    agent: 'Chief of Staff',
                    isVideo: true
                  });
                  btn.innerHTML = 'Missão Concluída! <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>';
                  btn.className = "w-full bg-green-500 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-500/20";
                  
                  setTimeout(() => {
                    if (confirm('Missão concluída pelo Squad! Você quer ver o novo criativo na galeria?')) {
                      onNavigate('creatives');
                    }
                    btn.innerHTML = 'Lançar Nova Missão <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"></path></svg>';
                    btn.className = "w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all";
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                  }, 1000);
                }, 2000);
              }
            }}
            className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Lançar Missão de Orquestração <Play className="w-5 h-5 fill-current" />
          </button>

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

const CreativeCard = ({ creative, onApprove, onReject, onView }: { creative: any, onApprove: (id: string) => void, onReject: (id: string) => void, onView: (creative: any) => void }) => {
  const [isApproved, setIsApproved] = useState(creative.status === 'Approved');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Confira esse item: ${creative.title}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = () => {
    setIsApproved(true);
    onApprove(creative.id);
  };

  return (
    <div className="group bg-surface-container-lowest rounded-[2.5rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img src={creative.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
        
        {creative.isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
               <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/20">{creative.type}</span>
          {creative.isVideo && (
            <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1">
              <Clapperboard className="w-3 h-3" /> Vídeo
            </span>
          )}
        </div>
        
        {isApproved && (
          <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
          <div className="flex gap-4">
            <button 
              onClick={() => onView(creative)}
              className="flex-1 py-3 bg-white text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors active:scale-95 transform"
            >
              <Eye className="w-4 h-4" />
              Ver
            </button>
            <button 
              onClick={handleCopy}
              className="p-3 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/40 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="text-left">
            <h3 className="font-bold text-on-surface leading-tight text-lg mb-1">{creative.title}</h3>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">{creative.agent}</span>
          </div>
          <div className={cn(
            "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
            isApproved ? 'bg-green-100 text-green-700' : 
            creative.status === 'Ready' ? 'bg-green-50 text-green-600' : 'bg-amber-100 text-amber-700'
          )}>
            {isApproved ? 'Agendado' : creative.status}
          </div>
        </div>

        <div className="flex gap-2">
          {!isApproved ? (
            <>
              <button 
                onClick={handleApprove}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <Check className="w-3.5 h-3.5" />
                Aprovar
              </button>
              <button 
                onClick={() => onReject(creative.id)}
                className="px-4 py-3 border border-error/20 text-error rounded-xl text-xs font-bold hover:bg-error/5 transition-colors"
              >
                Rejeitar
              </button>
            </>
          ) : (
            <button 
              disabled
              className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-green-100"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sincronizado com ADS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CreativeGallery = ({ creatives, onApprove, onReject, onNavigate }: { 
  creatives: any[], 
  onApprove: (id: string) => void, 
  onReject: (id: string) => void,
  onNavigate: (view: any) => void 
}) => {
  const [previewItem, setPreviewItem] = useState<any>(null);

  return (
    <div className="space-y-8">
      {/* Absolute Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
              onClick={() => setPreviewItem(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-surface-container-lowest w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[85vh]"
            >
              <button 
                onClick={() => setPreviewItem(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/20 text-white backdrop-blur rounded-full flex items-center justify-center hover:bg-black/40 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="md:w-1/2 h-1/2 md:h-auto relative bg-slate-100">
                <img src={previewItem.image} className="w-full h-full object-cover" alt="" />
                {previewItem.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                     <div className="w-24 h-24 bg-white/10 backdrop-blur-3xl rounded-full flex items-center justify-center border border-white/20">
                        <Play className="w-12 h-12 text-white fill-current ml-2" />
                     </div>
                     <div className="absolute bottom-10 left-10 right-10">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-1/3"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-white/60">
                           <span>0:12</span>
                           <span>0:45</span>
                        </div>
                     </div>
                  </div>
                )}
              </div>
              
              <div className="md:w-1/2 p-10 flex flex-col justify-between overflow-y-auto text-left">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">{previewItem.type}</span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black rounded-full uppercase tracking-widest">{previewItem.agent}</span>
                    {previewItem.isVideo && (
                       <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1">
                         <Video className="w-3 h-3" /> 4K Ultra HD
                       </span>
                    )}
                  </div>
                  <h2 className="text-4xl font-headline font-black text-on-surface mb-6 leading-tight">{previewItem.title}</h2>
                  <p className="text-on-surface-variant font-body leading-relaxed mb-8">
                    {previewItem.isVideo ? 
                      "Este vídeo foi montado com cortes rápidos e trilha viral do TikTok. O Squad utilizou IA para sincronizar os beats e adicionar legendas dinâmicas de alta retenção." :
                      `Este criativo foi otimizado para conversão no ${previewItem.type}. O Squad utilizou gatilhos mentais de escassez e exclusividade para maximizar o CTR médio de 4.2%.`
                    }
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-surface-container-low rounded-2xl border border-black/5">
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Copy Sugerido</p>
                       <p className="text-sm font-medium italic">"Menos é tudo. ✨ Conheça o design que vai organizar sua rotina sem poluir seu espaço."</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  <button 
                    onClick={() => { onApprove(previewItem.id); setPreviewItem(null); }}
                    className="flex-1 min-w-[200px] bg-primary text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" /> APROVAR AGORA
                  </button>
                  <button 
                    onClick={() => alert('Sincronizando peça para Google Labs Campaigns...')}
                    className="flex-1 min-w-[200px] bg-secondary text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Globe className="w-5 h-5" /> SYNC GOOGLE LABS
                  </button>
                  <button className="px-8 py-4 bg-surface-container-low text-on-surface-variant rounded-2xl font-black text-sm hover:bg-surface-container-high transition-colors">
                    BAIXAR
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="text-left">
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
        <AnimatePresence mode="popLayout">
          {creatives.map((creative) => (
            <motion.div
              key={creative.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full"
            >
              <CreativeCard 
                creative={creative} 
                onApprove={onApprove} 
                onReject={onReject} 
                onView={setPreviewItem}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Empty State / Add New */}
        <div 
          onClick={() => onNavigate('studio')}
          className="border-4 border-dashed border-surface-container-high rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-primary/30 transition-colors min-h-[400px]"
        >
          <div className="p-4 bg-surface-container-low rounded-3xl group-hover:bg-primary/10 transition-colors mb-4">
            <ImageIcon className="w-8 h-8 text-on-surface-variant group-hover:text-primary" />
          </div>
          <h4 className="font-bold text-on-surface mb-2">Solicitar Novo Criativo</h4>
          <p className="text-xs text-on-surface-variant max-w-[200px]">Ative o Squad para gerar novos designs e posts.</p>
        </div>
      </div>
    </div>
  );
};

const CreationStudio = () => {
  const [messages, setMessages] = useState([
    { role: 'agent', name: 'Spy & Scout', type: 'primary', content: 'Detectei uma nova tendência de **"Home Refresh"** que está explodindo no TikTok. O produto **Minimalist Watch** combina perfeitamente com esse estilo *Clean Girl*. Gere sugestões de copy focadas em Minimalismo?', icon: Sparkles },
    { role: 'user', name: 'Alex Galdino', type: 'user', content: 'Excelente sacada! Crie 3 variações de script para esse nicho. Foque em organização e estética.', icon: User },
    { role: 'agent', name: 'Copywriter Agente', type: 'secondary', content: 'Processando variações psicográficas focadas em remover a fricção de compra...', icon: Cpu }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', name: 'Alex Galdino', type: 'user', content: input, icon: User };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = { 
        role: 'agent', 
        name: 'Chief of Staff', 
        type: 'primary', 
        content: `Entendido. Orquestrando o Squad para: "${input}". Em instantes as variações aparecerão no Monitor de Output.`, 
        icon: Sparkles 
      };
      setMessages(prev => [...prev, resp]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="text-left">
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
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
                  msg.type === 'user' ? "flex-row-reverse text-right" : "text-left"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-transform hover:scale-110",
                  msg.type === 'user' ? "bg-white/10 text-white border-white/10" : 
                  msg.type === 'secondary' ? "bg-secondary/20 text-secondary border-secondary/20" : "bg-primary/20 text-primary border-primary/20"
                )}>
                  <msg.icon className="w-5 h-5" />
                </div>
                <div className={cn(
                  "p-6 rounded-[2.5rem] shadow-xl border",
                   msg.type === 'user' ? "bg-primary text-white rounded-tr-none border-primary/20" : 
                   "bg-white/5 backdrop-blur-xl text-white/90 rounded-tl-none border-white/10 max-w-[85%]"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      msg.type === 'secondary' ? "text-secondary" : msg.type === 'primary' ? "text-primary" : "text-white/60"
                    )}>{msg.name}</span>
                  </div>
                  <p className="text-sm leading-relaxed font-body">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-4 text-left">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-200"></div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative mt-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Mande instruções para o Squad..." 
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 text-white placeholder-white/30 focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-36 text-sm"
            />
            <div className="absolute right-3 top-3 bottom-3 flex gap-2">
              <button 
                onClick={handleSend}
                className="bg-primary text-white px-6 rounded-2xl font-bold text-xs hover:bg-primary-container hover:text-primary transition-all active:scale-95"
              >
                ENVIAR
              </button>
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
            <div className="flex-1 bg-surface-container-low rounded-[2rem] overflow-hidden relative group cursor-pointer ring-1 ring-black/5 min-h-[300px]">
               <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&h=600&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 text-white">
                  <button 
                    onClick={() => alert('Download do asset iniciado com alta resolução...')}
                    className="bg-white text-black px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-100 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" /> Baixar Arte
                  </button>
                  <button 
                    onClick={() => alert('Solicitação de ajuste enviada ao Designer Squad!')}
                    className="bg-white/20 backdrop-blur px-6 py-2 rounded-xl font-bold text-xs ring-1 ring-white/30 hover:bg-white/30 active:scale-95 transition-all"
                  >
                    Pedir Ajuste
                  </button>
               </div>
            </div>
            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                <span>Engenharia de Prompt</span>
                <span>88% OTIMIZADO</span>
              </div>
              <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[88%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkManagement = ({ links, onAddLink }: { links: any[], onAddLink: (link: any) => void }) => {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  
  const handleGenerate = () => {
    if (!url) {
      alert('Insira a URL de destino.');
      return;
    }
    const newLink = {
      id: Math.random().toString(36).substr(2, 9),
      url: `${url}?utm_source=${source || 'nexus'}&utm_medium=orchestrator&utm_campaign=launch`,
      target: url,
      clicks: 0,
      createdAt: new Date().toLocaleTimeString()
    };
    onAddLink(newLink);
    setUrl('');
    setSource('');
    alert('Sucesso! Link de afiliado gerado com rastreamento UTM completo.');
  };

  return (
    <div className="space-y-8 text-left">
      <div className="mb-12">
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface mb-2">Gestão de Links</h1>
        <p className="text-on-surface-variant font-body">Gerencie suas credenciais de API e códigos de rastreamento de afiliados.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-surface-container-lowest shadow-sm space-y-6 border border-primary/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Arquitetura de Jornada</span>
              <h2 className="text-3xl font-black font-headline text-on-surface">Novo Link Inteligente</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-on-surface-variant block ml-1 font-bold text-[10px] uppercase">URL de Destino (Afiliado)</label>
                <input 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/40 text-on-surface font-medium" 
                  placeholder="https://plataforma.com/produto/..." 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-surface-container-low border-0 rounded-2xl px-4 py-3 text-sm" 
                  placeholder="Origem (ex: TikTok)" 
                />
                <input className="w-full bg-surface-container-low border-0 rounded-2xl px-4 py-3 text-sm opacity-50" placeholder="Automático: Nexus" disabled />
                <input className="w-full bg-surface-container-low border-0 rounded-2xl px-4 py-3 text-sm opacity-50" placeholder="Automático: Launch" disabled />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button 
                onClick={handleGenerate}
                className="flex-1 py-5 bg-primary text-white rounded-[1.5rem] font-headline font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5 fill-current" />
                Gerar Link Rastreável
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline font-bold text-xl ml-2">Links Gerados Recentemente</h3>
            {links.length === 0 ? (
              <div className="bg-surface-container-low/50 border-2 border-dashed border-black/5 p-12 rounded-[2.5rem] text-center">
                <LinkIcon className="w-8 h-8 text-on-surface-variant mx-auto mb-4 opacity-20" />
                <p className="text-sm font-bold text-on-surface-variant">Nenhum link gerado ainda. Comece criando um acima.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div key={link.id} className="bg-surface-container-lowest p-5 rounded-2xl border border-black/5 flex items-center justify-between shadow-sm group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4 truncate">
                      <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                        <LinkIcon className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-black text-on-surface truncate">{link.url}</p>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Gerado às {link.createdAt}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(link.url);
                        alert('Link copiado!');
                      }}
                      className="p-3 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Copiar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col justify-between h-fit">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-secondary font-black text-sm">+24.8%</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Cliques Totais</h3>
                <p className="text-4xl font-black font-headline text-on-surface mt-1">{links.reduce((acc, curr) => acc + curr.clicks, 0) + 12482}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Performance em Tempo Real</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

const SettingsView = () => {
  const [connected, setConnected] = useState<string[]>(['Amazon Associates', 'TikTok']);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<string | null>(null);
  
  const handleConnect = (id: string) => {
    if (connected.includes(id)) {
      if (confirm(`Deseja realmente desconectar de ${id}?`)) {
        setConnected(prev => prev.filter(c => c !== id));
      }
      return;
    }

    setShowAuthModal(id);
  };

  const confirmAuth = () => {
    const id = showAuthModal;
    if (!id) return;

    setShowAuthModal(null);
    setConnecting(id);
    
    // Simulate API connection & OAuth verification fetching real account data
    setTimeout(() => {
      setConnecting(null);
      setConnected(prev => [...prev, id]);
      // Add more 'real' feedback showing the account name
      const accountNames: Record<string, string> = {
        'Hotmart': 'galdino_digital_pro',
        'TikTok': '@alex_nexus',
        'Instagram': '@alexgaldino.ads',
        'Meta Ads': 'Nexus Business Manager (ID: 802931)',
        'Google Labs': 'ads-manager-main@gmail.com'
      };
      const accountName = accountNames[id] || 'Conta Ativa';
      alert(`${id} conectado com sucesso como: ${accountName}`);
    }, 2500);
  };

  return (
    <div className="space-y-8 relative">
      {/* Simulated Auth Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface-container-lowest max-w-md w-full rounded-[2.5rem] p-10 shadow-2xl text-center border border-black/5"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-primary">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="font-headline font-black text-2xl text-on-surface mb-3">Autorizar Conexão</h3>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              O Nexus deseja acessar sua conta de <strong>{showAuthModal}</strong> para gerenciar campanhas e ler dados de performance via API segura.
            </p>
            <div className="space-y-3">
              <button 
                onClick={confirmAuth}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                AUTORIZAR ACESSO
              </button>
              <button 
                onClick={() => setShowAuthModal(null)}
                className="w-full py-4 bg-surface-container-high text-on-surface rounded-2xl font-black text-sm"
              >
                CANCELAR
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-6 opacity-30">Nexus Intelligent Orchestration • 256-bit AES Encryption</p>
          </motion.div>
        </div>
      )}

      <div className="mb-12 text-left">
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface mb-2">Conexões Estratégicas</h1>
        <p className="text-on-surface-variant font-body">Configure suas fontes de renda e canais de distribuição para o Squad.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        <div className="lg:col-span-8 space-y-8">
          {/* Marketplaces Section */}
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-black/5 text-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-100 rounded-2xl text-amber-700">
                 <Box className="w-6 h-6" />
              </div>
              <h3 className="font-headline font-bold text-xl">Marketplaces (Afiliado)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Amazon Associates', 'Hotmart', 'ClickBank', 'Digistore24'].map(store => (
                <div key={store} className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-sm text-on-surface">{store}</span>
                    {connected.includes(store) && (
                      <span className="text-[10px] text-green-600 font-bold">Ref: galdino_pro</span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleConnect(store)}
                    disabled={connecting === store}
                    className={cn(
                      "text-[10px] font-black px-4 py-2 rounded-full transition-all transform active:scale-95 flex items-center gap-2",
                      connected.includes(store) ? "bg-green-500 text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                    )}
                  >
                    {connecting === store ? (
                      <>
                        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        AGUARDE
                      </>
                    ) : connected.includes(store) ? (
                      <>
                        <Check className="w-3 h-3" />
                        CONECTADO
                      </>
                    ) : 'CONECTAR'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-black/5 text-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-2xl text-blue-700">
                 <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-headline font-bold text-xl">Integrações & Campanhas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'TikTok', icon: MessageSquare },
                { name: 'Instagram', icon: ImageIcon },
                { name: 'Google Labs', icon: Globe },
                { name: 'Meta Ads', icon: Zap }
              ].map(social => (
                <div key={social.name} className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <social.icon className={cn(
                      "w-4 h-4 transition-colors",
                      connected.includes(social.name) ? "text-secondary" : "text-on-surface-variant"
                    )} />
                    <div>
                      <span className="font-bold text-sm text-on-surface">{social.name}</span>
                      {connected.includes(social.name) && (
                        <span className="text-[10px] text-green-600 font-bold block leading-none mt-0.5">@galdino_nexus</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleConnect(social.name)}
                    disabled={connecting === social.name}
                    className={cn(
                      "text-[10px] font-black px-4 py-2 rounded-full transition-all transform active:scale-95 flex items-center gap-2",
                      connected.includes(social.name) ? "bg-green-500 text-white" : "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white"
                    )}
                  >
                    {connecting === social.name ? (
                      <>
                        <div className="w-3 h-3 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                        AGUARDE
                      </>
                    ) : connected.includes(social.name) ? (
                      <>
                        <Check className="w-3 h-3" />
                        ATIVO
                      </>
                    ) : 'CONECTAR'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Region & Intelligence Section */}
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-black/5 text-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-2xl text-green-700">
                 <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-xl">Região & Inteligência</h3>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">O Squad ajusta o ecossistema baseado na geolocalização dos marketplaces.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
               <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-xs shadow-lg shadow-primary/20 ring-2 ring-primary ring-offset-2 transition-all">
                 <Globe className="w-4 h-4" />
                 Brasil (amazon.com.br)
               </button>
               <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-low text-on-surface rounded-2xl font-bold text-xs hover:bg-white hover:shadow-md transition-all">
                 Global (amazon.com)
               </button>
               <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-low text-on-surface rounded-2xl font-bold text-xs hover:bg-white hover:shadow-md transition-all">
                 Detectar Automaticamente
               </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-black/5 text-left">
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
              <code className="text-primary font-mono text-sm overflow-x-auto whitespace-nowrap flex-1">https://api.nexus.app/webhook/affiliate/galdino</code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('https://api.nexus.app/webhook/affiliate/galdino');
                  alert('URL copiada!');
                }}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-secondary p-8 rounded-[2.5rem] shadow-xl shadow-secondary/20 text-white text-left overflow-hidden relative">
              <TrendingUp className="w-16 h-16 text-white/10 absolute -right-4 -bottom-4" />
              <div className="relative z-10">
                <ShieldCheck className="w-8 h-8 mb-4 text-white/50" />
                <h4 className="font-headline font-black text-xl leading-tight">Escalabilidade Blindada</h4>
                <p className="text-xs text-white/70 mt-2 leading-relaxed font-medium">Sua conta está operando sob criptografia de ponta-a-ponta e monitoramento constante de conexões.</p>
              </div>
           </div>
           
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap className="w-24 h-24 text-primary fill-current" />
              </div>
              <h4 className="font-headline font-bold text-lg mb-4 relative z-10">Limite de Tokens API</h4>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span>Usage</span>
                  <span>72%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[72%]"></div>
                </div>
                <p className="text-[10px] text-white/40">Renova em 14 dias. <span className="text-primary cursor-pointer hover:underline">Upgrade agora</span>.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<View>('analytics');
  const [creatives, setCreatives] = useState(MOCK_CREATIVES);
  const [generatedLinks, setGeneratedLinks] = useState<{id: string, url: string, target: string, clicks: number}[]>([]);
  const [approvedProducts, setApprovedProducts] = useState<any[]>([]);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const addNotification = (message: string, type: 'gold' | 'spy' | 'optimizer') => {
    const newNotif = {
      id: Date.now(),
      type,
      message,
      time: 'Agora'
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);
  };

  // Function to add a creative (used by Orchestrator)
  const addCreative = (newCreative: any) => {
    setCreatives(prev => [newCreative, ...prev]);
    addNotification(`Novo criativo "${newCreative.title}" gerado pelo Squad.`, 'optimizer');
  };

  // Function to approve a creative (from gallery)
  const approveCreative = (id: string) => {
    const creative = creatives.find(c => c.id === id);
    if (!creative) return;
    
    setCreatives(prev => prev.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    
    if (!approvedProducts.find(p => p.id === creative.id)) {
      setApprovedProducts(prev => [creative, ...prev]);
      addNotification(`Criativo "${creative.title}" aprovado para publicação!`, 'gold');
    }
  };

  // Function to approve a product (from Radar Nexus)
  const approveProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    const product = products.find(p => p.id === id);
    if (product && !approvedProducts.find(ap => ap.id === product.id)) {
      // Create a "creative" based on the product
      const newCreative = {
        id: `c-${product.id}`,
        title: product.title,
        type: 'Product Ad',
        image: product.image,
        status: 'Approved',
        agent: 'Nexus Radar',
        isVideo: true
      };
      setApprovedProducts(prev => [newCreative, ...prev]);
      addNotification(`Produto "${product.title}" aprovado no Radar!`, 'spy');
      alert(`${product.title} aprovado e enviado para a Fila de Publicação!`);
    }
  };

  const navItems = [
    { id: 'analytics', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pending', label: 'Radar Nexus', icon: Zap },
    { id: 'approved', label: 'Publicações', icon: CheckSquare },
    { id: 'agents', label: 'Orquestrador', icon: Cpu },
    { id: 'studio', label: 'Studio de Criação', icon: Sparkles },
    { id: 'creatives', label: 'Criativos', icon: ImageIcon },
    { id: 'links', label: 'Gestão de Links', icon: LinkIcon },
    { id: 'settings', label: 'Conexões', icon: Settings2 },
  ];

  return (
    <div className="min-h-screen flex text-on-surface">
      {/* Desktop Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 hidden lg:flex flex-col bg-slate-50 border-r border-slate-100 z-50">
        <div className="p-8">
          <h1 className="text-xl font-black text-primary font-headline uppercase tracking-tighter">Nexus Affiliates</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Intelligent Orchestration</p>
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
                <NotificationCenter notifications={notifications} />
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
              {currentView === 'analytics' && <AnalyticsDashboard onNavigate={setCurrentView} stats={{ links: generatedLinks.length, approved: approvedProducts.length }} />}
              {currentView === 'pending' && <PendingApprovals products={products} onApprove={approveProduct} />}
              {currentView === 'approved' && (
                <ApprovedPosts 
                  approvedItems={approvedProducts} 
                  onPublish={(title) => addNotification(`Campanha "${title}" ativada no TikTok e Google Ads!`, 'gold')}
                  onReview={(item) => {
                    // Navigate back to studio and perhaps remove from approved list to redo the flow
                    setApprovedProducts(prev => prev.filter(p => p.id !== item.id));
                    setCurrentView('studio');
                    alert(`O criativo "${item.title}" foi enviado de volta ao Studio para revisão.`);
                  }} 
                />
              )}
              {currentView === 'studio' && <CreationStudio />}
              {currentView === 'agents' && <AgentSquadView onMissionComplete={addCreative} onNavigate={setCurrentView} />}
              {currentView === 'creatives' && <CreativeGallery creatives={creatives} onApprove={approveCreative} onReject={(id) => setCreatives(prev => prev.filter(c => c.id !== id))} onNavigate={setCurrentView} />}
              {currentView === 'links' && <LinkManagement links={generatedLinks} onAddLink={(link) => setGeneratedLinks(prev => [link, ...prev])} />}
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
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">© 2024 Nexus Affiliates. Todos os direitos reservados.</p>
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
