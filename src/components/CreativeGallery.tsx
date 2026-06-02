import React, { useState } from "react";
import {
  Eye,
  Share2,
  Check,
  CheckCircle2,
  Clapperboard,
  Play,
  Sparkles,
  Search,
  Filter,
  Target,
  TrendingUp,
  BarChart3,
  CreditCard,
  Calendar,
  X as XIcon,
  MessageSquare,
  Copy,
  LayoutDashboard
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface CreativeCardProps {
  creative: any;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (creative: any) => void;
}

export const CreativeCard = ({
  creative,
  onApprove,
  onReject,
  onView,
}: CreativeCardProps) => {
  const [isApproved, setIsApproved] = useState(creative.status === "Approved" || creative.status === "published");
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
        <img
          src={creative.image}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt=""
        />

        {creative.isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/20">
            {creative.type || "Social Ad"}
          </span>
          {creative.isVideo && (
            <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1">
              <Clapperboard className="w-3 h-3" /> Vídeo
            </span>
          )}
          <span className="px-3 py-1 bg-secondary text-white text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1 shadow-sm">
            <Target className="w-3 h-3" /> Google ADS Ready
          </span>
        </div>

        {isApproved && (
          <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 text-left">
          <div className="flex gap-4">
            <button
              onClick={() => onView(creative)}
              className="flex-1 py-3 bg-white text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors active:scale-95 transform"
            >
              <Eye className="w-4 h-4" />
              Ver Campanha
            </button>
            <button
              onClick={handleCopy}
              className="p-3 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/40 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="text-left">
            <h3 className="font-bold text-on-surface leading-tight text-lg mb-1 line-clamp-1">
              {creative.title}
            </h3>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">
              {creative.agent || "Lala Squad"}
            </span>
          </div>
          <div
            className={cn(
              "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
              isApproved
                ? "bg-green-100 text-green-700"
                : creative.status === "Ready"
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-100 text-amber-700",
            )}
          >
            {isApproved ? "Publicado" : creative.status || "Ready"}
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
              Sincronizado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface CreativeGalleryProps {
  creatives: any[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onNavigate: (view: any) => void;
}

export const CreativeGallery = ({
  creatives,
  onApprove,
  onReject,
  onNavigate,
}: CreativeGalleryProps) => {
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'creative' | 'ads'>('creative');

  const copyToClipboard = (text: string) => {
     navigator.clipboard.writeText(text);
     alert("Copiado com sucesso!");
  };

  const sendToScriptwriter = (item: any) => {
    const briefing = `
MISSÃO ROTEIRISTA:
Tema: ${item.title}
Público: ${item.business_dna?.brandVoice || 'Geral'}
Pontos de Dor: ${item.business_dna?.painPoints || ''}
Objetivo: Transformar essa campanha de afiliado em um vídeo viral de 30 segundos.
    `;
    navigator.clipboard.writeText(briefing);
    alert("🚀 Briefing copiado! Agora é só colar no seu App Roteirista.");
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="text-left">
          <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
            Galeria de Campanhas
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            Seus ativos e planos de mídia orquestrados pelo Squad.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Buscar campanha..."
              className="pl-11 pr-6 py-3 bg-white border border-black/5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {creatives.map((creative) => (
          <CreativeCard
            key={creative.id}
            creative={creative}
            onApprove={onApprove}
            onReject={onReject}
            onView={setPreviewItem}
          />
        ))}
      </div>

      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-5xl w-full bg-surface-container-lowest rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl h-[90vh] md:h-auto overflow-y-auto md:overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media Section */}
              <div className="md:w-[45%] bg-black flex flex-col relative">
                <div className="flex-1 flex items-center justify-center">
                   <img
                    src={previewItem.image}
                    className="w-full h-full object-contain"
                    alt=""
                  />
                </div>
                <div className="absolute top-6 left-6 z-10 flex gap-2">
                   <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all">
                      <LayoutDashboard className="w-5 h-5" />
                   </button>
                   {previewItem.isVideo && (
                    <button className="p-3 bg-primary/80 backdrop-blur-md rounded-2xl text-white hover:bg-primary transition-all">
                       <Play className="w-5 h-5" />
                    </button>
                   )}
                </div>
              </div>

              {/* Data Section */}
              <div className="md:w-[55%] p-8 md:p-12 flex flex-col h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-black/5">
                      <button
                        onClick={() => setActiveTab('creative')}
                        className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'creative' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant")}
                      >Visual / Copy</button>
                      <button
                        onClick={() => setActiveTab('ads')}
                        className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'ads' ? "bg-white text-secondary shadow-sm" : "text-on-surface-variant")}
                      >Google ADS</button>
                   </div>
                   <button onClick={() => setPreviewItem(null)} className="p-3 hover:bg-surface-container-high rounded-full"><XIcon className="w-6 h-6" /></button>
                </div>

                <div className="flex-1">
                   {activeTab === 'creative' ? (
                     <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 text-left">
                        <div>
                          <h2 className="text-3xl font-black font-headline text-on-surface mb-2">{previewItem.title}</h2>
                          <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.2em]">
                             <Sparkles className="w-4 h-4" /> Orquestrado pelo Lala Squad
                          </div>
                        </div>

                        <div className="p-8 bg-surface-container-low rounded-[2rem] relative group border border-black/5">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Copy Final (Legenda)</h4>
                           <p className="text-sm leading-relaxed text-on-surface font-medium whitespace-pre-wrap italic">
                              "{previewItem.copy || "Copy em processamento estratégica..."}"
                           </p>
                           <button
                            onClick={() => copyToClipboard(previewItem.copy)}
                            className="absolute top-6 right-6 p-2 bg-white rounded-xl shadow-sm border border-black/5 opacity-0 group-hover:opacity-100 transition-all hover:text-primary"
                           >
                              <Copy className="w-4 h-4" />
                           </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-left">
                           <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10">
                              <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Tone of Voice</p>
                              <p className="font-bold text-on-surface text-sm">{previewItem.business_dna?.brandVoice || 'Amigável & Direct Response'}</p>
                           </div>
                           <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 text-left">
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Market Gap</p>
                              <p className="font-bold text-on-surface text-sm line-clamp-1">{previewItem.business_dna?.pomelliInsights?.marketGap || 'Alta demanda orgânica'}</p>
                           </div>
                        </div>

                        {/* Pomelli DNA Engine Card */}
                        <div className="p-8 bg-gradient-to-br from-indigo-50 to-white rounded-[2.5rem] border border-indigo-100 shadow-sm text-left relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Sparkles className="w-12 h-12 text-indigo-600" />
                           </div>
                           <div className="flex items-center gap-2 mb-6">
                              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                 <Zap className="w-4 h-4 fill-current" />
                              </div>
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Pomelli DNA Engine</span>
                           </div>

                           <div className="space-y-4">
                              <div>
                                 <p className="text-[8px] font-black text-indigo-400 uppercase mb-2">Unique Selling Proposition (USP)</p>
                                 <p className="text-sm font-bold text-on-surface leading-tight">
                                    {previewItem.business_dna?.usp || previewItem.business_dna?.uniqueSellingProposition || "Proposta de valor exclusiva detectada."}
                                 </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                 {(previewItem.business_dna?.coreValues || ["Qualidade", "Praticidade", "Estética"]).map((val: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-white border border-indigo-100 rounded-full text-[10px] font-bold text-indigo-600 shadow-sm">
                                       {val}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="p-3 bg-secondary/10 rounded-2xl text-secondary"><Target className="w-6 h-6" /></div>
                           <div>
                              <h3 className="font-headline font-black text-2xl text-on-surface">Estrutura Google ADS</h3>
                              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Fundos de Funil Sugeridos</p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="p-6 bg-surface-container-low rounded-3xl relative group border border-black/5">
                              <label className="text-[8px] font-black uppercase text-secondary block mb-3">Títulos Sugeridos (30 Caracteres)</label>
                              <div className="space-y-2">
                                 {["O Melhor Ventilador 2026", "Oferta Exclusiva Amazon", "Ventilador Inteligente Wi-Fi"].map((t, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-black/5">
                                       <span className="text-xs font-bold text-on-surface">{t}</span>
                                       <button onClick={() => copyToClipboard(t)} className="text-slate-300 hover:text-primary"><Copy className="w-3.5 h-3.5" /></button>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="p-6 bg-surface-container-low rounded-3xl border border-black/5">
                              <label className="text-[8px] font-black uppercase text-secondary block mb-3">Palavras-Chave (Keywords)</label>
                              <div className="flex flex-wrap gap-2 text-left">
                                 {["comprar ventilador inteligente", "ventilador alexa preço", "melhor ventilador wifi amazon", "ventilador silencioso smart"].map((kw, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => copyToClipboard(kw)}
                                      className="px-3 py-1.5 bg-white border border-black/5 rounded-lg text-[10px] font-bold text-on-surface-variant hover:border-secondary transition-all"
                                    >+{kw}</button>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center justify-between">
                           <div className="text-left">
                              <p className="text-[8px] font-black text-green-700 uppercase">Orçamento de Teste</p>
                              <p className="text-xl font-black text-on-surface">R$ 50,00 / dia</p>
                           </div>
                           <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
                        </div>
                     </div>
                   )}
                </div>

                <div className="mt-12 flex gap-4">
                  <button
                    onClick={() => {
                      onApprove(previewItem.id);
                      setPreviewItem(null);
                    }}
                    className="flex-1 py-5 bg-on-surface text-white font-black rounded-3xl shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Check className="w-5 h-5" />
                    ACEITAR E FINALIZAR
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("studio");
                      setPreviewItem(null);
                    }}
                    className="px-10 py-5 bg-surface-container-high text-on-surface font-black rounded-3xl hover:bg-surface-container-highest transition-colors"
                  >
                    EDITAR
                  </button>
                  <button
                    onClick={() => sendToScriptwriter(previewItem)}
                    className="p-5 bg-indigo-50 text-indigo-600 border border-indigo-100 font-black rounded-3xl hover:bg-indigo-100 transition-all flex items-center justify-center gap-3"
                    title="Enviar briefing para o App Roteirista"
                  >
                    <Clapperboard className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
