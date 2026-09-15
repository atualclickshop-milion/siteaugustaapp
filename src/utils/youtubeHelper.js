export function getYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

export function isYouTubeUrl(url) {
  return !!getYouTubeId(url);
}

export function getYouTubeEmbedUrl(url, autoplay = 1) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=${autoplay}&rel=0&modestbranding=1&playsinline=1`;
}
