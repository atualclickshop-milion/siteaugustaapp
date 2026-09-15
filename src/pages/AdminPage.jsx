import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  fetchAdminRealStats, 
  deleteProfileFromDB, 
  saveProfileToDB, 
  uploadMediaFile,
  deleteMomentFromDB,
  saveMomentsToDB,
  saveAppSettingToDB,
  saveStreamingPlatformsToDB,
  saveAnnouncementsToDB,
  deleteAnnouncementFromDB
} from '../lib/supabaseClient';
import { idbSet } from '../utils/storageHelper';
import { Check } from 'lucide-react';
import { isYouTubeUrl } from '../utils/youtubeHelper';

// Subcomponents
import AdminSidebar from './admin/AdminSidebar';
import AdminOverviewTab from './admin/AdminOverviewTab';
import AdminHomeTab from './admin/AdminHomeTab';
import AdminAdsTab from './admin/AdminAdsTab';
import AdminAudiobooksTab from './admin/AdminAudiobooksTab';
import AdminSongTab from './admin/AdminSongTab';
import AdminPrayersTab from './admin/AdminPrayersTab';
import AdminUsersTab from './admin/AdminUsersTab';
import AdminPlatformsTab from './admin/AdminPlatformsTab';
import AdminModals from './admin/AdminModals';

