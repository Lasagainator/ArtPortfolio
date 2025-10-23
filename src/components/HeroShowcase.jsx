import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import artworks from '../data/artworks.json'

function shuffle(arr) {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const VIDEO_EXT_REGEX = /\.(mp4|webm|mov|m4v|ogg)$/i

export default function HeroShowcase() {
  const selection = useMemo(() => {
    const imagesOnly = artworks.filter(a => {
      if (typeof a.image !== 'string') return false
      const p = a.image.trim()
      if (!p) return false
      return !VIDEO_EXT_REGEX.test(p) // exclude videos
    })
    return shuffle(imagesOnly).slice(0, 20)
  }, [])

  const loopList = [...selection, ...selection]

  return (
    <section className="hero-showcase">
      <div className="showcase-overlay">
        <h1 className="showcase-title">Art Portfolio</h1>
        <p className="showcase-tagline">Exploring mediums & ideas.</p>
        <Link to="/gallery" className="btn showcase-btn">View Gallery</Link>
      </div>
      <div className="showcase-scroller" aria-hidden="true">
        <div className="showcase-track">
          {loopList.map((art, i) => (
            <figure key={(art.id || 'art') + '-' + i} className="showcase-item">
              <img
                className="showcase-media"
                src={art.image}
                alt={art.title || 'Artwork'}
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}