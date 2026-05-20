import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export default async function ArchitectPaymentsPage() {
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
          <Link href="/architect/contracts" className="dash-nav-item">📄 Contracts</Link>
          <Link href="/architect/payments" className="dash-nav-item active">💰 Payments</Link>
          <Link href="/architect/messages" className="dash-nav-item">💬 Messages</Link>
          <Link href="/architect/verification" className="dash-nav-item">🛡️ Verification</Link>
          <Link href="/architect/settings" className="dash-nav-item">⚙️ Settings</Link>
        </nav>
      </aside>
      <div className="dash-content">
        <div className="page-header"><h1>💰 Payments</h1><p>Track your earnings and payment history.</p></div>
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          {[
            { icon: '💰', num: '₦0', label: 'Total Earned' },
            { icon: '⏳', num: '₦0', label: 'Pending Payout' },
            { icon: '✅', num: '0', label: 'Completed Jobs' },
            { icon: '📅', num: '—', label: 'Next Payout' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="empty-state">
          <span className="empty-icon">🔨</span>
          <h3>Payment system coming soon</h3>
          <p>We&apos;re integrating with Paystack and Flutterwave for seamless Nigerian payments.</p>
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="architect" />
    </div>
  )
}
