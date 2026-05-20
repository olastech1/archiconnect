import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0a192f' }}>
            {session.user.name}
          </div>
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
          <Link href="/notifications" className="dash-nav-item">🔔 Notifications</Link>
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

        {/* Recent Projects */}
        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>Recent Projects</h3>
            <Link href="/client/project-new" className="btn-solid-sm">+ Post New</Link>
          </div>
          {client?.projects && client.projects.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Type</th>
                  <th>State</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {client.projects.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.title}</strong></td>
                    <td>{p.projectType || '—'}</td>
                    <td>{p.state || '—'}</td>
                    <td><span className={`badge badge-${p.status === 'open' ? 'green' : p.status === 'closed' ? 'gray' : 'blue'}`}>{p.status}</span></td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td><Link href={`/client/projects/${p.id}`} style={{ color: '#007f5f', fontWeight: 700, fontSize: '0.85rem' }}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>No projects yet</h3>
              <p>Post your first project to start receiving proposals from verified architects.</p>
              <Link href="/client/project-new" className="btn-primary-lg" style={{ marginTop: '16px', display: 'inline-block' }}>Post a Project</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
