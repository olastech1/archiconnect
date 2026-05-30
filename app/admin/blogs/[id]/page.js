import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminBlogForm from '../AdminBlogForm'

export const metadata = { title: 'Edit Post | Admin' }

export default async function EditBlogPage({ params }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')

  const id = parseInt(params.id)
  if (isNaN(id)) redirect('/admin/blogs')

  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) redirect('/admin/blogs')

  return (
    <div style={{ color: 'white', maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/blogs" style={{ color: '#7c8db5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>← Back to Posts</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '12px' }}>Edit Post</h1>
      </div>
      
      <AdminBlogForm initialData={post} />
    </div>
  )
}
