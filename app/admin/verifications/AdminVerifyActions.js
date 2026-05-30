'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminVerifyActions({ profileId, currentStatus }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(status) {
    setLoading(true)
    await fetch(`/api/admin/verify/${profileId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(false)
    router.refresh()
  }

  if (currentStatus === 'verified') {
    return (
      <button
        onClick={() => updateStatus('unverified')}
        disabled={loading}
        style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}
      >
        {loading ? '...' : '✕ Revoke'}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => updateStatus('verified')}
        disabled={loading}
        style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}
      >
        {loading ? '...' : '✔ Approve'}
      </button>
      <button
        onClick={() => updateStatus('rejected')}
        disabled={loading}
        style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}
      >
        {loading ? '...' : '✕ Reject'}
      </button>
    </div>
  )
}
