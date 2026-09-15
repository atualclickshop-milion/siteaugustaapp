import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wind, X, Play, Pause, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { soothingSynth } from '../utils/audioSynth';

export default function BreathingModal() {
  const { isBreathingModalOpen, setIsBreathingModalOpen } = useApp();
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState('inhale'); // 'inhale' (4s), 'hold' (7s), 'exhale' (8s)
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(1);

  useEffect(() => {
    let timer = null;
    if (isBreathingModalOpen && isActive) {
      timer = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            // transition phase
            if (phase === 'inhale') {
              setPhase('hold');
              soothingSynth.playGentleTone(330, 2);
              return 7;
            } else if (phase === 'hold') {
              setPhase('exhale');
              soothingSynth.playGentleTone(260, 3);
              return 8;
            } else {
              setPhase('inhale');
              setCycle(c => c + 1);
              soothingSynth.playGentleTone(392, 2);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingModalOpen, isActive, phase]);

  if (!isBreathingModalOpen) return null;

  const phaseDetails = {
    inhale: {
      title: 'Inspire Suavemente',
      instruction: 'Puxe o ar pelo nariz, enchendo o peito com calma e serenidade.',
      color: 'text-marian-600 dark:text-marian-400',
      scale: 'scale-125'
    },
    hold: {
      title: 'Segure o Ar',
      instruction: 'Mantenha o ar nos pulmões, relaxando os ombros e a mandíbula.',
      color: 'text-gold-600 dark:text-gold-400',
      scale: 'scale-125'
    },
    exhale: {
      title: 'Solte Devagar',
      instruction: 'Solte todo o ar pela boca, liberando todo o cansaço e a tensão.',
      color: 'text-indigo-600 dark:text-indigo-400',
      scale: 'scale-90'
    }
  };

  const current = phaseDetails[phase];

  return (
    <div className="fixed inset-0 z-50 bg-night-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-night-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center gap-6 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsBreathingModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-marian-50 dark:bg-marian-900/40 text-marian-700 dark:text-marian-300 border border-marian-200 dark:border-marian-700/50">
            Técnica 4-7-8 • Ciclo {cycle}
          </span>
          <h3 className="font-serif text-2xl font-bold text-marian-900 dark:text-white mt-1">
            Respiração da Mãe Serena
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 max-w-xs">
            Desacelere seus batimentos e sinta o acolhimento nesta madrugada.
          </p>
        </div>

        {/* Breathing Animated Circle */}
        <div className="relative w-52 h-52 flex items-center justify-center my-2">
          {/* Outer Ripple */}
          <div className={`absolute inset-0 rounded-full border-2 border-marian-400/40 transition-transform duration-1000 ${current.scale} animate-pulse-slow`}></div>
          <div className={`absolute inset-4 rounded-full bg-gradient-to-tr from-marian-600/20 via-gold-500/20 to-indigo-600/20 backdrop-blur-sm transition-transform duration-1000 ${current.scale}`}></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className={`text-6xl font-mono font-bold ${current.color}`}>
              {count}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mt-1">
              {current.title}
            </span>
          </div>
        </div>

        {/* Instruction */}
        <p className="text-xs text-slate-600 dark:text-slate-300 italic max-w-xs min-h-[36px]">
          "{current.instruction}"
        </p>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full pt-2 border-t border-slate-100 dark:border-white/5">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex-1 py-3 rounded-2xl bg-marian-600 hover:bg-marian-500 text-white font-bold text-xs shadow-lg shadow-marian-600/20 flex items-center justify-center gap-2"
          >
            {isActive ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            <span>{isActive ? 'Pausar Exercício' : 'Continuar'}</span>
          </button>
          <button
            onClick={() => {
              setPhase('inhale');
              setCount(4);
              setCycle(1);
            }}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300"
            title="Reiniciar"
          >
            <RotateCcw size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
