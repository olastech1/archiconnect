import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withMobileAuth } from '@/lib/mobileAuth'

// GET /api/mobile/projects -> Get all projects for the logged in user (Client or Architect)
async function getProjects(req) {
  const user = req.user

  try {
    if (user.role === 'client') {
      const client = await prisma.clientProfile.findUnique({
        where: { userId: parseInt(user.id) },
        include: {
          projects: {
            include: { proposals: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      })
      return NextResponse.json({ projects: client?.projects || [] })
    } 
    
    if (user.role === 'architect') {
      // Architects want to see all open projects on the marketplace
      const projects = await prisma.project.findMany({
        where: { status: 'open' },
        include: {
          clientProfile: {
            include: { user: { select: { fullName: true } } }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json({ projects })
    }

    return NextResponse.json({ error: 'Role not supported' }, { status: 400 })

  } catch (error) {
    console.error('Mobile Fetch Projects Error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/mobile/projects -> Post a new project (Client only)
async function createProject(req) {
  const user = req.user
  
  if (user.role !== 'client') {
    return NextResponse.json({ error: 'Only clients can post projects' }, { status: 403 })
  }

  try {
    const data = await req.json()
    
    const client = await prisma.clientProfile.findUnique({
      where: { userId: parseInt(user.id) }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
    }

    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        projectType: data.projectType || null,
        state: data.state || null,
        budgetMin: data.budgetMin || null,
        budgetMax: data.budgetMax || null,
        clientId: client.id,
      }
    })

    return NextResponse.json({ success: true, project: newProject }, { status: 201 })
  } catch (error) {
    console.error('Mobile Create Project Error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

// Export the protected routes
export const GET = withMobileAuth(getProjects)
export const POST = withMobileAuth(createProject, ['client'])
