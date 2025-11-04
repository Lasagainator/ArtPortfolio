
import React from 'react'
import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) => isActive ? 'active' : ''

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <div style={{fontWeight:700}}>Corbin Blackburn</div>
        <nav>
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/gallery" className={linkClass}>Gallery</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>
      </div>
    </header>
  )
}
