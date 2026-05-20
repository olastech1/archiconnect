import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminVerifyActions from './AdminVerifyActions'

export const metadata = { title: 'Admin — Verifications' }

async function getPendingArchitects() {
  return await prisma.architectProfile.findMany({
    where: { verificationStatus: { in: ['pending', 'unverified'] } },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  })
}

async function getVerifiedArchitects() {
  return await prisma.architectProfile.findMany({
    where: { verificationStatus: 'verified' },
    include: { user: true },
    orderBy: { updatedAt: 'desc' },
    take: 20,
  })
}

export default async function AdminVerificationsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/login')

  const [pending, verified] = await Promise.all([getPendingArchitects(), getVerifiedArchitects()])

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
          <Link href="/admin/verifications" className="dash-nav-item active">🛡️ Verifications</Link>
          <Link href="/admin/transactions" className="dash-nav-item">💳 Transactions</Link>
          <Link href="/admin/blogs" className="dash-nav-item">📝 Blog Posts</Link>
          <Link href="/admin/settings" className="dash-nav-item">⚙️ Settings</Link>
          <div className="dash-nav-divider" />
          <Link href="/" className="dash-nav-item" style={{ color: '#888' }}>↗ View Public Site</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div className="page-header">
          <h1>Architect Verifications 🛡️</h1>
          <p>Review and approve architect credentials before they go live.</p>
        </div>

        {/* Pending */}
        <div className="data-table-wrapper" style={{ marginBottom: '30px' }}>
          <div className="data-table-header">
            <h3>⏳ Pending Review ({pending.length})</h3>
          </div>
          {pending.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Architect</th>
                  <th>Email</th>
                  <th>ARCON No.</th>
                  <th>NIA No.</th>
                  <th>State</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.user.fullName}</strong></td>
                    <td style={{ fontSize: '0.85rem' }}>{p.user.email}</td>
                    <td>{p.arconNumber || <span style={{ color: '#ccc' }}>—</span>}</td>
                    <td>{p.niaNumber || <span style={{ color: '#ccc' }}>—</span>}</td>
                    <td>{p.state || '—'}</td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(p.user.createdAt).toLocaleDateString()}</td>
                    <td><AdminVerifyActions profileId={p.id} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">✅</div>
              <h3>All caught up!</h3>
              <p>No architects pending verification.</p>
            </div>
          )}
        </div>

        {/* Verified */}
        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>✅ Verified Architects ({verified.length})</h3>
          </div>
          {verified.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Architect</th>
                  <th>Email</th>
                  <th>ARCON No.</th>
                  <th>NIA No.</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {verified.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.user.fullName}</strong></td>
                    <td style={{ fontSize: '0.85rem' }}>{p.user.email}</td>
                    <td>{p.arconNumber || '—'}</td>
                    <td>{p.niaNumber || '—'}</td>
                    <td>{p.state || '—'}</td>
                    <td>
                      <AdminVerifyActions profileId={p.id} currentStatus="verified" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p>No verified architects yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
