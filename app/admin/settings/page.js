import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export default async function AdminSettingsPage() {
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
          <Link href="/admin/blogs" className="dash-nav-item">📝 Blog Posts</Link>
          <Link href="/admin/settings" className="dash-nav-item active">⚙️ Settings</Link>
          <div className="dash-nav-divider" />
          <Link href="/" className="dash-nav-item" style={{ color: '#888' }}>↗ View Public Site</Link>
        </nav>
      </aside>
      <div className="dash-content">
        <div className="page-header"><h1>⚙️ Platform Settings</h1><p>Configure platform-wide settings and preferences.</p></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { icon: '💰', title: 'Platform Fee', desc: 'Set the commission % charged on successful contracts', value: '5%' },
            { icon: '📧', title: 'Email Notifications', desc: 'Configure automated email triggers', value: 'Enabled' },
            { icon: '🛡️', title: 'Auto-Verification', desc: 'Automatically approve architects with valid ARCON numbers', value: 'Disabled' },
            { icon: '🔒', title: 'Maintenance Mode', desc: 'Temporarily take the platform offline for updates', value: 'Off' },
          ].map(setting => (
            <div key={setting.title} className="form-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ fontSize: '1.8rem' }}>{setting.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0a192f', marginBottom: '3px' }}>{setting.title}</div>
                  <div style={{ color: '#888', fontSize: '0.88rem' }}>{setting.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span className="badge badge-gray">{setting.value}</span>
                <button style={{ background: '#f0f0f0', border: 'none', padding: '7px 14px', borderRadius: '6px', cursor: 'not-allowed', fontWeight: 700, fontSize: '0.82rem', color: '#666', opacity: 0.7 }}>Edit</button>
              </div>
            </div>
          ))}
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="admin" />
    </div>
  )
}
