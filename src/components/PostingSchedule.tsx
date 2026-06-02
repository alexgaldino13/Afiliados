import React, { useState } from "react";
import { Calendar, Clock, Video, X, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { useSquad } from "../context/SquadContext";

export const PostingSchedule = () => {
  const { campaigns } = useSquad();
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  // Filtramos apenas campanhas que já possuem copy/roteiro gerado
  const scheduledItems = campaigns
    .filter(c => c.copy_aida || c.status === 'ready')
    .map(c => ({
      id: c.id,
      product: c.title,
      platform: "TikTok / Reels",
      time: "18:30 (Horário Nobre)",
      hook: c.copy_aida?.text?.substring(0, 60) + "..." || "Aguardando geração do Squad...",
      fullScript: c.copy_aida?.text || "O roteiro está sendo refinado pelos nossos agentes.",
      status: c.status
    }));

  return (
    <div className="space-y-6 text-left relative">
      <div>
        <h2 className="text-3xl font-black font-headline text-on-surface">Planejamento de Posts</h2>
        <p className="text-sm text-on-surface-variant font-medium">Cronograma estratégico baseado no engajamento do seu nicho.</p>
      </div>

      {scheduledItems.length === 0 ? (
        <div className="py-20 bg-surface-container-low rounded-[2.5rem] border border-dashed border-black/10 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-on-surface-variant font-bold">Nenhum post agendado. Aprove um produto no Radar para começar.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {scheduledItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-black/5 flex items-center justify-between group hover:shadow-xl hover:shadow-primary/5 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                  <Video className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-on-surface text-lg">{item.product}</h4>
                  <div className="flex gap-4 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary">
                      <Clock className="w-3 h-3" /> {item.time}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      {item.platform}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCampaign(item)}
                className="px-8 py-4 bg-on-surface text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary transition-all flex items-center gap-2"
              >
                Ver Roteiro <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Roteiro */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-black/5 flex justify-between items-center bg-surface-container-low">
              <div className="flex items-center gap-3">
                <Sparkles className="text-primary w-6 h-6" />
                <h3 className="text-xl font-black font-headline">Roteiro Sugerido</h3>
              </div>
              <button onClick={() => setSelectedCampaign(null)} className="p-3 hover:bg-black/5 rounded-2xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 overflow-y-auto flex-1 bg-white">
              <div className="mb-8">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block mb-2">Título do Post</label>
                <h2 className="text-2xl font-black text-on-surface">{selectedCampaign.product}</h2>
              </div>

              <div className="p-8 bg-surface-container-lowest rounded-[2rem] border border-black/5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Script para Vídeo (AIDA)</label>
                <p className="text-on-surface leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedCampaign.fullScript}
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <div className="flex-1 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-1">Dica do Squad</p>
                  <p className="text-xs font-bold text-orange-900">Use uma música "Trending" de fundo com volume em 10%.</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-surface-container-low border-t border-black/5 text-center">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                Pronto para postar? Marque como concluído no Checklist.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
