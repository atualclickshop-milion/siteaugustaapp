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
      coverUrl: b.cover_url || '/dorme-dorme-precioso-capa.png',
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
          coverUrl: c.cover_url || b.cover_url || '/dorme-dorme-precioso-capa.png',
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

// 2. Special Songs & Catálogo de Músicas
export async function fetchSongsFromDB() {
  try {
    const { data, error } = await supabase
      .from('special_songs')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return null;

    return data.map(item => ({
      id: item.id,
      title: item.title || 'Canção',
      artist: item.artist || 'Augusta',
      author: item.author || 'Augusta',
      duration: item.duration || '03:45',
      audioUrl: item.audio_url || '',
      coverUrl: item.cover_url || '/dorme-dorme-precioso-capa.png',
      tagline: item.tagline || '',
      description: item.description || '',
      highlight: item.highlight !== false,
      isFutureLaunch: typeof item.is_future_launch === 'boolean'
        ? item.is_future_launch
        : Boolean(item.streaming_links?._meta?.isFutureLaunch),
      enabled: typeof item.enabled === 'boolean'
        ? item.enabled
        : (item.streaming_links?._meta?.enabled !== false),
      displayOrder: item.display_order ?? item.streaming_links?._meta?.displayOrder ?? 0,
      releaseYear: item.release_year || '2026',
      streamingLinks: item.streaming_links || {},
      youtubeUrl: item.youtube_url || '',
      lyrics: Array.isArray(item.lyrics) ? item.lyrics : (typeof item.lyrics === 'string' ? item.lyrics.split('\n') : [])
    }));
  } catch (e) {
    console.warn('Supabase fetchSongs error:', e);
    return null;
  }
}

