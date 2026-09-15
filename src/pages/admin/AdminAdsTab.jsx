import React from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  MousePointerClick, 
  XCircle, 
  TrendingUp, 
  Megaphone, 
  Image as ImageIcon, 
  Video, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export default function AdminAdsTab({
  announcements,
  handleOpenNewAd,
  handleStartEditAd,
  handleDeleteAd,
  handleToggleAdEnabled,
  handleResetAdMetrics
}) {
  const totalViews = (announcements || []).reduce((acc, a) => acc + (a.viewsCount || 0), 0);
  const totalClicks = (announcements || []).reduce((acc, a) => acc + (a.clicksCount || 0), 0);
  const totalCloses = (announcements || []).reduce((acc, a) => acc + (a.closesCount || 0), 0);
  const overallCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-500" />
            <span>Anúncios & Propagandas</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Crie anúncios promocionais (vídeo ou imagem), configure o botão de ação e acompanhe as estatísticas.
          </p>
        </div>

        <button
          onClick={handleOpenNewAd}
          className="px-4 py-2.5 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>Criar Novo Anúncio</span>
        </button>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Views */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Visualizações (Impressões)</span>
            <Eye size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 font-mono">{totalViews}</p>
        </div>

        {/* Total Clicks */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Cliques no Botão</span>
            <MousePointerClick size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 font-mono">{totalClicks}</p>
        </div>

        {/* Total Closes */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Anúncios Fechados</span>
            <XCircle size={18} className="text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 font-mono">{totalCloses}</p>
        </div>

        {/* Taxa de Engajamento CTR */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Taxa de Conversão (CTR)</span>
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 font-mono">{overallCtr}%</p>
        </div>

      </div>

      {/* Ads List */}
      <div className="space-y-4">
        {(announcements || []).map((ad, idx) => {
          const views = ad.viewsCount || 0;
          const clicks = ad.clicksCount || 0;
          const closes = ad.closesCount || 0;
          const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';

          return (
            <div 
              key={ad.id || idx}
              className={`p-4 sm:p-5 rounded-2xl bg-white border shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 w-full min-w-0 overflow-hidden ${
                ad.enabled ? 'border-amber-400/60 bg-amber-50/10' : 'border-slate-200 opacity-75'
              }`}
            >
              {/* Media Thumbnail & Ad Info */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 flex-1 w-full min-w-0 overflow-hidden">
                {/* Media Preview Box */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900 border border-slate-200 shrink-0 overflow-hidden relative shadow-sm flex items-center justify-center text-white">
                  {ad.mediaType === 'video' ? (
                    <div className="flex flex-col items-center gap-1 text-amber-400">
                      <Video size={20} />
                      <span className="text-[8px] sm:text-[9px] font-bold uppercase">Vídeo</span>
                    </div>
                  ) : ad.mediaUrl ? (
                    <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={20} className="text-slate-500" />
                  )}
                  <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-[9px] font-mono text-white font-bold">
                    #{idx + 1}
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col min-w-0 flex-1 w-full overflow-hidden">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ad.enabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {ad.enabled ? '● Ativo no App' : '○ Pausado'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono capitalize truncate">
                      Formato: {ad.mediaType === 'video' ? '📹 Vídeo por Link' : '🖼️ Imagem'}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate mt-1 w-full max-w-full">{ad.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 break-words w-full max-w-full">{ad.text || 'Sem texto descritivo.'}</p>

                  <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-600 w-full max-w-full overflow-hidden">
                    <div className="flex flex-wrap items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 w-full max-w-full min-w-0 overflow-hidden">
                      <ExternalLink size={12} className="shrink-0" />
                      <span className="shrink-0">Botão: <strong className="text-amber-900">{ad.buttonText || 'Saber Mais'}</strong></span>
                      <span className="text-slate-400 font-normal truncate max-w-[120px] sm:max-w-[220px] inline-block" title={ad.buttonLink}>({ad.buttonLink})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Stats Badge Column */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 text-xs font-mono w-full md:w-auto">
                  <div className="px-1">
                    <span className="block text-[9px] sm:text-[10px] text-slate-400 uppercase font-sans truncate">Exibições</span>
                    <span className="font-bold text-slate-700">{views}</span>
                  </div>
                  <div className="px-1">
                    <span className="block text-[9px] sm:text-[10px] text-amber-600 uppercase font-sans truncate">Cliques</span>
                    <span className="font-bold text-amber-600">{clicks}</span>
                  </div>
                  <div className="px-1">
                    <span className="block text-[9px] sm:text-[10px] text-rose-500 uppercase font-sans truncate">Fechou</span>
                    <span className="font-bold text-rose-500">{closes}</span>
                  </div>
                  <div className="px-1">
                    <span className="block text-[9px] sm:text-[10px] text-emerald-600 uppercase font-sans truncate">CTR</span>
                    <span className="font-bold text-emerald-600">{ctr}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleToggleAdEnabled(ad.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      ad.enabled 
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                    }`}
                  >
                    {ad.enabled ? 'Pausar Anúncio' : 'Ativar Anúncio'}
                  </button>

                  <button
                    onClick={() => handleStartEditAd(ad)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                  >
                    <Edit3 size={12} />
                    <span>Editar</span>
                  </button>

                  {handleResetAdMetrics && (
                    <button
                      onClick={() => handleResetAdMetrics(ad.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="Zerar estatísticas"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteAd(ad.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Excluir Anúncio"
                  >
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
