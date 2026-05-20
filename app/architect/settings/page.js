'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ArchitectSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      fetch('/api/architect/profile').then(r => r.json()).then(d => setProfile(d.profile))
    }
  }, [status])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    const formData = new FormData(e.target)
    const res = await fetch('/api/architect/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bio: formData.get('bio'),
        specialization: formData.get('specialization'),
        state: formData.get('state'),
        experienceYears: parseInt(formData.get('experienceYears')) || null,
      }),
    })
    const result = await res.json()
    if (result.error) setError(result.error)
    else setSuccess('✅ Profile updated successfully!')
    setLoading(false)
  }

  const allStates = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']

  if (!profile) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>{session?.user?.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#888' }}>Architect</div>
        </div>
        <nav>
          <Link href="/architect/dashboard" className="dash-nav-item">📊 Dashboard</Link>
          <Link href="/architect/portfolio" className="dash-nav-item">🎨 Portfolio</Link>
          <Link href="/architect/proposals" className="dash-nav-item">📋 My Proposals</Link>
          <Link href="/architect/messages" className="dash-nav-item">💬 Messages</Link>
          <Link href="/architect/verification" className="dash-nav-item">🛡️ Verification</Link>
          <Link href="/architect/settings" className="dash-nav-item active">⚙️ Settings</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div className="page-header">
          <h1>Account Settings ⚙️</h1>
          <p>Update your public profile information.</p>
        </div>

        {error && <div className="msg-error">{error}</div>}
        {success && <div className="msg-success">{success}</div>}

        <div className="form-card">
          <h3 style={{ marginBottom: '20px', fontSize: '1.05rem' }}>Public Profile</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2col">
              <div className="form-group">
                <label>Years of Experience</label>
                <input name="experienceYears" className="form-control" type="number" min="0" max="60" defaultValue={profile?.experienceYears || ''} placeholder="e.g. 5" />
              </div>
              <div className="form-group">
                <label>State</label>
                <select name="state" className="form-control" defaultValue={profile?.state || ''}>
                  <option value="">Select State</option>
                  {allStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input name="specialization" className="form-control" defaultValue={profile?.specialization || ''} placeholder="e.g. Residential, Commercial" />
            </div>
            <div className="form-group">
              <label>Bio / About</label>
              <textarea name="bio" className="form-control" rows={6} style={{ resize: 'vertical' }} defaultValue={profile?.bio || ''} placeholder="Tell clients about your experience, design style and past projects..." />
            </div>
            <button type="submit" className="btn-full" disabled={loading} style={{ maxWidth: '220px' }}>
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>

        <div className="form-card" style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.05rem', color: '#991b1b' }}>Danger Zone</h3>
          <p style={{ color: '#666', marginBottom: '16px', fontSize: '0.9rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
          <button className="btn-danger" style={{ opacity: 0.7, cursor: 'not-allowed' }} disabled>Delete Account</button>
        </div>
      </div>
    </div>
  )
}
