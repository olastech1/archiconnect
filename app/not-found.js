import Link from 'next/link'

export const metadata = { title: '404 — Page Not Found | ArchiConnect NG' }

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px',
      background: 'linear-gradient(135deg, #f8f9fb 0%, #e6f4f1 100%)'
    }}>
      <div style={{ fontSize: '6rem', marginBottom: '16px', lineHeight: 1 }}>🏛️</div>
      <h1 style={{ fontSize: '6rem', fontWeight: 900, color: '#0a192f', lineHeight: 1, marginBottom: '8px' }}>404</h1>
      <h2 style={{ fontSize: '1.6rem', color: '#0a192f', marginBottom: '12px', fontWeight: 700 }}>Blueprint Not Found</h2>
      <p style={{ color: '#4a5568', fontSize: '1rem', maxWidth: '400px', lineHeight: 1.7, marginBottom: '32px' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn-primary-lg">← Go Home</Link>
        <Link href="/marketplace" className="btn-outline-lg">Browse Architects</Link>
      </div>
    </div>
  )
}