export default function AdminPage({ onLogout }) {
  const { 
    audiobooks, 
    setAudiobooks, 
    specialSong, 
    setSpecialSong, 
    prayers,
    setPrayers,
    momentsList,
    setMomentsList,
    announcements,
    setAnnouncements,
    homeSettings,
    setHomeSettings,
    streamingPlatforms,
    setStreamingPlatforms,
    usersList,
    setUsersList,
    accessSettings,
    setAccessSettings,
    supportSettings,
    setSupportSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'ads', 'audiobooks', 'home', 'songs', 'prayers', 'platforms'
  const [saveToast, setSaveToast] = useState(null);
  const [realDbStats, setRealDbStats] = useState(null);

  // Load real statistics from Supabase Database
  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        const stats = await fetchAdminRealStats();
        if (mounted && stats) {
          setRealDbStats(stats);
        }
      } catch (err) {
        console.warn('Could not load real DB stats:', err);
      }
    };
    loadStats();
    return () => { mounted = false; };
  }, [usersList]);

  // --- Audio Preview Tester in Admin ---
  const [testAudioSrc, setTestAudioSrc] = useState(null);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const testAudioRef = useRef(null);

  useEffect(() => {
    if (testAudioRef.current) {
      testAudioRef.current.onended = () => setIsTestingAudio(false);
      testAudioRef.current.onpause = () => setIsTestingAudio(false);
      testAudioRef.current.onplay = () => setIsTestingAudio(true);
    }
  }, [testAudioSrc]);

  const toggleTestPlay = (src) => {
    if (!src) return;
    if (testAudioSrc === src && isTestingAudio) {
      testAudioRef.current?.pause();
      setIsTestingAudio(false);
    } else {
      setTestAudioSrc(src);
      if (testAudioRef.current) {
        testAudioRef.current.src = src;
        testAudioRef.current.play().then(() => setIsTestingAudio(true)).catch(() => {});
      }
    }
  };

  // --- Helper: Auto-detect audio duration ---
  const detectAudioDuration = (audioSource, setterDuration) => {
    if (!audioSource) return;
    if (isYouTubeUrl(audioSource)) {
      setterDuration("YouTube Vídeo");
      return;
    }
    try {
      const tempAudio = new Audio();
      tempAudio.src = audioSource;
      tempAudio.addEventListener('loadedmetadata', () => {
        if (tempAudio.duration && isFinite(tempAudio.duration) && tempAudio.duration > 0) {
          const m = Math.floor(tempAudio.duration / 60);
          const s = Math.floor(tempAudio.duration % 60);
          setterDuration(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      });
    } catch (e) {
      console.warn("Auto duration error:", e);
    }
  };

  // --- Generic File Readers & Cloud Uploaders ---
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const handleImageFileUpload = (e, setterUrl) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingMedia(true);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setterUrl(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage in background for persistence
      uploadMediaFile(file, 'covers').then(publicUrl => {
        if (publicUrl) setterUrl(publicUrl);
      }).catch(err => console.warn('Image storage fallback:', err))
        .finally(() => setIsUploadingMedia(false));
    }
  };

  const handleAudioFileUpload = (e, setterUrl, setterDuration, setterFileName = null) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingMedia(true);
      if (setterFileName) {
        setterFileName(file.name);
      }
      // 1. Instant local playback
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target.result;
        setterUrl(dataUrl);
        detectAudioDuration(dataUrl, setterDuration);
      };
      reader.readAsDataURL(file);

      // 2. Upload to Supabase Storage for multi-device sync
      uploadMediaFile(file, 'audios').then(publicUrl => {
        if (publicUrl) {
          setterUrl(publicUrl);
        }
      }).catch(err => console.warn('Audio storage fallback:', err))
        .finally(() => setIsUploadingMedia(false));
    }
  };

  const showFeedback = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // --- Confirmation Dialog State ---
  const [confirmDialog, setConfirmDialog] = useState(null);
  const triggerConfirm = ({ title, message, confirmLabel, variant = 'danger', onConfirm }) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmLabel,
      variant,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(null);
      }
    });
  };

  // --- Audiobook State & Handlers ---
  const [editingBook, setEditingBook] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookCover, setBookCover] = useState('/dorme-dorme-precioso-capa.png');
  const [bookCoverMode, setBookCoverMode] = useState('upload');
  const [selectedBookForChapters, setSelectedBookForChapters] = useState(audiobooks[0] || null);

  const handleOpenNewBook = () => {
    setEditingBook(null);
    setBookTitle('');
    setBookDescription('');
    setBookCover('/dorme-dorme-precioso-capa.png');
    setBookCoverMode('upload');
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book) => {
    setEditingBook(book);
    setBookTitle(book.title);
    setBookDescription(book.description);
    setBookCover(book.coverUrl || '/dorme-dorme-precioso-capa.png');
    setBookCoverMode(book.coverUrl?.startsWith('data:') ? 'upload' : 'url');
    setIsBookModalOpen(true);
  };

  const handleSaveBook = (e) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;

    if (editingBook) {
      const updated = audiobooks.map(b => b.id === editingBook.id ? {
        ...b,
        title: bookTitle.trim(),
        description: bookDescription.trim(),
        coverUrl: bookCover
      } : b);
      setAudiobooks(updated);
      if (selectedBookForChapters?.id === editingBook.id) {
        setSelectedBookForChapters({ ...selectedBookForChapters, title: bookTitle.trim(), description: bookDescription.trim(), coverUrl: bookCover });
      }
      showFeedback('Audiobook atualizado com sucesso!');
    } else {
      const newBook = {
        id: `book-${Date.now()}`,
        title: bookTitle.trim(),
        description: bookDescription.trim(),
        author: 'Augusta',
        coverUrl: bookCover,
        status: 'published',
        chapters: []
      };
      setAudiobooks([...audiobooks, newBook]);
      setSelectedBookForChapters(newBook);
      showFeedback('Novo audiobook criado!');
    }
    setIsBookModalOpen(false);
  };

  const handleDeleteBook = (id) => {
    triggerConfirm({
      title: 'Excluir Audiobook?',
      message: 'Tem certeza que deseja remover este audiobook e todos os seus capítulos?',
      confirmLabel: 'Sim, Excluir Audiobook',
      variant: 'danger',
      onConfirm: () => {
        const updated = audiobooks.filter(b => b.id !== id);
        setAudiobooks(updated);
        if (selectedBookForChapters?.id === id) {
          setSelectedBookForChapters(updated[0] || null);
        }
        showFeedback('Audiobook removido.');
      }
    });
  };

  // --- Chapter State & Handlers ---
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterSubtitle, setNewChapterSubtitle] = useState('');
  const [newChapterDuration, setNewChapterDuration] = useState('05:00');
  const [newChapterCoverUrl, setNewChapterCoverUrl] = useState('');
  const [newChapterCoverMode, setNewChapterCoverMode] = useState('upload');
  const [newChapterAudioUrl, setNewChapterAudioUrl] = useState('');
  const [newChapterAudioMode, setNewChapterAudioMode] = useState('upload');
  const [newChapterAudioFileName, setNewChapterAudioFileName] = useState('');
  const [newChapterSnippet, setNewChapterSnippet] = useState('');

  const handleOpenNewChapter = () => {
    setEditingChapterId(null);
    setNewChapterTitle('');
    setNewChapterSubtitle('');
    setNewChapterDuration('05:00');
    setNewChapterCoverUrl(selectedBookForChapters?.coverUrl || '');
    setNewChapterCoverMode('upload');
    setNewChapterAudioUrl('');
    setNewChapterAudioMode('upload');
    setNewChapterAudioFileName('');
    setNewChapterSnippet('');
    setIsChapterModalOpen(true);
  };

  const handleStartEditChapter = (chapter) => {
    setEditingChapterId(chapter.id);
    setNewChapterTitle(chapter.title);
    setNewChapterSubtitle(chapter.subtitle || '');
    setNewChapterDuration(chapter.duration || '05:00');
    setNewChapterCoverUrl(chapter.coverUrl || '');
    setNewChapterCoverMode(chapter.coverUrl?.startsWith('data:') ? 'upload' : 'url');
    setNewChapterAudioUrl(chapter.audioUrl || '');
    setNewChapterAudioMode(chapter.audioUrl?.startsWith('data:') ? 'upload' : 'url');
    setNewChapterAudioFileName('');
    setNewChapterSnippet(chapter.textSnippet || '');
    setIsChapterModalOpen(true);
  };

  const handleCancelEditChapter = () => {
    setIsChapterModalOpen(false);
    setEditingChapterId(null);
  };

  const handleSaveChapter = (e) => {
    e.preventDefault();
    if (!selectedBookForChapters || !newChapterTitle.trim()) return;

    if (editingChapterId) {
      const updatedChapters = selectedBookForChapters.chapters.map(ch => ch.id === editingChapterId ? {
        ...ch,
        title: newChapterTitle.trim(),
        subtitle: newChapterSubtitle.trim(),
        duration: newChapterDuration.trim(),
        coverUrl: newChapterCoverUrl || selectedBookForChapters.coverUrl,
        audioUrl: newChapterAudioUrl,
        textSnippet: newChapterSnippet.trim()
      } : ch);

      const updatedBook = { ...selectedBookForChapters, chapters: updatedChapters };
      setSelectedBookForChapters(updatedBook);
      setAudiobooks(audiobooks.map(b => b.id === updatedBook.id ? updatedBook : b));
      showFeedback('Capítulo atualizado!');
    } else {
      const nextNum = (selectedBookForChapters.chapters?.length || 0) + 1;
      const newCh = {
        id: `ch-${Date.now()}`,
        number: nextNum < 10 ? `0${nextNum}` : `${nextNum}`,
        title: newChapterTitle.trim(),
        subtitle: newChapterSubtitle.trim() || 'Áudio guiado de acolhimento',
        duration: newChapterDuration.trim() || '05:00',
        coverUrl: newChapterCoverUrl || selectedBookForChapters.coverUrl,
        audioUrl: newChapterAudioUrl,
        textSnippet: newChapterSnippet.trim()
      };

      const updatedBook = { ...selectedBookForChapters, chapters: [...(selectedBookForChapters.chapters || []), newCh] };
      setSelectedBookForChapters(updatedBook);
      setAudiobooks(audiobooks.map(b => b.id === updatedBook.id ? updatedBook : b));
      showFeedback('Novo capítulo adicionado com sucesso!');
    }
    setIsChapterModalOpen(false);
    setEditingChapterId(null);
  };

  const handleDeleteChapter = (bookId, chapterId) => {
    triggerConfirm({
      title: 'Remover Capítulo?',
      message: 'Tem certeza que deseja excluir este capítulo deste audiobook?',
      confirmLabel: 'Sim, Remover',
      variant: 'danger',
      onConfirm: () => {
        const book = audiobooks.find(b => b.id === bookId);
        if (!book) return;
        const updatedChapters = book.chapters.filter(ch => ch.id !== chapterId);
        const updatedBook = { ...book, chapters: updatedChapters };
        setSelectedBookForChapters(updatedBook);
        setAudiobooks(audiobooks.map(b => b.id === bookId ? updatedBook : b));
        showFeedback('Capítulo removido.');
      }
    });
  };

  // --- Special Song State & Handlers ---
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [songTitle, setSongTitle] = useState(specialSong.title);
  const [songArtist, setSongArtist] = useState(specialSong.artist);
  const [songTagline, setSongTagline] = useState(specialSong.tagline || '');
  const [songCover, setSongCover] = useState(specialSong.coverUrl || '/dorme-dorme-precioso-capa.png');
  const [songCoverMode, setSongCoverMode] = useState('upload');
  const [songAudioUrl, setSongAudioUrl] = useState(specialSong.audioUrl);
  const [songAudioMode, setSongAudioMode] = useState('url');
  const [songDuration, setSongDuration] = useState(specialSong.duration || '03:45');
  const [songLyricsText, setSongLyricsText] = useState(specialSong.lyrics || '');

  const handleSaveSong = (e) => {
    e.preventDefault();
    const updated = {
      ...specialSong,
      title: songTitle.trim(),
      artist: songArtist.trim(),
      tagline: songTagline.trim(),
      coverUrl: songCover,
      audioUrl: songAudioUrl.trim(),
      duration: songDuration,
      lyrics: songLyricsText
    };
    setSpecialSong(updated);
    setIsSongModalOpen(false);
    showFeedback('Canção Especial e letra salvas com sucesso!');
  };

  // --- Moments State & Handlers ---
  const [isMomentModalOpen, setIsMomentModalOpen] = useState(false);
  const [editingMomentId, setEditingMomentId] = useState(null);
  const [momentTitle, setMomentTitle] = useState('');
  const [momentBadge, setMomentBadge] = useState('');
  const [momentDescription, setMomentDescription] = useState('');
  const [momentActionText, setMomentActionText] = useState('');
  const [momentTextSnippet, setMomentTextSnippet] = useState('');
  const [momentCoverUrl, setMomentCoverUrl] = useState('');
  const [momentCoverMode, setMomentCoverMode] = useState('upload');
  const [momentAudioUrl, setMomentAudioUrl] = useState('');
  const [momentAudioMode, setMomentAudioMode] = useState('upload');
  const [momentAudioFileName, setMomentAudioFileName] = useState('');
  const [momentDuration, setMomentDuration] = useState('04:30');

  const handleOpenNewMoment = () => {
    setEditingMomentId(null);
    setMomentTitle('');
    setMomentBadge('Aconchego');
    setMomentDescription('');
    setMomentActionText('Ouvir & Acalmar');
    setMomentTextSnippet('');
    setMomentCoverUrl('/dorme-dorme-precioso-capa.png');
    setMomentCoverMode('upload');
    setMomentAudioUrl('');
    setMomentAudioMode('upload');
    setMomentAudioFileName('');
    setMomentDuration('04:30');
    setIsMomentModalOpen(true);
  };

  const handleStartEditMoment = (moment) => {
    setEditingMomentId(moment.id);
    setMomentTitle(moment.title);
    setMomentBadge(moment.badge || '');
    setMomentDescription(moment.description || '');
    setMomentActionText(moment.actionText || 'Ouvir & Acalmar');
    setMomentTextSnippet(moment.textSnippet || '');
    setMomentCoverUrl(moment.coverUrl || '/dorme-dorme-precioso-capa.png');
    setMomentCoverMode(moment.coverUrl?.startsWith('data:') ? 'upload' : 'url');
    setMomentAudioUrl(moment.audioUrl || '');
    setMomentAudioMode(moment.audioUrl?.startsWith('data:') ? 'upload' : 'url');
    setMomentAudioFileName('');
    setMomentDuration(moment.duration || '04:30');
    setIsMomentModalOpen(true);
  };

  const handleCancelMoment = () => {
    setIsMomentModalOpen(false);
    setEditingMomentId(null);
  };

  const handleSaveMoment = async (e) => {
    e.preventDefault();
    if (!momentTitle.trim()) return;

    let updated;
    if (editingMomentId) {
      updated = momentsList.map(m => m.id === editingMomentId ? {
        ...m,
        title: momentTitle.trim(),
        badge: momentBadge.trim(),
        description: momentDescription.trim(),
        actionText: momentActionText.trim() || 'Ouvir & Acalmar',
        textSnippet: momentTextSnippet.trim(),
        coverUrl: momentCoverUrl,
        audioUrl: momentAudioUrl,
        duration: momentDuration || '04:30'
      } : m);
      showFeedback('Momento atualizado!');
    } else {
      const newMoment = {
        id: `moment-${Date.now()}`,
        title: momentTitle.trim(),
        badge: momentBadge.trim() || 'Momento',
        description: momentDescription.trim() || 'Acolhimento para mães',
        actionText: momentActionText.trim() || 'Ouvir & Acalmar',
        textSnippet: momentTextSnippet.trim(),
        coverUrl: momentCoverUrl || '/dorme-dorme-precioso-capa.png',
        audioUrl: momentAudioUrl,
        duration: momentDuration || '04:30',
        enabled: true
      };
      updated = [...momentsList, newMoment];
      showFeedback('Novo Momento criado com sucesso!');
    }
    setMomentsList(updated);
    await idbSet('ddp_moments_list', updated);
    await saveMomentsToDB(updated);
    setIsMomentModalOpen(false);
    setEditingMomentId(null);
  };

  const handleDeleteMoment = (id) => {
    triggerConfirm({
      title: 'Excluir Momento?',
      message: 'Tem certeza que deseja remover este card da tela inicial?',
      confirmLabel: 'Sim, Excluir',
      variant: 'danger',
      onConfirm: async () => {
        const updated = momentsList.filter(m => m.id !== id);
        setMomentsList(updated);
        await idbSet('ddp_moments_list', updated);
        await deleteMomentFromDB(id);
        showFeedback('Momento removido com sucesso.');
      }
    });
  };

  const handleToggleMomentEnabled = async (id) => {
    const updated = momentsList.map(m => m.id === id ? { ...m, enabled: m.enabled === false ? true : false } : m);
    setMomentsList(updated);
    await idbSet('ddp_moments_list', updated);
    await saveMomentsToDB(updated);
    showFeedback('Status de exibição do card atualizado!');
  };

  // --- Home Settings ---
  const [localHomeSettings, setLocalHomeSettings] = useState(homeSettings);

  useEffect(() => {
    if (homeSettings) {
      setLocalHomeSettings(homeSettings);
    }
  }, [homeSettings]);

  const handleToggleHomeSetting = (key) => {
    setLocalHomeSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveHomeSettings = async () => {
    setHomeSettings(localHomeSettings);
    await idbSet('ddp_home_settings', localHomeSettings);
    await saveAppSettingToDB('home', localHomeSettings);
    showFeedback('Configurações da Tela Inicial salvas com sucesso!');
  };

  // --- Prayers State & Handlers ---
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [editingPrayerId, setEditingPrayerId] = useState(null);
  const [prayerTitle, setPrayerTitle] = useState('');
  const [prayerSubtitle, setPrayerSubtitle] = useState('');
  const [prayerCategory, setPrayerCategory] = useState('oração');
  const [prayerDuration, setPrayerDuration] = useState('04:30');
  const [prayerCoverUrl, setPrayerCoverUrl] = useState('');
  const [prayerCoverMode, setPrayerCoverMode] = useState('upload');
  const [prayerAudioUrl, setPrayerAudioUrl] = useState('');
  const [prayerAudioMode, setPrayerAudioMode] = useState('upload');
  const [prayerAudioFileName, setPrayerAudioFileName] = useState('');
  const [prayerFullText, setPrayerFullText] = useState('');

  const handleOpenNewPrayer = () => {
    setEditingPrayerId(null);
    setPrayerTitle('');
    setPrayerSubtitle('');
    setPrayerCategory('oração');
    setPrayerDuration('04:30');
    setPrayerCoverUrl('/dorme-dorme-precioso-capa.png');
    setPrayerCoverMode('upload');
    setPrayerAudioUrl('');
    setPrayerAudioMode('upload');
    setPrayerAudioFileName('');
    setPrayerFullText('');
    setIsPrayerModalOpen(true);
  };

  const handleStartEditPrayer = (prayer) => {
    setEditingPrayerId(prayer.id);
    setPrayerTitle(prayer.title);
    setPrayerSubtitle(prayer.subtitle || '');
    setPrayerCategory(prayer.category || 'oração');
    setPrayerDuration(prayer.duration || '04:30');
    setPrayerCoverUrl(prayer.coverUrl || '');
    setPrayerCoverMode(prayer.coverUrl?.startsWith('data:') ? 'upload' : 'url');
    setPrayerAudioUrl(prayer.audioUrl || '');
    setPrayerAudioMode(prayer.audioUrl?.startsWith('data:') ? 'upload' : 'url');
    setPrayerAudioFileName('');
    setPrayerFullText(prayer.fullText || '');
    setIsPrayerModalOpen(true);
  };

  const handleCancelPrayer = () => {
    setIsPrayerModalOpen(false);
    setEditingPrayerId(null);
  };

  const handleSavePrayer = (e) => {
    e.preventDefault();
    if (!prayerTitle.trim()) return;

    if (editingPrayerId) {
      const updated = prayers.map(p => p.id === editingPrayerId ? {
        ...p,
        title: prayerTitle.trim(),
        subtitle: prayerSubtitle.trim(),
        category: prayerCategory,
        duration: prayerDuration,
        coverUrl: prayerCoverUrl || '/dorme-dorme-precioso-capa.png',
        audioUrl: prayerAudioUrl,
        fullText: prayerFullText.trim()
      } : p);
      setPrayers(updated);
      showFeedback('Oração atualizada!');
    } else {
      const newPrayer = {
        id: `prayer-${Date.now()}`,
        title: prayerTitle.trim(),
        subtitle: prayerSubtitle.trim() || 'Oração guiada',
        category: prayerCategory,
        duration: prayerDuration || '04:30',
        coverUrl: prayerCoverUrl || '/dorme-dorme-precioso-capa.png',
        audioUrl: prayerAudioUrl,
        fullText: prayerFullText.trim()
      };
      setPrayers([...prayers, newPrayer]);
      showFeedback('Nova oração cadastrada!');
    }
    setIsPrayerModalOpen(false);
    setEditingPrayerId(null);
  };

  const handleDeletePrayer = (id) => {
    triggerConfirm({
      title: 'Excluir Oração?',
      message: 'Tem certeza que deseja remover esta oração da biblioteca?',
      confirmLabel: 'Sim, Excluir',
      variant: 'danger',
      onConfirm: () => {
        setPrayers(prayers.filter(p => p.id !== id));
        showFeedback('Oração removida.');
      }
    });
  };

  // --- Users State & Handlers ---
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userFormName, setUserFormName] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPhone, setUserFormPhone] = useState('');
  const [userFormBabyName, setUserFormBabyName] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [userFormRole, setUserFormRole] = useState('user');
  const [userFormStatus, setUserFormStatus] = useState('active');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [localAccessSettings, setLocalAccessSettings] = useState(accessSettings);

  useEffect(() => {
    if (accessSettings) {
      setLocalAccessSettings(accessSettings);
    }
  }, [accessSettings]);

  const handleOpenNewUser = () => {
    setEditingUserId(null);
    setUserFormName('');
    setUserFormEmail('');
    setUserFormPhone('');
    setUserFormBabyName('');
    setUserFormPassword('123456');
    setUserFormRole('user');
    setUserFormStatus('active');
    setShowPasswordInModal(false);
    setIsUserModalOpen(true);
  };

  const handleStartEditUser = (u) => {
    setEditingUserId(u.id);
    setUserFormName(u.name || '');
    setUserFormEmail(u.email || '');
    setUserFormPhone(u.phone || u.telefone || '');
    setUserFormBabyName(u.babyName || '');
    setUserFormPassword(u.password || '');
    setUserFormRole(u.role || 'user');
    setUserFormStatus(u.status || 'active');
    setShowPasswordInModal(false);
    setIsUserModalOpen(true);
  };

  const handleCancelUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUserId(null);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userFormName.trim() || !userFormEmail.trim()) return;

    if (editingUserId) {
      const existing = usersList.find(u => u.id === editingUserId);
      const updatedUser = {
        ...existing,
        name: userFormName.trim(),
        email: userFormEmail.trim().toLowerCase(),
        phone: userFormPhone.trim(),
        babyName: userFormBabyName.trim(),
        password: userFormPassword.trim(),
        role: userFormRole,
        status: userFormStatus
      };
      setUsersList(usersList.map(u => u.id === editingUserId ? updatedUser : u));
      saveProfileToDB(updatedUser).catch(err => console.warn('Supabase sync error:', err));
      showFeedback('Dados da usuária atualizados!');
    } else {
      const newUser = {
        id: `user-${Date.now()}`,
        name: userFormName.trim(),
        email: userFormEmail.trim().toLowerCase(),
        phone: userFormPhone.trim(),
        babyName: userFormBabyName.trim(),
        password: userFormPassword.trim() || '123456',
        role: userFormRole,
        status: userFormStatus,
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      setUsersList([...usersList, newUser]);
      saveProfileToDB(newUser).catch(err => console.warn('Supabase sync error:', err));
      showFeedback('Nova usuária cadastrada com sucesso!');
    }
    setIsUserModalOpen(false);
    setEditingUserId(null);
  };

  const handleDeleteUser = (userOrId) => {
    const targetUser = typeof userOrId === 'object' 
      ? userOrId 
      : usersList.find(u => u.id === userOrId || u.email === userOrId);
    if (!targetUser) return;
    triggerConfirm({
      title: 'Excluir Usuária?',
      message: `Tem certeza que deseja remover o cadastro de "${targetUser.name}" (${targetUser.email})?`,
      confirmLabel: 'Sim, Remover Usuária',
      variant: 'danger',
      onConfirm: () => {
        setUsersList(usersList.filter(u => u.id !== targetUser.id && u.email !== targetUser.email));
        deleteProfileFromDB(targetUser.id, targetUser.email).catch(err => console.warn('Supabase delete error:', err));
        showFeedback('Usuária removida com sucesso!');
      }
    });
  };

  const handleQuickApproveUser = (id) => {
    const target = usersList.find(u => u.id === id);
    if (target) {
      const updatedUser = { ...target, status: 'active' };
      setUsersList(usersList.map(u => u.id === id ? updatedUser : u));
      saveProfileToDB(updatedUser).catch(err => console.warn('Supabase approve sync error:', err));
      showFeedback('Acesso da usuária aprovado com sucesso!');
    }
  };

  const handleQuickToggleBlock = (id) => {
    const target = usersList.find(u => u.id === id);
    if (target) {
      const newStatus = target.status === 'blocked' ? 'active' : 'blocked';
      const updatedUser = { ...target, status: newStatus };
      setUsersList(usersList.map(u => u.id === id ? updatedUser : u));
      saveProfileToDB(updatedUser).catch(err => console.warn('Supabase block sync error:', err));
      showFeedback(newStatus === 'blocked' ? 'Usuária bloqueada.' : 'Acesso da usuária reativado!');
    }
  };

  const handleSetRegistrationMode = (mode) => {
    const updated = { ...localAccessSettings, registrationMode: mode };
    setLocalAccessSettings(updated);
    setAccessSettings(updated);
    try { localStorage.setItem('ddp_access_settings', JSON.stringify(updated)); } catch {}
    saveAppSettingToDB('access', updated).catch(err => console.warn('Supabase access setting error:', err));
    showFeedback(`Política de cadastro alterada: ${mode === 'open' ? 'Acesso Livre (Imediato)' : 'Apenas por Confirmação da Admin'}`);
  };

  // --- Platforms & Support State & Handlers ---
  const [localPlatforms, setLocalPlatforms] = useState(streamingPlatforms);

  useEffect(() => {
    if (streamingPlatforms && Array.isArray(streamingPlatforms) && streamingPlatforms.length > 0) {
      setLocalPlatforms(streamingPlatforms);
    }
  }, [streamingPlatforms]);

  const handleTogglePlatform = (id) => {
    setLocalPlatforms(localPlatforms.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };
  const handlePlatformUrlChange = (id, newUrl) => {
    setLocalPlatforms(localPlatforms.map(p => p.id === id ? { ...p, url: newUrl } : p));
  };
  const handlePlatformCtaChange = (id, newCta) => {
    setLocalPlatforms(localPlatforms.map(p => p.id === id ? { ...p, ctaText: newCta } : p));
  };
  const handleSavePlatforms = async () => {
    setStreamingPlatforms(localPlatforms);
    await idbSet('ddp_streaming_platforms', localPlatforms);
    try { localStorage.setItem('ddp_streaming_platforms', JSON.stringify(localPlatforms)); } catch {}
    await saveStreamingPlatformsToDB(localPlatforms);
    showFeedback('Configuração das plataformas salva com sucesso!');
  };

  const [localSupportSettings, setLocalSupportSettings] = useState(supportSettings);

  useEffect(() => {
    if (supportSettings) {
      setLocalSupportSettings(supportSettings);
    }
  }, [supportSettings]);

  const handleSaveSupportSettings = async () => {
    setSupportSettings(localSupportSettings);
    await idbSet('ddp_support_settings', localSupportSettings);
    try { localStorage.setItem('ddp_support_settings', JSON.stringify(localSupportSettings)); } catch {}
    await saveAppSettingToDB('support', localSupportSettings);
    showFeedback('Configurações de Suporte e Grupo do WhatsApp salvas!');
  };

  // --- Announcements / Ads State & Handlers ---
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);
  const [adTitle, setAdTitle] = useState('');
  const [adText, setAdText] = useState('');
  const [adMediaType, setAdMediaType] = useState('image'); // 'image' | 'video'
  const [adMediaUrl, setAdMediaUrl] = useState('');
  const [adMediaMode, setAdMediaMode] = useState('upload'); // 'upload' | 'url'
  const [adButtonText, setAdButtonText] = useState('');
  const [adButtonLink, setAdButtonLink] = useState('');
  const [adEnabled, setAdEnabled] = useState(true);

  const handleOpenNewAd = () => {
    setEditingAdId(null);
    setAdTitle('');
    setAdText('');
    setAdMediaType('image');
    setAdMediaUrl('');
    setAdMediaMode('upload');
    setAdButtonText('Saber Mais');
    setAdButtonLink('https://');
    setAdEnabled(true);
    setIsAdModalOpen(true);
  };

  const handleStartEditAd = (ad) => {
    setEditingAdId(ad.id);
    setAdTitle(ad.title || '');
    setAdText(ad.text || '');
    setAdMediaType(ad.mediaType || 'image');
    setAdMediaUrl(ad.mediaUrl || '');
    setAdMediaMode(ad.mediaUrl?.startsWith('data:') ? 'upload' : 'url');
    setAdButtonText(ad.buttonText || 'Saber Mais');
    setAdButtonLink(ad.buttonLink || '');
    setAdEnabled(ad.enabled !== false);
    setIsAdModalOpen(true);
  };

  const handleSaveAd = (e) => {
    if (e) e.preventDefault();
    if (!adTitle.trim()) return;

    if (editingAdId) {
      const updated = announcements.map(a => a.id === editingAdId ? {
        ...a,
        title: adTitle.trim(),
        text: adText.trim(),
        mediaType: adMediaType,
        mediaUrl: adMediaUrl.trim(),
        buttonText: adButtonText.trim(),
        buttonLink: adButtonLink.trim(),
        enabled: adEnabled
      } : a);
      setAnnouncements(updated);
      showFeedback('Anúncio atualizado com sucesso!');
    } else {
      const newAd = {
        id: `ad-${Date.now()}`,
        title: adTitle.trim(),
        text: adText.trim(),
        mediaType: adMediaType,
        mediaUrl: adMediaUrl.trim(),
        buttonText: adButtonText.trim(),
        buttonLink: adButtonLink.trim(),
        enabled: adEnabled,
        viewsCount: 0,
        clicksCount: 0,
        closesCount: 0,
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      setAnnouncements([...announcements, newAd]);
      showFeedback('Novo anúncio criado!');
    }
    setIsAdModalOpen(false);
    setEditingAdId(null);
  };

  const handleDeleteAd = (id) => {
    triggerConfirm({
      title: 'Excluir Anúncio?',
      message: 'Tem certeza que deseja remover este anúncio permanentemente?',
      confirmLabel: 'Sim, Excluir Anúncio',
      variant: 'danger',
      onConfirm: async () => {
        const updated = announcements.filter(a => a.id !== id);
        setAnnouncements(updated);
        await idbSet('ddp_announcements', updated);
        try { localStorage.setItem('ddp_announcements', JSON.stringify(updated)); } catch {}
        await deleteAnnouncementFromDB(id);
        if (updated.length === 0) {
          await saveAnnouncementsToDB([]);
        }
        showFeedback('Anúncio excluído com sucesso.');
      }
    });
  };

  const handleToggleAdEnabled = (id) => {
    const updated = announcements.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a);
    setAnnouncements(updated);
    showFeedback('Status do anúncio atualizado!');
  };

  const handleResetAdMetrics = (id) => {
    triggerConfirm({
      title: 'Zerar Métricas?',
      message: 'Deseja reiniciar a contagem de visualizações, cliques e fechamentos deste anúncio?',
      confirmLabel: 'Zerar Métricas',
      variant: 'warning',
      onConfirm: () => {
        const updated = announcements.map(a => a.id === id ? { ...a, viewsCount: 0, clicksCount: 0, closesCount: 0 } : a);
        setAnnouncements(updated);
        showFeedback('Métricas do anúncio zeradas.');
      }
    });
  };

  const pendingUsersCount = usersList.filter(u => u.status === 'pending').length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F5F6FA] antialiased selection:bg-amber-500 selection:text-white">
      
      {/* Sidebar Navigation */}
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">

      {/* Hidden Audio Element for Testing Previews */}
      <audio ref={testAudioRef} preload="none" />

      {/* Uploading Overlay */}
      {isUploadingMedia && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center">
            <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Enviando para a Nuvem...</h3>
              <p className="text-xs text-slate-500 mt-1">Aguarde enquanto o arquivo é carregado no servidor público.</p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {saveToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#0C1B3A] text-white shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300">
          <Check size={16} className="text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <AdminOverviewTab 
          realDbStats={realDbStats}
          usersList={usersList}
          audiobooks={audiobooks}
          momentsList={momentsList}
          prayers={prayers}
          setActiveTab={setActiveTab}
          handleOpenNewBook={handleOpenNewBook}
          handleOpenEditBook={handleOpenEditBook}
          setSelectedBookForChapters={setSelectedBookForChapters}
        />
      )}

      {/* Tab 2: Audiobooks */}
      {activeTab === 'audiobooks' && (
        <AdminAudiobooksTab 
          audiobooks={audiobooks}
          handleOpenNewBook={handleOpenNewBook}
          handleOpenEditBook={handleOpenEditBook}
          handleDeleteBook={handleDeleteBook}
          selectedBookForChapters={selectedBookForChapters}
          setSelectedBookForChapters={setSelectedBookForChapters}
          handleOpenNewChapter={handleOpenNewChapter}
          handleStartEditChapter={handleStartEditChapter}
          handleDeleteChapter={handleDeleteChapter}
          testAudioSrc={testAudioSrc}
          isTestingAudio={isTestingAudio}
          toggleTestPlay={toggleTestPlay}
        />
      )}

      {/* Tab 3: Home & Moments */}
      {activeTab === 'home' && (
        <AdminHomeTab 
          localHomeSettings={localHomeSettings}
          handleToggleHomeSetting={handleToggleHomeSetting}
          handleSaveHomeSettings={handleSaveHomeSettings}
          momentsList={momentsList}
          handleOpenNewMoment={handleOpenNewMoment}
          handleStartEditMoment={handleStartEditMoment}
          handleDeleteMoment={handleDeleteMoment}
          handleToggleMomentEnabled={handleToggleMomentEnabled}
          testAudioSrc={testAudioSrc}
          isTestingAudio={isTestingAudio}
          toggleTestPlay={toggleTestPlay}
        />
      )}

      {/* Tab 4: Special Song */}
      {activeTab === 'songs' && (
        <AdminSongTab 
          specialSong={specialSong}
          setIsSongModalOpen={setIsSongModalOpen}
          testAudioSrc={testAudioSrc}
          isTestingAudio={isTestingAudio}
          toggleTestPlay={toggleTestPlay}
        />
      )}

      {/* Tab 5: Prayers */}
      {activeTab === 'prayers' && (
        <AdminPrayersTab 
          prayers={prayers}
          handleOpenNewPrayer={handleOpenNewPrayer}
          handleStartEditPrayer={handleStartEditPrayer}
          handleDeletePrayer={handleDeletePrayer}
          testAudioSrc={testAudioSrc}
          isTestingAudio={isTestingAudio}
          toggleTestPlay={toggleTestPlay}
        />
      )}

      {/* Tab 6: Users */}
      {activeTab === 'users' && (
        <AdminUsersTab 
          localAccessSettings={localAccessSettings}
          handleSetRegistrationMode={handleSetRegistrationMode}
          usersList={usersList}
          userSearchQuery={userSearchQuery}
          setUserSearchQuery={setUserSearchQuery}
          userFilterStatus={userFilterStatus}
          setUserFilterStatus={setUserFilterStatus}
          handleOpenNewUser={handleOpenNewUser}
          handleQuickApproveUser={handleQuickApproveUser}
          handleQuickToggleBlock={handleQuickToggleBlock}
          handleStartEditUser={handleStartEditUser}
          handleDeleteUser={handleDeleteUser}
        />
      )}

      {/* Tab 8: Anúncios & Propagandas */}
      {activeTab === 'ads' && (
        <AdminAdsTab 
          announcements={announcements}
          handleOpenNewAd={handleOpenNewAd}
          handleStartEditAd={handleStartEditAd}
          handleDeleteAd={handleDeleteAd}
          handleToggleAdEnabled={handleToggleAdEnabled}
          handleResetAdMetrics={handleResetAdMetrics}
        />
      )}

      {/* Tab 7: Platforms & Support */}
      {activeTab === 'platforms' && (
        <AdminPlatformsTab 
          localPlatforms={localPlatforms}
          handleTogglePlatform={handleTogglePlatform}
          handlePlatformUrlChange={handlePlatformUrlChange}
          handlePlatformCtaChange={handlePlatformCtaChange}
          handleSavePlatforms={handleSavePlatforms}
          localSupportSettings={localSupportSettings}
          setLocalSupportSettings={setLocalSupportSettings}
          handleSaveSupportSettings={handleSaveSupportSettings}
        />
      )}

      {/* All Modal Dialogs */}
      <AdminModals 
        isAdModalOpen={isAdModalOpen}
        setIsAdModalOpen={setIsAdModalOpen}
        editingAdId={editingAdId}
        adTitle={adTitle}
        setAdTitle={setAdTitle}
        adText={adText}
        setAdText={setAdText}
        adMediaType={adMediaType}
        setAdMediaType={setAdMediaType}
        adMediaUrl={adMediaUrl}
        setAdMediaUrl={setAdMediaUrl}
        adMediaMode={adMediaMode}
        setAdMediaMode={setAdMediaMode}
        adButtonText={adButtonText}
        setAdButtonText={setAdButtonText}
        adButtonLink={adButtonLink}
        setAdButtonLink={setAdButtonLink}
        adEnabled={adEnabled}
        setAdEnabled={setAdEnabled}
        handleSaveAd={handleSaveAd}

        isBookModalOpen={isBookModalOpen}
        setIsBookModalOpen={setIsBookModalOpen}
        editingBook={editingBook}
        bookTitle={bookTitle}
        setBookTitle={setBookTitle}
        bookDescription={bookDescription}
        setBookDescription={setBookDescription}
        bookCover={bookCover}
        setBookCover={setBookCover}
        bookCoverMode={bookCoverMode}
        setBookCoverMode={setBookCoverMode}
        handleSaveBook={handleSaveBook}
        handleImageFileUpload={handleImageFileUpload}

        isSongModalOpen={isSongModalOpen}
        setIsSongModalOpen={setIsSongModalOpen}
        songTitle={songTitle}
        setSongTitle={setSongTitle}
        songArtist={songArtist}
        setSongArtist={setSongArtist}
        songTagline={songTagline}
        setSongTagline={setSongTagline}
        songCover={songCover}
        setSongCover={setSongCover}
        songCoverMode={songCoverMode}
        setSongCoverMode={setSongCoverMode}
        songAudioUrl={songAudioUrl}
        setSongAudioUrl={setSongAudioUrl}
        songAudioMode={songAudioMode}
        setSongAudioMode={setSongAudioMode}
        songDuration={songDuration}
        setSongDuration={setSongDuration}
        songLyricsText={songLyricsText}
        setSongLyricsText={setSongLyricsText}
        handleSaveSong={handleSaveSong}
        handleAudioFileUpload={handleAudioFileUpload}
        detectAudioDuration={detectAudioDuration}
        toggleTestPlay={toggleTestPlay}
        testAudioSrc={testAudioSrc}
        isTestingAudio={isTestingAudio}

        isChapterModalOpen={isChapterModalOpen}
        selectedBookForChapters={selectedBookForChapters}
        editingChapterId={editingChapterId}
        newChapterTitle={newChapterTitle}
        setNewChapterTitle={setNewChapterTitle}
        newChapterSubtitle={newChapterSubtitle}
        setNewChapterSubtitle={setNewChapterSubtitle}
        newChapterDuration={newChapterDuration}
        setNewChapterDuration={setNewChapterDuration}
        newChapterCoverUrl={newChapterCoverUrl}
        setNewChapterCoverUrl={setNewChapterCoverUrl}
        newChapterCoverMode={newChapterCoverMode}
        setNewChapterCoverMode={setNewChapterCoverMode}
        newChapterAudioUrl={newChapterAudioUrl}
        setNewChapterAudioUrl={setNewChapterAudioUrl}
        newChapterAudioMode={newChapterAudioMode}
        setNewChapterAudioMode={setNewChapterAudioMode}
        newChapterAudioFileName={newChapterAudioFileName}
        newChapterSnippet={newChapterSnippet}
        setNewChapterSnippet={setNewChapterSnippet}
        handleSaveChapter={handleSaveChapter}
        handleCancelEditChapter={handleCancelEditChapter}

        isPrayerModalOpen={isPrayerModalOpen}
        editingPrayerId={editingPrayerId}
        prayerTitle={prayerTitle}
        setPrayerTitle={setPrayerTitle}
        prayerSubtitle={prayerSubtitle}
        setPrayerSubtitle={setPrayerSubtitle}
        prayerCategory={prayerCategory}
        setPrayerCategory={setPrayerCategory}
        prayerDuration={prayerDuration}
        setPrayerDuration={setPrayerDuration}
        prayerCoverUrl={prayerCoverUrl}
        setPrayerCoverUrl={setPrayerCoverUrl}
        prayerCoverMode={prayerCoverMode}
        setPrayerCoverMode={setPrayerCoverMode}
        prayerAudioUrl={prayerAudioUrl}
        setPrayerAudioUrl={setPrayerAudioUrl}
        prayerAudioMode={prayerAudioMode}
        setPrayerAudioMode={setPrayerAudioMode}
        prayerAudioFileName={prayerAudioFileName}
        prayerFullText={prayerFullText}
        setPrayerFullText={setPrayerFullText}
        handleSavePrayer={handleSavePrayer}
        handleCancelPrayer={handleCancelPrayer}

        isUserModalOpen={isUserModalOpen}
        editingUserId={editingUserId}
        userFormName={userFormName}
        setUserFormName={setUserFormName}
        userFormEmail={userFormEmail}
        setUserFormEmail={setUserFormEmail}
        userFormPhone={userFormPhone}
        setUserFormPhone={setUserFormPhone}
        userFormBabyName={userFormBabyName}
        setUserFormBabyName={setUserFormBabyName}
        userFormPassword={userFormPassword}
        setUserFormPassword={setUserFormPassword}
        userFormRole={userFormRole}
        setUserFormRole={setUserFormRole}
        userFormStatus={userFormStatus}
        setUserFormStatus={setUserFormStatus}
        showPasswordInModal={showPasswordInModal}
        setShowPasswordInModal={setShowPasswordInModal}
        handleSaveUser={handleSaveUser}
        handleCancelUserModal={handleCancelUserModal}

        isMomentModalOpen={isMomentModalOpen}
        editingMomentId={editingMomentId}
        momentTitle={momentTitle}
        setMomentTitle={setMomentTitle}
        momentBadge={momentBadge}
        setMomentBadge={setMomentBadge}
        momentDescription={momentDescription}
        setMomentDescription={setMomentDescription}
        momentActionText={momentActionText}
        setMomentActionText={setMomentActionText}
        momentTextSnippet={momentTextSnippet}
        setMomentTextSnippet={setMomentTextSnippet}
        momentCoverUrl={momentCoverUrl}
        setMomentCoverUrl={setMomentCoverUrl}
        momentCoverMode={momentCoverMode}
        setMomentCoverMode={setMomentCoverMode}
        momentAudioUrl={momentAudioUrl}
        setMomentAudioUrl={setMomentAudioUrl}
        momentAudioMode={momentAudioMode}
        setMomentAudioMode={setMomentAudioMode}
        momentAudioFileName={momentAudioFileName}
        momentDuration={momentDuration}
        setMomentDuration={setMomentDuration}
        handleSaveMoment={handleSaveMoment}
        handleCancelMoment={handleCancelMoment}

        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

        </div>
      </main>
    </div>
  );
}
