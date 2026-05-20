import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

const allStates = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River',
  'Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'
]

const fallbackTestimonials = [
  { id:1, clientName:'Emeka Obi', location:'Lagos', rating:5, content:'I found a verified architect in 2 days. The escrow system gave me total peace of mind.', imageUrl:'https://randomuser.me/api/portraits/men/32.jpg' },
  { id:2, clientName:'Fatima Musa', location:'Abuja', rating:5, content:'Excellent platform. The portfolio quality is very high compared to other sites.', imageUrl:'https://randomuser.me/api/portraits/women/44.jpg' },
  { id:3, clientName:'David Okon', location:'PH City', rating:4, content:'Professional service. Highly recommended for anyone building in Nigeria.', imageUrl:'https://randomuser.me/api/portraits/men/85.jpg' },
]

async function getData() {
  try {
    const [architects, testimonials, blogPosts, projectTypes] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'architect' },
        include: { architectProfile: { include: { portfolios: { take: 3 } } } },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }).catch(() => []),
      prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 }).catch(() => []),
      prisma.projectType.findMany({ orderBy: { name: 'asc' } }).catch(() => []),
    ])
    return { architects, testimonials, blogPosts, projectTypes }
  } catch {
    return { architects: [], testimonials: [], blogPosts: [], projectTypes: [] }
  }
}

export const metadata = {
  title: 'ArchiConnect NG — Hire Verified Architects in Nigeria',
  description: "Nigeria's #1 marketplace for verified, ARCON/NIA-licensed architects. Post projects, review portfolios, and hire with confidence.",
}

