import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  PlayCircle, 
  Lock, 
  Bell, 
  Info, 
  LogOut, 
  ChevronRight, 
  Play, 
  Trash2,
  X,
  Edit3,
  Camera,
  Phone,
  Baby,
  UserCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const { 
    user, 
    updateUserProfile,
    logoutUser, 
    favorites, 
    audiobooks, 
    specialSong, 
    prayers, 
    playTrack, 
    lastPlayed,
    toggleFavorite,
    setIsWelcomeModalOpen 
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Edit Profile Form State
  const [editName, setEditName] = useState('');
  const [editBabyName, setEditBabyName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [profileSuccessNotice, setProfileSuccessNotice] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleOpenEditProfile = () => {
    setEditName(user?.name || '');
    setEditBabyName(user?.babyName || '');
    setEditPhone(user?.phone || user?.telefone || '');
    setEditAvatarUrl(user?.avatarUrl || user?.avatar_url || '');
    setProfileSuccessNotice(false);
    setShowEditProfileModal(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim() || "Maria Silva",
      babyName: editBabyName.trim() || "Augusta",
      phone: editPhone.trim() || "",
      avatarUrl: editAvatarUrl || "",
      avatar: editAvatarUrl || "marian"
    });
    setProfileSuccessNotice(true);
    setTimeout(() => {
      setProfileSuccessNotice(false);
      setShowEditProfileModal(false);
    }, 1500);
  };

  // Gather favorite items
  const favoriteItems = [];
  if (favorites.includes(specialSong?.id)) {
    favoriteItems.push({
      id: specialSong.id,
      title: specialSong.title,
      subtitle: `Por ${specialSong.artist}`,
      coverUrl: specialSong.coverUrl,
      audioUrl: specialSong.audioUrl,
      duration: specialSong.duration
    });
  }
  for (const book of audiobooks) {
    for (const ch of book.chapters) {
      if (favorites.includes(ch.id)) {
        favoriteItems.push({
          id: ch.id,
          title: `${ch.number}. ${ch.title}`,
          subtitle: book.title,
          coverUrl: ch.coverUrl || book.coverUrl || "/dorme-dorme-precioso-capa.png",
          audioUrl: ch.audioUrl,
          duration: ch.duration
        });
      }
    }
  }
  for (const p of prayers) {
    if (favorites.includes(p.id)) {
      favoriteItems.push({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        coverUrl: p.coverUrl,
        audioUrl: p.audioUrl,
        duration: p.duration
      });
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setNewPassword('');
    }, 2000);
  };

  const handlePlayLastPlayed = () => {
    if (lastPlayed) {
      playTrack(lastPlayed);
    } else if (audiobooks[0]?.chapters?.[0]) {
      const firstCh = audiobooks[0].chapters[0];
      playTrack({
        id: firstCh.id,
        title: `${firstCh.number}. ${firstCh.title}`,
        subtitle: audiobooks[0].title,
        coverUrl: firstCh.coverUrl || audiobooks[0].coverUrl,
        audioUrl: firstCh.audioUrl,
        durationFormatted: firstCh.duration
      });
    }
  };

  const userAvatarImage = user?.avatarUrl || user?.avatar_url || (user?.avatar && user.avatar.startsWith('data:') ? user.avatar : "/dorme-dorme-precioso-capa.png");

  return (
    <div className="min-h-screen bg-[#0A1628] text-white pb-32 animate-fadeIn font-sans">
      
      {/* 1. HEADER SECTION (Midnight Dark Blue Wave) */}
      <div className="pt-20 px-6 pb-6 bg-[#0A1628] text-white max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
          Meu perfil
        </h1>
      </div>

      {/* 2. MAIN CONTENT SHEET (Supports Dark & Light Mode) */}
      <div className="bg-[#FAF9F6] dark:bg-[#071325] text-slate-800 dark:text-white rounded-t-[36px] min-h-[calc(100vh-140px)] p-5 sm:p-7 max-w-2xl mx-auto shadow-2xl space-y-6 transition-colors duration-300">
        
        {/* User Info Header Card */}
        <div className="bg-white dark:bg-[#0E1F38] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber-400/80 shrink-0 shadow-md relative bg-[#0A1628]">
              <img 
                src={userAvatarImage} 
                alt="Foto do perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white truncate">
                {user?.name || 'Maria Silva'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5 truncate">
                {user?.email || 'maria@email.com'}
              </p>
              {user?.babyName && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1">
                  <span>👶 Bebê:</span> <strong>{user.babyName}</strong>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleOpenEditProfile}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <Edit3 size={15} />
            <span className="hidden sm:inline">Editar Perfil</span>
          </button>
        </div>

        {/* Profile Options List */}
        <div className="bg-white dark:bg-[#0E1F38] rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
          
          {/* Option 1: Meus favoritos */}
          <button
            onClick={() => setShowFavoritesModal(true)}
            className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <Heart className="w-5 h-5 text-[#0A1628] dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Meus favoritos
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 2: Continue ouvindo */}
          <button
            onClick={handlePlayLastPlayed}
            className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <PlayCircle className="w-5 h-5 text-[#0A1628] dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Continue ouvindo
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 3: Alterar senha */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <Lock className="w-5 h-5 text-[#0A1628] dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Alterar senha
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option: Rever Boas-Vindas */}
          <button
            onClick={() => setIsWelcomeModalOpen(true)}
            className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Rever Guia de Boas-Vindas
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 4: Notificações */}
          <div className="w-full p-4 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3.5">
              <Bell className="w-5 h-5 text-[#0A1628] dark:text-amber-400" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Notificações
              </span>
            </div>
            
            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                notificationsEnabled ? 'bg-[#0A1628] dark:bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-950 transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Option 5: Sobre o app */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <Info className="w-5 h-5 text-[#0A1628] dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Sobre o app
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 6: Sair */}
          <button
            onClick={logoutUser}
            className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <LogOut className="w-5 h-5 text-rose-500" />
              <span className="text-sm font-bold text-rose-500">
                Sair
              </span>
            </div>
          </button>

        </div>

      </div>

      {/* FAVORITES MODAL */}
      {showFavoritesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#0E1F38] rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[80vh] flex flex-col text-slate-800 dark:text-white">
            <button
              onClick={() => setShowFavoritesModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white mb-1">Meus Favoritos</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{favoriteItems.length} itens salvos</p>

            {favoriteItems.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">Você ainda não favoritou nenhum conteúdo.</p>
            ) : (
              <div className="space-y-2 overflow-y-auto pr-1">
                {favoriteItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => { playTrack(item); setShowFavoritesModal(false); }}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-50/50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#0A1628] dark:bg-amber-500 text-white dark:text-slate-950 flex items-center justify-center shrink-0">
                        <Play size={12} className="ml-0.5 fill-current" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white dark:bg-[#0E1F38] rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Alterar Senha</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Digite sua nova senha abaixo.</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input 
                type="password"
                required
                placeholder="Nova senha"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />

              {passwordSuccess && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Senha atualizada com sucesso!</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0A1628] dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs shadow-md"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ABOUT MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white dark:bg-[#0E1F38] rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-3 text-slate-800 dark:text-white">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 mx-auto">
              <img src="/dorme-dorme-precioso-capa.png" alt="Dorme Precioso" className="w-full h-full object-cover rounded-full" />
            </div>
            <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">Dorme, Dorme, Precioso</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
              Plataforma de acolhimento criada para mamães durante as madrugadas de amamentação. Versão 1.0.0
            </p>
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0A1628] dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#0E1F38] rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <Edit3 size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">Editar Perfil</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Atualize suas informações pessoais e foto.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfileSubmit} className="space-y-4">
              
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 shadow-md group bg-[#0A1628]">
                  <img 
                    src={editAvatarUrl || userAvatarImage} 
                    alt="Preview da foto"
                    className="w-full h-full object-cover"
                  />
                  <label htmlFor="profile-photo-input" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </label>
                </div>

                <div className="flex flex-col items-center gap-1.5 w-full">
                  <label htmlFor="profile-photo-input" className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm">
                    <Camera size={14} />
                    <span>Selecionar Nova Foto</span>
                  </label>
                  <input 
                    id="profile-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {editAvatarUrl && editAvatarUrl.startsWith('data:') && (
                    <button
                      type="button"
                      onClick={() => setEditAvatarUrl('')}
                      className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Restaurar foto padrão
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Seu Nome
                </label>
                <input 
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Baby's Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Baby size={14} className="text-amber-500" />
                  Nome do Bebê
                </label>
                <input 
                  type="text"
                  value={editBabyName}
                  onChange={e => setEditBabyName(e.target.value)}
                  placeholder="Ex: Augusta"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Phone size={14} className="text-amber-500" />
                  Telefone / WhatsApp
                </label>
                <input 
                  type="tel"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {profileSuccessNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Perfil salvo e sincronizado com sucesso!</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Salvar Perfil
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
