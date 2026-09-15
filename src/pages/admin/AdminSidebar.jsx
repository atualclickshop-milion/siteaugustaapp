import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Headphones, 
  Music2, 
  Heart, 
  Settings, 
  LogOut,
  Sparkles,
  Megaphone,
  Menu,
  X
} from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'ads', label: 'Anúncios', icon: Megaphone },
    { id: 'audiobooks', label: 'Audiobooks', icon: Headphones },
    { id: 'home', label: 'Momentos', icon: Sparkles },
    { id: 'songs', label: 'Músicas', icon: Music2 },
    { id: 'prayers', label: 'Orações', icon: Heart },
    { id: 'platforms', label: 'Configurações', icon: Settings },
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* 1. MOBILE TOP HEADER (Visible on md:hidden) */}
      <div className="md:hidden w-full bg-[#0C1B3A] text-white border-b border-[#1a2d52] sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              aria-label="Abrir Menu"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-serif font-bold text-sm">✦</span>
              <span className="font-serif italic font-bold text-sm tracking-wide">
                Admin — Precioso
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-rose-300 hover:bg-rose-500/10 transition-all"
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Horizontal Scrollable Quick Tabs on Mobile */}
        <div className="flex items-center gap-1 px-3 pb-2.5 overflow-x-auto no-scrollbar border-t border-white/5 pt-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white bg-white/5'
                }`}
              >
                <Icon size={13} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MOBILE DRAWER OVERLAY (When opened via menu icon) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#0C1B3A] text-white flex flex-col justify-between p-6 animate-fadeIn">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className="text-slate-950 font-serif">✦</span>
                </div>
                <div>
                  <h2 className="font-serif italic font-bold text-base">Dorme, Precioso</h2>
                  <span className="text-[10px] text-amber-300 uppercase tracking-widest font-semibold block">Painel Administrativo</span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-xl bg-white/10 text-white"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/20 text-rose-300 font-bold text-sm border border-rose-500/30"
          >
            <LogOut size={18} />
            <span>Sair do Painel</span>
          </button>
        </div>
      )}

      {/* 3. DESKTOP SIDEBAR (Visible on md:flex) */}
      <aside className="hidden md:flex w-[240px] min-h-screen bg-[#0C1B3A] flex-col justify-between shrink-0 border-r border-[#1a2d52]">
        <div>
          <div className="px-5 pt-6 pb-5 flex flex-col items-center gap-1 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white text-lg font-serif">✦</span>
            </div>
            <h1 className="text-sm font-bold text-white tracking-tight text-center mt-1.5 font-serif italic leading-tight">
              Dorme, Dorme,<br />Precioso
            </h1>
            <span className="text-[10px] text-amber-300/80 font-semibold uppercase tracking-widest mt-0.5">
              Admin
            </span>
          </div>

          <nav className="flex flex-col gap-0.5 px-3 pt-4">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-slate-300/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-amber-300' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-3 pb-5">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-rose-300/80 hover:text-rose-200 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut size={17} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
