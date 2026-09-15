import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wvjdutaxvwabbetkghha.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_aGMj9Ah-m3_WAANDCLxRdQ_8E8KbSuh';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Sync / Fetch Functions for Supabase Database
 */

// 1. Audiobooks & Chapters
export async function fetchAudiobooksFromDB() {
  try {
    const { data: books, error: booksErr } = await supabase
      .from('audiobooks')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (booksErr || !books || books.length === 0) return null;

    const { data: chapters, error: chErr } = await supabase
      .from('chapters')
      .select('*')
      .order('display_order', { ascending: true });

    if (chErr || !chapters) return null;

    return books.map(b => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      description: b.description,
      coverUrl: b.cover_url,
      author: b.author,
      totalDuration: b.total_duration,
      category: b.category,
      status: b.status,
      featured: b.featured,
      chapters: chapters
        .filter(c => c.audiobook_id === b.id)
        .map(c => ({
          id: c.id,
          number: c.chapter_number,
          title: c.title,
          subtitle: c.subtitle,
          duration: c.duration,
          audioUrl: c.audio_url,
          type: c.type,
          textSnippet: c.text_snippet,
          lyrics: c.lyrics
        }))
    }));
  } catch (e) {
    console.warn('Supabase fetchAudiobooks error:', e);
    return null;
  }
}

// 2. Special Song & YouTube / Streaming Links
export async function fetchSpecialSongFromDB() {
  try {
    const { data, error } = await supabase
      .from('special_songs')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      artist: data.artist,
      author: data.author,
      duration: data.duration,
      audioUrl: data.audio_url,
      coverUrl: data.cover_url,
      tagline: data.tagline,
      description: data.description,
      highlight: data.highlight,
      releaseYear: data.release_year,
      streamingLinks: data.streaming_links || {},
      youtubeUrl: data.youtube_url,
      lyrics: data.lyrics || []
    };
  } catch (e) {
    console.warn('Supabase fetchSpecialSong error:', e);
    return null;
  }
}

// 3. Streaming Platforms
export async function fetchStreamingPlatformsFromDB() {
  try {
    const { data, error } = await supabase
      .from('streaming_platforms')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return null;

    return data.map(p => ({
      id: p.id,
      name: p.name,
      url: p.url,
      enabled: p.enabled,
      ctaText: p.cta_text,
      badgeColor: p.badge_color,
      bg: p.bg_class
    }));
  } catch (e) {
    console.warn('Supabase fetchStreamingPlatforms error:', e);
    return null;
  }
}

// 4. Prayers
export async function fetchPrayersFromDB() {
  try {
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return null;

    return data.map(p => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      duration: p.duration,
      audioUrl: p.audio_url,
      coverUrl: p.cover_url,
      category: p.category,
      icon: p.icon,
      fullText: p.full_text
    }));
  } catch (e) {
    console.warn('Supabase fetchPrayers error:', e);
    return null;
  }
}

// 5. Moments
export async function fetchMomentsFromDB() {
  try {
    const { data, error } = await supabase
      .from('moments')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return null;

    return data.map(m => ({
      id: m.id,
      title: m.title,
      badge: m.badge,
      description: m.description,
      actionText: m.action_text,
      icon: m.icon,
      iconBg: m.icon_bg,
      coverUrl: m.cover_url,
      audioUrl: m.audio_url,
      textSnippet: m.text_snippet,
      duration: m.duration,
      enabled: m.enabled
    }));
  } catch (e) {
    console.warn('Supabase fetchMoments error:', e);
    return null;
  }
}

// 6. User Favorites
export async function fetchUserFavoritesFromDB(userEmailOrId) {
  if (!userEmailOrId) return null;
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('item_id')
      .eq('user_id', userEmailOrId);

    if (error || !data) return null;
    return data.map(d => d.item_id);
  } catch (e) {
    console.warn('Supabase fetchUserFavorites error:', e);
    return null;
  }
}

