import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMobileNav from '@/components/DashboardMobileNav'

export const metadata = { title: 'My Proposals | Client' }

export default async function ClientProposalsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'client') redirect('/login')

  const client = await prisma.clientProfile.findUnique({
    where: { userId: parseInt(session.user.id) },
    include: {
      projects: {
        include: {
          proposals: {
            include: { architectProfile: { include: { user: { select: { fullName: true } } } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  })

  const allProposals = client?.projects?.flatMap(p =>
    p.proposals.map(proposal => ({ ...proposal, projectTitle: p.title, projectId: p.id }))
  ) || []

  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>{session.user.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#888' }}>Client Account</div>
        </div>
        <nav>
          <Link href="/client/dashboard" className="dash-nav-item">📊 Dashboard</Link>
          <Link href="/client/projects" className="dash-nav-item">📁 My Projects</Link>
          <Link href="/client/project-new" className="dash-nav-item">➕ Post Project</Link>
          <Link href="/client/proposals" className="dash-nav-item active">📋 Proposals</Link>
          <Link href="/client/messages" className="dash-nav-item">💬 Messages</Link>
          <Link href="/client/contracts" className="dash-nav-item">📄 Contracts</Link>
          <Link href="/client/settings" className="dash-nav-item">⚙️ Settings</Link>
          <div className="dash-nav-divider" />
          <Link href="/marketplace" className="dash-nav-item">🔍 Browse Architects</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div className="page-header">
          <h1>All Proposals 📋</h1>
          <p>Every proposal received across all your projects.</p>
        </div>

        {allProposals.length > 0 ? (
          <div style={{ marginTop: '20px' }}>
            <div className="data-table-header" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Proposals ({allProposals.length})</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {allProposals.map(p => (
                <div key={p.id} className="glass-panel hover-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0a192f' }}>{p.architectProfile?.user?.fullName || 'Unknown Architect'}</h4>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px', fontWeight: 600 }}>Project: {p.projectTitle}</div>
                    </div>
                    <span className={`badge badge-${p.status === 'accepted' ? 'green' : p.status === 'rejected' ? 'red' : 'yellow'}`} style={{ whiteSpace: 'nowrap' }}>{p.status}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                    <div style={{ flex: 1, minWidth: '100px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proposed Fee</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#007f5f' }}>{p.proposedFee ? `₦${Number(p.proposedFee).toLocaleString()}` : '—'}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: '100px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4b5563' }}>{p.timeline || '—'}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                    <Link href={`/client/projects/${p.projectId}`} style={{ color: '#0a192f', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Review Proposal →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state glass-panel">
            <span className="empty-icon">📭</span>
            <h3>No proposals yet</h3>
            <p>Post a project and architects will start sending proposals.</p>
            <Link href="/client/project-new" className="btn-primary-lg" style={{ marginTop: '20px', display: 'inline-block' }}>Post a Project</Link>
          </div>
        )}
        <div className="dash-mobile-bottom-spacer" />
      </div>
      <DashboardMobileNav role="client" />
    </div>
  )
}
