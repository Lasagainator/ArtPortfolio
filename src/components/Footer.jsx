
import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-content">
        <span>© {year} Corbin Blackburn • All rights reserved</span>
      </div>
    </footer>
  )
}
