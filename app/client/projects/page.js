import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'My Projects' }

export default async function ClientProjectsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'client') redirect('/login')

  const client = await prisma.clientProfile.findUnique({
    where: { userId: parseInt(session.user.id) },
    include: {
      projects: {
        include: { proposals: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const projects = client?.projects || []

  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>{session.user.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#888' }}>Client Account</div>
        </div>
        <nav>
          <Link href="/client/dashboard" className="dash-nav-item">📊 Dashboard</Link>
          <Link href="/client/projects" className="dash-nav-item active">📁 My Projects</Link>
          <Link href="/client/project-new" className="dash-nav-item">➕ Post Project</Link>
          <Link href="/client/proposals" className="dash-nav-item">📋 Proposals</Link>
          <Link href="/client/messages" className="dash-nav-item">💬 Messages</Link>
          <Link href="/client/contracts" className="dash-nav-item">📄 Contracts</Link>
          <div className="dash-nav-divider" />
          <Link href="/marketplace" className="dash-nav-item">🔍 Browse Architects</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>My Projects 📁</h1>
            <p>Manage all your posted projects and view incoming proposals.</p>
          </div>
          <Link href="/client/project-new" className="btn-solid-sm" style={{ marginTop: '4px' }}>+ Post New</Link>
        </div>

        {projects.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {projects.map(p => (
              <div key={p.id} className="form-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#0a192f' }}>{p.title}</h3>
                    <span className={`badge badge-${p.status === 'open' ? 'green' : p.status === 'awarded' ? 'blue' : 'gray'}`}>
                      {p.status}
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '12px' }}>
                    {p.description?.slice(0, 180)}{p.description?.length > 180 ? '...' : ''}
                  </p>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#888', flexWrap: 'wrap' }}>
                    {p.projectType && <span>🏗 {p.projectType}</span>}
                    {p.state && <span>📍 {p.state}</span>}
                    {p.budgetMin && <span>💰 ₦{Number(p.budgetMin).toLocaleString()} – ₦{Number(p.budgetMax || 0).toLocaleString()}</span>}
                    <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', minWidth: '140px' }}>
                  <div style={{ textAlign: 'center', background: '#f0f9ff', borderRadius: '8px', padding: '10px 20px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a192f' }}>{p.proposals.length}</div>
                    <div style={{ fontSize: '0.78rem', color: '#888' }}>Proposal{p.proposals.length !== 1 ? 's' : ''}</div>
                  </div>
                  <Link href={`/client/projects/${p.id}`} className="btn-solid-sm" style={{ textAlign: 'center' }}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No projects posted yet</h3>
            <p>Post your first project and start receiving proposals from verified architects.</p>
            <Link href="/client/project-new" className="btn-primary-lg" style={{ marginTop: '20px', display: 'inline-block' }}>Post a Project</Link>
          </div>
        )}
      </div>
    </div>
  )
}
