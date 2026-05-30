import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { fullName: true } } }
  })
  return NextResponse.json(posts)
}

export async function POST(request) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content, imageUrl, published, slug } = await request.json()
  
  if (!title || !content || !slug) {
    return NextResponse.json({ error: 'Title, Content, and Slug are required' }, { status: 400 })
  }

  // Check if slug exists
  const existing = await prisma.blogPost.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      content,
      imageUrl,
      published,
      slug,
      authorId: parseInt(session.user.id)
    }
  })

  return NextResponse.json(post)
}
