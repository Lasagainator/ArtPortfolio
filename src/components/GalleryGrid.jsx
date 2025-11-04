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

  const [openMap, setOpenMap] = useState({})

  useEffect(() => {
    const next = {}
    // Start all exhibits closed
    normalizedExhibits.forEach(ex => { next[ex.id] = false })
    setOpenMap(next)
  }, [normalizedExhibits])

  const toggleExhibit = (id) => {
    setOpenMap(m => ({ ...m, [id]: !m[id] }))
  }

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
        const isOpen = openMap[exhibit.id]
        return (
          <div key={exhibit.id} className="exhibit">
            <button
              type="button"
              className={`exhibit-toggle heading-toggle ${isOpen ? 'open' : ''}`}
              aria-expanded={isOpen}
              aria-controls={`exhibit-panel-${exhibit.id}`}
              onClick={() => toggleExhibit(exhibit.id)}
            >
              <span className="exhibit-title">{exhibit.title}</span>
              <span className="exhibit-arrow" aria-hidden="true">
                <svg
                  className="arrow-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  focusable="false"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div
              id={`exhibit-panel-${exhibit.id}`}
              role="region"
              aria-label={exhibit.title}
              hidden={!isOpen}
              className="exhibit-panel"
            >
              <div className="grid">
                {exhibit.artworks.map((art, idx) => {
                  const stableMedia = art.image || art.youtube || ''
                  const key = art.id ? `${art.id}-${stableMedia}` : (stableMedia || `idx-${idx}`)
                  return <ArtworkCard key={key} artwork={art} />
                })}
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
