'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProposalActions({ proposalId, projectId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateProposal(action) {
    setLoading(true)
    await fetch(`/api/proposals/${proposalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => updateProposal('accept')}
        disabled={loading}
        style={{ background: '#e6f4f1', color: '#007f5f', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
      >
        {loading ? '...' : '✔ Accept'}
      </button>
      <button
        onClick={() => updateProposal('reject')}
        disabled={loading}
        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
      >
        {loading ? '...' : '✕ Reject'}
      </button>
    </div>
  )
}
