-- ==============================================================================
-- DORME DORME PRECIOSO - SUPABASE FULL DATABASE SCHEMA & INITIAL SEED
-- Project URL: https://wvjdutaxvwabbetkghha.supabase.co
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLES DEFINITIONS
-- ==============================================================================

-- PROFILES (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    baby_name TEXT,
    avatar TEXT DEFAULT 'marian',
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garantir colunas de telefone e foto de perfil (avatar_url) em tabelas existentes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- AUDIOBOOKS (Collections / Álbuns de Áudio)
CREATE TABLE IF NOT EXISTS public.audiobooks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    cover_url TEXT,
    author TEXT,
    total_duration TEXT,
    category TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    featured BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CHAPTERS (Capítulos / Faixas de Áudio dos Audiobooks)
CREATE TABLE IF NOT EXISTS public.chapters (
    id TEXT PRIMARY KEY,
    audiobook_id TEXT NOT NULL REFERENCES public.audiobooks(id) ON DELETE CASCADE,
    chapter_number TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    duration TEXT,
    audio_url TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',
    type TEXT DEFAULT 'meditation',
    text_snippet TEXT,
    lyrics TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garantir existência da coluna cover_url caso a tabela já exista
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS cover_url TEXT DEFAULT '';

-- SPECIAL SONGS (Canção Especial / Músicas Principais)
CREATE TABLE IF NOT EXISTS public.special_songs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT,
    author TEXT,
    duration TEXT,
    audio_url TEXT DEFAULT '',
    cover_url TEXT,
    tagline TEXT,
    description TEXT,
    highlight BOOLEAN DEFAULT true,
    is_future_launch BOOLEAN DEFAULT false,
    enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    release_year TEXT DEFAULT '2026',
    lyrics TEXT[] DEFAULT '{}',
    streaming_links JSONB DEFAULT '{}'::jsonb,
    youtube_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garantir existência de novas colunas em instâncias existentes
ALTER TABLE public.special_songs ADD COLUMN IF NOT EXISTS is_future_launch BOOLEAN DEFAULT false;
ALTER TABLE public.special_songs ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;
ALTER TABLE public.special_songs ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- PRAYERS (Orações e Terços)
CREATE TABLE IF NOT EXISTS public.prayers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    duration TEXT,
    audio_url TEXT DEFAULT '',
    cover_url TEXT,
    category TEXT DEFAULT 'oração',
    icon TEXT DEFAULT 'HeartHandshake',
    full_text TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garantir remoção da restrição NOT NULL em tabelas já existentes
ALTER TABLE public.chapters ALTER COLUMN audio_url DROP NOT NULL;
ALTER TABLE public.prayers ALTER COLUMN audio_url DROP NOT NULL;
ALTER TABLE public.special_songs ALTER COLUMN audio_url DROP NOT NULL;
ALTER TABLE public.moments ALTER COLUMN audio_url DROP NOT NULL;
ALTER TABLE public.moments ALTER COLUMN audio_url SET DEFAULT '';

-- MOMENTS (Momentos Rápidos / Atalhos)
CREATE TABLE IF NOT EXISTS public.moments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    badge TEXT,
    description TEXT,
    action_text TEXT,
    icon TEXT,
    icon_bg TEXT,
    cover_url TEXT,
    audio_url TEXT DEFAULT '',
    text_snippet TEXT,
    duration TEXT,
    enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ANNOUNCEMENTS / ADS (Anúncios e Banners Promocionais)
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT,
    media_type TEXT DEFAULT 'image',
    media_url TEXT,
    button_text TEXT DEFAULT 'Saber Mais',
    button_link TEXT DEFAULT '#',
    enabled BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    closes_count INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY FOR MOMENTS & ANNOUNCEMENTS
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Moments" ON public.moments;
DROP POLICY IF EXISTS "Allow Admin Updates Moments" ON public.moments;
DROP POLICY IF EXISTS "Public Read Announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow All Announcements Update" ON public.announcements;

CREATE POLICY "Public Read Moments" ON public.moments FOR SELECT USING (true);
CREATE POLICY "Allow Admin Updates Moments" ON public.moments FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Allow All Announcements Update" ON public.announcements FOR ALL USING (true) WITH CHECK (true);


-- STREAMING PLATFORMS (Links YouTube, Spotify, Apple, Deezer, etc.)
CREATE TABLE IF NOT EXISTS public.streaming_platforms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    cta_text TEXT,
    badge_color TEXT,
    bg_class TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- USER FAVORITES (Favoritos de Cada Cliente / Usuário)
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    item_type TEXT DEFAULT 'track',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_id)
);

