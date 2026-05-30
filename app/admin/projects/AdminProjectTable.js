'use client'
import { useState } from 'react'
import { updateProjectStatus, deleteProject } from '@/app/actions/admin'

export default function AdminProjectTable({ initialProjects }) {
  const [projects, setProjects] = useState(initialProjects)
  const [loading, setLoading] = useState(null)

  const handleStatusUpdate = async (id, newStatus) => {
    setLoading(id)
    const res = await updateProjectStatus(id, newStatus)
    if (res.success) {
      setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p))
    } else {
      alert(res.error)
    }
    setLoading(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return
    setLoading(id)
    const res = await deleteProject(id)
    if (res.success) {
      setProjects(projects.filter(p => p.id !== id))
    } else {
      alert(res.error)
    }
    setLoading(null)
  }

  const S = {
    table: { width: '100%', borderCollapse: 'collapse', minWidth: '800px' },
    th: { padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#7c8db5', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    td: { padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#c5cde8', fontSize: '0.9rem' },
    btnGroup: { display: 'flex', gap: '8px' },
    btnSuspend: { background: 'rgba(245,158,11,0.1)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 },
    btnRestore: { background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 },
    btnDelete: { background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 },
  }

  return (
    <div style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={S.table}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th style={S.th}>Project Details</th>
              <th style={S.th}>Client</th>
              <th style={S.th}>Budget / Type</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} style={{ opacity: p.status === 'suspended' ? 0.6 : 1 }}>
                <td style={S.td}>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '4px' }}>{p.title}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#7c8db5' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                </td>
                <td style={S.td}>
                  <span style={{ color: 'white', fontWeight: 600 }}>{p.client?.user?.fullName || 'Unknown'}</span><br/>
                  <span style={{ fontSize: '0.8rem', color: '#7c8db5' }}>{p.client?.user?.email}</span>
                </td>
                <td style={S.td}>
                  <span style={{ color: '#d4af37', fontWeight: 700 }}>₦{p.budgetMin?.toLocaleString()} - ₦{p.budgetMax?.toLocaleString()}</span><br/>
                  <span style={{ fontSize: '0.8rem', color: '#7c8db5', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>{p.projectType}</span>
                </td>
                <td style={S.td}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800,
                    background: p.status === 'open' ? 'rgba(16,185,129,0.1)' : p.status === 'suspended' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)',
                    color: p.status === 'open' ? '#6ee7b7' : p.status === 'suspended' ? '#fcd34d' : '#94a3b8'
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
                <td style={S.td}>
                  <div style={S.btnGroup}>
                    {p.status !== 'suspended' ? (
                      <button onClick={() => handleStatusUpdate(p.id, 'suspended')} disabled={loading === p.id} style={S.btnSuspend}>Suspend</button>
                    ) : (
                      <button onClick={() => handleStatusUpdate(p.id, 'open')} disabled={loading === p.id} style={S.btnRestore}>Restore</button>
                    )}
                    <button onClick={() => handleDelete(p.id)} disabled={loading === p.id} style={S.btnDelete}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#7c8db5' }}>No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
