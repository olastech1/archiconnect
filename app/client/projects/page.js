import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

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
          <Link href="/client/settings" className="dash-nav-item">⚙️ Settings</Link>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {projects.map(p => (
              <div key={p.id} className="glass-panel hover-glass" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#0a192f', fontWeight: 800, margin: 0, lineHeight: 1.4 }}>{p.title}</h3>
                  <span className={`badge badge-${p.status === 'open' ? 'green' : p.status === 'awarded' ? 'blue' : 'gray'}`} style={{ whiteSpace: 'nowrap' }}>
                    {p.status}
                  </span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.6, margin: 0, flex: 1 }}>
                  {p.description?.slice(0, 140)}{p.description?.length > 140 ? '...' : ''}
                </p>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: '#4b5563', flexWrap: 'wrap' }}>
                  {p.projectType && <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>🏗 {p.projectType}</span>}
                  {p.state && <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>📍 {p.state}</span>}
                  {p.budgetMin && <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>💰 ₦{Number(p.budgetMin).toLocaleString()} – ₦{Number(p.budgetMax || 0).toLocaleString()}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ background: '#f0f9ff', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.8rem' }}>
                      {p.proposals.length} Proposal{p.proposals.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Link href={`/client/projects/${p.id}`} style={{ color: '#007f5f', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none' }}>View Details →</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state glass-panel">
            <div className="empty-icon">📂</div>
            <h3>No projects posted yet</h3>
            <p>Post your first project and start receiving proposals from verified architects.</p>
            <Link href="/client/project-new" className="btn-primary-lg" style={{ marginTop: '20px', display: 'inline-block' }}>Post a Project</Link>
          </div>
        )}
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="client" />
    </div>
  )
}
