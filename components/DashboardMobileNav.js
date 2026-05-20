'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navMap = {
  client: [
    { href: '/client/dashboard',   icon: '📊', label: 'Home' },
    { href: '/client/projects',    icon: '📁', label: 'Projects' },
    { href: '/client/project-new', icon: '➕', label: 'Post' },
    { href: '/client/proposals',   icon: '📋', label: 'Proposals' },
    { href: '/client/messages',    icon: '💬', label: 'Messages' },
  ],
  architect: [
    { href: '/architect/dashboard',    icon: '📊', label: 'Home' },
    { href: '/architect/portfolio',    icon: '🎨', label: 'Portfolio' },
    { href: '/architect/proposals',    icon: '📋', label: 'Proposals' },
    { href: '/architect/messages',     icon: '💬', label: 'Messages' },
    { href: '/architect/verification', icon: '🛡️', label: 'Verify' },
  ],
  admin: [
    { href: '/admin/dashboard',       icon: '📊', label: 'Home' },
    { href: '/admin/users',           icon: '👥', label: 'Users' },
    { href: '/admin/verifications',   icon: '🛡️', label: 'Verify' },
    { href: '/admin/transactions',    icon: '💳', label: 'Billing' },
    { href: '/admin/settings',        icon: '⚙️', label: 'Settings' },
  ],
}

export default function DashboardMobileNav({ role }) {
  const pathname = usePathname()
  const items = navMap[role] || navMap.client

  return (
    <nav className="dash-mobile-nav" aria-label="Mobile dashboard navigation">
      <div className="dash-mobile-nav-inner">
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`dash-mobile-nav-item${pathname === item.href ? ' active' : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
