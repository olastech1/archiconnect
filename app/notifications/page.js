import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Notifications | ArchiConnect NG' }

export default async function NotificationsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role
  const backLink = `/${role}/dashboard`

  const demoNotifs = [
    { icon: '📋', title: 'New proposal received', desc: 'An architect submitted a proposal for your project "5-Bedroom Duplex".', time: '2 hours ago', unread: true },
    { icon: '✅', title: 'Proposal accepted', desc: 'Your proposal for "Commercial Office Complex" was accepted by the client.', time: '1 day ago', unread: true },
    { icon: '🛡️', title: 'Verification under review', desc: 'Your ARCON credentials have been submitted and are being reviewed.', time: '3 days ago', unread: false },
    { icon: '👋', title: 'Welcome to ArchiConnect NG!', desc: 'Your account has been created. Complete your profile to get started.', time: '5 days ago', unread: false },
  ]

  return (
    <main style={{ background: '#f8f9fb', minHeight: '80vh', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: '#0a192f', fontWeight: 800 }}>🔔 Notifications</h1>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Your recent activity and alerts.</p>
          </div>
          <Link href={backLink} style={{ color: '#007f5f', fontWeight: 700, fontSize: '0.9rem' }}>← Dashboard</Link>
        </div>

        <div className="data-table-wrapper">
          {demoNotifs.map((n, i) => (
            <div key={i} className={`notif-item${n.unread ? ' unread' : ''}`} style={{ alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '2px' }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                  <strong style={{ color: '#0a192f', fontSize: '0.93rem' }}>{n.title}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#aaa', whiteSpace: 'nowrap' }}>{n.time}</span>
                </div>
                <p style={{ color: '#555', fontSize: '0.88rem', marginTop: '4px', lineHeight: 1.5 }}>{n.desc}</p>
              </div>
              {n.unread && <div className="notif-dot" style={{ flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.82rem', marginTop: '20px' }}>
          Real-time notifications will be powered by WebSockets in the next update.
        </p>
      </div>
    </main>
  )
}
