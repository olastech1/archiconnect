'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ArchitectPortfolioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchPortfolios()
  }, [status])

  async function fetchPortfolios() {
    const res = await fetch('/api/portfolio')
    const data = await res.json()
    setPortfolios(data.portfolios || [])
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    setUploading(true); setError(''); setSuccess('')
    const formData = new FormData(e.target)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
      projectType: formData.get('projectType'),
      location: formData.get('location'),
      year: formData.get('year') ? parseInt(formData.get('year')) : null,
    }
    const res = await fetch('/api/portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const result = await res.json()
    if (result.error) { setError(result.error) }
    else { setSuccess('✅ Portfolio item added!'); setShowForm(false); fetchPortfolios(); e.target.reset() }
    setUploading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this portfolio item?')) return
    await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
    fetchPortfolios()
  }

  if (status === 'loading' || loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>{session?.user?.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#888' }}>Architect</div>
        </div>
        <nav>
          <Link href="/architect/dashboard" className="dash-nav-item">📊 Dashboard</Link>
          <Link href="/architect/portfolio" className="dash-nav-item active">🎨 Portfolio</Link>
          <Link href="/architect/proposals" className="dash-nav-item">📋 My Proposals</Link>
          <Link href="/architect/contracts" className="dash-nav-item">📄 Contracts</Link>
          <Link href="/architect/messages" className="dash-nav-item">💬 Messages</Link>
          <Link href="/architect/verification" className="dash-nav-item">🛡️ Verification</Link>
          <Link href="/architect/settings" className="dash-nav-item">⚙️ Settings</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Portfolio Manager 🎨</h1>
            <p>Showcase your best architectural work to attract clients.</p>
          </div>
          <button className="btn-solid-sm" onClick={() => setShowForm(!showForm)} style={{ marginTop: '4px', cursor: 'pointer', border: 'none', fontSize: '0.9rem' }}>
            {showForm ? '✕ Cancel' : '+ Add Project'}
          </button>
        </div>

        {error && <div className="msg-error">{error}</div>}
        {success && <div className="msg-success">{success}</div>}

        {/* Add Form */}
        {showForm && (
          <div className="form-card" style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Add Portfolio Item</h3>
            <form onSubmit={handleAdd}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Project Title *</label>
                  <input name="title" className="form-control" placeholder="e.g. 4-Bedroom Duplex, Lekki" required />
                </div>
                <div className="form-group">
                  <label>Project Type</label>
                  <select name="projectType" className="form-control">
                    <option value="">Select Type</option>
                    {['Residential', 'Commercial', 'Industrial', 'Renovation', 'Landscape', 'Interior'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input name="imageUrl" className="form-control" type="url" placeholder="https://images.unsplash.com/..." required />
                <small style={{ color: '#888', fontSize: '0.8rem' }}>Paste a public image URL (Unsplash, your portfolio site, etc.)</small>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Location</label>
                  <input name="location" className="form-control" placeholder="e.g. Lagos, Nigeria" />
                </div>
                <div className="form-group">
                  <label>Year Completed</label>
                  <input name="year" className="form-control" type="number" placeholder="e.g. 2023" min="1990" max="2026" />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" className="form-control" rows={3} placeholder="Brief description of the project..." style={{ resize: 'vertical' }}></textarea>
              </div>

              <button type="submit" className="btn-full" disabled={uploading} style={{ maxWidth: '200px' }}>
                {uploading ? 'Saving...' : '💾 Save Project'}
              </button>
            </form>
          </div>
        )}

        {/* Portfolio Grid */}
        {portfolios.length > 0 ? (
          <div className="portfolio-gallery">
            {portfolios.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', transition: '0.3s' }}>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(217,4,41,0.85)', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                  >
                    🗑 Delete
                  </button>
                  {p.projectType && (
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {p.projectType}
                    </span>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{ marginBottom: '4px', fontSize: '1rem' }}>{p.title}</h4>
                  <div style={{ fontSize: '0.82rem', color: '#888', display: 'flex', gap: '12px' }}>
                    {p.location && <span>📍 {p.location}</span>}
                    {p.year && <span>📅 {p.year}</span>}
                  </div>
                  {p.description && <p style={{ marginTop: '8px', fontSize: '0.88rem', color: '#666', lineHeight: 1.5 }}>{p.description}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h3>No portfolio items yet</h3>
            <p>Add your first project to start attracting clients.</p>
            <button className="btn-primary-lg" onClick={() => setShowForm(true)} style={{ marginTop: '16px', border: 'none', cursor: 'pointer' }}>+ Add Your First Project</button>
          </div>
        )}
      </div>
    </div>
  )
}
