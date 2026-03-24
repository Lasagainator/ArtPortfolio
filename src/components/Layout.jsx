
import React from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  
  // For home page, show navbar but no footer/container
  if (isHome) {
    return (
      <>
        <Navbar />
        {children}
      </>
    )
  }
  
  return (
    <>
      <Navbar />
      <main className="container">
        {children}
      </main>
      <Footer />
    </>
  )
}
