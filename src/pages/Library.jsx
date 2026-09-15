import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search } from 'lucide-react';

export default function Library() {
  const { audiobooks, navigateTo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = audiobooks.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A1628] text-white pb-32 animate-fadeIn font-sans">
      
      {/* 1. HEADER SECTION (Dark Midnight Blue) */}
      <div className="pt-20 px-6 pb-8 max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
          Minha biblioteca
        </h1>

        {/* Search Input Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar audiobooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 transition-all"
          />
        </div>
      </div>

      {/* 2. MAIN CONTENT SHEET (Supports Dark & Light Mode) */}
      <div className="bg-[#FAF9F6] dark:bg-[#071325] text-slate-800 dark:text-white rounded-t-[36px] min-h-[calc(100vh-200px)] p-5 sm:p-7 max-w-2xl mx-auto shadow-2xl space-y-6 transition-colors duration-300">
        
        <div className="space-y-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => navigateTo('audiobook-detail', book.id)}
              className="bg-white dark:bg-[#0E1F38] rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center sm:items-start gap-4 cursor-pointer group"
            >
              {/* Left Cover Image */}
              <div className="w-32 h-36 sm:w-36 sm:h-40 rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-100 dark:border-slate-700 relative">
                <img 
                  src={book.coverUrl || "/dorme-dorme-precioso-capa.png"} 
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Right Details */}
              <div className="flex-1 flex flex-col justify-between h-full min-w-0 text-center sm:text-left">
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {book.title}
                  </h2>

                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                    {book.chapters?.length || 7} capítulos • Áudio-book
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Gold Pill Button */}
                <div className="mt-4 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('audiobook-detail', book.id);
                    }}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D5A754] via-[#C69C4E] to-[#B3873B] hover:brightness-110 active:scale-95 text-white font-medium text-xs shadow-md tracking-wide transition-all w-full sm:w-auto"
                  >
                    Começar audiobook
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
