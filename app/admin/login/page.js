'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid admin credentials. Access denied.')
      setLoading(false)
      return
    }

    // Small delay to let the JWT cookie propagate, then hard navigate
    // so middleware reads the fresh token correctly
    setTimeout(() => {
      window.location.href = '/admin/dashboard'
    }, 300)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a192f 0%, #172a45 60%, #0a192f 100%)',
      padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: 'linear-gradient(135deg, #d4af37, #f0c840)', borderRadius: '16px', marginBottom: '16px', fontSize: '1.8rem' }}>
            🛡️
          </div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px' }}>Admin Portal</h1>
          <p style={{ color: '#a8b2d1', fontSize: '0.9rem' }}>ArchiConnect NG — Restricted Access</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '36px 32px',
        }}>
          <h2 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '6px', fontWeight: 800 }}>Sign In</h2>
          <p style={{ color: '#a8b2d1', fontSize: '0.88rem', marginBottom: '28px' }}>
            Authorised personnel only. All logins are logged.
          </p>

          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#fca5a5', fontSize: '0.88rem', display: 'flex', gap: '8px', alignItems: 'center'
            }}>
              🚫 {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#a8b2d1', fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Admin Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@archiconnect.ng"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '0.95rem',
                  outline: 'none', boxSizing: 'border-box', transition: '0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#d4af37'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#a8b2d1', fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••••"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '0.95rem',
                  outline: 'none', boxSizing: 'border-box', transition: '0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#d4af37'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #d4af37, #f0c840)',
                color: '#0a192f', fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.03em',
                transition: '0.2s', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Authenticating...' : '🔐 Access Admin Panel'}
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <Link href="/login" style={{ color: '#a8b2d1', fontSize: '0.85rem' }}>← Regular User Login</Link>
          </div>
        </div>

        {/* Security notice */}
        <p style={{ textAlign: 'center', color: 'rgba(168,178,209,0.5)', fontSize: '0.78rem', marginTop: '20px' }}>
          🔒 Secured by 256-bit encryption · Unauthorised access is a criminal offence
        </p>
      </div>
    </div>
  )
}
