# ArchiConnect NG

**Nigeria's #1 Verified Architecture Marketplace** — built with Next.js, Prisma, and NextAuth.js. Deployable on Vercel with a free Neon PostgreSQL database.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) |
| Backend | Next.js API Routes + Server Actions |
| Database | PostgreSQL via **Neon** (free tier) |
| ORM | **Prisma** |
| Auth | **NextAuth.js v5** (JWT + bcrypt) |
| Hosting | **Vercel** (free tier) |
| Styling | Vanilla CSS (dark navy + gold design system) |

## ⚡ Quick Start (Local Development)

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/archiconnect-ng.git
cd archiconnect-ng

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Neon DATABASE_URL and NEXTAUTH_SECRET

# 4. Set up the database
npx prisma generate
npx prisma db push

# 5. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

### Step 1: Set Up Free Database (Neon)
1. Go to [https://neon.tech](https://neon.tech) and create a free account
2. Create a new project → copy the **Connection String**

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: ArchiConnect NG"
git remote add origin https://github.com/YOUR_USERNAME/archiconnect-ng.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New Project"** → Import your GitHub repo
3. Add Environment Variables:
   - `DATABASE_URL` = your Neon connection string
   - `NEXTAUTH_SECRET` = any random 32-char string
   - `NEXTAUTH_URL` = your Vercel app URL (e.g. `https://archiconnect-ng.vercel.app`)
4. Click **Deploy** ✅

### Step 4: Initialize the Database
```bash
npx prisma db push
```

## 📁 Project Structure

```
archiconnect-ng/
├── app/
│   ├── page.js                 # Homepage
│   ├── layout.js               # Root layout
│   ├── globals.css             # Global styles
│   ├── login/page.js           # Login
│   ├── register/page.js        # Register (client/architect)
│   ├── marketplace/page.js     # Browse architects
│   ├── architects/[id]/        # Architect profile
│   ├── client/                 # Client dashboard
│   ├── architect/              # Architect dashboard
│   ├── admin/                  # Admin dashboard
│   └── api/                    # API routes
├── components/
│   ├── Navbar.js               # Smart role-based navbar
│   └── Footer.js               # Footer
├── lib/
│   ├── prisma.js               # Prisma client singleton
│   └── auth.js                 # NextAuth config
├── prisma/
│   └── schema.prisma           # Database schema
└── middleware.js               # Route protection
```

## 🔐 Default Roles
- **Client** — Post projects, review proposals, hire architects
- **Architect** — Build portfolio, submit proposals, manage contracts
- **Admin** — Verify architects, manage users, platform settings

## 📜 Core Features
- ✅ Role-based dashboards (Client / Architect / Admin)
- ✅ NIA/ARCON credential verification system
- ✅ Portfolio management
- ✅ Project & proposal workflow
- ✅ Secure messaging (E2EE ready)
- ✅ Real-time notifications
- ✅ Blog/news system
- ✅ JWT authentication
