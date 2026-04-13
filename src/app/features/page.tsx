import { useEffect, useState } from 'react';
import Link from 'next/link';
import GovernanceSimulator from '../GovernanceSimulator';

export default function FeaturesPage() {
  const [navPadding, setNavPadding] = useState('18px 0');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavPadding(window.scrollY > 60 ? '12px 0' : '18px 0');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDiscoveryClick = async () => {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Anonymous Click (Features Page)', 
          email: 'Pending registration', 
          type: 'Discovery Call Click' 
        }),
      });
    } catch {}
    window.open("https://topmate.io/talibkhanji_pmp/2043275", "_blank");
  };

  return (
    <div className="features-page" style={{ backgroundColor: '#07142A' }}>
      {/* Navigation */}
      <nav id="main-nav" style={{ padding: navPadding, background: 'rgba(7, 20, 42, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo-wrapper" style={{ textDecoration: 'none' }}>
              <div className="nav-logo">PROCONIX</div>
              <div className="nav-tagline">Project Management Consultancy</div>
            </Link>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/features" className="active-link" style={{ color: 'var(--gold)' }}>Features</Link></li>
              <li><Link href="/#problem">The Problem</Link></li>
              <li><Link href="/#advantage">Our Advantage</Link></li>
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/#cases">Case Evidence</Link></li>
            </ul>
            <div className="nav-right">
              <button onClick={handleDiscoveryClick} className="btn-gold">Book Discovery Call</button>
            </div>
            <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/#problem">The Problem</Link>
          <button onClick={handleDiscoveryClick} className="btn-gold" style={{ marginTop: '10px' }}>Book Discovery Call</button>
        </div>
      </nav>

      {/* Hero / Simulator Section */}
      <section className="features-hero" style={{ padding: '160px 0 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="hero-badge" style={{ margin: '0 auto 20px', justifyContent: 'center' }}>
            <span className="hero-badge-dot"></span> 
            Project Governance Lab
          </div>
          <h1 style={{ marginBottom: '20px', fontSize: '2.8rem' }}>The Sponsor&apos;s <em>Command Center</em></h1>
          <p className="hero-sub" style={{ margin: '0 auto 60px', maxWidth: '750px', fontSize: '1.1rem', opacity: 0.8 }}>
            Advanced diagnostic tools and authority-based frameworks designed to provide 
            total visibility and protection to high-stakes project sponsors in Africa.
          </p>
          
          <div className="calculation-container" style={{ 
            maxWidth: '700px', 
            margin: '0 auto', 
            background: '#0B1D35', 
            borderRadius: '16px', 
            overflow: 'hidden',
            border: '1px solid rgba(201,168,76,0.3)', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)', 
            position: 'relative' 
          }}>
            <GovernanceSimulator />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="feature-grid-section" style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Proconix Command Suite</div>
            <h2 className="section-title">Beyond Standard Management</h2>
          </div>

          <div className="f-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="f-card">
              <div className="f-icon">🌡️</div>
              <h4>Real-Time Risk Heatmapping</h4>
              <p>Continuous diagnostic oversight across cost, schedule, and quality — identifying budget drift before it manifests on your balance sheet.</p>
            </div>
            <div className="f-card">
              <div className="f-icon">🛡️</div>
              <h4>Variation Lockdown Protocols</h4>
              <p>Structured governance authority to block unmanaged variation claims and enforce contractual discipline throughout the project lifecycle.</p>
            </div>
            <div className="f-card">
              <div className="f-icon">⛓️</div>
              <h4>Supply Chain Governance</h4>
              <p>Direct oversight of long-lead procurement and logistics, mitigating the 10-15% "silent inflation" typical in African procurement.</p>
            </div>
            <div className="f-card">
              <div className="f-icon">📜</div>
              <h4>Audit-Ready Transparency</h4>
              <p>Permanent, structured record-keeping and board-ready reporting that ensures your capital deployment is defensible at every stage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact CTA  */}
      <section className="cta-section" style={{ background: 'rgba(201,168,76,0.03)', padding: '100px 0', textAlign: 'center', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="container">
          <h2 style={{ marginBottom: '20px' }}>Ready to Secure Your Governance?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 40px', color: '#8EA8C3' }}>
            Book a non-obligatory diagnostic call to audit your current project architecture and identify critical exposure points.
          </p>
          <div>
            <button onClick={handleDiscoveryClick} className="btn-gold" style={{ padding: '18px 40px', fontSize: '1rem' }}>Book Strategic Audit Call</button>
          </div>
        </div>
      </section>

      <footer style={{ background: '#07142A', padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div className="container">
           <Link href="/" className="nav-logo-wrapper" style={{ textDecoration: 'none', marginBottom: '30px', display: 'inline-block' }}>
             <div className="nav-logo" style={{ fontSize: '1.4rem' }}>PROCONIX</div>
             <div className="nav-tagline" style={{ fontSize: '0.55rem' }}>Project Management Consultancy</div>
           </Link>
           <p style={{ fontSize: '0.85rem', color: '#455065' }}>© 2026 Proconix Project Management Consultancy. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .f-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 40px;
          border-radius: 12px;
          transition: all 0.3s;
        }
        .f-card:hover {
          background: rgba(255,255,255,0.04);
          transform: translateY(-5px);
          border-color: rgba(201,168,76,0.2);
        }
        .f-icon {
          font-size: 2rem;
          margin-bottom: 20px;
        }
        .f-card h4 {
          color: #C9A84C;
          font-size: 1.25rem;
          margin-bottom: 15px;
        }
        .f-card p {
          color: #8EA8C3;
          line-height: 1.6;
          font-size: 0.95rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
