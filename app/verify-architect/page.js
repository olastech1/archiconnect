import Link from 'next/link'

export const metadata = { title: 'Verify an Architect | ArchiConnect NG' }

export default function VerifyArchitectPage() {
  return (
    <main>
      <section className="public-hero" style={{ background: 'linear-gradient(135deg, #0a192f 0%, #172a45 100%)', padding: '70px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, marginBottom: '14px' }}>Verify an Architect 🛡️</h1>
          <p style={{ color: '#a8b2d1', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto' }}>
            Check if an architect is licensed and verified on ArchiConnect NG before hiring.
          </p>
        </div>
      </section>

      <section style={{ padding: '60px 0', background: '#f8f9fb' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>

          {/* Search */}
          <div className="form-card" style={{ marginBottom: '30px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#0a192f', marginBottom: '6px', fontWeight: 800 }}>Search by ARCON Number</h2>
            <p style={{ color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>Enter an architect&apos;s ARCON registration number to verify their status.</p>
            <div className="verify-search-row" style={{ display: 'flex', gap: '10px' }}>
              <input className="form-control" placeholder="e.g. ARCON/2019/1234" style={{ flex: 1 }} />
              <button className="btn-full" style={{ maxWidth: '120px', whiteSpace: 'nowrap' }}>Check</button>
            </div>
            <p style={{ marginTop: '12px', fontSize: '0.82rem', color: '#aaa' }}>This feature will query our live verification database.</p>
          </div>

          {/* Info cards */}
          <div className="info-grid-2" style={{ marginBottom: '30px' }}>
            {[
              { icon: '✅', title: 'Verified Badge', desc: 'All verified architects display a green ✔ badge on their profile.' },
              { icon: '🛡️', title: 'ARCON Checked', desc: 'We cross-check with the Architects Registration Council of Nigeria.' },
              { icon: '📋', title: 'NIA Membership', desc: 'Membership of the Nigerian Institute of Architects is also verified.' },
              { icon: '🔍', title: 'Admin Reviewed', desc: 'Every credential is manually reviewed by our admin team.' },
            ].map(item => (
              <div key={item.title} className="form-card" style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontWeight: 800, color: '#0a192f', marginBottom: '4px', fontSize: '0.9rem' }}>{item.title}</div>
                <div style={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <Link href="/marketplace" className="btn-primary-lg" style={{ display: 'inline-block' }}>
            Browse All Verified Architects →
          </Link>
        </div>
      </section>
    </main>
  )
}
