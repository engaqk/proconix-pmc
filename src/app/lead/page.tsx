"use client";

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';

export default function LeadPage() {
  const [navPadding, setNavPadding] = useState('18px 0');
  const [formStatus, setFormStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavPadding(window.scrollY > 60 ? '12px 0' : '18px 0');
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = '1';
          (e.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.pain-card, .who-card, .m-tile, .quad-tile, .deploy-card, .case-card').forEach((el) => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(16px)';
      element.style.transition = 'opacity .5s ease, transform .5s ease';
      observer.observe(element);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.parentElement?.classList.toggle('open');
  };

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu on click
    const target = document.querySelector(targetId);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setFormStatus(null);
    
    // Trigger download immediately on valid submit
    window.open("https://checklist.gr8.com/", "_blank");

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'Checklist Download (Lead Page)' }),
      });
      if (res.ok) {
        setFormStatus({ type: 'success', message: 'Details captured. Your download has opened in a new tab.' });
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      // Silently ignore capture errors to ensure user gets the file
    }

  };

  const handleDiscoveryClick = async () => {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Anonymous Click (Lead Page)', 
          email: 'Pending registration', 
          type: 'Strategic Audit Click' 
        }),
      });
    } catch {}
    window.open("https://topmate.io/talibkhanji_pmp/2043275", "_blank");
  };

  const handleChecklistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Anonymous Click (Lead Page)', 
          email: 'Pending registration', 
          type: 'External Checklist Click' 
        }),
      });
    } catch {}
    window.open("https://checklist.gr8.com/", "_blank");
  };

  return (
    <>
      <nav id="main-nav" style={{ padding: navPadding }}>
        <div className="container">
          <div className="nav-inner">
            <div className="nav-logo-wrapper">
              <div className="nav-logo">PROCONIX</div>
              <div className="nav-tagline">Project Management Consultancy</div>
            </div>

            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/features">Features</Link></li>
              <li><a href="#hero-card" onClick={(e) => smoothScroll(e, "#hero-card")}>Checklist</a></li>
            </ul>

            <div className="nav-right">
              <div className="nav-social">
                <a href="https://www.linkedin.com/in/talibkhanjipmp/" target="_blank" rel="noopener" title="LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://wa.me/918530781153" target="_blank" rel="noopener" title="WhatsApp">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
              <button onClick={handleDiscoveryClick} className="btn-gold">Book Strategic Audit</button>
            </div>

            <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <button onClick={handleDiscoveryClick} className="btn-gold" style={{ marginTop: '10px' }}>Book Strategic Audit</button>
        </div>

        <div className="mandate-ticker">
          <div className="container">
            <div className="ticker-content">
              <span className="ticker-dot"></span>
              <strong>Active Mandates:</strong> Currently governing <strong>$314M+</strong> in CAPEX across Africa. 
              <span className="ticker-scarcity">1 Mandate Slot Remaining for Q3 2026</span>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero" style={{ paddingTop: '180px' }}>
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                Premium Lead Resource · Africa
              </div>

              <h1>
                Protect Your Capital From Day One —<br/>
                Through End-to-End Governance.
              </h1>

              <p className="hero-sub" style={{ maxWidth: '650px' }}>
                African construction projects lose 20–40% of planned project value to overruns and unchecked variations. 
                Our governance architecture installs the structural authority required to protect $5M–$100M+ mandates.
              </p>

              <div className="hero-ctas">
                <button onClick={handleDiscoveryClick} className="btn-gold">Book Strategic Audit</button>
                <a href="#hero-card" onClick={(e) => smoothScroll(e, "#hero-card")} className="btn-outline">Free Checklist ↓</a>
              </div>
              <p className="hero-qualify">Note: Exclusive to $5M—$100M+ Project Sponsors in Africa.</p>

              <div className="hero-metrics">
                <div className="hero-metric">
                  <strong>$250M+</strong><span>Portfolio Governed</span>
                </div>
                <div className="hero-metric">
                  <strong>Up to 20%</strong><span>Cost Savings</span>
                </div>
                <div className="hero-metric">
                  <strong>Zero</strong><span>Quality Defects</span>
                </div>
              </div>
            </div>

            <div className="hero-card" id="hero-card">
              <div className="card-tag">Free Resource — Download Instantly</div>
              <h3>Pre-Construction Governance Checklist — Africa</h3>
              
              <div className="resource-visual">
                <div className="mockup-pdf">
                  <div className="mockup-header">PROCONIX</div>
                  <div className="mockup-body">
                    <div className="mockup-line"></div>
                    <div className="mockup-line"></div>
                    <div className="mockup-line short"></div>
                  </div>
                </div>
                <p>13 diagnostic areas. Know exactly where you stand before your contractor mobilises.</p>
              </div>

              <form className="capture-form" onSubmit={handleFormSubmit}>
                <input type="text" placeholder="Your Full Name" name="name" required/>
                <input type="email" placeholder="Your Email Address" name="email" required />
                <select name="budget" required className="form-select">
                  <option value="">Project Budget (CAPEX)</option>
                  <option value="5-10m">$5M — $10M</option>
                  <option value="10-50m">$10M — $50M</option>
                  <option value="50m+">$50M+</option>
                </select>
                <button type="submit" className="btn-gold">Download Free Checklist →</button>
                <p className="form-note">No spam. Built for high-stakes sponsors.</p>
              
                {formStatus && <div className={`form-status ${formStatus.type}`}>{formStatus.message}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="identity-section" style={{ background: '#07142A' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Why Governance?</div>
          <h2 className="section-title">The Hidden 30% Cost Trap™</h2>
          <p className="section-intro" style={{ margin: '0 auto 60px' }}>
            Without structured governance, 20-40% of project value is lost before the first brick is laid. 
            Reports from consultants only tell you what went wrong last month. Governance prevents it today.
          </p>
          
          <div className="who-grid">
            <div className="who-card">
              <div className="who-icon">🛡️</div>
              <h4>Variation Lockdown</h4>
              <p>Blocking unmanaged claims and enforcing contractual discipline from inception.</p>
            </div>
            <div className="who-card">
              <div className="who-icon">📉</div>
              <h4>Cost Protection</h4>
              <p>Eliminating silent inflation in procurement and site execution via structured authority.</p>
            </div>
            <div className="who-card">
              <div className="who-icon">🏗️</div>
              <h4>On-Ground Reality</h4>
              <p>Africa-specific execution intelligence that global consulting firms simply lack.</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: '#0B1D35', padding: '60px 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="container">
           <div className="nav-logo" style={{ marginBottom: '10px' }}>PROCONIX</div>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Developed by Proconix Project Management Consultancy.</p>
        </div>
      </footer>
    </>
  );
}
