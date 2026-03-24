import React, { useState } from 'react'
import { getCategoryInfo } from '../pages/ProjectPage.jsx'
import { asset } from '../utils/media.js'
import './MediaMosaic.css'

export default function MediaMosaic() {
  const categories = getCategoryInfo()
  const [expanded, setExpanded] = useState(null)
  // Use shared asset() helper from utils
  return (
    <section className="media-mosaic">
      <div className="container">
        <h2 className="mosaic-title">Explore My Work</h2>
        <p className="mosaic-subtitle">Click on any project to explore the full collection</p>
        <div className="mosaic-grid">
          {categories.map((category, index) => {
            const isOpen = expanded === category.slug
            return (
              <div
                key={category.slug}
                className={`mosaic-item mosaic-item-${index % 6}`}
                style={{cursor:'pointer', position:'relative'}}
                onClick={() => setExpanded(isOpen ? null : category.slug)}
                aria-expanded={isOpen}
                tabIndex={0}
                role="button"
              >
                <div className="mosaic-image-wrapper">
                  {category.thumbnail ? (
                    category.thumbnail.toLowerCase().endsWith('.mp4') ? (
                      <video 
                        src={asset(category.thumbnail)} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        preload="auto"
                      />
                    ) : (
                      <img 
                        src={asset(category.thumbnail)} 
                        alt={category.title}
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className="mosaic-placeholder">
                      <span>🎨</span>
                    </div>
                  )}
                  <div className="mosaic-overlay">
                    <h3 className="mosaic-item-title">{category.title}</h3>
                    <span className="mosaic-item-count">
                      {category.items.length} piece{category.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                {isOpen && (
                  <div style={{position:'absolute', left:0, top:'100%', width:'100%', zIndex:10}}>
                    <div style={{background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:12, boxShadow:'0 4px 24px rgba(0,0,0,0.04)', marginTop:8, padding:16}}>
                      <strong>{category.title}</strong>
                      <ul style={{marginTop:8}}>
                        {category.items.map(item => (
                          <li key={item.id}>{item.title || item.image}</li>
                        ))}
                      </ul>
                      <button className="mosaic-close-btn" onClick={e => {e.stopPropagation(); setExpanded(null)}}>Close</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
