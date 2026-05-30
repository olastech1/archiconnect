import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = parseInt(params.id)
  const { title, content, imageUrl, published, slug } = await request.json()
  
  if (!title || !content || !slug) {
    return NextResponse.json({ error: 'Title, Content, and Slug are required' }, { status: 400 })
  }

  // Check if slug exists for another post
  const existing = await prisma.blogPost.findUnique({ where: { slug } })
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: { title, content, imageUrl, published, slug }
  })

  return NextResponse.json(post)
}

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = parseInt(params.id)
  await prisma.blogPost.delete({ where: { id } })
  
  return NextResponse.json({ success: true })
}
