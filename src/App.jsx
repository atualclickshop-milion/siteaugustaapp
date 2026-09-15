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
  const { currentView, navigateTo, isPlayerVisible } = useApp();

  // Listen for special direct URL access: #admin, /admin, or ?admin
  useEffect(() => {
    const handleUrlRouting = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || path === '/admin' || search.includes('admin')) {
        navigateTo('admin');
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);

    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, [navigateTo]);

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

  return (
    <div className="min-h-screen bg-[#0A1628] text-slate-800 flex flex-col justify-between relative selection:bg-amber-500 selection:text-slate-900 transition-colors duration-300 font-sans">
      
      {/* Header */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'library' && <Library />}
        {currentView === 'audiobook-detail' && <AudiobookDetail />}
        {currentView === 'song-special' && <SongSpecialPage />}
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

      {/* Mobile Ergonomic Bottom Navigation Bar */}
      <nav className={`md:hidden fixed inset-x-0 z-40 bg-white/95 dark:bg-[#071325]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 py-2 px-4 flex items-center justify-around shadow-lg transition-colors duration-300 ${
        isPlayerVisible ? 'bottom-[68px]' : 'bottom-0'
      }`}>
        {[
          { id: 'dashboard', label: 'Início', icon: Moon },
          { id: 'library', label: 'Biblioteca', icon: BookOpen },
          { id: 'song-special', label: 'Música', icon: Music },
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
