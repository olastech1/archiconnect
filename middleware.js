import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const session = req.auth
  const { pathname } = req.nextUrl
  const role = session?.user?.role

  // ── Admin login page: public, but redirect to dashboard if already logged in
  if (pathname === '/admin/login') {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // ── Client routes
  if (pathname.startsWith('/client') && role !== 'client') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ── Architect routes
  if (pathname.startsWith('/architect') && role !== 'architect') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ── Admin routes — redirect to dedicated admin login
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/client/:path*', '/architect/:path*', '/admin/:path*'],
}