export async function toggleUserFavoriteInDB(userEmailOrId, itemId, isFav) {
  if (!userEmailOrId || !itemId) return;
  try {
    if (isFav) {
      await supabase
        .from('user_favorites')
        .upsert({ user_id: userEmailOrId, item_id: itemId }, { onConflict: 'user_id,item_id' });
    } else {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userEmailOrId)
        .eq('item_id', itemId);
    }
  } catch (e) {
    console.warn('Supabase toggleUserFavorite error:', e);
  }
}

// 7. Playback Progress (Onde o cliente parou)
export async function fetchLastPlayedFromDB(userEmailOrId) {
  if (!userEmailOrId) return null;
  try {
    const { data, error } = await supabase
      .from('user_playback_progress')
      .select('*')
      .eq('user_id', userEmailOrId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      trackId: data.track_id,
      title: data.title,
      subtitle: data.subtitle,
      coverUrl: data.cover_url,
      audioUrl: data.audio_url,
      progressPct: Number(data.progress_pct),
      currentTimeFormatted: data.current_time_formatted,
      duration: data.duration,
      audiobookId: data.audiobook_id,
      chapterId: data.chapter_id
    };
  } catch (e) {
    console.warn('Supabase fetchLastPlayed error:', e);
    return null;
  }
}

export async function saveLastPlayedToDB(userEmailOrId, progressData) {
  if (!userEmailOrId || !progressData?.trackId) return;
  try {
    await supabase
      .from('user_playback_progress')
      .upsert({
        user_id: userEmailOrId,
        track_id: progressData.trackId,
        title: progressData.title || '',
        subtitle: progressData.subtitle || '',
        cover_url: progressData.coverUrl || '',
        audio_url: progressData.audioUrl || '',
        progress_pct: progressData.progressPct || 0,
        current_time_formatted: progressData.currentTimeFormatted || '00:00',
        duration: progressData.duration || '00:00',
        audiobook_id: progressData.audiobookId || null,
        chapter_id: progressData.chapterId || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,track_id' });
  } catch (e) {
    console.warn('Supabase saveLastPlayed error:', e);
  }
}

// 8. Profiles / Users Management
export async function fetchProfilesFromDB() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return null;

    return data.map(p => ({
      id: p.id,
      name: p.full_name,
      email: p.email,
      phone: p.phone || '',
      babyName: p.baby_name,
      role: p.role,
      status: p.status,
      avatar: p.avatar,
      createdAt: new Date(p.created_at).toLocaleDateString('pt-BR')
    }));
  } catch (e) {
    console.warn('Supabase fetchProfiles error:', e);
    return null;
  }
}

export async function saveProfileToDB(userObj) {
  if (!userObj?.email) return;
  try {
    const profileData = {
      email: userObj.email,
      full_name: userObj.name || userObj.fullName || 'Usuário',
      baby_name: userObj.babyName || '',
      role: userObj.role || 'user',
      status: userObj.status || 'active',
      avatar: userObj.avatar || 'marian',
      updated_at: new Date().toISOString()
    };
    if (userObj.phone || userObj.telefone) {
      profileData.phone = userObj.phone || userObj.telefone;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'email' });

    if (error) {
      console.warn('Supabase saveProfile initial attempt error:', error);
      if (profileData.phone) {
        delete profileData.phone;
        await supabase.from('profiles').upsert(profileData, { onConflict: 'email' });
      }
    }
  } catch (e) {
    console.warn('Supabase saveProfile error:', e);
  }
}

export async function deleteProfileFromDB(identifier, emailCandidate = null) {
  if (!identifier && !emailCandidate) return;
  try {
    const isUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    // 1. Delete by email if provided or if identifier is an email address
    const emailToDelete = (typeof identifier === 'string' && identifier.includes('@')) ? identifier : emailCandidate;
    if (emailToDelete) {
      const { error: emailErr } = await supabase.from('profiles').delete().eq('email', emailToDelete);
      if (emailErr) console.warn('Supabase deleteProfile by email error:', emailErr);
    }

    // 2. Delete by id if identifier is a valid UUID
    if (isUuid(identifier)) {
      const { error: idErr } = await supabase.from('profiles').delete().eq('id', identifier);
      if (idErr) console.warn('Supabase deleteProfile by id error:', idErr);
    }
  } catch (e) {
    console.warn('Supabase deleteProfile error:', e);
  }
}

