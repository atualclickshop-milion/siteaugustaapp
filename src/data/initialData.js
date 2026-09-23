export const INITIAL_AUDIOBOOKS = [];

export const INITIAL_STREAMING_PLATFORMS = [
  {
    id: "spotify",
    name: "Spotify",
    url: "https://open.spotify.com/search/Dorme%20Dorme%20Precioso%20Augusta",
    enabled: true,
    ctaText: "Salvar na Playlist",
    badgeColor: "text-[#1DB954]",
    bg: "hover:bg-[#1DB954]/10 hover:border-[#1DB954]"
  },
  {
    id: "apple",
    name: "Apple Music",
    url: "https://music.apple.com/search?term=Dorme%20Dorme%20Precioso%20Augusta",
    enabled: true,
    ctaText: "Ouvir no Apple Music",
    badgeColor: "text-[#FA243C]",
    bg: "hover:bg-[#FA243C]/10 hover:border-[#FA243C]"
  },
  {
    id: "youtube",
    name: "YouTube Music",
    url: "https://music.youtube.com/search?q=Dorme+Dorme+Precioso+Augusta",
    enabled: true,
    ctaText: "Assistir & Ouvir",
    badgeColor: "text-[#FF0000]",
    bg: "hover:bg-[#FF0000]/10 hover:border-[#FF0000]"
  },
  {
    id: "deezer",
    name: "Deezer",
    url: "https://www.deezer.com/search/Dorme%20Dorme%20Precioso%20Augusta",
    enabled: true,
    ctaText: "Tocar no Deezer",
    badgeColor: "text-[#A238FF]",
    bg: "hover:bg-[#A238FF]/10 hover:border-[#A238FF]"
  },
  {
    id: "amazon",
    name: "Amazon Music",
    url: "https://music.amazon.com/search/Dorme+Dorme+Precioso+Augusta",
    enabled: true,
    ctaText: "Amazon Music HD",
    badgeColor: "text-[#00A8E1]",
    bg: "hover:bg-[#00A8E1]/10 hover:border-[#00A8E1]"
  }
];

export const SPECIAL_SONG = {
  id: "song-special-1",
  title: "Dorme, Dorme, Precioso",
  artist: "Augusta",
  author: "Augusta",
  duration: "03:45",
  audioUrl: "/dorme-dorme-precioso-master.wav",
  coverUrl: "/dorme-dorme-precioso-capa.png",
  tagline: "Uma canção especial de Augusta para acompanhar você e seu bebê.",
  description: "Composta com toda delicadeza maternal e reverência espiritual para criar uma atmosfera de paz incondicional no quarto do bebê.",
  highlight: true,
  releaseYear: "2026",
  streamingLinks: {
    spotify: "https://open.spotify.com/search/Dorme%20Dorme%20Precioso%20Augusta",
    appleMusic: "https://music.apple.com/search?term=Dorme%20Dorme%20Precioso%20Augusta",
    youtubeMusic: "https://music.youtube.com/search?q=Dorme+Dorme+Precioso+Augusta",
    deezer: "https://www.deezer.com/search/Dorme%20Dorme%20Precioso%20Augusta",
    amazonMusic: "https://music.amazon.com/search/Dorme+Dorme+Precioso+Augusta"
  },
  lyrics: [
    "Se vier lágrimas pequenas, eu canto uma canção de amor.",
    "Se vier vento pela janela, Jesus aquece com seu manto protetor.",
    "Antes do mundo ser malu, o Criador já te amou.",
    "",
    "Antes do mundo ser malu, seu nome no céu desenhou.",
    "Dorme, dorme, precioso. Dorme, dorme, precioso.",
    "",
    "Você é a obra que o céu desenhou.",
    "Dorme, dorme, precioso. Criador já te amou.",
    "",
    "Se medo vier de mansinho, minha mão vai te embalar.",
    "Teus sonhos cabem no colo do Deus que não vai falhar.",
    "Antes do mundo ser malu, o Criador já te amou.",
    "",
    "Antes do mundo ser malu, seu nome no céu desenhou.",
    "Dorme, dorme, precioso. Dorme, dorme, precioso.",
    "",
    "Você é a obra que o céu desenhou.",
    "Dorme, dorme, precioso. Criador já te amou.",
    "",
    "Quando a noite parece longa, revela ao teu redor.",
    "E se o choro vier baixinho, ele briga sobre você melhor.",
    "Dorme, dorme, precioso.",
    "",
    "Dorme, dorme, precioso. Você é a obra que o céu desenhou.",
    "Dorme, dorme, precioso.",
    "",
    "Dorme, dorme, precioso. Criador já te amou."
  ],
  highlight: true,
  isFutureLaunch: true,
  enabled: true
};

export const INITIAL_SONGS_LIST = [
  SPECIAL_SONG
];

export const PRAYERS_LIST = [];

export const ADMIN_STATS_DEFAULT = {
  totalUsers: 1420,
  activeNow: 89,
  totalPlays: 18450,
  totalFavorites: 3240,
  weeklyGrowth: "+18.4%",
  popularAudios: [
    { title: "Dorme, Dorme, Precioso (Canção)", artist: "Augusta", plays: 8420, duration: "03:45" },
    { title: "01 — Respira Fundo", artist: "Augusta & Pastoral", plays: 5120, duration: "05:14" },
    { title: "02 — Você Não Está Sozinha", artist: "Augusta & Pastoral", plays: 4890, duration: "06:30" },
    { title: "Oração da Mãe que Amamenta", artist: "Pastoral", plays: 3950, duration: "04:20" },
  ]
};

export const INITIAL_USERS_LIST = [];

export const INITIAL_ACCESS_SETTINGS = {
  registrationMode: "open", // "open" (Acesso Livre) or "approval" (Por Aprovação da Admin)
  allowGuestAccess: true
};

export const INITIAL_SUPPORT_SETTINGS = {
  whatsappSupportNumber: "+55 11 99876-5432",
  whatsappSupportMessage: "Olá Augusta, preciso de ajuda com o aplicativo Dorme, Dorme, Precioso!",
  whatsappSupportEnabled: true,
  communityGroupUrl: "https://chat.whatsapp.com/ExemploGrupoMaesDormePrecioso",
  communityGroupTitle: "Comunidade de Apoio às Mães",
  communityGroupCta: "Entrar no Grupo de WhatsApp das Mães",
  communityGroupEnabled: true
};

export const INITIAL_MOMENTS_LIST = [];

export const INITIAL_HOME_SETTINGS = {
  showNursingTimer: true,
  showBreathingExercise: true,
  showContinueListening: true,
  showSpecialSongBanner: true,
  musicTabEnabled: true
};

export const INITIAL_ANNOUNCEMENTS = [];

