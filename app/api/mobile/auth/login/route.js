import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-mobile-dev'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Admins skip verification check
    if (user.role !== 'admin' && !user.isVerified) {
      return NextResponse.json({ error: 'Please verify your email before logging in.' }, { status: 403 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.fullName },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Mobile Login Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
