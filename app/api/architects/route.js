import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state') || ''
    const type = searchParams.get('type') || ''
    const search = searchParams.get('search') || ''

    const architects = await prisma.user.findMany({
      where: {
        role: 'architect',
        architectProfile: {
          ...(state ? { state } : {}),
          ...(type ? { specialization: { contains: type, mode: 'insensitive' } } : {}),
        },
        ...(search ? { fullName: { contains: search, mode: 'insensitive' } } : {}),
      },
      include: {
        architectProfile: true,
        _count: { select: { sentMessages: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(architects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch architects' }, { status: 500 })
  }
}
