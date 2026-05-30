import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export const metadata = { title: 'Client Dashboard' }

async function getClientData(userId) {
  try {
    const [client, projects, proposals] = await Promise.all([
      prisma.clientProfile.findUnique({
        where: { userId },
        include: { projects: { orderBy: { createdAt: 'desc' }, take: 5 } },
      }),
      prisma.project.count({ where: { client: { userId } } }),
      prisma.proposal.count({ where: { project: { client: { userId } } } }),
    ])
    return { client, projectCount: projects, proposalCount: proposals }
  } catch { return { client: null, projectCount: 0, proposalCount: 0 } }
}

export default async function ClientDashboard() {
  const session = await auth()
  if (!session || session.user.role !== 'client') redirect('/login')

  const { client, projectCount, proposalCount } = await getClientData(parseInt(session.user.id))

  return (
    <div className="dashboard-wrapper">
      {/* Desktop Sidebar */}
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0a192f' }}>{session.user.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '3px' }}>Client Account</div>
        </div>
        <nav>
          <p className="dash-nav-section">Main</p>
          <Link href="/client/dashboard" className="dash-nav-item active">📊 Dashboard</Link>
          <Link href="/client/projects" className="dash-nav-item">📁 My Projects</Link>
          <Link href="/client/project-new" className="dash-nav-item">➕ Post Project</Link>
          <Link href="/client/proposals" className="dash-nav-item">📋 Proposals</Link>
          <Link href="/client/contracts" className="dash-nav-item">📄 Contracts</Link>
          <p className="dash-nav-section">Communication</p>
          <Link href="/client/messages" className="dash-nav-item">💬 Messages</Link>
          <div className="dash-nav-divider" />
          <Link href="/marketplace" className="dash-nav-item">🔍 Browse Architects</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dash-content">
        <div className="page-header">
          <h1>Welcome back, {session.user.name?.split(' ')[0]}! 👋</h1>
          <p>Here&apos;s what&apos;s happening with your projects.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-num">{projectCount}</div>
            <div className="stat-label">Total Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-num">{proposalCount}</div>
            <div className="stat-label">Proposals Received</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏗️</div>
            <div className="stat-num">0</div>
            <div className="stat-label">Active Contracts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-num">0</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Recent Projects as Responsive Cards */}
        <div style={{ marginTop: '30px' }}>
          <div className="data-table-header" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Projects</h3>
            <Link href="/client/project-new" className="btn-solid-sm">+ Post New</Link>
          </div>
          
          {client?.projects && client.projects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {client.projects.map(p => (
                <div key={p.id} className="glass-panel hover-glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0a192f', lineHeight: 1.3 }}>{p.title}</h4>
                    <span className={`badge badge-${p.status === 'open' ? 'green' : p.status === 'closed' ? 'gray' : 'blue'}`} style={{ whiteSpace: 'nowrap' }}>{p.status}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', color: '#4b5563', fontWeight: 600 }}>{p.projectType || 'Standard'}</span>
                    <span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', color: '#4b5563', fontWeight: 600 }}>📍 {p.state || 'Anywhere'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                    <Link href={`/client/projects/${p.id}`} style={{ color: '#007f5f', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel" style={{ padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
              <span className="empty-icon" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}>📂</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0a192f', marginBottom: '8px' }}>No projects yet</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Post your first project to start receiving proposals from verified architects.</p>
              <Link href="/client/project-new" className="btn-primary-lg" style={{ marginTop: '20px', display: 'inline-block' }}>Post a Project</Link>
            </div>
          )}
        </div>

        {/* Quick Actions mobile-friendly */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
          <Link href="/client/project-new" className="btn-solid-sm">➕ Post a Project</Link>
          <Link href="/marketplace" className="btn-outline-sm">🔍 Browse Architects</Link>
        </div>

        <div className="dash-mobile-bottom-spacer" />
      </div>

      {/* Mobile Bottom Nav */}
      <DashboardMobileNav role="client" />
    </div>
  )
}
