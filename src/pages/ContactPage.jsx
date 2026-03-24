
import React, { useState } from 'react'
import './ContactPage.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('success')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact-page-fullscreen">
      <header className="contact-header-fullscreen">
        <h1>Get in Touch</h1>
      </header>

      <div className="contact-content-fullscreen">
        <div className="contact-info-fullscreen">
          <h2>Contact Info</h2>
          <p>
            <strong>Email:</strong><br />
            <a href="mailto:corbinavb05@hotmail.com">corbinavb05@hotmail.com</a>
          </p>
          <p>
            <strong>LinkedIn:</strong><br />
            <a href="https://linkedin.com/in/corbin-blackburn" target="_blank" rel="noopener noreferrer">linkedin.com/in/corbin-blackburn</a>
          </p>
        </div>

        <form className="contact-form-fullscreen contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..."
              rows="4"
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="form-status success">
              Thanks for your message! I'll get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p className="form-status error">
              Oops! Something went wrong. Please try again or email me directly.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
