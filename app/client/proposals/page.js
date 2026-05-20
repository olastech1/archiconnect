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
          <div className="data-table-wrapper">
            <div className="data-table-header">
              <h3>Proposals ({allProposals.length})</h3>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Architect</th>
                    <th>Project</th>
                    <th>Proposed Fee</th>
                    <th>Timeline</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allProposals.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.architectProfile?.user?.fullName || '—'}</strong></td>
                      <td style={{ maxWidth: '180px' }}>{p.projectTitle}</td>
                      <td>{p.proposedFee ? `₦${Number(p.proposedFee).toLocaleString()}` : '—'}</td>
                      <td>{p.timeline || '—'}</td>
                      <td><span className={`badge badge-${p.status === 'accepted' ? 'green' : p.status === 'rejected' ? 'red' : 'yellow'}`}>{p.status}</span></td>
                      <td style={{ fontSize: '0.82rem' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td><Link href={`/client/projects/${p.projectId}`} style={{ color: '#007f5f', fontWeight: 700, fontSize: '0.85rem' }}>View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-state">
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
