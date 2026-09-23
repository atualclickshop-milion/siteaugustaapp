import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Sparkles, BookOpen, Music2, Heart, User, ShieldCheck, Timer } from 'lucide-react';

export default function Header() {
  const { currentView, navigateTo, user, theme, toggleTheme, setIsCustomTimerModalOpen, sleepTimerRemaining, homeSettings } = useApp();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: Moon },
    { id: 'library', label: 'Biblioteca', icon: BookOpen },
    ...(homeSettings?.musicTabEnabled !== false ? [{ id: 'song-special', label: 'A Canção ✨', icon: Music2, highlight: true }] : []),
    { id: 'prayers', label: 'Orações 🙏', icon: Sparkles },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 dark:bg-night-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/5 transition-colors shadow-sm dark:shadow-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => navigateTo('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-br from-gold-400 via-marian-600 to-indigo-700 shadow-[0_0_15px_rgba(37,99,235,0.2)] flex items-center justify-center">
            <img 
              src="/dorme-dorme-precioso-capa.png" 
              alt="Dorme, Dorme, Precioso" 
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gold-400 border-2 border-white dark:border-night-950 animate-pulse"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl text-marian-900 dark:text-white tracking-tight group-hover:text-marian-600 dark:group-hover:text-gold-300 transition-colors">
                Dorme, Precioso
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-marian-50 dark:bg-marian-900/60 text-marian-700 dark:text-marian-300 border border-marian-200 dark:border-marian-700/40">
                <span className="w-1.5 h-1.5 rounded-full bg-marian-500 animate-ping"></span>
                Vigília Noturna
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 tracking-wide font-normal hidden sm:inline">
              Acolhendo mamães na madrugada 🤍
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-night-900/60 p-1.5 rounded-full border border-slate-200 dark:border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-night-950 shadow-sm'
                      : 'bg-marian-600 text-white shadow-md shadow-marian-600/30'
                    : item.highlight
                      ? 'text-gold-600 dark:text-gold-400 hover:bg-gold-500/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-marian-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={14} className={isActive ? 'animate-bounce' : ''} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Clock, Sleep Timer, Theme Switch, Admin, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Vigil Live Clock */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-night-900/80 border border-slate-200 dark:border-white/5 text-[11px] text-slate-700 dark:text-slate-300">
            <Moon size={12} className="text-marian-600 dark:text-gold-400 fill-current" />
            <span className="font-mono font-bold text-marian-900 dark:text-gold-200">{timeStr || '03:30'}</span>
          </div>

          {/* Sleep Timer Quick Pill */}
          <button
            onClick={() => setIsCustomTimerModalOpen(true)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-mono transition-all ${
              sleepTimerRemaining
                ? 'bg-gold-500/20 text-gold-700 dark:text-gold-300 border-gold-500/50 shadow-sm font-bold'
                : 'bg-slate-100 dark:bg-night-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:text-marian-600 dark:hover:text-white'
            }`}
            title="Temporizador de Sono (Sleep Timer)"
          >
            <Timer size={14} />
            <span className="hidden sm:inline">
              {sleepTimerRemaining ? `${Math.ceil(sleepTimerRemaining / 60)}m` : 'Timer'}
            </span>
          </button>

          {/* Theme Toggle Button (LIGHT / DARK) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-night-900/80 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-gold-400 hover:scale-105 active:scale-95 transition-all shadow-sm"
            title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro Noturno'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>


          {/* User Profile Avatar / Login */}
          {user ? (
            <button
              onClick={() => navigateTo('profile')}
              title="Meu perfil"
              className="flex items-center gap-1.5 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-100 dark:bg-night-900 border border-marian-300 dark:border-marian-500/30 text-xs text-slate-700 dark:text-slate-200 hover:border-marian-500 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-marian-700 to-marian-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm overflow-hidden">
                {(user.avatarUrl || user.avatar_url || (user.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http') || user.avatar.startsWith('/')))) ? (
                  <img 
                    src={user.avatarUrl || user.avatar_url || user.avatar} 
                    alt={user.name || "Perfil"} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  (user.name ? user.name.charAt(0) : 'U')
                )}
              </div>
              <span className="hidden sm:inline font-bold text-marian-900 dark:text-slate-200 max-w-[80px] truncate">
                {user.name?.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="px-3.5 py-1.5 rounded-full bg-marian-600 hover:bg-marian-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              Entrar
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
