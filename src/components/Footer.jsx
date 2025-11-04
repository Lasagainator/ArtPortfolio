
import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        © {year} Corbin Blackburn • All rights reserved
      </div>
    </footer>
  )
}
