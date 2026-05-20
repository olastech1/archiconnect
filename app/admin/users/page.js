import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminUserActions from './AdminUserActions'

export const metadata = { title: 'Admin — Manage Users' }

export default async function AdminUsersPage({ searchParams }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/login')

  const search = searchParams?.search || ''
  const role = searchParams?.role || ''

  const users = await prisma.user.findMany({
    where: {
      ...(search ? { fullName: { contains: search, mode: 'insensitive' } } : {}),
      ...(role ? { role } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>{session.user.name}</div>
          <span style={{ fontSize: '0.7rem', background: '#d4af37', color: '#0a192f', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>ADMIN</span>
        </div>
        <nav>
          <Link href="/admin/dashboard" className="dash-nav-item">📊 Overview</Link>
          <Link href="/admin/users" className="dash-nav-item active">👥 Manage Users</Link>
          <Link href="/admin/verifications" className="dash-nav-item">🛡️ Verifications</Link>
          <Link href="/admin/transactions" className="dash-nav-item">💳 Transactions</Link>
          <Link href="/admin/blogs" className="dash-nav-item">📝 Blog Posts</Link>
          <Link href="/admin/settings" className="dash-nav-item">⚙️ Settings</Link>
          <div className="dash-nav-divider" />
          <Link href="/" className="dash-nav-item" style={{ color: '#888' }}>↗ View Public Site</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div className="page-header">
          <h1>Manage Users 👥</h1>
          <p>View, search and manage all platform users.</p>
        </div>

        {/* Filter Bar */}
        <form className="form-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#888', marginBottom: '5px', textTransform: 'uppercase' }}>Search</label>
              <input name="search" className="form-control" placeholder="Name or email..." defaultValue={search} style={{ marginBottom: 0 }} />
            </div>
            <div style={{ minWidth: '140px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#888', marginBottom: '5px', textTransform: 'uppercase' }}>Role</label>
              <select name="role" className="form-control" defaultValue={role} style={{ marginBottom: 0 }}>
                <option value="">All Roles</option>
                <option value="client">Client</option>
                <option value="architect">Architect</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn-solid-sm" style={{ marginBottom: '1px', border: 'none', cursor: 'pointer', padding: '11px 20px' }}>Filter</button>
          </div>
        </form>

        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>All Users</h3>
            <span className="results-count">{users.length} result{users.length !== 1 ? 's' : ''}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.fullName}</strong></td>
                  <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role === 'admin' ? 'blue' : u.role === 'architect' ? 'green' : 'gray'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.isVerified ? <span className="badge badge-green">✔ Yes</span> : <span className="badge badge-yellow">No</span>}</td>
                  <td style={{ fontSize: '0.82rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td><AdminUserActions userId={u.id} currentRole={u.role} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
