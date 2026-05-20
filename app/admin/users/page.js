import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminUserActions from './AdminUserActions'

export const metadata = { title: 'Manage Users | Admin' }

const S = {
  th: { padding: '12px 20px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#7c8db5', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap' },
  td: { padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#c5cde8', fontSize: '0.88rem' },
}

function Badge({ type, label }) {
  const colors = {
    admin: { bg: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' },
    architect: { bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' },
    client: { bg: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' },
    verified: { bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' },
    pending: { bg: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.25)' },
  }
  const c = colors[type] || colors.client
  return <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, ...c }}>{label}</span>
}

export default async function AdminUsersPage({ searchParams }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')

  const search = searchParams?.search || ''
  const role = searchParams?.role || ''

  const users = await prisma.user.findMany({
    where: {
      ...(search ? { OR: [{ fullName: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] } : {}),
      ...(role ? { role } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px' }}>Manage Users</h1>
      <p style={{ color: '#7c8db5', fontSize: '0.9rem', marginBottom: '24px' }}>Search, filter, and manage all {users.length} platform users.</p>

      {/* Filter bar */}
      <form style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#7c8db5', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Search</label>
            <input name="search" defaultValue={search} placeholder="Name or email..."
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 14px', color: 'white', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ minWidth: '140px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#7c8db5', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role</label>
            <select name="role" defaultValue={role}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 14px', color: 'white', fontSize: '0.88rem', outline: 'none' }}>
              <option value="">All Roles</option>
              <option value="client">Client</option>
              <option value="architect">Architect</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '9px 22px', background: 'linear-gradient(135deg,#d4af37,#f0c840)', border: 'none', borderRadius: '8px', color: '#0a192f', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
            Search
          </button>
        </div>
      </form>

      {/* Table */}
      <div style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>All Users</span>
          <span style={{ color: '#7c8db5', fontSize: '0.82rem' }}>{users.length} result{users.length !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name','Email','Role','Verified','Joined','Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={S.td}><strong style={{ color: 'white' }}>{u.fullName}</strong></td>
                  <td style={{ ...S.td, fontSize: '0.82rem' }}>{u.email}</td>
                  <td style={S.td}><Badge type={u.role} label={u.role} /></td>
                  <td style={S.td}>{u.isVerified ? <Badge type="verified" label="✔ Yes" /> : <Badge type="pending" label="No" />}</td>
                  <td style={{ ...S.td, fontSize: '0.8rem', color: '#7c8db5' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={S.td}><AdminUserActions userId={u.id} currentRole={u.role} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
