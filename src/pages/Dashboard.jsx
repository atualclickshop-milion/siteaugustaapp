import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  Moon, 
  Heart, 
  Wind, 
  Baby, 
  ChevronRight,
  HeartHandshake,
  Sparkles,
  Volume2,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { 
    user, 
    audiobooks, 
    specialSong, 
    playTrack, 
    currentTrack, 
    lastPlayed,
    isPlaying, 
    togglePlay, 
    navigateTo, 
    setIsNursingModalOpen,
    setIsBreathingModalOpen,
    currentTime,
    duration,
    formatTime,
    homeSettings,
    momentsList
  } = useApp();

  const getBrazilGreeting = () => {
    try {
      const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: 'numeric',
        hour12: false
      });
      const hour = parseInt(formatter.format(new Date()), 10);

      if (hour >= 5 && hour < 12) {
        return {
          title: `Bom dia, ${user?.name?.split(' ')[0] || 'Maria'}!`,
          desc: "Que o seu dia comece com luz e momentos doces com seu bebê."
        };
      } else if (hour >= 12 && hour < 18) {
        return {
          title: `Boa tarde, ${user?.name?.split(' ')[0] || 'Maria'}!`,
          desc: "Uma pausa suave para respirar e recarregar suas energias."
        };
      } else if (hour >= 18 && hour < 24) {
        return {
          title: `Boa noite, ${user?.name?.split(' ')[0] || 'Maria'}! 🌙`,
          desc: "Preparando uma atmosfera acolhedora e serena para o sono."
        };
      } else {
        return {
          title: `Boa madrugada, ${user?.name?.split(' ')[0] || 'Maria'}! 🌙`,
          desc: "Que este momento seja mais leve para você e seu bebê."
        };
      }
    } catch {
      return {
        title: `Boa madrugada, ${user?.name?.split(' ')[0] || 'Maria'}! 🌙`,
        desc: "Que este momento seja mais leve para você e seu bebê."
      };
    }
  };

  const greeting = getBrazilGreeting();

  const activeTrackObj = currentTrack || lastPlayed || null;

  const handlePlayContinue = () => {
    if (!activeTrackObj) return;
    const targetId = activeTrackObj.trackId || activeTrackObj.id;
    if (currentTrack && currentTrack.id === targetId && currentTrack.audioUrl) {
      togglePlay();
    } else {
      playTrack({
        id: targetId,
        title: activeTrackObj.title,
        subtitle: activeTrackObj.subtitle,
        coverUrl: activeTrackObj.coverUrl || "/dorme-dorme-precioso-capa.png",
        audioUrl: activeTrackObj.audioUrl,
        durationFormatted: activeTrackObj.duration || activeTrackObj.durationFormatted || "05:00",
        audiobookId: activeTrackObj.audiobookId
      });
    }
  };

  // Module visibility flags
  const showContinueListening = (homeSettings?.showContinueListening !== false) && !!activeTrackObj;
  const showSpecialSongBanner = homeSettings?.showSpecialSongBanner !== false;
  const showNursingTimer = homeSettings?.showNursingTimer !== false;
  const showBreathingExercise = homeSettings?.showBreathingExercise !== false;

  // Filter moments enabled by admin
  const visibleMoments = (momentsList || []).filter(m => m.enabled !== false);

  const handleMomentClick = (moment) => {
    if (moment.audioUrl && moment.audioUrl.trim()) {
      if (currentTrack?.id === moment.id) {
        togglePlay();
      } else {
        playTrack({
          id: moment.id,
          title: moment.title,
          subtitle: moment.badge || moment.description || 'Momento',
          coverUrl: moment.coverUrl || '/dorme-dorme-precioso-capa.png',
          audioUrl: moment.audioUrl,
          durationFormatted: moment.duration || '04:30'
        });
      }
      return;
    }

    // Default action router if no custom audio is configured
    const key = (moment.id + ' ' + (moment.title || '')).toLowerCase();
    if (key.includes('calm') || key.includes('respir')) {
      setIsBreathingModalOpen(true);
    } else if (key.includes('nursing') || key.includes('amament')) {
      setIsNursingModalOpen(true);
    } else if (key.includes('pray') || key.includes('rezar') || key.includes('terço')) {
      navigateTo('prayers');
    } else if (key.includes('comfort') || key.includes('acolh')) {
      navigateTo('audiobook-detail');
    } else if (key.includes('sleep') || key.includes('dormir')) {
      navigateTo('song-special');
    } else {
      playTrack({
        id: moment.id,
        title: moment.title,
        subtitle: moment.badge || moment.description || 'Momento',
        coverUrl: moment.coverUrl || '/dorme-dorme-precioso-capa.png',
        audioUrl: '/dorme-dorme-precioso-master.wav',
        durationFormatted: moment.duration || '04:30'
      });
    }
  };

  const getMomentIcon = (moment) => {
    const key = (moment.id + ' ' + (moment.icon || '') + ' ' + (moment.title || '')).toLowerCase();
    if (key.includes('calm') || key.includes('respir') || key.includes('wind') || key.includes('spa')) {
      return {
        icon: <Wind className="w-5 h-5" />,
        bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
      };
    }
    if (key.includes('nursing') || key.includes('amament') || key.includes('baby')) {
      return {
        icon: <Baby className="w-5 h-5" />,
        bg: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20'
      };
    }
    if (key.includes('pray') || key.includes('rezar') || key.includes('terço') || key.includes('cross')) {
      return {
        icon: <HeartHandshake className="w-5 h-5" />,
        bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
      };
    }
    if (key.includes('comfort') || key.includes('acolh') || key.includes('heart')) {
      return {
        icon: <Heart className="w-5 h-5" />,
        bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
      };
    }
    if (key.includes('sleep') || key.includes('dormir') || key.includes('moon')) {
      return {
        icon: <Moon className="w-5 h-5" />,
        bg: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-500/20'
      };
    }
    return {
      icon: <Sparkles className="w-5 h-5" />,
      bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
    };
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-slate-800 dark:text-white pb-32 animate-fadeIn font-sans">
      
      {/* 1. TOP HEADER SECTION (Midnight Dark Blue) */}
      <div className="pt-20 px-6 pb-8 bg-[#0A1628] text-white flex items-center justify-between max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif text-slate-50 flex items-center gap-2">
            {greeting.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal max-w-sm">
            {greeting.desc}
          </p>
        </div>

        {/* User Profile Avatar */}
        <button
          onClick={() => navigateTo('profile')}
          className="relative w-12 h-12 rounded-full border-2 border-amber-400/60 overflow-hidden shadow-lg shrink-0 hover:scale-105 transition-all"
        >
          <img 
            src="/dorme-dorme-precioso-capa.png" 
            alt="Perfil" 
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* 2. MAIN CONTENT SHEET (Supports Dark & Light Theme) */}
      <div className="bg-[#FAF9F6] dark:bg-[#071325] text-slate-800 dark:text-white rounded-t-[36px] min-h-[calc(100vh-140px)] p-5 sm:p-7 max-w-2xl mx-auto shadow-2xl space-y-6 transition-colors duration-300">
        
        {/* CONTINUE OUVINDO CARD (Controlled by homeSettings.showContinueListening) */}
        {showContinueListening && (
          <div>
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400 mb-2.5 font-serif">
              Continue ouvindo
            </h2>

            <div className="bg-white dark:bg-[#0E1F38] rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <img 
                  src={activeTrackObj.coverUrl || "/dorme-dorme-precioso-capa.png"} 
                  alt={activeTrackObj.title}
                  onError={(e) => {
                    if (!e.currentTarget.src.includes("dorme-dorme-precioso-capa.png")) {
                      e.currentTarget.src = "/dorme-dorme-precioso-capa.png";
                    }
                  }}
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {activeTrackObj.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {activeTrackObj.subtitle}
                </p>

                {/* Progress Line */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0A1628] dark:bg-amber-400 rounded-full transition-all"
                      style={{ width: `${duration > 0 && currentTrack && currentTrack.id === (activeTrackObj.trackId || activeTrackObj.id) ? (currentTime / duration) * 100 : (activeTrackObj.progressPct || 0)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400 shrink-0">
                    {currentTrack && currentTrack.id === (activeTrackObj.trackId || activeTrackObj.id) ? `${formatTime(currentTime)} / ${formatTime(duration)}` : (activeTrackObj.currentTimeFormatted || '00:00')}
                  </span>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={handlePlayContinue}
                className="w-11 h-11 rounded-full bg-[#0A1628] dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 active:scale-95 text-white dark:text-slate-950 flex items-center justify-center shadow-md transition-all shrink-0"
              >
                {isPlaying && currentTrack && (currentTrack.id === (activeTrackObj.trackId || activeTrackObj.id)) ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* FERRAMENTAS RÁPIDAS (Controlled by showNursingTimer & showBreathingExercise) */}
        {(showNursingTimer || showBreathingExercise) && (
          <div>
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400 mb-2.5 font-serif">
              Ferramentas & Apoio
            </h2>
            <div className={`grid ${showNursingTimer && showBreathingExercise ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
              {showNursingTimer && (
                <button
                  onClick={() => setIsNursingModalOpen(true)}
                  className="bg-white dark:bg-[#0E1F38] rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-105 transition-all shrink-0">
                    <Baby className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      Amamentação
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Cronômetro & Lado
                    </p>
                  </div>
                </button>
              )}

              {showBreathingExercise && (
                <button
                  onClick={() => setIsBreathingModalOpen(true)}
                  className="bg-white dark:bg-[#0E1F38] rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-500/20 group-hover:scale-105 transition-all shrink-0">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                      Respiração (4-7-8)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Exercício de Calma
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ESCOLHA SEU MOMENTO (DYNAMIC RENDERING FROM momentsList) */}
        {visibleMoments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                Escolha <span className="font-semibold text-slate-700 dark:text-slate-300">um momento</span>
              </h2>
              <span className="text-[11px] font-medium text-slate-400">
                {visibleMoments.length} {visibleMoments.length === 1 ? 'opção' : 'opções'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {visibleMoments.map((moment) => {
                const visual = getMomentIcon(moment);
                const isCurrentlyPlaying = currentTrack?.id === moment.id && isPlaying;

                return (
                  <button
                    key={moment.id}
                    onClick={() => handleMomentClick(moment)}
                    className={`bg-white dark:bg-[#0E1F38] rounded-2xl border transition-all text-left flex flex-col group cursor-pointer relative overflow-hidden p-0 ${
                      isCurrentlyPlaying 
                        ? 'border-amber-500/80 shadow-md ring-1 ring-amber-500/40' 
                        : 'border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-amber-500/30'
                    }`}
                  >
                    {/* Large Image Header */}
                    <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      <img 
                        src={moment.coverUrl || '/dorme-dorme-precioso-capa.png'} 
                        alt={moment.title} 
                        className={`w-full h-full object-cover transition-transform duration-700 ${isCurrentlyPlaying ? 'scale-110' : 'group-hover:scale-105'}`}
                        onError={(e) => { e.target.src = '/dorme-dorme-precioso-capa.png'; }}
                      />
                      {/* Play/Pause Overlay */}
                      {isCurrentlyPlaying ? (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                          <div className="w-12 h-12 rounded-full bg-amber-500/90 shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center justify-center animate-pulse">
                            <Pause className="w-5 h-5 fill-white text-white" />
                          </div>
                        </div>
                      ) : (
                         moment.audioUrl && (
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                             <div className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                               <Play className="w-4 h-4 fill-amber-600 text-amber-600 ml-1" />
                             </div>
                           </div>
                         )
                      )}
                      
                      {/* Badge */}
                      {moment.badge && (
                        <div className="absolute top-2 right-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white shadow-sm border border-white/10">
                            {moment.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between w-full">
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <h3 className="text-[14px] leading-tight font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                            {moment.title}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug line-clamp-2">
                          {moment.description || moment.textSnippet || 'Momento especial de acolhimento para mães.'}
                        </p>
                      </div>
                      
                      {moment.duration && (
                        <div className="mt-3.5 flex items-center justify-between w-full">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-medium tracking-wide">{moment.duration}</span>
                          </div>
                          {moment.audioUrl && (
                            <Volume2 className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Possui áudio especial" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FULL WIDTH CARD: QUERO DORMIR (Controlled by showSpecialSongBanner) */}
        {showSpecialSongBanner && (
          <button
            onClick={() => navigateTo('song-special')}
            className="w-full relative overflow-hidden bg-gradient-to-r from-[#06162B] via-[#0E2845] to-[#7C5329] text-white rounded-[22px] p-5 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-between text-left group border border-amber-500/20 cursor-pointer"
          >
            {/* Starry background sparkles & glow effect */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300/20 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute right-3 top-2 text-[10px] text-amber-200/40 pointer-events-none select-none">✦</div>
            <div className="absolute right-12 bottom-3 text-[12px] text-amber-200/30 pointer-events-none select-none">✨</div>
            <div className="absolute right-24 top-4 text-[8px] text-amber-100/50 pointer-events-none select-none">✦</div>

            <div className="flex items-center gap-4 relative z-10">
              {/* Glowing Golden Crescent Moon */}
              <div className="relative shrink-0 flex items-center justify-center p-1">
                <Moon className="w-9 h-9 text-[#F5D796] fill-[#F5D796] drop-shadow-[0_0_14px_rgba(245,215,150,0.65)] transform -rotate-12 group-hover:scale-110 transition-transform" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-serif tracking-wide group-hover:text-amber-200 transition-colors">
                  Quero dormir
                </h3>
                <p className="text-xs text-slate-200/90 mt-0.5 font-sans font-medium">
                  Canções e áudios para um ambiente tranquilo.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-200/80 group-hover:translate-x-1 transition-transform relative z-10" />
          </button>
        )}

      </div>
    </div>
  );
}
