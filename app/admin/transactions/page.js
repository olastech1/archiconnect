import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Transactions | Admin' }
export default async function AdminTransactionsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')
  const stats = [{ icon:'💰',num:'₦0',label:'Total Revenue' },{ icon:'📤',num:'₦0',label:'Total Payouts' },{ icon:'⏳',num:'₦0',label:'Pending' },{ icon:'📊',num:'0%',label:'Fee Rate' }]
  return (
    <div style={{color:'white'}}>
      <h1 style={{fontSize:'1.5rem',fontWeight:900,marginBottom:'4px'}}>Transactions</h1>
      <p style={{color:'#7c8db5',marginBottom:'24px'}}>Platform revenue, payouts, and financial overview.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'28px'}} className="admin-stat-grid">
        {stats.map(s=>(
          <div key={s.label} style={{background:'#1a1d27',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'14px',padding:'22px 20px'}}>
            <div style={{fontSize:'1.5rem',marginBottom:'10px'}}>{s.icon}</div>
            <div style={{fontSize:'2rem',fontWeight:900,color:'#d4af37',lineHeight:1}}>{s.num}</div>
            <div style={{fontSize:'0.82rem',color:'#7c8db5',marginTop:'6px'}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#1a1d27',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'14px',padding:'60px',textAlign:'center'}}>
        <div style={{fontSize:'3rem',marginBottom:'16px'}}>🔨</div>
        <h3 style={{color:'white',marginBottom:'10px'}}>Payment Integration Coming Soon</h3>
        <p style={{color:'#7c8db5'}}>Paystack and Flutterwave integration is in progress.</p>
      </div>
    </div>
  )
}
