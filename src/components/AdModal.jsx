import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, ExternalLink, Megaphone, Play } from 'lucide-react';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../utils/youtubeHelper';

export default function AdModal() {
  const { announcements, trackAdMetric } = useApp();
  const [activeAd, setActiveAd] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Find the first active enabled ad
    const enabledAd = (announcements || []).find(a => a.enabled !== false);
    if (enabledAd) {
      // Check if user dismissed this ad permanently
      const dismissed = localStorage.getItem(`ddp_ad_dismissed_${enabledAd.id}`);
      if (!dismissed) {
        setActiveAd(enabledAd);
        setIsOpen(true);
        // Track impression view
        trackAdMetric(enabledAd.id, 'view');
      }
    } else {
      setIsOpen(false);
    }
  }, [announcements]);

  if (!isOpen || !activeAd) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (activeAd?.id) {
      localStorage.setItem(`ddp_ad_dismissed_${activeAd.id}`, 'true');
      trackAdMetric(activeAd.id, 'close');
    }
  };

  const handleActionClick = () => {
    if (activeAd?.id) {
      trackAdMetric(activeAd.id, 'click');
      if (activeAd.buttonLink && activeAd.buttonLink !== '#') {
        window.open(activeAd.buttonLink, '_blank', 'noopener,noreferrer');
      }
    }
    handleClose();
  };

  const isYT = isYouTubeUrl(activeAd.mediaUrl);
  const ytEmbed = isYT ? getYouTubeEmbedUrl(activeAd.mediaUrl) : null;

  return (
    <div className="fixed inset-0 z-[90] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-md w-full bg-[#0A1628] text-white rounded-3xl overflow-hidden shadow-2xl border border-amber-400/30 relative flex flex-col animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-all cursor-pointer shadow-lg"
          title="Fechar anúncio"
        >
          <X size={18} />
        </button>

        {/* Media Top Container */}
        <div className="relative w-full h-52 sm:h-60 bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center">
          {activeAd.mediaType === 'video' ? (
            ytEmbed ? (
              <iframe
                src={`${ytEmbed}?autoplay=1&mute=1`}
                title={activeAd.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video 
                src={activeAd.mediaUrl}
                controls
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            )
          ) : activeAd.mediaUrl ? (
            <img 
              src={activeAd.mediaUrl} 
              alt={activeAd.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-amber-400 p-6 text-center">
              <Megaphone size={40} />
              <span className="text-xs font-bold font-serif">Dorme, Dorme, Precioso</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-black/30 pointer-events-none"></div>

          {/* Ad Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <span>✦ Anúncio Especial</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-4 text-center">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-amber-100 leading-snug">
              {activeAd.title}
            </h3>
            <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
              {activeAd.text}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleActionClick}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 hover:brightness-110 active:scale-98 text-slate-950 font-serif font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>{activeAd.buttonText || 'Saber Mais'}</span>
              <ExternalLink size={16} />
            </button>

            <button
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-white transition-colors py-1 cursor-pointer"
            >
              Agora não
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
