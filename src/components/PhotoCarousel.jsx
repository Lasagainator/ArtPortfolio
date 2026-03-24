import React, { useState, useMemo, useCallback } from 'react'

export default function PhotoCarousel({ items = [] }) {
  const photos = useMemo(() => items.filter(i => i && i.image), [items])
  const [index, setIndex] = useState(0)
  const len = photos.length

  // Sleek circular arrow button base style
  const arrowBase = {
    width: 44,
    height: 44,
    borderRadius: 9999,
    border: 'none',
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform .15s ease, opacity .15s ease',
    outline: 'none'
  }

  const prev = useCallback(() => {
    if (!len) return
    setIndex(i => (i - 1 + len) % len)
  }, [len])

  const next = useCallback(() => {
    if (!len) return
    setIndex(i => (i + 1) % len)
  }, [len])

  if (!len) return null

  const current = photos[index]

  // Compute up to 3 previous and 3 next thumbnail indices around the current one (with wrap-around)
  const neighborIdxs = useMemo(() => {
    const maxSide = 3
    const used = new Set([index])
    const prevIdxs = []
    for (let i = 1; i <= maxSide && used.size < len; i++) {
      const idx = (index - i + len) % len
      if (!used.has(idx)) {
        used.add(idx)
        prevIdxs.push(idx)
      }
    }
    const nextIdxs = []
    for (let i = 1; i <= maxSide && used.size < len; i++) {
      const idx = (index + i) % len
      if (!used.has(idx)) {
        used.add(idx)
        nextIdxs.push(idx)
      }
    }
    // Show prev from farthest -> nearest on the left, then current, then next nearest -> farthest
    return { prevIdxs: prevIdxs.reverse(), nextIdxs }
  }, [index, len])

  const renderThumb = (idx, isCurrent = false) => (
    <button
      key={idx}
      type="button"
      onClick={() => !isCurrent && setIndex(idx)}
      aria-current={isCurrent ? 'true' : undefined}
      disabled={isCurrent}
      title={photos[idx].title || 'Artwork image'}
      style={{
        border: isCurrent ? '2px solid var(--primary, #0366d6)' : '1px solid #ccc',
        outline: 'none',
        padding: 0,
        background: 'none',
        cursor: isCurrent ? 'default' : 'pointer',
        opacity: isCurrent ? 1 : 0.85,
      }}
    >
      <img
        src={photos[idx].image}
        alt={photos[idx].title || 'Artwork image thumbnail'}
        loading="lazy"
        style={{ width: 72, height: 56, objectFit: 'cover', display: 'block' }}
      />
    </button>
  )

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          disabled={len <= 1}
          style={{
            ...arrowBase,
            opacity: len <= 1 ? 0.4 : 0.95,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <img
            src={current.image}
            alt={current.title || 'Artwork image'}
            loading="lazy"
            style={{ maxHeight: '75vh', width: 'auto', maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto', objectFit: 'contain' }}
          />
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          disabled={len <= 1}
          style={{
            ...arrowBase,
            opacity: len <= 1 ? 0.4 : 0.95,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div style={{ marginTop: '.5rem', textAlign: 'center', color: 'var(--muted)' }}>
        {index + 1} / {len} {current.title ? `· ${current.title}` : ''}
      </div>

      {/* Subcaption / Credits */}
      {current.subcaption && current.subcaption.length > 0 && (
        <div style={{ marginTop: '.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
          {current.subcaption.map((line, i) => (
            <div key={i} style={{ fontStyle: i === 0 ? 'normal' : 'italic', fontWeight: i === 0 ? 600 : 400 }}>{line}</div>
          ))}
        </div>
      )}

      {/* Thumbnails strip: up to 3 previous and 3 next around the current */}
      <div style={{
        marginTop: '.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '.5rem',
        flexWrap: 'nowrap',
        overflowX: 'auto'
      }}>
        {neighborIdxs.prevIdxs.map(idx => renderThumb(idx, false))}
        {renderThumb(index, true)}
        {neighborIdxs.nextIdxs.map(idx => renderThumb(idx, false))}
      </div>
    </div>
  )
}
