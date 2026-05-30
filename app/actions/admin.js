'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function broadcastNotification(data) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { title, message, target, link } = data
  if (!title || !message || !target) {
    return { error: 'Missing required fields' }
  }

  try {
    let whereClause = {}
    if (target === 'architects') whereClause = { role: 'architect' }
    if (target === 'clients') whereClause = { role: 'client' }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { id: true },
    })

    if (users.length === 0) {
      return { error: 'No users found for the selected target' }
    }

    const notifications = users.map(u => ({
      userId: u.id,
      title,
      message,
      link: link || null,
    }))

    await prisma.notification.createMany({
      data: notifications,
    })

    return { success: true, count: users.length }
  } catch (error) {
    console.error('Broadcast error:', error)
    return { error: 'Failed to send broadcast' }
  }
}

export async function updateProjectStatus(projectId, status) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { status },
    })
    return { success: true }
  } catch (error) {
    console.error('Project status update error:', error)
    return { error: 'Failed to update project status' }
  }
}

export async function deleteProject(projectId) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  try {
    await prisma.project.delete({
      where: { id: projectId },
    })
    return { success: true }
  } catch (error) {
    console.error('Project deletion error:', error)
    return { error: 'Failed to delete project' }
  }
}
