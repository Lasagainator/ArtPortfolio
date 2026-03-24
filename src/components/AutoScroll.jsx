import React, { useEffect, useMemo, useRef, useState } from 'react'
import './AutoScroll.css'

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|ogg)$/i

function isVideo(url) {
  return VIDEO_EXTENSIONS.test(url)
}

function pickSrc(item) {
  return (
    item?.image ||
    item?.src ||
    item?.url ||
    item?.imageUrl ||
    item?.thumbnail ||
    item?.thumb ||
    ''
  )
}

function pickAlt(item) {
  return item?.title || item?.name || item?.alt || ''
}

export default function AutoScroll({ 
  items = [], 
  height = 200, 
  gap = 16, 
  speed = 0.15, 
  pauseOnHover = true,
  fadeOnScroll = false 
}) {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const [opacity, setOpacity] = useState(1)

  // Filter to only include video files
  const videos = useMemo(() => {
    return (items || [])
      .map((it) => ({ src: pickSrc(it), alt: pickAlt(it) }))
      .filter((x) => !!x.src && isVideo(x.src))
  }, [items])

  // Scroll-based opacity fade effect
  useEffect(() => {
    if (!fadeOnScroll || !wrapperRef.current) return

    const handleScroll = () => {
      const el = wrapperRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const vh = window.visualViewport?.height ?? window.innerHeight
      
      // Start at 100% when at top of page, fade to 10% as component leaves viewport
      const elementBottom = rect.bottom
      const elementHeight = rect.height
      
      // When bottom of element is at bottom of viewport or below = 100% opacity
      // When bottom of element is at top of viewport (leaving) = 10% opacity
      if (elementBottom >= vh) {
        setOpacity(1)
      } else if (elementBottom <= 0) {
        setOpacity(0.1)
      } else {
        // Linear interpolation: elementBottom goes from vh (full visible) to 0 (leaving)
        const progress = elementBottom / vh
        // Map progress [0, 1] to opacity [0.1, 1]
        setOpacity(0.1 + progress * 0.9)
      }
    }

    handleScroll() // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fadeOnScroll])

  useEffect(() => {
    const el = containerRef.current
    if (!el || videos.length === 0) return

    let rafId
    let lastTs

    const step = (ts) => {
      if (!el) return
      if (lastTs == null) lastTs = ts
      const dt = ts - lastTs
      lastTs = ts

      if (!paused) {
        const delta = dt * speed
        el.scrollLeft += delta
        const half = el.scrollWidth / 2
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half
        }
      }

      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [videos, speed, paused])

  if (videos.length === 0) return null

  const handleEnter = () => pauseOnHover && setPaused(true)
  const handleLeave = () => pauseOnHover && setPaused(false)

  const styleVars = {
    '--gap': `${gap}px`,
    '--height': `${height}px`,
  }

  const wrapperStyle = {
    ...styleVars,
    opacity: fadeOnScroll ? opacity : 1,
    transition: 'opacity 0.1s ease-out',
  }

  return (
    <div className="auto-scroll-wrapper" style={wrapperStyle} ref={wrapperRef}>
      <div
        className="auto-scroll-container"
        ref={containerRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div className="auto-scroll-track">
          {videos.map((vid, idx) => (
            <div className="auto-scroll-item" key={`a-${idx}`}>
              <video
                src={vid.src}
                height={height}
                muted
                autoPlay
                loop
                playsInline
                aria-label={vid.alt}
              />
            </div>
          ))}
          {videos.map((vid, idx) => (
            <div className="auto-scroll-item" key={`b-${idx}`}>
              <video
                src={vid.src}
                height={height}
                muted
                autoPlay
                loop
                playsInline
                aria-label={vid.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
