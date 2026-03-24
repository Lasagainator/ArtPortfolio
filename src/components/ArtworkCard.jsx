import React from 'react'
import { isYouTube, toYouTubeEmbedUrl } from '../utils/media.js'

// Helper to set correct MIME type for the <source> tag
function guessMime(src = '') {
  const ext = src.split('.').pop()?.toLowerCase()
  if (ext === 'mp4') return 'video/mp4'
  if (ext === 'webm') return 'video/webm'
  if (ext === 'ogg' || ext === 'ogv') return 'video/ogg'
  return undefined
}

export default function ArtworkCard({ artwork }) {
  const videoCandidate = artwork.youtube || artwork.youtubeId || artwork.video
  const hasVideo = Boolean(videoCandidate)
  const isYT = isYouTube(videoCandidate)
  const ytEmbed = isYT ? toYouTubeEmbedUrl(videoCandidate) : null

  return (
    <article className="card col-4 col-12">
      {hasVideo ? (
        isYT ? (
          <iframe
            src={ytEmbed}
            title={artwork.title || 'YouTube video'}
            style={{ width: '100%', aspectRatio: '16 / 9', border: 0, background: '#000' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            controls
            preload="metadata"
            playsInline
            poster={artwork.poster || artwork.image || undefined}
            style={{ width: '100%', display: 'block', background: '#000' }}
          >
            <source src={artwork.video} type={guessMime(artwork.video)} />
            Your browser does not support the video tag.
          </video>
        )
      ) : (
        <img src={artwork.image} alt={artwork.title} loading="lazy" />
      )}
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
