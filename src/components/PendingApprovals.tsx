import React, { useState, useEffect } from "react";
import {
  Zap,
  Check,
  X,
  Sparkles,
  Globe,
  Plus,
  RefreshCw,
  Search,
  Cpu,
  Eye
} from "lucide-react";
import { cn } from "../lib/utils";
import { useSquad } from "../context/SquadContext";

interface PendingApprovalsProps {
  products: any[];
  onApprove: (id: string) => void;
}

export const PendingApprovals = ({
  products = [],
  onApprove,
}: PendingApprovalsProps) => {
  const { getScoutedProducts, importScoutedProduct, forceScout, scoutProducts, saveCampaign } = useSquad();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [mode, setMode] = useState<"radar" | "global">("radar");
  const [globalProducts, setGlobalProducts] = useState<any[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  useEffect(() => {
    if (mode === "global") {
      loadGlobal();
    }
  }, [mode]);

  const loadGlobal = async () => {
    setLoadingGlobal(true);
    try {
      const data = await getScoutedProducts();
      setGlobalProducts(data || []);
    } catch (err) {
      console.error(err);
      setGlobalProducts([]);
    } finally {
      setLoadingGlobal(false);
    }
  };

  const handleForceScout = async () => {
    setLoadingGlobal(true);
    try {
      if (mode === "radar") {
        await scoutProducts("");
      } else {
        await forceScout();
        setTimeout(loadGlobal, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGlobal(false);
    }
  };

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    onApprove(id);
  };

  const currentList = (mode === "radar" ? products : globalProducts) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
        <div>
          <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
            {mode === "radar" ? "Radar Lala" : "Oportunidades Globais"}
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            {mode === "radar"
              ? "Produtos minerados pelo seu Scout pessoal."
              : "Descobertas autônomas do Lala Engine em tempo real."}
          </p>
        </div>

        <div className="flex bg-surface-container-high p-1.5 rounded-2xl border border-black/5">
          <button
            onClick={() => setMode("radar")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              mode === "radar" ? "bg-primary text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Zap className="w-4 h-4" /> Radar Pessoal
          </button>
          <button
            onClick={() => setMode("global")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              mode === "global" ? "bg-primary text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Globe className="w-4 h-4" /> Lala Global
          </button>
        </div>
      </div>

      {loadingGlobal ? (
        <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant">
          <div className="relative mb-8">
            <RefreshCw className="w-16 h-16 animate-spin text-primary opacity-20" />
            <Cpu className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="font-black uppercase tracking-[0.2em] text-xs mb-2">Conectando ao Motor Lala...</p>
        </div>
      ) : (
        <>
          {currentList.length === 0 ? (
            <div className="py-24 text-center bg-surface-container-low rounded-[4rem] border border-dashed border-black/10 flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="font-headline font-bold text-2xl text-on-surface">Radar Limpo</h3>
              <p className="text-on-surface-variant mt-2 max-w-sm mx-auto font-medium">
                Não encontramos produtos pendentes. Deseja varrer a Amazon agora?
              </p>
              <button
                onClick={handleForceScout}
                className="mt-8 px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5" /> DISPARAR SCOUT AGORA
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentList.map((product) => (
                <div
                  key={product?.id || Math.random()}
                  className="group bg-surface-container-lowest rounded-[2.5rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all relative"
                >
                  {approvingId === product?.id && (
                    <div className="absolute inset-0 bg-primary/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white p-8 text-center animate-in fade-in">
                      <Sparkles className="w-12 h-12 mb-4 animate-bounce" />
                      <h4 className="text-2xl font-black mb-2">Aprovado!</h4>
                      <p className="text-primary-container text-sm font-medium">Iniciando Squad...</p>
                    </div>
                  )}

                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={product?.image || product?.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt=""
                    />
                    <div className="absolute top-4 right-4">
                       <a
                        href={product.affiliate_link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/90 backdrop-blur rounded-xl shadow-sm text-on-surface hover:text-primary transition-colors flex items-center justify-center"
                       >
                          <Eye className="w-4 h-4" />
                       </a>
                    </div>
                  </div>
                  <div className="p-8 text-left">
                    <h3 className="font-bold text-on-surface text-xl mb-4 line-clamp-1">{product?.title || "Produto"}</h3>
                    <div className="p-4 bg-surface-container-low rounded-2xl mb-8">
                      <p className="text-xs font-medium text-on-surface leading-relaxed line-clamp-2">
                        {product?.description || "Analisado pelo motor Lala."}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApprove(product?.id)}
                      className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                    >
                      <Check className="w-5 h-5" /> APROVAR E ENVIAR AO SQUAD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
