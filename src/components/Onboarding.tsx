import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Target,
  MessageSquare,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Rocket
} from "lucide-react";
import { cn } from "../lib/utils";
import { useSquad } from "../context/SquadContext";

export const Onboarding = () => {
  const { updateProfile } = useSquad();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    niche: "",
    brand_voice: "",
  });
  const [isFinishing, setIsFinishing] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");

  const handleAiSuggestion = async () => {
    if (!aiInput) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/agents/onboarding-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: aiInput })
      });
      const suggestion = await res.json();
      setData({
        niche: suggestion.niche,
        brand_voice: suggestion.brand_voice
      });
      setAiExplanation(suggestion.explanation);
      setStep(4); // Go to review step
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const niches = [
    "Cozinha Prática",
    "Gadgets de Produtividade",
    "Pets e Cuidados",
    "Beleza e Estética",
    "Saúde Natural",
    "Finanças Pessoais",
  ];

  const voices = [
    { id: "autoridade", label: "Autoridade Clássica", desc: "Sério, direto e baseado em fatos." },
    { id: "amigavel", label: "Amigável / Vizinho", desc: "Descontraído, usa gírias leves e emojis." },
    { id: "agressivo", label: "Agressivo / Direct Response", desc: "Foco total em dor, urgência e escassez." },
    { id: "minimalista", label: "Minimalista / Luxo", desc: "Sofisticado, poucas palavras, foco na estética." },
  ];

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await updateProfile({
        ...data,
        role: 'affiliate'
      });
    } catch (err) {
      console.error(err);
      setIsFinishing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050505] z-[200] flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-2xl w-full text-center"
          >
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/40 mx-auto mb-8 animate-bounce">
              <Cpu className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-black text-white font-headline tracking-tighter mb-4 text-center">
              Bem-vindo ao <span className="text-primary">LalaFiliados</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8 text-center">
              Antes de começarmos a minerar lucro, precisamos definir seu **território de atuação**.
            </p>

            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 mb-8 text-left">
               <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 block">Sugestão Automática via IA</label>
               <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ex: Quero vender produtos de tecnologia que facilitam o dia a dia e ter uma comunicação jovem..."
                  className="w-full bg-transparent border-0 text-white font-medium outline-none resize-none h-24 placeholder:text-slate-600"
               />
               <button
                  onClick={handleAiSuggestion}
                  disabled={!aiInput || isAiLoading}
                  className="mt-4 w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
               >
                  {isAiLoading ? <Cpu className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  DEFINIR VIA INTELIGÊNCIA ARTIFICIAL
               </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
               <div className="h-[1px] bg-white/10 flex-1" />
               <span className="text-[10px] font-black text-slate-600 uppercase">ou configure manualmente</span>
               <div className="h-[1px] bg-white/10 flex-1" />
            </div>

            <button
              onClick={() => setStep(2)}
              className="px-12 py-5 bg-white/10 text-white font-black rounded-2xl border border-white/10 hover:bg-white/20 transition-all flex items-center gap-3 mx-auto"
            >
              CONFIGURAR MANUALMENTE <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl w-full"
          >
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">1</div>
              <div className="w-20 h-1 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/2" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-black">2</div>
            </div>

            <h2 className="text-4xl font-black text-white text-center mb-4">Qual seu Nicho Principal?</h2>
            <p className="text-slate-400 text-center mb-12">O Scout focará a mineração global nestas categorias.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {niches.map((n) => (
                <button
                  key={n}
                  onClick={() => setData({ ...data, niche: n })}
                  className={cn(
                    "p-6 rounded-3xl border-2 transition-all text-left group",
                    data.niche === n
                      ? "bg-primary/10 border-primary text-white shadow-lg shadow-primary/10"
                      : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10"
                  )}
                >
                  <Target className={cn("w-6 h-6 mb-3 transition-colors", data.niche === n ? "text-primary" : "text-slate-600")} />
                  <span className="font-bold block">{n}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center text-center">
              <button
                disabled={!data.niche}
                onClick={() => setStep(3)}
                className="px-12 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 mx-auto"
              >
                PRÓXIMO PASSO <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl w-full"
          >
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">
                <Check className="w-4 h-4" />
              </div>
              <div className="w-20 h-1 bg-primary rounded-full" />
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">2</div>
            </div>

            <h2 className="text-4xl font-black text-white text-center mb-4">Qual o Tom de Voz do Squad?</h2>
            <p className="text-slate-400 text-center mb-12">Como o Creative Squad deve escrever suas copies?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {voices.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setData({ ...data, brand_voice: v.id })}
                  className={cn(
                    "p-8 rounded-[2.5rem] border-2 transition-all text-left flex gap-6 items-center",
                    data.brand_voice === v.id
                      ? "bg-secondary/10 border-secondary text-white shadow-lg shadow-secondary/10"
                      : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                    data.brand_voice === v.id ? "bg-secondary text-white" : "bg-white/5"
                  )}>
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="font-black block text-lg mb-1">{v.label}</span>
                    <span className="text-xs font-medium opacity-60 leading-relaxed">{v.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-4 text-center">
               <button
                onClick={() => setStep(2)}
                className="px-8 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
              >
                VOLTAR
              </button>
              <button
                disabled={!data.brand_voice || isFinishing}
                onClick={handleFinish}
                className="px-12 py-5 bg-secondary text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {isFinishing ? (
                  <>ATIVANDO SQUAD... <Cpu className="w-5 h-5 animate-spin" /></>
                ) : (
                  <>FINALIZAR SETUP <Sparkles className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full"
          >
            <div className="bg-primary/20 w-20 h-20 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-black text-white text-center mb-4">Configuração Sugerida</h2>
            <p className="text-slate-400 text-center mb-12">{aiExplanation}</p>

            <div className="grid grid-cols-1 gap-4 mb-12">
               <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
                  <div className="text-left">
                     <p className="text-[10px] font-black text-primary uppercase mb-1">Nicho Definido</p>
                     <p className="text-2xl font-black text-white">{data.niche}</p>
                  </div>
                  <Target className="w-8 h-8 text-primary/40" />
               </div>
               <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
                  <div className="text-left">
                     <p className="text-[10px] font-black text-secondary uppercase mb-1">Tom de Voz</p>
                     <p className="text-2xl font-black text-white uppercase">{data.brand_voice}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-secondary/40" />
               </div>
            </div>

            <div className="flex justify-center gap-4 text-center">
               <button
                onClick={() => setStep(1)}
                className="px-8 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
              >
                REFAZER
              </button>
              <button
                disabled={isFinishing}
                onClick={handleFinish}
                className="px-12 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                {isFinishing ? (
                  <>ATIVANDO... <Cpu className="w-5 h-5 animate-spin" /></>
                ) : (
                  <>ACEITAR E INICIAR <Rocket className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
        <Zap className="w-3 h-3" /> Lala Intelligence v2.6
      </div>
    </div>
  );
};
