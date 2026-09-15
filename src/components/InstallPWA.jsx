import React, { useState, useEffect } from 'react';
import { Download, X, HelpCircle, ArrowDownSquare } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIosPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Detect iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // If it's iOS, we show the iOS install instructions instead of the native prompt
    if (isIos() && !window.navigator.standalone) {
      // Check if already dismissed in this session
      const dismissed = sessionStorage.getItem('pwa_ios_dismissed');
      if (!dismissed) {
        setShowIosPrompt(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismissIos = () => {
    setShowIosPrompt(false);
    sessionStorage.setItem('pwa_ios_dismissed', 'true');
  };

  if (isInstalled || isDismissed) return null;

  // Render for Android/Chrome/Edge (Native Prompt Available)
  if (deferredPrompt) {
    return (
      <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-white dark:bg-[#0E1F38] border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xl z-50 animate-in slide-in-from-bottom-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Instalar Aplicativo</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
              Adicione o Dorme Precioso à sua tela inicial para acesso rápido e offline.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handleInstallClick}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
              >
                Instalar Agora
              </button>
              <button 
                onClick={() => setIsDismissed(true)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                Agora não
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render for iOS (Manual Instructions)
  if (showIosPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 bg-white dark:bg-[#0E1F38] border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xl z-50 animate-in slide-in-from-bottom-5">
        <button onClick={handleDismissIos} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 mt-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
            <ArrowDownSquare className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Instalar no iPhone</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Para instalar, toque no ícone de Compartilhar <span className="inline-block w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded mx-0.5 text-center align-middle border border-slate-200 dark:border-slate-700">↑</span> na barra do Safari e selecione <strong>"Adicionar à Tela de Início"</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