// 9. App Settings (Access, Support, Home)
export async function fetchAppSettingsFromDB() {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*');

    if (error || !data) return null;

    const settingsMap = {};
    data.forEach(item => {
      settingsMap[item.key] = item.value;
    });
    return settingsMap;
  } catch (e) {
    console.warn('Supabase fetchAppSettings error:', e);
    return null;
  }
}

export async function saveAppSettingToDB(key, value) {
  try {
    await supabase
      .from('app_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
  } catch (e) {
    console.warn(`Supabase saveAppSetting (${key}) error:`, e);
  }
}

// 11. Admin Save/Sync Functions to DB (Audiobooks, Prayers, Songs, Moments)
export async function savePrayersToDB(prayersList) {
  if (!Array.isArray(prayersList)) return;
  try {
    const rows = prayersList.map((p, idx) => ({
      id: p.id,
      title: p.title || 'Sem título',
      subtitle: p.subtitle || '',
      duration: p.duration || '04:30',
      audio_url: p.audioUrl || '',
      cover_url: p.coverUrl || '',
      category: p.category || 'oração',
      icon: p.icon || 'HeartHandshake',
      full_text: p.fullText || '',
      display_order: idx,
      updated_at: new Date().toISOString()
    }));
    const { error } = await supabase
      .from('prayers')
      .upsert(rows, { onConflict: 'id' });
    if (error) console.warn('Supabase savePrayers error:', error);
  } catch (e) {
    console.warn('Supabase savePrayers error:', e);
  }
}

export async function saveMomentsToDB(momentsList) {
  if (!Array.isArray(momentsList)) return;
  try {
    const rows = momentsList.map((m, idx) => ({
      id: m.id,
      title: m.title || 'Momento',
      badge: m.badge || '',
      description: m.description || '',
      action_text: m.actionText || 'Ouvir & Acalmar',
      icon: m.icon || '',
      icon_bg: m.iconBg || '',
      cover_url: m.coverUrl || '',
      audio_url: m.audioUrl || '',
      text_snippet: m.textSnippet || '',
      duration: m.duration || '04:30',
      enabled: m.enabled !== false,
      display_order: idx
    }));
    const { error } = await supabase
      .from('moments')
      .upsert(rows, { onConflict: 'id' });
    if (error) console.warn('Supabase saveMoments error:', error);
  } catch (e) {
    console.warn('Supabase saveMoments error:', e);
  }
}

export async function deleteMomentFromDB(id) {
  if (!id) return;
  try {
    const { error } = await supabase
      .from('moments')
      .delete()
      .eq('id', id);
    if (error) console.warn('Supabase deleteMoment error:', error);
  } catch (e) {
    console.warn('Supabase deleteMoment error:', e);
  }
}

export async function saveAudiobooksToDB(audiobooksList) {
  if (!Array.isArray(audiobooksList)) return;
  try {
    for (let idx = 0; idx < audiobooksList.length; idx++) {
      const b = audiobooksList[idx];
      const safeBookCoverUrl = (b.coverUrl && b.coverUrl.length > 100000 && b.coverUrl.startsWith('data:'))
        ? '' // Do not sync giant local Base64 images to DB string columns
        : (b.coverUrl || '');

      const bookRow = {
        id: b.id,
        title: b.title || 'Audiobook',
        subtitle: b.subtitle || '',
        description: b.description || '',
        cover_url: safeBookCoverUrl,
        author: b.author || 'Augusta',
        total_duration: b.totalDuration || '30 min',
        category: b.category || 'acolhimento',
        status: b.status || 'published',
        featured: b.featured !== false,
        display_order: idx,
        updated_at: new Date().toISOString()
      };
      const { error: bookErr } = await supabase.from('audiobooks').upsert(bookRow, { onConflict: 'id' });
      if (bookErr) console.warn('Supabase saveAudiobooks book error:', bookErr);

      if (Array.isArray(b.chapters) && b.chapters.length > 0) {
        for (let chIdx = 0; chIdx < b.chapters.length; chIdx++) {
          const ch = b.chapters[chIdx];
          // Truncate huge Base64 audio strings if present to avoid 57014 statement timeout
          const safeAudioUrl = (ch.audioUrl && ch.audioUrl.length > 100000 && ch.audioUrl.startsWith('data:'))
            ? '' // Do not sync giant local Base64 audio to DB string columns
            : (ch.audioUrl || '');

          const safeCoverUrl = (ch.coverUrl && ch.coverUrl.length > 100000 && ch.coverUrl.startsWith('data:'))
            ? ''
            : (ch.coverUrl || '');

          const chRow = {
            id: ch.id,
            audiobook_id: b.id,
            chapter_number: ch.number || `${chIdx + 1}`,
            title: ch.title || `Capítulo ${chIdx + 1}`,
            subtitle: ch.subtitle || '',
            duration: ch.duration || '05:00',
            audio_url: safeAudioUrl,
            type: ch.type || 'meditation',
            text_snippet: ch.textSnippet || '',
            lyrics: Array.isArray(ch.lyrics) ? ch.lyrics.join('\n') : (ch.lyrics || ''),
            display_order: chIdx,
            updated_at: new Date().toISOString()
          };
          try {
            const { error: chErr } = await supabase.from('chapters').upsert(chRow, { onConflict: 'id' });
            if (chErr && chErr.code !== '57014') {
              console.warn('Supabase saveAudiobooks chapter item error:', chErr);
            }
          } catch (err) {
            // Ignore timeout errors silently
          }
        }
      }
    }
  } catch (e) {
    console.warn('Supabase saveAudiobooks error:', e);
  }
}

export async function saveSpecialSongToDB(songObj) {
  if (!songObj || !songObj.id) return;
  try {
    const row = {
      id: songObj.id,
      title: songObj.title || 'Dorme, Dorme, Precioso',
      artist: songObj.artist || 'Augusta',
      author: songObj.author || 'Augusta',
      duration: songObj.duration || '03:45',
      audio_url: (songObj.audioUrl && songObj.audioUrl.length > 100000 && songObj.audioUrl.startsWith('data:')) ? '' : (songObj.audioUrl || ''),
      cover_url: (songObj.coverUrl && songObj.coverUrl.length > 100000 && songObj.coverUrl.startsWith('data:')) ? '' : (songObj.coverUrl || ''),
      tagline: songObj.tagline || '',
      description: songObj.description || '',
      highlight: songObj.highlight !== false,
      release_year: songObj.releaseYear || '2026',
      lyrics: Array.isArray(songObj.lyrics) ? songObj.lyrics : (typeof songObj.lyrics === 'string' ? songObj.lyrics.split('\n') : []),
      streaming_links: songObj.streamingLinks || {},
      youtube_url: songObj.youtubeUrl || '',
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('special_songs').upsert(row, { onConflict: 'id' });
    if (error) console.warn('Supabase saveSpecialSong error:', error);
  } catch (e) {
    console.warn('Supabase saveSpecialSong error:', e);
  }
}

export async function saveStreamingPlatformsToDB(platformsList) {
  if (!Array.isArray(platformsList)) return;
  try {
    const rows = platformsList.map((p, idx) => ({
      id: p.id,
      name: p.name,
      url: p.url,
      enabled: p.enabled !== false,
      cta_text: p.ctaText || 'Ouvir',
      badge_color: p.badgeColor || 'bg-amber-500',
      bg_class: p.bg || '',
      display_order: idx,
      updated_at: new Date().toISOString()
    }));
    await supabase.from('streaming_platforms').upsert(rows, { onConflict: 'id' });
  } catch (e) {
    console.warn('Supabase saveStreamingPlatforms error:', e);
  }
}

// 12. Real Admin Statistics from Database
export async function fetchAdminRealStats() {
  try {
    const [profilesRes, favsRes, playsRes] = await Promise.all([
      supabase.from('profiles').select('id, status', { count: 'exact' }),
      supabase.from('user_favorites').select('id', { count: 'exact' }),
      supabase.from('user_playback_progress').select('id', { count: 'exact' })
    ]);

    const totalUsers = profilesRes.count ?? profilesRes.data?.length ?? 0;
    const activeUsers = profilesRes.data?.filter(p => p.status === 'active')?.length ?? totalUsers;
    const totalFavorites = favsRes.count ?? favsRes.data?.length ?? 0;
    const totalPlays = playsRes.count ?? playsRes.data?.length ?? 0;

    return {
      totalUsers,
      activeUsers,
      totalFavorites,
      totalPlays,
      activeNow: Math.max(1, activeUsers)
    };
  } catch (e) {
    console.warn('Supabase fetchAdminRealStats error:', e);
    return null;
  }
}

// 13. Announcements / Ads Management & Metrics
export async function fetchAnnouncementsFromDB() {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        // Table does not exist in DB yet
        return null;
      }
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map(a => ({
      id: a.id,
      title: a.title,
      text: a.text || '',
      mediaType: a.media_type || 'image',
      mediaUrl: a.media_url || '',
      buttonText: a.button_text || 'Saber Mais',
      buttonLink: a.button_link || '#',
      enabled: a.enabled !== false,
      viewsCount: a.views_count || 0,
      clicksCount: a.clicks_count || 0,
      closesCount: a.closes_count || 0,
      displayOrder: a.display_order || 0
    }));
  } catch (e) {
    return null;
  }
}

