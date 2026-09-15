import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  SkipBack,
  SkipForward,
  Heart, 
  Timer
} from 'lucide-react';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../utils/youtubeHelper';

export default function FullPlayerModal() {
  const { 
    isFullPlayerOpen, 
    setIsFullPlayerOpen, 
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
    sleepTimerRemaining,
    setIsCustomTimerModalOpen,
    toggleFavorite,
    isFavorite,
    formatTime
  } = useApp();

  if (!isFullPlayerOpen || !currentTrack) return null;

  const isYT = isYouTubeUrl(currentTrack.audioUrl);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = isFavorite(currentTrack.id);

  return (
    <div className="fixed inset-0 z-50 bg-[#061022] text-white overflow-y-auto flex flex-col justify-between p-6 sm:p-8 animate-fadeIn font-sans">
      
      {/* 1. TOP NAV BAR */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between z-10 pt-2">
        <button
          onClick={() => setIsFullPlayerOpen(false)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
          title="Fechar tocador"
        >
          <ArrowLeft size={22} />
        </button>

        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          className={`p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all ${
            isFav ? 'text-rose-400' : 'text-white'
          }`}
        >
          <Heart size={20} className={isFav ? 'fill-rose-400' : ''} />
        </button>
      </div>

      {/* 2. CENTER ARTWORK & TRACK DETAILS */}
      <div className="max-w-md w-full mx-auto my-auto flex flex-col items-center text-center gap-6 z-10 py-4">
        
        {isYT ? (
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
            <iframe
              src={getYouTubeEmbedUrl(currentTrack.audioUrl, 1)}
              title={currentTrack.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
            <img 
              src={currentTrack.coverUrl || "/dorme-dorme-precioso-capa.png"} 
              alt={currentTrack.title}
              onError={(e) => {
                if (!e.currentTarget.src.includes("dorme-dorme-precioso-capa.png")) {
                  e.currentTarget.src = "/dorme-dorme-precioso-capa.png";
                }
              }}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        )}

        <div className="space-y-1 max-w-sm">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            {currentTrack.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            {currentTrack.subtitle || "Capítulo 1 - Respiro Fundo"}
          </p>
        </div>

      </div>

      {/* 3. BOTTOM SCRUBBER & PLAYBACK CONTROLS */}
      <div className="max-w-md w-full mx-auto flex flex-col gap-5 z-10 pb-4">
        
        {/* Progress Scrubber */}
        <div className="space-y-1.5">
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              seekTo(clickPos * duration);
            }}
            className="w-full h-1 bg-white/20 hover:h-2 rounded-full cursor-pointer overflow-hidden transition-all relative"
          >
            <div 
              className="h-full bg-[#C69C4E] rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime) || '03:24'}</span>
            <span>{formatTime(duration) || '08:32'}</span>
          </div>
        </div>

        {/* Playback Button Row */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={playPreviousChapter}
            title="Capítulo Anterior"
            className="p-2 text-slate-400 hover:text-amber-300 active:scale-90 transition-colors flex items-center justify-center"
          >
            <SkipBack size={22} />
          </button>

          <button
            onClick={() => skipTime(-15)}
            title="Voltar 15 segundos"
            className="p-2 text-slate-300 hover:text-white active:scale-90 relative flex items-center justify-center"
          >
            <RotateCcw size={22} />
            <span className="text-[8px] font-bold absolute">15</span>
          </button>

          {/* Central Circular Gold Button */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-[#C69C4E] hover:bg-amber-400 active:scale-95 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-900/40 transition-all shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-slate-950 stroke-slate-950" />
            ) : (
              <Play className="w-7 h-7 fill-slate-950 stroke-slate-950 ml-1" />
            )}
          </button>

          <button
            onClick={() => skipTime(15)}
            title="Avançar 15 segundos"
            className="p-2 text-slate-300 hover:text-white active:scale-90 relative flex items-center justify-center"
          >
            <RotateCw size={22} />
            <span className="text-[8px] font-bold absolute">15</span>
          </button>

          <button
            onClick={playNextChapter}
            title="Próximo Capítulo"
            className="p-2 text-slate-400 hover:text-amber-300 active:scale-90 transition-colors flex items-center justify-center"
          >
            <SkipForward size={22} />
          </button>
        </div>

        {/* Bottom Options Row (Speed, Timer, Favorite) */}
        <div className="flex items-center justify-around pt-3 border-t border-white/10 text-xs text-slate-400">
          <button
            onClick={cyclePlaybackRate}
            className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <span className="font-mono font-bold text-slate-200 text-xs">
              {playbackRate}x
            </span>
            <span className="text-[10px]">Velocidade</span>
          </button>

          <button
            onClick={() => setIsCustomTimerModalOpen(true)}
            className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <div className={`p-0.5 ${sleepTimerRemaining ? 'text-amber-400 font-bold' : ''}`}>
              <Timer size={18} />
            </div>
            <span className="text-[10px]">
              {sleepTimerRemaining ? `${Math.ceil(sleepTimerRemaining / 60)}m` : 'Temporizador'}
            </span>
          </button>

          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className="flex flex-col items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <Heart size={18} className={isFav ? 'fill-rose-400 text-rose-400' : ''} />
            <span className="text-[10px]">Favoritos</span>
          </button>
        </div>

      </div>
    </div>
  );
}
