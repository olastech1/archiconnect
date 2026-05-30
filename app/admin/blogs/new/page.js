import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminBlogForm from '../AdminBlogForm'

export const metadata = { title: 'New Post | Admin' }

export default async function NewBlogPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')

  return (
    <div style={{ color: 'white', maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/blogs" style={{ color: '#7c8db5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>← Back to Posts</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '12px' }}>Create New Post</h1>
      </div>
      
      <AdminBlogForm />
    </div>
  )
}
