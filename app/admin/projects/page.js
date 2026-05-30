import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdminProjectTable from './AdminProjectTable'

export const metadata = { title: 'Projects Oversight | Admin' }

export default async function AdminProjectsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')

  let projects = []
  try {
    projects = await prisma.project.findMany({
      include: {
        client: {
          include: { user: { select: { fullName: true, email: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error(error)
  }

  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px', color: 'white' }}>Global Project Oversight</h1>
      <p style={{ color: '#7c8db5', fontSize: '0.9rem', marginBottom: '28px' }}>
        Monitor, suspend, or delete projects across the entire platform.
      </p>
      
      <AdminProjectTable initialProjects={projects} />
    </div>
  )
}
