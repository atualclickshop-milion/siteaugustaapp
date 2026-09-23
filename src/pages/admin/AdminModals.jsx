import React from 'react';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Music, 
  BookOpen, 
  HeartHandshake, 
  User, 
  Sparkles, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Play, 
  Pause,
  Trash2,
  Megaphone,
  Video,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminModals(props) {
  const {
    // Ad Modal
    isAdModalOpen,
    setIsAdModalOpen,
    editingAdId,
    adTitle,
    setAdTitle,
    adText,
    setAdText,
    adMediaType,
    setAdMediaType,
    adMediaUrl,
    setAdMediaUrl,
    adMediaMode,
    setAdMediaMode,
    adButtonText,
    setAdButtonText,
    adButtonLink,
    setAdButtonLink,
    adEnabled,
    setAdEnabled,
    handleSaveAd,

    // Book Modal
    isBookModalOpen,
    setIsBookModalOpen,
    editingBook,
    bookTitle,
    setBookTitle,
    bookDescription,
    setBookDescription,
    bookCover,
    setBookCover,
    bookCoverMode,
    setBookCoverMode,
    handleSaveBook,
    handleImageFileUpload,
    isUploadingMedia,

    // Song Modal
    isSongModalOpen,
    setIsSongModalOpen,
    editingSong,
    songTitle,
    setSongTitle,
    songArtist,
    setSongArtist,
    songTagline,
    setSongTagline,
    songCover,
    setSongCover,
    songCoverMode,
    setSongCoverMode,
    songAudioUrl,
    setSongAudioUrl,
    songAudioMode,
    setSongAudioMode,
    songDuration,
    setSongDuration,
    songLyricsText,
    setSongLyricsText,
    songHighlight,
    setSongHighlight,
    songIsFutureLaunch,
    setSongIsFutureLaunch,
    songEnabled,
    setSongEnabled,
    handleSaveSong,
    handleAudioFileUpload,
    detectAudioDuration,
    toggleTestPlay,
    testAudioSrc,
    isTestingAudio,

    // Chapter Modal
    isChapterModalOpen,
    selectedBookForChapters,
    editingChapterId,
    newChapterTitle,
    setNewChapterTitle,
    newChapterSubtitle,
    setNewChapterSubtitle,
    newChapterDuration,
    setNewChapterDuration,
    newChapterCoverUrl,
    setNewChapterCoverUrl,
    newChapterCoverMode,
    setNewChapterCoverMode,
    newChapterAudioUrl,
    setNewChapterAudioUrl,
    newChapterAudioMode,
    setNewChapterAudioMode,
    newChapterAudioFileName,
    newChapterSnippet,
    setNewChapterSnippet,
    handleSaveChapter,
    handleCancelEditChapter,

    // Prayer Modal
    isPrayerModalOpen,
    editingPrayerId,
    prayerTitle,
    setPrayerTitle,
    prayerSubtitle,
    setPrayerSubtitle,
    prayerCategory,
    setPrayerCategory,
    prayerDuration,
    setPrayerDuration,
    prayerCoverUrl,
    setPrayerCoverUrl,
    prayerCoverMode,
    setPrayerCoverMode,
    prayerAudioUrl,
    setPrayerAudioUrl,
    prayerAudioMode,
    setPrayerAudioMode,
    prayerAudioFileName,
    prayerFullText,
    setPrayerFullText,
    handleSavePrayer,
    handleCancelPrayer,

    // User Modal
    isUserModalOpen,
    editingUserId,
    userFormName,
    setUserFormName,
    userFormEmail,
    setUserFormEmail,
    userFormPhone,
    setUserFormPhone,
    userFormBabyName,
    setUserFormBabyName,
    userFormPassword,
    setUserFormPassword,
    userFormRole,
    setUserFormRole,
    userFormStatus,
    setUserFormStatus,
    showPasswordInModal,
    setShowPasswordInModal,
    handleSaveUser,
    handleCancelUserModal,

    // Moment Modal
    isMomentModalOpen,
    editingMomentId,
    momentTitle,
    setMomentTitle,
    momentBadge,
    setMomentBadge,
    momentDescription,
    setMomentDescription,
    momentActionText,
    setMomentActionText,
    momentTextSnippet,
    setMomentTextSnippet,
    momentCoverUrl,
    setMomentCoverUrl,
    momentCoverMode,
    setMomentCoverMode,
    momentAudioUrl,
    setMomentAudioUrl,
    momentAudioMode,
    setMomentAudioMode,
    momentAudioFileName,
    momentDuration,
    setMomentDuration,
    handleSaveMoment,
    handleCancelMoment,

    // Confirm Dialog
    confirmDialog,
    setConfirmDialog
  } = props;

  return (
    <>
      {/* 1. BOOK MODAL */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 relative my-8">
            <button
              onClick={() => setIsBookModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingBook ? 'Editar Livro / Audiobook' : 'Novo Livro / Audiobook'}
                </h3>
                <p className="text-sm text-slate-500">Preencha os detalhes do conteúdo textual/audiobook</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Título do Livro
                </label>
                <input
                  type="text"
                  value={bookTitle || ''}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="Ex: O Pequeno Príncipe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={bookDescription || ''}
                  onChange={(e) => setBookDescription(e.target.value)}
                  placeholder="Sinopse ou resumo do livro..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Capa do Livro
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setBookCoverMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        bookCoverMode === 'url'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookCoverMode('file')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        bookCoverMode === 'file'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" /> Arquivo
                    </button>
                  </div>
                </div>

                {bookCoverMode === 'url' ? (
                  <input
                    key="book-cover-url"
                    type="text"
                    value={bookCover || ''}
                    onChange={(e) => setBookCover(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                ) : (
                  <input
                    key="book-cover-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, setBookCover)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                )}

                {isUploadingMedia && (
                  <div className="mt-2.5 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-xs text-amber-700 font-medium animate-pulse">
                    <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Enviando capa para o servidor... Aguarde a conclusão antes de salvar.</span>
                  </div>
                )}

                {bookCover && (
                  <div className="mt-3 flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={bookCover} alt="Preview" className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                      <span className="text-xs text-slate-600 truncate">{bookCover.startsWith('data:') ? 'Enviando arquivo...' : bookCover}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBookCover('')}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover Capa
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBookModalOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveBook}
                disabled={isUploadingMedia}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 ${
                  isUploadingMedia
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-amber-500/20 cursor-pointer'
                }`}
              >
                {isUploadingMedia ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                    <span>Enviando Capa...</span>
                  </>
                ) : (
                  'Salvar Livro'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SONG MODAL */}
      {isSongModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 relative my-8">
            <button
              onClick={() => setIsSongModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingSong ? 'Editar Músicas & Canções' : 'Nova Música'}
                </h3>
                <p className="text-sm text-slate-500">Cadastre a faixa de áudio e capa</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Título da Canção
                </label>
                <input
                  type="text"
                  value={songTitle || ''}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="Ex: Canção de Ninar Augusta"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Artista / Interprete
                  </label>
                  <input
                    type="text"
                    value={songArtist || ''}
                    onChange={(e) => setSongArtist(e.target.value)}
                    placeholder="Ex: Voz Maternal"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Duração
                  </label>
                  <input
                    type="text"
                    value={songDuration || ''}
                    onChange={(e) => setSongDuration(e.target.value)}
                    placeholder="Ex: 3:45"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Slogan / Subtítulo
                </label>
                <input
                  type="text"
                  value={songTagline || ''}
                  onChange={(e) => setSongTagline(e.target.value)}
                  placeholder="Ex: Melodia suave para dormir tranqüilo"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              {/* Opções de Status, Destaque e Lançamento Futuro */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Status & Visibilidade da Música
                </span>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(songHighlight)}
                    onChange={(e) => setSongHighlight(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">
                      ⭐ Definir como Canção Principal do App
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Será a faixa em evidência no banner da tela inicial e no topo da aba de músicas.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(songIsFutureLaunch)}
                    onChange={(e) => setSongIsFutureLaunch(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-purple-600 focus:ring-purple-400 border-slate-300"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">
                      🚀 Marcar como Lançamento Futuro (Em Breve)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Exibe selo de estreia e prepara o público para o lançamento oficial.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={songEnabled !== false}
                    onChange={(e) => setSongEnabled(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-400 border-slate-300"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">
                      🟢 Música Ativa (Visível no aplicativo)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Se desmarcado, a faixa ficará oculta no catálogo para as mamães.
                    </span>
                  </div>
                </label>
              </div>

              {/* Cover URL / File */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Capa da Música
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setSongCoverMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        songCoverMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setSongCoverMode('file')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        songCoverMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" /> Arquivo
                    </button>
                  </div>
                </div>

                {songCoverMode === 'url' ? (
                  <input
                    key="song-cover-url"
                    type="text"
                    value={songCover || ''}
                    onChange={(e) => setSongCover(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                ) : (
                  <input
                    key="song-cover-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, setSongCover)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                )}

                {songCover && (
                  <div className="mt-2 flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={songCover} alt="Preview" className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                      <span className="text-xs text-slate-600 truncate">{songCover.startsWith('data:') ? 'Arquivo de imagem carregado' : songCover}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSongCover('')}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover Capa
                    </button>
                  </div>
                )}
              </div>

              {/* Audio URL / File */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Áudio da Música
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setSongAudioMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        songAudioMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setSongAudioMode('file')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        songAudioMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" /> Arquivo
                    </button>
                  </div>
                </div>

                {songAudioMode === 'url' ? (
                  <input
                    key="song-audio-url"
                    type="text"
                    value={songAudioUrl || ''}
                    onChange={(e) => {
                      setSongAudioUrl(e.target.value);
                      detectAudioDuration(e.target.value, setSongDuration);
                    }}
                    placeholder="https://...mp3"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                ) : (
                  <input
                    key="song-audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleAudioFileUpload(e, setSongAudioUrl, setSongDuration)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                )}

                {songAudioUrl && (
                  <div className="mt-2 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-600 truncate max-w-[180px]">{songAudioUrl.startsWith('data:') ? 'Arquivo de áudio carregado' : songAudioUrl}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleTestPlay(songAudioUrl)}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        {isTestingAudio && testAudioSrc === songAudioUrl ? (
                          <>
                            <Pause className="w-3.5 h-3.5" /> Pausar
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> Testar
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSongAudioUrl('');
                          setSongDuration('');
                        }}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remover
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Letra da Música (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={songLyricsText || ''}
                  onChange={(e) => setSongLyricsText(e.target.value)}
                  placeholder="Escreva a letra da canção aqui..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSongModalOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveSong}
                disabled={isUploadingMedia}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 ${
                  isUploadingMedia
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-amber-500/20 cursor-pointer'
                }`}
              >
                {isUploadingMedia ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                    <span>Enviando Mídia...</span>
                  </>
                ) : (
                  'Salvar Música'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHAPTER MODAL */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 relative my-8">
            <button
              onClick={handleCancelEditChapter}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingChapterId ? 'Editar Capítulo' : 'Novo Capítulo'}
                </h3>
                <p className="text-sm text-slate-500">
                  Livro: <strong className="text-slate-800">{selectedBookForChapters?.title}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Título do Capítulo
                </label>
                <input
                  type="text"
                  value={newChapterTitle || ''}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="Ex: Capítulo 1 - O Jardim de Flores"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Subtítulo / Resumo
                  </label>
                  <input
                    type="text"
                    value={newChapterSubtitle || ''}
                    onChange={(e) => setNewChapterSubtitle(e.target.value)}
                    placeholder="Ex: A descoberta das estrelas"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Duração
                  </label>
                  <input
                    type="text"
                    value={newChapterDuration || ''}
                    onChange={(e) => setNewChapterDuration(e.target.value)}
                    placeholder="Ex: 5 min"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                </div>
              </div>

              {/* Cover URL / File */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Capa do Capítulo (Opcional)
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setNewChapterCoverMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        newChapterCoverMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewChapterCoverMode('file')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        newChapterCoverMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" /> Arquivo
                    </button>
                  </div>
                </div>

                {newChapterCoverMode === 'url' ? (
                  <input
                    key="chapter-cover-url"
                    type="text"
                    value={newChapterCoverUrl || ''}
                    onChange={(e) => setNewChapterCoverUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                ) : (
                  <input
                    key="chapter-cover-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, setNewChapterCoverUrl)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                )}

                {newChapterCoverUrl && (
                  <div className="mt-2 flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={newChapterCoverUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                      <span className="text-xs text-slate-600 truncate">{newChapterCoverUrl.startsWith('data:') ? 'Arquivo de imagem carregado' : newChapterCoverUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewChapterCoverUrl('')}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover Capa
                    </button>
                  </div>
                )}
              </div>

              {/* Audio URL / File */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Áudio do Capítulo
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setNewChapterAudioMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        newChapterAudioMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewChapterAudioMode('file')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        newChapterAudioMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" /> Arquivo
                    </button>
                  </div>
                </div>

                {newChapterAudioMode === 'url' ? (
                  <input
                    key="chapter-audio-url"
                    type="text"
                    value={newChapterAudioUrl || ''}
                    onChange={(e) => {
                      setNewChapterAudioUrl(e.target.value);
                      detectAudioDuration(e.target.value, setNewChapterDuration);
                    }}
                    placeholder="https://...mp3"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                ) : (
                  <input
                    key="chapter-audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleAudioFileUpload(e, setNewChapterAudioUrl, setNewChapterDuration)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                )}

                {newChapterAudioUrl && (
                  <div className="mt-2 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-600 truncate max-w-[200px]">{newChapterAudioUrl.startsWith('data:') ? 'Arquivo de áudio carregado' : newChapterAudioUrl}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewChapterAudioUrl('');
                        setNewChapterDuration('');
                      }}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover Áudio
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Trecho / Texto do Capítulo
                </label>
                <textarea
                  rows={4}
                  value={newChapterSnippet || ''}
                  onChange={(e) => setNewChapterSnippet(e.target.value)}
                  placeholder="Conteúdo textual do capítulo..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelEditChapter}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveChapter}
                disabled={isUploadingMedia}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 ${
                  isUploadingMedia
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-amber-500/20 cursor-pointer'
                }`}
              >
                {isUploadingMedia ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                    <span>Enviando Mídia...</span>
                  </>
                ) : (
                  'Salvar Capítulo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRAYER MODAL */}
      {isPrayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 relative my-8">
            <button
              onClick={handleCancelPrayer}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingPrayerId ? 'Editar Oração' : 'Nova Oração'}
                </h3>
                <p className="text-sm text-slate-500">Cadastre orações para a família</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Título da Oração
                </label>
                <input
                  type="text"
                  value={prayerTitle || ''}
                  onChange={(e) => setPrayerTitle(e.target.value)}
                  placeholder="Ex: Oração da Noite"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={prayerCategory || ''}
                    onChange={(e) => setPrayerCategory(e.target.value)}
                    placeholder="Ex: Proteção, Noite"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Duração
                  </label>
                  <input
                    type="text"
                    value={prayerDuration || ''}
                    onChange={(e) => setPrayerDuration(e.target.value)}
                    placeholder="Ex: 2 min"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={prayerSubtitle || ''}
                  onChange={(e) => setPrayerSubtitle(e.target.value)}
                  placeholder="Ex: Uma benção de paz para a criança"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              {/* Cover URL / File */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Imagem de Capa
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setPrayerCoverMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        prayerCoverMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrayerCoverMode('file')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        prayerCoverMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" /> Arquivo
                    </button>
                  </div>
                </div>

                {prayerCoverMode === 'url' ? (
                  <input
                    key="prayer-cover-url"
                    type="text"
                    value={prayerCoverUrl || ''}
                    onChange={(e) => setPrayerCoverUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                ) : (
                  <input
                    key="prayer-cover-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, setPrayerCoverUrl)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                )}

                {prayerCoverUrl && (
                  <div className="mt-2 flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={prayerCoverUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                      <span className="text-xs text-slate-600 truncate">{prayerCoverUrl.startsWith('data:') ? 'Arquivo de imagem carregado' : prayerCoverUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrayerCoverUrl('')}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover Capa
                    </button>
                  </div>
                )}
              </div>

              {/* Audio URL / File */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Áudio da Oração
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setPrayerAudioMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        prayerAudioMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrayerAudioMode('file')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        prayerAudioMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" /> Arquivo
                    </button>
                  </div>
                </div>

                {prayerAudioMode === 'url' ? (
                  <input
                    key="prayer-audio-url"
                    type="text"
                    value={prayerAudioUrl || ''}
                    onChange={(e) => {
                      setPrayerAudioUrl(e.target.value);
                      detectAudioDuration(e.target.value, setPrayerDuration);
                    }}
                    placeholder="https://...mp3"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                ) : (
                  <input
                    key="prayer-audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleAudioFileUpload(e, setPrayerAudioUrl, setPrayerDuration)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                )}

                {prayerAudioUrl && (
                  <div className="mt-2 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-600 truncate max-w-[200px]">{prayerAudioUrl.startsWith('data:') ? 'Arquivo de áudio carregado' : prayerAudioUrl}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPrayerAudioUrl('');
                        setPrayerDuration('');
                      }}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover Áudio
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Texto Completo da Oração
                </label>
                <textarea
                  rows={4}
                  value={prayerFullText || ''}
                  onChange={(e) => setPrayerFullText(e.target.value)}
                  placeholder="Escreva a oração completa..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelPrayer}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePrayer}
                disabled={isUploadingMedia}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 ${
                  isUploadingMedia
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-amber-500/20 cursor-pointer'
                }`}
              >
                {isUploadingMedia ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                    <span>Enviando Mídia...</span>
                  </>
                ) : (
                  'Salvar Oração'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 relative my-8">
            <button
              onClick={handleCancelUserModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingUserId ? 'Editar Usuário' : 'Novo Usuário'}
                </h3>
                <p className="text-sm text-slate-500">Gerenciar conta e acessos do usuário</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={userFormName || ''}
                  onChange={(e) => setUserFormName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  value={userFormEmail || ''}
                  onChange={(e) => setUserFormEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={userFormPhone || ''}
                  onChange={(e) => setUserFormPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nome do Bebê
                </label>
                <input
                  type="text"
                  value={userFormBabyName || ''}
                  onChange={(e) => setUserFormBabyName(e.target.value)}
                  placeholder="Ex: Augusta"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Senha {editingUserId && '(deixe em branco para não alterar)'}
                </label>
                <div className="relative">
                  <input
                    type={showPasswordInModal ? 'text' : 'password'}
                    value={userFormPassword || ''}
                    onChange={(e) => setUserFormPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswordInModal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Função / Permissão
                  </label>
                  <select
                    value={userFormRole || 'user'}
                    onChange={(e) => setUserFormRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  >
                    <option value="user">Usuário Comum</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Status da Conta
                  </label>
                  <select
                    value={userFormStatus || 'active'}
                    onChange={(e) => setUserFormStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo / Suspenso</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelUserModal}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-xl shadow-md shadow-amber-500/20 transition-all"
              >
                Salvar Usuário
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MOMENT MODAL */}
      {isMomentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 relative my-8">
            <button
              onClick={handleCancelMoment}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingMomentId ? 'Editar Momento Especial' : 'Novo Momento Especial'}
                </h3>
                <p className="text-sm text-slate-500">Conteúdo em destaque na tela inicial</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Título do Momento
                </label>
                <input
                  type="text"
                  value={momentTitle || ''}
                  onChange={(e) => setMomentTitle(e.target.value)}
                  placeholder="Ex: Hora do Soninho Tranquilo"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={momentBadge || ''}
                    onChange={(e) => setMomentBadge(e.target.value)}
                    placeholder="Ex: NOVO"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Duração
                  </label>
                  <input
                    type="text"
                    value={momentDuration || ''}
                    onChange={(e) => setMomentDuration(e.target.value)}
                    placeholder="Ex: 10 min"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Descrição / Slogan
                </label>
                <textarea
                  rows={2}
                  value={momentDescription || ''}
                  onChange={(e) => setMomentDescription(e.target.value)}
                  placeholder="Resumo que aparece no card..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              {/* Cover URL / File */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Imagem de Capa
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setMomentCoverMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        momentCoverMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setMomentCoverMode('file')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        momentCoverMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" /> Arquivo
                    </button>
                  </div>
                </div>

                {momentCoverMode === 'url' ? (
                  <input
                    key="moment-cover-url"
                    type="text"
                    value={momentCoverUrl || ''}
                    onChange={(e) => setMomentCoverUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                ) : (
                  <input
                    key="moment-cover-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, setMomentCoverUrl)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                )}

                {momentCoverUrl && (
                  <div className="mt-2 flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={momentCoverUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                      <span className="text-xs text-slate-600 truncate">{momentCoverUrl.startsWith('data:') ? 'Arquivo de imagem carregado' : momentCoverUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMomentCoverUrl('')}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover Capa
                    </button>
                  </div>
                )}
              </div>

              {/* Audio URL / File */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Áudio do Momento
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setMomentAudioMode('url')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        momentAudioMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setMomentAudioMode('file')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        momentAudioMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" /> Arquivo
                    </button>
                  </div>
                </div>

                {momentAudioMode === 'url' ? (
                  <input
                    key="moment-audio-url"
                    type="text"
                    value={momentAudioUrl || ''}
                    onChange={(e) => {
                      setMomentAudioUrl(e.target.value);
                      detectAudioDuration(e.target.value, setMomentDuration);
                    }}
                    placeholder="https://...mp3"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                ) : (
                  <input
                    key="moment-audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleAudioFileUpload(e, setMomentAudioUrl, setMomentDuration)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                )}

                {momentAudioUrl && (
                  <div className="mt-2 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-600 truncate max-w-[200px]">{momentAudioUrl.startsWith('data:') ? 'Arquivo de áudio carregado' : momentAudioUrl}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMomentAudioUrl('');
                        setMomentDuration('');
                      }}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover Áudio
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelMoment}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveMoment}
                disabled={isUploadingMedia}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 ${
                  isUploadingMedia
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-amber-500/20 cursor-pointer'
                }`}
              >
                {isUploadingMedia ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                    <span>Enviando Mídia...</span>
                  </>
                ) : (
                  'Salvar Momento'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. ANÚNCIO / PROPAGANDA MODAL */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 relative my-8">
            <button
              onClick={() => setIsAdModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingAdId ? 'Editar Anúncio / Propaganda' : 'Novo Anúncio / Propaganda'}
                </h3>
                <p className="text-sm text-slate-500">Configure o popup promocional para as usuárias</p>
              </div>
            </div>

            <form onSubmit={handleSaveAd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Título do Anúncio *
                </label>
                <input
                  type="text"
                  required
                  value={adTitle || ''}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="Ex: Oferta Especial - Ebook Exclusivo!"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Texto / Descrição
                </label>
                <textarea
                  rows={3}
                  value={adText || ''}
                  onChange={(e) => setAdText(e.target.value)}
                  placeholder="Descreva a novidade, mensagem ou convite para a mãe..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                />
              </div>

              {/* Media Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Tipo de Mídia
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdMediaType('image')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      adMediaType === 'image'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>Imagem</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdMediaType('video')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      adMediaType === 'video'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-4 h-4 text-amber-600" />
                    <span>Vídeo (Link / YouTube)</span>
                  </button>
                </div>
              </div>

              {/* Media Upload / URL Input */}
              {adMediaType === 'image' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Imagem de Exibição
                    </label>
                    <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setAdMediaMode('file')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                          adMediaMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Upload className="w-3 h-3 inline mr-1" /> Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdMediaMode('url')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                          adMediaMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                      </button>
                    </div>
                  </div>

                  {adMediaMode === 'url' ? (
                    <input
                      key="ad-media-url"
                      type="text"
                      value={adMediaUrl || ''}
                      onChange={(e) => setAdMediaUrl(e.target.value)}
                      placeholder="https://exemplo.com/banner.jpg"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                    />
                  ) : (
                    <input
                      key="ad-media-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, setAdMediaUrl)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                  )}

                  {adMediaUrl && (
                    <div className="mt-2.5 flex items-center justify-between gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={adMediaUrl} alt="Preview Ad" className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                        <span className="text-xs text-slate-600 truncate">{adMediaUrl.startsWith('data:') ? 'Arquivo de Imagem Carregado' : adMediaUrl}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdMediaUrl('')}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold shrink-0"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Link do Vídeo (mp4 ou YouTube)
                  </label>
                  <input
                    type="text"
                    value={adMediaUrl || ''}
                    onChange={(e) => setAdMediaUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... ou link .mp4"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Suporta links do YouTube e links diretos de vídeos MP4.</span>
                </div>
              )}

              {/* Action Button Config */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Botão de Ação do Anúncio
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={adButtonText || ''}
                      onChange={(e) => setAdButtonText(e.target.value)}
                      placeholder="Ex: Saber Mais"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Link de Destino
                    </label>
                    <input
                      type="text"
                      value={adButtonLink || ''}
                      onChange={(e) => setAdButtonLink(e.target.value)}
                      placeholder="https://suapagina.com"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Status do Anúncio</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(adEnabled)}
                    onChange={(e) => setAdEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  <span className="ml-2 text-xs font-semibold text-slate-600">
                    {adEnabled ? 'Ativo (Exibindo)' : 'Pausado'}
                  </span>
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-xl shadow-md shadow-amber-500/20 transition-all"
                >
                  Salvar Anúncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. CONFIRM DIALOG */}
      {confirmDialog?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {confirmDialog.title || 'Confirmar Ação'}
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {confirmDialog.message || 'Tem certeza que deseja prosseguir com esta ação?'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false })}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  setConfirmDialog({ isOpen: false });
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 rounded-xl shadow-md shadow-rose-500/20 transition-all"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
