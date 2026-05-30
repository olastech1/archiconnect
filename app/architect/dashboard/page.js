import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export const metadata = { title: 'Architect Dashboard' }

async function getArchitectData(userId) {
  try {
    const profile = await prisma.architectProfile.findUnique({
      where: { userId },
      include: {
        portfolios: true,
        proposals: {
          include: { project: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        contracts: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    })
    return { profile }
  } catch { return { profile: null } }
}

export default async function ArchitectDashboard() {
  const session = await auth()
  if (!session || session.user.role !== 'architect') redirect('/login')

  const { profile } = await getArchitectData(parseInt(session.user.id))

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0a192f' }}>{session.user.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '3px' }}>Architect</div>
          {profile?.verificationStatus === 'verified'
            ? <span className="badge-verified-sm" style={{ display: 'inline-block', marginTop: '6px' }}>✔ NIA Verified</span>
            : <span className="badge badge-yellow" style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.75rem' }}>⏳ Pending Verification</span>
          }
        </div>
        <nav>
          <p className="dash-nav-section">Main</p>
          <Link href="/architect/dashboard" className="dash-nav-item active">📊 Dashboard</Link>
          <Link href="/architect/portfolio" className="dash-nav-item">🎨 Portfolio</Link>
          <Link href="/architect/proposals" className="dash-nav-item">📋 My Proposals</Link>
          <Link href="/architect/contracts" className="dash-nav-item">📄 Contracts</Link>
          <Link href="/architect/payments" className="dash-nav-item">💰 Payments</Link>
          <p className="dash-nav-section">Account</p>
          <Link href="/architect/messages" className="dash-nav-item">💬 Messages</Link>
          <Link href="/architect/verification" className="dash-nav-item">🛡️ Verification</Link>
          <Link href="/architect/settings" className="dash-nav-item">⚙️ Settings</Link>
          <div className="dash-nav-divider" />
          <Link href="/marketplace" className="dash-nav-item">🔍 Find Projects</Link>
        </nav>
      </aside>

      {/* Content */}
      <div className="dash-content">
        <div className="page-header">
          <h1>Welcome, {session.user.name?.split(' ')[0]}! 🏛️</h1>
          <p>Manage your portfolio, proposals, and projects.</p>
        </div>

        {/* Verification Alert */}
        {profile?.verificationStatus !== 'verified' && (
          <div className="msg-info" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ Your account is not yet verified. Complete verification to receive proposals.</span>
            <Link href="/architect/verification" style={{ color: '#0c5460', fontWeight: 700, marginLeft: '20px', whiteSpace: 'nowrap' }}>Verify Now →</Link>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎨</div>
            <div className="stat-num">{profile?.portfolios?.length || 0}</div>
            <div className="stat-label">Portfolio Items</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-num">{profile?.proposals?.length || 0}</div>
            <div className="stat-label">Proposals Sent</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-num">{profile?.contracts?.length || 0}</div>
            <div className="stat-label">Active Contracts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-num">5.0</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>

        {/* Recent Proposals as Responsive Cards */}
        <div style={{ marginTop: '30px' }}>
          <div className="data-table-header" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Proposals</h3>
            <Link href="/marketplace" className="btn-solid-sm">Find Projects</Link>
          </div>
          
          {profile?.proposals && profile.proposals.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {profile.proposals.map(p => (
                <div key={p.id} className="glass-panel hover-glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0a192f', lineHeight: 1.3 }}>{p.project?.title || 'Unknown Project'}</h4>
                    <span className={`badge badge-${p.status === 'accepted' ? 'green' : p.status === 'rejected' ? 'red' : 'yellow'}`} style={{ whiteSpace: 'nowrap' }}>{p.status}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', color: '#4b5563', fontWeight: 600 }}>💰 {p.proposedFee ? `₦${p.proposedFee.toLocaleString()}` : 'No Fee Set'}</span>
                    <span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', color: '#4b5563', fontWeight: 600 }}>⏱️ {p.timeline || 'TBD'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel" style={{ padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
              <span className="empty-icon" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}>📋</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0a192f', marginBottom: '8px' }}>No proposals yet</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Browse open projects and submit your first proposal.</p>
              <Link href="/marketplace" className="btn-primary-lg" style={{ marginTop: '20px', display: 'inline-block' }}>Find Projects</Link>
            </div>
          )}
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="architect" />
    </div>
  )
}
