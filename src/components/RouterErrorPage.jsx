import React from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

export default function RouterErrorPage() {
  const error = useRouteError()
  
  const is404 = isRouteErrorResponse(error) && error.status === 404

  const handleGoHome = () => {
    window.location.hash = '/'
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>{is404 ? '404' : 'Oops!'}</h1>
        <p style={styles.message}>
          {is404 ? 'Page not found.' : 'Something went wrong.'}
        </p>
        <p style={styles.submessage}>
          {is404 
            ? "The page you're looking for doesn't exist or has been moved."
            : "We're sorry for the inconvenience. Please try again."}
        </p>
        <div style={styles.buttons}>
          <button onClick={handleGoHome} style={styles.button}>
            Go Home
          </button>
          <button onClick={handleGoBack} style={styles.buttonSecondary}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    fontFamily: "'Didact Gothic', sans-serif",
    padding: '1rem',
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '600',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    color: '#111111',
    margin: '0 0 0.5rem 0',
  },
  message: {
    fontSize: '1.25rem',
    color: '#111111',
    margin: '0 0 0.5rem 0',
  },
  submessage: {
    fontSize: '1rem',
    color: '#777777',
    margin: '0 0 2rem 0',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontFamily: "'Didact Gothic', sans-serif",
    fontWeight: '500',
    backgroundColor: '#111111',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontFamily: "'Didact Gothic', sans-serif",
    fontWeight: '500',
    backgroundColor: '#ffffff',
    color: '#111111',
    border: '1px solid #e5e5e5',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
}
