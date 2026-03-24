import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import './InteractiveScroll.css'

/**
 * InteractiveScroll - A scrollytelling component for showcasing process work
 * with synced text descriptions and images.
 */

// Maximum number of text items visible at once
const MAX_VISIBLE_ITEMS = 5

export function InteractiveScrollSimple({
  headerTitle,
  headerSubtitle,
  items = [],
  className = '',
}) {
  const safeItems = Array.isArray(items) ? items : []
  const count = safeItems.length

  // Refs
  const wrapperRef = useRef(null)
  const mediaViewportRef = useRef(null)

  // State
  const [activeIndex, setActiveIndex] = useState(0)
  const [mode, setMode] = useState('before') // 'before' | 'fixed' | 'after'
  const [frameHeight, setFrameHeight] = useState(500)
  const [wrapperHeight, setWrapperHeight] = useState(0)

  // Calculate wrapper height and frame height
  useEffect(() => {
    const calculate = () => {
      if (!mediaViewportRef.current) return
      
      const vh = window.visualViewport?.height ?? window.innerHeight
      const mediaH = Math.min(vh * 0.7, 700)
      setFrameHeight(mediaH)
      
      // Total scroll distance = one viewport per item
      const totalH = count * vh
      setWrapperHeight(totalH)
    }

    calculate()
    window.addEventListener('resize', calculate)
    return () => window.removeEventListener('resize', calculate)
  }, [count])

  // Scroll tracking for active index and pin mode
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end']
  })

  // Update active index based on scroll progress
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (count <= 1) {
      setActiveIndex(0)
      return
    }
    // Map progress [0, 1] to item index [0, count-1]
    const idx = Math.min(Math.floor(progress * count), count - 1)
    setActiveIndex(idx)
  })

  // Pin mode detection
  useEffect(() => {
    const onScroll = () => {
      if (!wrapperRef.current) return
      
      const vh = window.visualViewport?.height ?? window.innerHeight
      const rect = wrapperRef.current.getBoundingClientRect()
      
      if (rect.top >= 0) {
        setMode('before')
      } else if (rect.bottom <= vh) {
        setMode('after')
      } else {
        setMode('fixed')
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Calculate translateY for the media reel
  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(count - 1) * frameHeight]
  )

  // Calculate pinned container position
  const getPinnedStyle = () => {
    const vh = typeof window !== 'undefined' 
      ? (window.visualViewport?.height ?? window.innerHeight) 
      : 800

    if (mode === 'fixed') {
      return { top: 0, position: 'fixed' }
    } else if (mode === 'after') {
      return { top: wrapperHeight - vh, position: 'absolute' }
    }
    return { top: 0, position: 'absolute' }
  }

  const pinnedStyle = getPinnedStyle()

  // Click handler to scroll to specific item
  const scrollToItem = (index) => {
    if (!wrapperRef.current) return
    
    const rect = wrapperRef.current.getBoundingClientRect()
    const wrapperTop = rect.top + window.scrollY
    const vh = window.visualViewport?.height ?? window.innerHeight
    const scrollRange = wrapperHeight - vh
    
    const targetProgress = count > 1 ? index / (count - 1) : 0
    const targetY = wrapperTop + targetProgress * scrollRange

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    })
  }

  if (count === 0) return null

  // Calculate visible items window centered around active index
  const getVisibleItems = () => {
    if (count <= MAX_VISIBLE_ITEMS) {
      // Show all items if count is within limit
      return safeItems.map((item, i) => ({ item, originalIndex: i }))
    }

    // Calculate window bounds centered on active index
    const halfWindow = Math.floor(MAX_VISIBLE_ITEMS / 2)
    let startIdx = activeIndex - halfWindow
    let endIdx = activeIndex + halfWindow

    // Adjust bounds if they exceed array limits
    if (startIdx < 0) {
      startIdx = 0
      endIdx = MAX_VISIBLE_ITEMS - 1
    } else if (endIdx >= count) {
      endIdx = count - 1
      startIdx = count - MAX_VISIBLE_ITEMS
    }

    // Return windowed items with their original indices
    return safeItems
      .slice(startIdx, endIdx + 1)
      .map((item, i) => ({ item, originalIndex: startIdx + i }))
  }

  const visibleItems = getVisibleItems()

  // Check if there are hidden items above/below
  const hasItemsAbove = count > MAX_VISIBLE_ITEMS && visibleItems[0]?.originalIndex > 0
  const hasItemsBelow = count > MAX_VISIBLE_ITEMS && visibleItems[visibleItems.length - 1]?.originalIndex < count - 1

  return (
    <section className={`interactive-scroll ${className}`}>
      {/* Header */}
      <div className="interactive-scroll-header">
        <h2>{headerTitle}</h2>
        {headerSubtitle && <p>{headerSubtitle}</p>}
      </div>

      {/* Scrollytelling wrapper */}
      <div className="interactive-scroll-wrapper">
        <div
          ref={wrapperRef}
          className="interactive-scroll-container"
          style={{ height: wrapperHeight }}
        >
          {/* Pinned content */}
          <div
            className={`interactive-scroll-pinned ${mode === 'fixed' ? 'is-fixed' : 'is-absolute'}`}
            style={{
              top: pinnedStyle.top,
              position: pinnedStyle.position,
              height: '100vh'
            }}
          >
            <div className="interactive-scroll-inner">
              <div className="interactive-scroll-grid">
                {/* Left: Text navigation */}
                <aside className="interactive-scroll-aside">
                  <nav className="interactive-scroll-nav">
                    {/* Indicator for items above */}
                    {hasItemsAbove && (
                      <div className="interactive-scroll-overflow-indicator above">
                        <span>↑ {visibleItems[0].originalIndex} more</span>
                      </div>
                    )}

                    <AnimatePresence mode="popLayout">
                      {visibleItems.map(({ item, originalIndex }) => {
                        const isActive = originalIndex === activeIndex
                        const isCompleted = originalIndex < activeIndex

                        return (
                          <motion.button
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: originalIndex < activeIndex ? -20 : 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: originalIndex < activeIndex ? -20 : 20 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            onClick={() => scrollToItem(originalIndex)}
                            className={`interactive-scroll-item ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}
                          >
                            <div className="interactive-scroll-item-inner">
                              <div className="interactive-scroll-dot" />
                              <div className="interactive-scroll-item-content">
                                <h3 className="interactive-scroll-item-title">
                                  {item.title}
                                </h3>
                                {item.description && isActive && (
                                  <motion.p 
                                    className="interactive-scroll-item-desc"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {item.description}
                                  </motion.p>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </AnimatePresence>

                    {/* Indicator for items below */}
                    {hasItemsBelow && (
                      <div className="interactive-scroll-overflow-indicator below">
                        <span>↓ {count - 1 - visibleItems[visibleItems.length - 1].originalIndex} more</span>
                      </div>
                    )}
                  </nav>
                </aside>

                {/* Right: Media viewport */}
                <div className="interactive-scroll-media-container">
                  <div
                    ref={mediaViewportRef}
                    className="interactive-scroll-media-viewport"
                    style={{ height: frameHeight }}
                  >
                    <motion.div
                      className="interactive-scroll-media-reel"
                      style={{ translateY }}
                    >
                      {safeItems.map((item, i) => (
                        <div
                          key={item.id}
                          className="interactive-scroll-media-frame"
                          style={{
                            height: frameHeight,
                            top: i * frameHeight
                          }}
                        >
                          <motion.div
                            className="interactive-scroll-media-inner"
                            initial={{ opacity: 0.5, scale: 0.98 }}
                            animate={{
                              opacity: i === activeIndex ? 1 : 0.5,
                              scale: i === activeIndex ? 1 : 0.98
                            }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                          >
                            {item.media.type === 'video' ? (
                              <video
                                src={item.media.src}
                                poster={item.media.poster}
                                muted
                                loop
                                autoPlay
                                playsInline
                              />
                            ) : (
                              <img
                                src={item.media.src}
                                alt={item.media.alt || item.title}
                                loading="lazy"
                              />
                            )}
                          </motion.div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Simple vertical cards */}
      <div className="interactive-scroll-mobile">
        {safeItems.map((item, i) => (
          <article key={item.id} className="interactive-scroll-mobile-card">
            <div className="interactive-scroll-mobile-image">
              {item.media.type === 'video' ? (
                <video
                  src={item.media.src}
                  poster={item.media.poster}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={item.media.src}
                  alt={item.media.alt || item.title}
                  loading="lazy"
                />
              )}
            </div>
            <div className="interactive-scroll-mobile-content">
              <span className="interactive-scroll-mobile-index">
                {i + 1} of {count}
              </span>
              <h3 className="interactive-scroll-mobile-title">{item.title}</h3>
              {item.description && (
                <p className="interactive-scroll-mobile-desc">{item.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// Re-export with original name for backwards compatibility
export const InteractiveScroll = InteractiveScrollSimple
export default InteractiveScrollSimple
