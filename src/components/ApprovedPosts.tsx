import React, { useState } from "react";
import {
  Sparkles,
  Download,
  Calendar,
  Settings2,
  Clock,
  X,
  Cpu,
  Target,
  BarChart3
} from "lucide-react";
import { cn } from "../lib/utils";
import { useSquad } from "../context/SquadContext";

interface ApprovedPostsProps {
  approvedItems?: any[];
  onPublish: (item: any) => void;
  onReview: (item: any) => void;
}

export const ApprovedPosts = ({
  onPublish,
  onReview,
}: ApprovedPostsProps) => {
  const { campaigns, scheduleCampaign, notifications = [] } = useSquad();
  const [schedulingItem, setSchedulingItem] = useState<any>(null);
  const [scheduleDate, setScheduleDate] = useState("");

  const activeCampaigns = campaigns || [];
  const missionsInProgress = (notifications || []).filter(n => n.type === 'spy' && !n.read).length;

  const handleSchedule = async () => {
    if (!schedulingItem || !scheduleDate) return;
    try {
      await scheduleCampaign(schedulingItem.id, new Date(scheduleDate));
      setSchedulingItem(null);
    } catch (err) {
      alert("Erro ao agendar.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="text-left">
          <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
            Fila de Lançamento
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            Campanhas orquestradas pelo Squad prontas para o mundo.
          </p>
        </div>

        {missionsInProgress > 0 && (
          <div className="flex items-center gap-4 bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl animate-pulse">
             <Cpu className="w-5 h-5 text-primary animate-spin" />
             <div className="text-left">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-tight">Squad em Missão</p>
                <p className="text-xs font-bold text-on-surface">{missionsInProgress} ativo(s) em geração...</p>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeCampaigns.map((camp) => (
          <div
            key={camp.id}
            className="group bg-surface-container-lowest p-8 rounded-[3rem] border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
          >
             {/* Overlay de Processamento (Esteira de Produção) */}
             {camp.status === 'processing' && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <Cpu className="w-8 h-8 animate-spin" />
                </div>
                <h4 className="text-lg font-black text-on-surface mb-2">Squad em Operação</h4>

                <div className="w-full max-w-[200px] bg-surface-container-high h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${camp.progress || 0}%` }}
                  />
                </div>
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{camp.progress || 0}% CONCLUÍDO</span>
              </div>
            )}

            {camp.status === 'failed' && (
              <div className="absolute inset-0 bg-red-50/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-12 text-center">
                 <X className="w-10 h-10 text-red-500 mb-3" />
                 <h4 className="text-md font-black text-red-900 mb-1">Falha na Missão</h4>
                 <p className="text-[10px] text-red-700 font-medium mb-4 line-clamp-2">{camp.error_log}</p>
                 <button onClick={() => alert("Tentando novamente...")} className="px-4 py-2 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase">Reiniciar</button>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-64 shrink-0">
                <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100 border border-black/5">
                   <img
                    src={camp.assets?.[0]?.url || camp.image_url || "https://images.unsplash.com/photo-1581244277943-fe4a9c777189"}
                    className="w-full h-full object-cover"
                    alt=""
                   />
                </div>
              </div>

              <div className="flex-1 text-left flex flex-col">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">{camp.title}</h3>
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    camp.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-primary/5 text-primary border-primary/10'
                  )}>
                    {camp.status === 'published' ? '🚀 No Ar' : '✨ Orquestrada'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                        <Calendar className="w-4 h-4 text-primary" />
                        Criada em {new Date(camp.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                        <Target className="w-4 h-4 text-primary" />
                        Voz: {camp.business_dna?.brandVoice || 'Padrão'}
                      </div>
                   </div>
                   <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5" /> Performance Est.
                      </p>
                      <p className="text-xs font-bold text-on-surface">Sugestão de Budget: R$ 50/dia</p>
                   </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-3">
                  <button onClick={() => onPublish(camp)} className="px-10 py-5 bg-on-surface text-white font-black rounded-3xl flex items-center gap-3">
                    <Download className="w-5 h-5" /> EXPORTAR
                  </button>
                  <button onClick={() => setSchedulingItem(camp)} className="px-6 py-5 bg-primary/10 text-primary font-black rounded-3xl flex items-center justify-center gap-3">
                    <Clock className="w-5 h-5" /> AGENDAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {activeCampaigns.length === 0 && (
          <div className="py-32 text-center bg-surface-container-low rounded-[4rem] border border-dashed border-black/10">
            <Sparkles className="w-16 h-16 text-on-surface-variant/20 mx-auto mb-6" />
            <h2 className="font-headline font-black text-2xl text-on-surface">Fila Vazia</h2>
            <p className="text-on-surface-variant mt-2 font-medium">Aprove produtos no Radar para gerar campanhas reais.</p>
          </div>
        )}
      </div>

      {schedulingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8 text-left">
              <h3 className="text-2xl font-black text-on-surface">Agendar Postagem</h3>
              <button onClick={() => setSchedulingItem(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-2 ml-2">Data e Hora</label>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                onClick={handleSchedule}
                disabled={!scheduleDate}
                className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
