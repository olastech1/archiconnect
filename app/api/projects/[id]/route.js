import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'

export async function GET(request, { params }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(params.id) },
      include: { client: { include: { user: { select: { fullName: true } } } } },
    })
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}
