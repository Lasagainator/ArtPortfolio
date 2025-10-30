import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef
} from 'react'

const Ctx = createContext(null)
const withBase = (p) => /^https?:\/\//i.test(p || '') ? p : `${import.meta.env.BASE_URL}${(p || '').replace(/^\//,'')}`

export function LightboxProvider({ children }) {
  const [item, setItem] = useState(null)
  const [mode, setMode] = useState('natural')
  const wrapperRef = useRef(null)
  const imgRef = useRef(null)
  const dragState = useRef({ dragging: false, x: 0, y: 0, scrollLeft: 0, scrollTop: 0 })
  const [dragging, setDragging] = useState(false)
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })

  const open = useCallback((artwork) => {
    setItem(artwork)
    setMode('natural')
  }, [])
  const close = useCallback(() => {
    setItem(null)
    setMode('natural')
  }, [])

  const toggleMode = useCallback(() => {
    setMode(m => (m === 'natural' ? 'zoom' : 'natural'))
  }, [])

  const onImgLoad = () => {
    const img = imgRef.current
    if (img) {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
      requestAnimationFrame(() => {
        const wrap = wrapperRef.current
        if (wrap) {
          wrap.scrollLeft = (img.scrollWidth - wrap.clientWidth) / 2
          wrap.scrollTop = (img.scrollHeight - wrap.clientHeight) / 2
        }
      })
    }
  }

  useEffect(() => {
    if (!item) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key.toLowerCase() === 'z') toggleMode()
      if (mode === 'natural' || mode === 'zoom') {
        const w = wrapperRef.current
        if (!w) return
        const step = 70
        if (e.key === 'ArrowRight') w.scrollLeft += step
        if (e.key === 'ArrowLeft') w.scrollLeft -= step
        if (e.key === 'ArrowDown') w.scrollTop += step
        if (e.key === 'ArrowUp') w.scrollTop -= step
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, mode, close, toggleMode])

  useEffect(() => {
    const w = wrapperRef.current
    if (!w) return
    const onMouseDown = (e) => {
      dragState.current.dragging = true
      dragState.current.x = e.pageX - w.offsetLeft
      dragState.current.y = e.pageY - w.offsetTop
      dragState.current.scrollLeft = w.scrollLeft
      dragState.current.scrollTop = w.scrollTop
      setDragging(true)
    }
    const onMouseMove = (e) => {
      if (!dragState.current.dragging) return
      e.preventDefault()
      const dx = (e.pageX - w.offsetLeft) - dragState.current.x
      const dy = (e.pageY - w.offsetTop) - dragState.current.y
      w.scrollLeft = dragState.current.scrollLeft - dx
      w.scrollTop = dragState.current.scrollTop - dy
    }
    const endDrag = () => {
      if (dragState.current.dragging) {
        dragState.current.dragging = false
        setDragging(false)
      }
    }
    w.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', endDrag)
    w.addEventListener('mouseleave', endDrag)
    return () => {
      w.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', endDrag)
      w.removeEventListener('mouseleave', endDrag)
    }
  }, [mode])

  const scale = (() => {
    const { w, h } = naturalSize
    if (!w || !h) return 1.8
    const vw = window.innerWidth
    const vh = window.innerHeight
    const fitRatio = Math.min(vw / w, (vh - 120) / h)
    const base = fitRatio * 1.4
    if (fitRatio < 1) return Math.min(2.2, Math.max(1.25, 1.35))
    return Math.min(2.5, Math.max(1.5, base))
  })()

  const isVideo = (/\.(mp4|mov|webm|m4v|ogg)$/i).test(item?.image || '')
  const mediaSrc = withBase(item?.full || item?.image || '')

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      {item && (
        <div
          className={`lightbox lb-mode-${mode}`}
          role="dialog"
          aria-modal="true"
          aria-label={item.title || 'Artwork view'}
          onClick={close}
        >
          <div
            className="lightbox-inner"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              type="button"
              aria-label="Close"
              onClick={close}
            >
              ×
            </button>

            {isVideo ? (
              <video
                className="lightbox-media-video"
                src={mediaSrc}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div
                ref={wrapperRef}
                className={`lb-media-wrapper ${mode} ${dragging ? 'dragging' : ''}`}
                onDoubleClick={toggleMode}
              >
                <img
                  ref={imgRef}
                  className={`lb-image ${mode}`}
                  src={mediaSrc}
                  alt={item.title || 'Artwork'}
                  draggable={false}
                  onLoad={onImgLoad}
                  onClick={toggleMode}
                  style={mode === 'zoom' ? { transform: `scale(${scale})`, transformOrigin: 'center center' } : undefined}
                />
                <div className="lb-hint">
                  {mode === 'natural'
                    ? 'Click / double‑click / Z to magnify • Drag / scroll to pan'
                    : 'Click / double‑click / Z for original size • Drag / scroll to pan'}
                </div>
              </div>
            )}

            {(item.title || item.medium || item.year || item.size) && (
              <div className="lightbox-caption">
                {item.title && <strong>{item.title}</strong>}
                <div>
                  {[item.year, item.medium, item.size].filter(Boolean).join(' • ')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}

export function useLightbox() {
  return useContext(Ctx)
}