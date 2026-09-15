import React from 'react';
import { Globe, ToggleLeft, ToggleRight, Link as LinkIcon, MessageCircle, Phone, Save } from 'lucide-react';

export default function AdminPlatformsTab({
  localPlatforms,
  handleTogglePlatform,
  handlePlatformUrlChange,
  handlePlatformCtaChange,
  handleSavePlatforms,
  localSupportSettings,
  setLocalSupportSettings,
  handleSaveSupportSettings
}) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Configurações</h1>
        <p className="text-sm text-slate-500 mt-0.5">Links de plataformas, WhatsApp e suporte.</p>
      </div>

      {/* 1. Platforms Config Card */}
      <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2 text-[#0C1B3A] text-xs font-bold uppercase tracking-wide">
              <Globe size={15} />
              <span>Plataformas Musicais</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
              Links Externos & Streaming
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Ative ou desative cada plataforma exibida no banner e defina os links diretos.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {localPlatforms.map((platform) => (
            <div 
              key={platform.id}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-[180px]">
                <button type="button" onClick={() => handleTogglePlatform(platform.id)} className="transition-transform active:scale-95 cursor-pointer" title={platform.enabled ? 'Desativar' : 'Ativar'}>
                  {platform.enabled ? <ToggleRight size={30} className="text-emerald-500" /> : <ToggleLeft size={30} className="text-slate-300" />}
                </button>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">{platform.name}</span>
                  <span className={`text-[10px] font-bold ${platform.enabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {platform.enabled ? '● Ativo no aplicativo' : '○ Desativado (oculto)'}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200">
                  <LinkIcon size={14} className="text-slate-400 shrink-0" />
                  <input type="text" placeholder={`Link para ${platform.name}`} value={platform.url || ''} onChange={e => handlePlatformUrlChange(platform.id, e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none" />
                </div>
                <input type="text" placeholder="Texto do Botão (CTA)" value={platform.ctaText || ''} onChange={e => handlePlatformCtaChange(platform.id, e.target.value)}
                  className="w-full sm:w-40 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#0C1B3A]" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-1">
          <button onClick={handleSavePlatforms}
            className="px-5 py-2.5 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            <Save size={14} /><span>Salvar Plataformas</span>
          </button>
        </div>
      </div>

      {/* 2. WhatsApp Support & Community */}
      <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5">
        <div className="border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wide">
            <MessageCircle size={15} />
            <span>Atendimento & Comunidade</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
            WhatsApp de Suporte & Grupo de Apoio
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure o contato direto e o link do grupo de acolhimento das mães.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp Suporte Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700">WhatsApp de Suporte</span>
                  <p className="text-[10px] text-slate-400">Atendimento e acolhimento direto</p>
                </div>
              </div>
              <button type="button" onClick={() => setLocalSupportSettings(prev => ({ ...prev, whatsappSupportEnabled: !prev.whatsappSupportEnabled }))} className="transition-transform active:scale-95 cursor-pointer">
                {localSupportSettings?.whatsappSupportEnabled ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-slate-300" />}
              </button>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">Número de WhatsApp (com DDD)</label>
                <input type="text" placeholder="+55 11 99876-5432" value={localSupportSettings?.whatsappSupportNumber || ''}
                  onChange={e => setLocalSupportSettings(prev => ({ ...prev, whatsappSupportNumber: e.target.value }))}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 placeholder-slate-400 font-mono focus:outline-none focus:border-[#0C1B3A]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">Mensagem Padrão Inicial</label>
                <input type="text" placeholder="Olá Augusta, preciso de ajuda com o aplicativo..." value={localSupportSettings?.whatsappSupportMessage || ''}
                  onChange={e => setLocalSupportSettings(prev => ({ ...prev, whatsappSupportMessage: e.target.value }))}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#0C1B3A]" />
              </div>
            </div>
          </div>

          {/* Grupo VIP */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700">Grupo de Apoio (WhatsApp)</span>
                  <p className="text-[10px] text-slate-400">Comunidade e acolhimento das mães</p>
                </div>
              </div>
              <button type="button" onClick={() => setLocalSupportSettings(prev => ({ ...prev, communityGroupEnabled: !prev.communityGroupEnabled }))} className="transition-transform active:scale-95 cursor-pointer">
                {localSupportSettings?.communityGroupEnabled ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-slate-300" />}
              </button>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">Link de Convite do Grupo</label>
                <input type="text" placeholder="https://chat.whatsapp.com/..." value={localSupportSettings?.communityGroupUrl || ''}
                  onChange={e => setLocalSupportSettings(prev => ({ ...prev, communityGroupUrl: e.target.value }))}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 placeholder-slate-400 font-mono focus:outline-none focus:border-[#0C1B3A]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">Texto do Botão (CTA)</label>
                <input type="text" placeholder="Entrar no Grupo de Apoio do WhatsApp" value={localSupportSettings?.communityGroupCta || ''}
                  onChange={e => setLocalSupportSettings(prev => ({ ...prev, communityGroupCta: e.target.value }))}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#0C1B3A]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button onClick={handleSaveSupportSettings}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            <Save size={14} /><span>Salvar Suporte & Grupo</span>
          </button>
        </div>
      </div>

    </div>
  );
}
