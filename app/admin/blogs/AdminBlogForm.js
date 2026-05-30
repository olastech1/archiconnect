'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminBlogForm({ initialData = null }) {
  const router = useRouter()
  const isEditing = !!initialData
  
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    imageUrl: initialData?.imageUrl || '',
    content: initialData?.content || '',
    published: initialData?.published || false,
  })
  const [error, setError] = useState('')

  const handleSlugify = () => {
    if (form.title && !form.slug) {
      setForm({ ...form, slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const url = isEditing ? `/api/admin/blogs/${initialData.id}` : '/api/admin/blogs'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save post')
      
      router.push('/admin/blogs')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '24px' }}>
      {error && <div style={{ background: 'rgba(248,113,113,0.1)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.3)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#7c8db5', marginBottom: '8px' }}>Post Title *</label>
          <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} onBlur={handleSlugify}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: 'white', fontSize: '0.95rem', outline: 'none' }} 
            placeholder="e.g. 5 Trends in Modern Nigerian Architecture" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#7c8db5', marginBottom: '8px' }}>URL Slug *</label>
          <input required type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: 'white', fontSize: '0.95rem', outline: 'none', fontFamily: 'monospace' }} 
            placeholder="e.g. 5-trends-in-modern-nigerian-architecture" />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#7c8db5', marginBottom: '8px' }}>Featured Image URL</label>
        <input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
          style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: 'white', fontSize: '0.95rem', outline: 'none' }} 
          placeholder="https://..." />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#7c8db5', marginBottom: '8px' }}>Content (Markdown Supported) *</label>
        <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})}
          style={{ width: '100%', minHeight: '300px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '16px', color: 'white', fontSize: '0.95rem', outline: 'none', resize: 'vertical', lineHeight: '1.6' }} 
          placeholder="Write your post content here..." />
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" id="published" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} 
          style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        <label htmlFor="published" style={{ color: 'white', fontWeight: 700, cursor: 'pointer' }}>Publish immediately</label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button type="button" onClick={() => router.push('/admin/blogs')} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
          Cancel
        </button>
        <button type="submit" disabled={loading} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#d4af37,#f0c840)', border: 'none', borderRadius: '8px', color: '#0a192f', fontWeight: 800, cursor: 'pointer' }}>
          {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
        </button>
      </div>
    </form>
  )
}
