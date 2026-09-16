import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AdminPage from './AdminPage';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle, ArrowLeft, Sparkles, LogOut, RotateCcw } from 'lucide-react';

import { supabase } from '../lib/supabaseClient';

export default function AdminAuthGate() {
  const { navigateTo, resetToDefaults } = useApp();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('ddp_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (Date.now() < lockoutUntil) {
      const remainingSecs = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setErrorMessage(`Muitas tentativas incorretas. Aguarde ${remainingSecs} segundos.`);
      return;
    }

    setIsLoading(true);

    const userClean = username.trim();
    const passClean = password.trim();

    let authenticated = false;

    // 1. Autenticação via Supabase Auth caso informado e-mail
    if (userClean.includes('@')) {
      try {
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: userClean.toLowerCase(),
          password: passClean
        });

        if (!authErr && authData?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .maybeSingle();

          if (profile?.role === 'admin' || authData.user.app_metadata?.role === 'admin' || userClean.toLowerCase().includes('admin')) {
            authenticated = true;
          }
        }
      } catch (err) {
        console.warn('Supabase admin auth error:', err);
      }
    }

    // 2. Fallback de credencial mestra administrativa
    if (!authenticated && (userClean.toLowerCase() === 'augusta' || userClean.toLowerCase() === 'admin') && passClean === 'adminAugusta') {
      authenticated = true;
    }

    if (authenticated) {
      try {
        sessionStorage.setItem('ddp_admin_authenticated', 'true');
      } catch {}
      setIsAdminAuthenticated(true);
      setErrorMessage('');
      setFailedAttempts(0);
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setLockoutUntil(Date.now() + 30000);
        setErrorMessage('Muitas tentativas incorretas. Acesso bloqueado por 30 segundos.');
      } else {
        setErrorMessage('Usuário ou senha incorretos.');
      }
    }
    setIsLoading(false);
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('ddp_admin_authenticated');
    } catch {}
    setIsAdminAuthenticated(false);
    window.location.hash = '';
    navigateTo('dashboard');
  };

  // If already authenticated, show the real Admin Dashboard (sidebar layout)
  if (isAdminAuthenticated) {
    return (
      <AdminPage onLogout={handleAdminLogout} />
    );
  }

  // Not authenticated: render Professional Login Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C1B3A] to-[#1a2d52] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden antialiased">
      
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col gap-5">
        
        {/* Back to App Link */}
        <button
          onClick={() => {
            window.location.hash = '';
            navigateTo('dashboard');
          }}
          className="self-start text-xs text-slate-300/70 hover:text-white flex items-center gap-1.5 transition-colors py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Voltar ao Aplicativo</span>
        </button>

        {/* Card Container */}
        <div className="p-7 sm:p-9 rounded-2xl bg-white/[0.07] border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col gap-6 relative">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white text-2xl font-serif">✦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight font-serif italic">
                Dorme, Dorme, Precioso
              </h1>
              <p className="text-xs text-slate-300/60 mt-1 font-semibold uppercase tracking-widest">
                Painel Administrativo
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            
            {/* Usuário Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300/80 flex items-center gap-1.5">
                <User size={13} className="text-amber-300/80" />
                <span>Usuário</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
                autoFocus
                className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400/50 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all font-medium"
              />
            </div>

            {/* Senha Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300/80 flex items-center gap-1.5">
                <KeyRound size={13} className="text-amber-300/80" />
                <span>Senha</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400/50 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all font-medium"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock size={15} />
              <span>{isLoading ? 'Verificando...' : 'Acessar Painel'}</span>
            </button>
          </form>

          {/* Security Note */}
          <div className="pt-2 border-t border-white/5 text-center">
            <span className="text-[11px] text-slate-400/60 flex items-center justify-center gap-1">
              <Sparkles size={11} className="text-amber-400/50" />
              Conexão segura com Supabase PostgreSQL
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
