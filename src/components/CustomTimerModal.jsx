import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Timer, X, Check, Clock, Plus, Minus } from 'lucide-react';

export default function CustomTimerModal() {
  const { isCustomTimerModalOpen, setIsCustomTimerModalOpen, setTimer, sleepTimerMinutes, sleepTimerRemaining } = useApp();
  const [customMinutes, setCustomMinutes] = useState(20);

  if (!isCustomTimerModalOpen) return null;

  const quickPresets = [5, 10, 15, 20, 30, 45, 60, 90];

  const handleApply = (mins) => {
    setTimer(mins);
    setIsCustomTimerModalOpen(false);
  };

  const handleAdjust = (delta) => {
    setCustomMinutes(prev => Math.max(1, Math.min(180, prev + delta)));
  };

  return (
    <div className="fixed inset-0 z-50 bg-night-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white dark:bg-night-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-600 dark:text-gold-400 flex items-center justify-center">
              <Timer size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-marian-900 dark:text-white">Temporizador de Sono</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Desligar áudio automaticamente</p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomTimerModalOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Custom Stepper Input */}
        <div className="flex flex-col items-center justify-center py-4 px-6 bg-slate-50 dark:bg-night-950 rounded-2xl border border-slate-200 dark:border-white/5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 mb-2">
            Tempo Personalizado
          </span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => handleAdjust(-5)}
              className="w-10 h-10 rounded-full bg-white dark:bg-night-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:scale-105 active:scale-95 shadow-sm"
            >
              <Minus size={18} />
            </button>
            <div className="flex items-baseline gap-1 min-w-[100px] justify-center">
              <input
                type="number"
                min="1"
                max="180"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="text-4xl font-bold font-mono text-center w-20 bg-transparent text-marian-900 dark:text-white focus:outline-none"
              />
              <span className="text-xs font-semibold text-slate-500">min</span>
            </div>
            <button
              type="button"
              onClick={() => handleAdjust(5)}
              className="w-10 h-10 rounded-full bg-white dark:bg-night-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:scale-105 active:scale-95 shadow-sm"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Quick Presets Grid */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Ou escolha um atalho rápido:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {quickPresets.map(mins => (
              <button
                key={mins}
                type="button"
                onClick={() => setCustomMinutes(mins)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                  customMinutes === mins
                    ? 'bg-marian-600 text-white border-marian-600 shadow-md'
                    : 'bg-white dark:bg-night-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-gold-500'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
          <button
            onClick={() => handleApply(customMinutes)}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 hover:brightness-110 text-night-950 font-bold text-xs shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2"
          >
            <Check size={16} />
            <span>Ativar para {customMinutes} minutos</span>
          </button>
          {sleepTimerMinutes && (
            <button
              onClick={() => {
                setTimer(null);
                setIsCustomTimerModalOpen(false);
              }}
              className="px-3 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-500/30"
            >
              Desativar
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
