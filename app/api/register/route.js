import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { fullName, email, password, role } = await request.json()

    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36)

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role,
        verificationToken: token,
        // For development: auto-verify. In production, send email.
        isVerified: true,
      },
    })

    // Auto-create role-specific profile
    if (role === 'architect') {
      await prisma.architectProfile.create({
        data: { userId: user.id, verificationStatus: 'unverified' },
      })
    }
    if (role === 'client') {
      await prisma.clientProfile.create({
        data: { userId: user.id },
      })
    }

    return NextResponse.json({ success: true, message: 'Account created! You can now log in.' })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
