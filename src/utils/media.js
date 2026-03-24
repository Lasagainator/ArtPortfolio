export function getYouTubeId(input) {
  if (!input) return null
  const str = String(input).trim()

  // If it's already an ID (11 chars typical), accept it
  if (!str.includes('/') && !str.includes('http') && str.length >= 10 && str.length <= 20) {
    return str
  }

  try {
    const url = new URL(str)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] || null
    }
    if (host.includes('youtube.com')) {
      // watch?v=ID
      const v = url.searchParams.get('v')
      if (v) return v
      // /embed/ID
      const parts = url.pathname.split('/').filter(Boolean)
      const idxEmbed = parts.indexOf('embed')
      if (idxEmbed >= 0 && parts[idxEmbed + 1]) return parts[idxEmbed + 1]
      // /shorts/ID
      const idxShorts = parts.indexOf('shorts')
      if (idxShorts >= 0 && parts[idxShorts + 1]) return parts[idxShorts + 1]
      // /live/ID
      const idxLive = parts.indexOf('live')
      if (idxLive >= 0 && parts[idxLive + 1]) return parts[idxLive + 1]
    }
  } catch {
    // not a URL, fallthrough
  }
  return null
}

export function isYouTube(input) {
  return !!getYouTubeId(input)
}

export function toYouTubeEmbedUrl(input) {
  const id = getYouTubeId(input)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}