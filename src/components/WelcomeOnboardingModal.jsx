import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  Music, 
  Timer, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Baby, 
  Smile,
  ShieldCheck,
  Star
} from 'lucide-react';

export default function WelcomeOnboardingModal() {
  const { isWelcomeModalOpen, completeOnboarding, user } = useApp();

  const [step, setStep] = useState(1);
  const [motherName, setMotherName] = useState(user?.name || '');
  const [babyName, setBabyName] = useState(user?.babyName || '');
  const [babyStage, setBabyStage] = useState('0-3');

  if (!isWelcomeModalOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      name: motherName.trim() || 'Mamãe',
      babyName: babyName.trim() || 'Meu Bebê'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0A1628] text-white border border-amber-400/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Top Header Background Banner */}
        <div className="relative h-44 bg-gradient-to-b from-amber-500/20 to-[#0A1628] overflow-hidden flex items-center justify-center p-6 shrink-0">
          <img 
            src="/nossa-senhora-header.jpg" 
            alt="Nossa Senhora do Bom Parto" 
            className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/60 to-transparent" />
          
          <div className="relative z-10 text-center space-y-1 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Boas-vindas Acolhedoras
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
              Dorme Dorme Precioso
            </h2>
            <p className="text-xs text-amber-200/90 font-sans max-w-xs mx-auto">
              Seu refúgio de paz, fé e serenidade na maternidade
            </p>
          </div>
        </div>

        {/* Step Navigation Dots */}
        <div className="flex items-center justify-center gap-2 py-3 bg-[#0E1F38] border-y border-slate-800/80 shrink-0">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === s 
                  ? 'w-8 bg-amber-400 shadow-sm shadow-amber-400/50' 
                  : step > s 
                  ? 'w-2 bg-emerald-400' 
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 font-sans">
          
          {/* STEP 1: WELCOME & BLESSING */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                  <Heart className="w-6 h-6 fill-amber-400/30" />
                </div>
                <h3 className="text-base font-bold text-amber-200 font-serif">
                  Que a luz de Nossa Senhora abençoe o seu lar
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sabemos o quanto a rotina materna pode ser intensa. Criamos este aplicativo para ser a sua companhia silenciosa nas madrugadas e o seu descanso nos momentos de exaustão.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0E1F38]/80 border border-slate-800">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Experiência 100% Única</h4>
                    <p className="text-[11px] text-slate-400">Sem reproduções automáticas genéricas. Tudo aqui respeita o seu tempo e o do seu bebê.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0E1F38]/80 border border-slate-800">
                  <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Paz de Espírito & Fé</h4>
                    <p className="text-[11px] text-slate-400">Orações, áudios guiados e canções pensadas no bem-estar físico e espiritual da família.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FEATURES OVERVIEW */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white font-serif">
                  Conheça os 4 Pilares da Sua Jornada
                </h3>
                <p className="text-xs text-slate-400">
                  Ferramentas delicadas pensadas para cada momento do seu dia
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#0E1F38] border border-slate-800 space-y-1.5 hover:border-amber-400/40 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Audiobooks Guiados</h4>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Capítulos de apoio para lidar com o cansaço e puerpério.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#0E1F38] border border-slate-800 space-y-1.5 hover:border-amber-400/40 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-indigo-400/20 text-indigo-300 flex items-center justify-center">
                    <Music className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Canções de Ninar</h4>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Frequências suaves para acalmar seu bebê na hora de dormir.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#0E1F38] border border-slate-800 space-y-1.5 hover:border-amber-400/40 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Orações Noturnas</h4>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Momentos de benção e paz para toda a sua família.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#0E1F38] border border-slate-800 space-y-1.5 hover:border-amber-400/40 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                    <Timer className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Timer & Amamentação</h4>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Acompanhe as mamadas e programe o desligamento suave.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PERSONALIZATION */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white font-serif">
                  Como podemos chamar vocês?
                </h3>
                <p className="text-xs text-slate-400">
                  Personalize sua experiência para que tudo seja acolhedor e único
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    Seu Nome (Mamãe)
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Ex: Maria"
                    className="w-full bg-[#0E1F38] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    Nome do Seu Bebê
                  </label>
                  <input
                    type="text"
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                    placeholder="Ex: Gabriel"
                    className="w-full bg-[#0E1F38] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">
                    Momento Atual do Bebê
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '0-3', label: '0 a 3 meses' },
                      { id: '3-12', label: '3 a 12 meses' },
                      { id: 'gestante', label: 'Gestante' }
                    ].map((stage) => (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => setBabyStage(stage.id)}
                        className={`py-2 px-2.5 rounded-xl border text-[11px] font-medium transition-all ${
                          babyStage === stage.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                            : 'bg-[#0E1F38] border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {stage.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#0E1F38] border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all ml-auto"
          >
            {step === 3 ? (
              <>
                Iniciar Minha Jornada de Paz ✨
                <Check className="w-4 h-4 stroke-[3]" />
              </>
            ) : (
              <>
                Continuar
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
