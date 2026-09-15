import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  SkipBack,
  SkipForward,
  Heart, 
  Maximize2, 
  Timer, 
  X,
  Volume2,
  Video
} from 'lucide-react';
import { isYouTubeUrl } from '../utils/youtubeHelper';

export default function PlayerBottom() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    currentTime, 
    duration, 
    seekTo, 
    skipTime, 
    playNextChapter,
    playPreviousChapter,
    playbackRate, 
    cyclePlaybackRate,
    changePlaybackRate,
    sleepTimerMinutes,
    sleepTimerRemaining,
    timerFinishedNotice,
    toggleFavorite,
    isFavorite,
    setIsFullPlayerOpen,
    setIsCustomTimerModalOpen,
    closePlayer,
    formatTime,
    noAudioNotice
  } = useApp();

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  if (!currentTrack) return null;

  const isYT = isYouTubeUrl(currentTrack.audioUrl);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = isFavorite(currentTrack.id);
  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

  return (
    <>
      {/* Toast Notice when No Audio Available */}
      {noAudioNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-amber-900/90 text-amber-100 border border-amber-400/50 shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm text-center">
          <span className="text-lg">📢</span>
          <span>{noAudioNotice}</span>
        </div>
      )}

      {/* Toast Notice when Timer Finishes */}
      {timerFinishedNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-marian-900 text-white border border-gold-400/40 shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="text-lg">🌙</span>
          <span>Temporizador concluído. Áudio desligado com carinho para o seu descanso 🤍</span>
        </div>
      )}

      {/* Bottom Bar: High Contrast Opaque Nocturnal Navy Background */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#07162A] dark:bg-[#050D1A] text-white border-t border-amber-500/30 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] transition-all">
        
        {/* Top Progress Scrub Bar */}
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            seekTo(clickPos * duration);
          }}
          className="group relative w-full h-1.5 bg-[#030914] cursor-pointer overflow-hidden"
        >
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 transition-all duration-150 relative shadow-sm"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-4 text-white">
          
          {/* Left: Track Thumbnail & Title */}
          <div 
            onClick={() => setIsFullPlayerOpen(true)}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 max-w-[36%] sm:max-w-[30%] group"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 shadow-md border border-amber-400/30 bg-[#0A1628]">
              <img 
                src={currentTrack.coverUrl || "/dorme-dorme-precioso-capa.png"} 
                alt={currentTrack.title}
                onError={(e) => {
                  if (!e.currentTarget.src.includes("dorme-dorme-precioso-capa.png")) {
                    e.currentTarget.src = "/dorme-dorme-precioso-capa.png";
                  }
                }}
                className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${isPlaying ? 'brightness-105' : ''}`}
              />
              {isYT ? (
                <div className="absolute inset-0 bg-red-600/60 flex items-center justify-center">
                  <Play size={12} className="fill-white text-white" />
                </div>
              ) : isPlaying ? (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center gap-0.5">
                  <span className="w-1 bg-amber-400 rounded-full wave-bar"></span>
                  <span className="w-1 bg-amber-400 rounded-full wave-bar"></span>
                  <span className="w-1 bg-amber-400 rounded-full wave-bar"></span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors font-serif">
                  {currentTrack.title}
                </h4>
                {isYT && (
                  <span className="px-1.5 py-0.2 rounded bg-red-500 text-[8px] font-bold text-white uppercase tracking-wider shrink-0">
                    Vídeo
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">
                {currentTrack.subtitle || "Dorme, Precioso"}
              </p>
            </div>
          </div>

          {/* Center: Controls */}
          <div className="flex flex-col items-center gap-0.5 flex-1 max-w-[320px]">
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Previous Chapter */}
              <button
                onClick={playPreviousChapter}
                title="Capítulo Anterior"
                className="hidden xs:flex p-1.5 text-slate-400 hover:text-amber-300 hover:bg-white/10 rounded-full transition-colors active:scale-95 items-center justify-center"
              >
                <SkipBack size={16} />
              </button>

              {/* Skip -15s */}
              <button
                onClick={() => skipTime(-15)}
                title="Voltar 15 segundos"
                className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95 flex items-center justify-center relative"
              >
                <RotateCcw size={18} />
                <span className="text-[8px] font-bold absolute text-white">15</span>
              </button>

              {/* Play/Pause Button: Vibrant Golden Amber */}
              <button
                onClick={togglePlay}
                className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-[0_2px_14px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all shrink-0 font-bold"
              >
                {isPlaying ? (
                  <Pause size={18} className="fill-current stroke-current" />
                ) : (
                  <Play size={18} className="fill-current stroke-current ml-0.5" />
                )}
              </button>

              {/* Skip +15s */}
              <button
                onClick={() => skipTime(15)}
                title="Avançar 15 segundos"
                className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95 flex items-center justify-center relative"
              >
                <RotateCw size={18} />
                <span className="text-[8px] font-bold absolute text-white">15</span>
              </button>

              {/* Next Chapter */}
              <button
                onClick={playNextChapter}
                title="Próximo Capítulo"
                className="hidden xs:flex p-1.5 text-slate-400 hover:text-amber-300 hover:bg-white/10 rounded-full transition-colors active:scale-95 items-center justify-center"
              >
                <SkipForward size={16} />
              </button>

            </div>

            {/* Time Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Tools: Speed, Sleep Timer, Favorite, Maximize, CLOSE (X) */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            
            {/* Speed Button (White in light mode) */}
            <div className="relative">
              <button
                onClick={cyclePlaybackRate}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowSpeedMenu(!showSpeedMenu);
                }}
                className="px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold text-white bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 transition-colors border border-white/30 dark:border-white/5"
                title="Velocidade de reprodução"
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-10 right-0 p-1 rounded-xl bg-marian-900 dark:bg-night-850 border border-white/20 dark:border-white/10 shadow-2xl flex flex-col gap-1 z-50 min-w-[70px]">
                  {speedOptions.map(rate => (
                    <button
                      key={rate}
                      onClick={() => {
                        changePlaybackRate(rate);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono text-left ${
                        playbackRate === rate ? 'bg-gold-500 text-night-950 font-bold' : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sleep Timer Button */}
            <button
              onClick={() => setIsCustomTimerModalOpen(true)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors relative ${
                sleepTimerRemaining 
                  ? 'bg-gold-400 text-night-950 font-bold shadow-sm' 
                  : 'text-white/90 hover:text-white bg-white/15 dark:bg-white/5 hover:bg-white/25'
              }`}
              title="Temporizador de Sono"
            >
              <Timer size={16} />
              {sleepTimerRemaining && (
                <span className="absolute -top-1 -right-1 px-1 rounded-full bg-white text-[8px] font-mono font-bold text-marian-900">
                  {Math.ceil(sleepTimerRemaining / 60)}m
                </span>
              )}
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors bg-white/15 dark:bg-white/5 hover:bg-white/25 ${
                isFav ? 'text-rose-300 fill-rose-300' : 'text-white/90 hover:text-rose-200'
              }`}
              title="Favoritar"
            >
              <Heart size={16} className={isFav ? 'fill-rose-300' : ''} />
            </button>

            {/* Maximize Button */}
            <button
              onClick={() => setIsFullPlayerOpen(true)}
              className="p-1.5 sm:p-2 text-white/90 hover:text-white bg-white/15 dark:bg-white/5 hover:bg-white/25 rounded-lg transition-colors"
              title="Expandir Tocador"
            >
              <Maximize2 size={16} />
            </button>

            {/* CLOSE PLAYER BUTTON (X) */}
            <button
              onClick={closePlayer}
              className="p-1.5 sm:p-2 rounded-lg text-white/80 hover:text-white bg-white/15 dark:bg-white/5 hover:bg-rose-500/80 hover:border-rose-400 transition-all border border-white/20"
              title="Fechar tocador de áudio"
            >
              <X size={16} />
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
