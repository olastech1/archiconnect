'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1200)
  }

  return (
    <main>
      <section style={{ background: 'linear-gradient(135deg, #0a192f 0%, #172a45 100%)', padding: '70px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, marginBottom: '14px' }}>Contact Support</h1>
          <p style={{ color: '#a8b2d1', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Have a question or need help? Our team typically responds within 2–4 hours.
          </p>
        </div>
      </section>

      <section style={{ padding: '70px 0', background: '#f8f9fb' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '60px', alignItems: 'start', maxWidth: '900px' }}>

          {/* Info */}
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#0a192f', fontWeight: 800, marginBottom: '24px' }}>Get in Touch</h2>
            {[
              { icon: '📧', label: 'Email', value: 'support@archiconnect.ng' },
              { icon: '📱', label: 'WhatsApp', value: '+234 800 ARCHI NG' },
              { icon: '🕐', label: 'Office Hours', value: 'Mon–Fri, 8am–6pm WAT' },
              { icon: '📍', label: 'Address', value: 'Lagos, Nigeria' },
            ].map(c => (
              <div key={c.label} style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', width: '40px', textAlign: 'center', flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0a192f', fontSize: '0.9rem', marginBottom: '3px' }}>{c.label}</div>
                  <div style={{ color: '#4a5568', fontSize: '0.95rem' }}>{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="form-card">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                <h3 style={{ color: '#0a192f', marginBottom: '10px' }}>Message Sent!</h3>
                <p style={{ color: '#666' }}>We&apos;ll get back to you within 2–4 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: '20px', color: '#0a192f', fontSize: '1.1rem' }}>Send a Message</h3>
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-control" placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="form-control" type="email" placeholder="you@example.com" required />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select className="form-control">
                    <option>General Inquiry</option>
                    <option>Verification Help</option>
                    <option>Technical Issue</option>
                    <option>Billing Question</option>
                    <option>Report a User</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea className="form-control" rows={5} style={{ resize: 'vertical' }} placeholder="Describe your issue or question..." required />
                </div>
                <button type="submit" className="btn-full" disabled={loading}>
                  {loading ? 'Sending...' : '📨 Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
