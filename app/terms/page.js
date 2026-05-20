import Link from 'next/link'

export const metadata = { title: 'Terms of Service | ArchiConnect NG' }

export default function TermsPage() {
  return (
    <main style={{ background: '#f8f9fb', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="form-card">
          <h1 style={{ fontSize: '2rem', color: '#0a192f', marginBottom: '6px', fontWeight: 900 }}>Terms of Service</h1>
          <p style={{ color: '#888', marginBottom: '36px', fontSize: '0.9rem' }}>Last updated: May 20, 2026</p>

          {[
            { title: '1. Acceptance of Terms', body: 'By creating an account or using ArchiConnect NG ("Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.' },
            { title: '2. Platform Description', body: 'ArchiConnect NG is an online marketplace that connects clients with verified Nigerian architects. We facilitate the connection but are not a party to any contract formed between clients and architects.' },
            { title: '3. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. Accounts found to contain false information will be suspended immediately.' },
            { title: '4. Architect Verification', body: 'Architects must submit valid ARCON registration numbers for verification. Submission of false credentials is a violation of these Terms and may result in permanent account removal and legal action.' },
            { title: '5. Client Responsibilities', body: 'Clients are responsible for providing accurate project briefs, responding to proposals in a timely manner, and making payments through the Platform for all services rendered.' },
            { title: '6. Fees & Payments', body: 'ArchiConnect NG charges a service fee on successful project contracts. Full fee details are displayed before any transaction is confirmed. All fees are non-refundable except where stated otherwise.' },
            { title: '7. Prohibited Conduct', body: 'Users may not solicit contact outside the Platform to avoid fees, post false reviews, harass other users, or use the Platform for any unlawful purpose.' },
            { title: '8. Limitation of Liability', body: 'ArchiConnect NG is not liable for the quality of work delivered by architects, project disputes between parties, or any indirect or consequential damages arising from Platform use.' },
            { title: '9. Changes to Terms', body: 'We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the new Terms.' },
            { title: '10. Contact', body: 'For questions about these Terms, contact us at legal@archiconnect.ng.' },
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
