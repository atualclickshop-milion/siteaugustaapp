import React from 'react';
import { Plus, Edit3, Trash2, Headphones, FileAudio, Play, Pause } from 'lucide-react';
import { isYouTubeUrl } from '../../utils/youtubeHelper';

export default function AdminAudiobooksTab({
  audiobooks,
  handleOpenNewBook,
  handleOpenEditBook,
  handleDeleteBook,
  selectedBookForChapters,
  setSelectedBookForChapters,
  handleOpenNewChapter,
  handleStartEditChapter,
  handleDeleteChapter,
  testAudioSrc,
  isTestingAudio,
  toggleTestPlay
}) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Audiobooks Header & Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Audiobooks</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gerencie as obras, capas, descrições e capítulos individuais.
          </p>
        </div>
        <button
          onClick={handleOpenNewBook}
          className="px-4 py-2.5 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>Novo Audiobook</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audiobooks.map(book => (
          <div 
            key={book.id} 
            className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between gap-3 shadow-sm hover:shadow-md ${
              selectedBookForChapters?.id === book.id 
                ? 'border-[#0C1B3A] ring-1 ring-[#0C1B3A]/20' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <img 
                src={book.coverUrl || "/dorme-dorme-precioso-capa.png"} 
                alt={book.title} 
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0C1B3A]/60">
                  {book.chapters?.length || 0} Capítulos • {book.status === 'published' ? 'Publicado' : 'Rascunho'}
                </span>
                <h4 className="text-sm font-bold text-slate-800 truncate mt-0.5">
                  {book.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {book.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
              <button
                onClick={() => setSelectedBookForChapters(book)}
                className="text-xs text-[#0C1B3A] hover:text-[#1a3060] font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Ver Capítulos ({book.chapters?.length || 0})</span>
                <span>→</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditBook(book)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#0C1B3A] hover:bg-slate-100 cursor-pointer transition-colors"
                  title="Editar Audiobook"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Excluir Audiobook"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chapters of Selected Audiobook Section */}
      {selectedBookForChapters && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <img 
                src={selectedBookForChapters.coverUrl || "/dorme-dorme-precioso-capa.png"} 
                alt={selectedBookForChapters.title}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0C1B3A]/60">
                  Gerenciando Capítulos
                </span>
                <h4 className="text-base font-bold text-slate-800">
                  {selectedBookForChapters.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {selectedBookForChapters.chapters?.length || 0} capítulos
              </span>
              <button
                type="button"
                onClick={handleOpenNewChapter}
                className="px-3.5 py-1.5 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus size={13} />
                <span>Adicionar Capítulo</span>
              </button>
            </div>
          </div>

          {/* Chapters List */}
          {(!selectedBookForChapters.chapters || selectedBookForChapters.chapters.length === 0) ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center gap-2">
              <FileAudio size={26} className="text-slate-400" />
              <p className="text-xs text-slate-500">
                Nenhum capítulo cadastrado para este audiobook ainda.
              </p>
              <button
                onClick={handleOpenNewChapter}
                className="mt-1 text-xs text-[#0C1B3A] hover:text-[#1a3060] font-bold underline cursor-pointer"
              >
                + Adicionar o primeiro capítulo
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
              {selectedBookForChapters.chapters.map(ch => (
                <div 
                  key={ch.id} 
                  className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {ch.coverUrl ? (
                      <img 
                        src={ch.coverUrl} 
                        alt="Capa" 
                        onError={(e) => {
                          if (!e.currentTarget.src.includes("dorme-dorme-precioso-capa.png")) {
                            e.currentTarget.src = "/dorme-dorme-precioso-capa.png";
                          }
                        }}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" 
                      />
                    ) : (
                      <span className="w-9 h-9 rounded-lg bg-[#0C1B3A]/10 text-[#0C1B3A] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#0C1B3A]/20">
                        {ch.number}
                      </span>
                    )}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                          {ch.title}
                        </span>
                        {isYouTubeUrl(ch.audioUrl) && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-600 text-[8px] font-bold uppercase tracking-wider shrink-0 border border-rose-200">
                            Vídeo
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 truncate">
                        {ch.subtitle || "Áudio guiado de acolhimento"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline-block mr-1">{ch.duration}</span>
                    {ch.audioUrl && !isYouTubeUrl(ch.audioUrl) && (
                      <button
                        type="button"
                        onClick={() => toggleTestPlay(ch.audioUrl)}
                        className="p-1.5 rounded-lg bg-white text-[#0C1B3A] hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                        title="Testar áudio deste capítulo"
                      >
                        {testAudioSrc === ch.audioUrl && isTestingAudio ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStartEditChapter(ch)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#0C1B3A] hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Editar este capítulo"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(selectedBookForChapters.id, ch.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remover capítulo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
