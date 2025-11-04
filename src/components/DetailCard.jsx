import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const Ctx = createContext(null)
const withBase = (p) => /^https?:\/\//i.test(p || '') ? p : `${import.meta.env.BASE_URL}${(p || '').replace(/^\//,'')}`

export function DetailCardProvider({ children }) {
  const [artwork, setArtwork] = useState(null)
  const [zoomed, setZoomed] = useState(false)
  const [zoom, setZoom] = useState(1.6) // slightly gentler zoom multiplier

  // refs for point-zoom and panning
  const wrapRef = useRef(null)
  const imgRef = useRef(null)
  const baseSizeRef = useRef({ w: 0, h: 0 })
  const clickPctRef = useRef({ x: 0.5, y: 0.5 })
  const draggingRef = useRef({ dragging: false, x: 0, y: 0, sl: 0, st: 0 })

  const open = useCallback((a) => {
    setArtwork(a)
    setZoomed(false)
  }, [])
  const close = useCallback(() => {
    setArtwork(null)
    setZoomed(false)
  }, [])

  useEffect(() => {
    if (!artwork) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [artwork, close])

  // When zoom toggles on, center the clicked point in the scrollable wrapper
  useEffect(() => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return

    if (zoomed) {
      // Wait for the inline width/height style to take effect
      requestAnimationFrame(() => {
        const imgW = Math.max(baseSizeRef.current.w, 1) * zoom
        const imgH = Math.max(baseSizeRef.current.h, 1) * zoom
        const { x: px, y: py } = clickPctRef.current
        const targetLeft = imgW * px - wrap.clientWidth / 2
        const targetTop = imgH * py - wrap.clientHeight / 2
        wrap.scrollLeft = Math.max(0, targetLeft)
        wrap.scrollTop = Math.max(0, targetTop)
      })
    } else {
      // Reset scroll when exiting zoom
      wrap.scrollLeft = 0
      wrap.scrollTop = 0
      draggingRef.current.dragging = false
    }
  }, [zoomed, zoom, artwork])

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      {artwork && (
        <div className="detail-card-backdrop" role="dialog" aria-modal="true" aria-label={artwork.title || 'Artwork details'} onClick={close}>
          <article className="detail-card" onClick={(e) => e.stopPropagation()}>
            <button className="detail-card-close" type="button" aria-label="Close" onClick={close}>×</button>
            <div
              className={`detail-card-media-wrap ${zoomed ? 'zoom-active' : ''}`}
              ref={wrapRef}
              onMouseDown={(e) => {
                if (!zoomed) return
                const wrap = wrapRef.current
                if (!wrap) return
                draggingRef.current = {
                  dragging: true,
                  x: e.pageX,
                  y: e.pageY,
                  sl: wrap.scrollLeft,
                  st: wrap.scrollTop,
                }
                wrap.classList.add('dragging')
                e.preventDefault()
              }}
              onMouseUp={() => {
                const wrap = wrapRef.current
                draggingRef.current.dragging = false
                if (wrap) wrap.classList.remove('dragging')
              }}
              onMouseLeave={() => {
                const wrap = wrapRef.current
                draggingRef.current.dragging = false
                if (wrap) wrap.classList.remove('dragging')
              }}
              onMouseMove={(e) => {
                const st = draggingRef.current
                if (!st.dragging) return
                const wrap = wrapRef.current
                if (!wrap) return
                const dx = e.pageX - st.x
                const dy = e.pageY - st.y
                wrap.scrollLeft = st.sl - dx
                wrap.scrollTop = st.st - dy
              }}
            >
              <img
                ref={imgRef}
                className="detail-card-media"
                src={withBase(artwork.image)}
                alt={artwork.title || 'Artwork'}
                onLoad={(e) => {
                  // capture the displayed size when fit to container
                  const rect = e.currentTarget.getBoundingClientRect()
                  baseSizeRef.current = { w: rect.width, h: rect.height }
                }}
                onClick={(e) => {
                  const img = imgRef.current
                  const wrap = wrapRef.current
                  if (!img || !wrap) return

                  const rect = img.getBoundingClientRect()
                  const clickX = e.clientX - rect.left
                  const clickY = e.clientY - rect.top
                  const px = Math.max(0, Math.min(1, clickX / rect.width))
                  const py = Math.max(0, Math.min(1, clickY / rect.height))
                  clickPctRef.current = { x: px, y: py }

                  setZoomed((z) => !z)
                }}
                draggable={false}
                style={zoomed ? {
                  width: `${Math.max(baseSizeRef.current.w, 1) * zoom}px`,
                  height: 'auto',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  objectFit: 'unset',
                } : undefined}
              />
            </div>
            <div className="detail-card-body">
              {artwork.title && <h3 className="detail-card-title">{artwork.title}</h3>}
              <div className="detail-card-meta">
                {[artwork.year, artwork.medium, artwork.size].filter(Boolean).join(' • ')}
              </div>
              {(artwork.description || artwork.background) && (
                <p className="detail-card-desc">
                  {artwork.description || artwork.background}
                </p>
              )}
            </div>
          </article>
        </div>
      )}
    </Ctx.Provider>
  )
}

export function useDetailCard() {
  return useContext(Ctx)
}