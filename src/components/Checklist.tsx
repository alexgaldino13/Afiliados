import React from "react";
import {
  CheckSquare,
  Sparkles,
} from "lucide-react";

export const Checklist = () => {
  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
          Checklist de Decolagem
        </h1>
        <p className="text-on-surface-variant font-body mt-1">
          Passos essenciais para garantir que sua campanha performe em escala.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          {
            title: "Configuração de Pixel",
            desc: "Pixel da Meta e TikTok Ads instalados e testados.",
            status: "done",
          },
          {
            title: "Criativos em Variação",
            desc: "Pelo menos 3 variações de ganchos geradas pelo Squad.",
            status: "done",
          },
          {
            title: "Página de Destino",
            desc: "Página otimizada para mobile com tempo de carga < 2s.",
            status: "pending",
          },
          {
            title: "Públicos Lookalike",
            desc: "Audiências baseadas em compradores mapeadas.",
            status: "pending",
          },
          {
            title: "Links de Afiliado",
            desc: "Redirecionamentos Nexus testados e ativos.",
            status: "done",
          },
          {
            title: "Orçamento de Escala",
            desc: "Cálculo de CPA máximo definido pelo Orquestrador.",
            status: "pending",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest p-8 rounded-[2rem] border border-black/5 shadow-sm flex items-start gap-6 group hover:border-primary/20 transition-all text-left"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.status === "done" ? "bg-green-100 text-green-600" : "bg-surface-container-high text-on-surface-variant"}`}
            >
              {item.status === "done" ? (
                <CheckSquare className="w-6 h-6" />
              ) : (
                <div className="w-5 h-5 border-2 border-current rounded-md" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-on-surface text-lg mb-1">
                {item.title}
              </h4>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
