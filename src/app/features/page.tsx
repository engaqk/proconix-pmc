"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CapexCalculator from '../CapexCalculator';

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
    <div className="features-page">
      {/* Navigation */}
      <nav id="main-nav" style={{ padding: navPadding, background: 'rgba(7, 20, 42, 0.95)' }}>
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
              <a href="mailto:info@proconixpmc.com?subject=NDA%20Request" className="btn-outline">Request NDA</a>
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
          <Link href="/#advantage">Our Advantage</Link>
          <Link href="/#about">About</Link>
          <Link href="/#cases">Case Evidence</Link>
          <button onClick={handleDiscoveryClick} className="btn-gold" style={{ marginTop: '10px' }}>Book Discovery Call</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="features-hero" style={{ padding: '160px 0 60px', textAlign: 'center', background: 'var(--navy-deep)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="hero-badge" style={{ margin: '0 auto 20px', justifyContent: 'center' }}><span className="hero-badge-dot"></span> Advanced Governance Features</div>
          <h1 style={{ marginBottom: '20px' }}>The Sponsor&apos;s <em>Strategic Advantage</em></h1>
          <p className="hero-sub" style={{ margin: '0 auto 60px', maxWidth: '700px' }}>
            A suite of high-trust tools and transparency frameworks designed to provide 
            total control to the $5M–$100M+ project sponsor in Africa.
          </p>
          <div className="calculation-container" style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--navy-card)', padding: '2px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative' }}>
             <div style={{ position: 'absolute', top: '10px', right: '15px', color: 'var(--gold)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Interactive Tool</div>
            <CapexCalculator />
          </div>
        </div>
      </section>

      {/* Footer / Contact CTA  */}
      <section className="cta-section" style={{ background: 'transparent', padding: '60px 0 100px', textAlign: 'center' }}>
        <div className="container">
          <p style={{ marginTop: '0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            * We engineer the governance structures that protect your project capital from day one.
          </p>
          <div style={{ marginTop: '40px' }}>
            <button onClick={handleDiscoveryClick} className="btn-gold" style={{ padding: '16px 32px' }}>Book Discovery Call</button>
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--navy-deep)', padding: '40px 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
           <Link href="/" className="nav-logo-wrapper" style={{ textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
             <div className="nav-logo" style={{ fontSize: '1.2rem' }}>PROCONIX</div>
             <div className="nav-tagline" style={{ fontSize: '0.45rem' }}>Project Management Consultancy</div>
           </Link>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© 2026 Proconix Project Management Consultancy. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .hotspot {
          width: 12px; height: 12px;
          background: var(--gold);
          border-radius: 50%;
          cursor: pointer;
        }
        .hotspot:hover .hotspot-card {
          opacity: 1; visibility: visible;
          transform: translateY(-10px);
        }
        .hotspot-card {
          position: absolute; bottom: 20px; left: 50%;
          transform: translateX(-50%) translateY(0);
          background: var(--navy-card); border: 1px solid var(--gold);
          padding: 10px 14px; width: 180px;
          font-size: 0.75rem; color: var(--white);
          opacity: 0; visibility: hidden;
          transition: all 0.3s; z-index: 10;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .pulse {
          position: absolute; top: -10px; left: -10px;
          width: 32px; height: 32px;
          border: 2px solid var(--gold); border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
