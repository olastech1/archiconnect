'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminBlogActions({ postId, isPublished }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function togglePublish() {
    setLoading(true)
    await fetch(`/api/admin/blogs/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !isPublished }) // Only sending published state
    })
    setLoading(false)
    router.refresh()
  }

  async function deletePost() {
    if (!confirm('Are you sure you want to delete this post?')) return
    setLoading(true)
    await fetch(`/api/admin/blogs/${postId}`, {
      method: 'DELETE'
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => router.push(`/admin/blogs/${postId}`)}
        style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}
      >
        Edit
      </button>
      <button
        onClick={deletePost}
        disabled={loading}
        style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}
      >
        {loading ? '...' : 'Delete'}
      </button>
    </div>
  )
}
