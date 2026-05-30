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
          style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}
        >
          {loading ? '...' : 'Make Admin'}
        </button>
      )}
      <button
        onClick={suspendUser}
        disabled={loading}
        style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}
      >
        {loading ? '...' : 'Suspend'}
      </button>
    </div>
  )
}
