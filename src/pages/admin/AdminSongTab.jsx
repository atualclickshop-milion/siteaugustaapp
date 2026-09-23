import React from 'react';
import { 
  Edit3, 
  Play, 
  Pause, 
  Music, 
  Sparkles, 
  Plus, 
  Trash2, 
  Star, 
  Rocket, 
  Eye, 
  EyeOff, 
  ToggleLeft, 
  ToggleRight, 
  Radio,
  Clock,
  Layers
} from 'lucide-react';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../../utils/youtubeHelper';

export default function AdminSongTab({
  specialSong,
  songsList = [],
  localHomeSettings,
  handleToggleHomeSetting,
  handleToggleMusicTab,
  handleOpenNewSong,
  handleStartEditSong,
  handleDeleteSong,
  handleToggleSongLaunch,
  handleToggleSongFeatured,
  handleToggleSongActive,
  testAudioSrc,
  isTestingAudio,
  toggleTestPlay
}) {
  const isMusicTabActive = localHomeSettings?.musicTabEnabled !== false;
  const isTestingSpecial = testAudioSrc === specialSong?.audioUrl && isTestingAudio;
  const isYT = isYouTubeUrl(specialSong?.audioUrl || '');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Músicas & Canções de Ninar</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gerencie a canção principal, lançamentos futuros e todo o catálogo musical do aplicativo.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNewSong}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Nova Música</span>
        </button>
      </div>

      {/* 1. MASTER TOGGLE: Status da Aba de Músicas no App */}
      <div className={`p-5 sm:p-6 rounded-2xl border transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isMusicTabActive 
          ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white border-emerald-300/80 dark:border-emerald-500/30' 
          : 'bg-gradient-to-r from-amber-500/10 via-slate-50 to-white border-amber-300/80 dark:border-amber-500/30'
      }`}>
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`p-3 rounded-xl shrink-0 ${
            isMusicTabActive ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            <Radio size={22} className={isMusicTabActive ? 'animate-pulse' : ''} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-800">
                Aba de Músicas no Aplicativo
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                isMusicTabActive 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {isMusicTabActive ? 'Ativa no Aplicativo' : 'Oculta do Aplicativo'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {isMusicTabActive
                ? 'A aba "Músicas" está visível no menu desktop e na barra inferior do celular para todas as usuárias.'
                : 'A aba "Músicas" está OCULTA para as usuárias. Ideal para preparar a nova canção e os lançamentos antes de liberar para o público.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleMusicTab || (() => handleToggleHomeSetting('musicTabEnabled'))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs text-xs font-bold text-slate-700 transition-all cursor-pointer self-start md:self-auto shrink-0"
        >
          {isMusicTabActive ? (
            <>
              <ToggleRight size={28} className="text-emerald-500" />
              <span>Desativar Aba</span>
            </>
          ) : (
            <>
              <ToggleLeft size={28} className="text-slate-400" />
              <span>Ativar Aba</span>
            </>
          )}
        </button>
      </div>

      {/* 2. CANÇÃO PRINCIPAL / DESTAQUE (Com status de Lançamento Futuro) */}
      <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500 border border-amber-100">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Canção Principal do App
                </span>
                {specialSong?.isFutureLaunch && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 flex items-center gap-1">
                    <Rocket size={10} />
                    Lançamento Futuro
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-1">
                {specialSong?.title || 'Dorme, Dorme, Precioso'} — {specialSong?.artist || 'Augusta'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => handleToggleSongLaunch(specialSong?.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                specialSong?.isFutureLaunch
                  ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Alternar entre Lançamento Futuro ou Já Disponível"
            >
              <Rocket size={13} className={specialSong?.isFutureLaunch ? 'text-purple-600' : 'text-slate-400'} />
              <span>{specialSong?.isFutureLaunch ? 'Modo: Lançamento Futuro' : 'Modo: Disponível'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartEditSong(specialSong)}
              className="px-3.5 py-1.5 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Editar Canção</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-5">
          <img 
            src={specialSong?.coverUrl || "/dorme-dorme-precioso-capa.png"} 
            alt={specialSong?.title || "Capa da Música"} 
            className="w-28 h-28 rounded-2xl object-cover border border-slate-200 shadow-md shrink-0"
            onError={(e) => { e.currentTarget.src = "/dorme-dorme-precioso-capa.png"; }}
          />
          
          <div className="flex flex-col gap-3 min-w-0 flex-1 w-full">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500">Fonte de Áudio / Vídeo Vinculada:</span>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <code className="text-xs text-[#0C1B3A] font-mono truncate max-w-lg">
                  {specialSong?.audioUrl || 'Nenhum áudio configurado'}
                </code>
                <span className="px-2 py-0.5 rounded-md bg-[#0C1B3A]/5 text-[#0C1B3A] border border-[#0C1B3A]/10 text-[10px] font-bold uppercase shrink-0">
                  {isYT ? 'YouTube' : 'Áudio Direto'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {!isYT && specialSong?.audioUrl ? (
                <button 
                  type="button" 
                  onClick={() => toggleTestPlay(specialSong.audioUrl)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isTestingSpecial ? 'bg-amber-500 text-white' : 'bg-[#0C1B3A] hover:bg-[#142a52] text-white shadow-sm'
                  }`}
                >
                  {isTestingSpecial ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isTestingSpecial ? 'Pausar Áudio' : 'Testar Reprodução'}</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400">
                  {isYT ? 'Vídeo pronto para reprodução no player.' : 'Carregue um áudio para testar a reprodução.'}
                </span>
              )}

              <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto">
                <Clock size={12} />
                <span>Duração: {specialSong?.duration || '03:45'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* YouTube Preview */}
        {isYT && specialSong?.audioUrl && (
          <div className="w-full aspect-video max-w-md rounded-xl overflow-hidden border border-slate-200 shadow-md bg-black">
            <iframe
              src={getYouTubeEmbedUrl(specialSong.audioUrl, 0)}
              title="Prévia do Vídeo"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Lyrics Preview */}
        {specialSong?.lyrics && (
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Letra da Canção:</span>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-serif leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">
              {Array.isArray(specialSong.lyrics) ? specialSong.lyrics.join('\n') : specialSong.lyrics}
            </div>
          </div>
        )}
      </div>

      {/* 3. CATÁLOGO COMPLETO DE MÚSICAS */}
      <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Catálogo de Músicas & Canções ({songsList.length})
              </h2>
              <p className="text-xs text-slate-500">
                Cadastre e ordene outras canções para as mamães ouvirem no app.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenNewSong}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>Adicionar Música</span>
          </button>
        </div>

        {/* List of registered songs */}
        {songsList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Music className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-medium">Nenhuma música cadastrada no momento.</p>
            <button
              type="button"
              onClick={handleOpenNewSong}
              className="mt-3 px-3 py-1.5 rounded-lg bg-[#0C1B3A] text-white text-xs font-bold inline-flex items-center gap-1"
            >
              <Plus size={12} /> Cadastrar Primeira Canção
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 pt-1">
            {songsList.map((song, idx) => {
              const isSongTesting = testAudioSrc === song.audioUrl && isTestingAudio;
              const isSongFeatured = Boolean(song.highlight) || song.id === specialSong?.id;
              const isSongActive = song.enabled !== false;

              return (
                <div 
                  key={song.id || idx}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isSongFeatured 
                      ? 'bg-amber-50/40 border-amber-300/80 shadow-xs' 
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img 
                      src={song.coverUrl || '/dorme-dorme-precioso-capa.png'} 
                      alt={song.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                      onError={(e) => { e.currentTarget.src = '/dorme-dorme-precioso-capa.png'; }}
                    />
                    
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-sm text-slate-800 truncate">
                          {song.title}
                        </span>
                        
                        {/* Status Badges */}
                        {isSongFeatured && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-extrabold flex items-center gap-1">
                            <Star size={10} className="fill-current" />
                            Canção Principal
                          </span>
                        )}

                        {song.isFutureLaunch && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold flex items-center gap-1">
                            <Rocket size={10} />
                            Lançamento Futuro
                          </span>
                        )}

                        {!isSongActive && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[10px] font-bold">
                            Oculta
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span>Por {song.artist || 'Augusta'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock size={11} /> {song.duration || '03:45'}
                        </span>
                        {song.tagline && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-xs text-slate-400">{song.tagline}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end md:self-auto flex-wrap">
                    {/* Star as featured toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleSongFeatured(song.id)}
                      className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        isSongFeatured
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-white text-slate-500 border-slate-200 hover:text-amber-600'
                      }`}
                      title={isSongFeatured ? 'Canção Principal do App' : 'Definir como Canção Principal'}
                    >
                      <Star size={14} className={isSongFeatured ? 'fill-current' : ''} />
                    </button>

                    {/* Future launch toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleSongLaunch(song.id)}
                      className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        song.isFutureLaunch
                          ? 'bg-purple-100 text-purple-700 border-purple-200'
                          : 'bg-white text-slate-500 border-slate-200 hover:text-purple-600'
                      }`}
                      title={song.isFutureLaunch ? 'Marcar como Já Disponível' : 'Marcar como Lançamento Futuro (Em Breve)'}
                    >
                      <Rocket size={14} className={song.isFutureLaunch ? 'fill-purple-200' : ''} />
                    </button>

                    {/* Active / Inactive toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleSongActive(song.id)}
                      className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        isSongActive
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={isSongActive ? 'Música Ativa (Visível)' : 'Música Oculta'}
                    >
                      {isSongActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>

                    {/* Audio Test */}
                    {song.audioUrl && (
                      <button
                        type="button"
                        onClick={() => toggleTestPlay(song.audioUrl)}
                        className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSongTesting
                            ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title={isSongTesting ? 'Pausar áudio' : 'Ouvir prévia'}
                      >
                        {isSongTesting ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleStartEditSong(song)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span className="hidden sm:inline">Editar</span>
                    </button>

                    {/* Delete (prevent deleting the only song or warn) */}
                    <button
                      type="button"
                      onClick={() => handleDeleteSong(song.id)}
                      className="p-2 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                      title="Excluir música"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
