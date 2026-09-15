import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, Phone, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AuthPage() {
  const { loginUser, registerUser, supportSettings } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [babyName, setBabyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [forgotSent, setForgotSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setAuthError(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        const res = await registerUser({
          name: name.trim() || "Maria Silva",
          email: email.trim(),
          phone: phone.trim() || "",
          babyName: babyName.trim() || "Augusta",
          password: password || "123456"
        });
        if (!res?.success) {
          setAuthError(res?.message || 'Erro ao registrar usuário.');
        } else if (res?.pending) {
          setIsPendingApproval(true);
        }
      } else {
        const res = await loginUser({
          email: email.trim(),
          password: password,
          name: name.trim() || "Maria Silva",
          babyName: babyName.trim() || "Augusta"
        });
        if (!res?.success) {
          if (res?.reason === 'pending') {
            setIsPendingApproval(true);
          } else {
            setAuthError(res?.message || 'E-mail ou senha incorretos.');
          }
        }
      }
    } catch (err) {
      setAuthError(err?.message || 'Erro ao processar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;
    setAuthError(null);
    const targetEmail = (email || '').trim();
    if (!targetEmail) {
      setAuthError('Por favor, digite seu e-mail cadastrado.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: window.location.origin
      });
      if (error) {
        console.warn('Supabase resetPassword error:', error);
      }
      setForgotSent(true);
    } catch (err) {
      console.warn('Reset password error:', err);
      setForgotSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    setAuthError(null);
    loginUser({
      name: "Maria Silva",
      email: "maria.silva@email.com",
      phone: "(11) 99999-9999",
      babyName: "Augusta",
      password: "123"
    });
  };

  return (
    <div className="min-h-screen bg-[#050D1A] text-white flex justify-center items-center font-sans relative overflow-x-hidden">
      
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md min-h-screen bg-[#061224] flex flex-col justify-between relative shadow-2xl overflow-hidden border-x border-slate-800/40">
        
        {/* Top Hero Image Container */}
        <div className="relative w-full h-[450px] sm:h-[480px] shrink-0 overflow-hidden bg-[#061224]">
          <img 
            src="/nossa-senhora-header.jpg" 
            alt="Nossa Senhora segurando o bebê" 
            className="w-full h-full object-cover object-[center_40%] filter brightness-105 transition-all"
          />
          {/* Smooth Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#061224] pointer-events-none"></div>
          
          {/* Title & Moon Overlay right above the email input field */}
          <div className="absolute bottom-2 inset-x-0 flex flex-col items-center text-center px-6 z-10 bg-gradient-to-t from-[#061224] via-[#061224]/80 to-transparent pt-6 pb-1">
            <div className="flex items-center gap-2 text-amber-300/90 text-xs mb-0.5 drop-shadow">
              <span>✦</span>
              <span className="text-sm">🌙</span>
              <span>✦</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif italic text-amber-100 tracking-wide font-normal leading-tight drop-shadow-lg">
              Dorme, Dorme, Precioso
            </h1>

            <p className="text-[11px] text-slate-200/90 font-medium mt-0.5 max-w-xs leading-relaxed drop-shadow-md">
              Acolhendo mamães que amamentam na madrugada.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-6 sm:px-8 pb-10 pt-4 flex flex-col justify-end gap-3 z-10">
          
          {authError && (
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 text-left">
              <AlertCircle size={16} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {isPendingApproval ? (
            <div className="space-y-4 text-center py-2 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 animate-pulse">
                <Clock size={32} />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-serif text-amber-300">Aguardando Aprovação</h3>
                <p className="text-xs text-slate-300 leading-relaxed px-1">
                  Seu cadastro foi realizado e está aguardando a confirmação da administradora.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1830] border border-amber-400/30 text-xs text-slate-200 text-left space-y-2.5">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Sparkles size={16} />
                  <span>Acesso por Confirmação da Admin</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Para garantir a segurança e acolhimento das mães, novos acessos passam por validação. Assim que sua conta for aprovada, você conseguirá acessar imediatamente com seu e-mail e senha.
                </p>
                {email && (
                  <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>E-mail:</span>
                    <span className="text-white font-mono font-semibold truncate max-w-[200px]">{email}</span>
                  </div>
                )}
              </div>

              {supportSettings?.whatsappSupportEnabled && supportSettings?.whatsappSupportNumber && (
                <a
                  href={`https://wa.me/${supportSettings.whatsappSupportNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(supportSettings.whatsappSupportMessage || "Olá Augusta, criei meu cadastro e gostaria de solicitar a liberação do meu acesso.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-full text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Phone size={15} />
                  <span>Falar com o Suporte no WhatsApp</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsPendingApproval(false);
                  setIsRegister(false);
                  setAuthError(null);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#D5A754] via-[#C69C4E] to-[#B3873B] hover:brightness-110 active:scale-98 text-slate-950 font-serif rounded-full text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                Voltar para a tela de Login
              </button>
            </div>
          ) : isForgot ? (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-center">
              <h3 className="text-sm font-bold text-amber-200">Recuperar Senha via Supabase</h3>
              {forgotSent ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex flex-col items-center gap-1.5 text-center">
                  <CheckCircle2 size={24} className="text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-300">Link enviado com sucesso!</span>
                  <span>Verifique a sua caixa de entrada no e-mail <strong>{email}</strong> para redefinir sua senha.</span>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-300">Digite seu e-mail abaixo para receber um link seguro de redefinição de senha.</p>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Seu e-mail cadastrado"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-5 py-3.5 rounded-full bg-[#061224]/80 border border-slate-600/70 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseDown={(e) => {
                      if (email.trim()) {
                        e.preventDefault();
                        handleForgotPassword(e);
                      }
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D5A754] via-[#C69C4E] to-[#B3873B] hover:brightness-110 active:scale-98 text-slate-950 font-serif rounded-full text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                        <span>Enviando link...</span>
                      </>
                    ) : (
                      <span>Enviar Link de Redefinição</span>
                    )}
                  </button>
                </>
              )}
              <button 
                type="button" 
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsForgot(false);
                  setForgotSent(false);
                  setAuthError(null);
                }}
                onClick={() => {
                  setIsForgot(false);
                  setForgotSent(false);
                  setAuthError(null);
                }} 
                className="text-xs text-slate-400 hover:text-white underline block mx-auto pt-1 cursor-pointer"
              >
                Voltar ao Login
              </button>
            </form>
          ) : (
            <div>
              {/* Segmented Mode Switcher */}
              <div className="flex bg-[#0A1830] p-1 rounded-2xl border border-slate-700/60 mb-3.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setAuthError(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    !isRegister ? 'bg-gradient-to-r from-[#D5A754] via-[#C69C4E] to-[#B3873B] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setAuthError(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    isRegister ? 'bg-gradient-to-r from-[#D5A754] via-[#C69C4E] to-[#B3873B] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Criar Nova Conta
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                
                {isRegister && (
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-3.5 rounded-full bg-[#061224]/80 border border-slate-600/70 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="Seu Telefone / WhatsApp (com DDD)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-11 pr-5 py-3.5 rounded-full bg-[#061224]/80 border border-slate-600/70 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nome do bebê (opcional)"
                        value={babyName}
                        onChange={(e) => setBabyName(e.target.value)}
                        className="w-full px-5 py-3.5 rounded-full bg-[#061224]/80 border border-slate-600/70 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </>
                )}

                {/* Email Input */}
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-5 py-3.5 rounded-full bg-[#061224]/80 border border-slate-600/70 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-full bg-[#061224]/80 border border-slate-600/70 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Main Golden Submit Button with Single-Click Protection & Spinner */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D5A754] via-[#C69C4E] to-[#B3873B] hover:brightness-110 active:scale-98 text-slate-950 font-serif text-sm font-bold shadow-lg shadow-amber-900/40 tracking-wide transition-all mt-1 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>{isRegister ? 'Criando conta...' : 'Entrando...'}</span>
                    </>
                  ) : (
                    <span>{isRegister ? 'Criar minha conta' : 'Entrar'}</span>
                  )}
                </button>

                {!isRegister && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsForgot(true);
                      setForgotSent(false);
                      setAuthError(null);
                    }}
                    onClick={() => {
                      setIsForgot(true);
                      setForgotSent(false);
                      setAuthError(null);
                    }}
                    className="text-xs text-slate-300 hover:text-amber-300 underline underline-offset-4 text-center mt-1 cursor-pointer"
                  >
                    Esqueci minha senha
                  </button>
                )}
              </form>

              {/* Clear Switch Link */}
              <p className="text-center text-xs text-slate-400 mt-3 pt-1">
                {isRegister ? (
                  <>
                    Já possui uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsRegister(false); setAuthError(null); }}
                      className="text-amber-400 font-semibold hover:underline"
                    >
                      Faça Login
                    </button>
                  </>
                ) : (
                  <>
                    Ainda não tem conta?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsRegister(true); setAuthError(null); }}
                      className="text-amber-400 font-semibold hover:underline"
                    >
                      Cadastre-se grátis
                    </button>
                  </>
                )}
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