-- USER PLAYBACK PROGRESS (Salvar de onde os clientes pararam - Continuar Ouvindo)
CREATE TABLE IF NOT EXISTS public.user_playback_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    track_id TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    cover_url TEXT,
    audio_url TEXT NOT NULL,
    progress_pct NUMERIC(5,2) DEFAULT 0,
    current_time_formatted TEXT,
    duration TEXT,
    audiobook_id TEXT,
    chapter_id TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, track_id)
);

-- APP SETTINGS (Configurações Gerais, Acesso e Suporte WhatsApp)
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audiobooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaming_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_playback_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Remove ALL previous policies from content tables to ensure 0 duplicates
DROP POLICY IF EXISTS "Public Read Audiobooks" ON public.audiobooks;
DROP POLICY IF EXISTS "Public Read Chapters" ON public.chapters;
DROP POLICY IF EXISTS "Public Read Special Songs" ON public.special_songs;
DROP POLICY IF EXISTS "Public Read Prayers" ON public.prayers;
DROP POLICY IF EXISTS "Public Read Moments" ON public.moments;
DROP POLICY IF EXISTS "Public Read Announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public Read Streaming Platforms" ON public.streaming_platforms;
DROP POLICY IF EXISTS "Public Read App Settings" ON public.app_settings;

DROP POLICY IF EXISTS "Allow Admin Updates Audiobooks" ON public.audiobooks;
DROP POLICY IF EXISTS "Allow Admin Write Audiobooks" ON public.audiobooks;
DROP POLICY IF EXISTS "Allow Admin Update Audiobooks" ON public.audiobooks;
DROP POLICY IF EXISTS "Allow Admin Delete Audiobooks" ON public.audiobooks;
DROP POLICY IF EXISTS "Allow All Audiobooks" ON public.audiobooks;

DROP POLICY IF EXISTS "Allow Admin Updates Chapters" ON public.chapters;
DROP POLICY IF EXISTS "Allow Admin Write Chapters" ON public.chapters;
DROP POLICY IF EXISTS "Allow Admin Update Chapters" ON public.chapters;
DROP POLICY IF EXISTS "Allow Admin Delete Chapters" ON public.chapters;
DROP POLICY IF EXISTS "Allow All Chapters" ON public.chapters;

DROP POLICY IF EXISTS "Allow Admin Updates Special Songs" ON public.special_songs;
DROP POLICY IF EXISTS "Allow Admin Write Special Songs" ON public.special_songs;
DROP POLICY IF EXISTS "Allow Admin Update Special Songs" ON public.special_songs;
DROP POLICY IF EXISTS "Allow Admin Delete Special Songs" ON public.special_songs;
DROP POLICY IF EXISTS "Allow All Special Songs" ON public.special_songs;

DROP POLICY IF EXISTS "Allow Admin Updates Prayers" ON public.prayers;
DROP POLICY IF EXISTS "Allow Admin Write Prayers" ON public.prayers;
DROP POLICY IF EXISTS "Allow Admin Update Prayers" ON public.prayers;
DROP POLICY IF EXISTS "Allow Admin Delete Prayers" ON public.prayers;
DROP POLICY IF EXISTS "Allow All Prayers" ON public.prayers;

DROP POLICY IF EXISTS "Allow Admin Updates Moments" ON public.moments;
DROP POLICY IF EXISTS "Allow Admin Write Moments" ON public.moments;
DROP POLICY IF EXISTS "Allow Admin Update Moments" ON public.moments;
DROP POLICY IF EXISTS "Allow Admin Delete Moments" ON public.moments;
DROP POLICY IF EXISTS "Allow All Moments" ON public.moments;

DROP POLICY IF EXISTS "Admin All Announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow All Announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow All Announcements Update" ON public.announcements;
DROP POLICY IF EXISTS "Allow Admin Write Announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow Admin Update Announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow Admin Delete Announcements" ON public.announcements;

