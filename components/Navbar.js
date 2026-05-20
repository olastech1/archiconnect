'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const role = session?.user?.role || 'guest'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const base = '/'

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin/dashboard'
    if (role === 'architect') return '/architect/dashboard'
    return '/client/dashboard'
  }

  return (
    <>
      <header className="main-header">
        <div className="header-content">
          <Link href="/" className="brand-logo">
            ArchiConnect<span className="gold-dot">.</span>NG
            {role === 'admin' && (
              <span style={{ fontSize: '0.7rem', background: '#d4af37', color: '#0a192f', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', verticalAlign: 'middle', fontWeight: 800 }}>
                ADMIN
              </span>
            )}
          </Link>

          <nav className="desktop-nav">
            {role === 'admin' ? (
              <>
                <Link href="/admin/dashboard">Overview</Link>
                <Link href="/admin/verifications">Verifications</Link>
                <Link href="/admin/users">Users</Link>
              </>
            ) : (
              <>
                <Link href="/marketplace">Browse Architects</Link>
                <Link href="/client/project-new">Post a Project</Link>
                <Link href="/verify-architect">Verify Architect</Link>
              </>
            )}
          </nav>

          <div className="desktop-actions">
            {session ? (
              <>
                <Link href={getDashboardLink()} className="btn-solid-sm">Dashboard</Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn-outline-sm"
                  style={{ cursor: 'pointer' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="link-text">Login</Link>
                <Link href="/register" className="btn-solid-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button
            className="menu-toggle"
            id="sidebar-toggle"
            aria-label="Toggle Menu"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="mobile-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">{role === 'admin' ? 'Admin Control' : 'Menu'}</span>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>&times;</button>
        </div>

        {session && (
          <div className="user-summary">
            <div className="avatar-circle">
              {session.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <strong>{session.user?.name || 'User'}</strong>
              <small style={{ textTransform: 'capitalize' }}>{role}</small>
            </div>
          </div>
        )}

        <nav className="sidebar-menu">
          {role === 'admin' ? (
            <>
              <Link href="/admin/dashboard" className="sidebar-link" onClick={() => setSidebarOpen(false)}>📊 Overview</Link>
              <Link href="/admin/verifications" className="sidebar-link" onClick={() => setSidebarOpen(false)}>🛡️ Verifications</Link>
              <Link href="/admin/users" className="sidebar-link" onClick={() => setSidebarOpen(false)}>👥 Manage Users</Link>
              <Link href="/admin/transactions" className="sidebar-link" onClick={() => setSidebarOpen(false)}>💳 Transactions</Link>
              <Link href="/admin/settings" className="sidebar-link" onClick={() => setSidebarOpen(false)}>⚙️ Settings</Link>
              <div className="menu-divider" />
              <Link href="/" className="sidebar-link" style={{ color: '#888' }} onClick={() => setSidebarOpen(false)}>↗ View Public Site</Link>
            </>
          ) : role === 'architect' ? (
            <>
              <Link href="/architect/dashboard" className="sidebar-link" onClick={() => setSidebarOpen(false)}>📊 My Dashboard</Link>
              <Link href="/architect/portfolio" className="sidebar-link" onClick={() => setSidebarOpen(false)}>🎨 Portfolio Manager</Link>
              <Link href="/marketplace" className="sidebar-link" onClick={() => setSidebarOpen(false)}>🔍 Find Jobs</Link>
              <Link href="/architect/proposals" className="sidebar-link" onClick={() => setSidebarOpen(false)}>📋 My Proposals</Link>
              <Link href="/architect/messages" className="sidebar-link" onClick={() => setSidebarOpen(false)}>💬 Messages</Link>
              <div className="menu-divider" />
              <Link href="/" className="sidebar-link" onClick={() => setSidebarOpen(false)}>🏠 Home</Link>
            </>
          ) : role === 'client' ? (
            <>
              <Link href="/client/dashboard" className="sidebar-link" onClick={() => setSidebarOpen(false)}>📊 My Dashboard</Link>
              <Link href="/client/projects" className="sidebar-link" onClick={() => setSidebarOpen(false)}>📁 My Projects</Link>
              <Link href="/client/project-new" className="sidebar-link" onClick={() => setSidebarOpen(false)}>➕ Post a Project</Link>
              <Link href="/client/messages" className="sidebar-link" onClick={() => setSidebarOpen(false)}>💬 Messages</Link>
              <div className="menu-divider" />
              <Link href="/marketplace" className="sidebar-link" onClick={() => setSidebarOpen(false)}>🔍 Browse Architects</Link>
              <Link href="/" className="sidebar-link" onClick={() => setSidebarOpen(false)}>🏠 Home</Link>
            </>
          ) : (
            <>
              <Link href="/" className="sidebar-link" onClick={() => setSidebarOpen(false)}>🏠 Home</Link>
              <Link href="/marketplace" className="sidebar-link" onClick={() => setSidebarOpen(false)}>🔍 Browse Architects</Link>
              <Link href="/client/project-new" className="sidebar-link" onClick={() => setSidebarOpen(false)}>➕ Post a Project</Link>
              <Link href="/verify-architect" className="sidebar-link" onClick={() => setSidebarOpen(false)}>✅ Verify License</Link>
            </>
          )}

          <div className="menu-divider" />
          {session ? (
            <button
              onClick={() => { signOut({ callbackUrl: '/' }); setSidebarOpen(false) }}
              className="sidebar-link logout-link"
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
            >
              🚪 Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="sidebar-link" onClick={() => setSidebarOpen(false)}>🔑 Login</Link>
              <Link href="/register" className="sidebar-btn-full" onClick={() => setSidebarOpen(false)}>Sign Up Free</Link>
            </>
          )}
        </nav>
      </aside>

      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
    </>
  )
}
