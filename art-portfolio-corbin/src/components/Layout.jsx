
import React from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function Layout({ children }) {
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
