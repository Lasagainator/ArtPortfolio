import { useEffect } from 'react'

// Scroll-linked fade using viewport/section geometry so dynamic content
// (dropdowns, expanded panels) doesn't cause incorrect opacity.
// For each `.section` we compute the visible height and derive an
// opacity value. We treat ~80% visible as fully opaque to give a nice
// margin for taller sections.
export default function SectionFade() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.section'))
    if (!sections.length) return

    let rafId = null

    // fraction at which we consider fully visible; lowered from 0.6 to
    // 0.5 so the fade starts ~10% earlier per request
    const visibilityThreshold = 0.8 // fraction at which we consider fully visible
    const maxTranslate = 16 // px

    function update() {
      const viewportTop = window.scrollY || window.pageYOffset
      const viewportBottom = viewportTop + window.innerHeight

      sections.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const sectionTop = rect.top + viewportTop
        const sectionBottom = sectionTop + rect.height

        // compute overlap between viewport and section
        const overlapTop = Math.max(viewportTop, sectionTop)
        const overlapBottom = Math.min(viewportBottom, sectionBottom)
        const visibleHeight = Math.max(0, overlapBottom - overlapTop)

        // fraction of section that's visible.
        // Use the smaller of the section height and viewport height as the
        // denominator so very tall sections (taller than the viewport)
        // can reach full visibility when the viewport is filled by the
        // section. This also makes dynamic additions/removals that change
        // section height behave more predictably.
        const denom = Math.min(rect.height || 0, window.innerHeight || 1)
        const fraction = denom > 0 ? visibleHeight / denom : 0

        // map fraction to opacity with threshold
        const opacity = Math.min(1, fraction / visibilityThreshold)

        // translate should ease out as opacity approaches 1
        const translate = `${((1 - opacity) * maxTranslate).toFixed(2)}px`

        el.style.setProperty('--section-opacity', String(opacity))
        el.style.setProperty('--section-translate', translate)
      })
    }

    function schedule() {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    // initial update
    schedule()

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    // observe resizes on each section (better and more reliable than
    // a generic MutationObserver for layout/size changes)
    const ro = new ResizeObserver(schedule)
    sections.forEach(s => ro.observe(s))

    // also observe DOM mutations as a fallback for structural changes
    const mo = new MutationObserver(schedule)
    mo.observe(document.body, { childList: true, subtree: true, attributes: true })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
