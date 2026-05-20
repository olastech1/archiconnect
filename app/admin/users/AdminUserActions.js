'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminUserActions({ userId, currentRole }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function suspendUser() {
    if (!confirm('Suspend this user?')) return
    setLoading(true)
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'suspend' }),
    })
    setLoading(false)
    router.refresh()
  }

  async function makeAdmin() {
    if (!confirm('Make this user an admin?')) return
    setLoading(true)
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'makeAdmin' }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {currentRole !== 'admin' && (
        <button
          onClick={makeAdmin}
          disabled={loading}
          style={{ background: '#dbeafe', color: '#1d4ed8', border: 'none', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}
        >
          {loading ? '...' : 'Make Admin'}
        </button>
      )}
      <button
        onClick={suspendUser}
        disabled={loading}
        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}
      >
        {loading ? '...' : 'Suspend'}
      </button>
    </div>
  )
}
