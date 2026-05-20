import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl
  const role = token?.role

  if (pathname.startsWith('/client') && role !== 'client') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (pathname.startsWith('/architect') && role !== 'architect') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/client/:path*', '/architect/:path*', '/admin/:path*'],
}
