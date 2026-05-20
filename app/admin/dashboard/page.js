import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export const metadata = { title: 'Admin Dashboard' }

async function getAdminStats() {
  try {
    const [userCount, architectCount, projectCount, pendingVerifications] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'architect' } }),
      prisma.project.count(),
      prisma.architectProfile.count({ where: { verificationStatus: 'pending' } }),
    ])
    const recentUsers = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 8 })
    return { userCount, architectCount, projectCount, pendingVerifications, recentUsers }
  } catch {
    return { userCount: 0, architectCount: 0, projectCount: 0, pendingVerifications: 0, recentUsers: [] }
  }
}

export default async function AdminDashboard() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/login')

  const { userCount, architectCount, projectCount, pendingVerifications, recentUsers } = await getAdminStats()

  return (
    <div className="dashboard-wrapper">
      {/* Admin Sidebar */}
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0a192f' }}>{session.user.name}</div>
          <span style={{ fontSize: '0.7rem', background: '#d4af37', color: '#0a192f', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>ADMIN</span>
        </div>
        <nav>
          <p className="dash-nav-section">Platform</p>
          <Link href="/admin/dashboard" className="dash-nav-item active">📊 Overview</Link>
          <Link href="/admin/users" className="dash-nav-item">👥 Manage Users</Link>
          <Link href="/admin/verifications" className="dash-nav-item">
            🛡️ Verifications
            {pendingVerifications > 0 && <span style={{ background: '#d90429', color: 'white', borderRadius: '50%', padding: '1px 7px', fontSize: '0.75rem', marginLeft: '8px', fontWeight: 800 }}>{pendingVerifications}</span>}
          </Link>
          <Link href="/admin/transactions" className="dash-nav-item">💳 Transactions</Link>
          <p className="dash-nav-section">Content</p>
          <Link href="/admin/blogs" className="dash-nav-item">📝 Blog Posts</Link>
          <Link href="/admin/settings" className="dash-nav-item">⚙️ Settings</Link>
          <div className="dash-nav-divider" />
          <Link href="/" className="dash-nav-item" style={{ color: '#888' }}>↗ View Public Site</Link>
        </nav>
      </aside>

      {/* Content */}
      <div className="dash-content">
        <div className="page-header">
          <h1>Admin Overview 📊</h1>
          <p>Platform health and activity at a glance.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-num">{userCount}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏛️</div>
            <div className="stat-num">{architectCount}</div>
            <div className="stat-label">Architects</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-num">{projectCount}</div>
            <div className="stat-label">Projects Posted</div>
          </div>
          <div className="stat-card" style={{ borderLeft: pendingVerifications > 0 ? '4px solid #d90429' : undefined }}>
            <div className="stat-icon">⏳</div>
            <div className="stat-num" style={{ color: pendingVerifications > 0 ? '#d90429' : undefined }}>{pendingVerifications}</div>
            <div className="stat-label">Pending Verifications</div>
          </div>
        </div>

        {pendingVerifications > 0 && (
          <div className="msg-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <span>🔔 {pendingVerifications} architect(s) awaiting verification review.</span>
            <Link href="/admin/verifications" style={{ fontWeight: 700, color: '#0c5460' }}>Review Now →</Link>
          </div>
        )}

        {/* Recent Users */}
        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>Recent Registrations</h3>
            <Link href="/admin/users" className="btn-solid-sm">View All Users</Link>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.fullName}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge badge-${u.role === 'admin' ? 'blue' : u.role === 'architect' ? 'green' : 'gray'}`}>{u.role}</span></td>
                    <td>{u.isVerified ? <span className="badge badge-green">✔ Yes</span> : <span className="badge badge-yellow">Pending</span>}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="admin" />
    </div>
  )
}
