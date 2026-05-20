import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

function ComingSoonDash({ role, active, title, emoji, description, sidebarLinks }) {
  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>My Account</div>
          <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '3px', textTransform: 'capitalize' }}>{role}</div>
        </div>
        <nav>{sidebarLinks}</nav>
      </aside>
      <div className="dash-content">
        <div className="page-header">
          <h1>{emoji} {title}</h1>
          <p>{description}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔨</div>
            <h2 style={{ color: '#0a192f', marginBottom: '12px', fontSize: '1.4rem' }}>Coming Soon</h2>
            <p style={{ color: '#666', maxWidth: '400px', lineHeight: 1.7, marginBottom: '28px' }}>
              This feature is currently under development and will be available in the next update. Stay tuned!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`/${role}/dashboard`} className="btn-primary-lg" style={{ fontSize: '0.95rem', padding: '12px 28px' }}>← Back to Dashboard</Link>
            </div>
          </div>
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role={role} />
    </div>
  )
}

export default async function ClientMessagesPage() {
  const session = await auth()
  if (!session || session.user.role !== 'client') redirect('/login')
  return (
    <ComingSoonDash
      role="client" emoji="💬" title="Messages"
      description="Communicate securely with architects about your projects."
      sidebarLinks={<>
        <Link href="/client/dashboard" className="dash-nav-item">📊 Dashboard</Link>
        <Link href="/client/projects" className="dash-nav-item">📁 My Projects</Link>
        <Link href="/client/project-new" className="dash-nav-item">➕ Post Project</Link>
        <Link href="/client/proposals" className="dash-nav-item">📋 Proposals</Link>
        <Link href="/client/messages" className="dash-nav-item active">💬 Messages</Link>
        <Link href="/client/contracts" className="dash-nav-item">📄 Contracts</Link>
        <div className="dash-nav-divider" />
        <Link href="/marketplace" className="dash-nav-item">🔍 Browse Architects</Link>
      </>}
    />
  )
}
