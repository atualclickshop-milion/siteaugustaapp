import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, Pause, RotateCcw, Heart, Check, Clock } from 'lucide-react';

export default function NursingTimerModal() {
  const { isNursingModalOpen, setIsNursingModalOpen } = useApp();
  
  const [side, setSide] = useState('esq'); // 'esq', 'dir', 'ambos'
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ddp_nursing_history');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '02:40', duration: '18 min', side: 'Seio Esquerdo' },
      { id: '2', time: '23:15', duration: '22 min', side: 'Seio Direito' }
    ];
  });

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isNursingModalOpen) return null;

  const formatTime = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (seconds === 0) return;
    const now = new Date();
    const newEntry = {
      id: Date.now().toString(),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      duration: `${Math.ceil(seconds / 60)} min`,
      side: side === 'esq' ? 'Seio Esquerdo' : side === 'dir' ? 'Seio Direito' : 'Ambos os Seios'
    };
    const updated = [newEntry, ...history.slice(0, 4)];
    setHistory(updated);
    localStorage.setItem('ddp_nursing_history', JSON.stringify(updated));
    setSeconds(0);
    setIsActive(false);
  };

  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-night-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-night-900 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤱</span>
            <div>
              <h3 className="text-base font-bold text-white">Cronômetro de Amamentação</h3>
              <p className="text-xs text-slate-400">Acompanhe o tempo de cada seio com calma</p>
            </div>
          </div>
          <button 
            onClick={() => setIsNursingModalOpen(false)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Side Selector */}
        <div className="grid grid-cols-2 gap-2 bg-night-950 p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setSide('esq')}
            className={`py-2 rounded-xl text-xs font-semibold transition-all ${
              side === 'esq' ? 'bg-marian-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Seio Esquerdo
          </button>
          <button
            onClick={() => setSide('dir')}
            className={`py-2 rounded-xl text-xs font-semibold transition-all ${
              side === 'dir' ? 'bg-marian-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Seio Direito
          </button>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center justify-center py-4 bg-gradient-to-b from-night-850 to-night-950 rounded-2xl border border-white/5">
          <span className="text-[11px] uppercase tracking-wider text-gold-400 font-bold mb-1">
            Tempo Decorrido
          </span>
          <span className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-wider">
            {formatTime(seconds)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex-1 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              isActive 
                ? 'bg-amber-600 text-white hover:bg-amber-500' 
                : 'bg-gradient-to-r from-gold-500 to-amber-500 text-night-950 font-bold hover:brightness-110'
            }`}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} className="ml-0.5 fill-night-950" />}
            <span>{isActive ? 'Pausar' : 'Iniciar Mamada'}</span>
          </button>

          {seconds > 0 && (
            <button
              onClick={handleSave}
              className="px-4 py-3 rounded-2xl bg-marian-600 hover:bg-marian-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
              title="Salvar registro"
            >
              <Check size={16} /> Salvar
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Zerar"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Recent History */}
        {history.length > 0 && (
          <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock size={12} /> Últimas mamadas desta madrugada
            </span>
            <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto">
              {history.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/5">
                  <span className="text-slate-300 font-medium">{item.side}</span>
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                    <span className="text-gold-300">{item.duration}</span>
                    <span>• {item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
