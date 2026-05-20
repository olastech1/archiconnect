import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await request.json()
  const userId = parseInt(params.id)

  if (action === 'makeAdmin') {
    await prisma.user.update({ where: { id: userId }, data: { role: 'admin' } })
  } else if (action === 'suspend') {
    await prisma.user.update({ where: { id: userId }, data: { isVerified: false } })
  }

  return NextResponse.json({ success: true })
}
