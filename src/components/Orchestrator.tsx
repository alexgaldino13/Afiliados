import React, { useState } from "react";
import { useSquad } from "../context/SquadContext";
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  Flame,
  Target,
  Play,
  Check,
  MessageSquare,
} from "lucide-react";
import { cn, MOCK_AGENTS, MOCK_PRODUCTS } from "../lib/utils";
import { SquadChat } from "./SquadChat";

interface AgentSquadViewProps {
  onMissionComplete: (item: any) => void;
  onNavigate: (view: any) => void;
}

export const AgentSquadView = ({
  onMissionComplete,
  onNavigate,
}: AgentSquadViewProps) => {
  const {
    scoutProducts,
    generateStrategy,
    generateCreative,
    generateMediaPlan,
    mentorContext,
    saveCampaign
  } = useSquad();

  const [activeTab, setActiveTab] = useState<'mission' | 'chat'>('mission');

  const handleLaunchMission = async () => {
    const btn = document.getElementById("agent-mission-btn");
    if (!btn) return;

    const missionDesc = (
      document.querySelector("textarea") as HTMLTextAreaElement
    )?.value;
    if (!missionDesc) {
      alert("Descreva a missão para o Squad.");
      return;
    }

    btn.innerHTML =
      '<span class="animate-spin flex items-center gap-2"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v4m0 12v4M2 12h4m12 0h4"></path></svg> Orquestrando...</span>';
    btn.style.opacity = "0.7";
    btn.style.pointerEvents = "none";

    try {
      const scoutResults = await scoutProducts(missionDesc);
      if (scoutResults.length > 0) {
        const product = scoutResults[0];
        const strategy = await generateStrategy(product);
        const creative = await generateCreative(product, strategy);
        const mediaPlan = await generateMediaPlan(product, strategy);

        const campaignData = {
          product_id: product.id,
          title: creative.campaignName || product.title,
          copy_aida: {
            text: creative.copy,
            seo: creative.seoTags
          },
          business_dna: strategy.businessDna,
          status: 'draft',
          assets: [
            { type: 'image', url: creative.imageUrl, prompt: creative.prompt },
            { type: 'video', url: creative.videoUrl, prompt: creative.prompt },
            { type: 'audio', url: creative.audioUrl, prompt: 'Background music' }
          ]
        };

        await saveCampaign(campaignData);

        onMissionComplete({
          ...campaignData,
          image: creative.imageUrl,
          copy: creative.copy,
          agent: "Lala Squad",
          isVideo: !!creative.videoUrl,
          mediaPlan: mediaPlan,
        });

        btn.innerHTML =
          'Missão Concluída! <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>';
        btn.className =
          "w-full bg-green-500 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-500/20";

        setTimeout(() => {
          if (confirm("Missão concluída pelo Squad! Você quer ver o novo criativo na galeria?")) {
            onNavigate("creatives");
          }
          btn.innerHTML =
            'Lançar Nova Missão <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"></path></svg>';
          btn.className =
            "w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all";
          btn.style.opacity = "1";
          btn.style.pointerEvents = "auto";
        }, 1000);
      }
    } catch (err) {
      console.error("Mission failed:", err);
      btn.innerHTML = "Falha na Missão. Tente Novamente.";
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
            Orquestrador de Missões
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            Sua força tarefa de IA pronta para orquestrar novos ativos.
          </p>
        </div>

        <div className="bg-surface-container-low p-2 rounded-[2rem] flex items-center gap-1 border border-black/5 shadow-inner">
          {[
            { id: "stealth", icon: ShieldCheck, label: "Evergreen" },
            { id: "blitz", icon: Flame, label: "Blitzkrieg" },
            { id: "precision", icon: Target, label: "ROI Focus" },
          ].map((strat) => (
            <button
              key={strat.id}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tighter transition-all",
                strat.id === "blitz"
                  ? "bg-white text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              <strat.icon className="w-3.5 h-3.5" />
              {strat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-headline font-bold text-lg text-on-surface ml-2">
            SQUAD Especializado
          </h3>
          {MOCK_AGENTS.map((agent) => (
            <div
              key={agent.id}
              className="bg-surface-container-lowest p-5 rounded-3xl border border-black/5 shadow-sm hover:border-primary/30 transition-all cursor-pointer group"
            >
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

        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5 min-h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-headline font-bold text-xl text-on-surface">
                  {activeTab === 'mission' ? 'Orquestração Global' : 'Chat com o Squad'}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-on-surface-variant">
                    {activeTab === 'mission' ? 'Configure e execute uma missão conjunta.' : 'Consulte seus agentes em tempo real.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-black/5">
              <button
                onClick={() => setActiveTab('mission')}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  activeTab === 'mission' ? "bg-white shadow-sm text-primary" : "text-on-surface-variant"
                )}
              >
                <Target className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  activeTab === 'chat' ? "bg-white shadow-sm text-primary" : "text-on-surface-variant"
                )}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'chat' ? (
              <SquadChat />
            ) : (
              <div className="space-y-8 overflow-y-auto pr-2 max-h-[700px]">
                <div className="space-y-4 text-left">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block ml-2 text-left">
                    Resumo da Missão
                  </label>
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
                  onClick={handleLaunchMission}
                  className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Lançar Missão de Orquestração <Play className="w-5 h-5 fill-current" />
                </button>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-[2.5rem] border border-amber-200/50 shadow-xl shadow-amber-950/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <div className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                      Oportunidade de Ouro
                    </div>
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
                      <p className="text-sm text-amber-800/70 leading-relaxed mb-4">
                        "O Scout encontrou um gap de SEO no nicho de Home Decor. O Trend Hunter confirmou alta no Pinterest. O Copy preparou 3 variações de anúncios."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300">
                  <h5 className="font-bold text-sm text-on-surface mb-4">Processamento do Squad</h5>
                  <div className="space-y-3">
                    {[
                      { agent: "Spy", task: 'Varredura em Ad Libraries: Detectados 14 anúncios ativos há +7 dias.' },
                      { agent: "Scout", task: "Mineração de produtos similares na Amazon com margem superior a 25%." },
                      { agent: "Trend Hunter", task: "Validação de timing: #HomeDecor minimalista em alta." },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-black/5">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{i + 1}</div>
                        <div className="flex-1">
                          <span className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-tighter">{step.agent}</span>
                          <p className="text-xs font-medium text-on-surface">{step.task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
