'use client'
import { useState } from 'react'
import { broadcastNotification } from '@/app/actions/admin'

export default function BroadcastForm() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: '', text: '' })

    const formData = new FormData(e.target)
    const data = {
      title: formData.get('title'),
      message: formData.get('message'),
      target: formData.get('target'),
      link: formData.get('link')
    }

    const res = await broadcastNotification(data)
    if (res.error) {
      setMsg({ type: 'error', text: res.error })
    } else {
      setMsg({ type: 'success', text: `Broadcast sent successfully to ${res.count} users.` })
      e.target.reset()
    }
    setLoading(false)
  }

  const S = {
    form: { background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '24px' },
    group: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#7c8db5', textTransform: 'uppercase', marginBottom: '8px' },
    input: { width: '100%', padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '0.95rem', outline: 'none' },
    select: { width: '100%', padding: '14px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '0.95rem', outline: 'none' },
    btn: { background: '#d4af37', color: '#0a192f', padding: '16px', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', width: '100%', transition: '0.3s' },
  }

  return (
    <form style={S.form} onSubmit={handleSubmit}>
      {msg.text && (
        <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', background: msg.type === 'error' ? 'rgba(217,4,41,0.1)' : 'rgba(0,127,95,0.1)', color: msg.type === 'error' ? '#fca5a5' : '#6ee7b7', border: `1px solid ${msg.type === 'error' ? 'rgba(217,4,41,0.3)' : 'rgba(0,127,95,0.3)'}` }}>
          {msg.text}
        </div>
      )}

      <div style={S.group}>
        <label style={S.label}>Target Audience</label>
        <select name="target" style={S.select} required>
          <option value="all">All Users</option>
          <option value="architects">Architects Only</option>
          <option value="clients">Clients Only</option>
        </select>
      </div>

      <div style={S.group}>
        <label style={S.label}>Notification Title</label>
        <input name="title" style={S.input} placeholder="e.g., System Update" required />
      </div>

      <div style={S.group}>
        <label style={S.label}>Message Body</label>
        <textarea name="message" style={{ ...S.input, minHeight: '120px' }} placeholder="Type the broadcast message..." required />
      </div>

      <div style={S.group}>
        <label style={S.label}>Action Link (Optional)</label>
        <input name="link" style={S.input} placeholder="e.g., /marketplace" />
      </div>

      <button type="submit" style={S.btn} disabled={loading}>
        {loading ? 'Sending Broadcast...' : '📢 Send Broadcast Now'}
      </button>
    </form>
  )
}
