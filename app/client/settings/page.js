'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export default function ClientSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      fetch('/api/client/profile').then(r => r.json()).then(d => setProfile(d.profile || {}))
    }
  }, [status, router])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    const formData = new FormData(e.target)
    
    const res = await fetch('/api/client/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: formData.get('phone'),
        state: formData.get('state'),
      }),
    })
    const result = await res.json()
    if (result.error) setError(result.error)
    else setSuccess('✅ Profile updated successfully!')
    setLoading(false)
  }

  const allStates = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']

  if (status === 'loading' || !profile) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>{session?.user?.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#888' }}>Client Account</div>
        </div>
        <nav>
          <p className="dash-nav-section">Main</p>
          <Link href="/client/dashboard" className="dash-nav-item">📊 Dashboard</Link>
          <Link href="/client/projects" className="dash-nav-item">📁 My Projects</Link>
          <Link href="/client/project-new" className="dash-nav-item">➕ Post Project</Link>
          <Link href="/client/proposals" className="dash-nav-item">📋 Proposals</Link>
          <Link href="/client/contracts" className="dash-nav-item">📄 Contracts</Link>
          <p className="dash-nav-section">Account</p>
          <Link href="/client/messages" className="dash-nav-item">💬 Messages</Link>
          <Link href="/client/settings" className="dash-nav-item active">⚙️ Settings</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div className="page-header">
          <h1>Account Settings ⚙️</h1>
          <p>Update your contact information.</p>
        </div>

        {error && <div className="msg-error">{error}</div>}
        {success && <div className="msg-success">{success}</div>}

        <div className="form-card glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 800 }}>Profile Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2col">
              <div className="form-group">
                <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block', color: '#0a192f' }}>Phone Number</label>
                <input name="phone" className="form-control" defaultValue={profile?.phone || ''} placeholder="e.g. +234..." style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }} />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block', color: '#0a192f' }}>State</label>
                <select name="state" className="form-control" defaultValue={profile?.state || ''} style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%', backgroundColor: 'white' }}>
                  <option value="">Select State</option>
                  {allStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            
            <button type="submit" className="btn-solid-lg" disabled={loading} style={{ marginTop: '20px' }}>
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>

        <div className="form-card glass-panel" style={{ marginTop: '24px', padding: '30px', border: '1px solid rgba(239,68,68,0.2)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#ef4444', fontWeight: 800 }}>Danger Zone</h3>
          <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '0.9rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
          <button className="btn-danger" style={{ opacity: 0.7, cursor: 'not-allowed', padding: '12px 20px', borderRadius: '8px', fontWeight: 700, border: 'none', background: '#ef4444', color: 'white' }} disabled>Delete Account</button>
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="client" />
    </div>
  )
}
