import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-mobile-dev'

/**
 * Middleware utility to verify JWT tokens from mobile requests
 */
export function verifyMobileAuth(req) {
  const authHeader = req.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded // Returns user object { id, email, role, name }
  } catch (err) {
    return null
  }
}

/**
 * Higher order function to wrap mobile API routes
 */
export function withMobileAuth(handler, allowedRoles = []) {
  return async (req, ...args) => {
    const user = verifyMobileAuth(req)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Invalid or missing token.' }, { status: 401 })
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden. Insufficient permissions.' }, { status: 403 })
    }

    // Attach user to request for the handler to use
    req.user = user

    return handler(req, ...args)
  }
}
