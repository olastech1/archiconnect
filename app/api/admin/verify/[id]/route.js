import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await request.json()
  const profile = await prisma.architectProfile.update({
    where: { id: parseInt(params.id) },
    data: { verificationStatus: status },
  })
  return NextResponse.json({ success: true, profile })
}
