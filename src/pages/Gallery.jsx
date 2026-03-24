
import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getCategoryInfo } from './ProjectPage.jsx'
import './Gallery.css'
import { isYouTube, toYouTubeEmbedUrl, asset } from '../utils/media.js'

function ProjectGallery({ category, expanded, onClose }) {
  // Inline the main content from ProjectPage, but without router links
  const { title, items, galleryDescription } = category
  const videoItem = items.find(i => i.video || i.youtube || i.youtubeId)
  const photos = items.filter(i => !(i.video || i.youtube || i.youtubeId))
  const hasVideo = Boolean(videoItem)
  const itemsWithDescriptions = items.filter(item => item.description && item.description.trim())
  
  // Get programs from any item that has it
  const programsItem = items.find(item => item.programs)
  const programs = programsItem?.programs
  
  const [lightboxPhoto, setLightboxPhoto] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const openLightbox = (photo, index) => {
    setLightboxPhoto(photo)
    setLightboxIndex(index)
  }
  const closeLightbox = () => setLightboxPhoto(null)
  const goToPrev = (e) => {
    e.stopPropagation()
    const newIndex = lightboxIndex > 0 ? lightboxIndex - 1 : photos.length - 1
    setLightboxIndex(newIndex)
    setLightboxPhoto(photos[newIndex])
  }
  const goToNext = (e) => {
    e.stopPropagation()
    const newIndex = lightboxIndex < photos.length - 1 ? lightboxIndex + 1 : 0
    setLightboxIndex(newIndex)
    setLightboxPhoto(photos[newIndex])
  }
  if (!expanded) return null
  return (
    <div className="project-page-wrapper" style={{marginTop: '2rem', marginBottom: '2rem', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--card-bg)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)'}}>
      <div style={{display:'flex', justifyContent:'flex-end', padding:'1rem'}}>
        <button className="mosaic-close-btn" onClick={onClose} aria-label="Close">✕ Close</button>
      </div>
      <div className="pdf-layout">
        <div className="pdf-media-column">
          {hasVideo && (
            <div className="pdf-video-section">
              <div className="pdf-video-card">
                {videoItem.youtube || videoItem.youtubeId ? (
                  <iframe
                    src={toYouTubeEmbedUrl(videoItem.youtube || videoItem.youtubeId)}
                    title={videoItem.title || 'YouTube video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    poster={(videoItem.poster || videoItem.image) ? asset(videoItem.poster || videoItem.image) : undefined}
                  >
                    <source src={videoItem.video} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              </div>
            </div>
          )}
          {!hasVideo && photos.length > 0 && (
            <div className="pdf-hero-section">
              <div 
                className="pdf-hero-photo"
                onClick={() => openLightbox(photos[0], 0)}
              >
                <img 
                  src={asset(photos[0].image)} 
                  alt={photos[0].title}
                />
              </div>
              {photos[0].title && (
                <div className="pdf-hero-info">
                  <h3 className="pdf-hero-title">{photos[0].title}</h3>
                </div>
              )}
            </div>
          )}
          {(() => {
            const gridPhotos = hasVideo ? photos : photos.slice(1)
            return gridPhotos.length > 0 && (
              <div className="pdf-photo-grid">
                <div className="pdf-photo-column pdf-photo-column-left">
                  {gridPhotos.filter((_, i) => i % 2 === 0).map((photo) => {
                    const originalIndex = photos.indexOf(photo)
                    return (
                      <div 
                        key={photo.id} 
                        className="pdf-photo-item"
                        onClick={() => openLightbox(photo, originalIndex)}
                      >
                        <img 
                          src={asset(photo.image)} 
                          alt={photo.title}
                          loading="lazy"
                        />
                        {photo.title && (
                          <div className="pdf-photo-caption">
                            {photo.title}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="pdf-photo-column pdf-photo-column-right">
                  {gridPhotos.filter((_, i) => i % 2 === 1).map((photo) => {
                    const originalIndex = photos.indexOf(photo)
                    return (
                      <div 
                        key={photo.id} 
                        className="pdf-photo-item"
                        onClick={() => openLightbox(photo, originalIndex)}
                      >
                        <img 
                          src={asset(photo.image)} 
                          alt={photo.title}
                          loading="lazy"
                        />
                        {photo.title && (
                          <div className="pdf-photo-caption">
                            {photo.title}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
        <div className="pdf-text-column">
          <h1 className="pdf-title">{title}</h1>
          <p className="pdf-subtitle">
            {items.length} piece{items.length !== 1 ? 's' : ''}
            {hasVideo && ' • Includes video'}
          </p>
          {galleryDescription && (
            <p className="pdf-description">{galleryDescription}</p>
          )}
          {programs && (
            <p className="pdf-programs">
              <strong>Programs Used:</strong> {programs}
            </p>
          )}
          {itemsWithDescriptions.length > 0 && (
            <div className="pdf-plain-text">
              {itemsWithDescriptions.map((item, index) => (
                <p key={item.id} className="pdf-process-text">
                  <strong>{item.title}</strong> — {item.description}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      {lightboxPhoto && createPortal(
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); closeLightbox() }}>×</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); goToPrev(e) }}>‹</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={asset(lightboxPhoto.image)} alt={lightboxPhoto.title} />
            {lightboxPhoto.title && (
              <p className="lightbox-caption">{lightboxPhoto.title}</p>
            )}
            {lightboxPhoto.subcaption && (
              <div className="lightbox-credits">
                {Array.isArray(lightboxPhoto.subcaption) ? (
                  lightboxPhoto.subcaption.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                ) : (
                  <p>{lightboxPhoto.subcaption}</p>
                )}
              </div>
            )}
            <p className="lightbox-counter">{lightboxIndex + 1} / {photos.length}</p>
          </div>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); goToNext(e) }}>›</button>
        </div>,
        document.body
      )}
    </div>
  )
}

export default function Gallery() {
  const categories = getCategoryInfo()
  const [expanded, setExpanded] = useState(null)
  const expandedRef = useRef(null)

  useEffect(() => {
    if (expanded && expandedRef.current) {
      expandedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [expanded])

  // When a collection is expanded, force the projects section to full
  // opacity so the expanded dropdown doesn't inherit a lowered opacity
  // from the scroll-linked effect. Revert when closed.
  useEffect(() => {
    const projectsSection = document.getElementById('projects')
    if (!projectsSection) return
    if (expanded) {
      projectsSection.style.setProperty('--section-opacity', '1')
      projectsSection.style.setProperty('--section-translate', '0px')
    } else {
      projectsSection.style.removeProperty('--section-opacity')
      projectsSection.style.removeProperty('--section-translate')
    }
    return () => {
      if (projectsSection) {
        projectsSection.style.removeProperty('--section-opacity')
        projectsSection.style.removeProperty('--section-translate')
      }
    }
  }, [expanded])

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <h1>Projects</h1>
        <p className="gallery-subtitle">Browse all collections and projects</p>
      </header>
      <div className="gallery-collections">
        {categories.map((category) => {
          const isOpen = expanded === category.slug
          return (
            <div key={category.slug} className="collection-card">
              <div
                className="collection-thumbnail"
                style={{cursor:'pointer'}}
                onClick={() => setExpanded(isOpen ? null : category.slug)}
                aria-expanded={isOpen}
                tabIndex={0}
                role="button"
              >
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
                  <div className="collection-placeholder">
                    <span>🎨</span>
                  </div>
                )}
                <div className="collection-overlay">
                  <h3 className="collection-overlay-title">{category.title}</h3>
                </div>
              </div>
              <div className="collection-info">
                <h2 className="collection-title">{category.title}</h2>
                <span className="collection-count">
                  {category.items.length} piece{category.items.length !== 1 ? 's' : ''}
                </span>
                <span className="collection-cta">{isOpen ? 'Hide Collection' : 'View Collection'}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full-width expanded project area rendered below the grid */}
      {expanded && (() => {
        const category = categories.find(c => c.slug === expanded)
        if (!category) return null
        return (
          <div ref={expandedRef} style={{marginTop: '2rem'}}>
            <ProjectGallery category={category} expanded={true} onClose={() => setExpanded(null)} />
          </div>
        )
      })()}
    </div>
  )
}
