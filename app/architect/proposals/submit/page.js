'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

function SubmitProposalForm() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const projectId = searchParams.get('project')
  const [project, setProject] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (projectId) fetch(`/api/projects/${projectId}`).then(r => r.json()).then(setProject)
  }, [projectId])

  if (status === 'loading') return <div className="loading-spinner"><div className="spinner"></div></div>
  if (status === 'unauthenticated') { router.push('/login'); return null }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    const formData = new FormData(e.target)
    const res = await fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: parseInt(projectId),
        coverLetter: formData.get('coverLetter'),
        proposedFee: formData.get('proposedFee'),
        timeline: formData.get('timeline'),
      }),
    })
    const result = await res.json()
    if (result.error) { setError(result.error); setLoading(false) }
    else { setSuccess('✅ Proposal submitted successfully!'); setTimeout(() => router.push('/architect/proposals'), 1500) }
  }

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
          <Link href="/architect/proposals" className="dash-nav-item active">📋 My Proposals</Link>
          <Link href="/architect/messages" className="dash-nav-item">💬 Messages</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div style={{ marginBottom: '20px' }}>
          <Link href="/architect/proposals" style={{ color: '#888', fontSize: '0.9rem' }}>← Back to Proposals</Link>
        </div>

        <div className="page-header">
          <h1>Submit a Proposal ✍️</h1>
          <p>Write a compelling proposal to win this project.</p>
        </div>

        {project && (
          <div className="form-card" style={{ marginBottom: '24px', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <h3 style={{ color: '#0a192f', marginBottom: '8px' }}>{project.title}</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#555', flexWrap: 'wrap' }}>
              {project.projectType && <span>🏗 {project.projectType}</span>}
              {project.state && <span>📍 {project.state}</span>}
              {project.budgetMin && <span>💰 Budget: ₦{Number(project.budgetMin).toLocaleString()} – ₦{Number(project.budgetMax || 0).toLocaleString()}</span>}
            </div>
            {project.description && <p style={{ marginTop: '10px', color: '#444', fontSize: '0.9rem', lineHeight: 1.7 }}>{project.description}</p>}
          </div>
        )}

        {error && <div className="msg-error">{error}</div>}
        {success && <div className="msg-success">{success}</div>}

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Cover Letter *</label>
              <textarea name="coverLetter" className="form-control" rows={7} required style={{ resize: 'vertical' }}
                placeholder="Explain your approach, relevant experience, and why you are the best fit for this project..." />
            </div>
            <div className="grid-2col">
              <div className="form-group">
                <label>Proposed Design Fee (₦) *</label>
                <input name="proposedFee" className="form-control" type="number" placeholder="e.g. 500000" required />
              </div>
              <div className="form-group">
                <label>Estimated Timeline *</label>
                <input name="timeline" className="form-control" placeholder="e.g. 6 weeks, 3 months" required />
              </div>
            </div>
            <button type="submit" className="btn-full" disabled={loading} style={{ maxWidth: '250px' }}>
              {loading ? 'Submitting...' : '🚀 Submit Proposal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SubmitProposalPage() {
  return (
    <Suspense fallback={<div className="loading-spinner"><div className="spinner"></div></div>}>
      <SubmitProposalForm />
    </Suspense>
  )
}
