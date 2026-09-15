import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft,
  Clock, 
  Play, 
  Pause, 
  HeartHandshake, 
  Moon, 
  Disc,
  Layers,
  FileText,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';

export default function PrayersPage() {
  const { prayers, playTrack, currentTrack, isPlaying, togglePlay, navigateTo } = useApp();
  const [readingPrayer, setReadingPrayer] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('slides'); // 'slides' or 'fullText'
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleSelectPrayer = (prayer) => {
    setReadingPrayer(prayer);
    setPageIndex(0);
    
    // Auto-play background audio when prayer is selected
    if (currentTrack?.id !== prayer.id) {
      playTrack({
        id: prayer.id,
        title: prayer.title,
        subtitle: prayer.subtitle || "Oração e benção guiada",
        coverUrl: prayer.coverUrl || "/dorme-dorme-precioso-capa.png",
        audioUrl: prayer.audioUrl || "",
        durationFormatted: prayer.duration || "05:40",
        type: "prayer",
        textSnippet: prayer.fullText
      });
    }
  };

  const handleBackToList = () => {
    setReadingPrayer(null);
    setPageIndex(0);
    setIsFullScreen(false);
  };

  const getPrayerIcon = (idx, title) => {
    if (title.toLowerCase().includes('terço') || idx === 1) {
      return <Disc className="w-7 h-7 text-amber-300" />;
    }
    if (title.toLowerCase().includes('madrugada') || idx === 3) {
      return <Moon className="w-7 h-7 text-amber-300" />;
    }
    return <HeartHandshake className="w-7 h-7 text-amber-300" />;
  };

  // Split prayer fullText into pages separated by blank lines (\n\n)
  const getPages = (text) => {
    if (!text) return ["Nenhuma oração cadastrada."];
    const paragraphs = text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
    return paragraphs.length > 0 ? paragraphs : [text.trim()];
  };

  const isAudioPlaying = currentTrack?.id === readingPrayer?.id && isPlaying;

  return (
    <div className="min-h-screen bg-[#0A1628] text-white pb-32 animate-fadeIn font-sans">
      
      {/* 1. HEADER SECTION (Midnight Dark Blue) */}
      <div className="pt-20 px-6 pb-8 bg-[#0A1628] text-white max-w-2xl mx-auto flex items-center justify-between">
        <button
          onClick={readingPrayer ? handleBackToList : () => navigateTo('dashboard')}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 transition-all flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft size={18} />
          {readingPrayer && <span>Voltar</span>}
        </button>

        <h1 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 tracking-tight text-center truncate max-w-[240px]">
          {readingPrayer ? readingPrayer.title : "Meu momento com Deus"}
        </h1>

        <button
          onClick={() => navigateTo('dashboard')}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 2. MAIN CONTENT SHEET (Supports Dark & Light Mode) */}
      <div className="bg-[#FAF9F6] dark:bg-[#071325] text-slate-800 dark:text-white rounded-t-[36px] min-h-[calc(100vh-140px)] p-5 sm:p-7 max-w-2xl mx-auto shadow-2xl space-y-5 transition-colors duration-300">
        
        {readingPrayer ? (
          /* PRAYER READING MODE (SLIDES / PAGINATED BY BLANK LINES) */
          <div className="space-y-5 animate-fadeIn">
            
            {/* Top Toolbar in Reader Mode */}
            <div className="flex items-center justify-between bg-white dark:bg-[#0E1F38] p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Cover Image or Icon */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-200 dark:border-slate-700 bg-[#0A1628] flex items-center justify-center">
                  {readingPrayer.coverUrl ? (
                    <img src={readingPrayer.coverUrl} alt={readingPrayer.title} className="w-full h-full object-cover" />
                  ) : (
                    <HeartHandshake className="w-6 h-6 text-amber-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white font-serif truncate">
                    {readingPrayer.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {readingPrayer.subtitle || "Música de fundo acompanhando"}
                  </p>
                </div>
              </div>

              {/* Audio Play/Pause & Fullscreen Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFullScreen(true)}
                  className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-all flex items-center gap-1 text-xs font-bold"
                  title="Modo Tela Cheia"
                >
                  <Maximize2 size={16} />
                  <span className="hidden sm:inline">Tela Cheia</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentTrack?.id === readingPrayer.id) {
                      togglePlay();
                    } else {
                      handleSelectPrayer(readingPrayer);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    isAudioPlaying
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-[#0A1628] text-white hover:bg-slate-800'
                  }`}
                >
                  {isAudioPlaying ? (
                    <>
                      <Pause size={14} className="fill-current" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play size={14} className="fill-current ml-0.5" />
                      <span>Áudio</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* View Mode Switcher (Slides vs Full Text) */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Modo de leitura
              </span>
              <div className="flex bg-slate-200 dark:bg-slate-800/80 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('slides')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    viewMode === 'slides' ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Layers size={13} />
                  <span>Páginas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('fullText')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    viewMode === 'fullText' ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FileText size={13} />
                  <span>Texto Completo</span>
                </button>
              </div>
            </div>

            {/* READING AREA */}
            {viewMode === 'slides' ? (
              (() => {
                const pages = getPages(readingPrayer.fullText);
                const totalPages = pages.length;
                const currentPageText = pages[pageIndex] || pages[0];

                return (
                  <div className="space-y-4">
                    {/* Slide Card */}
                    <div className="bg-white dark:bg-[#0E1F38] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800/80 shadow-md min-h-[240px] flex flex-col items-center justify-center text-center relative transition-all group">
                      <span className="text-3xl font-serif text-amber-400/40 absolute top-3 left-4 select-none">“</span>
                      
                      <p className="font-serif text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed italic my-4">
                        {currentPageText}
                      </p>

                      <span className="text-3xl font-serif text-amber-400/40 absolute bottom-2 right-4 select-none">”</span>

                      <button
                        onClick={() => setIsFullScreen(true)}
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-all text-xs font-bold flex items-center gap-1 opacity-75 group-hover:opacity-100"
                      >
                        <Maximize2 size={14} />
                        <span>Abrir em Tela Cheia</span>
                      </button>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
                        disabled={pageIndex === 0}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          pageIndex === 0
                            ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                            : 'bg-white dark:bg-[#0E1F38] text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <ChevronLeft size={16} />
                        <span>Anterior</span>
                      </button>

                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                          Página {pageIndex + 1} de {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                          {pages.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setPageIndex(i)}
                              className={`h-1.5 rounded-full transition-all ${
                                i === pageIndex ? 'w-5 bg-amber-500' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={pageIndex === totalPages - 1}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          pageIndex === totalPages - 1
                            ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md'
                        }`}
                      >
                        <span>Próxima</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Full Text Mode */
              <div className="bg-white dark:bg-[#0E1F38] rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-md text-sm text-slate-800 dark:text-slate-100 font-serif leading-relaxed whitespace-pre-line italic">
                {readingPrayer.fullText}
              </div>
            )}

            {/* Back Button to Prayers List */}
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={handleBackToList}
                className="px-6 py-2.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
              >
                ← Voltar para lista de orações
              </button>
            </div>

          </div>
        ) : (
          /* MAIN PRAYERS LIST VIEW */
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-serif italic text-center font-medium my-2 max-w-md mx-auto">
              Orações para fortalecer o coração e acalmar a alma.
            </p>

            <div className="space-y-3.5">
              {prayers.map((prayer, idx) => {
                const isTrackCurrent = currentTrack?.id === prayer.id;
                const isTrackPlaying = isTrackCurrent && isPlaying;

                return (
                  <div
                    key={prayer.id || idx}
                    onClick={() => handleSelectPrayer(prayer)}
                    className={`bg-white dark:bg-[#0E1F38] rounded-2xl p-4 border transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm hover:shadow-md group ${
                      isTrackCurrent ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-500/10' : 'border-slate-100 dark:border-slate-800/80'
                    }`}
                  >
                    {/* Left: Square Dark Blue Icon Box or Custom Cover */}
                    <div className="w-14 h-14 rounded-xl bg-[#0A1628] flex items-center justify-center shrink-0 border border-slate-700/50 shadow-sm overflow-hidden group-hover:scale-105 transition-all">
                      {prayer.coverUrl ? (
                        <img src={prayer.coverUrl} alt={prayer.title} className="w-full h-full object-cover" />
                      ) : (
                        getPrayerIcon(idx, prayer.title)
                      )}
                    </div>

                    {/* Middle: Title & Subtitle */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-bold truncate font-serif ${
                        isTrackCurrent ? 'text-amber-800 dark:text-amber-300' : 'text-slate-900 dark:text-white group-hover:text-amber-600'
                      }`}>
                        {prayer.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-sans">
                        {prayer.subtitle || 'Com amor e entrega.'}
                      </p>

                      <div className="flex items-center gap-1 mt-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        <Clock size={12} />
                        <span>{prayer.duration || '05:40'}</span>
                      </div>
                    </div>

                    {/* Right Play Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPrayer(prayer);
                      }}
                      className="w-10 h-10 rounded-full bg-[#0A1628] hover:bg-slate-800 active:scale-95 text-white flex items-center justify-center shadow-sm transition-all shrink-0"
                    >
                      {isTrackPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* 3. FULLSCREEN PRAYER READER MODAL */}
      {isFullScreen && readingPrayer && (
        (() => {
          const pages = getPages(readingPrayer.fullText);
          const totalPages = pages.length;
          const currentPageText = pages[pageIndex] || pages[0];

          const handlePrev = (e) => {
            if (e) e.stopPropagation();
            setPageIndex(prev => Math.max(0, prev - 1));
          };

          const handleNext = (e) => {
            if (e) e.stopPropagation();
            setPageIndex(prev => Math.min(totalPages - 1, prev + 1));
          };

          const handleScreenTap = (e) => {
            // Click right half -> next page, Click left half -> prev page
            const screenWidth = window.innerWidth;
            const clickX = e.clientX;
            if (clickX < screenWidth / 2) {
              handlePrev();
            } else {
              handleNext();
            }
          };

          return (
            <div 
              className="fixed inset-0 z-[100] bg-[#050D1A] text-white flex flex-col justify-between p-4 sm:p-8 select-none animate-fadeIn overflow-hidden"
              onClick={handleScreenTap}
            >
              {/* Stars decorative background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0E2845] via-[#050D1A] to-[#030810] opacity-80 pointer-events-none"></div>

              {/* Top Bar Controls */}
              <div className="relative z-20 flex items-center justify-between gap-4 max-w-4xl mx-auto w-full pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullScreen(false);
                  }}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md border border-white/10"
                >
                  <Minimize2 size={16} />
                  <span>Sair da Tela Cheia</span>
                </button>

                <div className="text-center truncate px-2">
                  <h2 className="text-base sm:text-lg font-serif font-bold text-amber-100 truncate">
                    {readingPrayer.title}
                  </h2>
                  <p className="text-[11px] text-slate-300 truncate">
                    Toque nas laterais para avançar ou voltar
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentTrack?.id === readingPrayer.id) {
                      togglePlay();
                    } else {
                      handleSelectPrayer(readingPrayer);
                    }
                  }}
                  className={`px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md border border-white/10 ${
                    isAudioPlaying
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isAudioPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current ml-0.5" />}
                  <span className="hidden sm:inline">{isAudioPlaying ? 'Pausar' : 'Áudio'}</span>
                </button>
              </div>

              {/* Center Content (The Page Slide Text) */}
              <div className="relative z-10 flex-1 flex items-center justify-center max-w-3xl mx-auto w-full my-auto px-10 sm:px-16 text-center">
                <div className="relative py-8 px-6 sm:px-12 bg-[#0E1F38]/60 backdrop-blur-md rounded-3xl border border-amber-400/20 shadow-2xl w-full">
                  <span className="text-4xl sm:text-5xl font-serif text-amber-400/30 absolute top-2 left-4 select-none">“</span>
                  
                  <p className="font-serif text-lg sm:text-2xl text-amber-50 leading-relaxed italic my-4 sm:my-6 font-normal tracking-wide drop-shadow-md">
                    {currentPageText}
                  </p>

                  <span className="text-4xl sm:text-5xl font-serif text-amber-400/30 absolute bottom-2 right-4 select-none">”</span>
                </div>
              </div>

              {/* Side Floating Navigation Buttons */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={pageIndex === 0}
                className={`fixed left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3.5 sm:p-4 rounded-full transition-all shadow-2xl border backdrop-blur-md ${
                  pageIndex === 0
                    ? 'opacity-20 cursor-not-allowed bg-black/20 text-slate-500 border-transparent'
                    : 'bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-slate-950 border-amber-400/40 hover:scale-110'
                }`}
                title="Página Anterior"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={pageIndex === totalPages - 1}
                className={`fixed right-3 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3.5 sm:p-4 rounded-full transition-all shadow-2xl border backdrop-blur-md ${
                  pageIndex === totalPages - 1
                    ? 'opacity-20 cursor-not-allowed bg-black/20 text-slate-500 border-transparent'
                    : 'bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-slate-950 border-amber-400/40 hover:scale-110'
                }`}
                title="Próxima Página"
              >
                <ChevronRight size={32} />
              </button>

              {/* Bottom Pagination Bar */}
              <div className="relative z-20 flex flex-col items-center gap-2 max-w-xl mx-auto w-full pb-2">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    Página {pageIndex + 1} de {totalPages}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {pages.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPageIndex(i);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        i === pageIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          );
        })()
      )}
    </div>
  );
}
