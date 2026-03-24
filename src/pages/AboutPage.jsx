
import React from 'react'

export default function AboutPage() {
  return (
    <div className="about-page" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    }}>
      <header className="gallery-header" style={{marginBottom: '2rem'}}>
        <h1 style={{fontSize: '3rem', margin: 0}}>About</h1>
      </header>

      <div className="container" style={{maxWidth: 800, textAlign: 'center'}}>
        <p style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          Corbin Blackburn is a Graphic Design student at the Maryland Institute College of Art who is working towards his BFA. In his work, he focuses on typography, imagery, branding, and unique design. He always seeks new ways to innovate his design and experiment with new visuals. Driven by teamwork, communication, and excellence.
        </p>

        <div className="about-socials" style={{marginTop: '2rem'}}>

        </div>
      </div>
    </div>
  )
}