export async function saveAnnouncementsToDB(adsList) {
  if (!Array.isArray(adsList)) return;
  try {
    const rows = adsList.map((a, idx) => ({
      id: a.id,
      title: a.title || 'Anúncio',
      text: a.text || '',
      media_type: a.mediaType || 'image',
      media_url: (a.mediaUrl && a.mediaUrl.length > 100000 && a.mediaUrl.startsWith('data:')) ? '' : (a.mediaUrl || ''),
      button_text: a.buttonText || 'Saber Mais',
      button_link: a.buttonLink || '#',
      enabled: a.enabled !== false,
      views_count: a.viewsCount || 0,
      clicks_count: a.clicksCount || 0,
      closes_count: a.closesCount || 0,
      display_order: idx,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('announcements')
      .upsert(rows, { onConflict: 'id' });

    if (error && error.code !== 'PGRST205' && !error.message?.includes('schema cache')) {
      console.warn('Supabase saveAnnouncements error:', error);
    }
  } catch (e) {
    // Ignore schema missing error
  }
}

export async function deleteAnnouncementFromDB(id) {
  if (!id) return;
  try {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    if (error) console.warn('Supabase deleteAnnouncement error:', error);
  } catch (e) {
    console.warn('Supabase deleteAnnouncement error:', e);
  }
}

export async function incrementAdMetricInDB(adId, metricType) {
  if (!adId || !metricType) return;
  try {
    const column = metricType === 'click' ? 'clicks_count' : metricType === 'close' ? 'closes_count' : 'views_count';
    const { data, error } = await supabase.from('announcements').select(column).eq('id', adId).single();
    if (!error && data) {
      const currentVal = data[column] || 0;
      await supabase.from('announcements').update({
        [column]: currentVal + 1,
        updated_at: new Date().toISOString()
      }).eq('id', adId);
    }
  } catch (e) {
    // Ignore error
  }
}

// 14. Upload Audio & Image to Supabase Storage
export async function uploadMediaFile(file, folder = 'audios') {
  if (!file) return null;
  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'mp3';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${folder}/${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('app-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.info('[Supabase Storage] Bucket "app-media" não encontrado. Arquivo mantido e salvo localmente com segurança no IndexedDB.');
      return null;
    }

    if (data) {
      const { data: publicUrlData } = supabase.storage
        .from('app-media')
        .getPublicUrl(filePath);

      return publicUrlData?.publicUrl || null;
    }
  } catch (err) {
    // Local IndexedDB fallback
  }
  return null;
}


