import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Mail, Lock, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export const Login = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
        alert("Conta criada! Verifique seu e-mail (se aplicável) ou faça login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || "Erro na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/40 mx-auto mb-8 transform hover:rotate-12 transition-transform duration-500">
            <Cpu className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-white font-headline tracking-tighter mb-2">LalaFiliados</h1>
          <p className="text-slate-400 font-medium tracking-tight">Sua Força-Tarefa de IA para Marketing de Afiliados</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="flex bg-black/40 p-1.5 rounded-2xl mb-10 border border-white/5">
            <button 
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                isLogin ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
              )}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                !isLogin ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
              )}
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Nome Completo</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="Como quer ser chamado?"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 text-left">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="exemplo@lalamix.com"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs font-bold animate-shake">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Cpu className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'INICIAR SQUAD' : 'CRIAR CONTA'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4 justify-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <Zap className="w-3 h-3 text-secondary" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Fast Sync</span>
            </div>
          </div>
        </div>

        <p className="mt-12 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] text-center">
          LalaFiliados &copy; 2026 - Grupo LALA MIX
        </p>
      </motion.div>
    </div>
  );
};
