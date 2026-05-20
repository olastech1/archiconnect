import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const proposals = await prisma.proposal.findMany({
    where: session.user.role === 'architect'
      ? { architectProfile: { userId: parseInt(session.user.id) } }
      : { project: { client: { userId: parseInt(session.user.id) } } },
    include: {
      project: true,
      architectProfile: { include: { user: { select: { fullName: true, profilePic: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(proposals)
}

export async function POST(request) {
  const session = await auth()
  if (!session || session.user.role !== 'architect') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const profile = await prisma.architectProfile.findUnique({ where: { userId: parseInt(session.user.id) } })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const existing = await prisma.proposal.findFirst({ where: { projectId: body.projectId, architectProfileId: profile.id } })
  if (existing) return NextResponse.json({ error: 'You already submitted a proposal for this project.' }, { status: 409 })

  const proposal = await prisma.proposal.create({
    data: {
      projectId: body.projectId,
      architectProfileId: profile.id,
      coverLetter: body.coverLetter,
      proposedFee: body.proposedFee ? parseFloat(body.proposedFee) : null,
      timeline: body.timeline,
    },
  })
  return NextResponse.json({ success: true, proposal })
}