export default async function HomePage() {
  const { architects, testimonials: dbTestimonials, blogPosts, projectTypes } = await getData()
  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-text">
            <div className="badge-pill">🇳🇬 Nigeria&apos;s #1 Architecture Marketplace</div>
            <h1>Hire Verified Architects in Nigeria with <span className="text-gold">Confidence</span>.</h1>
            <p>Discover top architects, explore portfolios, post your project, receive proposals, and award contracts securely.</p>
            <div className="hero-buttons">
              <Link href="/marketplace" className="btn-primary-lg">Find an Architect</Link>
              <Link href="/client/project-new" className="btn-outline-lg">Post a Project</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
                alt="Modern Architecture Design"
                style={{ width: '100%', borderRadius: '20px', boxShadow: '20px 20px 0px #d4af37' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <div className="search-section">
        <div className="container">
          <form action="/marketplace" method="GET" className="search-bar">
            <div className="search-input">
              <label>Project Type</label>
              <select name="type">
                <option value="">Select Type...</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Renovation">Renovation</option>
              </select>
            </div>
            <div className="search-divider"></div>
            <div className="search-input">
              <label>Location</label>
              <select name="state">
                <option value="">Select State...</option>
                {allStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="search-divider"></div>
            <div className="search-input">
              <label>Budget</label>
              <input type="text" name="budget" placeholder="e.g. 5m, 100k" />
            </div>
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>
      </div>

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose ArchiConnect NG?</h2>
            <p>The most trusted way to hire architecture professionals in Nigeria.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '✔', title: 'Verified Professionals', desc: 'Every architect is vetted against NIA & ARCON records for your safety.' },
              { icon: '🎨', title: 'Portfolio-Based Hiring', desc: 'View full portfolios, past work history, and client reviews before you hire.' },
              { icon: '🛡️', title: 'Secure Escrow', desc: 'Funds are held safely and only released when you approve the milestones.' },
              { icon: '🔒', title: 'E2EE Messaging', desc: 'All project communications are End-to-End Encrypted for total privacy.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="f-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP ARCHITECTS */}
      <section className="preview-section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <h2>Top Rated Architects</h2>
            <p>Connect with the best talent in Nigeria</p>
          </div>
          {architects.length > 0 ? (
            <div className="architects-grid">
              {architects.map(arch => (
                <div key={arch.id} className="arch-card">
                  <div className="arch-header">
                    <div className="arch-avatar">
                      {arch.profilePic
                        ? <img src={arch.profilePic} alt={arch.fullName} />
                        : arch.fullName.charAt(0).toUpperCase()
                      }
                    </div>
                    <div className="arch-info">
                      <h4>{arch.fullName}</h4>
                      {arch.architectProfile?.verificationStatus === 'verified' && (
                        <span className="badge-verified-sm">✔ Verified (NIA)</span>
                      )}
                      <div className="arch-meta">
                        <span>📍 {arch.architectProfile?.state || 'Nigeria'}</span>
                        <span>💼 {arch.architectProfile?.experienceYears || 1} Yrs Exp.</span>
                      </div>
                    </div>
                  </div>
                  <div className="arch-tags">
                    <span className="tag-pill">{arch.architectProfile?.specialization || 'General'}</span>
                    <span className="rating">⭐ 5.0</span>
                  </div>
                  <div className="arch-gallery">
                    {arch.architectProfile?.portfolios?.slice(0, 3).map((p, i) => (
                      <div key={i} className="thumb" style={{ backgroundImage: `url('${p.imageUrl}')` }}></div>
                    ))}
                    {Array.from({ length: Math.max(0, 3 - (arch.architectProfile?.portfolios?.length || 0)) }).map((_, i) => (
                      <div key={`empty-${i}`} className="thumb"></div>
                    ))}
                  </div>
                  <Link href={`/architects/${arch.id}`} className="btn-view-profile">View Profile</Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏛️</div>
              <h3>Architects are joining soon</h3>
              <p>Be the first to register as an architect on the platform.</p>
            </div>
          )}
          <div className="center-btn">
            <Link href="/marketplace" className="btn-outline-lg">Browse All Architects &rarr;</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>From idea to blueprint in three simple steps.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <h3>Post Your Project</h3>
              <p>Describe your vision, upload site documents (if any), and set your budget range.</p>
            </div>
            <div className="step-arrow">➝</div>
            <div className="step-card">
              <span className="step-number">02</span>
              <h3>Receive Proposals</h3>
              <p>Verified architects send you offers with timelines, design fees, and deliverables.</p>
            </div>
            <div className="step-arrow">➝</div>
            <div className="step-card">
              <span className="step-number">03</span>
              <h3>Hire &amp; Pay Securely</h3>
              <p>Award the contract. We hold funds in escrow and only release them when you approve the work.</p>
            </div>
          </div>
          <div className="center-btn" style={{ marginTop: '40px' }}>
            <Link href="/register" className="btn-primary-lg">Get Started Now</Link>
          </div>
        </div>
      </section>

      {/* PROJECT TYPES */}
      {projectTypes.length > 0 && (
        <section className="project-types" style={{ background: '#fff' }}>
          <div className="container">
            <div className="section-header">
              <h2>Popular Project Types</h2>
              <p>Explore specialized architects for every building type.</p>
            </div>
            <div className="types-grid">
              {projectTypes.map(type => (
                <Link key={type.id} href={`/marketplace?type=${encodeURIComponent(type.name)}`} className="type-card">
                  <img src={type.imageUrl} alt={type.name} />
                  <div className="overlay">
                    <h3>{type.name}</h3>
                    <span className="btn-find">Find Architects</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRUST BADGES */}
      <section className="trust-section">
        <div className="container">
          <h5 className="trust-heading">Professionally Verified Architects Only</h5>
          <div className="logos-grid">
            {['NIA', 'ARCON', 'COREN', 'ISO Certified'].map(b => (
              <div key={b} className="trust-badge">{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      {blogPosts.length > 0 && (
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>Latest News &amp; Insights</h2>
              <p>Tips and trends from the construction industry.</p>
            </div>
            <div className="blog-grid">
              {blogPosts.map(post => (
                <div key={post.id} className="blog-card">
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="blog-img" />
                  )}
                  <div className="blog-body">
                    <p className="blog-meta">{new Date(post.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h3>{post.title}</h3>
                    <Link href={`/blog/${post.id}`} className="blog-read-more">Read Article &rarr;</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="center-btn">
              <Link href="/blog" className="btn-outline-lg">View All Articles</Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="testimonials-section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <h2>What Clients Say</h2>
            <p>Real experiences from Nigerian homeowners and developers.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="client-profile">
                  <img src={t.imageUrl || 'https://randomuser.me/api/portraits/men/1.jpg'} alt={t.clientName} />
                  <div>
                    <h4>{t.clientName}</h4>
                    <small>{t.location || 'Nigeria'}</small>
                  </div>
                </div>
                <div className="stars">{'⭐'.repeat(t.rating)}</div>
                <blockquote>&ldquo;{t.content}&rdquo;</blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
