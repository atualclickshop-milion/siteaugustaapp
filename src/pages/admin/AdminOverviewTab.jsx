import React from 'react';
import { Users, Headphones, Music2, PlayCircle, Heart, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function AdminOverviewTab({ realDbStats, usersList, audiobooks, momentsList, prayers }) {
  const totalUsers = realDbStats ? realDbStats.totalUsers : usersList.length;
  const totalPlays = realDbStats ? realDbStats.totalPlays : 0;
  const totalFavorites = realDbStats ? realDbStats.totalFavorites : 0;
  const totalChapters = audiobooks.reduce((acc, b) => acc + (b.chapters?.length || 0), 0);

  const metrics = [
    { 
      label: 'Usuários cadastrados', 
      value: totalUsers.toLocaleString('pt-BR'), 
      icon: Users, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    { 
      label: 'Audiobooks', 
      value: audiobooks.length, 
      icon: Headphones, 
      color: 'text-indigo-600', 
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100'
    },
    { 
      label: 'Músicas', 
      value: (momentsList?.length || 0) + (prayers?.length || 0), 
      icon: Music2, 
      color: 'text-violet-600', 
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-100'
    },
    { 
      label: 'Reproduções', 
      value: totalPlays.toLocaleString('pt-BR'), 
      icon: PlayCircle, 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    { 
      label: 'Favoritos', 
      value: totalFavorites.toLocaleString('pt-BR'), 
      icon: Heart, 
      color: 'text-rose-500', 
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100'
    },
    { 
      label: 'Capítulos', 
      value: totalChapters, 
      icon: TrendingUp, 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    }
  ];

  // Sample recent activity (from real users if available)
  const recentActivity = usersList.slice(0, 5).map((u, i) => ({
    name: u.name || 'Usuária',
    action: ['Ouviu o capítulo 3', 'Favoritou o audiobook', 'Ouviu a música especial', 'Criou uma conta', 'Ouviu o capítulo 7'][i % 5],
    date: u.createdAt || new Date().toLocaleDateString('pt-BR')
  }));

  return (
    <div className="flex flex-col gap-7 animate-in fade-in duration-300">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Visão geral da plataforma Dorme, Dorme, Precioso</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl bg-white border ${m.borderColor} shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-3`}
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{m.label}</span>
                <span className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight font-mono">{m.value}</span>
              </div>
              <div className={`w-10 h-10 rounded-xl ${m.bgColor} ${m.color} flex items-center justify-center shrink-0`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Table */}
      <div className="flex flex-col gap-3.5">
        <h2 className="text-base font-bold text-slate-800">Atividade recente</h2>
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuário</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ação</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-sm text-slate-400">
                    Nenhuma atividade registrada ainda.
                  </td>
                </tr>
              ) : (
                recentActivity.map((act, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0C1B3A] to-[#1a3060] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {act.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{act.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">{act.action}</td>
                    <td className="px-5 py-3 text-sm text-slate-400 text-right font-mono">{act.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Audiobooks Section */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Gerenciar Audiobooks</h2>
          <button className="px-3.5 py-1.5 rounded-xl bg-[#0C1B3A] hover:bg-[#142a52] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm">
            <span>+ Novo audiobook</span>
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
          {audiobooks.slice(0, 4).map(book => (
            <div
              key={book.id}
              className="min-w-[220px] max-w-[240px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow shrink-0"
            >
              <div className="relative h-28 overflow-hidden bg-slate-100">
                <img
                  src={book.coverUrl || "/dorme-dorme-precioso-capa.png"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <h4 className="text-xs font-bold text-white truncate">{book.title}</h4>
                </div>
              </div>
              <div className="px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {book.chapters?.length || 0} capítulos • Publicado
                </span>
                <ArrowUpRight size={14} className="text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
