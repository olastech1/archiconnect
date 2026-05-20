import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export default async function ClientContractsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'client') redirect('/login')
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
          <Link href="/client/project-new" className="dash-nav-item">➕ Post Project</Link>
          <Link href="/client/proposals" className="dash-nav-item">📋 Proposals</Link>
          <Link href="/client/messages" className="dash-nav-item">💬 Messages</Link>
          <Link href="/client/contracts" className="dash-nav-item active">📄 Contracts</Link>
          <div className="dash-nav-divider" />
          <Link href="/marketplace" className="dash-nav-item">🔍 Browse Architects</Link>
        </nav>
      </aside>
      <div className="dash-content">
        <div className="page-header"><h1>📄 Contracts</h1><p>View and manage your active and completed contracts.</p></div>
        <div className="empty-state" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="empty-icon">🔨</span>
          <h3>Coming Soon</h3>
          <p>Contract management is under development and will be available soon.</p>
          <Link href="/client/dashboard" className="btn-primary-lg" style={{ marginTop: '20px', display: 'inline-block' }}>← Back to Dashboard</Link>
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="client" />
    </div>
  )
}
