import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Hero from '../components/Hero.jsx'
import AboutPage from './AboutPage.jsx'
import ContactPage from './ContactPage.jsx'
import artworks from '../data/artworks.json'
import { getCategoryInfo, categoryToSlug } from './ProjectPage.jsx'
import { isYouTube, toYouTubeEmbedUrl, asset } from '../utils/media.js'

/* ─── Full-screen project gallery section ─── */
function ProjectGallerySection({ category, onClose }) {
  // Use shared asset() helper for images
  const { title, items, galleryDescription } = category
  const videoItem = items.find(i => i.video || i.youtube || i.youtubeId)
  const photos = items.filter(i => !(i.video || i.youtube || i.youtubeId))
  const hasVideo = Boolean(videoItem)
  const programsItem = items.find(item => item.programs)
  const programs = programsItem?.programs

  const [lightboxPhoto, setLightboxPhoto] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const openLightbox = (photo, index) => { setLightboxPhoto(photo); setLightboxIndex(index) }
  const closeLightbox = () => setLightboxPhoto(null)
  const goToPrev = (e) => {
    e.stopPropagation()
    const i = lightboxIndex > 0 ? lightboxIndex - 1 : photos.length - 1
    setLightboxIndex(i); setLightboxPhoto(photos[i])
  }
  const goToNext = (e) => {
    e.stopPropagation()
    const i = lightboxIndex < photos.length - 1 ? lightboxIndex + 1 : 0
    setLightboxIndex(i); setLightboxPhoto(photos[i])
  }

  return (
    <div className="project-gallery-fullscreen">
      {/* Top bar with back button and title */}
      <div className="project-gallery-topbar">
        <button
          className="project-gallery-back"
          onClick={onClose}
          aria-label="Back to projects"
        >
          ← Back to Projects
        </button>
        <p className="project-gallery-title">{title}</p>
        <div style={{ width: 140 }} />{/* spacer for centering */}
      </div>

      {/* Main content area - 3 columns: thumbs | media | info */}
      <div className="project-gallery-main">
        {/* Left: Process photo thumbnails (vertical scroll) */}
        {(() => {
          const gridPhotos = hasVideo ? photos : photos.slice(1)
          return gridPhotos.length > 0 && (
            <div className="project-gallery-thumbs">
              {gridPhotos.map((photo) => {
                const originalIndex = photos.indexOf(photo)
                return (
                  <div key={photo.id} className="process-thumb" onClick={() => openLightbox(photo, originalIndex)}>
                      <img src={asset(photo.image)} alt={photo.title} loading="lazy" />
                    </div>
                )
              })}
            </div>
          )
        })()}

        {/* Center: Video or hero photo */}
        <div className="project-gallery-media">
          {hasVideo && (
            <div className="pdf-video-section">
              <div className="pdf-video-card">
                {(videoItem.youtube || videoItem.youtubeId) ? (
                  <iframe
                    src={toYouTubeEmbedUrl(videoItem.youtube || videoItem.youtubeId)}
                    title={videoItem.title || 'YouTube video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video controls preload="metadata" playsInline poster={(videoItem.poster || videoItem.image) ? asset(videoItem.poster || videoItem.image) : undefined}>
                    <source src={videoItem.video} />
                  </video>
                )}
              </div>
            </div>
          )}

          {!hasVideo && photos.length > 0 && (
            <div className="pdf-hero-section">
              <div className="pdf-hero-photo" onClick={() => openLightbox(photos[0], 0)}>
                <img src={asset(photos[0].image)} alt={photos[0].title} />
              </div>
            </div>
          )}
        </div>

        {/* Right: Project info */}
        <div className="project-gallery-info">
          <h1 className="pdf-title">{title}</h1>
          <p className="pdf-subtitle">
            {items.length} piece{items.length !== 1 ? 's' : ''}
            {hasVideo && ' • Includes video'}
          </p>
          {galleryDescription && <p className="pdf-description">{galleryDescription}</p>}
          {programs && <p className="pdf-programs"><strong>Programs Used:</strong> {programs}</p>}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxPhoto && createPortal(
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); closeLightbox() }}>×</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); goToPrev(e) }}>‹</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={asset(lightboxPhoto.image)} alt={lightboxPhoto.title} />
            {lightboxPhoto.title && <p className="lightbox-caption">{lightboxPhoto.title}</p>}
            {lightboxPhoto.subcaption && (
              <div className="lightbox-credits">
                {Array.isArray(lightboxPhoto.subcaption)
                  ? lightboxPhoto.subcaption.map((line, i) => <p key={i}>{line}</p>)
                  : <p>{lightboxPhoto.subcaption}</p>}
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

// Mosaic gallery with thumbnails in natural proportions
function SimpleGalleryGrid({ onProjectClick }) {
  const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || '/'
  
  // Dynamically get all categories with thumbnails
  const categories = getCategoryInfo()
  const thumbnails = categories.map((cat, idx) => ({
    id: cat.slug || idx,
    image: cat.thumbnail,
    title: cat.title,
    category: cat.title
  }))

  return (
    <div className="thumbnail-grid">
      {thumbnails.map(item => {
      const src = asset(item.image)
      const isVideo = /\.mp4$/i.test(item.image)

        return (
          <div key={item.id} className="thumbnail-card"
            onClick={() => onProjectClick(item.category)}
          >
            {isVideo ? (
              <video
                src={src}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={src}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            )}
            <div className="thumbnail-overlay">
              <span className="thumbnail-overlay-title">{item.title}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null)
  const gallerySectionRef = useRef(null)
  const containerRef = useRef(null)
  const isScrollingRef = useRef(false)
  const touchStartY = useRef(0)
  const wheelAccum = useRef(0)
  const wheelTimer = useRef(null)
  const thumbsOverScrollCountRef = useRef(0)
  const thumbsOverScrollTimerRef = useRef(null)
  const scrollCooldown = 1200 // ms to ignore input while scrolling
  const wheelThreshold = 80  // accumulated deltaY needed to trigger a section change
  const scrollDuration = 650 // ms for scroll animation
  const rafRef = useRef(null)

  const categories = getCategoryInfo()

  /* ── Find current section index from scroll position ── */
  const getCurrentSectionIndex = useCallback(() => {
    const container = containerRef.current
    if (!container) return 0
    const sections = container.querySelectorAll('.full-screen-section')
    const scrollTop = container.scrollTop
    const mid = scrollTop + container.clientHeight / 2
    let idx = 0
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= mid) idx = i
    }
    return idx
  }, [])

  /* ── Smooth scroll with controlled duration ── */
  const scrollToSection = useCallback((sectionEl) => {
    const container = containerRef.current
    if (!container || !sectionEl) return
    if (isScrollingRef.current) return
    isScrollingRef.current = true

    // Cancel any in-flight animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const startY = container.scrollTop
    const targetY = sectionEl.offsetTop
    const diff = targetY - startY
    if (Math.abs(diff) < 1) { isScrollingRef.current = false; return }

    // Disable snap during animation
    container.style.scrollSnapType = 'none'
    let startTime = null

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }

    function step(ts) {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / scrollDuration, 1)
      container.scrollTop = startY + diff * easeOutCubic(progress)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        // Restore proximity snapping only if the destination requests it
        if (sectionEl.classList && sectionEl.classList.contains('snap-section')) {
          container.style.scrollSnapType = 'y proximity'
        } else {
          container.style.scrollSnapType = ''
        }
        setTimeout(() => { isScrollingRef.current = false }, 200)
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }, [scrollDuration])

  const handleProjectClick = (categoryName) => {
    const cat = categories.find(c => c.title === categoryName)
    if (cat) {
      setSelectedProject(cat)
    }
  }

  const handleCloseGallery = () => {
    setSelectedProject(null)
    setTimeout(() => {
      const projectsSection = document.getElementById('projects')
      if (projectsSection) {
        scrollToSection(projectsSection)
      }
    }, 50)
  }

  // Scroll to gallery section when a project is selected
  useEffect(() => {
    if (selectedProject && gallerySectionRef.current) {
      setTimeout(() => {
        scrollToSection(gallerySectionRef.current)
      }, 50)
    }
  }, [selectedProject, scrollToSection])

  // On mount, reset any native scroll offset caused by hash fragments
  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  /* ── Wheel event: accumulate delta before triggering ── */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e) => {
      // If cursor is over a scrollable thumbnail panel, let it scroll naturally
      const thumbsPanel = e.target.closest('.project-gallery-thumbs')
      if (thumbsPanel) {
        const { scrollTop, scrollHeight, clientHeight } = thumbsPanel
        const atTop = scrollTop <= 0 && e.deltaY < 0
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0
        // Only intercept if the panel can't scroll further in that direction
        if (!atTop && !atBottom) return

        // More generous grace: require two deliberate over-scroll gestures
        // within a short window before navigating away from the internal scroller.
        if (atBottom && e.deltaY > 0) {
          thumbsOverScrollCountRef.current += 1
          clearTimeout(thumbsOverScrollTimerRef.current)
          thumbsOverScrollTimerRef.current = setTimeout(() => { thumbsOverScrollCountRef.current = 0 }, 900)
          if (thumbsOverScrollCountRef.current < 2) return
          thumbsOverScrollCountRef.current = 0
        }

        if (atTop && e.deltaY < 0) {
          thumbsOverScrollCountRef.current += 1
          clearTimeout(thumbsOverScrollTimerRef.current)
          thumbsOverScrollTimerRef.current = setTimeout(() => { thumbsOverScrollCountRef.current = 0 }, 900)
          if (thumbsOverScrollCountRef.current < 2) return
          thumbsOverScrollCountRef.current = 0
        }
      }

      e.preventDefault()
      if (isScrollingRef.current) return

      // Accumulate scroll delta
      wheelAccum.current += e.deltaY

      // Reset accumulator after a pause in scrolling (gesture ended)
      clearTimeout(wheelTimer.current)
      wheelTimer.current = setTimeout(() => { wheelAccum.current = 0 }, 200)

      // Only trigger when enough delta has built up
      if (Math.abs(wheelAccum.current) < wheelThreshold) return

      const direction = wheelAccum.current > 0 ? 1 : -1
      wheelAccum.current = 0 // reset after triggering

      const sections = container.querySelectorAll('.full-screen-section')
      const currentIdx = getCurrentSectionIndex()
      const nextIdx = Math.max(0, Math.min(currentIdx + direction, sections.length - 1))

      if (nextIdx !== currentIdx) {
        scrollToSection(sections[nextIdx])
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
      clearTimeout(wheelTimer.current)
      clearTimeout(thumbsOverScrollTimerRef.current)
    }
  }, [getCurrentSectionIndex, scrollToSection, selectedProject])

  /* ── Touch events: swipe to navigate ── */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e) => {
      if (isScrollingRef.current) return
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(deltaY) < 50) return // ignore small swipes

      const sections = container.querySelectorAll('.full-screen-section')
      const currentIdx = getCurrentSectionIndex()
      const direction = deltaY > 0 ? 1 : -1
      const nextIdx = Math.max(0, Math.min(currentIdx + direction, sections.length - 1))

      if (nextIdx !== currentIdx) {
        scrollToSection(sections[nextIdx])
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [getCurrentSectionIndex, scrollToSection, selectedProject])

  /* ── IntersectionObserver: fade sections in/out ── */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          entry.target.classList.toggle('section-visible', entry.isIntersecting)
        })
      },
      { root: container, threshold: 0.25 }
    )

    const sections = container.querySelectorAll('.full-screen-section')
    sections.forEach(s => observer.observe(s))

    return () => observer.disconnect()
  }, [selectedProject])

  return (
    <div className="scroll-snap-container" ref={containerRef}>
      <section id="home" className="full-screen-section">
        <Hero />
      </section>

      <section id="projects" className="full-screen-section snap-section" style={{ justifyContent: 'flex-start', paddingTop: '5rem' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 600,
          margin: '0 0 1rem 0',
          color: 'var(--text)',
        }}>Projects</h1>
        <SimpleGalleryGrid onProjectClick={handleProjectClick} />
      </section>

      {selectedProject && (
        <section id="project-gallery" className="full-screen-section gallery-section" ref={gallerySectionRef}>
          <ProjectGallerySection
            key={selectedProject.slug}
            category={selectedProject}
            onClose={handleCloseGallery}
          />
        </section>
      )}

      <section id="about" className="full-screen-section">
        <AboutPage />
      </section>

      <section id="contact" className="full-screen-section">
        <ContactPage />
      </section>
    </div>
  )
}
