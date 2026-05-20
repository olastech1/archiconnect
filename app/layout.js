import './globals.css'
import { SessionProvider } from 'next-auth/react'
import ConditionalShell from '@/components/ConditionalShell'

export const metadata = {
  title: {
    default: 'ArchiConnect NG — Hire Verified Architects in Nigeria',
    template: '%s | ArchiConnect NG',
  },
  description:
    "Nigeria's #1 trusted marketplace to connect clients with verified, ARCON/NIA-licensed architects. Post projects, review portfolios, and hire with confidence.",
  keywords: ['architects Nigeria', 'hire architect', 'ARCON', 'NIA', 'architecture marketplace'],
  openGraph: {
    title: 'ArchiConnect NG',
    description: 'Hire Verified Architects in Nigeria with Confidence.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ConditionalShell>{children}</ConditionalShell>
        </SessionProvider>
      </body>
    </html>
  )
}