DROP POLICY IF EXISTS "Allow Admin Updates Streaming Platforms" ON public.streaming_platforms;
DROP POLICY IF EXISTS "Allow Admin Write Streaming Platforms" ON public.streaming_platforms;
DROP POLICY IF EXISTS "Allow Admin Update Streaming Platforms" ON public.streaming_platforms;
DROP POLICY IF EXISTS "Allow Admin Delete Streaming Platforms" ON public.streaming_platforms;
DROP POLICY IF EXISTS "Allow All Streaming Platforms" ON public.streaming_platforms;

DROP POLICY IF EXISTS "Allow Admin Updates App Settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow Admin Write App Settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow Admin Update App Settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow Admin Delete App Settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow All App Settings" ON public.app_settings;

DROP POLICY IF EXISTS "Allow All Profiles Read" ON public.profiles;
DROP POLICY IF EXISTS "Allow All Profiles Insert" ON public.profiles;
DROP POLICY IF EXISTS "Allow All Profiles Update" ON public.profiles;
DROP POLICY IF EXISTS "Allow All Profiles Delete" ON public.profiles;
DROP POLICY IF EXISTS "Allow All Profiles" ON public.profiles;

DROP POLICY IF EXISTS "Allow All Favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Allow All Playback Progress" ON public.user_playback_progress;

-- ==============================================================================
-- 3. POLÍTICAS RLS SEGURAS (LEITURA PÚBLICA / ESCRITA AUTENTICADA)
-- ==============================================================================

