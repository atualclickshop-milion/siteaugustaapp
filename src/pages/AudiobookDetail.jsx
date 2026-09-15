import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Heart 
} from 'lucide-react';

export default function AudiobookDetail() {
  const { 
    audiobooks, 
    selectedAudiobookId, 
    navigateTo, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    isFavorite, 
    toggleFavorite 
  } = useApp();

  const book = audiobooks.find(b => b.id === selectedAudiobookId) || audiobooks[0];

  if (!book) {
    return (
      <div className="pt-32 text-center text-white">
        Audiobook não encontrado. <button onClick={() => navigateTo('library')} className="text-amber-400 font-bold">Voltar</button>
      </div>
    );
  }

  const handlePlayChapter = (chapter) => {
    if (currentTrack?.id === chapter.id && currentTrack?.audioUrl === chapter.audioUrl) {
      togglePlay();
    } else {
      playTrack({
        id: chapter.id,
        title: chapter.number ? `${chapter.number}. ${chapter.title}` : chapter.title,
        subtitle: book.title,
        coverUrl: chapter.coverUrl || book.coverUrl || "/dorme-dorme-precioso-capa.png",
        audioUrl: chapter.audioUrl,
        durationFormatted: chapter.duration,
        textSnippet: chapter.textSnippet,
        audiobookId: book.id,
        chapterNumber: chapter.number
      });
    }
  };

  const isBookFav = isFavorite(book.id);

  return (
    <div className="min-h-screen bg-[#0A1628] text-white pb-32 animate-fadeIn font-sans">
      
      {/* 1. HEADER SECTION (Dark Blue) */}
      <div className="pt-20 px-6 pb-8 max-w-2xl mx-auto flex flex-col items-center text-center relative">
        
        {/* Navigation / Actions Bar */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={() => navigateTo('library')}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          
          <button
            onClick={() => toggleFavorite(book.id)}
            className={`p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all ${
              isBookFav ? 'text-rose-400' : 'text-white'
            }`}
          >
            <Heart size={20} className={isBookFav ? 'fill-rose-400' : ''} />
          </button>
        </div>

        {/* Thumbnail Preview Banner */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/30 mb-5 relative group">
          <img 
            src={book.coverUrl || "/dorme-dorme-precioso-capa.png"} 
            alt={book.title}
            onError={(e) => {
              if (!e.currentTarget.src.includes("dorme-dorme-precioso-capa.png")) {
                e.currentTarget.src = "/dorme-dorme-precioso-capa.png";
              }
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Book Title & Meta */}
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
          {book.title}
        </h1>

        <p className="text-xs text-amber-300 font-semibold mt-1">
          {book.chapters?.length || 7} capítulos • Áudio-book
        </p>

        <p className="text-xs text-slate-300 max-w-md mt-2.5 leading-relaxed">
          {book.description || "Uma jornada de acolhimento para a mãe que está acordada, cansada e precisa de alguns minutos de paz."}
        </p>
      </div>

      {/* 2. WHITE ROUNDED SHEET (Capítulos List) */}
      <div className="bg-[#FAF9F6] rounded-t-[36px] min-h-[calc(100vh-320px)] p-5 sm:p-7 max-w-2xl mx-auto shadow-2xl space-y-4">
        
        <h2 className="text-base font-bold text-slate-900 font-serif mb-3">
          Capítulos
        </h2>

        <div className="space-y-3">
          {book.chapters.map((chapter, idx) => {
            const isTrackCurrent = currentTrack?.id === chapter.id;
            const isTrackPlaying = isTrackCurrent && isPlaying;
            const coverImage = chapter.coverUrl || book.coverUrl || "/dorme-dorme-precioso-capa.png";

            return (
              <div
                key={chapter.id || idx}
                onClick={() => handlePlayChapter(chapter)}
                className={`bg-white rounded-2xl p-3 sm:p-4 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isTrackCurrent 
                    ? 'border-amber-400 shadow-md bg-amber-50/20' 
                    : 'border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Chapter Cover Thumbnail with Chapter Number Badge */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-100 relative bg-slate-100">
                    <img 
                      src={coverImage} 
                      alt={chapter.title}
                      onError={(e) => {
                        if (!e.currentTarget.src.includes("dorme-dorme-precioso-capa.png")) {
                          e.currentTarget.src = "/dorme-dorme-precioso-capa.png";
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/75 backdrop-blur-[2px] text-amber-300 text-[10px] font-mono font-bold text-center py-0.5">
                      {chapter.number || (idx + 1 < 10 ? `0${idx + 1}` : idx + 1)}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className={`text-xs sm:text-sm font-bold truncate ${
                      isTrackCurrent ? 'text-amber-800' : 'text-slate-900'
                    }`}>
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {chapter.subtitle || "Condução guiada para desacelerar."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">
                    {chapter.duration || "08:32"}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayChapter(chapter);
                    }}
                    className="w-10 h-10 rounded-full bg-[#0A1628] hover:bg-slate-800 active:scale-95 text-white flex items-center justify-center shadow-sm transition-all"
                  >
                    {isTrackPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
