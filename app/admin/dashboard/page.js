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

  let userCount = 0, architectCount = 0, projectCount = 0, pendingVerifications = 0
  let usersLastMonth = 0, projectsLastMonth = 0
  let recentActivity = []
  
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    ;[userCount, architectCount, projectCount, pendingVerifications, usersLastMonth, projectsLastMonth] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'architect' } }),
      prisma.project.count(),
      prisma.architectProfile.count({ where: { verificationStatus: 'pending' } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.project.count({ where: { createdAt: { gte: thirtyDaysAgo } } })
    ])
    
    // Fetch recent users and projects to build a unified activity feed
    const [recentUsers, recentProjects] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, fullName: true, role: true, createdAt: true } }),
      prisma.project.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true, createdAt: true, client: { select: { user: { select: { fullName: true } } } } } })
    ])

    recentActivity = [
      ...recentUsers.map(u => ({ id: `u-${u.id}`, icon: u.role === 'architect' ? '🏛️' : '👤', text: `New ${u.role} registered: ${u.fullName}`, date: u.createdAt })),
      ...recentProjects.map(p => ({ id: `p-${p.id}`, icon: '📁', text: `New project posted: ${p.title} by ${p.client?.user?.fullName || 'Unknown'}`, date: p.createdAt }))
    ].sort((a, b) => b.date - a.date).slice(0, 8)
    
  } catch (err) {
    console.error('Error loading dashboard stats:', err)
  }

  const userGrowth = userCount > 0 ? ((usersLastMonth / userCount) * 100).toFixed(1) : 0;
  const projectGrowth = projectCount > 0 ? ((projectsLastMonth / projectCount) * 100).toFixed(1) : 0;

  const stats = [
    { icon: '👥', num: userCount, label: 'Total Users', color: '#6ee7b7', trend: `+${userGrowth}% this month` },
    { icon: '🏛️', num: architectCount, label: 'Architects', color: '#a5b4fc', trend: '' },
    { icon: '📁', num: projectCount, label: 'Projects Posted', color: '#67e8f9', trend: `+${projectGrowth}% this month` },
    { icon: '⏳', num: pendingVerifications, label: 'Pending Reviews', color: pendingVerifications > 0 ? '#f87171' : '#fcd34d', alert: pendingVerifications > 0, trend: 'Requires attention' },
  ]

  const quickActions = [
    { href: '/admin/broadcasts', icon: '📢', label: 'Send Broadcast', desc: 'Notify users globally' },
    { href: '/admin/projects', icon: '📁', label: 'Project Oversight', desc: 'Monitor active projects' },
    { href: '/admin/verifications', icon: '🛡️', label: 'Review Verifications', desc: `${pendingVerifications} pending` },
  ]

  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px', color: 'white' }}>Platform Overview</h1>
      <p style={{ color: '#7c8db5', fontSize: '0.9rem', marginBottom: '28px' }}>
        Advanced real-time analytics and platform activity.
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
            <div style={{ fontSize: '0.82rem', color: 'white', marginTop: '6px', fontWeight: 700 }}>{s.label}</div>
            {s.trend && <div style={{ fontSize: '0.75rem', color: s.alert ? '#fca5a5' : '#10b981', marginTop: '4px', fontWeight: 600 }}>{s.trend}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }} className="admin-main-grid">
        {/* Left Column */}
        <div>
          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '28px' }} className="admin-quick-grid">
            {quickActions.map(a => (
              <Link key={a.href} href={a.href} style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', textDecoration: 'none', display: 'block', transition: '0.2s' }} className="hover-glass">
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{a.icon}</div>
                <div style={{ fontWeight: 800, color: 'white', fontSize: '0.9rem', marginBottom: '3px' }}>{a.label}</div>
                <div style={{ color: '#7c8db5', fontSize: '0.8rem' }}>{a.desc}</div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Right Column: Activity Feed */}
        <div style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', fontSize: '1.2rem', lineHeight: 1 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#c5cde8', lineHeight: 1.4, marginBottom: '4px' }}>{item.text}</div>
                    <div style={{ fontSize: '0.7rem', color: '#7c8db5', fontWeight: 600 }}>{new Date(item.date).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#7c8db5', fontSize: '0.85rem' }}>No recent activity to display.</p>
          )}
        </div>
      </div>
    </div>
  )
}
