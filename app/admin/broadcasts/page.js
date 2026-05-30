import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import BroadcastForm from './BroadcastForm'

export const metadata = { title: 'Broadcasts | Admin' }

export default async function AdminBroadcastsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/admin/login')

  return (
    <div style={{ color: 'white', maxWidth: '700px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px', color: 'white' }}>System Broadcasts</h1>
      <p style={{ color: '#7c8db5', fontSize: '0.9rem', marginBottom: '28px' }}>
        Send platform-wide notifications directly to user dashboards.
      </p>
      
      <BroadcastForm />
    </div>
  )
}
