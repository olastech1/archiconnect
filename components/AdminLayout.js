'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

const navItems = [
  { href: '/admin/dashboard', icon: '📊', label: 'Overview' },
  { href: '/admin/users', icon: '👥', label: 'Users' },
  { href: '/admin/verifications', icon: '🛡️', label: 'Verifications' },
  { href: '/admin/transactions', icon: '💳', label: 'Transactions' },
  { href: '/admin/blogs', icon: '📝', label: 'Blog Posts' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '72px' : '240px',
        minHeight: '100vh',
        background: '#13161e',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 30,
      }}
        className="admin-sidebar"
      >
        {/* Brand */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 900, fontSize: '1rem', color: 'white', letterSpacing: '-0.02em' }}>
                Archi<span style={{ color: '#d4af37' }}>Connect</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#d4af37', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '1px' }}>Admin Console</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', padding: '7px 9px', cursor: 'pointer', color: '#a0aec0', fontSize: '0.85rem', flexShrink: 0 }}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: collapsed ? '12px' : '11px 14px',
                  borderRadius: '10px',
                  marginBottom: '3px',
                  color: active ? 'white' : '#7c8db5',
                  background: active ? 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.08))' : 'transparent',
                  borderLeft: active ? '3px solid #d4af37' : '3px solid transparent',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: active ? 700 : 500,
                  transition: 'all 0.15s',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
              >
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', color: '#7c8db5', textDecoration: 'none', fontSize: '0.82rem', marginBottom: '4px' }}
            title={collapsed ? 'View Site' : undefined}>
            <span>🌐</span>
            {!collapsed && <span>View Site</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.82rem', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <span>🚪</span>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: '64px',
          background: '#13161e',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          gap: '16px',
        }}>
          {/* Mobile menu btn */}
          <button
            className="admin-mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', color: 'white', fontSize: '1rem' }}
          >
            ☰
          </button>

          {/* Page title from pathname */}
          <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>
            {navItems.find(n => pathname === n.href || pathname.startsWith(n.href))?.label || 'Admin Console'}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>{session?.user?.name || 'Admin'}</div>
              <div style={{ fontSize: '0.7rem', color: '#d4af37', fontWeight: 800, letterSpacing: '0.08em' }}>SUPER ADMIN</div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #f0c840)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, color: '#0a192f' }}>
              {(session?.user?.name || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
