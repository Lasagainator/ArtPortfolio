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

  // No toggles; exhibits are always visible with masonry tiling

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
        return (
          <div key={exhibit.id} className="exhibit">
            <h2 className="exhibit-title" id={`exhibit-${exhibit.id}`}>{exhibit.title}</h2>
            <div className="masonry" role="group" aria-labelledby={`exhibit-${exhibit.id}`}>
              {exhibit.artworks.map((art, idx) => {
                const stableMedia = art.image || art.youtube || ''
                const key = art.id ? `${art.id}-${stableMedia}` : (stableMedia || `idx-${idx}`)
                return <ArtworkCard key={key} artwork={art} variant="tile" />
              })}
            </div>
          </div>
        )
      })}
    </section>
  )
}
