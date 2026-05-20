'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


export default function LoginPage() {
  const router = useRouter()
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
      setError(result.error === 'CredentialsSignin' ? 'Invalid email or password.' : result.error)
      setLoading(false)
    } else {
      // Redirect based on session role — fetch session after login
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      const role = session?.user?.role
      if (role === 'admin') router.push('/admin/dashboard')
      else if (role === 'architect') router.push('/architect/dashboard')
      else router.push('/client/dashboard')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to manage your projects.</p>

        {error && <div className="msg-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <input type="email" name="email" className="form-input" placeholder="Email Address" required />
          <input type="password" name="password" className="form-input" placeholder="Password" required />
          <button type="submit" className="btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#0a192f', fontWeight: 'bold' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