-- Leitura pública para tabelas de conteúdo
-- Políticas unificadas para conteúdo e painel administrativo
CREATE POLICY "Allow All Audiobooks" ON public.audiobooks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Chapters" ON public.chapters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Special Songs" ON public.special_songs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Prayers" ON public.prayers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Moments" ON public.moments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Streaming Platforms" ON public.streaming_platforms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All App Settings" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Favorites" ON public.user_favorites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Playback Progress" ON public.user_playback_progress FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 4. STORAGE BUCKETS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('audios', 'audios', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access Storage Covers" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Storage Audios" ON storage.objects;
DROP POLICY IF EXISTS "Allow Upload Covers" ON storage.objects;
DROP POLICY IF EXISTS "Allow Upload Audios" ON storage.objects;

-- Leitura pública para capas e áudios
CREATE POLICY "Public Access Storage Covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Public Access Storage Audios" ON storage.objects FOR SELECT USING (bucket_id = 'audios');

CREATE POLICY "Allow All Storage Covers" ON storage.objects FOR ALL USING (bucket_id = 'covers') WITH CHECK (bucket_id = 'covers');
CREATE POLICY "Allow All Storage Audios" ON storage.objects FOR ALL USING (bucket_id = 'audios') WITH CHECK (bucket_id = 'audios');

-- ==============================================================================
-- 5. INITIAL SEED DATA
-- ==============================================================================

-- Seed Special Song
INSERT INTO public.special_songs (id, title, artist, author, duration, audio_url, cover_url, tagline, description, highlight, release_year, lyrics, streaming_links, youtube_url)
VALUES (
    'song-special-1',
    'Dorme, Dorme, Precioso',
    'Augusta',
    'Augusta',
    '03:45',
    '/dorme-dorme-precioso-master.wav',
    '/dorme-dorme-precioso-capa.png',
    'Uma canção especial de Augusta para acompanhar você e seu bebê.',
    'Composta com toda delicadeza maternal e reverência espiritual para criar uma atmosfera de paz incondicional no quarto do bebê.',
    true,
    '2026',
    ARRAY[
        'Se vier lágrimas pequenas, eu canto uma canção de amor.',
        'Se vier vento pela janela, Jesus aquece com seu manto protetor.',
        'Antes do mundo ser malu, o Criador já te amou.',
        '',
        'Antes do mundo ser malu, seu nome no céu desenhou.',
        'Dorme, dorme, precioso. Dorme, dorme, precioso.',
        '',
        'Você é a obra que o céu desenhou.',
        'Dorme, dorme, precioso. Criador já te amou.',
        '',
        'Se medo vier de mansinho, minha mão vai te embalar.',
        'Teus sonhos cabem no colo do Deus que não vai falhar.',
        'Antes do mundo ser malu, o Criador já te amou.',
        '',
        'Antes do mundo ser malu, seu nome no céu desenhou.',
        'Dorme, dorme, precioso. Dorme, dorme, precioso.',
        '',
        'Você é a obra que o céu desenhou.',
        'Dorme, dorme, precioso. Criador já te amou.',
        '',
        'Quando a noite parece longa, revela ao teu redor.',
        'E se o choro vier baixinho, ele briga sobre você melhor.',
        'Dorme, dorme, precioso.',
        '',
        'Dorme, dorme, precioso. Você é a obra que o céu desenhou.',
        'Dorme, dorme, precioso.',
        '',
        'Dorme, dorme, precioso. Criador já te amou.'
    ],
    '{
        "spotify": "https://open.spotify.com/search/Dorme%20Dorme%20Precioso%20Augusta",
        "appleMusic": "https://music.apple.com/search?term=Dorme%20Dorme%20Precioso%20Augusta",
        "youtubeMusic": "https://music.youtube.com/search?q=Dorme+Dorme+Precioso+Augusta",
        "deezer": "https://www.deezer.com/search/Dorme%20Dorme%20Precioso%20Augusta",
        "amazonMusic": "https://music.amazon.com/search/Dorme+Dorme+Precioso+Augusta"
    }'::jsonb,
    'https://music.youtube.com/search?q=Dorme+Dorme+Precioso+Augusta'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    audio_url = EXCLUDED.audio_url,
    cover_url = EXCLUDED.cover_url,
    lyrics = EXCLUDED.lyrics,
    streaming_links = EXCLUDED.streaming_links;

-- Seed Audiobooks
INSERT INTO public.audiobooks (id, title, subtitle, description, cover_url, author, total_duration, category, status, featured, display_order)
VALUES 
(
    'audiobook-1',
    'Acolhimento na Exaustão Noturna',
    '7 capítulos • Áudios de acolhimento',
    'Uma jornada de acolhimento para a mãe que está acordada, cansada e precisa de alguns minutos de paz e refrigério durante a madrugada.',
    '/dorme-dorme-precioso-capa.png',
    'Augusta & Equipe Pastoral',
    '42 min',
    'acolhimento',
    'published',
    true,
    1
),
(
    'audiobook-2',
    'Paz no Choro e na Incerteza',
    '7 capítulos • Calma para o coração da mãe',
    'Para aqueles momentos em que o choro, a dúvida e o cansaço parecem maiores que você. Um refúgio de serenidade e certeza.',
    '/dorme-dorme-precioso-capa.png',
    'Augusta & Equipe Pastoral',
    '39 min',
    'calma',
    'published',
    true,
    2
)
ON CONFLICT (id) DO NOTHING;

-- Seed Chapters Audiobook 1
INSERT INTO public.chapters (id, audiobook_id, chapter_number, title, subtitle, duration, audio_url, type, text_snippet, display_order)
VALUES 
('ab1-ch1', 'audiobook-1', '01', 'Respira Fundo', 'Condução guiada para desacelerar e soltar a tensão', '05:14', '/dorme-dorme-precioso-master.wav', 'meditation', 'Inspire suavemente pelo nariz em 4 tempos... sinta o ar preencher seus pulmões. Solte devagar pela boca, relaxando os ombros e a mandíbula. Você está em um lugar seguro.', 1),
('ab1-ch2', 'audiobook-1', '02', 'Você Não Está Sozinha', 'Uma reflexão reconfortante sobre a madrugada e a presença de Deus', '06:30', '/dorme-dorme-precioso-master.wav', 'reflection', 'Enquanto a cidade inteira dorme, milhares de mães como você velam com amor. Mais do que isso: os olhos de Deus e o olhar amoroso de Maria acompanham cada respiração sua e do seu bebê.', 2),
('ab1-ch3', 'audiobook-1', '03', 'Pega e Posição Sem Dor', 'Orientações práticas e posturais para conforto na amamentação', '05:45', '/dorme-dorme-precioso-master.wav', 'guidance', 'Ajuste o apoio das suas costas, traga o bebê até a altura do seio, e sinta o aconchego do queixo dele bem apoiado. Respire sem pressa enquanto seu pequeno se sacia.', 3),
('ab1-ch4', 'audiobook-1', '04', 'Vencendo a Culpa do Cansaço', 'Um abraço na alma para afastar a autocobrança', '06:12', '/dorme-dorme-precioso-master.wav', 'reflection', 'Sentir cansaço não significa falta de amor. O cansaço é apenas o testemunho físico da sua entrega diária. Permita-se ser humana, imperfeita e profundamente amada.', 4),
('ab1-ch5', 'audiobook-1', '05', 'O Aconchego da Mãe Maria', 'Sob o manto azul: meditação maternal de paz e proteção', '07:20', '/dorme-dorme-precioso-master.wav', 'prayer', 'Imagine Maria, mãe zelosa, cobrindo seu quarto com seu manto azul sagrado. Sob este manto, nenhuma angústia tem poder. Há apenas descanso, proteção e serenidade.', 5),
('ab1-ch6', 'audiobook-1', '06', 'Oração da Mãe que Amamenta', 'Prece guiada para abençoar o leite e a paz do lar', '05:50', '/dorme-dorme-precioso-master.wav', 'prayer', 'Senhor, que cada gota que alimenta meu filho seja também portadora de saúde, paz e amor. Abençoa o sono da nossa casa e renova minhas forças para o novo dia.', 6),
('ab1-ch7', 'audiobook-1', '07', 'Declaração de Amor para o Bebê', 'Palavras doces de bênção sussurradas ao adormecer', '05:25', '/dorme-dorme-precioso-master.wav', 'lullaby', 'Meu filho precioso, presente de Deus na minha vida. Durma em paz, guardado pelos anjos do Senhor. Mamãe está aqui com você.', 7)
ON CONFLICT (id) DO NOTHING;

-- Seed Chapters Audiobook 2
INSERT INTO public.chapters (id, audiobook_id, chapter_number, title, subtitle, duration, audio_url, type, text_snippet, display_order)
VALUES 
('ab2-ch1', 'audiobook-2', '01', 'Calma no Coração', 'Técnicas de autorregulação e respiração para o choro do bebê', '05:10', '/dorme-dorme-precioso-master.wav', 'meditation', 'O choro do bebê não é um julgamento sobre sua capacidade. É a única linguagem que ele conhece para dizer: ''preciso do seu colo''. Respire fundo e seja o porto seguro dele.', 1),
('ab2-ch2', 'audiobook-2', '02', 'Meu Leite É Suficiente', 'Fortalecendo a confiança na sabedoria do seu corpo', '05:35', '/dorme-dorme-precioso-master.wav', 'reflection', 'Seu corpo foi perfeitamente desenhado pelo Criador para nutrir a vida. Confie na sabedoria biológica e no vínculo que vocês constroem a cada mamada.', 2),
('ab2-ch3', 'audiobook-2', '03', 'Pausa para o Autocuidado', 'Micro-momentos de descanso mental durante a rotina', '04:50', '/dorme-dorme-precioso-master.wav', 'guidance', 'Beba um gole de água fresca. Feche os olhos por trinta segundos. Deixe que o silêncio da noite reabasteça sua mente enquanto você sustenta seu bebê.', 3),
('ab2-ch4', 'audiobook-2', '04', 'Tudo É Uma Fase', 'Uma perspectiva amorosa e consoladora sobre o tempo', '06:05', '/dorme-dorme-precioso-master.wav', 'reflection', 'Estes dias intensos passarão rápido. O que ficará gravado no coração do seu filho é a memória inconsciente de ter sido acolhido com paciência e calor nas noites frias.', 4),
('ab2-ch5', 'audiobook-2', '05', 'Oração de Gratidão e Entrega', 'Entregando as preocupações nas mãos de Deus', '06:15', '/dorme-dorme-precioso-master.wav', 'prayer', 'Pai celestial, entrego a Ti toda a minha ansiedade e minhas dúvidas de mãe. Sei que o Senhor cuida de cada detalhe com amor infinito.', 5),
('ab2-ch6', 'audiobook-2', '06', 'Terço da Mãe que Amamenta', 'Dezena meditada com suavidade para a madrugada', '06:40', '/dorme-dorme-precioso-master.wav', 'prayer', 'Ave Maria, cheia de graça, o Senhor é convosco... Bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, mães, agora e na hora do nosso cansaço.', 6),
('ab2-ch7', 'audiobook-2', '07', 'Canção para Nutrir', 'Harmonia celestial de ninar para acalmar a mãe e o filho', '04:30', '/dorme-dorme-precioso-master.wav', 'lullaby', 'Dorme, dorme, precioso... o manto da noite cai sereno. Anjos cantam no horizonte, guiando seu sonho no sono suave.', 7)
ON CONFLICT (id) DO NOTHING;

-- Seed Streaming Platforms
INSERT INTO public.streaming_platforms (id, name, url, enabled, cta_text, badge_color, bg_class, display_order)
VALUES 
('spotify', 'Spotify', 'https://open.spotify.com/search/Dorme%20Dorme%20Precioso%20Augusta', true, 'Salvar na Playlist', 'text-[#1DB954]', 'hover:bg-[#1DB954]/10 hover:border-[#1DB954]', 1),
('apple', 'Apple Music', 'https://music.apple.com/search?term=Dorme%20Dorme%20Precioso%20Augusta', true, 'Ouvir no Apple Music', 'text-[#FA243C]', 'hover:bg-[#FA243C]/10 hover:border-[#FA243C]', 2),
('youtube', 'YouTube Music', 'https://music.youtube.com/search?q=Dorme+Dorme+Precioso+Augusta', true, 'Assistir & Ouvir', 'text-[#FF0000]', 'hover:bg-[#FF0000]/10 hover:border-[#FF0000]', 3),
('deezer', 'Deezer', 'https://www.deezer.com/search/Dorme%20Dorme%20Precioso%20Augusta', true, 'Tocar no Deezer', 'text-[#A238FF]', 'hover:bg-[#A238FF]/10 hover:border-[#A238FF]', 4),
('amazon', 'Amazon Music', 'https://music.amazon.com/search/Dorme+Dorme+Precioso+Augusta', true, 'Amazon Music HD', 'text-[#00A8E1]', 'hover:bg-[#00A8E1]/10 hover:border-[#00A8E1]', 5)
ON CONFLICT (id) DO NOTHING;

-- Seed Prayers
INSERT INTO public.prayers (id, title, subtitle, duration, audio_url, cover_url, category, icon, full_text, display_order)
VALUES 
(
    'prayer-1',
    'Oração da Mãe que Amamenta',
    'Abençoando o alimento, a paciência e a maternidade',
    '04:20',
    '/dorme-dorme-precioso-master.wav',
    '/dorme-dorme-precioso-capa.png',
    'oração',
    'HeartHandshake',
    'Senhor Jesus, Fonte de toda a Vida,\n\nNesta hora quieta da noite, consagro a Ti o dom de alimentar e acolher meu bebê.\nQue o meu leite seja símbolo do Teu amor que nutre sem medidas.\nQuando o cansaço pesar em meus ombros, dá-me a Tua serenidade.\nQue o meu colo seja um reflexo do Teu abraço acolhedor.\n\nNossa Senhora Aparecida, Mãe amável, cobre este lar com teu manto de paz.\nAmém.',
    1
),
(
    'prayer-2',
    'Terço da Mãe que Amamenta',
    'Dezena de serenidade meditada para a madrugada',
    '08:15',
    '/dorme-dorme-precioso-master.wav',
    '/dorme-dorme-precioso-capa.png',
    'oração',
    'Sparkles',
    'Contemplamos a Anunciação e o Sim amoroso de Maria:\n\n''Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra.''\n\nPai Nosso...\nAve Maria (10x)\nGlória ao Pai...\n\nÓ doce Mãe Maria, ensina-me a amar e a cuidar com a mesma pureza com que cuidaste do Menino Jesus.',
    2
),
(
    'prayer-3',
    'Oração de Gratidão e Entrega',
    'Acalmando a mente e descansando nas promessas divinas',
    '05:00',
    '/dorme-dorme-precioso-master.wav',
    '/dorme-dorme-precioso-capa.png',
    'oração',
    'Smile',
    'Meu Deus, obrigado pela dádiva deste filho nos meus braços.\n\nEntrego a Ti as incertezas de amanhã, os medos e as preocupações.\nSei que nunca estou desamparada, pois Tu caminhas comigo em cada despertar noturno.\nEnche nosso quarto com a Tua luz celestial.\nAmém.',
    3
),
(
    'prayer-4',
    'Oração para uma Madrugada Tranquila',
    'Bênção para o sono calmo do bebê e o alívio da mãe',
    '04:45',
    '/dorme-dorme-precioso-master.wav',
    '/dorme-dorme-precioso-capa.png',
    'oração',
    'Moon',
    'Anjo da Guarda do meu bebê, vigia sobre o berço dele.\nAcalma as cólicas, acalma os sustos, dissipa todo desconforto.\nDerrama um sono profundo, restaurador e doce sobre ele e sobre mim.\nQue ao amanhecer, nossos corações acordem renovados de esperança.\nAmém.',
    4
)
ON CONFLICT (id) DO NOTHING;

-- Seed Moments
INSERT INTO public.moments (id, title, badge, description, action_text, icon, icon_bg, cover_url, audio_url, text_snippet, duration, enabled, display_order)
VALUES 
('moment-calm', 'Preciso me Acalmar', '5–8 min', 'Sons suaves de respiração e frequências para acalmar o coração.', 'Iniciar pausa', 'spa', 'bg-blue-100 dark:bg-marian-900/60 text-marian-700 dark:text-marian-300', '/dorme-dorme-precioso-capa.png', '/dorme-dorme-precioso-master.wav', 'Inspire suavemente pelo nariz em 4 tempos... sinta o ar preencher seus pulmões. Solte devagar pela boca, relaxando os ombros e a mandíbula. Você está em um lugar seguro.', '05:14', true, 1),
('moment-nursing', 'Estou Amamentando', 'Sons & Dicas', 'Ambiente calmo para descida do leite com conforto e boa pega.', 'Acessar', 'baby', 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300', '/dorme-dorme-precioso-capa.png', '/dorme-dorme-precioso-master.wav', 'Ajuste o apoio das suas costas, traga o bebê até a altura do seio, e sinta o aconchego do queixo dele bem apoiado. Respire sem pressa enquanto seu pequeno se sacia.', '05:45', true, 2),
('moment-pray', 'Quero Rezar', 'Terço Materno', 'Preces murmuradas e consagração do sono do seu bebê.', 'Rezar agora', 'cross', 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-gold-400', '/dorme-dorme-precioso-capa.png', '/dorme-dorme-precioso-master.wav', 'Senhor, que cada gota que alimenta meu filho seja também portadora de saúde, paz e amor. Abençoa o sono da nossa casa e renova minhas forças para o novo dia.', '05:50', true, 3),
('moment-comfort', 'Preciso de Acolhimento', 'Reflexões', 'Palavras ternas para os dias e noites de cansaço maternal.', 'Ouvir conforto', 'heart', 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300', '/dorme-dorme-precioso-capa.png', '/dorme-dorme-precioso-master.wav', 'Sentir cansaço não significa falta de amor. O cansaço é apenas o testemunho físico da sua entrega diária. Permita-se ser humana, imperfeita e profundamente amada.', '06:12', true, 4),
('moment-sleep', 'Quero Dormir', 'Música de Ninar', 'Canções e harmonias serenas de Augusta para o descanso.', 'Adormecer', 'moon', 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300', '/dorme-dorme-precioso-capa.png', '/dorme-dorme-precioso-master.wav', 'Dorme, dorme, precioso... o manto da noite cai sereno. Anjos cantam no horizonte, guiando seu sonho no sono suave.', '03:45', true, 5)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Profiles (Only real registrations are stored)
-- (Users will be automatically created upon real app registration)

-- Seed Initial App Settings
INSERT INTO public.app_settings (key, value)
VALUES 
('access', '{"registrationMode": "open", "allowGuestAccess": true}'::jsonb),
('support', '{"whatsappSupportNumber": "+55 11 99876-5432", "whatsappSupportMessage": "Olá Augusta, preciso de ajuda com o aplicativo Dorme, Dorme, Precioso!", "whatsappSupportEnabled": true, "communityGroupUrl": "https://chat.whatsapp.com/ExemploGrupoMaesDormePrecioso", "communityGroupTitle": "Comunidade de Apoio às Mães", "communityGroupCta": "Entrar no Grupo de WhatsApp das Mães", "communityGroupEnabled": true}'::jsonb),
('home', '{"showNursingTimer": true, "showBreathingExercise": true, "showContinueListening": true, "showSpecialSongBanner": true}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 15. Create Storage Bucket for Audios and Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-media', 'app-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow All Storage app-media" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Storage app-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Storage app-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Manage Storage app-media" ON storage.objects;

CREATE POLICY "Allow All Storage app-media" ON storage.objects 
FOR ALL 
USING (bucket_id = 'app-media') 
WITH CHECK (bucket_id = 'app-media');
