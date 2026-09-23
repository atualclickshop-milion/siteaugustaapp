import React from 'react';
import { Sliders, Baby, Wind, Headphones, Sparkles, Music, ToggleLeft, ToggleRight, Save, Plus, Play, Pause, Edit3, Trash2 } from 'lucide-react';

export default function AdminHomeTab({
  localHomeSettings,
  handleToggleHomeSetting,
  handleSaveHomeSettings,
  momentsList,
  handleOpenNewMoment,
  handleStartEditMoment,
  handleDeleteMoment,
  handleToggleMomentEnabled,
  testAudioSrc,
  isTestingAudio,
  toggleTestPlay
}) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Momentos & Tela Inicial</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure os módulos da tela principal e os cards de acolhimento.</p>
      </div>

      {/* 1. Módulos & Recursos Opcionais da Tela Inicial */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0C1B3A]/5 text-[#0C1B3A] border border-[#0C1B3A]/10">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Módulos & Seções Opcionais
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ative ou desative as ferramentas que aparecem para as mães.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Toggle 1: Suporte de Amamentação */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-pink-50 text-pink-500 border border-pink-100 shrink-0">
                <Baby size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  Timer & Lado da Amamentação
                </span>
                <span className="text-[11px] text-slate-400">
                  Cronômetro com seletor de peito (esquerdo/direito)
                </span>
              </div>
            </div>
            <button type="button" onClick={() => handleToggleHomeSetting('showNursingTimer')} className="transition-transform active:scale-95 cursor-pointer">
              {localHomeSettings.showNursingTimer ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-slate-300" />}
            </button>
          </div>

          {/* Toggle 2: Respiração Guiada */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-sky-50 text-sky-500 border border-sky-100 shrink-0">
                <Wind size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  Respiração Guiada (4-7-8)
                </span>
                <span className="text-[11px] text-slate-400">
                  Exercício guiado de calma e alívio do estresse
                </span>
              </div>
            </div>
            <button type="button" onClick={() => handleToggleHomeSetting('showBreathingExercise')} className="transition-transform active:scale-95 cursor-pointer">
              {localHomeSettings.showBreathingExercise ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-slate-300" />}
            </button>
          </div>

          {/* Toggle 3: Continuar Ouvindo */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-500 border border-indigo-100 shrink-0">
                <Headphones size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  Player "Continuar Ouvindo"
                </span>
                <span className="text-[11px] text-slate-400">
                  Card de retomada rápida da última faixa tocada
                </span>
              </div>
            </div>
            <button type="button" onClick={() => handleToggleHomeSetting('showContinueListening')} className="transition-transform active:scale-95 cursor-pointer">
              {localHomeSettings.showContinueListening ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-slate-300" />}
            </button>
          </div>

          {/* Toggle 4: Banner da Canção */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-500 border border-amber-100 shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  Banner da Canção Principal
                </span>
                <span className="text-[11px] text-slate-400">
                  Atalho dourado para ouvir em plataformas externas
                </span>
              </div>
            </div>
            <button type="button" onClick={() => handleToggleHomeSetting('showSpecialSongBanner')} className="transition-transform active:scale-95 cursor-pointer">
              {localHomeSettings.showSpecialSongBanner !== false ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-slate-300" />}
            </button>
          </div>

          {/* Toggle 5: Aba de Músicas no App */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 shrink-0">
                <Music size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  Aba de Músicas no Aplicativo
                </span>
                <span className="text-[11px] text-slate-400">
                  Exibe a aba "Músicas" no menu superior e na barra móvel
                </span>
              </div>
            </div>
            <button type="button" onClick={() => handleToggleHomeSetting('musicTabEnabled')} className="transition-transform active:scale-95 cursor-pointer">
              {localHomeSettings.musicTabEnabled !== false ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-slate-300" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button type="button" onClick={handleSaveHomeSettings}
            className="px-5 py-2.5 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            <Save size={14} />
            <span>Salvar Preferências</span>
          </button>
        </div>
      </div>

      {/* 2. Cards de "Escolha seu Momento" */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Cards "Escolha seu Momento" ({momentsList?.length || 0})
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#0C1B3A]/5 text-[#0C1B3A] border border-[#0C1B3A]/10 text-[10px] font-bold">
                Tela Inicial
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure os cards de acolhimento rápido exibidos na tela principal.
            </p>
          </div>
          <button type="button" onClick={handleOpenNewMoment}
            className="px-4 py-2.5 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer">
            <Plus size={15} />
            <span>Adicionar Momento</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(momentsList || []).map((moment, idx) => {
            const isTestingThis = testAudioSrc === moment.audioUrl && isTestingAudio;
            return (
              <div 
                key={moment.id || idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between gap-4 group hover:shadow-md transition-all"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                      <img src={moment.coverUrl || "/dorme-dorme-precioso-capa.png"} alt={moment.title} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-black/60 text-[9px] font-mono text-white font-bold">#{idx + 1}</div>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#0C1B3A]/5 text-[#0C1B3A] border border-[#0C1B3A]/10 text-[10px] font-bold uppercase tracking-wider truncate max-w-[140px]">
                          {moment.badge || 'Momento'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">⏱️ {moment.duration || '04:30'}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-800 truncate mt-1">{moment.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{moment.description || 'Acolhimento para mães'}</p>
                    </div>
                  </div>
                  {moment.textSnippet && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-serif line-clamp-2 italic leading-relaxed">
                      "{moment.textSnippet}"
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => toggleTestPlay(moment.audioUrl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isTestingThis ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}>
                    {isTestingThis ? <><Pause size={13} /><span>Pausar</span></> : <><Play size={13} className="ml-0.5" /><span>Ouvir</span></>}
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => handleToggleMomentEnabled(moment.id)} className="p-1 rounded-lg cursor-pointer" title={moment.enabled !== false ? 'Ocultar' : 'Exibir'}>
                      {moment.enabled !== false ? <ToggleRight size={22} className="text-emerald-500" /> : <ToggleLeft size={22} className="text-slate-300" />}
                    </button>
                    <button type="button" onClick={() => handleStartEditMoment(moment)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer">
                      <Edit3 size={12} /><span>Editar</span>
                    </button>
                    <button type="button" onClick={() => handleDeleteMoment(moment.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer" title="Excluir Momento">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
