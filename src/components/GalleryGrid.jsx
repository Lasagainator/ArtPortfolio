import React, { useState, useEffect, useMemo } from 'react'
import ArtworkCard from './ArtworkCard.jsx'
import artworksData from '../data/artworks.json'

// Helper to slugify exhibit titles for stable IDs
const slug = (str) =>
  str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'exhibit'

export default function GalleryGrid({ items = [], exhibits }) {
  const normalizedExhibits = useMemo(() => {
    if (exhibits && exhibits.length) return exhibits
    const source = items.length ? items : artworksData
    if (!source.length) return []
    if (source[0] && Array.isArray(source[0].artworks)) return source

    const groups = {}
    source.forEach(art => {
      const groupTitle = art.exhibit && art.exhibit.trim() ? art.exhibit : 'Miscellaneous'
      if (!groups[groupTitle]) {
        groups[groupTitle] = { id: slug(groupTitle), title: groupTitle, artworks: [] }
      }
      groups[groupTitle].artworks.push(art)
    })
    return Object.values(groups)
  }, [items, exhibits])

  // Track open/closed state per exhibit (default: open)
  const [openMap, setOpenMap] = useState({})
  useEffect(() => {
    setOpenMap(prev => {
      const next = { ...prev }
      // ensure keys for current exhibits
      for (const ex of normalizedExhibits) {
        if (!(ex.id in next)) next[ex.id] = true
      }
      // remove stale keys
      Object.keys(next).forEach(k => {
        if (!normalizedExhibits.some(ex => ex.id === k)) delete next[k]
      })
      return next
    })
  }, [normalizedExhibits])

  const toggle = (id) => setOpenMap(m => ({ ...m, [id]: !m[id] }))

  if (!normalizedExhibits.length) {
    return (
      <section className="gallery-grid empty">
        <p>No artwork found.</p>
      </section>
    )
  }

  return (
    <section className="gallery-grid exhibits">
      {normalizedExhibits.map(exhibit => {
        const isOpen = !openMap[exhibit.id]
        const btnId = `exhibit-${exhibit.id}`
        const panelId = `panel-${exhibit.id}`
        return (
          <div key={exhibit.id} className="exhibit">
            <h2 style={{ margin: 0 }}>
              <button
                id={btnId}
                type="button"
                className="exhibit-toggle"
                aria-expanded={isOpen ? 'true' : 'false'}
                aria-controls={panelId}
                onClick={() => toggle(exhibit.id)}
              >
                <span className="exhibit-title">{exhibit.title}</span>
                <span className="exhibit-arrow" aria-hidden="true">
                  <svg className="arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>
            </h2>

            <div
              id={panelId}
              className="exhibit-panel"
              role="group"
              aria-labelledby={btnId}
              hidden={!isOpen}
            >
              <div className="masonry">
                {exhibit.artworks.map((art, idx) => {
                  const stableMedia = art.image || art.youtube || ''
                  const key = art.id ? `${art.id}-${stableMedia}` : (stableMedia || `idx-${idx}`)
                  return <ArtworkCard key={key} artwork={art} variant="tile" />
                })}
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
