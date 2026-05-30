'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

const allStates = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River',
  'Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'
]

export default function PostProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (status === 'loading') return <div className="loading-spinner"><div className="spinner"></div></div>
  if (!session) { router.push('/login'); return null }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    const formData = new FormData(e.target)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      projectType: formData.get('projectType'),
      state: formData.get('state'),
      budgetMin: parseFloat(formData.get('budgetMin')) || null,
      budgetMax: parseFloat(formData.get('budgetMax')) || null,
    }
    const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const result = await res.json()
    if (result.error) { setError(result.error); setLoading(false) }
    else { setSuccess('✅ Project posted! Architects can now submit proposals.'); setTimeout(() => router.push('/client/projects'), 2000) }
  }

  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>{session.user.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#888' }}>Client Account</div>
        </div>
        <nav>
          <Link href="/client/dashboard" className="dash-nav-item">📊 Dashboard</Link>
          <Link href="/client/projects" className="dash-nav-item">📁 My Projects</Link>
          <Link href="/client/project-new" className="dash-nav-item active">➕ Post Project</Link>
          <Link href="/client/proposals" className="dash-nav-item">📋 Proposals</Link>
          <Link href="/client/messages" className="dash-nav-item">💬 Messages</Link>
          <Link href="/client/settings" className="dash-nav-item">⚙️ Settings</Link>
          <div className="dash-nav-divider" />
          <Link href="/marketplace" className="dash-nav-item">🔍 Browse Architects</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div className="page-header">
          <h1>Post a New Project</h1>
          <p>Describe your project and receive proposals from verified architects.</p>
        </div>

        {error && <div className="msg-error">{error}</div>}
        {success && <div className="msg-success">{success}</div>}

        <div className="form-card glass-panel" style={{ padding: '30px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block', color: '#0a192f' }}>Project Title *</label>
              <input name="title" className="form-control" placeholder="e.g. 4-Bedroom Duplex in Lekki" required style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }} />
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block', color: '#0a192f' }}>Project Description *</label>
              <textarea name="description" className="form-control" rows={5} placeholder="Describe your project in detail — site size, number of floors, style preferences, etc." required style={{ resize: 'vertical', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}></textarea>
            </div>

            <div className="grid-2col" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block', color: '#0a192f' }}>Project Type</label>
                <select name="projectType" className="form-control" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%', backgroundColor: 'white' }}>
                  <option value="">Select Type</option>
                  {['Residential','Commercial','Industrial','Renovation','Landscape','Interior'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block', color: '#0a192f' }}>Project State</label>
                <select name="state" className="form-control" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%', backgroundColor: 'white' }}>
                  <option value="">Select State</option>
                  {allStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-2col" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block', color: '#0a192f' }}>Budget Min (₦)</label>
                <input type="number" name="budgetMin" className="form-control" placeholder="e.g. 500000" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }} />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block', color: '#0a192f' }}>Budget Max (₦)</label>
                <input type="number" name="budgetMax" className="form-control" placeholder="e.g. 5000000" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }} />
              </div>
            </div>

            <button type="submit" className="btn-solid-lg" disabled={loading} style={{ marginTop: '24px', width: '100%', maxWidth: '300px' }}>
              {loading ? 'Posting...' : '🚀 Post Project'}
            </button>
          </form>
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="client" />
    </div>
  )
}
