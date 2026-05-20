import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Settings | Admin' }
const settings = [
  { icon:'💰', title:'Platform Fee', desc:'Commission % on successful contracts', value:'5%' },
  { icon:'📧', title:'Email Notifications', desc:'Automated email triggers for users', value:'Enabled' },
  { icon:'🛡️', title:'Auto-Verification', desc:'Auto-approve valid ARCON numbers', value:'Disabled' },
  { icon:'🔒', title:'Maintenance Mode', desc:'Temporarily take platform offline', value:'Off' },
]
export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')
  return (
    <div style={{color:'white'}}>
      <h1 style={{fontSize:'1.5rem',fontWeight:900,marginBottom:'4px'}}>Platform Settings</h1>
      <p style={{color:'#7c8db5',marginBottom:'24px'}}>Configure global platform settings and preferences.</p>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        {settings.map(s=>(
          <div key={s.title} style={{background:'#1a1d27',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'14px',padding:'20px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px'}}>
            <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
              <div style={{fontSize:'1.8rem'}}>{s.icon}</div>
              <div>
                <div style={{fontWeight:800,color:'white',marginBottom:'3px'}}>{s.title}</div>
                <div style={{color:'#7c8db5',fontSize:'0.85rem'}}>{s.desc}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
              <span style={{background:'rgba(255,255,255,0.06)',color:'#94a3b8',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'6px',padding:'3px 12px',fontSize:'0.8rem',fontWeight:700}}>{s.value}</span>
              <button disabled style={{padding:'6px 16px',background:'rgba(212,175,55,0.1)',border:'1px solid rgba(212,175,55,0.2)',borderRadius:'8px',color:'#d4af37',fontWeight:700,cursor:'not-allowed',fontSize:'0.82rem',opacity:0.7}}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
