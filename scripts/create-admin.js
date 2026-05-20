/**
 * Run this script to create or reset the admin account:
 *   node scripts/create-admin.js
 *
 * Or with custom credentials:
 *   ADMIN_EMAIL=me@example.com ADMIN_PASS=MyPass123! node scripts/create-admin.js
 */

const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@archiconnect.ng'
  const password = process.env.ADMIN_PASS || 'Admin@2026!'
  const name = process.env.ADMIN_NAME || 'ArchiConnect Admin'

  const hash = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, isVerified: true, role: 'admin', fullName: name },
    create: { email, password: hash, fullName: name, role: 'admin', isVerified: true },
  })

  console.log('\n✅ Admin account ready')
  console.log('   Email   :', user.email)
  console.log('   Password:', password)
  console.log('   Role    :', user.role)
  console.log('   Login at: /admin/login\n')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
