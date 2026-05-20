import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session || session.user.role !== 'architect') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.architectProfile.findUnique({ where: { userId: parseInt(session.user.id) } })
  await prisma.portfolioItem.deleteMany({ where: { id: parseInt(params.id), architectProfileId: profile.id } })
  return NextResponse.json({ success: true })
}
