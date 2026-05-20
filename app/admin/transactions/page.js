import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export default async function AdminTransactionsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/login')
  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>{session.user.name}</div>
          <span style={{ fontSize: '0.7rem', background: '#d4af37', color: '#0a192f', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>ADMIN</span>
        </div>
        <nav>
          <Link href="/admin/dashboard" className="dash-nav-item">📊 Overview</Link>
          <Link href="/admin/users" className="dash-nav-item">👥 Manage Users</Link>
          <Link href="/admin/verifications" className="dash-nav-item">🛡️ Verifications</Link>
          <Link href="/admin/transactions" className="dash-nav-item active">💳 Transactions</Link>
          <Link href="/admin/blogs" className="dash-nav-item">📝 Blog Posts</Link>
          <Link href="/admin/settings" className="dash-nav-item">⚙️ Settings</Link>
          <div className="dash-nav-divider" />
          <Link href="/" className="dash-nav-item" style={{ color: '#888' }}>↗ View Public Site</Link>
        </nav>
      </aside>
      <div className="dash-content">
        <div className="page-header"><h1>💳 Transactions</h1><p>Platform revenue, payouts, and financial overview.</p></div>
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          {[
            { icon: '💰', num: '₦0', label: 'Total Revenue' },
            { icon: '📤', num: '₦0', label: 'Total Payouts' },
            { icon: '⏳', num: '₦0', label: 'Pending' },
            { icon: '📊', num: '0%', label: 'Platform Fee Rate' },
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
          <h3>Payment integration coming soon</h3>
          <p>Paystack and Flutterwave integration is in progress. Transaction history will appear here.</p>
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="admin" />
    </div>
  )
}
