import React from 'react';
import { 
  LayoutDashboard, 
  Headphones, 
  Sliders, 
  Sparkles, 
  HeartHandshake, 
  Users, 
  Globe 
} from 'lucide-react';

export default function AdminHeaderTabs({
  activeTab,
  setActiveTab,
  audiobooksCount,
  momentsCount,
  prayersCount,
  usersCount,
  pendingUsersCount
}) {
  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'audiobooks', label: `Audiobooks (${audiobooksCount})`, icon: Headphones },
    { id: 'home', label: `Tela Inicial & Momentos (${momentsCount})`, icon: Sliders },
    { id: 'songs', label: 'Canção Especial', icon: Sparkles },
    { id: 'prayers', label: `Orações (${prayersCount})`, icon: HeartHandshake },
    { 
      id: 'users', 
      label: `Usuárias (${usersCount})`, 
      icon: Users,
      badge: pendingUsersCount > 0 ? `${pendingUsersCount} pendentes` : null
    },
    { id: 'platforms', label: 'Plataformas & Suporte', icon: Globe }
  ];

  return (
    <div className="w-full overflow-x-auto pb-1 no-scrollbar">
      <nav className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0D111C] border border-slate-800/90 shadow-sm min-w-full sm:min-w-0">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : 'text-slate-500'} />
              <span>{t.label}</span>
              {t.badge && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[9px] shadow-sm animate-pulse">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
