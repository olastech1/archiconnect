import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export default async function AdminBlogsPage() {
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
          <Link href="/admin/transactions" className="dash-nav-item">💳 Transactions</Link>
          <Link href="/admin/blogs" className="dash-nav-item active">📝 Blog Posts</Link>
          <Link href="/admin/settings" className="dash-nav-item">⚙️ Settings</Link>
          <div className="dash-nav-divider" />
          <Link href="/" className="dash-nav-item" style={{ color: '#888' }}>↗ View Public Site</Link>
        </nav>
      </aside>
      <div className="dash-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><h1>📝 Blog Posts</h1><p>Manage platform content and publish articles.</p></div>
          <button className="btn-solid-sm" style={{ border: 'none', cursor: 'not-allowed', opacity: 0.6 }}>+ New Post</button>
        </div>
        <div className="empty-state" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="empty-icon">🔨</span>
          <h3>CMS Coming Soon</h3>
          <p>A built-in content management system for publishing blog posts is under development.</p>
          <Link href="/blog" className="btn-primary-lg" style={{ marginTop: '20px', display: 'inline-block' }}>View Public Blog →</Link>
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="admin" />
    </div>
  )
}
