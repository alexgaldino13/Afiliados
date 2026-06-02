/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useSquad } from "./context/SquadContext";
import { useAuth } from "./context/AuthContext";
import { Login } from "./components/Login";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, CheckSquare, Globe, Link as LinkIcon, LogOut, Settings2, Sparkles, LayoutDashboard, Zap, Bell, Cpu, Image as ImageIcon, Users } from "lucide-react";
import {
  cn,
  MOCK_AGENTS,
} from "./lib/utils";

// Component Imports
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { PendingApprovals } from "./components/PendingApprovals";
import { ApprovedPosts } from "./components/ApprovedPosts";
import { CreationStudio } from "./components/CreationStudio";
import { AgentSquadView } from "./components/Orchestrator";
import { CreativeGallery } from "./components/CreativeGallery";
import { MentorView } from "./components/MentorView";
import { LinkManagement } from "./components/LinkManagement";
import { Checklist } from "./components/Checklist";
import { SettingsView } from "./components/SettingsView";
import { Onboarding } from "./components/Onboarding";
import { AcademyView } from "./components/AcademyView";
import { PostingSchedule } from "./components/PostingSchedule";

// --- Types ---
type View =
  | "analytics"
  | "pending"
  | "approved"
  | "studio"
  | "agents"
  | "creatives"
  | "links"
  | "checklist"
  | "settings"
  | "academy"
  | "mentor"
  | "schedule";

// --- Main App ---

export default function App() {
  const {
    products,
    campaigns,
    profile,
    notifications,
    approveProduct,
    isBackendOnline
  } = useSquad();
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>("analytics");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <Cpu className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (profile && !profile.niche) {
    return <Onboarding />;
  }

  const navItems = [
    { id: "analytics", icon: LayoutDashboard, label: "Dashboard" },
    { id: "pending", icon: Zap, label: "Radar Lala" },
    { id: "agents", icon: Users, label: "Lala Squad" },
    { id: "studio", icon: Sparkles, label: "Studio" },
    { id: "creatives", icon: ImageIcon, label: "Galeria" },
    { id: "academy", icon: Sparkles, label: "Lala Academy" },
    { id: "approved", icon: CheckSquare, label: "Campanhas" },
    { id: "schedule", icon: Calendar, label: "Cronograma" },
    { id: "links", icon: LinkIcon, label: "Links" },
    { id: "mentor", icon: Globe, label: "Mentor" },
    { id: "checklist", icon: CheckSquare, label: "Checklist" },
    { id: "settings", icon: Settings2, label: "Ajustes" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-container-lowest border-r border-black/5 h-screen sticky top-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10 group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black font-headline tracking-tighter text-on-surface">
              LALA<span className="text-primary">FILIADOS</span>
            </h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300",
                  currentView === item.id
                    ? "bg-primary text-white shadow-lg shadow-primary/10 translate-x-1"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-black/5">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-on-surface-variant hover:bg-error/5 hover:text-error transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair do LalaFiliados
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 relative">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-black/5 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="lg:hidden w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Cpu className="w-6 h-6" />
            </div>
            <div className={cn(
              "hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
              isBackendOnline
                ? "bg-green-50 text-green-700 border-green-200"
                : isBackendOnline === false
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-slate-50 text-slate-400 border-slate-200"
            )}>
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                isBackendOnline ? "bg-green-500 animate-pulse" : isBackendOnline === false ? "bg-red-500" : "bg-slate-300"
              )} />
              {isBackendOnline ? "Squad Operacional" : isBackendOnline === false ? "Squad Offline" : "Conectando Squad..."}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="p-3 bg-surface-container-low rounded-2xl text-on-surface-variant hover:text-primary transition-colors cursor-pointer relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-white" />
              </div>

              {/* Notification Dropdown */}
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-4 z-50">
                <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 px-2">
                  Notificações Squad
                </h4>
                <div className="space-y-2">
                  {(notifications || []).map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-4 hover:bg-surface-container-low rounded-2xl transition-colors text-left",
                        !n.read && "bg-primary/5"
                      )}
                    >
                      <p className="text-sm font-bold text-on-surface leading-tight">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-on-surface-variant mt-1">
                        {n.created_at ? new Date(n.created_at).toLocaleString('pt-BR') : "Agora"}
                      </p>
                    </div>
                  ))}
                  {(!notifications || notifications.length === 0) && (
                    <p className="text-center text-xs text-slate-400 py-4">Sem notificações no momento.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-black/5 mx-2" />

            <div className="flex items-center gap-4 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-on-surface leading-tight">
                  {profile?.full_name || user?.email?.split('@')[0] || "Usuário Lala"}
                </p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  {profile?.role === 'affiliate' ? 'Plano Lala Pro' : 'Admin'}
                </p>
              </div>
              <img
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop"}
                className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg group-hover:scale-105 transition-transform"
                alt=""
              />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="p-10 max-w-7xl mx-auto min-h-[calc(100vh-96px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {currentView === "analytics" && (
                <AnalyticsDashboard
                  onNavigate={setCurrentView}
                  stats={{
                    links: campaigns.length,
                    approved: campaigns.filter(c => c.status === 'ready' || c.status === 'published').length,
                    pending: products.length
                  }}
                />
              )}
              {currentView === "pending" && (
                <PendingApprovals
                  products={products}
                  onApprove={approveProduct}
                />
              )}
              {currentView === "approved" && (
                <ApprovedPosts
                  onPublish={async (item) => {
                    // Lógica de exportação movida para o componente ou tratada via contexto
                  }}
                  onReview={(item) => {
                    setCurrentView("studio");
                  }}
                />
              )}
              {currentView === "studio" && <CreationStudio />}
              {currentView === "agents" && (
                <AgentSquadView
                  onMissionComplete={() => {}}
                  onNavigate={setCurrentView}
                />
              )}
              {currentView === "creatives" && (
                <CreativeGallery
                  creatives={campaigns.map(c => ({
                    id: c.id,
                    title: c.title,
                    image: c.assets?.[0]?.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
                    status: c.status === 'published' ? 'Approved' : 'Ready',
                    type: 'Social Ad',
                    agent: 'Lala Squad',
                    copy: c.copy_aida?.text || '',
                    isVideo: c.assets?.some((a: any) => a.type === 'video'),
                    assets: c.assets,
                    business_dna: c.business_dna
                  }))}
                  onApprove={() => {}}
                  onReject={(id) => {}}
                  onNavigate={setCurrentView}
                />
              )}
              {currentView === "academy" && <AcademyView />}
              {currentView === "mentor" && <MentorView />}
              {currentView === "schedule" && <PostingSchedule />}
              {currentView === "links" && (
                <LinkManagement
                  links={[]}
                  onAddLink={() => {}}
                />
              )}
              {currentView === "checklist" && <Checklist />}
              {currentView === "settings" && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="w-full py-12 border-t border-surface-container-low px-10 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-8">
              {["Privacidade", "Termos de Serviço", "Docs API"].map((f) => (
                <a
                  key={f}
                  href="#"
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                >
                  {f}
                </a>
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              © 2024 Grupo LALA MIX. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </main>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl flex items-center justify-around px-2 z-[60]">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as View)}
            className={cn(
              "p-3 rounded-xl transition-all duration-300",
              currentView === item.id
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                : "text-slate-400",
            )}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>
    </div>
  );
}
