import Link from 'next/link'

export const metadata = {
  title: 'About Us | ArchiConnect NG',
  description: 'Learn about ArchiConnect NG — the #1 trusted marketplace for verified Nigerian architects.'
}

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0a192f 0%, #172a45 100%)', color: 'white', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="badge-pill" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', marginBottom: '20px' }}>Our Story</div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '20px', lineHeight: 1.2 }}>
            Connecting Nigeria&apos;s Best<br />Architectural Talent
          </h1>
          <p style={{ color: '#a8b2d1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
            ArchiConnect NG was built to solve a real problem — finding and hiring verified, trusted architects in Nigeria is hard. We&apos;re changing that.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '80px 0', background: '#f8f9fb' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: '#0a192f', marginBottom: '20px', fontWeight: 800 }}>Our Mission</h2>
              <p style={{ color: '#4a5568', lineHeight: 1.9, marginBottom: '16px', fontSize: '1rem' }}>
                To create a transparent, trustworthy, and efficient marketplace where Nigerian clients can confidently hire verified architectural professionals for any project — residential, commercial, or industrial.
              </p>
              <p style={{ color: '#4a5568', lineHeight: 1.9, fontSize: '1rem' }}>
                Every architect on our platform is credential-verified through ARCON and NIA, so you know exactly who you&apos;re hiring.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { icon: '🛡️', label: 'ARCON Verified', desc: 'All architects are license-checked' },
                { icon: '🏛️', label: 'NIA Certified', desc: 'Members of professional bodies' },
                { icon: '🔒', label: 'Secure Platform', desc: 'End-to-end encrypted messaging' },
                { icon: '⚡', label: 'Fast Hiring', desc: 'Proposals within 24–48 hours' },
              ].map(item => (
                <div key={item.label} style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #eee', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
                  <div style={{ fontWeight: 800, color: '#0a192f', marginBottom: '4px', fontSize: '0.95rem' }}>{item.label}</div>
                  <div style={{ color: '#888', fontSize: '0.82rem' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 0', background: '#0a192f', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
            {[
              { num: '500+', label: 'Verified Architects' },
              { num: '1,200+', label: 'Projects Completed' },
              { num: '36', label: 'States Covered' },
              { num: '98%', label: 'Client Satisfaction' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#d4af37' }}>{s.num}</div>
                <div style={{ color: '#a8b2d1', marginTop: '6px', fontSize: '0.9rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', color: '#0a192f', marginBottom: '16px', fontWeight: 800 }}>Ready to Build?</h2>
          <p style={{ color: '#4a5568', marginBottom: '32px', fontSize: '1rem' }}>Join thousands of clients and architects on Nigeria&apos;s most trusted platform.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-primary-lg">Get Started Free</Link>
            <Link href="/marketplace" className="btn-outline-lg">Browse Architects</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
