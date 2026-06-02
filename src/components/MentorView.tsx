import React, { useState } from "react";
import { useSquad } from "../context/SquadContext";
import {
  Globe,
  Cpu,
  Sparkles,
  Zap,
  CheckCircle2,
  Box,
  ArrowRight
} from "lucide-react";
import { cn } from "../lib/utils";

export const MentorView = () => {
  const { setMentorContext, approveProduct, products } = useSquad();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const isUrl = url.startsWith('http');
      const payload = isUrl ? { url } : { topic: url };

      const res = await fetch("http://localhost:3001/api/agents/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setInsight(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchCampaign = async () => {
    if (!insight || !url) return;

    setLoading(true);
    try {
      // 1. Extrair ASIN ou ID do link
      const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/i) || url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
      const asin = asinMatch ? asinMatch[1] : "AMZ-" + Math.random().toString(36).substr(2, 5);
      const affiliateLink = `https://www.amazon.com.br/dp/${asin}?tag=galdino1307-20`;

      // 2. Criar produto no banco via Orquestrador
      const res = await fetch("http://localhost:3001/api/agents/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           niche: "Importado via Link",
           manualProduct: {
              title: insight.mentorName || "Produto Amazon",
              description: insight.summary,
              affiliate_link: affiliateLink,
              image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800", // Fallback
              platform: "Amazon",
              external_id: asin
           }
        }),
      });

      const [newProduct] = await res.json();

      // 3. Aprovar automaticamente para disparar o Squad
      await approveProduct(newProduct.id);

      alert("🚀 SUCESSO! O Squad recebeu a missão. Acompanhe a geração no sininho de notificações.");
      setInsight(null);
      setUrl("");
    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar orquestração.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="text-left">
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
          Agente Mentor
        </h1>
        <p className="text-on-surface-variant font-body mt-1">
          Extraia inteligência de vídeos ou de qualquer **URL da Amazon** para o seu Squad.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/50 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole um link da Amazon ou digite 'Como pegar API da Hotmart'..."
            className="flex-1 bg-surface-container-low border-2 border-black/5 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Cpu className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            {loading ? "PROCESSANDO..." : "ANALISAR LINK"}
          </button>
        </div>
      </div>

      {insight && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="lg:col-span-8 bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-sm border border-black/5 text-left">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-headline font-bold text-2xl text-on-surface">
                {insight.mentorName || "Inteligência Extraída"}
              </h3>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-on-surface-variant font-medium leading-relaxed">
                {insight.summary}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 bg-surface-container-low rounded-3xl text-left">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-primary mb-3">
                    Hooks (Ganchos)
                  </h4>
                  <ul className="space-y-2">
                    {insight.hooks?.map((hook: string, i: number) => (
                      <li key={i} className="text-xs font-bold text-on-surface flex gap-2">
                        <span className="text-primary">•</span> {hook}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 bg-surface-container-low rounded-3xl text-left">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-secondary mb-3">
                    Ângulos de Venda
                  </h4>
                  <ul className="space-y-2">
                    {insight.angles?.map((angle: string, i: number) => (
                      <li key={i} className="text-xs font-bold text-on-surface flex gap-2">
                        <span className="text-secondary">•</span> {angle}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 text-left">
              <div className="flex items-center gap-2 mb-4">
                 <Zap className="w-5 h-5 fill-current" />
                 <h4 className="font-headline font-black text-xl">Auto-Campaign</h4>
              </div>
              <p className="text-primary-container text-sm font-medium mb-8 leading-relaxed opacity-90">
                Detectamos que este link é da **Amazon**. O Squad pode gerar agora uma campanha completa com o seu ID **galdino1307-20**.
              </p>
              <button
                onClick={handleLaunchCampaign}
                className="w-full py-5 bg-white text-primary font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                ORQUESTRAR AGORA <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
