import Link from 'next/link'

export const metadata = { title: 'Blog | ArchiConnect NG', description: 'Architecture trends, design tips, and industry insights for Nigerian architects and clients.' }

const posts = [
  { slug: 'arcon-verification-guide', title: 'How to Get ARCON Verified on ArchiConnect NG', date: 'May 15, 2026', category: 'Guides', emoji: '🛡️', excerpt: 'A step-by-step walkthrough of the ARCON credential submission process and what to expect after you apply.' },
  { slug: 'budget-residential-projects', title: '5 Tips for Budgeting Your Residential Project in Nigeria', date: 'May 10, 2026', category: 'Client Tips', emoji: '💰', excerpt: 'Understanding architect fees, construction costs, and how to plan a realistic budget for your build.' },
  { slug: 'modern-architecture-trends', title: 'Top Architecture Trends Shaping Nigerian Homes in 2026', date: 'May 4, 2026', category: 'Trends', emoji: '🏠', excerpt: 'From biophilic design to smart homes — discover what modern Nigerian homeowners are requesting most.' },
  { slug: 'proposal-writing-guide', title: 'How to Write a Winning Project Proposal', date: 'April 28, 2026', category: 'Architect Tips', emoji: '✍️', excerpt: 'Stand out from the competition with a compelling cover letter, realistic timeline, and transparent pricing.' },
  { slug: 'commercial-vs-residential', title: 'Commercial vs Residential Architecture: What\'s the Difference?', date: 'April 20, 2026', category: 'Education', emoji: '🏢', excerpt: 'An in-depth look at how commercial and residential projects differ in scope, fees, and design approach.' },
  { slug: 'hiring-architect-checklist', title: 'The Ultimate Checklist for Hiring an Architect in Nigeria', date: 'April 14, 2026', category: 'Client Tips', emoji: '📋', excerpt: 'Everything you need to verify before signing a contract with an architect — license, portfolio, references.' },
]

const categoryColors = { Guides: 'badge-blue', 'Client Tips': 'badge-green', Trends: 'badge-yellow', 'Architect Tips': 'badge-gray', Education: 'badge-blue' }

export default function BlogPage() {
  return (
    <main>
      <section style={{ background: 'linear-gradient(135deg, #0a192f 0%, #172a45 100%)', padding: '70px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, marginBottom: '14px' }}>Architecture Blog 📝</h1>
          <p style={{ color: '#a8b2d1', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Trends, tips, and insights for Nigerian architects and clients.
          </p>
        </div>
      </section>

      <section style={{ padding: '60px 0', background: '#f8f9fb' }}>
        <div className="container">
          <div className="blog-grid">
            {posts.map(post => (
              <div key={post.slug} className="blog-card">
                <div style={{ height: '180px', background: 'linear-gradient(135deg, #0a192f, #172a45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                  {post.emoji}
                </div>
                <div className="blog-body">
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                    <span className={`badge ${categoryColors[post.category] || 'badge-gray'}`}>{post.category}</span>
                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{post.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#0a192f', lineHeight: 1.4 }}>{post.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#666', lineHeight: 1.6, marginBottom: '14px' }}>{post.excerpt}</p>
                  <span style={{ color: '#007f5f', fontWeight: 700, fontSize: '0.88rem' }}>Read More →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
