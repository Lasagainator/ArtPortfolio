
import React from 'react'

export default function ContactPage() {
  return (
    <section style={{marginTop: '2rem'}}>
      <h2>Contact</h2>
      <p style={{maxWidth: 700}}>
        Add your preferred contact method here: email, Instagram, or a contact form service.
        This starter keeps things static. For forms, you can wire up services like Formspree later.
      </p>
      <ul>
        <li>Email: <a href="mailto:artist@example.com">artist@example.com</a></li>
        <li>Instagram: <a href="https://instagram.com/yourhandle" target="_blank" rel="noreferrer">@yourhandle</a></li>
      </ul>
    </section>
  )
}
