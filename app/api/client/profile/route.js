import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(session.user.id) },
    })
    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(req) {
  const session = await auth()
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const { phone, state } = data

    const updatedProfile = await prisma.clientProfile.update({
      where: { userId: parseInt(session.user.id) },
      data: { phone, state },
    })

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
