'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSettingsForm({ initialSettings }) {
  const router = useRouter()
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const handleSave = async (key, value) => {
    setSaving(key)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      })
      if (res.ok) {
        setSettings({ ...settings, [key]: value })
        router.refresh()
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const items = [
    { key: 'platformFee', icon: '💰', title: 'Platform Fee', desc: 'Commission % on successful contracts', default: '5' },
    { key: 'emailNotifications', icon: '📧', title: 'Email Notifications', desc: 'Automated email triggers for users', type: 'toggle', default: 'true' },
    { key: 'autoVerify', icon: '🛡️', title: 'Auto-Verification', desc: 'Auto-approve valid ARCON numbers', type: 'toggle', default: 'false' },
    { key: 'maintenanceMode', icon: '🔒', title: 'Maintenance Mode', desc: 'Temporarily take platform offline', type: 'toggle', default: 'false' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map(s => {
        const val = settings[s.key] || s.default
        const isToggle = s.type === 'toggle'
        
        return (
          <div key={s.key} style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
              <div>
                <div style={{ fontWeight: 800, color: 'white', marginBottom: '3px' }}>{s.title}</div>
                <div style={{ color: '#7c8db5', fontSize: '0.85rem' }}>{s.desc}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {isToggle ? (
                <button
                  onClick={() => handleSave(s.key, val === 'true' ? 'false' : 'true')}
                  disabled={saving === s.key}
                  style={{
                    padding: '6px 16px',
                    background: val === 'true' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                    border: val === 'true' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: val === 'true' ? '#6ee7b7' : '#94a3b8',
                    fontWeight: 700,
                    cursor: saving === s.key ? 'not-allowed' : 'pointer',
                    fontSize: '0.82rem'
                  }}
                >
                  {saving === s.key ? 'Saving...' : (val === 'true' ? 'Enabled' : 'Disabled')}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    defaultValue={val} 
                    onBlur={(e) => {
                      if (e.target.value !== val) handleSave(s.key, e.target.value)
                    }}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 10px', color: 'white', width: '80px', textAlign: 'center' }}
                  />
                  <span style={{ display: 'flex', alignItems: 'center', color: '#7c8db5' }}>%</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
