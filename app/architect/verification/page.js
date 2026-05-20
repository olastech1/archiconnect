'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ArchitectVerificationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      fetch('/api/architect/profile').then(r => r.json()).then(data => setProfile(data.profile))
    }
  }, [status])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    const formData = new FormData(e.target)
    const data = {
      arconNumber: formData.get('arconNumber'),
      niaNumber: formData.get('niaNumber'),
      bio: formData.get('bio'),
      specialization: formData.get('specialization'),
      experienceYears: parseInt(formData.get('experienceYears')) || null,
      state: formData.get('state'),
      verificationStatus: 'pending',
    }
    const res = await fetch('/api/architect/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const result = await res.json()
    if (result.error) { setError(result.error) }
    else { setSuccess('✅ Credentials submitted! An admin will review your application within 24–48 hours.') }
    setLoading(false)
  }

  const allStates = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']

  if (status === 'loading' || !profile) return <div className="loading-spinner"><div className="spinner"></div></div>

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
          <Link href="/architect/verification" className="dash-nav-item active">🛡️ Verification</Link>
          <Link href="/architect/settings" className="dash-nav-item">⚙️ Settings</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div className="page-header">
          <h1>Professional Verification 🛡️</h1>
          <p>Submit your NIA/ARCON credentials to become a verified architect on the platform.</p>
        </div>

        {/* Status Card */}
        <div className={`form-card ${profile.verificationStatus === 'verified' ? 'msg-success' : profile.verificationStatus === 'pending' ? 'msg-info' : 'msg-error'}`}
          style={{ marginBottom: '24px', borderRadius: '12px' }}>
          {profile.verificationStatus === 'verified' && '✅ Your account is verified! Clients can now send you project invites.'}
          {profile.verificationStatus === 'pending' && '⏳ Your application is under review. You will be notified within 24–48 hours.'}
          {profile.verificationStatus === 'rejected' && '❌ Your application was rejected. Please re-submit with correct credentials.'}
          {profile.verificationStatus === 'unverified' && '⚠️ Not verified. Fill the form below to apply for verification.'}
        </div>

        {error && <div className="msg-error">{error}</div>}
        {success && <div className="msg-success">{success}</div>}

        <div className="form-card">
          <h3 style={{ marginBottom: '20px', fontSize: '1.05rem' }}>Submit Your Credentials</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2col">
              <div className="form-group">
                <label>ARCON Registration Number *</label>
                <input name="arconNumber" className="form-control" placeholder="e.g. ARCON/2019/1234" defaultValue={profile.arconNumber || ''} required />
              </div>
              <div className="form-group">
                <label>NIA Membership Number</label>
                <input name="niaNumber" className="form-control" placeholder="e.g. NIA/LAG/2020/5678" defaultValue={profile.niaNumber || ''} />
              </div>
            </div>

            <div className="grid-2col">
              <div className="form-group">
                <label>Years of Experience</label>
                <input name="experienceYears" className="form-control" type="number" min="0" max="60" placeholder="e.g. 8" defaultValue={profile.experienceYears || ''} />
              </div>
              <div className="form-group">
                <label>Primary State of Practice</label>
                <select name="state" className="form-control" defaultValue={profile.state || ''}>
                  <option value="">Select State</option>
                  {allStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Specialization (comma-separated)</label>
              <input name="specialization" className="form-control" placeholder="e.g. Residential, Commercial, Renovation" defaultValue={profile.specialization || ''} />
            </div>

            <div className="form-group">
              <label>Professional Bio</label>
              <textarea name="bio" className="form-control" rows={5} style={{ resize: 'vertical' }}
                placeholder="Describe your professional background, design philosophy, and notable projects..."
                defaultValue={profile.bio || ''} />
            </div>

            <button type="submit" className="btn-full" disabled={loading} style={{ maxWidth: '280px' }}>
              {loading ? 'Submitting...' : '🛡️ Submit for Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
