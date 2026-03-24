import React, { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import artworks from '../data/artworks.json'
import { isYouTube, toYouTubeEmbedUrl } from '../utils/media.js'
import './ProjectPage.css'

// Convert category to URL-friendly slug
export function categoryToSlug(category) {
  return category
    .toLowerCase()
    .replace(/[""]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Get unique categories from artworks
export function getCategories() {
  const categories = new Set()
  artworks.forEach(item => {
    if (item.category) {
      categories.add(item.category)
    }
  })
  return Array.from(categories).sort()
}

// Get category info with slug, thumbnail, and gallery description
export function getCategoryInfo() {
  const categoryMap = new Map()
  
  const customThumbnails = {
    'Renegade Rizzlers Bowling': 'thumbnails/CBlackburn_RRBowling_Jerseys_Mockups.jpg',
    'LiminaTraveler': 'thumbnails/CBlackburn_LiminaTraveler_CD_Mockup.jpg',
    'The Haze': 'thumbnails/CBlackburn_TheHaze_Mockup.jpg',
    'Nintendo Through Time': 'thumbnails/CBlackburn_ThroughTime_Logo.jpg',
  }

  artworks.forEach(item => {
    if (item.category) {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, {
          title: item.category,
          slug: categoryToSlug(item.category),
          items: [],
          thumbnail: null,
          galleryDescription: null
        })
      }
      const cat = categoryMap.get(item.category)
      cat.items.push(item)
      // Use custom thumbnail if available
      if (customThumbnails[item.category]) {
        cat.thumbnail = customThumbnails[item.category]
      } else if (item.thumbnail) {
        cat.thumbnail = item.thumbnail
      } else if (!cat.thumbnail && item.image) {
        cat.thumbnail = item.image
      }
      // Use galleryDescription from any item that has it
      if (!cat.galleryDescription && item.galleryDescription) {
        cat.galleryDescription = item.galleryDescription
      }
    }
  })

  return Array.from(categoryMap.values()).filter(cat => customThumbnails[cat.title]).sort((a, b) => a.title.localeCompare(b.title))
}

export default function ProjectPage() {
  const { slug } = useParams()
  
  const projectData = useMemo(() => {
    const categories = getCategoryInfo()
    return categories.find(cat => cat.slug === slug)
  }, [slug])
  
  if (!projectData) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <a href="#projects" className="back-link">← Back to Projects</a>
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist.</p>
      </div>
    )
  }
  
  const { title, items, galleryDescription } = projectData
  const videoItem = items.find(i => i.video || i.youtube || i.youtubeId)
  const photos = items.filter(i => !(i.video || i.youtube || i.youtubeId))
  const hasVideo = Boolean(videoItem)
  
  // Get programs from any item that has it - check all items in the category
  const programsItem = items.find(item => item.programs)
  const programs = programsItem?.programs
  
  // Get items with descriptions for the text column
  const itemsWithDescriptions = items.filter(item => item.description && item.description.trim())
  
  // Lightbox state
  const [lightboxPhoto, setLightboxPhoto] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  
  const openLightbox = (photo, index) => {
    setLightboxPhoto(photo)
    setLightboxIndex(index)
  }
  
  const closeLightbox = () => {
    setLightboxPhoto(null)
  }
  
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

  return (
    <div className="project-page-wrapper">
      <a href="#projects" className="pdf-back-link">← Back to Projects</a>
      
      <div className="pdf-layout">
        {/* Left Column - Media */}
        <div className="pdf-media-column">
          {/* Video at top if available */}
          {hasVideo && (
            <div className="pdf-video-section">
              <div className="pdf-video-card">
                {isYouTube(videoItem.youtube || videoItem.youtubeId || videoItem.video) ? (
                  <iframe
                    src={toYouTubeEmbedUrl(videoItem.youtube || videoItem.youtubeId || videoItem.video)}
                    title={videoItem.title || 'YouTube video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    poster={videoItem.poster || videoItem.image || undefined}
                  >
                    <source src={videoItem.video} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="pdf-video-info">
                <h3 className="pdf-video-title">{videoItem.title}</h3>
                <div className="pdf-video-meta">
                  {(videoItem.year || '') + 
                   (videoItem.medium ? (videoItem.year ? ' • ' : '') + videoItem.medium : '') + 
                   (videoItem.size ? ' • ' + videoItem.size : '')}
                </div>
              </div>
            </div>
          )}
          
          {/* If no video, show first photo enlarged */}
          {!hasVideo && photos.length > 0 && (
            <div className="pdf-hero-section">
              <div 
                className="pdf-hero-photo"
                onClick={() => openLightbox(photos[0], 0)}
              >
                <img 
                  src={photos[0].image} 
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
          
          {/* Two-column alternating photo grid (skip first if no video) */}
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
                          src={photo.image} 
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
                          src={photo.image} 
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
        
        {/* Right Column - Plain Text */}
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
      
      {/* Lightbox */}
      {lightboxPhoto && createPortal(
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); closeLightbox() }}>×</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); goToPrev(e) }}>‹</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxPhoto.image} alt={lightboxPhoto.title} />
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
