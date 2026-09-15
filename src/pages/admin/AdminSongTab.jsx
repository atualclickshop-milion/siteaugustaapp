import React from 'react';
import { Edit3, Play, Pause, Music, Sparkles } from 'lucide-react';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../../utils/youtubeHelper';

export default function AdminSongTab({
  specialSong,
  setIsSongModalOpen,
  testAudioSrc,
  isTestingAudio,
  toggleTestPlay
}) {
  const isTestingThis = testAudioSrc === specialSong.audioUrl && isTestingAudio;
  const isYT = isYouTubeUrl(specialSong.audioUrl);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Canção Especial</h1>
        <p className="text-sm text-slate-500 mt-0.5">Gerencie a canção principal do aplicativo e sua letra.</p>
      </div>

      {/* Song Main Card */}
      <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500 border border-amber-100">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Canção Principal do App</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
                {specialSong.title} — {specialSong.artist}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsSongModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Edit3 size={13} />
            <span>Editar Canção & Letra</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-5">
          <img 
            src={specialSong.coverUrl || "/dorme-dorme-precioso-capa.png"} 
            alt={specialSong.title} 
            className="w-28 h-28 rounded-2xl object-cover border border-slate-200 shadow-md shrink-0"
          />
          
          <div className="flex flex-col gap-3 min-w-0 flex-1 w-full">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500">Fonte de Áudio / Vídeo Vinculada:</span>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <code className="text-xs text-[#0C1B3A] font-mono truncate max-w-lg">
                  {specialSong.audioUrl}
                </code>
                <span className="px-2 py-0.5 rounded-md bg-[#0C1B3A]/5 text-[#0C1B3A] border border-[#0C1B3A]/10 text-[10px] font-bold uppercase shrink-0">
                  {isYT ? 'YouTube' : 'Áudio Direto'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isYT ? (
                <button type="button" onClick={() => toggleTestPlay(specialSong.audioUrl)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isTestingThis ? 'bg-amber-500 text-white' : 'bg-[#0C1B3A] hover:bg-[#142a52] text-white shadow-sm'
                  }`}>
                  {isTestingThis ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isTestingThis ? 'Pausar Áudio' : 'Testar Reprodução'}</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400">Vídeo pronto para reprodução no player.</span>
              )}
            </div>
          </div>
        </div>

        {/* YouTube Preview */}
        {isYT && (
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
        {specialSong.lyrics && (
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Letra da Canção:</span>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-serif leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
              {specialSong.lyrics}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
