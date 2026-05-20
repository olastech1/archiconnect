import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const session = await auth()
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const clientProfile = await prisma.clientProfile.findUnique({ where: { userId: parseInt(session.user.id) } })
    if (!clientProfile) return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })

    const project = await prisma.project.create({
      data: {
        clientId: clientProfile.id,
        title: body.title,
        description: body.description,
        projectType: body.projectType,
        state: body.state,
        budgetMin: body.budgetMin,
        budgetMax: body.budgetMax,
      },
    })
    return NextResponse.json({ success: true, project })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'open' },
      include: { client: { include: { user: { select: { fullName: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
