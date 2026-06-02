import React, { useState } from "react";
import {
  Settings2,
  Globe,
  Fingerprint,
  Users,
  Cpu,
  BarChart3,
  Box,
  Check,
  X,
  Plus,
  User,
  Camera,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useSquad } from "../context/SquadContext";

export const SettingsView = () => {
  const { profile, updateProfile } = useSquad();
  const [connected, setConnected] = useState<string[]>(["Amazon Associates", "TikTok"]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<string | null>(null);

  const [editProfile, setEditProfile] = useState({
    full_name: profile?.full_name || "",
    avatar_url: profile?.avatar_url || "",
    niche: profile?.niche || "",
    amazon_id: profile?.amazon_id || "",
    hotmart_id: profile?.hotmart_id || "",
    kiwify_id: profile?.kiwify_id || "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateProfile(editProfile);
      alert("Configurações salvas! O Squad agora usará seus IDs reais.");
    } catch (err) {
      alert("Erro ao salvar configurações.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleConnect = (id: string) => {
    // ...
    if (connected.includes(id)) {
      if (confirm(`Deseja realmente desconectar de ${id}?`)) {
        setConnected((prev) => prev.filter((c) => c !== id));
      }
      return;
    }

    setShowAuthModal(id);
  };

  const confirmAuth = () => {
    const id = showAuthModal;
    if (!id) return;

    setShowAuthModal(null);
    setConnecting(id);

    setTimeout(() => {
      setConnected((prev) => [...prev, id]);
      setConnecting(null);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
          Configurações LalaFiliados
        </h1>
        <p className="text-on-surface-variant font-body mt-1">
          Gerencie integrações, acessos e sua infraestrutura de IA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* User Profile */}
          <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-black/5 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <User className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-headline font-bold text-xl text-on-surface">
                  Perfil do Afiliado
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Informações públicas e identidade no LalaFiliados.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-black/5">
                    <img
                      src={editProfile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop"}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-black/5 text-on-surface-variant hover:text-primary transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div className="text-left">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2 ml-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={editProfile.full_name}
                      onChange={(e) => setEditProfile({ ...editProfile, full_name: e.target.value })}
                      className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="text-left">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2 ml-1">
                      URL do Avatar
                    </label>
                    <input
                      type="text"
                      value={editProfile.avatar_url}
                      onChange={(e) => setEditProfile({ ...editProfile, avatar_url: e.target.value })}
                      className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                  {updatingProfile ? <Cpu className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  SALVAR ALTERAÇÕES
                </button>
              </div>
            </form>
          </div>

          {/* Marketplace Integrations */}
          <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-black/5 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Globe className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-headline font-bold text-xl text-on-surface">
                  Marketplaces de Afiliado
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Insira seus IDs para que a IA gere links automáticos de venda.
                </p>
              </div>
            </div>

            <div className="space-y-6">
               <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Box className="w-5 h-5 text-orange-500" />
                     </div>
                     <span className="font-black text-on-surface text-sm uppercase tracking-widest">Amazon Associates</span>
                  </div>
                  <div className="text-left">
                    <label className="text-[10px] font-black text-orange-700 uppercase tracking-widest block mb-2 ml-1">Seu ID de Associado (Store ID)</label>
                    <input
                      type="text"
                      placeholder="ex: seu-id-20"
                      value={editProfile.amazon_id}
                      onChange={(e) => setEditProfile({ ...editProfile, amazon_id: e.target.value })}
                      className="w-full bg-white border border-orange-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-surface-container-low rounded-3xl border border-black/5 space-y-3">
                     <span className="font-black text-[10px] uppercase tracking-widest text-on-surface-variant">Hotmart ID</span>
                     <input
                      type="text"
                      value={editProfile.hotmart_id}
                      onChange={(e) => setEditProfile({ ...editProfile, hotmart_id: e.target.value })}
                      className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                    />
                  </div>
                  <div className="p-6 bg-surface-container-low rounded-3xl border border-black/5 space-y-3">
                     <span className="font-black text-[10px] uppercase tracking-widest text-on-surface-variant">Kiwify Token</span>
                     <input
                      type="text"
                      value={editProfile.kiwify_id}
                      onChange={(e) => setEditProfile({ ...editProfile, kiwify_id: e.target.value })}
                      className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                    />
                  </div>
               </div>
            </div>
          </div>

          {/* Security & API */}
          <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-black/5 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-headline font-bold text-xl text-on-surface">
                  Segurança e API
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Sua chave de acesso e tokens de serviço.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-left">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2 ml-1">
                  Lala API Key
                </label>
                <div className="flex gap-3">
                  <input
                    type="password"
                    value="********************************"
                    readOnly
                    className="flex-1 bg-surface-container-low border-0 rounded-2xl px-6 py-4 text-sm font-mono outline-none"
                  />
                  <button className="p-4 bg-surface-container-high text-on-surface rounded-2xl hover:bg-surface-container-highest transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Subscription Card */}
          <div className="bg-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden text-left">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h4 className="font-headline font-black text-2xl mb-2">
                Plano Lala Pro
              </h4>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-8">
                Squad Ilimitado Ativo
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "8 Agentes Especialistas",
                  "IA Generativa HD",
                  "Vire o Mentor (YouTube)",
                  "Tracking Ilimitado",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-[10px] text-white/40">
                  Renova em 14 dias.{" "}
                  <span className="text-primary cursor-pointer hover:underline">
                    Upgrade agora
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-surface-container-lowest rounded-[3rem] p-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8">
              <Globe className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black font-headline text-on-surface mb-4">
              Conectar {showAuthModal}
            </h2>
            <p className="text-on-surface-variant font-medium leading-relaxed mb-10">
              Autorize o Lala Squad a sincronizar dados de produtos e métricas
              de anúncios.
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmAuth}
                className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                Autorizar Lala
              </button>
              <button
                onClick={() => setShowAuthModal(null)}
                className="flex-1 py-4 bg-surface-container-high text-on-surface font-black rounded-2xl hover:bg-surface-container-highest transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
