import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdminVerifyActions from './AdminVerifyActions'

export const metadata = { title: 'Verifications | Admin' }

const S = {
  th: { padding: '12px 20px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#7c8db5', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap' },
  td: { padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#c5cde8', fontSize: '0.88rem', verticalAlign: 'middle' },
  card: { background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' },
  cardHead: { padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
}

export default async function AdminVerificationsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')

  const [pending, verified] = await Promise.all([
    prisma.architectProfile.findMany({ where: { verificationStatus: { in: ['pending', 'unverified'] } }, include: { user: true }, orderBy: { createdAt: 'asc' } }),
    prisma.architectProfile.findMany({ where: { verificationStatus: 'verified' }, include: { user: true }, orderBy: { updatedAt: 'desc' }, take: 20 }),
  ])

  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px' }}>Architect Verifications</h1>
      <p style={{ color: '#7c8db5', fontSize: '0.9rem', marginBottom: '24px' }}>Review ARCON/NIA credentials and approve or reject architect applications.</p>

      {/* Pending */}
      <div style={S.card}>
        <div style={S.cardHead}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>Pending Review</span>
            {pending.length > 0 && (
              <span style={{ background: 'rgba(248,113,113,0.2)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 800 }}>
                {pending.length} pending
              </span>
            )}
          </div>
        </div>
        {pending.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Architect','Email','ARCON No.','NIA No.','State','Joined','Action'].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {pending.map(p => (
                  <tr key={p.id}>
                    <td style={S.td}><strong style={{ color: 'white' }}>{p.user?.fullName || 'Unknown'}</strong></td>
                    <td style={{ ...S.td, fontSize: '0.82rem' }}>{p.user?.email || 'N/A'}</td>
                    <td style={S.td}>{p.arconNumber ? <span style={{ color: '#d4af37', fontWeight: 700, fontFamily: 'monospace' }}>{p.arconNumber}</span> : <span style={{ color: '#4a5568' }}>—</span>}</td>
                    <td style={S.td}>{p.niaNumber || <span style={{ color: '#4a5568' }}>—</span>}</td>
                    <td style={{ ...S.td, fontSize: '0.82rem' }}>{p.state || '—'}</td>
                    <td style={{ ...S.td, fontSize: '0.8rem', color: '#7c8db5' }}>{p.user?.createdAt ? new Date(p.user.createdAt).toLocaleDateString() : '—'}</td>
                    <td style={S.td}><AdminVerifyActions profileId={p.id} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✅</div>
            <div style={{ color: '#7c8db5', fontSize: '0.95rem' }}>All caught up! No pending verifications.</div>
          </div>
        )}
      </div>

      {/* Verified */}
      <div style={S.card}>
        <div style={S.cardHead}>
          <span style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>Verified Architects</span>
          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 800 }}>
            {verified.length} verified
          </span>
        </div>
        {verified.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Architect','Email','ARCON No.','NIA No.','State','Action'].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {verified.map(p => (
                  <tr key={p.id}>
                    <td style={S.td}><strong style={{ color: 'white' }}>{p.user?.fullName || 'Unknown'}</strong></td>
                    <td style={{ ...S.td, fontSize: '0.82rem' }}>{p.user?.email || 'N/A'}</td>
                    <td style={S.td}><span style={{ color: '#d4af37', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem' }}>{p.arconNumber || '—'}</span></td>
                    <td style={{ ...S.td, fontSize: '0.82rem' }}>{p.niaNumber || '—'}</td>
                    <td style={{ ...S.td, fontSize: '0.82rem' }}>{p.state || '—'}</td>
                    <td style={S.td}><AdminVerifyActions profileId={p.id} currentStatus="verified" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: '#7c8db5', fontSize: '0.9rem' }}>No verified architects yet.</div>
        )}
      </div>
    </div>
  )
}
