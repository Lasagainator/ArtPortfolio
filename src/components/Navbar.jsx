import React from 'react'

function smoothScrollTo(container, targetY, duration = 650) {
  const startY = container.scrollTop
  const diff = targetY - startY
  if (Math.abs(diff) < 1) return
  let startTime = null
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }
  function step(ts) {
    if (!startTime) startTime = ts
    const progress = Math.min((ts - startTime) / duration, 1)
    container.scrollTop = startY + diff * easeOutCubic(progress)
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }
  requestAnimationFrame(step)
}

export default function Navbar() {
  const handleNavClick = (e, id) => {
    e.preventDefault()
    const targetSection = document.getElementById(id)
    if (!targetSection) return
    
    const container = targetSection.closest('.scroll-snap-container')
    if (container) {
      smoothScrollTo(container, targetSection.offsetTop)
    }
  }
  
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-brand">
          <a href="/" onClick={(e) => handleNavClick(e, 'home')} style={{textDecoration:'none'}}>
            <img src="CBlackburn_PortfolioLogo_BirdSolo_Black.png" alt="Corbin Blackburn logo" className="nav-logo" />
          </a>
        </div>
        <nav>
          <a href="/" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
          <a href="/" onClick={(e) => handleNavClick(e, 'projects')}>Projects</a>
          <a href="/" onClick={(e) => handleNavClick(e, 'about')}>About</a>
          <a href="/" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
        </nav>
      </div>
    </header>
  )
}
