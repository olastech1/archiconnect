import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ProposalActions from './ProposalActions'

export default async function ProjectDetailPage({ params }) {
  const session = await auth()
  if (!session || session.user.role !== 'client') redirect('/login')

  const client = await prisma.clientProfile.findUnique({ where: { userId: parseInt(session.user.id) } })

  const project = await prisma.project.findFirst({
    where: { id: parseInt(params.id), clientId: client?.id },
    include: {
      proposals: {
        include: { architectProfile: { include: { user: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!project) notFound()

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
        </nav>
      </aside>

      <div className="dash-content">
        <div style={{ marginBottom: '20px' }}>
          <Link href="/client/projects" style={{ color: '#888', fontSize: '0.9rem' }}>← Back to Projects</Link>
        </div>

        {/* Project Header */}
        <div className="form-card" style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#0a192f', marginBottom: '8px' }}>{project.title}</h1>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.88rem', color: '#888', flexWrap: 'wrap' }}>
                {project.projectType && <span>🏗 {project.projectType}</span>}
                {project.state && <span>📍 {project.state}</span>}
                {project.budgetMin && <span>💰 ₦{Number(project.budgetMin).toLocaleString()} – ₦{Number(project.budgetMax || 0).toLocaleString()}</span>}
                <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <span className={`badge badge-${project.status === 'open' ? 'green' : project.status === 'awarded' ? 'blue' : 'gray'}`} style={{ fontSize: '0.9rem', padding: '5px 14px' }}>
              {project.status}
            </span>
          </div>
          {project.description && (
            <p style={{ marginTop: '16px', color: '#555', lineHeight: 1.8 }}>{project.description}</p>
          )}
        </div>

        {/* Proposals */}
        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>📋 Proposals Received ({project.proposals.length})</h3>
          </div>
          {project.proposals.length > 0 ? (
            <div style={{ padding: '0' }}>
              {project.proposals.map(p => (
                <div key={p.id} style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1rem' }}>{p.architectProfile?.user?.fullName}</strong>
                      {p.architectProfile?.verificationStatus === 'verified' && (
                        <span className="badge-verified-sm">✔ Verified</span>
                      )}
                      <span className={`badge badge-${p.status === 'accepted' ? 'green' : p.status === 'rejected' ? 'red' : 'yellow'}`}>{p.status}</span>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '10px' }}>{p.coverLetter}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#888' }}>
                      {p.proposedFee && <span>💰 ₦{Number(p.proposedFee).toLocaleString()}</span>}
                      {p.timeline && <span>⏱ {p.timeline}</span>}
                      <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', minWidth: '180px' }}>
                    <Link href={`/architects/${p.architectProfile?.userId}`} className="btn-outline-sm" style={{ fontSize: '0.82rem' }}>View Profile</Link>
                    {p.status === 'pending' && project.status === 'open' && (
                      <ProposalActions proposalId={p.id} projectId={project.id} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '50px' }}>
              <div className="empty-icon">📭</div>
              <h3>No proposals yet</h3>
              <p>Architects will start sending proposals soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
