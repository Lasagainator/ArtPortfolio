import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const Ctx = createContext(null)
const withBase = (p) => /^https?:\/\//i.test(p || '') ? p : `${import.meta.env.BASE_URL}${(p || '').replace(/^\//,'')}`

export function DetailCardProvider({ children }) {
  const [artwork, setArtwork] = useState(null)
  const [zoomed, setZoomed] = useState(false)
  // Zoom is expressed as a scale factor where 1 == "fit to card".
  // Using 1.0 as the initial value avoids any implicit zoom that
  // can make the very first step feel larger than intended.
  const [zoom, setZoom] = useState(1)
  const minZoom = 1
  const maxZoom = 3

  // refs for point-zoom and panning
  const wrapRef = useRef(null)
  const imgRef = useRef(null)
  // Base 'fit to card' size and the natural intrinsic size
  const baseSizeRef = useRef({ w: 0, h: 0 })
  const naturalRef = useRef({ w: 0, h: 0 })
  const baseScaleRef = useRef(1) // fitScale = baseSize / naturalSize
  const clickPctRef = useRef({ x: 0.5, y: 0.5 })
  const draggingRef = useRef({ dragging: false, x: 0, y: 0, sl: 0, st: 0 })

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

  // Adjust zoom and recentre to last recorded focal percentage
  const applyZoom = useCallback((nextZoom) => {
    const wrap = wrapRef.current
    if (!wrap) return
    const z = clamp(nextZoom, minZoom, maxZoom)
    setZoom(z)
    setZoomed(z > 1.01)
  }, [])

  const open = useCallback((a) => {
    setArtwork(a)
    setZoom(1)
    setZoomed(false)
  }, [])
  const close = useCallback(() => {
    setArtwork(null)
    setZoomed(false)
  }, [])

  // Helper: capture the currently displayed size as the zoom baseline
  const ensureBaseFromCurrent = useCallback(() => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return
    const rect = img.getBoundingClientRect()
    const nat = naturalRef.current
    // Use container-based fit computation to avoid layout quirks
    const cw = wrap.clientWidth || rect.width
    const ch = wrap.clientHeight || rect.height
    const nw = nat.w || img.naturalWidth || rect.width
    const nh = nat.h || img.naturalHeight || rect.height
    const fitScale = Math.min(cw / Math.max(nw, 1), ch / Math.max(nh, 1)) || 1
    const bw = Math.max(nw, 1) * fitScale
    const bh = Math.max(nh, 1) * fitScale
    baseSizeRef.current = { w: bw, h: bh }
    baseScaleRef.current = fitScale
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
              onWheel={(e) => {
                if (!e.ctrlKey) return
                e.preventDefault()
                // Focus at cursor position
                const img = imgRef.current
                if (img) {
                  const rect = img.getBoundingClientRect()
                  const clickX = e.clientX - rect.left
                  const clickY = e.clientY - rect.top
                  const px = clamp(clickX / rect.width, 0, 1)
                  const py = clamp(clickY / rect.height, 0, 1)
                  clickPctRef.current = { x: px, y: py }
                  if (!zoomed) ensureBaseFromCurrent()
                }
                const factor = e.deltaY > 0 ? 0.9 : 1.1
                applyZoom(zoom * factor)
              }}
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
                  const img = e.currentTarget
                  // Record natural size for accurate fit-scale math
                  naturalRef.current = { w: img.naturalWidth, h: img.naturalHeight }
                  // Capture initial fit size using container constraints
                  ensureBaseFromCurrent()
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
                  // Recompute fit baseline using container + natural size
                  ensureBaseFromCurrent()
                  // Toggle zoomed state (applyZoom will center on next frame)
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
            {/* Zoom controls: position relative to the card so always visible */}
            <div className="detail-card-zoom-controls" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
              <button
                type="button"
                aria-label="Zoom out"
                className="zc-btn"
                onClick={() => {
                  const wrap = wrapRef.current
                  if (!zoomed) {
                    ensureBaseFromCurrent()
                    clickPctRef.current = { x: 0.5, y: 0.5 }
                  } else if (wrap) {
                    const imgW = Math.max(baseSizeRef.current.w, 1) * zoom
                    const imgH = Math.max(baseSizeRef.current.h, 1) * zoom
                    const px = clamp((wrap.scrollLeft + wrap.clientWidth / 2) / imgW, 0, 1)
                    const py = clamp((wrap.scrollTop + wrap.clientHeight / 2) / imgH, 0, 1)
                    clickPctRef.current = { x: px, y: py }
                  }
                  applyZoom(zoom / 1.15)
                }}
              >−</button>
              <span className="zc-level" aria-hidden="true">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                aria-label="Zoom in"
                className="zc-btn"
                onClick={() => {
                  const wrap = wrapRef.current
                  if (!zoomed) {
                    ensureBaseFromCurrent()
                    clickPctRef.current = { x: 0.5, y: 0.5 }
                  } else if (wrap) {
                    const imgW = Math.max(baseSizeRef.current.w, 1) * zoom
                    const imgH = Math.max(baseSizeRef.current.h, 1) * zoom
                    const px = clamp((wrap.scrollLeft + wrap.clientWidth / 2) / imgW, 0, 1)
                    const py = clamp((wrap.scrollTop + wrap.clientHeight / 2) / imgH, 0, 1)
                    clickPctRef.current = { x: px, y: py }
                  }
                  applyZoom(zoom * 1.15)
                }}
              >+</button>
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
