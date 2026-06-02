import React, { useState } from "react";
import { useSquad } from "../context/SquadContext";
import {
  Sparkles,
  User,
  Cpu,
  X,
  Plus,
  Copy,
  Check,
  Globe,
  Clapperboard,
} from "lucide-react";
import { cn } from "../lib/utils";

export const CreationStudio = () => {
  const { chatWithSquad, profile, campaigns, updateCampaign } = useSquad();
  const userName = profile?.full_name || "Usuário Lala";

  const lastCampaign = campaigns[0];
  const [previewImage, setPreviewImage] = useState(lastCampaign?.assets?.[0]?.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateImage = async () => {
    if (!lastCampaign) return;
    setIsRegenerating(true);
    try {
      const res = await fetch("http://localhost:3001/api/agents/creative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: { title: lastCampaign.title },
          strategy: { businessDna: lastCampaign.business_dna },
          profile: { niche: profile?.niche, brandVoice: profile?.brand_voice }
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setPreviewImage(data.imageUrl);
        // Add to output so user can apply if they like
        setOutput((prev: any) => ({ ...prev, imageUrl: data.imageUrl }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const [messages, setMessages] = useState([
    {
      role: "agent",
      name: "Spy & Scout",
      type: "primary",
      content: lastCampaign
        ? `Notei que você criou a campanha **"${lastCampaign.title}"**. Quer que eu ajude a otimizar a copy para aumentar o CTR?`
        : 'Detectei uma nova tendência de **"Home Refresh"** que está explodindo no TikTok. Vamos começar uma nova missão?',
      icon: Sparkles,
    },
    {
      role: "user",
      name: userName,
      type: "user",
      content: lastCampaign
        ? "Sim, vamos refinar essa campanha."
        : "Excelente sacada! Vamos começar.",
      icon: User,
    },
    {
      role: "agent",
      name: "Copywriter Agente",
      type: "secondary",
      content:
        "Processando variações psicográficas focadas em remover a fricção de compra...",
      icon: Cpu,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [output, setOutput] = useState<any>(null);

  const handleApplyChanges = async () => {
    if (!lastCampaign || (!output?.copy && !output?.imageUrl)) return;

    try {
      setIsTyping(true);
      const updates: any = {};
      if (output.copy) {
        updates.copy_aida = {
          ...lastCampaign.copy_aida,
          text: output.copy
        };
      }

      await updateCampaign(lastCampaign.id, updates);
      alert("Alterações aplicadas à campanha!");
      setOutput(null);
    } catch (err) {
      alert("Erro ao aplicar alterações.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      name: userName,
      type: "user",
      content: input,
      icon: User,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await chatWithSquad(messages, {
        mode: "studio_refinement",
        campaign: lastCampaign
      });

      const agentMsg = {
        role: "agent",
        name: "Chief of Staff",
        type: "primary",
        content: response.content,
        icon: Sparkles,
      };
      setMessages((prev) => [...prev, agentMsg]);

      if (response.actionRequired !== "none" && response.suggestedChanges) {
        setOutput(response.suggestedChanges);
      }
    } catch (err) {
      console.error("Chat failed:", err);
      const errorMsg = {
        role: "agent",
        name: "Lala System",
        type: "primary",
        content: "Desculpe, tive um erro na orquestracao. Tente novamente.",
        icon: X,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="text-left">
          <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
            Studio de Criação
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            Refine seus criativos com a ajuda do Squad em tempo real.
          </p>
        </div>

        <div className="bg-surface-container-low p-2 rounded-[2rem] flex items-center gap-1 border border-black/5 shadow-inner">
          {["Chat", "Histórico", "Versões"].map((tab) => (
            <button
              key={tab}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tighter transition-all",
                tab === "Chat"
                  ? "bg-white text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-black/5 overflow-hidden h-[700px]">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                    msg.type === "primary"
                      ? "bg-primary text-white"
                      : msg.type === "secondary"
                        ? "bg-secondary text-white"
                        : "bg-surface-container-high text-on-surface",
                  )}
                >
                  <msg.icon className="w-5 h-5" />
                </div>
                <div
                  className={cn(
                    "p-5 rounded-[1.5rem] text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-none text-right"
                      : "bg-surface-container-low text-on-surface rounded-tl-none text-left",
                  )}
                >
                  <p className="font-bold text-[10px] uppercase tracking-widest mb-2 opacity-60">
                    {msg.name}
                  </p>
                  <p className="font-medium whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-surface-container-high shrink-0" />
                <div className="p-5 rounded-[1.5rem] bg-surface-container-low w-32 h-12" />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-6 bg-white border-t border-black/5">
            <div className="flex gap-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Peça ajustes no copy, mude o estilo visual..."
                className="flex-1 bg-surface-container-low border-0 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button
                onClick={handleSend}
                disabled={isTyping}
                className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Output/Preview Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-on-surface mb-6 text-left">
              Preview do Ativo
            </h3>
            <div className="aspect-[4/5] bg-surface-container-low rounded-[2rem] overflow-hidden relative group border border-black/5">
              <img
                src={previewImage}
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={handleRegenerateImage}
                  disabled={isRegenerating}
                  className="bg-white/20 backdrop-blur px-6 py-2 rounded-xl font-bold text-xs ring-1 ring-white/30 hover:bg-white/30 active:scale-95 transition-all"
                >
                  {isRegenerating ? "Gerando..." : "Regerar Imagem"}
                </button>
                <button
                  onClick={() =>
                    alert("Solicitação de ajuste enviada ao Designer Squad!")
                  }
                  className="bg-white/20 backdrop-blur px-6 py-2 rounded-xl font-bold text-xs ring-1 ring-white/30 hover:bg-white/30 active:scale-95 transition-all"
                >
                  Pedir Ajuste
                </button>
              </div>
            </div>
            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                <span>Engenharia de Prompt</span>
                <span>{output ? "95% OTIMIZADO" : "88% OTIMIZADO"}</span>
              </div>
              <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary w-[88%]"
                  style={{ width: output ? "95%" : "88%" }}
                ></div>
              </div>

              {output && (
                <button
                  onClick={handleApplyChanges}
                  className="w-full mt-4 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2"
                >
                  <Check className="w-5 h-5" />
                  APLICAR ALTERAÇÕES
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
