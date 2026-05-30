import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const settings = await prisma.platformSetting.findMany()
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {})

  return NextResponse.json(settingsMap)
}

export async function POST(request) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  const updates = []
  
  for (const [key, value] of Object.entries(body)) {
    updates.push(
      prisma.platformSetting.upsert({
        where: { key },
        update: { value: value.toString() },
        create: { key, value: value.toString() }
      })
    )
  }
  
  await prisma.$transaction(updates)
  
  return NextResponse.json({ success: true })
}
