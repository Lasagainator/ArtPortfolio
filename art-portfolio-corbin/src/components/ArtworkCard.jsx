import React from 'react'
import { useLightbox } from './Lightbox.jsx'

const VIDEO_EXT_REGEX = /\.(mp4|mov)$/i

export default function ArtworkCard({ artwork }) {
  const ctx = useLightbox()
  const open = ctx && ctx.open
  const src = artwork.image
  const isVideo = typeof src === 'string' && VIDEO_EXT_REGEX.test(src || '')

  const mimeType = 'video/mp4'

  const handleOpen = (e) => {
    e.preventDefault()
    if (!open) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('LightboxProvider missing: wrap app with <LightboxProvider>.')
      }
      return
    }
    if (src) open(artwork)
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

  return (
    <article className="card col-4 col-12">
      <div className="artwork-clickable" {...interactiveProps}>
        {isVideo ? (
          <video
            className="artwork-media"
            controls
            playsInline
            preload="metadata"
            poster={artwork.poster}
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
