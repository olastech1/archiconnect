import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata = { title: 'Browse Architects — Marketplace' }

const allStates = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River',
  'Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'
]

async function getArchitects(searchParams) {
  try {
    const state = searchParams?.state || ''
    const type = searchParams?.type || ''
    const search = searchParams?.search || ''

    return await prisma.user.findMany({
      where: {
        role: 'architect',
        ...(search ? { fullName: { contains: search, mode: 'insensitive' } } : {}),
        architectProfile: {
          ...(state ? { state } : {}),
          ...(type ? { specialization: { contains: type, mode: 'insensitive' } } : {}),
        },
      },
      include: {
        architectProfile: { include: { portfolios: { take: 3 } } },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function MarketplacePage({ searchParams }) {
  const architects = await getArchitects(searchParams)

  return (
    <>
      <div style={{ background: '#0a192f', padding: '50px 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Find Your Architect</h1>
          <p style={{ color: '#a8b2d1', fontSize: '1.1rem' }}>Browse verified professionals across Nigeria</p>
        </div>
      </div>

      <div className="container">
        <div className="market-layout">
          {/* Sidebar Filter */}
          <aside className="market-sidebar">
            <form className="filter-box">
              <h3>🔍 Filter Results</h3>
              <label>Specialization</label>
              <select name="type" defaultValue={searchParams?.type || ''}>
                <option value="">All Types</option>
                {['Residential','Commercial','Industrial','Renovation','Landscape','Interior'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <label>State</label>
              <select name="state" defaultValue={searchParams?.state || ''}>
                <option value="">All States</option>
                {allStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <label>Search by Name</label>
              <input type="text" name="search" placeholder="e.g. John Obi" defaultValue={searchParams?.search || ''} />

              <button type="submit" className="btn-full" style={{ marginTop: '5px' }}>Apply Filters</button>
            </form>
          </aside>

          {/* Results */}
          <div className="market-results">
            <div className="results-header">
              <h2 style={{ fontSize: '1.3rem' }}>Available Architects</h2>
              <span className="results-count">{architects.length} result{architects.length !== 1 ? 's' : ''}</span>
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
                          <span>💼 {arch.architectProfile?.experienceYears || 1} Yrs</span>
                        </div>
                      </div>
                    </div>
                    <div className="arch-tags">
                      <span className="tag-pill">{arch.architectProfile?.specialization || 'General'}</span>
                      <span className="rating">⭐ 5.0</span>
                    </div>
                    <div className="arch-gallery">
                      {arch.architectProfile?.portfolios?.map((p, i) => (
                        <div key={i} className="thumb" style={{ backgroundImage: `url('${p.imageUrl}')` }}></div>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - (arch.architectProfile?.portfolios?.length || 0)) }).map((_, i) => (
                        <div key={`e${i}`} className="thumb"></div>
                      ))}
                    </div>
                    <Link href={`/architects/${arch.id}`} className="btn-view-profile">View Profile</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No architects found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
