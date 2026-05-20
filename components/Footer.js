'use client'
import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <Link href="/" className="footer-logo">
              ArchiConnect<span className="gold-dot">.</span>NG
            </Link>
            <p className="footer-desc">
              The #1 trusted marketplace for verified Nigerian architects. Connect, hire, and build with confidence.
            </p>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/#how-it-works">How it Works</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact Support</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><Link href="/blog">Architecture Blog</Link></li>
              <li><Link href="/verify-architect">Verify a License</Link></li>
              <li><Link href="/marketplace">Browse Architects</Link></li>
              <li><Link href="/client/project-new">Post a Project</Link></li>
            </ul>
          </div>

          <div className="footer-col newsletter-col">
            <h4>Stay Updated</h4>
            <p>Get the latest design trends and market insights.</p>
            <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" />
              <button type="submit">→</button>
            </form>
            <div className="footer-social">
              <a href="#" className="social-icon">Twitter</a>
              <a href="#" className="social-icon">LinkedIn</a>
              <a href="#" className="social-icon">Instagram</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container bottom-bar-content">
          <div className="copyright-text">
            &copy; {year} ArchiConnect NG. All rights reserved.
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
