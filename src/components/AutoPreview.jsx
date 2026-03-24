import React from 'react'
import './AutoPreview.css'

export default function AutoPreview() {
  return (
    <div className="auto-preview" aria-hidden={false} aria-label="Corbin Blackburn Graphic Design">
      <div className="auto-preview-title" style={{textAlign: 'center', width: '100%'}}>
        <div style={{fontSize: '2.5rem', fontWeight: 700}}>Corbin Blackburn</div>
        <div style={{fontSize: '1.2rem', opacity: 0.75, marginTop: '0.5rem', fontWeight: 400}}>Graphic Design</div>
      </div>
    </div>
  )
}
