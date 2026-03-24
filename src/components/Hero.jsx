


export default function Hero() {
  return (
    <div className="hero" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 700,
          margin: 0,
          color: 'var(--text)'
        }}>Corbin Blackburn</h1>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 400,
          margin: '1rem 0 0 0',
          color: 'var(--text-secondary)'
        }}>Graphic Designer</h2>
      </div>
    </div>
  )
}
