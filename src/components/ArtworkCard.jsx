import React from 'react'
import { useLightbox } from './Lightbox.jsx'
import { useDetailCard } from './DetailCard.jsx'

const VIDEO_EXT_REGEX = /\.(mp4|mov)$/i

// Helper: detect YouTube URL
const isYouTubeUrl = (s) =>
  /^(https?:)?\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(s || '')

// Helper: extract YouTube video ID
function getYouTubeId(url = '') {
  try {
    const u = new URL(url, 'https://dummy.base')
    if (/youtu\.be$/i.test(u.hostname)) return u.pathname.slice(1)
    if (/youtube\.com$/i.test(u.hostname)) {
      if (u.pathname.startsWith('/watch')) return u.searchParams.get('v')
      if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2]
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2]
    }
  } catch {}
  return null
}

// Prefix local asset paths with Vite base (works under /REPO_NAME/)
const withBase = (p) => {
  if (!p) return p
  if (/^https?:\/\//i.test(p)) return p
  return `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
}

export default function ArtworkCard({ artwork, variant = 'card' }) {
  const ctx = useLightbox()
  const detail = useDetailCard()
  const open = ctx && ctx.open

  const raw = artwork.image
  const src = withBase(raw)
  const youTubeUrl = artwork.youtube || (isYouTubeUrl(raw) ? raw : null)
  const youTubeId = youTubeUrl ? getYouTubeId(youTubeUrl) : null
  const isYouTube = Boolean(youTubeId)
  const isVideoFile = typeof raw === 'string' && VIDEO_EXT_REGEX.test(raw || '')

  const mimeType = 'video/mp4'

  const handleOpen = (e) => {
    e.preventDefault()
    // Image -> open detail card; Video/YouTube keep current behavior
    if (isYouTube) return
    if (isVideoFile) {
      if (open) open(artwork)
      return
    }
    if (detail && detail.open) detail.open(artwork)
  }

  const interactiveProps = {
    onClick: handleOpen,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleOpen(e)
      }
    },
    role: 'button',
    tabIndex: 0,
    'aria-label': `View larger: ${artwork.title || 'Artwork'}`
  }

  const embedUrl = isYouTube
    ? `https://www.youtube-nocookie.com/embed/${youTubeId}?rel=0&modestbranding=1`
    : null

  const mediaBlock = (
      <div className="artwork-clickable" {...(!isYouTube ? interactiveProps : {})}>
        {isYouTube ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%',
              background: '#000',
              borderBottom: '1px solid var(--border)'
            }}
          >
            <iframe
              title={artwork.title || 'YouTube video'}
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 0,
                display: 'block'
              }}
            />
          </div>
        ) : isVideoFile ? (
          <video
            className="artwork-media"
            controls
            playsInline
            preload="metadata"
            poster={artwork.poster ? withBase(artwork.poster) : undefined}
          >
            <source src={src} type={mimeType} />
          </video>
        ) : (
          <img
            className="artwork-media"
            src={src}
            alt={artwork.title || 'Artwork'}
            loading="lazy"
          />
        )}
      </div>
  )

  if (variant === 'tile') {
    return (
      <div className="masonry-item">
        <div className="masonry-tile">
          {mediaBlock}
        </div>
      </div>
    )
  }

  return (
    <article className="card col-4 col-12">
      {mediaBlock}
      <div className="card-body">
        <h3 className="card-title">{artwork.title}</h3>
        <div className="card-meta">
          {artwork.year ? artwork.year : ''}
          {artwork.medium ? (artwork.year ? ' • ' : '') + artwork.medium : ''}
          {artwork.size ? ' • ' + artwork.size : ''}
        </div>
      </div>
    </article>
  )
}
