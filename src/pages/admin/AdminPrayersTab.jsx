import React from 'react';
import { Plus, Edit3, Trash2, HeartHandshake, Play, Pause } from 'lucide-react';

export default function AdminPrayersTab({
  prayers,
  handleOpenNewPrayer,
  handleStartEditPrayer,
  handleDeletePrayer,
  testAudioSrc,
  isTestingAudio,
  toggleTestPlay
}) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Orações & Bênçãos</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure títulos, capas, música de fundo e textos completos para leitura dinâmica.
          </p>
        </div>
        <button onClick={handleOpenNewPrayer}
          className="px-4 py-2.5 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0">
          <Plus size={15} />
          <span>Nova Oração</span>
        </button>
      </div>

      {/* Prayers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(prayers || []).map((prayer, idx) => {
          const isTestingThis = testAudioSrc === prayer.audioUrl && isTestingAudio;
          return (
            <div 
              key={prayer.id || idx}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between gap-4 group hover:shadow-md transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    <img src={prayer.coverUrl || "/dorme-dorme-precioso-capa.png"} alt={prayer.title} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-black/60 text-[9px] font-mono text-white font-bold">#{idx + 1}</div>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold uppercase tracking-wider">
                        {prayer.category || 'Oração'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">⏱️ {prayer.duration}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-800 truncate mt-1">{prayer.title}</h4>
                    <p className="text-xs text-slate-500 truncate">{prayer.subtitle || 'Oração guiada'}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-serif line-clamp-3 italic leading-relaxed">
                  "{prayer.fullText || 'Sem texto cadastrado ainda...'}"
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => toggleTestPlay(prayer.audioUrl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isTestingThis ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}>
                  {isTestingThis ? <><Pause size={13} /><span>Pausar</span></> : <><Play size={13} className="ml-0.5" /><span>Ouvir</span></>}
                </button>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleStartEditPrayer(prayer)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer">
                    <Edit3 size={12} /><span>Editar</span>
                  </button>
                  <button onClick={() => handleDeletePrayer(prayer.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer" title="Excluir Oração">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
