import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Heart, 
  ExternalLink, 
  Music, 
  Disc, 
  Check, 
  Copy,
  MessageCircle,
  Moon,
  Headphones,
  Users
} from 'lucide-react';

export default function SongSpecialPage() {
  const { 
    specialSong, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    isFavorite, 
    toggleFavorite, 
    streamingPlatforms,
    supportSettings
  } = useApp();
  const [copied, setCopied] = useState(false);

  const isSongPlaying = currentTrack?.id === specialSong.id && isPlaying;
  const isFav = isFavorite(specialSong.id);

  const handlePlaySong = () => {
    if (currentTrack?.id === specialSong.id) {
      togglePlay();
    } else {
      playTrack({
        id: specialSong.id,
        title: specialSong.title,
        subtitle: `Por ${specialSong.artist}`,
        coverUrl: specialSong.coverUrl,
        audioUrl: specialSong.audioUrl,
        durationFormatted: specialSong.duration,
        type: "song"
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      "🌙 Conheça a canção 'Dorme, Dorme, Precioso' de Augusta. Uma bênção suave para acalmar o bebê e acolher as mamães que amamentam na madrugada: " + window.location.href
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const getPlatformIcon = (id) => {
    if (id === 'spotify') {
      return (
        <svg className="w-6 h-6 fill-current text-[#1DB954]" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.353-.675.467-1.028.252-2.82-1.722-6.37-2.112-10.551-1.157-.402.092-.801-.159-.893-.561-.092-.403.16-.802.562-.894 4.571-1.045 8.492-.596 11.658 1.332.353.216.467.676.252 1.028zm1.47-3.262c-.27.44-.848.58-1.288.31-3.227-1.984-8.147-2.558-11.964-1.399-.496.15-1.024-.132-1.174-.627-.15-.495.132-1.023.627-1.174 4.364-1.324 9.791-.685 13.489 1.589.44.27.58.848.31 1.288zm.126-3.41c-3.87-2.298-10.254-2.51-13.935-1.392-.594.18-1.223-.153-1.403-.746-.18-.593.153-1.223.746-1.403 4.232-1.285 11.28-1.037 15.742 1.611.534.317.708 1.01.392 1.544-.318.535-1.011.709-1.542.386z"/>
        </svg>
      );
    }
    if (id === 'apple') {
      return (
        <svg className="w-6 h-6 fill-current text-[#FA243C]" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.03-1.77.91-2.8-.88.04-1.96.59-2.59 1.33-.56.64-.99 1.67-.86 2.69.98.08 1.99-.48 2.54-1.22z"/>
        </svg>
      );
    }
    if (id === 'youtube') {
      return (
        <svg className="w-6 h-6 fill-current text-[#FF0000]" viewBox="0 0 24 24">
          <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.5c-4.14 0-7.5-3.36-7.5-7.5S7.86 4.5 12 4.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5zm-2-11.25v7.5l6-3.75-6-3.75z"/>
        </svg>
      );
    }
    if (id === 'deezer') {
      return (
        <svg className="w-6 h-6 fill-current text-[#A238FF]" viewBox="0 0 24 24">
          <path d="M18.8 6.5h3.6V10H18.8zm0 4.3h3.6v3.5H18.8zm0 4.4h3.6v3.5H18.8zm-5.2-4.4h3.6v3.5h-3.6zm0 4.4h3.6v3.5h-3.6zm-5.2 0h3.6v3.5H8.4zm-6.8 0h3.6v3.5H1.6z"/>
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 fill-current text-[#00A8E1]" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.13 16.51c-3.15 1.74-7.25 1.5-10.42.06-.39-.18-.28-.68.14-.58 2.92.74 6.7.77 9.77-.73.47-.23.86.8.51 1.25z"/>
      </svg>
    );
  };

  const activePlatforms = (streamingPlatforms || []).filter(p => p.enabled);

  return (
    <div className="flex flex-col gap-8 pb-36 max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 animate-in fade-in duration-500">
      
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-night-900 border border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-2xl overflow-hidden">
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          
          {/* Cover Art */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200 dark:border-gold-400/60 shrink-0 group">
            <img 
              src={specialSong.coverUrl || "/dorme-dorme-precioso-capa.png"} 
              alt={specialSong.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            {isSongPlaying && (
              <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-gold-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping"></span>
                Em Reprodução no App
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5 flex-1">
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-marian-50 dark:bg-gold-500/15 border border-marian-200 dark:border-gold-500/30 text-marian-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-gold-500" />
              <span>Canção Original • Augusta</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-marian-900 dark:text-white tracking-tight leading-tight">
              {specialSong.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-marian-200 font-medium max-w-lg leading-relaxed">
              {specialSong.tagline}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-300 font-normal leading-relaxed">
              {specialSong.description}
            </p>

            {/* Play Button & Favorite */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handlePlaySong}
                className="px-6 py-3 rounded-full bg-marian-900 dark:bg-gold-500 hover:bg-marian-800 text-white dark:text-night-950 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {isSongPlaying ? (
                  <>
                    <Pause size={16} className="fill-current" />
                    <span>Pausar Canção</span>
                  </>
                ) : (
                  <>
                    <Play size={16} className="fill-current ml-0.5" />
                    <span>Ouvir Agora no App</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleFavorite(specialSong.id)}
                className={`p-3 rounded-full border transition-all ${
                  isFav 
                    ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-500 border-rose-300 dark:border-rose-500/40' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:text-rose-500'
                }`}
                title="Favoritar"
              >
                <Heart size={16} className={isFav ? 'fill-rose-500' : ''} />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 2. 🌟 STREAMING PLATFORMS CONVERSION HUB */}
      <section className="flex flex-col gap-3.5 p-5 sm:p-7 rounded-3xl bg-white dark:bg-night-900 border border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-marian-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">
              <Disc size={14} />
              <span>Leve a canção para o seu dia a dia</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-marian-900 dark:text-white mt-0.5">
              Ouvir nas Plataformas de Música
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs font-normal">
            Adicione à sua biblioteca favorita para ouvir no carro, no berçário e onde você estiver.
          </p>
        </div>

        {/* Streaming Platforms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {activePlatforms.map(platform => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3.5 rounded-2xl bg-slate-50 dark:bg-night-950 border border-slate-200/80 dark:border-white/10 ${platform.bg} transition-all flex items-center justify-between group hover:scale-[1.01] shadow-xs`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shrink-0 shadow-xs">
                  {getPlatformIcon(platform.id)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-marian-600 dark:group-hover:text-gold-200 transition-colors">
                    {platform.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {platform.ctaText}
                  </span>
                </div>
              </div>
              <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors" />
            </a>
          ))}
        </div>

        {/* Share & Copy Link Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
          <span>Ajude a levar essa canção a mais corações maternos.</span>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors font-medium text-xs"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copied ? 'Link Copiado!' : 'Copiar Link da Canção'}</span>
          </button>
        </div>
      </section>

      {/* 3. 💬 COMUNIDADE DE MÃES & SUPORTE NO WHATSAPP */}
      <section className="flex flex-col gap-3.5 p-5 sm:p-7 rounded-3xl bg-white dark:bg-night-900 border border-slate-200/80 dark:border-emerald-500/20 shadow-sm dark:shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <MessageCircle size={15} />
              <span>Acolhimento & Rede de Apoio</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-marian-900 dark:text-white mt-0.5">
              Comunidade & Atendimento WhatsApp
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs font-normal">
            Entre no grupo com outras mães ou tire dúvidas com nossa equipe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {/* VIP Community WhatsApp Group Card */}
          {supportSettings?.communityGroupEnabled !== false && (
            <a
              href={supportSettings?.communityGroupUrl || 'https://chat.whatsapp.com/ExemploGrupoMaesDormePrecioso'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-500 transition-all flex items-center justify-between group hover:scale-[1.01] shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Users size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    {supportSettings?.communityGroupTitle || 'Grupo VIP das Mães'}
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    {supportSettings?.communityGroupCta || 'Entrar no WhatsApp'}
                  </span>
                </div>
              </div>
              <ExternalLink size={15} className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}

          {/* WhatsApp Direct Support Card */}
          {supportSettings?.whatsappSupportEnabled !== false && (
            <a
              href={`https://api.whatsapp.com/send?phone=${(supportSettings?.whatsappSupportNumber || '+5511999999999').replace(/\D/g, '')}&text=${encodeURIComponent(supportSettings?.whatsappSupportMessage || 'Olá Augusta, gostaria de falar sobre o Dorme Precioso.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/50 dark:to-indigo-950/40 border border-sky-300 dark:border-sky-500/30 hover:border-sky-500 transition-all flex items-center justify-between group hover:scale-[1.01] shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Headphones size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-sky-900 dark:text-sky-200">
                    Suporte no WhatsApp
                  </span>
                  <span className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">
                    Fale com a equipe Augusta
                  </span>
                </div>
              </div>
              <ExternalLink size={15} className="text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}

          {/* WhatsApp Direct Share Conversion Card */}
          <div
            onClick={handleWhatsAppShare}
            className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-400 cursor-pointer transition-all flex items-center justify-between group hover:scale-[1.01] shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Enviar para Outra Mãe
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-slate-300">
                  Abençoar no WhatsApp
                </span>
              </div>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </section>

      {/* 3. Letra Completa */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-night-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col items-center text-center">
        <span className="text-xs uppercase font-bold tracking-widest text-marian-600 dark:text-gold-400 mb-1 flex items-center gap-1.5">
          <Moon size={14} /> Letra da Canção
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-marian-900 dark:text-white mb-5">
          Dorme, Dorme, Precioso
        </h3>

        <div className="font-serif text-sm text-slate-700 dark:text-slate-200 leading-loose italic max-w-lg space-y-1.5">
          {specialSong.lyrics.map((line, idx) => (
            line === "" ? (
              <div key={idx} className="h-3"></div>
            ) : (
              <p key={idx}>{line}</p>
            )
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 w-full max-w-xs text-center text-xs text-slate-500 dark:text-slate-400 font-normal">
          Composição: Augusta • Todos os direitos reservados
        </div>
      </section>

    </div>
  );
}
