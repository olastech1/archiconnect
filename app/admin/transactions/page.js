import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Transactions | Admin' }

const S = {
  th: { padding: '12px 20px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#7c8db5', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap' },
  td: { padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#c5cde8', fontSize: '0.88rem', verticalAlign: 'middle' },
}

export default async function AdminTransactionsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')

  // Fetch contracts
  const contracts = await prisma.contract.findMany({
    include: {
      project: true,
      architect: { include: { user: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Get Fee Rate setting
  const feeSetting = await prisma.platformSetting.findUnique({ where: { key: 'platformFee' } })
  const feeRate = feeSetting ? parseFloat(feeSetting.value) : 5

  const totalValue = contracts.reduce((acc, curr) => acc + curr.totalAmount, 0)
  const totalRevenue = totalValue * (feeRate / 100)
  const totalPayouts = totalValue - totalRevenue

  const formatter = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })

  const stats = [
    { icon:'💰', num: formatter.format(totalRevenue), label: 'Total Revenue' },
    { icon:'📤', num: formatter.format(totalPayouts), label: 'Total Payouts' },
    { icon:'📋', num: contracts.length, label: 'Active Contracts' },
    { icon:'📊', num: `${feeRate}%`, label: 'Fee Rate' }
  ]

  return (
    <div style={{color:'white'}}>
      <h1 style={{fontSize:'1.5rem',fontWeight:900,marginBottom:'4px'}}>Transactions</h1>
      <p style={{color:'#7c8db5',marginBottom:'24px'}}>Platform revenue, payouts, and financial overview.</p>
      
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'28px'}} className="admin-stat-grid">
        {stats.map(s=>(
          <div key={s.label} style={{background:'#1a1d27',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'14px',padding:'22px 20px'}}>
            <div style={{fontSize:'1.5rem',marginBottom:'10px'}}>{s.icon}</div>
            <div style={{fontSize:'1.8rem',fontWeight:900,color:'#d4af37',lineHeight:1}}>{s.num}</div>
            <div style={{fontSize:'0.82rem',color:'#7c8db5',marginTop:'6px'}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{background:'#1a1d27',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'14px',overflow:'hidden',marginBottom:'28px'}}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>Contract History</span>
        </div>
        {contracts.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Project', 'Architect', 'Status', 'Total Amount', 'Platform Fee', 'Date'].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {contracts.map(c => {
                  const revenue = c.totalAmount * (feeRate / 100)
                  return (
                    <tr key={c.id}>
                      <td style={S.td}><strong style={{ color: 'white' }}>{c.project?.title || 'Unknown'}</strong></td>
                      <td style={S.td}>{c.architect?.user?.fullName || 'Unknown'}</td>
                      <td style={S.td}>
                        <span style={{ 
                          padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                          background: c.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', 
                          color: c.status === 'active' ? '#6ee7b7' : '#94a3b8', 
                          border: c.status === 'active' ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.1)'
                        }}>
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={S.td}><strong>{formatter.format(c.totalAmount)}</strong></td>
                      <td style={{ ...S.td, color: '#d4af37', fontWeight: 700 }}>{formatter.format(revenue)}</td>
                      <td style={{ ...S.td, fontSize: '0.8rem', color: '#7c8db5' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{padding:'60px',textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:'16px'}}>📄</div>
            <h3 style={{color:'white',marginBottom:'10px'}}>No Contracts Yet</h3>
            <p style={{color:'#7c8db5'}}>Platform transactions will appear here.</p>
          </div>
        )}
      </div>

      <div style={{background:'rgba(212,175,55,0.05)',border:'1px solid rgba(212,175,55,0.2)',borderRadius:'14px',padding:'30px',textAlign:'center'}}>
        <h3 style={{color:'#d4af37',marginBottom:'10px',fontSize:'1.1rem'}}>Payment Integration Pending</h3>
        <p style={{color:'#7c8db5',fontSize:'0.9rem',maxWidth:'600px',margin:'0 auto'}}>
          Currently displaying calculated financials based on active contracts. 
          Real fiat processing via Paystack/Flutterwave is yet to be integrated.
        </p>
      </div>
    </div>
  )
}
