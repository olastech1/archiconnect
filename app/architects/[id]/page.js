import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(params.id) } })
    return { title: user ? `${user.fullName} — Architect Profile` : 'Architect Profile' }
  } catch { return { title: 'Architect Profile' } }
}

async function getArchitect(id) {
  try {
    return await prisma.user.findUnique({
      where: { id: parseInt(id), role: 'architect' },
      include: {
        architectProfile: { include: { portfolios: true } },
      },
    })
  } catch { return null }
}

export default async function ArchitectProfilePage({ params }) {
  const arch = await getArchitect(params.id)
  if (!arch) notFound()

  const profile = arch.architectProfile

  return (
    <>
      <section className="profile-hero">
        <div className="container">
          <div className="profile-header-grid">
            <div className="ph-info">
              <div className="ph-avatar">
                {arch.profilePic
                  ? <img src={arch.profilePic} alt={arch.fullName} />
                  : arch.fullName.charAt(0).toUpperCase()
                }
              </div>
              <div>
                <h1 className="ph-name">{arch.fullName}</h1>
                <div className="ph-badges">
                  {profile?.verificationStatus === 'verified' && (
                    <span className="badge-verified">✔ NIA Verified</span>
                  )}
                  {profile?.state && <span>📍 {profile.state}</span>}
                  {profile?.experienceYears && <span>💼 {profile.experienceYears} Years Experience</span>}
                </div>
              </div>
            </div>
            <Link href={`/client/messages?to=${arch.id}`} className="btn-solid-lg">
              💬 Contact Architect
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="profile-layout">
          <div>
            {/* Bio */}
            {profile?.bio && (
              <div className="content-box">
                <h3>About</h3>
                <p className="bio-text">{profile.bio}</p>
              </div>
            )}

            {/* Specialization */}
            {profile?.specialization && (
              <div className="content-box">
                <h3>Specialization</h3>
                <div className="specialization-tags">
                  {profile.specialization.split(',').map(s => (
                    <span key={s} className="spec-tag">{s.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            <div className="content-box">
              <h3>Portfolio ({profile?.portfolios?.length || 0} Projects)</h3>
              {profile?.portfolios?.length > 0 ? (
                <div className="portfolio-gallery">
                  {profile.portfolios.map(p => (
                    <div key={p.id} className="gallery-item">
                      <img src={p.imageUrl} alt={p.title || 'Portfolio'} />
                      {p.title && (
                        <div className="overlay-info" style={{ position:'absolute', bottom:0, left:0, width:'100%', background:'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color:'white', padding:'15px', opacity:1 }}>
                          <strong>{p.title}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '30px' }}>
                  <p>No portfolio items yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sidebar-card">
              <h3>Credentials</h3>
              <ul className="cred-list">
                <li><span className="label">Status</span><span className={profile?.verificationStatus === 'verified' ? 'value verified-text' : 'value'}>{profile?.verificationStatus === 'verified' ? '✔ Verified' : '⏳ Pending'}</span></li>
                {profile?.arconNumber && <li><span className="label">ARCON No.</span><span className="value">{profile.arconNumber}</span></li>}
                {profile?.niaNumber && <li><span className="label">NIA No.</span><span className="value">{profile.niaNumber}</span></li>}
                <li><span className="label">Experience</span><span className="value">{profile?.experienceYears || 'N/A'} Years</span></li>
                <li><span className="label">Member Since</span><span className="value">{new Date(arch.createdAt).getFullYear()}</span></li>
              </ul>
            </div>

            <div className="sidebar-card">
              <h3>Stats</h3>
              <div className="stat-row">
                <div className="stat"><span className="num">{profile?.portfolios?.length || 0}</span><span className="txt">Projects</span></div>
                <div className="stat"><span className="num">5.0</span><span className="txt">Rating</span></div>
                <div className="stat"><span className="num">100%</span><span className="txt">Response</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
