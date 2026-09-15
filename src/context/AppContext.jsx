import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  INITIAL_AUDIOBOOKS, 
  SPECIAL_SONG, 
  PRAYERS_LIST, 
  ADMIN_STATS_DEFAULT, 
  INITIAL_STREAMING_PLATFORMS,
  INITIAL_USERS_LIST,
  INITIAL_ACCESS_SETTINGS,
  INITIAL_SUPPORT_SETTINGS,
  INITIAL_MOMENTS_LIST,
  INITIAL_HOME_SETTINGS,
  INITIAL_ANNOUNCEMENTS
} from '../data/initialData';
import { soothingSynth } from '../utils/audioSynth';
import { idbGet, idbSet, idbRemove } from '../utils/storageHelper';
import {
  supabase,
  fetchAudiobooksFromDB,
  saveAudiobooksToDB,
  fetchSpecialSongFromDB,
  saveSpecialSongToDB,
  fetchStreamingPlatformsFromDB,
  saveStreamingPlatformsToDB,
  fetchPrayersFromDB,
  savePrayersToDB,
  fetchMomentsFromDB,
  saveMomentsToDB,
  fetchUserFavoritesFromDB,
  toggleUserFavoriteInDB,
  fetchLastPlayedFromDB,
  saveLastPlayedToDB,
  fetchProfilesFromDB,
  saveProfileToDB,
  fetchAppSettingsFromDB,
  saveAppSettingToDB,
  fetchAnnouncementsFromDB,
  saveAnnouncementsToDB,
  incrementAdMetricInDB
} from '../lib/supabaseClient';

const AppContext = createContext();

