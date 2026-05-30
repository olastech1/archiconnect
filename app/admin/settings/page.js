import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdminSettingsForm from './AdminSettingsForm'

export const metadata = { title: 'Settings | Admin' }

export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')
  
  const settings = await prisma.platformSetting.findMany()
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {})

  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px' }}>Platform Settings</h1>
      <p style={{ color: '#7c8db5', marginBottom: '24px' }}>Configure global platform settings and preferences.</p>
      
      <AdminSettingsForm initialSettings={settingsMap} />
    </div>
  )
}
