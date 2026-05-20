import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session || session.user.role !== 'client') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await request.json()
  const proposalId = parseInt(params.id)

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { project: { include: { client: true } } },
  })

  if (!proposal || proposal.project.client.userId !== parseInt(session.user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (action === 'accept') {
    await prisma.proposal.update({ where: { id: proposalId }, data: { status: 'accepted' } })
    await prisma.project.update({ where: { id: proposal.projectId }, data: { status: 'awarded' } })
    // Reject all other proposals for this project
    await prisma.proposal.updateMany({
      where: { projectId: proposal.projectId, id: { not: proposalId } },
      data: { status: 'rejected' },
    })
  } else if (action === 'reject') {
    await prisma.proposal.update({ where: { id: proposalId }, data: { status: 'rejected' } })
  }

  return NextResponse.json({ success: true })
}
