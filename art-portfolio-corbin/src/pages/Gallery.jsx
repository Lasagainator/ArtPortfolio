
import React from 'react'
import GalleryGrid from '../components/GalleryGrid.jsx'
import artworks from '../data/artworks.json'

export default function Gallery() {
  return (
    <>
      <h2 style={{marginTop: '2rem'}}>Gallery</h2>
      <GalleryGrid items={artworks} />
    </>
  )
}