export function AppProvider({ children }) {
  // --- Theme State (Light / Dark) ---
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_theme');
      return saved ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ddp_theme', theme);
    } catch {}
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // --- Active Nursing/Vigil Mode ---
  const [activeMode, setActiveMode] = useState('acalento');

  // --- Persistent State ---
  const [audiobooks, setAudiobooks] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_audiobooks');
      return saved ? JSON.parse(saved) : INITIAL_AUDIOBOOKS;
    } catch {
      return INITIAL_AUDIOBOOKS;
    }
  });

  const [specialSong, setSpecialSong] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_special_song');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...SPECIAL_SONG,
          ...parsed,
          lyrics: parsed.lyrics && (Array.isArray(parsed.lyrics) ? parsed.lyrics.length > 0 : parsed.lyrics.trim()) ? parsed.lyrics : SPECIAL_SONG.lyrics
        };
      }
      return SPECIAL_SONG;
    } catch {
      return SPECIAL_SONG;
    }
  });

  const [prayers, setPrayers] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_prayers');
      return saved ? JSON.parse(saved) : PRAYERS_LIST;
    } catch {
      return PRAYERS_LIST;
    }
  });

  const [streamingPlatforms, setStreamingPlatforms] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_streaming_platforms');
      return saved ? JSON.parse(saved) : INITIAL_STREAMING_PLATFORMS;
    } catch {
      return INITIAL_STREAMING_PLATFORMS;
    }
  });

  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_users_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(u => !['user-admin-1', 'user-2', 'user-3', 'user-4', 'user-5'].includes(u.id));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [accessSettings, setAccessSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_access_settings');
      return saved ? JSON.parse(saved) : INITIAL_ACCESS_SETTINGS;
    } catch {
      return INITIAL_ACCESS_SETTINGS;
    }
  });

  const [supportSettings, setSupportSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_support_settings');
      return saved ? JSON.parse(saved) : INITIAL_SUPPORT_SETTINGS;
    } catch {
      return INITIAL_SUPPORT_SETTINGS;
    }
  });

  const [momentsList, setMomentsList] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_moments_list');
      return saved ? JSON.parse(saved) : INITIAL_MOMENTS_LIST;
    } catch {
      return INITIAL_MOMENTS_LIST;
    }
  });

  const [homeSettings, setHomeSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_home_settings');
      return saved ? JSON.parse(saved) : INITIAL_HOME_SETTINGS;
    } catch {
      return INITIAL_HOME_SETTINGS;
    }
  });

  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_announcements');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_favorites');
      return saved ? JSON.parse(saved) : [
        'song-special-1',
        'ab1-ch2',
        'prayer-1'
      ];
    } catch {
      return ['song-special-1', 'ab1-ch2', 'prayer-1'];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [lastPlayed, setLastPlayed] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ddp_user');
      const userEmail = savedUser ? JSON.parse(savedUser)?.email : null;
      if (userEmail) {
        const saved = localStorage.getItem(`ddp_last_played_${userEmail.toLowerCase()}`);
        return saved ? JSON.parse(saved) : null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(() => {
    try {
      return !localStorage.getItem('ddp_onboarding_completed');
    } catch {
      return false;
    }
  });

  const completeOnboarding = async (data = {}) => {
    try {
      localStorage.setItem('ddp_onboarding_completed', 'true');
    } catch {}
    if (user && (data.name || data.babyName)) {
      const updatedUser = {
        ...user,
        ...(data.name ? { name: data.name } : {}),
        ...(data.babyName ? { babyName: data.babyName } : {})
      };
      setUser(updatedUser);
      try {
        localStorage.setItem('ddp_user', JSON.stringify(updatedUser));
      } catch {}
      await saveProfileToDB(updatedUser);
    }
    setIsWelcomeModalOpen(false);
  };

  const isInitialSyncDoneRef = useRef(false);

  // Async load from IndexedDB + Supabase Remote Sync on startup
  useEffect(() => {
    let mounted = true;
    (async () => {
      // 1. Instant local cache load
      const [
        savedBooks, 
        savedSong, 
        savedPrayers, 
        savedPlatforms, 
        savedFavs, 
        savedUsers, 
        savedAccess, 
        savedSupport,
        savedMoments,
        savedHomeSettings
      ] = await Promise.all([
        idbGet('ddp_audiobooks', null),
        idbGet('ddp_special_song', null),
        idbGet('ddp_prayers', null),
        idbGet('ddp_streaming_platforms', null),
        idbGet('ddp_favorites', null),
        idbGet('ddp_users_list', null),
        idbGet('ddp_access_settings', null),
        idbGet('ddp_support_settings', null),
        idbGet('ddp_moments_list', null),
        idbGet('ddp_home_settings', null)
      ]);
      if (mounted) {
        if (savedBooks) setAudiobooks(savedBooks);
        if (savedSong) {
          const updatedSong = {
            ...SPECIAL_SONG,
            ...savedSong,
            lyrics: savedSong.lyrics && (Array.isArray(savedSong.lyrics) ? savedSong.lyrics.length > 0 : savedSong.lyrics.trim()) ? savedSong.lyrics : SPECIAL_SONG.lyrics
          };
          setSpecialSong(updatedSong);
        }
        if (savedPrayers) setPrayers(savedPrayers);
        if (savedPlatforms) setStreamingPlatforms(savedPlatforms);
        if (savedFavs) setFavorites(savedFavs);
        if (savedUsers) {
          const clean = Array.isArray(savedUsers) ? savedUsers.filter(u => !['user-admin-1', 'user-2', 'user-3', 'user-4', 'user-5'].includes(u.id)) : [];
          setUsersList(clean);
        }
        if (savedAccess) setAccessSettings(savedAccess);
        if (savedSupport) setSupportSettings(savedSupport);
        if (savedMoments) setMomentsList(savedMoments);
        if (savedHomeSettings) setHomeSettings(savedHomeSettings);
      }

      // 2. Fetch live data from Supabase DB in background
      try {
        const [
          dbBooks,
          dbSong,
          dbPlatforms,
          dbPrayers,
          dbMoments,
          dbSettings,
          dbProfiles
        ] = await Promise.all([
          fetchAudiobooksFromDB(),
          fetchSpecialSongFromDB(),
          fetchStreamingPlatformsFromDB(),
          fetchPrayersFromDB(),
          fetchMomentsFromDB(),
          fetchAppSettingsFromDB(),
          fetchProfilesFromDB()
        ]);

        if (mounted) {
          if (dbBooks && dbBooks.length > 0) {
            setAudiobooks(prev => {
              const current = (prev && prev.length > 0) ? prev : (savedBooks || []);
              const merged = dbBooks.map(dbBook => {
                const localBook = current.find(b => b.id === dbBook.id);
                if (!localBook) return dbBook;
                return {
                  ...dbBook,
                  coverUrl: dbBook.coverUrl || localBook.coverUrl,
                  chapters: (dbBook.chapters || []).map(dbCh => {
                    const localCh = (localBook.chapters || []).find(c => c.id === dbCh.id);
                    return {
                      ...dbCh,
                      coverUrl: dbCh.coverUrl || localCh?.coverUrl,
                      audioUrl: (dbCh.audioUrl && dbCh.audioUrl.trim()) ? dbCh.audioUrl : (localCh?.audioUrl || '')
                    };
                  })
                };
              });
              idbSet('ddp_audiobooks', merged);
              return merged;
            });
          }
          if (dbSong) {
            setSpecialSong(prev => {
              const current = prev || savedSong || {};
              const merged = {
                ...dbSong,
                audioUrl: (dbSong.audioUrl && dbSong.audioUrl.trim()) ? dbSong.audioUrl : (current.audioUrl || ''),
                coverUrl: dbSong.coverUrl || current.coverUrl || ''
              };
              idbSet('ddp_special_song', merged);
              return merged;
            });
          }
          if (dbPlatforms && dbPlatforms.length > 0) {
            setStreamingPlatforms(dbPlatforms);
            idbSet('ddp_streaming_platforms', dbPlatforms);
          }
          if (dbPrayers && dbPrayers.length > 0) {
            setPrayers(prev => {
              const current = (prev && prev.length > 0) ? prev : (savedPrayers || []);
              const merged = dbPrayers.map(dbP => {
                const localP = current.find(p => p.id === dbP.id);
                return {
                  ...dbP,
                  audioUrl: (dbP.audioUrl && dbP.audioUrl.trim()) ? dbP.audioUrl : (localP?.audioUrl || ''),
                  coverUrl: dbP.coverUrl || localP?.coverUrl || ''
                };
              });
              idbSet('ddp_prayers', merged);
              return merged;
            });
          }
          if (dbMoments && dbMoments.length > 0) {
            setMomentsList(prev => {
              const current = (prev && prev.length > 0) ? prev : (savedMoments || []);
              // 1. Map all moments from DB, preserving local custom audio/cover
              const mergedFromDb = dbMoments.map(dbM => {
                const localM = current.find(m => m.id === dbM.id);
                if (!localM) return dbM;
                const hasCustomLocalAudio = localM.audioUrl && localM.audioUrl.trim();
                const isGenericSeed = dbM.audioUrl === '/dorme-dorme-precioso-master.wav';
                return {
                  ...dbM,
                  audioUrl: (hasCustomLocalAudio && isGenericSeed)
                    ? localM.audioUrl
                    : ((dbM.audioUrl && dbM.audioUrl.trim()) ? dbM.audioUrl : (localM.audioUrl || '')),
                  coverUrl: dbM.coverUrl || localM.coverUrl || '',
                  enabled: typeof dbM.enabled === 'boolean' ? dbM.enabled : (localM.enabled !== false)
                };
              });
              // 2. Preserve any local moments created by the user not in DB yet
              const localCreatedMoments = current.filter(
                localM => !dbMoments.some(dbM => dbM.id === localM.id)
              );
              const finalMoments = [...mergedFromDb, ...localCreatedMoments];
              idbSet('ddp_moments_list', finalMoments);
              return finalMoments;
            });
          }
          if (dbSettings) {
            if (dbSettings.access) {
              setAccessSettings(dbSettings.access);
              idbSet('ddp_access_settings', dbSettings.access);
            }
            if (dbSettings.support) {
              setSupportSettings(dbSettings.support);
              idbSet('ddp_support_settings', dbSettings.support);
            }
            if (dbSettings.home) {
              setHomeSettings(dbSettings.home);
              idbSet('ddp_home_settings', dbSettings.home);
            }
          }
          if (dbProfiles !== null) {
            setUsersList(dbProfiles);
            idbSet('ddp_users_list', dbProfiles);
            try {
              localStorage.setItem('ddp_users_list', JSON.stringify(dbProfiles));
            } catch {}
          }
        }
      } catch (err) {
        console.warn('Supabase initial fetch failed, using local offline data:', err);
      } finally {
        isInitialSyncDoneRef.current = true;
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Fetch user-specific favorites & progress from Supabase when user is set
  useEffect(() => {
    if (!user?.email) {
      setLastPlayed(null);
      setCurrentTrack(null);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const userEmailKey = `ddp_last_played_${user.email.toLowerCase()}`;
        let localUserLastPlayed = null;
        try {
          const saved = localStorage.getItem(userEmailKey);
          if (saved) localUserLastPlayed = JSON.parse(saved);
        } catch {}

        if (!localUserLastPlayed) {
          localUserLastPlayed = await idbGet(userEmailKey, null);
        }

        const [userFavs, userLastPlayed] = await Promise.all([
          fetchUserFavoritesFromDB(user.email),
          fetchLastPlayedFromDB(user.email)
        ]);

        if (mounted) {
          if (userFavs && userFavs.length > 0) {
            setFavorites(userFavs);
            idbSet(`ddp_favorites_${user.email.toLowerCase()}`, userFavs);
          }
          const chosenLastPlayed = userLastPlayed || localUserLastPlayed || null;
          setLastPlayed(chosenLastPlayed);
          if (chosenLastPlayed) {
            idbSet(userEmailKey, chosenLastPlayed);
            try { localStorage.setItem(userEmailKey, JSON.stringify(chosenLastPlayed)); } catch {}
          } else {
            setCurrentTrack(null);
          }
        }
      } catch (e) {
        console.warn('Error fetching user data from Supabase:', e);
      }
    })();
    return () => { mounted = false; };
  }, [user?.email]);

  // --- PWA Installation Capability ---
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsAppInstalled(true);
          setIsInstallable(false);
        }
      } catch (err) {
        console.warn('Install error:', err);
      }
      setDeferredPrompt(null);
    } else {
      setIsInstallModalOpen(true);
    }
  };

  // --- Navigation / View State ---
  const [currentView, setCurrentView] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ddp_user');
      return savedUser ? 'dashboard' : 'welcome';
    } catch {
      return 'welcome';
    }
  });
  const [selectedAudiobookId, setSelectedAudiobookId] = useState('audiobook-1');
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isNursingModalOpen, setIsNursingModalOpen] = useState(false);
  const [isCustomTimerModalOpen, setIsCustomTimerModalOpen] = useState(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);

  // --- Audio Player State ---
  const [currentTrack, setCurrentTrack] = useState(() => {
    try {
      const saved = localStorage.getItem('ddp_last_played');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.id || parsed.trackId)) {
          return {
            id: parsed.id || parsed.trackId,
            title: parsed.title,
            subtitle: parsed.subtitle || "Dorme, Precioso",
            coverUrl: parsed.coverUrl || "/dorme-dorme-precioso-capa.png",
            audioUrl: parsed.audioUrl || "",
            durationFormatted: parsed.duration || "00:00",
            audiobookId: parsed.audiobookId || null,
            chapterNumber: parsed.chapterNumber || null
          };
        }
      }
    } catch {}
    return null;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null); // in seconds
  const [timerFinishedNotice, setTimerFinishedNotice] = useState(false);

  const audioRef = useRef(null);
  const sleepTimerRef = useRef(null);
  const lastSavedProgressRef = useRef(0);

  // Sync currentTrack and lastPlayed with updated audiobook chapters
  useEffect(() => {
    if (!audiobooks || audiobooks.length === 0) return;

    const findChapter = (targetId) => {
      for (const b of audiobooks) {
        if (Array.isArray(b.chapters)) {
          const ch = b.chapters.find(c => c.id === targetId);
          if (ch) return { chapter: ch, book: b };
        }
      }
      return null;
    };

    if (currentTrack?.id) {
      const match = findChapter(currentTrack.id);
      if (match) {
        const { chapter, book } = match;
        const newTitle = chapter.number ? `${chapter.number}. ${chapter.title}` : chapter.title;
        const newCover = chapter.coverUrl || book.coverUrl || "/dorme-dorme-precioso-capa.png";
        if (chapter.audioUrl !== currentTrack.audioUrl || 
            newTitle !== currentTrack.title || 
            newCover !== currentTrack.coverUrl) {
          setCurrentTrack(prev => ({
            ...prev,
            title: newTitle,
            subtitle: book.title,
            coverUrl: newCover,
            audioUrl: chapter.audioUrl || "",
            durationFormatted: chapter.duration || prev?.durationFormatted
          }));
          if (audioRef.current && chapter.audioUrl) {
            audioRef.current.src = chapter.audioUrl;
          }
        }
      }
    }

    if (lastPlayed?.trackId || lastPlayed?.id) {
      const targetId = lastPlayed.trackId || lastPlayed.id;
      const match = findChapter(targetId);
      if (match) {
        const { chapter, book } = match;
        const newTitle = chapter.number ? `${chapter.number}. ${chapter.title}` : chapter.title;
        const newCover = chapter.coverUrl || book.coverUrl || "/dorme-dorme-precioso-capa.png";
        if (chapter.audioUrl !== lastPlayed.audioUrl || 
            newTitle !== lastPlayed.title || 
            newCover !== lastPlayed.coverUrl) {
          const updatedLP = {
            ...lastPlayed,
            title: newTitle,
            subtitle: book.title,
            coverUrl: newCover,
            audioUrl: chapter.audioUrl || "",
            duration: chapter.duration || lastPlayed.duration
          };
          setLastPlayed(updatedLP);
          try { localStorage.setItem('ddp_last_played', JSON.stringify(updatedLP)); } catch {}
          idbSet('ddp_last_played', updatedLP);
          if (userRef.current?.email) {
            saveLastPlayedToDB(userRef.current.email, updatedLP);
          }
        }
      }
    }
  }, [audiobooks]);

  // Safe Sync to IndexedDB + LocalStorage + Supabase DB
  useEffect(() => {
    if (!isInitialSyncDoneRef.current) return;
    idbSet('ddp_audiobooks', audiobooks);
    try { localStorage.setItem('ddp_audiobooks', JSON.stringify(audiobooks)); } catch {}
    saveAudiobooksToDB(audiobooks);
  }, [audiobooks]);

  useEffect(() => {
    if (!isInitialSyncDoneRef.current) return;
    idbSet('ddp_special_song', specialSong);
    try { localStorage.setItem('ddp_special_song', JSON.stringify(specialSong)); } catch {}
    saveSpecialSongToDB(specialSong);
  }, [specialSong]);

  useEffect(() => {
    if (!isInitialSyncDoneRef.current) return;
    idbSet('ddp_prayers', prayers);
    try { localStorage.setItem('ddp_prayers', JSON.stringify(prayers)); } catch {}
    savePrayersToDB(prayers);
  }, [prayers]);

  useEffect(() => {
    if (!isInitialSyncDoneRef.current) return;
    idbSet('ddp_streaming_platforms', streamingPlatforms);
    try { localStorage.setItem('ddp_streaming_platforms', JSON.stringify(streamingPlatforms)); } catch {}
    saveStreamingPlatformsToDB(streamingPlatforms);
  }, [streamingPlatforms]);

  useEffect(() => {
    if (!isInitialSyncDoneRef.current) return;
    idbSet('ddp_favorites', favorites);
    try { localStorage.setItem('ddp_favorites', JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  useEffect(() => {
    if (!isInitialSyncDoneRef.current) return;
    idbSet('ddp_users_list', usersList);
    try { localStorage.setItem('ddp_users_list', JSON.stringify(usersList)); } catch {}
  }, [usersList]);

  useEffect(() => {
    if (!isInitialSyncDoneRef.current) return;
    idbSet('ddp_access_settings', accessSettings);
    try { localStorage.setItem('ddp_access_settings', JSON.stringify(accessSettings)); } catch {}
    saveAppSettingToDB('access', accessSettings);
  }, [accessSettings]);

  useEffect(() => {
    if (!isInitialSyncDoneRef.current) return;
    idbSet('ddp_support_settings', supportSettings);
    try { localStorage.setItem('ddp_support_settings', JSON.stringify(supportSettings)); } catch {}
    saveAppSettingToDB('support', supportSettings);
  }, [supportSettings]);

  useEffect(() => {
    if (!isInitialSyncDoneRef.current) return;
    idbSet('ddp_moments_list', momentsList);
    try { localStorage.setItem('ddp_moments_list', JSON.stringify(momentsList)); } catch {}
    saveMomentsToDB(momentsList);
  }, [momentsList]);

  useEffect(() => {
    if (!isInitialSyncDoneRef.current) return;
    idbSet('ddp_home_settings', homeSettings);
    saveAppSettingToDB('home', homeSettings);
    try {
      localStorage.setItem('ddp_home_settings', JSON.stringify(homeSettings));
    } catch {}
  }, [homeSettings]);

  useEffect(() => {
    idbSet('ddp_announcements', announcements);
    try { localStorage.setItem('ddp_announcements', JSON.stringify(announcements)); } catch {}
    saveAnnouncementsToDB(announcements);
  }, [announcements]);

  const trackAdMetric = (adId, metricType) => {
    if (!adId || !metricType) return;
    setAnnouncements(prev => {
      if (!Array.isArray(prev)) return prev;
      return prev.map(a => {
        if (a.id === adId) {
          return {
            ...a,
            viewsCount: metricType === 'view' ? (a.viewsCount || 0) + 1 : (a.viewsCount || 0),
            clicksCount: metricType === 'click' ? (a.clicksCount || 0) + 1 : (a.clicksCount || 0),
            closesCount: metricType === 'close' ? (a.closesCount || 0) + 1 : (a.closesCount || 0)
          };
        }
        return a;
      });
    });
    incrementAdMetricInDB(adId, metricType);
  };

  useEffect(() => {
    if (user) {
      idbSet('ddp_user', user);
      saveProfileToDB(user);
    } else {
      idbRemove('ddp_user');
    }
  }, [user]);

  useEffect(() => {
    if (lastPlayed && user?.email) {
      const key = `ddp_last_played_${user.email.toLowerCase()}`;
      idbSet(key, lastPlayed);
      try { localStorage.setItem(key, JSON.stringify(lastPlayed)); } catch {}
      saveLastPlayedToDB(user.email, lastPlayed);
    }
  }, [lastPlayed, user?.email]);

  // Format Helper
  const formatTime = (secs) => {
    if (!secs || isNaN(secs) || !isFinite(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentTrackRef = useRef(currentTrack);
  const userRef = useRef(user);
  const audiobooksRef = useRef(audiobooks);
  const sleepTimerMinutesRef = useRef(sleepTimerMinutes);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    audiobooksRef.current = audiobooks;
  }, [audiobooks]);

  useEffect(() => {
    sleepTimerMinutesRef.current = sleepTimerMinutes;
  }, [sleepTimerMinutes]);

  const playNextChapter = () => {
    const current = currentTrackRef.current;
    if (!current) return false;

    const allBooks = audiobooksRef.current || [];
    let bookFound = allBooks.find(b => b.id === current.audiobookId);
    let chapterIdx = -1;

    if (bookFound && Array.isArray(bookFound.chapters)) {
      chapterIdx = bookFound.chapters.findIndex(c => c.id === current.id || c.id === current.chapterId);
    } else {
      for (const b of allBooks) {
        const idx = (b.chapters || []).findIndex(c => c.id === current.id || c.id === current.chapterId);
        if (idx >= 0) {
          bookFound = b;
          chapterIdx = idx;
          break;
        }
      }
    }

    if (bookFound && Array.isArray(bookFound.chapters) && chapterIdx >= 0 && chapterIdx < bookFound.chapters.length - 1) {
      const nextChapter = bookFound.chapters[chapterIdx + 1];
      playTrack({
        id: nextChapter.id,
        title: nextChapter.number ? `${nextChapter.number}. ${nextChapter.title}` : nextChapter.title,
        subtitle: bookFound.title,
        coverUrl: nextChapter.coverUrl || bookFound.coverUrl || "/dorme-dorme-precioso-capa.png",
        audioUrl: nextChapter.audioUrl || "",
        durationFormatted: nextChapter.duration,
        textSnippet: nextChapter.textSnippet,
        audiobookId: bookFound.id,
        chapterNumber: nextChapter.number
      });
      return true;
    }
    return false;
  };

  const playPreviousChapter = () => {
    const current = currentTrackRef.current;
    if (!current) return false;

    const allBooks = audiobooksRef.current || [];
    let bookFound = allBooks.find(b => b.id === current.audiobookId);
    let chapterIdx = -1;

    if (bookFound && Array.isArray(bookFound.chapters)) {
      chapterIdx = bookFound.chapters.findIndex(c => c.id === current.id || c.id === current.chapterId);
    } else {
      for (const b of allBooks) {
        const idx = (b.chapters || []).findIndex(c => c.id === current.id || c.id === current.chapterId);
        if (idx >= 0) {
          bookFound = b;
          chapterIdx = idx;
          break;
        }
      }
    }

    if (bookFound && Array.isArray(bookFound.chapters) && chapterIdx > 0) {
      const prevChapter = bookFound.chapters[chapterIdx - 1];
      playTrack({
        id: prevChapter.id,
        title: prevChapter.number ? `${prevChapter.number}. ${prevChapter.title}` : prevChapter.title,
        subtitle: bookFound.title,
        coverUrl: prevChapter.coverUrl || bookFound.coverUrl || "/dorme-dorme-precioso-capa.png",
        audioUrl: prevChapter.audioUrl || "",
        durationFormatted: prevChapter.duration,
        textSnippet: prevChapter.textSnippet,
        audiobookId: bookFound.id,
        chapterNumber: prevChapter.number
      });
      return true;
    }
    return false;
  };

  // Initialize Audio Element ONCE on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const handleError = (e) => {
      console.warn("Audio playback stream notice:", audio.error);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        const pct = Math.round((audio.currentTime / audio.duration) * 100);
        const track = currentTrackRef.current;
        if (track) {
          const now = Date.now();
          const newLastPlayed = {
            trackId: track.id,
            title: track.title,
            subtitle: track.subtitle || "Dorme, Dorme, Precioso",
            coverUrl: track.coverUrl || "/dorme-dorme-precioso-capa.png",
            audioUrl: track.audioUrl,
            progressPct: pct,
            audiobookId: track.audiobookId || null,
            chapterId: track.id,
            duration: formatTime(audio.duration),
            currentTimeFormatted: formatTime(audio.currentTime)
          };
          setLastPlayed(newLastPlayed);

          // Debounced Supabase sync every 5 seconds of active playback
          if (userRef.current?.email && (now - lastSavedProgressRef.current > 5000)) {
            lastSavedProgressRef.current = now;
            saveLastPlayedToDB(userRef.current.email, newLastPlayed);
          }
        }
      }
    };

    const handleEnded = () => {
      // 1. If sleep timer is set to stop at end of current track
      if (sleepTimerMinutesRef.current === 'end') {
        setIsPlaying(false);
        setSleepTimerMinutes(null);
        setSleepTimerRemaining(null);
        setTimerFinishedNotice(true);
        setTimeout(() => setTimerFinishedNotice(false), 4000);
        return;
      }

      // 2. Automatically play next chapter in sequence for audiobooks!
      const playedNext = playNextChapter();
      if (!playedNext) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Sleep Timer Countdown Loop
  useEffect(() => {
    if (sleepTimerRemaining !== null && sleepTimerRemaining > 0 && isPlaying) {
      sleepTimerRef.current = setInterval(() => {
        setSleepTimerRemaining(prev => {
          if (prev <= 1) {
            clearInterval(sleepTimerRef.current);
            // STOP AUDIO COMPLETELY ON TIMER ZERO
            if (audioRef.current) {
              audioRef.current.pause();
            }
            setIsPlaying(false);
            setSleepTimerMinutes(null);
            setTimerFinishedNotice(true);
            setTimeout(() => setTimerFinishedNotice(false), 5000);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    }

    return () => {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    };
  }, [sleepTimerRemaining, isPlaying]);

  const [noAudioNotice, setNoAudioNotice] = useState(null);

  // Audio Playback Actions
  const playTrack = (track) => {
    if (!track) return;

    setIsPlayerVisible(true);
    setCurrentTrack(track);

    // Update lastPlayed immediately so "Continue ouvindo" on the dashboard updates right now!
    const trackLastPlayed = {
      trackId: track.id,
      id: track.id,
      title: track.title,
      subtitle: track.subtitle || "Dorme, Precioso",
      coverUrl: track.coverUrl || "/dorme-dorme-precioso-capa.png",
      audioUrl: track.audioUrl || "",
      progressPct: 0,
      audiobookId: track.audiobookId || null,
      chapterId: track.id,
      duration: track.durationFormatted || "00:00",
      currentTimeFormatted: "00:00"
    };
    setLastPlayed(trackLastPlayed);
    const activeUserEmail = userRef.current?.email ? userRef.current.email.toLowerCase() : null;
    if (activeUserEmail) {
      try {
        localStorage.setItem(`ddp_last_played_${activeUserEmail}`, JSON.stringify(trackLastPlayed));
      } catch {}
      idbSet(`ddp_last_played_${activeUserEmail}`, trackLastPlayed);
      saveLastPlayedToDB(activeUserEmail, trackLastPlayed);
    }

    if (!track.audioUrl || track.audioUrl.trim() === '') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setIsPlaying(false);
      setNoAudioNotice(`" ${track.title} " — Áudio pendente de cadastro no painel Admin.`);
      setTimeout(() => setNoAudioNotice(null), 4500);
      return;
    }

    setNoAudioNotice(null);
    if (!audioRef.current) return;

    const srcToPlay = track.audioUrl;
    audioRef.current.src = srcToPlay;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.currentTime = 0;
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Audio play notice:", err);
        setIsPlaying(true);
      });
    }
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => {
      const nextUser = {
        ...(prev || {}),
        ...updatedData
      };
      try {
        localStorage.setItem('ddp_user', JSON.stringify(nextUser));
      } catch {}
      saveProfileToDB(nextUser);
      return nextUser;
    });

    setUsersList(prev => {
      if (!Array.isArray(prev)) return prev;
      return prev.map(u => {
        if (u.email === (user?.email || updatedData.email)) {
          return { ...u, ...updatedData };
        }
        return u;
      });
    });
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsPlayerVisible(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (user?.email && lastPlayed) {
        saveLastPlayedToDB(user.email, lastPlayed);
      }
    } else {
      if (!audioRef.current.src || audioRef.current.src === "") {
        if (currentTrack?.audioUrl) {
          audioRef.current.src = currentTrack.audioUrl;
        } else {
          setNoAudioNotice(`" ${currentTrack?.title || 'Conteúdo'} " — Áudio pendente de cadastro.`);
          setTimeout(() => setNoAudioNotice(null), 4000);
          return;
        }
      }
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(true);
      });
    }
  };

  const seekTo = (seconds) => {
    if (audioRef.current && isFinite(seconds)) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const skipTime = (seconds) => {
    if (audioRef.current) {
      const nextTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  // Speed changer
  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const cyclePlaybackRate = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const nextRate = speeds[nextIndex];
    changePlaybackRate(nextRate);
  };

  // Sleep timer setter
  const setTimer = (mins) => {
    if (mins === null) {
      setSleepTimerMinutes(null);
      setSleepTimerRemaining(null);
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    } else if (mins === 'end') {
      setSleepTimerMinutes('end');
      setSleepTimerRemaining(null);
    } else {
      const m = parseInt(mins, 10);
      if (!isNaN(m) && m > 0) {
        setSleepTimerMinutes(m);
        setSleepTimerRemaining(m * 60);
      }
    }
  };

  const toggleFavorite = (trackId) => {
    const isCurrentlyFav = favorites.includes(trackId);
    const nextState = !isCurrentlyFav;

    setFavorites(prev => {
      if (isCurrentlyFav) {
        return prev.filter(id => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });

    if (user?.email) {
      toggleUserFavoriteInDB(user.email, trackId, nextState);
    }
  };

  const isFavorite = (trackId) => {
    return favorites.includes(trackId);
  };

  const navigateTo = (view, audiobookId = null) => {
    if (audiobookId) {
      setSelectedAudiobookId(audiobookId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetToDefaults = () => {
    setAudiobooks(INITIAL_AUDIOBOOKS);
    setSpecialSong(SPECIAL_SONG);
    setPrayers(PRAYERS_LIST);
    setFavorites(['song-special-1', 'ab1-ch2', 'prayer-1']);
    setUsersList(INITIAL_USERS_LIST);
    setAccessSettings(INITIAL_ACCESS_SETTINGS);
    setSupportSettings(INITIAL_SUPPORT_SETTINGS);
    setMomentsList(INITIAL_MOMENTS_LIST);
    setHomeSettings(INITIAL_HOME_SETTINGS);
    localStorage.removeItem('ddp_audiobooks');
    localStorage.removeItem('ddp_special_song');
    localStorage.removeItem('ddp_prayers');
    localStorage.removeItem('ddp_favorites');
    localStorage.removeItem('ddp_users_list');
    localStorage.removeItem('ddp_access_settings');
    localStorage.removeItem('ddp_support_settings');
    localStorage.removeItem('ddp_moments_list');
    localStorage.removeItem('ddp_home_settings');
    idbRemove('ddp_audiobooks');
    idbRemove('ddp_special_song');
    idbRemove('ddp_prayers');
    idbRemove('ddp_favorites');
    idbRemove('ddp_users_list');
    idbRemove('ddp_access_settings');
    idbRemove('ddp_support_settings');
    idbRemove('ddp_moments_list');
    idbRemove('ddp_home_settings');
  };

  const registerUser = async (data) => {
    const emailNormalized = (data.email || '').trim().toLowerCase();
    const existing = usersList.find(u => u.email.toLowerCase() === emailNormalized);
    if (existing) {
      return { success: false, message: 'Este e-mail já está cadastrado no sistema.' };
    }

    // Register in Supabase Auth
    try {
      if (data.password && data.password.length >= 6) {
        const { error: authErr } = await supabase.auth.signUp({
          email: emailNormalized,
          password: data.password,
          options: {
            data: {
              full_name: data.name || "Mamãe",
              phone: data.phone || "",
              baby_name: data.babyName || "Meu Bebê"
            }
          }
        });
        if (authErr) console.warn("Supabase auth.signUp warning:", authErr);
      }
    } catch (err) {
      console.warn("Supabase auth.signUp error:", err);
    }

    // Verify fresh registrationMode directly from Supabase DB to guarantee accuracy
    let currentRegMode = accessSettings?.registrationMode || 'open';
    try {
      const { data: appSetData } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'access')
        .maybeSingle();
      if (appSetData?.value?.registrationMode) {
        currentRegMode = appSetData.value.registrationMode;
        setAccessSettings(appSetData.value);
        idbSet('ddp_access_settings', appSetData.value);
        try { localStorage.setItem('ddp_access_settings', JSON.stringify(appSetData.value)); } catch {}
      }
    } catch (e) {
      console.warn("Could not fetch fresh access settings from DB:", e);
    }

    const isPending = currentRegMode === 'approval';
    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name || "Mamãe",
      email: emailNormalized,
      phone: data.phone || data.telefone || "",
      babyName: data.babyName || "Meu Bebê",
      role: emailNormalized.includes("admin") ? "admin" : "user",
      status: isPending ? "pending" : "active",
      password: data.password || "123",
      avatar: "marian",
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    const updatedList = [newUser, ...usersList];
    setUsersList(updatedList);
    setLastPlayed(null);
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    if (!isPending) {
      setUser(newUser);
      try {
        localStorage.removeItem('ddp_onboarding_completed');
      } catch {}
      setIsWelcomeModalOpen(true);
      setCurrentView('dashboard');
      return { success: true, pending: false, user: newUser };
    } else {
      // Strictly do NOT log in if pending approval
      return { 
        success: true, 
        pending: true, 
        user: newUser, 
        message: 'Seu cadastro foi realizado e está aguardando a aprovação da administradora.' 
      };
    }
  };

  const loginUser = async (data) => {
    const emailNormalized = (data.email || '').trim().toLowerCase();
    const inputPassword = (data.password || '').trim();

    if (!emailNormalized) {
      return { success: false, message: 'Por favor, informe seu e-mail para acessar.' };
    }

    if (!inputPassword) {
      return { success: false, message: 'Por favor, informe sua senha para acessar.' };
    }

    // 1. Mandatory Supabase Auth credential verification
    let authSucceeded = false;
    let authUserObj = null;

    try {
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: emailNormalized,
        password: inputPassword
      });

      if (!authErr && authData?.user) {
        authSucceeded = true;
        authUserObj = authData.user;
      } else if (authErr) {
        console.info('Supabase auth.signIn response:', authErr.message);
        // Check offline/local fallback only if user was created in local state with specific password
        const localUser = usersList.find(u => u.email.toLowerCase() === emailNormalized);
        if (localUser && localUser.password && localUser.password === inputPassword) {
          authSucceeded = true;
        } else {
          return {
            success: false,
            message: 'Senha incorreta ou e-mail não encontrado. Por favor, verifique seus dados.'
          };
        }
      }
    } catch (err) {
      console.warn('Supabase auth connection error:', err);
      // Fallback only if offline network connection failed
      const localUser = usersList.find(u => u.email.toLowerCase() === emailNormalized);
      if (localUser && localUser.password && localUser.password === inputPassword) {
        authSucceeded = true;
      } else {
        return {
          success: false,
          message: 'Senha incorreta ou falha de conexão. Por favor, tente novamente.'
        };
      }
    }

    if (!authSucceeded) {
      return {
        success: false,
        message: 'Senha incorreta. Por favor, verifique e tente novamente.'
      };
    }

    // 2. Fetch fresh profile and fresh registrationMode from Supabase
    let currentRegMode = accessSettings?.registrationMode || 'open';
    try {
      const { data: appSetData } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'access')
        .maybeSingle();
      if (appSetData?.value?.registrationMode) {
        currentRegMode = appSetData.value.registrationMode;
        setAccessSettings(appSetData.value);
      }
    } catch {}

    let profile = usersList.find(u => u.email.toLowerCase() === emailNormalized);

    try {
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', emailNormalized)
        .maybeSingle();

      if (dbProfile) {
        profile = {
          id: dbProfile.id,
          name: dbProfile.full_name,
          email: dbProfile.email,
          phone: dbProfile.phone || '',
          babyName: dbProfile.baby_name || '',
          role: dbProfile.role || 'user',
          status: dbProfile.status || 'pending',
          avatar: dbProfile.avatar || 'marian',
          createdAt: new Date(dbProfile.created_at).toLocaleDateString('pt-BR')
        };
        setUsersList(prev => [profile, ...prev.filter(u => u.email.toLowerCase() !== emailNormalized)]);
      }
    } catch (e) {
      console.warn('Error fetching profile after login:', e);
    }

    if (!profile) {
      profile = {
        id: authUserObj?.id || `user-${Date.now()}`,
        name: authUserObj?.user_metadata?.full_name || data.name || "Mamãe",
        email: emailNormalized,
        phone: authUserObj?.user_metadata?.phone || data.phone || "",
        babyName: authUserObj?.user_metadata?.baby_name || data.babyName || "Meu Bebê",
        role: emailNormalized.includes("admin") ? "admin" : "user",
        status: currentRegMode === 'approval' ? "pending" : "active",
        avatar: "marian",
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      setUsersList(prev => [profile, ...prev]);
      saveProfileToDB(profile);
    }

    // 3. User access status validation
    if (profile.status === 'pending') {
      return { 
        success: false, 
        reason: 'pending', 
        message: 'Seu cadastro está aguardando a aprovação da administradora. Em breve você receberá a liberação de acesso!' 
      };
    }

    if (profile.status === 'blocked') {
      return { 
        success: false, 
        reason: 'blocked', 
        message: 'Seu acesso foi desativado temporariamente. Entre em contato com o suporte.' 
      };
    }

    // 4. Authenticated successfully
    setUser(profile);
    setCurrentView('dashboard');
    return { success: true, user: profile };
  };

  const logoutUser = async () => {
    setUser(null);
    setLastPlayed(null);
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    try {
      localStorage.removeItem('ddp_user');
      localStorage.removeItem('ddp_last_played');
      await idbRemove('ddp_user');
      await idbRemove('ddp_last_played');
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Logout cleanup warning:", e);
    }
    setCurrentView('login');
  };

  return (
    <AppContext.Provider value={{
      // Theme
      theme,
      toggleTheme,
      activeMode,
      setActiveMode,

      // Data
      audiobooks,
      setAudiobooks,
      specialSong,
      setSpecialSong,
      prayers,
      setPrayers,
      streamingPlatforms,
      setStreamingPlatforms,
      usersList,
      setUsersList,
      accessSettings,
      setAccessSettings,
      supportSettings,
      setSupportSettings,
      momentsList,
      setMomentsList,
      homeSettings,
      setHomeSettings,
      announcements,
      setAnnouncements,
      trackAdMetric,
      favorites,
      user,
      setUser,
      updateUserProfile,
      lastPlayed,
      setLastPlayed,
      noAudioNotice,
      adminStats: {
        ...ADMIN_STATS_DEFAULT,
        totalUsers: usersList.length
      },
      
      // Auth Actions
      registerUser,
      loginUser,
      logoutUser,

      // App Install (PWA)
      isInstallable,
      isAppInstalled,
      isInstallModalOpen,
      setIsInstallModalOpen,
      promptInstallApp,

      // View Navigation
      currentView,
      setCurrentView,
      navigateTo,
      selectedAudiobookId,
      setSelectedAudiobookId,
      isFullPlayerOpen,
      setIsFullPlayerOpen,
      isNursingModalOpen,
      setIsNursingModalOpen,
      isCustomTimerModalOpen,
      setIsCustomTimerModalOpen,
      isBreathingModalOpen,
      setIsBreathingModalOpen,
      isWelcomeModalOpen,
      setIsWelcomeModalOpen,
      completeOnboarding,
      isPlayerVisible,
      setIsPlayerVisible,
      closePlayer,

      // Player Control
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      playbackRate,
      sleepTimerMinutes,
      sleepTimerRemaining,
      timerFinishedNotice,
      playTrack,
      togglePlay,
      seekTo,
      skipTime,
      changePlaybackRate,
      cyclePlaybackRate,
      setTimer,
      playNextChapter,
      playPreviousChapter,
      toggleFavorite,
      isFavorite,
      resetToDefaults,
      formatTime
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
