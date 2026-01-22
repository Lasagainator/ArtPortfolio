
import React from 'react'

export default function AboutPage() {
  return (
    <section style={{marginTop: '2rem'}}>
      <h2>About</h2>
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        <p style={{maxWidth: 700, flex: 1, minWidth: 300}}>
          Corbin Blackburn is a Graphic Design student at the Maryland Institute College of Art who is working towards his BFA. In his work, he focuses on typography, imagery, branding, and unique design. He always seeks new ways to innovate his design and experiment with new visuals. Driven by teamwork, communication, and excellence.
        </p>
        <div style={{
          width: 360,
          height: 450,
          flexShrink: 0,
          overflow: 'hidden',
          borderRadius: '8px'
        }}>
          <img 
            src={import.meta.env.BASE_URL + 'assets/goat_portrait.png'}
            alt="Corbin Blackburn portrait"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    </section>
  )
}
