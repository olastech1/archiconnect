import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export default async function ArchitectMessagesPage() {
  const session = await auth()
  if (!session || session.user.role !== 'architect') redirect('/login')
  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>{session.user.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#888' }}>Architect</div>
        </div>
        <nav>
          <Link href="/architect/dashboard" className="dash-nav-item">📊 Dashboard</Link>
          <Link href="/architect/portfolio" className="dash-nav-item">🎨 Portfolio</Link>
          <Link href="/architect/proposals" className="dash-nav-item">📋 My Proposals</Link>
          <Link href="/architect/messages" className="dash-nav-item active">💬 Messages</Link>
          <Link href="/architect/verification" className="dash-nav-item">🛡️ Verification</Link>
          <Link href="/architect/settings" className="dash-nav-item">⚙️ Settings</Link>
        </nav>
      </aside>
      <div className="dash-content">
        <div className="page-header"><h1>💬 Messages</h1><p>Communicate securely with your clients.</p></div>
        <div className="empty-state" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="empty-icon">🔨</span>
          <h3>Coming Soon</h3>
          <p>End-to-end encrypted messaging is under development. You&apos;ll be notified when it launches.</p>
          <Link href="/architect/dashboard" className="btn-primary-lg" style={{ marginTop: '20px', display: 'inline-block' }}>← Back to Dashboard</Link>
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="architect" />
    </div>
  )
}
