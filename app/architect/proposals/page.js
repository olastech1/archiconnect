import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'My Proposals' }

export default async function ArchitectProposalsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'architect') redirect('/login')

  const profile = await prisma.architectProfile.findUnique({
    where: { userId: parseInt(session.user.id) },
    include: {
      proposals: {
        include: { project: { include: { client: { include: { user: { select: { fullName: true } } } } } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const proposals = profile?.proposals || []
  const open = await prisma.project.findMany({
    where: { status: 'open' },
    include: { client: { include: { user: { select: { fullName: true } } } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <div className="dashboard-wrapper">
      <aside className="dash-sidebar">
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#0a192f' }}>{session.user.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#888' }}>Architect</div>
        </div>
        <nav>
          <Link href="/architect/dashboard" className="dash-nav-item">📊 Dashboard</Link>
          <Link href="/architect/portfolio" className="dash-nav-item">🎨 Portfolio</Link>
          <Link href="/architect/proposals" className="dash-nav-item active">📋 My Proposals</Link>
          <Link href="/architect/contracts" className="dash-nav-item">📄 Contracts</Link>
          <Link href="/architect/messages" className="dash-nav-item">💬 Messages</Link>
          <Link href="/architect/verification" className="dash-nav-item">🛡️ Verification</Link>
          <Link href="/architect/settings" className="dash-nav-item">⚙️ Settings</Link>
        </nav>
      </aside>

      <div className="dash-content">
        <div className="page-header">
          <h1>My Proposals 📋</h1>
          <p>Track all your submitted proposals and find new projects to bid on.</p>
        </div>

        {/* Sent Proposals */}
        <div className="data-table-wrapper" style={{ marginBottom: '30px' }}>
          <div className="data-table-header">
            <h3>Proposals Sent ({proposals.length})</h3>
          </div>
          {proposals.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Proposed Fee</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.project?.title}</strong></td>
                    <td>{p.project?.client?.user?.fullName || '—'}</td>
                    <td>{p.proposedFee ? `₦${Number(p.proposedFee).toLocaleString()}` : '—'}</td>
                    <td>{p.timeline || '—'}</td>
                    <td>
                      <span className={`badge badge-${p.status === 'accepted' ? 'green' : p.status === 'rejected' ? 'red' : 'yellow'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">📋</div>
              <h3>No proposals submitted yet</h3>
              <p>Browse open projects below and submit your first proposal.</p>
            </div>
          )}
        </div>

        {/* Open Projects to Bid On */}
        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>🟢 Open Projects — Submit a Proposal</h3>
          </div>
          {open.length > 0 ? (
            <div>
              {open.map(p => (
                <div key={p.id} style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ color: '#0a192f', marginBottom: '4px' }}>{p.title}</h4>
                    <div style={{ fontSize: '0.82rem', color: '#888', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      {p.projectType && <span>🏗 {p.projectType}</span>}
                      {p.state && <span>📍 {p.state}</span>}
                      {p.budgetMin && <span>💰 ₦{Number(p.budgetMin).toLocaleString()}{p.budgetMax ? ` – ₦${Number(p.budgetMax).toLocaleString()}` : '+'}</span>}
                    </div>
                  </div>
                  <Link href={`/architect/proposals/submit?project=${p.id}`} className="btn-solid-sm">Submit Proposal</Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '40px' }}>
              <p>No open projects at this time. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
