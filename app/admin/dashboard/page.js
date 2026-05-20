import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Admin Overview | ArchiConnect NG' }

function Badge({ type, label }) {
  const colors = {
    admin: { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' },
    architect: { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' },
    client: { background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' },
    verified: { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' },
    pending: { background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.25)' },
  }
  const c = colors[type] || colors.client
  return (
    <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, ...c }}>
      {label}
    </span>
  )
}

export default async function AdminDashboard() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')

  let userCount = 0, architectCount = 0, projectCount = 0, pendingVerifications = 0, recentUsers = []
  try {
    ;[userCount, architectCount, projectCount, pendingVerifications] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'architect' } }),
      prisma.project.count(),
      prisma.architectProfile.count({ where: { verificationStatus: 'pending' } }),
    ])
    recentUsers = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 10 })
  } catch {}

  const stats = [
    { icon: '👥', num: userCount, label: 'Total Users', color: '#6ee7b7' },
    { icon: '🏛️', num: architectCount, label: 'Architects', color: '#a5b4fc' },
    { icon: '📁', num: projectCount, label: 'Projects Posted', color: '#67e8f9' },
    { icon: '⏳', num: pendingVerifications, label: 'Pending Reviews', color: pendingVerifications > 0 ? '#f87171' : '#fcd34d', alert: pendingVerifications > 0 },
  ]

  const quickActions = [
    { href: '/admin/verifications', icon: '🛡️', label: 'Review Verifications', desc: `${pendingVerifications} pending` },
    { href: '/admin/users', icon: '👥', label: 'Manage Users', desc: `${userCount} total users` },
    { href: '/admin/settings', icon: '⚙️', label: 'Platform Settings', desc: 'Fees & config' },
  ]

  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px', color: 'white' }}>Platform Overview</h1>
      <p style={{ color: '#7c8db5', fontSize: '0.9rem', marginBottom: '28px' }}>
        Real-time stats and activity across ArchiConnect NG.
      </p>

      {/* Alert banner */}
      {pendingVerifications > 0 && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ color: '#fca5a5', fontSize: '0.9rem' }}>
            🔴 {pendingVerifications} architect verification{pendingVerifications > 1 ? 's' : ''} pending review
          </span>
          <Link href="/admin/verifications" style={{ color: '#f87171', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>
            Review Now →
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }} className="admin-stat-grid">
        {stats.map(s => (
          <div key={s.label} style={{ background: '#1a1d27', border: s.alert ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '22px 20px', borderLeft: s.alert ? '3px solid #f87171' : '3px solid rgba(212,175,55,0.3)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontSize: '0.82rem', color: '#7c8db5', marginTop: '6px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '28px' }} className="admin-quick-grid">
        {quickActions.map(a => (
          <Link key={a.href} href={a.href} style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{a.icon}</div>
            <div style={{ fontWeight: 800, color: 'white', fontSize: '0.9rem', marginBottom: '3px' }}>{a.label}</div>
            <div style={{ color: '#7c8db5', fontSize: '0.8rem' }}>{a.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent users table */}
      <div style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>Recent Registrations</span>
          <Link href="/admin/users" style={{ color: '#d4af37', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name', 'Email', 'Role', 'Verified', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#7c8db5', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <strong style={{ color: 'white', fontSize: '0.88rem' }}>{u.fullName}</strong>
                  </td>
                  <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#c5cde8', fontSize: '0.82rem' }}>{u.email}</td>
                  <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Badge type={u.role} label={u.role} />
                  </td>
                  <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {u.isVerified ? <Badge type="verified" label="✔ Yes" /> : <Badge type="pending" label="Pending" />}
                  </td>
                  <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#7c8db5', fontSize: '0.8rem' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#7c8db5' }}>No users yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
