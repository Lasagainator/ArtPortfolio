import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRefresh = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.hash = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <h1 style={styles.title}>Oops!</h1>
            <p style={styles.message}>Something went wrong.</p>
            <p style={styles.submessage}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <div style={styles.buttons}>
              <button onClick={this.handleRefresh} style={styles.button}>
                Refresh Page
              </button>
              <button onClick={this.handleGoHome} style={styles.buttonSecondary}>
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
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

export default ErrorBoundary
