import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Blog Posts | Admin' }
export default async function AdminBlogsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')
  return (
    <div style={{color:'white'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
        <div>
          <h1 style={{fontSize:'1.5rem',fontWeight:900,marginBottom:'4px'}}>Blog Posts</h1>
          <p style={{color:'#7c8db5'}}>Manage platform content and publish articles.</p>
        </div>
        <button disabled style={{padding:'9px 22px',background:'rgba(212,175,55,0.2)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:'8px',color:'#d4af37',fontWeight:800,cursor:'not-allowed',fontSize:'0.88rem',opacity:0.6}}>+ New Post</button>
      </div>
      <div style={{background:'#1a1d27',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'14px',padding:'60px',textAlign:'center'}}>
        <div style={{fontSize:'3rem',marginBottom:'16px'}}>🔨</div>
        <h3 style={{color:'white',marginBottom:'10px'}}>CMS Coming Soon</h3>
        <p style={{color:'#7c8db5',marginBottom:'20px'}}>A built-in content management system is under development.</p>
        <Link href="/blog" style={{color:'#d4af37',fontWeight:700,fontSize:'0.9rem',textDecoration:'none'}}>View Public Blog →</Link>
      </div>
    </div>
  )
}
