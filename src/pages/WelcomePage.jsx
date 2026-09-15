import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Sparkles, 
  Play, 
  Pause, 
  Shield, 
  Moon, 
  Baby, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown,
  Quote,
  Star
} from 'lucide-react';

export default function WelcomePage() {
  const { navigateTo } = useApp();
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const togglePreview = () => {
    if (!audioRef.current) return;
    if (isPlayingPreview) {
      audioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingPreview(true)).catch(() => {});
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navVisible = scrollY > 60;

  return (
    <div className="welcome-landing min-h-screen bg-[#F7F9FC] text-slate-900 overflow-x-hidden selection:bg-amber-400/60 selection:text-slate-950">
      
      <audio ref={audioRef} src="/dorme-dorme-precioso-master.wav" preload="none" onEnded={() => setIsPlayingPreview(false)} />

      {/* ═══════════ BARRA SUPERIOR (HEADER EM AZUL MARIANO & DOURADO) ═══════════ */}
      <header 
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: navVisible ? 'rgba(7, 21, 48, 0.95)' : 'rgba(7, 21, 48, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)'
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[74px] flex items-center justify-between">
          
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform border border-amber-300/40">
              <Sparkles size={18} className="fill-slate-950" />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif font-black text-base tracking-tight block leading-tight text-white group-hover:text-amber-300 transition-colors">
                Dorme, Dorme, Precioso
              </span>
              <span className="text-[9px] uppercase font-bold tracking-[0.18em] block text-amber-400">
                Acolhimento & Oração Materna
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100/80">
            {[
              ['o-acolhimento', 'O Acolhimento'],
              ['nossa-senhora', 'Nossa Senhora'],
              ['beneficios', 'Amamentação'],
              ['depoimentos', 'Depoimentos'],
            ].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:text-amber-300 transition-colors cursor-pointer">{label}</button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => navigateTo('login')} className="px-4 py-2 rounded-full text-xs font-bold text-blue-100 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
              Entrar
            </button>
            <button onClick={() => navigateTo('login')} className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer border border-amber-300/40">
              Fazer Parte <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════ HERO — VÍDEO BACKGROUND (CARREGA 1 VEZ, SEM LOOP) ═══════════ */}
      <section className="relative min-h-[100vh] flex items-center justify-center pt-24 pb-20 px-5 sm:px-8 overflow-hidden bg-[#071530]">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* VÍDEO CARREGA 1 VEZ APENAS (SEM LOOP) */}
          <video autoPlay muted playsInline className="w-full h-full object-cover scale-[1.05] brightness-[0.45] contrast-[1.10]" src="/welcome-hero-video.mp4" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071530]/70 via-[#0B234A]/50 to-[#F7F9FC]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/60 backdrop-blur-md border border-amber-400/30 shadow-lg">
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-200">
              Um abraço na alma da mãe que amamenta
            </span>
          </div>

          <h1 className="font-serif font-black text-[2.1rem] sm:text-[3.2rem] md:text-[3.8rem] text-white leading-[1.10] tracking-tight drop-shadow-xl">
            Você não precisa enfrentar a madrugada{' '}
            <span className="text-amber-300 italic">sozinha</span>.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-xl leading-relaxed drop-shadow">
            Respire fundo. Descanse o coração. Encontre paz espiritual, orientações de amamentação e o acolhimento que sua maternidade merece — sob a bênção de Nossa Senhora.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <button onClick={() => navigateTo('login')} className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 font-serif text-sm font-bold shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all border border-amber-300">
              Quero Acolhimento Agora <ArrowRight size={16} />
            </button>
            <button onClick={togglePreview} className="w-full sm:w-auto px-6 py-4 rounded-full bg-blue-950/80 hover:bg-blue-900/90 active:scale-95 text-blue-100 font-semibold text-sm shadow-lg backdrop-blur-md flex items-center justify-center gap-2.5 cursor-pointer border border-blue-400/30 transition-all">
              <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                {isPlayingPreview ? <Pause size={12} className="fill-current" /> : <Play size={12} className="fill-current ml-0.5" />}
              </span>
              {isPlayingPreview ? 'Pausar Prévia' : 'Ouvir Canção de Acalento'}
            </button>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-5 text-[11px] text-blue-200 font-medium">
            {['100% Gratuito & Seguro', 'Sem Julgamentos', 'Paz para Mãe e Bebê'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-400" />{t}
              </span>
            ))}
          </div>

          <button onClick={() => scrollTo('o-acolhimento')} className="mt-6 text-blue-200 hover:text-white transition-colors flex flex-col items-center gap-1 text-[10px] font-semibold cursor-pointer animate-bounce">
            Deslize para conhecer <ChevronDown size={16} />
          </button>
        </div>
      </section>

      {/* ═══════════ O ACOLHIMENTO ═══════════ */}
      <section id="o-acolhimento" className="py-20 sm:py-28 px-5 sm:px-8 max-w-5xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-900 font-mono">Uma Pausa Sagrada</span>
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-slate-950 leading-snug tracking-tight">
            O amor de mãe é imenso, mas o cansaço do corpo também é real.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Na madrugada silenciosa, quando o mundo dorme, você está acordada cuidando de uma vida inteira. Criamos este espaço para cuidar de <strong className="text-blue-950">você</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: Heart, 
              bg: 'bg-amber-50', 
              textCol: 'text-amber-700', 
              border: 'border-amber-200/80',
              title: 'Vencendo a Culpa', 
              text: 'Sentir exaustão não diminui o seu amor. Aqui você encontra palavras que abraçam e lembram que você é a melhor mãe que seu bebê poderia ter.' 
            },
            { 
              icon: Baby, 
              bg: 'bg-blue-50', 
              textCol: 'text-blue-700', 
              border: 'border-blue-200/80',
              title: 'Pega e Posição Sem Dor', 
              text: 'Amamentar é uma arte que se aprende juntos. Orientações posturais para tornar cada mamada um momento de afeto e alívio real.' 
            },
            { 
              icon: Moon, 
              bg: 'bg-indigo-50', 
              textCol: 'text-indigo-700', 
              border: 'border-indigo-200/80',
              title: 'Áudios Guiados de Sono', 
              text: 'Músicas de acalento e meditações respiratórias que desaceleram o batimento do bebê e conduzem a mãe a um descanso restaurador.' 
            },
          ].map(({ icon: Icon, bg, textCol, border, title, text }) => (
            <div key={title} className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-[0_4px_25px_-8px_rgba(11,35,74,0.08)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className={`w-12 h-12 rounded-2xl ${bg} ${textCol} border ${border} flex items-center justify-center shadow-sm`}>
                <Icon size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">{title}</h3>
              <p className="text-slate-600 text-[13px] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ SESSÃO AZUL: NOSSA SENHORA COM CORES AZUIS E A IMAGEM ENVIADA ═══════════ */}
      <section id="nossa-senhora" className="py-20 sm:py-28 bg-gradient-to-b from-[#071530] via-[#0D254C] to-[#0A1E3F] text-white border-y border-amber-500/20 px-5 sm:px-8 relative overflow-hidden">
        
        {/* Glow de fundo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Imagem com a arte azul enviada pelo usuário */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-84 rounded-[32px] overflow-hidden shadow-2xl shadow-blue-950/80 border-[4px] border-amber-400/40 bg-slate-950 group">
              <img 
                src="/nossa-senhora-bebe-azul.jpg" 
                alt="Nossa Senhora com o Bebê em tons serenos azuis"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                onError={(e) => { 
                  if (!e.currentTarget.src.includes('nossa-senhora-aparecida.jpg')) {
                    e.currentTarget.src = '/nossa-senhora-aparecida.jpg'; 
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 inset-x-4 text-center">
                <span className="text-[11px] font-serif italic text-amber-200 drop-shadow-md block leading-relaxed">
                  "Sob o manto azul sagrado de Maria, cada lágrima vira oração de paz."
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/80 text-amber-300 text-[11px] font-bold border border-amber-400/30 shadow-sm">
              <Shield size={13} className="text-amber-400" /> Acolhimento Espiritual & Proteção
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-[2.4rem] text-white leading-tight tracking-tight drop-shadow">
              Os olhos amorosos da Mãe do Céu velam pelo seu lar nesta noite.
            </h2>

            <p className="text-blue-100 text-[13px] sm:text-sm leading-relaxed">
              Maria também amamentou no silêncio da noite. Ela conhece o peso dos braços exaustos, o receio do choro e o amor infinito de proteger uma vida tão abençoada.
            </p>
            <p className="text-blue-100 text-[13px] sm:text-sm leading-relaxed">
              Disponibilizamos orações cantadas, bênçãos para a saúde do bebê e conteúdos espirituais tranquilos para envolver o seu momento de amamentação em pura serenidade.
            </p>

            <div className="p-5 rounded-2xl bg-blue-950/70 border border-amber-400/25 shadow-lg backdrop-blur-md flex items-start gap-4">
              <Quote size={28} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[13px] font-serif italic text-amber-100 leading-relaxed">
                "Que a ternura de Nossa Senhora envolva o berço do seu bebê e preencha sua alma de calma. Você é amada e abençoada."
              </p>
            </div>

            <button onClick={() => navigateTo('login')} className="mt-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 font-serif font-bold text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/20 inline-flex items-center gap-2 cursor-pointer border border-amber-300">
              Receber Bênção e Entrar <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ BENEFÍCIOS DA AMAMENTAÇÃO ═══════════ */}
      <section id="beneficios" className="py-20 sm:py-28 px-5 sm:px-8 max-w-5xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-900 font-mono">Ciência, Afeto & Espiritualidade</span>
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-slate-950 tracking-tight">
            Os Benefícios Transformadores da Amamentação
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Mais do que nutrição, o ato de amamentar constrói uma ponte biológica e emocional eterna entre o coração da mãe e a alma do bebê.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { n: '01', t: 'A Cascata Natural de Ocitocina e Vínculo', p: 'A sucção estimula a liberação do hormônio do amor, reduzindo cortisol, relaxando a pressão arterial e intensificando a conexão afetiva imediata entre mãe e bebê.' },
            { n: '02', t: 'Uma Vacina Biológica Viva e Diária', p: 'O leite materno se adapta em tempo real: pela saliva do bebê, o organismo da mãe produz anticorpos específicos para os patógenos presentes no ambiente.' },
            { n: '03', t: 'Regulação do Sono e Melatonina Noturna', p: 'O leite produzido à noite contém nucleotídeos e melatonina que ensinam o relógio biológico do recém-nascido a diferenciar dia e noite, acalmando o sono.' },
            { n: '04', t: 'Proteção Cardiovascular e Emocional Materna', p: 'A amamentação reduz a incidência de depressão pós-parto, diminui o risco de diabetes tipo 2 e protege a saúde da mama e do útero a longo prazo.' },
          ].map(({ n, t, p }) => (
            <div key={n} className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-[0_4px_25px_-8px_rgba(11,35,74,0.06)] hover:border-blue-400/40 hover:shadow-xl transition-all duration-300 flex items-start gap-5">
              <span className="font-serif font-black text-3xl text-blue-900/30 shrink-0 leading-none">{n}</span>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-950">{t}</h3>
                <p className="text-slate-600 text-[13px] leading-relaxed">{p}</p>
              </div>
            </div>
          ))}

          {/* Wide Benefit */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-[0_4px_25px_-8px_rgba(11,35,74,0.06)] hover:border-blue-400/40 hover:shadow-xl transition-all duration-300 flex items-start gap-5 md:col-span-2">
            <span className="font-serif font-black text-3xl text-blue-900/30 shrink-0 leading-none">05</span>
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-950">O Aconchego como Remédio para a Alma</h3>
              <p className="text-slate-600 text-[13px] leading-relaxed">No peito da mãe, o bebê reencontra as batidas do coração e o calor do ventre. É o porto seguro onde o choro cessa e o mundo se torna calmo novamente.</p>
            </div>
          </div>
        </div>

        {/* BLUE FEATURE STRIP (SESSÃO EM AZUL MARIANO) */}
        <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#071530] via-[#0C244A] to-[#081B3B] text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-400/30">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 font-mono">Recurso Exclusivo</span>
            <h4 className="font-serif font-bold text-lg sm:text-xl text-white">Temporizador de Mamadas & Audiolivros Consecutivos</h4>
            <p className="text-[13px] text-blue-100 max-w-xl leading-relaxed">Acompanhe qual seio foi ofertado e ouça capítulos sequenciais com timer de desligamento automático — sem tocar no celular com o bebê no colo.</p>
          </div>
          <button onClick={() => navigateTo('login')} className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-serif font-bold text-xs shrink-0 hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer border border-amber-300">
            Experimentar no App
          </button>
        </div>
      </section>

      {/* ═══════════ DEPOIMENTOS ═══════════ */}
      <section id="depoimentos" className="py-16 sm:py-24 bg-[#EEF2F8] border-t border-slate-200/80 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-900 font-mono">Comunidade das Mães</span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-950">O que dizem as mães que encontraram paz</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: 'Eu chorava de exaustão às 3 da manhã achando que estava falhando. Os áudios de acolhimento foram o abraço que eu precisava. Meu bebê dorme em paz ouvindo a canção.', name: 'Camila Rezende', meta: 'Mãe do Theo (2 meses) • Londrina, PR' },
              { q: 'O temporizador de sono e a reprodução contínua salvou minhas noites. Ligo o timer, amamento e tudo se desliga suavemente enquanto durmo com minha filha.', name: 'Mariana Toledo', meta: 'Mãe da Alice (4 meses) • Botucatu, SP' },
              { q: 'A devoção a Nossa Senhora me deu uma força inexplicável para vencer as dores dos primeiros dias. A amamentação virou o momento mais sagrado do meu dia.', name: 'Juliana Ferreira', meta: 'Mãe do Bento (1 mês) • Campinas, SP' },
            ].map(({ q, name, meta }) => (
              <div key={name} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-6px_rgba(11,35,74,0.06)] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex text-amber-500 gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-current" />)}</div>
                  <p className="text-[13px] text-slate-600 italic leading-relaxed">"{q}"</p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <span className="font-bold text-xs text-slate-900 block">{name}</span>
                  <span className="text-[11px] text-slate-400">{meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 text-center max-w-3xl mx-auto space-y-7">
        
        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-800 border border-blue-300/60 flex items-center justify-center mx-auto shadow-md">
          <Heart size={24} className="fill-blue-700 text-blue-800" />
        </div>

        <h2 className="font-serif font-black text-2xl sm:text-4xl md:text-5xl text-slate-950 tracking-tight leading-tight">
          Venha fazer parte deste momento sagrado.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          Crie sua conta gratuitamente e comece a ouvir os áudios e orações de acalento para você e seu bebê.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => navigateTo('login')} className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 font-serif text-sm font-bold shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all border border-amber-300">
            Criar Minha Conta Gratuita <ArrowRight size={16} />
          </button>
          <button onClick={() => navigateTo('login')} className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm cursor-pointer transition-all">
            Já tenho uma conta
          </button>
        </div>
      </section>

      {/* ═══════════ RODAPÉ AZUL (FOOTER MARIANO AZUL) ═══════════ */}
      <footer className="bg-[#051126] text-blue-200 py-12 px-5 sm:px-8 border-t border-amber-500/30 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="font-serif font-bold text-white text-base block">Dorme, Dorme, Precioso</span>
            <p className="text-blue-300/70 text-[11px]">Acolhimento maternal, amamentação serena e paz espiritual.</p>
          </div>
          <div className="flex items-center gap-6 text-blue-200/80 text-[11px] font-medium">
            <button onClick={() => scrollTo('o-acolhimento')} className="hover:text-amber-300 transition-colors cursor-pointer">O Projeto</button>
            <button onClick={() => scrollTo('beneficios')} className="hover:text-amber-300 transition-colors cursor-pointer">Amamentação</button>
            <button onClick={() => navigateTo('login')} className="hover:text-amber-300 transition-colors cursor-pointer">Acesso</button>
            <button onClick={() => navigateTo('admin')} className="hover:text-amber-400 transition-colors cursor-pointer font-mono text-[10px]">Admin</button>
          </div>
          <span className="text-[10px] text-blue-400/60">© {new Date().getFullYear()} Augusta & Equipe</span>
        </div>
      </footer>

      {/* Inline styles para tipografia */}
      <style>{`
        .welcome-landing { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        .welcome-landing h1, .welcome-landing h2, .welcome-landing h3, .welcome-landing h4 {
          font-family: 'Playfair Display', 'Georgia', 'Palatino Linotype', serif;
        }
      `}</style>
    </div>
  );
}
