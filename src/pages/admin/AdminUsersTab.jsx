import React from 'react';
import { 
  ShieldCheck, Sparkles, Clock, Search, UserPlus, Key, UserCheck, UserX, Edit3, Trash2, Users, MoreVertical, Download, FileText, Phone
} from 'lucide-react';

export default function AdminUsersTab({
  localAccessSettings, handleSetRegistrationMode, usersList, userSearchQuery, setUserSearchQuery,
  userFilterStatus, setUserFilterStatus, handleOpenNewUser, handleQuickApproveUser,
  handleQuickToggleBlock, handleStartEditUser, handleDeleteUser
}) {
  const filteredUsers = (usersList || []).filter(u => {
    const q = (userSearchQuery || '').toLowerCase().trim();
    const matchesQuery = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.babyName?.toLowerCase().includes(q) || u.phone?.toLowerCase().includes(q);
    const matchesStatus = userFilterStatus === 'all' || u.status === userFilterStatus;
    return matchesQuery && matchesStatus;
  });

  const handleExportTXT = () => {
    let content = `====================================================\n`;
    content += `DORME DORME PRECIOSO - RELATÓRIO DE CLIENTES\n`;
    content += `Data do Relatório: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}\n`;
    content += `Total de Clientes: ${usersList.length}\n`;
    content += `====================================================\n\n`;

    usersList.forEach((u, idx) => {
      content += `[${idx + 1}] NOME: ${u.name || 'Sem nome'}\n`;
      content += `    E-MAIL: ${u.email || '—'}\n`;
      content += `    TELEFONE: ${u.phone || u.telefone || '—'}\n`;
      content += `    BEBÊ: ${u.babyName || '—'}\n`;
      content += `    STATUS: ${u.status === 'active' ? 'Ativa' : u.status === 'pending' ? 'Pendente' : 'Bloqueada'}\n`;
      content += `    SENHA: ${u.password || '—'}\n`;
      content += `    DATA CADASTRO: ${u.createdAt || '—'}\n`;
      content += `----------------------------------------------------\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes-dorme-dorme-precioso-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rows = usersList.map((u, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${u.name || 'Sem nome'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${u.email || '—'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${u.phone || u.telefone || '—'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${u.babyName || '—'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${u.status === 'active' ? 'Ativa' : u.status === 'pending' ? 'Pendente' : 'Bloqueada'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Clientes - Dorme Dorme Precioso</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D5A754; padding-bottom: 15px; margin-bottom: 20px; }
            h1 { margin: 0; color: #0A1628; font-size: 24px; }
            p { margin: 5px 0 0 0; color: #64748b; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th { background: #0A1628; color: white; text-align: left; padding: 12px 10px; }
            .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Dorme, Dorme, Precioso 🌙</h1>
              <p>Relatório Oficial de Clientes & Usuárias Cadastradas</p>
            </div>
            <div style="text-align: right;">
              <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
              <p>Total: <strong>${usersList.length}</strong> clientes</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Bebê</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="footer">
            Documento gerado pelo Painel Admin Dorme Dorme Precioso.
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Usuários & Clientes</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gerencie as contas, telefones e acessos das mães cadastradas</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExportTXT} className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer" title="Baixar lista em TXT">
            <Download size={14} className="text-slate-600" />
            <span>Baixar TXT</span>
          </button>

          <button onClick={handleExportPDF} className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer" title="Baixar lista em PDF">
            <FileText size={14} className="text-slate-950" />
            <span>Baixar PDF</span>
          </button>

          <button onClick={handleOpenNewUser} className="px-4 py-2.5 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors">
            <UserPlus size={14} />
            <span>Nova Usuária</span>
          </button>
        </div>
      </div>

      {/* Policy Toggle */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <ShieldCheck size={18} className="text-[#0C1B3A]" />
          <h3 className="text-sm font-bold text-slate-800">Política de Acesso</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div onClick={() => handleSetRegistrationMode('open')} className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${localAccessSettings.registrationMode === 'open' ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300/50' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
            <Sparkles size={18} className={localAccessSettings.registrationMode === 'open' ? 'text-emerald-600' : 'text-slate-400'} />
            <div>
              <span className="text-sm font-bold text-slate-700">Acesso Livre</span>
              {localAccessSettings.registrationMode === 'open' && <span className="ml-2 px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">ATIVO</span>}
              <p className="text-xs text-slate-500 mt-0.5">Cadastro imediato e acesso automático ao app</p>
            </div>
          </div>
          <div onClick={() => handleSetRegistrationMode('approval')} className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${localAccessSettings.registrationMode === 'approval' ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300/50' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
            <Clock size={18} className={localAccessSettings.registrationMode === 'approval' ? 'text-amber-600' : 'text-slate-400'} />
            <div>
              <span className="text-sm font-bold text-slate-700">Por Aprovação</span>
              {localAccessSettings.registrationMode === 'approval' && <span className="ml-2 px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">ATIVO</span>}
              <p className="text-xs text-slate-500 mt-0.5">Novos cadastros aguardam aprovação manual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Buscar por nome, e-mail ou telefone..." value={userSearchQuery || ''} onChange={e => setUserSearchQuery?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#0C1B3A] focus:ring-1 focus:ring-[#0C1B3A]/20 shadow-sm" />
        </div>
        <select value={userFilterStatus || 'all'} onChange={e => setUserFilterStatus?.(e.target.value)} className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 font-medium focus:outline-none focus:border-[#0C1B3A] shadow-sm">
          <option value="all">Todos</option>
          <option value="active">Ativas</option>
          <option value="pending">Pendentes</option>
          <option value="blocked">Bloqueadas</option>
        </select>
      </div>

      {/* Users Container: Responsive Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"><Users size={22} /></div>
            <p className="text-sm font-semibold text-slate-600">Nenhuma usuária encontrada</p>
            <p className="text-xs text-slate-400 max-w-sm">{usersList.length === 0 ? 'Ainda não há cadastros no banco de dados.' : 'Nenhum resultado para esta busca.'}</p>
          </div>
        ) : (
          <>
            {/* 1. MOBILE CARDS VIEW (< sm) */}
            <div className="block sm:hidden divide-y divide-slate-100">
              {filteredUsers.map(u => (
                <div key={u.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0C1B3A] to-[#1a3060] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                        {u.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-800 truncate">{u.name || 'Sem nome'}</span>
                        <span className="text-xs text-slate-400 truncate">{u.email || '—'}</span>
                      </div>
                    </div>
                    
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : u.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {u.status === 'active' ? 'Ativa' : u.status === 'pending' ? 'Pendente' : 'Bloqueada'}
                    </span>
                  </div>

                  {/* Details Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Telefone</span>
                      <span className="font-semibold flex items-center gap-1 text-slate-700">
                        <Phone size={11} className="text-slate-400" />
                        {u.phone || u.telefone || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Bebê</span>
                      <span className="font-semibold text-slate-700">{u.babyName || '—'}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">Senha: <strong>{u.password || '•••'}</strong></span>
                    <div className="flex items-center gap-1.5">
                      {u.status === 'pending' && (
                        <button onClick={() => handleQuickApproveUser(u.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer flex items-center gap-1 shadow-sm">
                          <UserCheck size={13} />
                          <span>Aprovar</span>
                        </button>
                      )}
                      <button onClick={() => handleStartEditUser(u)} className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer" title="Editar">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleQuickToggleBlock(u.id)} className={`p-2 rounded-lg cursor-pointer ${u.status === 'blocked' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`} title={u.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}>
                        {u.status === 'blocked' ? <UserCheck size={14} /> : <UserX size={14} />}
                      </button>
                      <button onClick={() => handleDeleteUser(u)} className="p-2 rounded-lg bg-rose-50 text-rose-600 cursor-pointer" title="Excluir">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. DESKTOP TABLE VIEW (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuária</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefone</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bebê</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Senha</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0C1B3A] to-[#1a3060] text-white flex items-center justify-center text-xs font-bold shrink-0">{u.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-slate-700 truncate">{u.name}</span>
                            <span className="text-xs text-slate-400 truncate">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                          <Phone size={12} className="text-slate-400" />
                          {u.phone || u.telefone || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-slate-500">{u.babyName || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : u.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {u.status === 'active' ? 'Ativa' : u.status === 'pending' ? 'Pendente' : 'Bloqueada'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">{u.password || '•••'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          {u.status === 'pending' && (
                            <button onClick={() => handleQuickApproveUser(u.id)} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer transition-colors" title="Aprovar">
                              <UserCheck size={13} />
                            </button>
                          )}
                          <button onClick={() => handleStartEditUser(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#0C1B3A] hover:bg-slate-100 cursor-pointer transition-colors" title="Editar"><Edit3 size={14} /></button>
                          <button onClick={() => handleQuickToggleBlock(u.id)} className={`p-1.5 rounded-lg cursor-pointer transition-colors ${u.status === 'blocked' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`} title={u.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}>
                            {u.status === 'blocked' ? <UserCheck size={14} /> : <UserX size={14} />}
                          </button>
                          <button onClick={() => handleDeleteUser(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 cursor-pointer transition-colors" title="Excluir"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

