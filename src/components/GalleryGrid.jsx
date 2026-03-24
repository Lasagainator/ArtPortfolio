
import React from 'react'
import ArtworkCard from './ArtworkCard.jsx'

export default function GalleryGrid({ items = [] }) {
  return (
    <section className="gallery-grid">
      <div className="grid">
        {items.map(item => (
          <ArtworkCard key={item.id} artwork={item} />
        ))}
      </div>
    </section>
  )
}
