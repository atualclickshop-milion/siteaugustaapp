import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import PlayerBottom from './components/PlayerBottom';
import FullPlayerModal from './components/FullPlayerModal';
import NursingTimerModal from './components/NursingTimerModal';
import CustomTimerModal from './components/CustomTimerModal';
import BreathingModal from './components/BreathingModal';
import AdModal from './components/AdModal';
import WelcomeOnboardingModal from './components/WelcomeOnboardingModal';
import InstallPWA from './components/InstallPWA';

// Pages
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import AudiobookDetail from './pages/AudiobookDetail';
import SongSpecialPage from './pages/SongSpecialPage';
import PrayersPage from './pages/PrayersPage';
import ProfilePage from './pages/ProfilePage';
import AdminAuthGate from './pages/AdminAuthGate';
import AuthPage from './pages/AuthPage';
import WelcomePage from './pages/WelcomePage';

// Mobile Bottom Nav Icons
import { Moon, BookOpen, Music, Heart, User } from 'lucide-react';

function AppContent() {
  const { currentView, navigateTo, isPlayerVisible, currentTrack, homeSettings, user } = useApp();

  // Listen for browser navigation (Back / Forward) or direct URL route on mount
  useEffect(() => {
    const handleUrlRouting = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      
      if (hash.includes('admin') || path.includes('/admin') || search.includes('admin')) {
        navigateTo('admin');
      } else if (hash.includes('login') || path.includes('/login') || search.includes('login')) {
        navigateTo('login');
      } else if (hash.includes('welcome') || path.includes('/welcome') || search.includes('welcome')) {
        navigateTo('welcome');
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);

    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Welcome / Landing page for non-authenticated visitors
  if (currentView === 'welcome') {
    return <WelcomePage />;
  }

  // If user is on dedicated admin route
  if (currentView === 'admin') {
    return <AdminAuthGate />;
  }

  // If user is on login page
  if (currentView === 'login') {
    return <AuthPage />;
  }

  const isMusicDisabledForUser = homeSettings?.musicTabEnabled === false && user?.role !== 'admin';

  return (
    <div className="min-h-screen bg-[#0A1628] text-slate-800 flex flex-col justify-between relative selection:bg-amber-500 selection:text-slate-900 transition-colors duration-300 font-sans">
      
      {/* Header */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'library' && <Library />}
        {currentView === 'audiobook-detail' && <AudiobookDetail />}
        {currentView === 'song-special' && (
          isMusicDisabledForUser ? (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-white max-w-md mx-auto pt-24">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4 border border-amber-500/30 animate-pulse">
                <Music size={32} />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400 mb-2">Lançamento em Breve</span>
              <h2 className="text-2xl font-bold font-serif mb-3">Músicas & Canções Especiais</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Augusta está preparando com muito carinho novidades musicais e melodias de acolhimento para o seu bebê. Em breve estará disponível!
              </p>
              <button
                onClick={() => navigateTo('dashboard')}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Voltar ao Início
              </button>
            </div>
          ) : (
            <SongSpecialPage />
          )
        )}
        {currentView === 'prayers' && <PrayersPage />}
        {currentView === 'profile' && <ProfilePage />}
      </main>

      {/* Persistent Bottom Audio Player Bar (when visible) */}
      {isPlayerVisible && <PlayerBottom />}

      {/* Expanded Full Screen Player Modal */}
      <FullPlayerModal />

      {/* Nursing Session Timer Modal */}
      <NursingTimerModal />

      {/* Custom Sleep Timer Modal */}
      <CustomTimerModal />

      {/* Breathing 4-7-8 Rhythm Exercise Modal */}
      <BreathingModal />

      {/* Dynamic Announcement / Ad Popup Modal */}
      <AdModal />

      {/* Welcome Onboarding Modal for New Users */}
      <WelcomeOnboardingModal />

      {/* Global PWA Install Prompt */}
      <InstallPWA />

      {/* Mobile Ergonomic Bottom Navigation Bar */}
      <nav className={`md:hidden fixed inset-x-0 z-40 bg-white/95 dark:bg-[#071325]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 py-2 px-4 flex items-center justify-around shadow-lg transition-colors duration-300 ${
        (isPlayerVisible && currentTrack) ? 'bottom-[68px]' : 'bottom-0'
      }`}>
        {[
          { id: 'dashboard', label: 'Início', icon: Moon },
          { id: 'library', label: 'Biblioteca', icon: BookOpen },
          ...(homeSettings?.musicTabEnabled !== false ? [{ id: 'song-special', label: 'Música', icon: Music }] : []),
          { id: 'prayers', label: 'Oração', icon: Heart },
          { id: 'profile', label: 'Perfil', icon: User }
        ].map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-amber-500 dark:text-amber-400 font-bold scale-105' 
                  : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
