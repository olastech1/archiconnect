import Link from 'next/link'

export const metadata = { title: 'Privacy Policy | ArchiConnect NG' }

export default function PrivacyPage() {
  return (
    <main style={{ background: '#f8f9fb', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="form-card">
          <h1 style={{ fontSize: '2rem', color: '#0a192f', marginBottom: '6px', fontWeight: 900 }}>Privacy Policy</h1>
          <p style={{ color: '#888', marginBottom: '36px', fontSize: '0.9rem' }}>Last updated: May 20, 2026</p>

          {[
            { title: '1. Information We Collect', body: 'We collect information you provide when registering (name, email, phone), professional credentials (ARCON/NIA numbers for architects), project details you post, messages exchanged on the platform, and usage data (IP address, browser type, pages visited).' },
            { title: '2. How We Use Your Information', body: 'We use your information to operate and improve the Platform, verify architect credentials, facilitate connections between clients and architects, send transactional emails and notifications, and comply with legal obligations.' },
            { title: '3. Data Sharing', body: 'We do not sell your personal data. We share data only with: (a) other users as necessary (e.g., architect profile visible to clients), (b) service providers (e.g., Neon for database, Vercel for hosting), (c) law enforcement when required by law.' },
            { title: '4. Data Security', body: 'We implement industry-standard security measures including encryption in transit (HTTPS/TLS), encrypted passwords (bcrypt), and secure JWT-based sessions. No system is 100% secure; use strong, unique passwords.' },
            { title: '5. Cookies', body: 'We use session cookies for authentication and analytics cookies to understand Platform usage. You may disable cookies in your browser, though this may affect Platform functionality.' },
            { title: '6. Your Rights', body: 'You have the right to access, correct, or delete your personal data. To exercise these rights, email privacy@archiconnect.ng. We will respond within 30 days.' },
            { title: '7. Data Retention', body: 'We retain your data for as long as your account is active. After account deletion, we retain minimal data for legal compliance for up to 2 years.' },
            { title: '8. Children\'s Privacy', body: 'ArchiConnect NG is not intended for users under 18 years of age. We do not knowingly collect data from minors.' },
            { title: '9. Changes to this Policy', body: 'We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent Platform notice.' },
            { title: '10. Contact Us', body: 'For privacy-related questions or requests, contact our Data Protection Officer at: privacy@archiconnect.ng.' },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: '1.05rem', color: '#0a192f', fontWeight: 800, marginBottom: '10px' }}>{section.title}</h2>
              <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.95rem' }}>{section.body}</p>
            </div>
          ))}

          <Link href="/" style={{ color: '#007f5f', fontWeight: 700 }}>← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
