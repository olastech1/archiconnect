'use client'
import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand — full width on mobile */}
          <div className="footer-col footer-brand">
            <Link href="/" className="footer-logo">
              ArchiConnect<span className="gold-dot">.</span>NG
            </Link>
            <p className="footer-desc">
              The #1 trusted marketplace for verified Nigerian architects. Connect, hire, and build with confidence.
            </p>
            {/* Social — inline with brand on desktop, centered below on mobile */}
            <div className="footer-social">
              <a href="#" className="social-icon">𝕏 Twitter</a>
              <a href="#" className="social-icon">in LinkedIn</a>
              <a href="#" className="social-icon">📸 Instagram</a>
            </div>
          </div>

          {/* Links row — 2 columns on mobile */}
          <div className="footer-links-row">
            <div className="footer-col footer-links-col">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/#how-it-works">How it Works</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact Support</Link></li>
              </ul>
            </div>

            <div className="footer-col footer-links-col">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><Link href="/blog">Architecture Blog</Link></li>
                <li><Link href="/verify-architect">Verify a License</Link></li>
                <li><Link href="/marketplace">Browse Architects</Link></li>
                <li><Link href="/client/project-new">Post a Project</Link></li>
              </ul>
            </div>
          </div>


          {/* Newsletter — full width on mobile */}
          <div className="footer-col footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Get the latest design trends and market insights delivered to your inbox.</p>
            <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">→</button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar">
        <div className="container bottom-bar-content">
          <div className="copyright-text">
            © {year} ArchiConnect NG. All rights reserved.
          </div>
          <div className="legal-links">
            <Link href="/terms">Terms of Service</Link>
            <span className="separator">|</span>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