export async function fetchSpecialSongFromDB() {
  try {
    const all = await fetchSongsFromDB();
    if (all && all.length > 0) {
      const featured = all.find(s => s.highlight) || all[0];
      return featured;
    }
    return null;
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

    if (error || !data) return null;
    if (data.length === 0) return [];

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

    if (error || !data) return null;
    if (data.length === 0) return [];

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

    if (error || !data) return null;
    if (data.length === 0) return [];

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
    const rows = [];
    for (let idx = 0; idx < prayersList.length; idx++) {
      const p = prayersList[idx];
      let finalCover = p.coverUrl || '';
      if (finalCover.startsWith('data:image')) {
        const uploaded = await uploadBase64ImageToStorage(finalCover, 'covers');
        if (uploaded && !uploaded.startsWith('data:')) {
          finalCover = uploaded;
          p.coverUrl = uploaded;
        }
      }
      rows.push({
        id: p.id,
        title: p.title || 'Sem título',
        subtitle: p.subtitle || '',
        duration: p.duration || '04:30',
        audio_url: p.audioUrl || '',
        cover_url: finalCover,
        category: p.category || 'oração',
        icon: p.icon || 'HeartHandshake',
        full_text: p.fullText || '',
        display_order: idx,
        updated_at: new Date().toISOString()
      });
    }
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
    const rows = [];
    for (let idx = 0; idx < momentsList.length; idx++) {
      const m = momentsList[idx];
      let finalCover = m.coverUrl || '';
      if (finalCover.startsWith('data:image')) {
        const uploaded = await uploadBase64ImageToStorage(finalCover, 'covers');
        if (uploaded && !uploaded.startsWith('data:')) {
          finalCover = uploaded;
          m.coverUrl = uploaded;
        }
      }
      rows.push({
        id: m.id,
        title: m.title || 'Momento',
        badge: m.badge || '',
        description: m.description || '',
        action_text: m.actionText || 'Ouvir & Acalmar',
        icon: m.icon || '',
        icon_bg: m.iconBg || '',
        cover_url: finalCover,
        audio_url: m.audioUrl || '',
        text_snippet: m.textSnippet || '',
        duration: m.duration || '04:30',
        enabled: m.enabled !== false,
        display_order: idx
      });
    }
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

      let safeBookCoverUrl = b.coverUrl || '';
      if (safeBookCoverUrl.startsWith('data:image')) {
        const uploaded = await uploadBase64ImageToStorage(safeBookCoverUrl, 'covers');
        if (uploaded && !uploaded.startsWith('data:')) {
          safeBookCoverUrl = uploaded;
          b.coverUrl = uploaded;
        }
      }

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
          const safeAudioUrl = (ch.audioUrl && ch.audioUrl.length > 100000 && ch.audioUrl.startsWith('data:'))
            ? ''
            : (ch.audioUrl || '');

          let safeCoverUrl = ch.coverUrl || '';
          if (safeCoverUrl.startsWith('data:image')) {
            const uploadedCh = await uploadBase64ImageToStorage(safeCoverUrl, 'covers');
            if (uploadedCh && !uploadedCh.startsWith('data:')) {
              safeCoverUrl = uploadedCh;
              ch.coverUrl = uploadedCh;
            }
          }

          const chRow = {
            id: ch.id,
            audiobook_id: b.id,
            chapter_number: ch.number || `${chIdx + 1}`,
            title: ch.title || `Capítulo ${chIdx + 1}`,
            subtitle: ch.subtitle || '',
            duration: ch.duration || '05:00',
            audio_url: safeAudioUrl,
            cover_url: safeCoverUrl || '',
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

export async function saveSongToDB(songObj, displayOrder = 0) {
  if (!songObj || !songObj.id) return;
  try {
    let finalSongCover = songObj.coverUrl || '';
    if (finalSongCover.startsWith('data:image')) {
      const uploaded = await uploadBase64ImageToStorage(finalSongCover, 'covers');
      if (uploaded && !uploaded.startsWith('data:')) {
        finalSongCover = uploaded;
        songObj.coverUrl = uploaded;
      }
    }

    const safeLinks = {
      ...(songObj.streamingLinks || {}),
      _meta: {
        isFutureLaunch: Boolean(songObj.isFutureLaunch),
        enabled: songObj.enabled !== false,
        displayOrder
      }
    };

    const row = {
      id: songObj.id,
      title: songObj.title || 'Canção',
      artist: songObj.artist || 'Augusta',
      author: songObj.author || 'Augusta',
      duration: songObj.duration || '03:45',
      audio_url: (songObj.audioUrl && songObj.audioUrl.length > 100000 && songObj.audioUrl.startsWith('data:')) ? '' : (songObj.audioUrl || ''),
      cover_url: finalSongCover,
      tagline: songObj.tagline || '',
      description: songObj.description || '',
      highlight: Boolean(songObj.highlight),
      is_future_launch: Boolean(songObj.isFutureLaunch),
      enabled: songObj.enabled !== false,
      display_order: displayOrder,
      release_year: songObj.releaseYear || '2026',
      lyrics: Array.isArray(songObj.lyrics) ? songObj.lyrics : (typeof songObj.lyrics === 'string' ? songObj.lyrics.split('\n') : []),
      streaming_links: safeLinks,
      youtube_url: songObj.youtubeUrl || '',
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('special_songs').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase saveSongToDB initial attempt error (retrying fallback):', error);
      delete row.is_future_launch;
      delete row.enabled;
      delete row.display_order;
      await supabase.from('special_songs').upsert(row, { onConflict: 'id' });
    }
  } catch (e) {
    console.warn('Supabase saveSongToDB error:', e);
  }
}

export async function saveSpecialSongToDB(songObj) {
  return saveSongToDB(songObj, 0);
}

export async function saveSongsToDB(songsList) {
  if (!Array.isArray(songsList)) return;
  try {
    for (let idx = 0; idx < songsList.length; idx++) {
      await saveSongToDB(songsList[idx], idx);
    }
  } catch (e) {
    console.warn('Supabase saveSongsToDB error:', e);
  }
}

export async function deleteSongFromDB(songId) {
  if (!songId) return;
  try {
    const { error } = await supabase.from('special_songs').delete().eq('id', songId);
    if (error) console.warn('Supabase deleteSongFromDB error:', error);
  } catch (e) {
    console.warn('Supabase deleteSongFromDB error:', e);
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

    if (!data) return null;
    const cleanData = data.filter(a => a.id !== 'ad-1');
    if (cleanData.length === 0) return [];

    return cleanData.map(a => ({
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
    const filtered = adsList.filter(a => a && a.id !== 'ad-1');
    if (filtered.length === 0) {
      await supabase.from('announcements').delete().neq('id', '___none___');
      return;
    }

    const validIds = filtered.map(a => a.id);
    // Remove any rows from DB that are no longer in validIds
    await supabase.from('announcements').delete().not('id', 'in', `(${validIds.map(id => `"${id}"`).join(',')})`);

    const rows = filtered.map((a, idx) => ({
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

// 14. Image Compression Helper (Converts heavy mobile photos into ~120KB WebP)
export async function compressImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
  if (typeof window === 'undefined' || !file || !file.type || !file.type.startsWith('image/')) return file;
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;

  return new Promise((resolve) => {
    try {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;
        if (width <= maxWidth && height <= maxHeight && file.size < 400 * 1024) {
          resolve(file);
          return;
        }

        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const baseName = (file.name || 'image').replace(/\.[^/.]+$/, "");
          const compressedFile = new File([blob], `${baseName}.webp`, {
            type: 'image/webp',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }, 'image/webp', quality);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
      img.src = objectUrl;
    } catch (e) {
      resolve(file);
    }
  });
}

// 15. Upload Base64 Data URL to Supabase Storage (Safe Cloud Bridge)
export async function uploadBase64ImageToStorage(dataUrl, folder = 'covers') {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  if (!dataUrl.startsWith('data:image')) return dataUrl; // Already a clean URL

  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const mimeType = blob.type || 'image/jpeg';
    const ext = mimeType.split('/')[1] || 'jpg';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `${folder}/${cleanFileName}`;

    let { data, error } = await supabase.storage
      .from('app-media')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: mimeType
      });

    if (error) {
      // Fallback to 'covers' bucket
      const fallbackBucket = folder === 'audios' ? 'audios' : 'covers';
      const { data: fbData, error: fbErr } = await supabase.storage
        .from(fallbackBucket)
        .upload(cleanFileName, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: mimeType
        });
      if (!fbErr && fbData) {
        const { data: pubData } = supabase.storage
          .from(fallbackBucket)
          .getPublicUrl(cleanFileName);
        if (pubData?.publicUrl) return pubData.publicUrl;
      }
    } else if (data) {
      const { data: publicUrlData } = supabase.storage
        .from('app-media')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }
  } catch (err) {
    console.warn('Error uploading base64 to Supabase storage:', err);
  }
  return dataUrl;
}

// 16. Upload Audio & Image to Supabase Storage
export async function uploadMediaFile(file, folder = 'audios') {
  if (!file) return null;
  try {
    let fileToUpload = file;
    if (file.type && file.type.startsWith('image/')) {
      fileToUpload = await compressImageFile(file);
    }

    const fileExt = fileToUpload.name ? fileToUpload.name.split('.').pop() : 'mp3';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${folder}/${cleanFileName}`;

    const mimeMap = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      m4a: 'audio/mp4',
      ogg: 'audio/ogg',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp'
    };
    const mimeType = fileToUpload.type || mimeMap[fileExt.toLowerCase()] || 'application/octet-stream';

    let { data, error } = await supabase.storage
      .from('app-media')
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: true,
        contentType: mimeType
      });

    if (error) {
      console.info('[Supabase Storage] app-media upload notice, trying bucket fallback:', error.message);
      const fallbackBucket = folder === 'audios' ? 'audios' : 'covers';
      const { data: fbData, error: fbErr } = await supabase.storage
        .from(fallbackBucket)
        .upload(cleanFileName, fileToUpload, {
          cacheControl: '3600',
          upsert: true,
          contentType: mimeType
        });
      if (!fbErr && fbData) {
        const { data: pubData } = supabase.storage
          .from(fallbackBucket)
          .getPublicUrl(cleanFileName);
        return pubData?.publicUrl || null;
      }
      return null;
    }

    if (data) {
      const { data: publicUrlData } = supabase.storage
        .from('app-media')
        .getPublicUrl(filePath);

      return publicUrlData?.publicUrl || null;
    }
  } catch (err) {
    console.warn('uploadMediaFile fallback error:', err);
  }
  return null;
}



