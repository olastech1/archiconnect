'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState('client')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.target)
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      password: formData.get('password'),
      role,
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess('✅ Account created! Redirecting to login...')
      setTimeout(() => router.push('/login?msg=registered'), 1500)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Join ArchiConnect</h2>
        <p>Create an account to hire architects or find projects.</p>

        {error && <div className="msg-error">⚠️ {error}</div>}
        {success && <div className="msg-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <p style={{ textAlign: 'left', fontWeight: 700, marginBottom: '10px', color: '#0a192f' }}>I want to:</p>
          <div className="role-selector">
            <label className={`role-option ${role === 'client' ? 'selected' : ''}`}>
              <input type="radio" name="role" value="client" checked={role === 'client'} onChange={() => setRole('client')} />
              🏢 Hire Talent
            </label>
            <label className={`role-option ${role === 'architect' ? 'selected' : ''}`}>
              <input type="radio" name="role" value="architect" checked={role === 'architect'} onChange={() => setRole('architect')} />
              📐 Find Work
            </label>
          </div>

          <input type="text" name="fullName" className="form-input" placeholder="Full Name" required />
          <input type="email" name="email" className="form-input" placeholder="Email Address" required />
          <input type="password" name="password" className="form-input" placeholder="Create Password" minLength={8} required />

          <button type="submit" className="btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '22px', fontSize: '0.9rem', color: '#666' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#0a192f', fontWeight: 800 }}>Login here</Link>
        </p>
      </div>
    </div>
  )
}
