import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminBlogActions from './AdminBlogActions'

export const metadata = { title: 'Blog Posts | Admin' }

const S = {
  th: { padding: '12px 20px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#7c8db5', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap' },
  td: { padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#c5cde8', fontSize: '0.88rem', verticalAlign: 'middle' },
}

export default async function AdminBlogsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')
  
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { fullName: true } } }
  })
  
  return (
    <div style={{color:'white'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
        <div>
          <h1 style={{fontSize:'1.5rem',fontWeight:900,marginBottom:'4px'}}>Blog Posts</h1>
          <p style={{color:'#7c8db5'}}>Manage platform content and publish articles.</p>
        </div>
        <Link href="/admin/blogs/new" style={{padding:'9px 22px',background:'linear-gradient(135deg,#d4af37,#f0c840)',border:'none',borderRadius:'8px',color:'#0a192f',fontWeight:800,cursor:'pointer',fontSize:'0.88rem',textDecoration:'none'}}>
          + New Post
        </Link>
      </div>

      <div style={{background:'#1a1d27',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'14px',overflow:'hidden'}}>
        {posts.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Title', 'Author', 'Status', 'Date', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id}>
                    <td style={S.td}>
                      <strong style={{ color: 'white' }}>{p.title}</strong>
                      <div style={{ color: '#7c8db5', fontSize: '0.75rem', marginTop: '4px' }}>/{p.slug}</div>
                    </td>
                    <td style={S.td}>{p.author?.fullName || 'System'}</td>
                    <td style={S.td}>
                      <span style={{ 
                        padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                        background: p.published ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', 
                        color: p.published ? '#6ee7b7' : '#94a3b8', 
                        border: p.published ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ ...S.td, fontSize: '0.8rem', color: '#7c8db5' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td style={S.td}>
                      <AdminBlogActions postId={p.id} isPublished={p.published} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{padding:'60px',textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:'16px'}}>📝</div>
            <h3 style={{color:'white',marginBottom:'10px'}}>No posts found</h3>
            <p style={{color:'#7c8db5'}}>You haven't created any blog posts yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
