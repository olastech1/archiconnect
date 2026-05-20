import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'architect') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.architectProfile.findUnique({
    where: { userId: parseInt(session.user.id) },
    include: { portfolios: { orderBy: { createdAt: 'desc' } } },
  })
  return NextResponse.json({ portfolios: profile?.portfolios || [] })
}

export async function POST(request) {
  const session = await auth()
  if (!session || session.user.role !== 'architect') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const profile = await prisma.architectProfile.findUnique({ where: { userId: parseInt(session.user.id) } })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const item = await prisma.portfolioItem.create({
    data: {
      architectProfileId: profile.id,
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      projectType: body.projectType,
      location: body.location,
      year: body.year,
    },
  })
  return NextResponse.json({ success: true, item })
}
