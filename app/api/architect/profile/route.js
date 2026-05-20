import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'architect') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.architectProfile.findUnique({
    where: { userId: parseInt(session.user.id) },
    include: { portfolios: true },
  })
  return NextResponse.json({ profile })
}

export async function PATCH(request) {
  const session = await auth()
  if (!session || session.user.role !== 'architect') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const profile = await prisma.architectProfile.update({
    where: { userId: parseInt(session.user.id) },
    data: {
      ...(body.arconNumber !== undefined && { arconNumber: body.arconNumber }),
      ...(body.niaNumber !== undefined && { niaNumber: body.niaNumber }),
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.specialization !== undefined && { specialization: body.specialization }),
      ...(body.experienceYears !== undefined && { experienceYears: body.experienceYears }),
      ...(body.state !== undefined && { state: body.state }),
      ...(body.verificationStatus !== undefined && { verificationStatus: body.verificationStatus }),
    },
  })
  return NextResponse.json({ success: true, profile })
}
