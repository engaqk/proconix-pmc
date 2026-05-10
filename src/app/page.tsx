"use client";

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import CapexCalculator from './CapexCalculator';

export default function Home() {
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
    
    // Direct download removed; checklist sent via email notification

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'Checklist Download (Home)' }),
      });
      if (res.ok) {
        setFormStatus({ type: 'success', message: 'Success! You will shortly receive your downloadable checklist copy via your registered email. Please check your inbox (or spam folder) to get the checklist.' });
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
          name: 'Anonymous Click', 
          email: 'Pending registration', 
          type: 'Discovery Call Click' 
        }),
      });
    } catch {}
    window.open("https://topmate.io/talibkhanji_pmp/2043275", "_blank");
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
              <li><a href="#identity" onClick={(e) => smoothScroll(e, "#identity")}>What We Are</a></li>
              <li><Link href="/features">Features</Link></li>
              <li><a href="#problem" onClick={(e) => smoothScroll(e, "#problem")}>The Problem</a></li>
              <li><a href="#advantage" onClick={(e) => smoothScroll(e, "#advantage")}>Our Advantage</a></li>
              <li><a href="#about" onClick={(e) => smoothScroll(e, "#about")}>About</a></li>
              <li><a href="#cases" onClick={(e) => smoothScroll(e, "#cases")}>Case Evidence</a></li>
              <li><Link href="/admin">Admin Login</Link></li>
            </ul>

            <div className="nav-right">
              <div className="nav-social">
                <a href="https://www.linkedin.com/in/talibkhanjipmp/" target="_blank" rel="noopener" title="LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://www.instagram.com/talibkhanji_pmp/" target="_blank" rel="noopener" title="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://wa.me/918530781153" target="_blank" rel="noopener" title="WhatsApp">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href="mailto:info@proconixpmc.com" title="Email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
              </div>
              <button onClick={handleDiscoveryClick} className="btn-gold">Book Discovery Call</button>
            </div>

            <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#identity" onClick={(e) => smoothScroll(e, "#identity")}>What We Are</a>
          <Link href="/features">Features</Link>
          <a href="#problem" onClick={(e) => smoothScroll(e, "#problem")}>The Problem</a>
          <a href="#advantage" onClick={(e) => smoothScroll(e, "#advantage")}>Our Advantage</a>
          <a href="#about" onClick={(e) => smoothScroll(e, "#about")}>About</a>
          <a href="#cases" onClick={(e) => smoothScroll(e, "#cases")}>Case Evidence</a>
          <Link href="/admin">Admin Login</Link>
          <button onClick={handleDiscoveryClick} className="btn-gold" style={{ marginTop: '10px' }}>Book Discovery Call</button>
        </div>
      </nav>
      {/* Hero Section */}
      





<section className="hero">
  <div className="container">
    <div className="hero-grid">

      
      <div>
        <div className="hero-mobile-social">
          <a href="https://www.linkedin.com/in/talibkhanjipmp/" target="_blank" rel="noopener" title="LinkedIn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://www.instagram.com/talibkhanji_pmp/" target="_blank" rel="noopener" title="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://wa.me/918530781153" target="_blank" rel="noopener" title="WhatsApp">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <a href="mailto:info@proconixpmc.com" title="Email">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
        </div>

        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          Proconix PMC · Construction Project Governance · Africa
        </div>

        
        <div className="hero-identity">
          We <strong>Direct, Manage, and Execute</strong> end-to-end construction project governance<br/>
          across the full EPCM lifecycle — from inception through to successful handover.
        </div>

        <h1>
          Your Project Deserves<br/>
          a Governance Command —<br/>
          Not a <em>Supervision Service.</em>
        </h1>

        <p className="hero-sub">
          African construction projects lose 20–40% of planned project value to overruns, unchecked variations,
          and procurement failures — silently, before sponsors see it on paper. Proconix installs the
          governance architecture that protects your capital from day one.
        </p>

        <div className="hero-ctas">
        <button onClick={handleDiscoveryClick} className="btn-gold">Book a Discovery Call</button>
          <a href="#hero-card" onClick={(e) => smoothScroll(e, "#hero-card")} className="btn-outline">Free Pre-Construction Checklist ↓</a>
        </div>

        <div className="hero-metrics">
          <div className="hero-metric">
            <strong>$250M+</strong><span>Portfolio Governed</span>
          </div>
          <div className="hero-metric">
            <strong>Up to 97%</strong><span>On-Time Delivery</span>
          </div>
          <div className="hero-metric">
            <strong>Up to 20%</strong><span>Cost Savings</span>
          </div>
          <div className="hero-metric">
            <strong>15+ yrs</strong><span>Africa On-Ground</span>
          </div>
        </div>
      </div>

      
      <div className="hero-card" id="hero-card">
        <div className="card-tag">Free Resource — Download Instantly</div>
        <h3>Before You Break Ground:<br/>Pre-Construction Governance Checklist — Africa</h3>
        <p>13 diagnostic areas. Know exactly where you stand before your contractor mobilises.</p>
        <div className="stat-rows">
          <div className="stat-row">
            <span className="val">70%</span>
            <span className="lbl">of project problems are created before ground is broken</span>
          </div>
          <div className="stat-row">
            <span className="val">30%+</span>
            <span className="lbl">cost variation exposure from incomplete pre-construction governance</span>
          </div>
        </div>
        <form className="capture-form" onSubmit={handleFormSubmit}>
          <input type="text" placeholder="Your Full Name" name="name" required/>
          <input type="email" placeholder="Your Email Address" name="email" required />
          <button type="submit" className="btn-gold">Download Free Checklist →</button>
          <p className="form-note">No spam. Built for $5M–$100M+ project sponsors in Africa.</p>
        
      {formStatus && <div className={`form-status ${formStatus.type}`}>{formStatus.message}</div>}
</form>
      </div>

    </div>
  </div>
</section>


<section className="identity-section" id="identity">
  <div className="container">
    <div className="identity-grid">

      <div className="identity-left">
        <div className="section-eyebrow">What Proconix Is — And Is Not</div>
        <h2 className="section-title">A <em>Techno-Governance Firm.</em><br/>Not a conventional consultant. Not a supervisory firm. A sponsor-aligned strategic project leader focused on delivery outcomes.</h2>

        <p style={{"fontSize":".92rem","color":"var(--text-light)","lineHeight":"1.8","fontWeight":"300","marginBottom":"8px"}}>
          Most project sponsors who engage construction advisors get observation — reports written after the damage is done.
          Proconix is built differently. We carry governance authority and operate inside your project&apos;s decision structure.
        </p>

        <ul className="not-list">
          <li><span className="not-cross">✗</span> Not a monitoring consultant who reports what went wrong</li>
          <li><span className="not-cross">✗</span> Not a project supervision service without financial authority</li>
          <li><span className="not-cross">✗</span> Not a report-writing layer disconnected from execution</li>
          <li><span className="not-cross">✗</span> Not a global firm without Africa on-ground intelligence</li>
        </ul>

        <ul className="yes-list">
          <li><span className="yes-tick">✔</span> A sponsor-aligned governance command embedded in your project&apos;s core</li>
          <li><span className="yes-tick">✔</span> Authority to direct, manage, and resolve — across cost, schedule, procurement, quality, and risk</li>
          <li><span className="yes-tick">✔</span> A techno-governance firm using structured systems and real-time oversight</li>
          <li><span className="yes-tick">✔</span> Full EPCM lifecycle coverage — from design through to handover</li>
        </ul>
      </div>

      <div className="identity-right">
        <div className="mandate-box">
          <p>"Proconix does not provide governance observation only. We Direct, Manage, and Execute end-to-end construction project governance in Africa across the EPCM lifecycle — from inception through to successful handover."</p>

          <div className="deploy-mini">
            <div className="deploy-mini-item">
              <span className="dmi-icon">🏗️</span>
              <div className="dmi-content">
                <h5>Full On-Site Governance Command™</h5>
                <p>Directing, managing, and executing governance on the sponsor's behalf — a dedicated senior presence embedded within the project environment in Africa.</p>
              </div>
            </div>
            <div className="deploy-mini-item">
              <span className="dmi-icon">🔄</span>
              <div className="dmi-content">
                <h5>Hybrid Governance Model™</h5>
                <p>Continuously directing governance remotely, managing the project throughout, and executing direct oversight on-ground at the milestones that matter most.</p>
              </div>
            </div>
            <div className="deploy-mini-item">
              <span className="dmi-icon">🖥️</span>
              <div className="dmi-content">
                <h5>Virtual Governance Control Room™</h5>
                <p>Remotely directing project governance and managing executive-level oversight — delivering full visibility and structured advisory support from anywhere in the world.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>


<div className="cred-bar">
  <div className="container">
    <div className="cred-inner">
      <div className="cred-item"><span className="cred-pip"></span>Talibbhai Khanji — Founder &amp; Principal Consultant</div>
      <div className="cred-item"><span className="cred-pip"></span>P.Eng Civil — ERB Tanzania &amp; Zambia</div>
      <div className="cred-item"><span className="cred-pip"></span>PMP® — PMI, USA</div>
      <div className="cred-item"><span className="cred-pip"></span>MBA — Project Management</div>
      <div className="cred-item"><span className="cred-pip"></span>19+ Years Multinational · 15+ Years Africa On-Ground · Since 2010</div>
    </div>
  </div>
</div>


<section className="problem-section" id="problem">
  <div className="container">
    <div className="section-eyebrow">The Governance Vacuum</div>
    <h2 className="section-title">You Know Something Is Wrong.<br/><em>You Just Can&apos;t See Where.</em></h2>
    <p className="section-intro">This is what a construction project without governance looks like — and why it is so costly by the time anyone recognises it.</p>

    <div className="problem-grid">

      
      <div className="problem-story">
        <p>Everything appears under control. Reports look clean. Then — unexpectedly — <strong>a 15% variation claim lands on your desk.</strong> Procurement has stalled for three rounds. The handover date has moved again.</p>
        <p>Your contractor and consultant are pointing at each other. No single catastrophic failure. <strong>Just a system with no one governing it.</strong></p>

        <div className="vacuum-quote">
          <p>"This is the governance vacuum. It exists on most high-stakes African construction projects — and it quietly consumes 20–40% of planned project value before sponsors see the damage on paper, long after the decisions that caused it were made."</p>
        </div>

        <p>African construction markets move fast. <em>Verbal mobilisation, evolving scope, multiple stakeholders with competing agendas,</em> and limited institutional oversight create conditions where even well-funded projects bleed capital silently.</p>
        <p>The answer is a governance system built around the <strong>sponsor&apos;s interests — from day one.</strong> Not from the moment the first crisis surfaces.</p>

        <div className="trap-box">
          <h4>The 30% Hidden Cost Trap™</h4>
          <ul className="trap-rows">
            <li><strong>Direct Losses —</strong> time delays, cost overruns, late-stage quality defects and rework</li>
            <li><strong>Indirect Losses —</strong> lost revenue windows, extended financing costs, operator penalties</li>
            <li><strong>Reputation Damage —</strong> handover failure, market credibility erosion, investor confidence loss</li>
            <li><strong>Time Opportunity Cost —</strong> 8–16 hours per week of executive bandwidth consumed by site firefighting that should never have reached you</li>
          </ul>
        </div>
      </div>

      
      <div className="pain-cards">

        <div className="pain-card">
          <div className="pc-icon">📉</div>
          <div className="pc-text">
            <h5>Cost Overruns You Didn&apos;t See Coming</h5>
            <p>The first integrated cost report reveals $3–5M in growth. The board calls. You realise the governance wasn&apos;t there. Variations that should have been blocked are already approved.</p>
            <span className="pc-signal">→ 20–40% overrun typical without structured governance</span>
          </div>
        </div>

        <div className="pain-card">
          <div className="pc-icon">🗓️</div>
          <div className="pc-text">
            <h5>Schedule Slippage With No Recovery Path</h5>
            <p>The critical path slips 4–8 weeks. Contractors blame design. Engineers blame contractors. You spend 12–14 hours weekly in conflict resolution that no one is equipped to resolve.</p>
            <span className="pc-signal">→ 30–50% slippage typical by construction midpoint</span>
          </div>
        </div>

        <div className="pain-card">
          <div className="pc-icon">📦</div>
          <div className="pc-text">
            <h5>Procurement Exploited Without Your Knowledge</h5>
            <p>A major shipment is stuck in customs. Currency fluctuation adds 8–10% cost. The supplier exploits the knowledge gap and overcharges by 15%. No one flagged it before it happened.</p>
            <span className="pc-signal">→ 8–15% silent budget inflation from unstructured procurement</span>
          </div>
        </div>

        <div className="pain-card">
          <div className="pc-icon">😓</div>
          <div className="pc-text">
            <h5>Sleepless Nights. Your Capital. Their Chaos.</h5>
            <p>The underlying fear that the project will "blow up" unexpectedly. A reputation built over years is sitting on a project with no governance architecture holding it together.</p>
            <span className="pc-signal">→ Peace of mind is a governance outcome, not a feeling</span>
          </div>
        </div>

        <div className="pain-card">
          <div className="pc-icon">🏗️</div>
          <div className="pc-text">
            <h5>Quality Defects Discovered at Handover</h5>
            <p>The hotel operator rejects the finish standards. Rework is apparent. The contractor disputes liability. Your opening date — and your reputation — are now both at risk.</p>
            <span className="pc-signal">→ Quality governed from inception, not inspected at the end</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>


<section className="metrics-section">
  <div className="container">
    <div className="section-eyebrow">Proven Outcomes</div>
    <h2 className="section-title">What Changes When<br/><em>Governance Is In Place</em></h2>
    <div className="metrics-grid">
      <div className="m-tile"><div className="mnum">$250M+</div><div className="mdesc">Portfolio Governed Across Africa, GCC &amp; India</div></div>
      <div className="m-tile"><div className="mnum">Up to 97%</div><div className="mdesc">On-Time Delivery Rate — Structured Programme Management</div></div>
      <div className="m-tile"><div className="mnum">Up to 20%</div><div className="mdesc">Total Cost Savings — Direct + Indirect Through Governance</div></div>
      <div className="m-tile"><div className="mnum">8–16 hrs</div><div className="mdesc">Executive Hours Reclaimed Per Week — Returned to Strategy</div></div>
      <div className="m-tile"><div className="mnum">Zero</div><div className="mdesc">Major Quality Issues at Handover — Across All Governed Projects</div></div>
    </div>
  </div>
</section>


<section className="who-section">
  <div className="container">
    <div className="section-eyebrow">Ideal Client Profile</div>
    <h2 className="section-title">Built for <em>Project Sponsors</em></h2>
    <p className="section-intro">Proconix serves real estate, hospitality, and industrial project sponsors and investors — with construction projects in Africa. GCC-based, diaspora, and African-domiciled investors who need their capital governed, not just managed.</p>
    <div className="who-grid">
      <div className="who-card">
        <div className="who-icon">🏨</div>
        <h4>Hospitality &amp; Resort Developers</h4>
        <p>Hotel, resort, and serviced apartment developers across East Africa and the continent. High-specification builds with operator opening commitments and brand reputation on the line at handover.</p>
        <span className="who-tag">Real Estate · $5M–$100M+ CAPEX</span>
      </div>
      <div className="who-card">
        <div className="who-icon">🏢</div>
        <h4>Real Estate Investors &amp; Sponsors</h4>
        <p>Residential, mixed-use, and commercial developers deploying capital in Africa — whether Africa-domiciled, diaspora investors in the GCC, or cross-border family offices entering the market.</p>
        <span className="who-tag">Hospitality · $5M–$100M+ CAPEX</span>
      </div>
      <div className="who-card">
        <div className="who-icon">🏭</div>
        <h4>Industrial &amp; Conglomerate Sponsors</h4>
        <p>Manufacturing, industrial parks, and institutional infrastructure where governance gaps translate directly into operational downtime, capital erosion, and multi-package coordination failure.</p>
        <span className="who-tag">Industrial · $20M–$100M+ CAPEX</span>
      </div>
    </div>
  </div>
</section>


<section className="lead-section" id="lead-magnet">
  <div className="container">
    <div className="lead-grid">

      <div className="lead-left">
        <div className="section-eyebrow">Free Resource</div>
        <h2 className="section-title">Know Where You Stand<br/><em>Before It Costs You On Site</em></h2>
        <p className="section-intro">70% of construction project problems are created before ground is broken. This checklist ensures you have a structured governance command in place before your contractor mobilises.</p>
      </div>

      <div className="lead-form-box">
        <div className="lfb-tag">Free Download · 3-Page PDF · No Obligation</div>
        <h3>Before You Break Ground:<br/>Pre-Construction Governance Checklist — Africa</h3>
        <p>Built for $5M–$100M+ CAPEX project sponsors in Africa. 13 diagnostic areas. Readiness score output. No theory. No filler.</p>
        <form className="lead-form" onSubmit={handleFormSubmit}>
          <input type="text" placeholder="Your Full Name" name="name" required/>
          <input type="email" placeholder="Your Email Address" name="email" required />
          <input type="text" placeholder="Project Country (Where in Africa?)" name="country" required/>
          <input type="text" placeholder="Project Sector (Real Estate / Hospitality / Industrial)" name="sector" required/>
          <button type="submit" className="btn-gold">Download the Checklist →</button>
        
      {formStatus && <div className={`form-status ${formStatus.type}`}>{formStatus.message}</div>}
</form>
        <p className="lead-privacy">Your information is used solely to deliver your resource and relevant governance insights. No unsolicited sales calls.</p>
      </div>

    </div>
  </div>
</section>


<section className="quad-section" id="advantage">
  <div className="container">
    <div className="section-eyebrow">The Quad-Domain Advantage</div>
    <h2 className="section-title">Why No Competitor Can<br/><em>Replicate This Combination</em></h2>

    <div className="quad-preamble">
      <p className="section-intro">A pure engineer knows the technical side — not the financial exposure. A pure project manager doesn&apos;t understand constructability. A global firm lacks Africa on-ground intelligence. A local firm lacks global governance standards. Proconix combines all four — in one mandated engagement.</p>
      <div className="quad-statement">"In environments where governance — not capital — determines outcome quality, the Quad-Domain combination becomes the decisive competitive advantage no competitor in Africa can fully replicate."</div>
    </div>

    <div className="quad-grid">
      <div className="quad-tile">
        <div className="qt-num">01</div>
        <div className="qt-tag">Technical Engineering Expertise</div>
        <h4>Constructability-Driven Governance</h4>
        <p>Design reviewed for African on-ground realities before a brick is laid — local material availability, contractor capability, and site-specific conditions that international firms routinely miss.</p>
        <div className="qt-cred">P.Eng (Civil) — ERB Tanzania &amp; Zambia</div>
        <div className="qt-missing">✗ Overpriced multinationals lack this</div>
      </div>
      <div className="quad-tile">
        <div className="qt-num">02</div>
        <div className="qt-tag">Business &amp; Capital Strategy</div>
        <h4>Every Project Treated as a Capital Investment</h4>
        <p>Financial governance, ROI alignment, board-level reporting, and capital protection — integrated from inception, not bolted on after the first overrun lands on your desk.</p>
        <div className="qt-cred">MBA — Project Management Specialisation</div>
        <div className="qt-missing">✗ Pure engineers lack this</div>
      </div>
      <div className="quad-tile">
        <div className="qt-num">03</div>
        <div className="qt-tag">Global Governance Standards</div>
        <h4>International Frameworks, Africa-Adapted</h4>
        <p>PMI governance standards, structured risk management, and variation control protocols — calibrated to the contractual and regulatory realities of African construction markets.</p>
        <div className="qt-cred">PMP® — Project Management Professional, PMI USA</div>
        <div className="qt-missing">✗ Local-only firms lack this</div>
      </div>
      <div className="quad-tile">
        <div className="qt-num">04</div>
        <div className="qt-tag">Africa Execution Intelligence</div>
        <h4>On-Ground Depth Since 2010</h4>
        <p>15+ years of active delivery across East Africa — procurement networks, regulatory navigation, contractor relationship intelligence, and market-specific risk patterns no international firm can replicate from a distance.</p>
        <div className="qt-cred">15+ Years Africa On-Ground · Active Since 2010</div>
        <div className="qt-missing">✗ Global firms lack this</div>
      </div>
    </div>
  </div>
</section>


<section className="how-section">
  <div className="container">
    <div className="section-eyebrow">The Executive Construction Project Governance Architecture™</div>
    <h2 className="section-title">One Governance Framework.<br/><em>Across Your Full EPCM Lifecycle.</em></h2>
    <p className="section-intro">Most project problems are created before construction begins. Proconix governance starts at inception — where protection is built, not discovered too late on site.</p>

    <div className="lifecycle">
      <div className="lc-step"><div className="lc-dot"></div><div className="lc-label">Inception</div><div className="lc-sub">Architecture Setup</div></div>
      <div className="lc-step"><div className="lc-dot"></div><div className="lc-label">Engineering</div><div className="lc-sub">Design &amp; Constructability</div></div>
      <div className="lc-step"><div className="lc-dot"></div><div className="lc-label">Procurement</div><div className="lc-sub">Supply Chain Governance</div></div>
      <div className="lc-step"><div className="lc-dot"></div><div className="lc-label">Construction</div><div className="lc-sub">Execution Control</div></div>
      <div className="lc-step"><div className="lc-dot"></div><div className="lc-label">Handover</div><div className="lc-sub">Zero-Defect Delivery</div></div>
    </div>
    <p className="lifecycle-note"><strong>Pre-construction governance begins before your contractor mobilises.</strong> That is where the real protection is built.</p>

    <div className="deploy-grid">
      <div className="deploy-card">
        <div className="di">🖥️</div>
        <h4>Virtual Governance Control Room™</h4>
        <p>Remotely directing project governance and managing executive-level oversight — ensuring the sponsor has full visibility of costs, risks, schedule, and decisions, with structured advisory support from anywhere in the world.</p>
        <p className="deploy-best"><strong>Best for:</strong> Project sponsors in the GCC, diaspora investors, and cross-border investors who need trusted governance intelligence and direction delivered directly to them.</p>
      </div>
      <div className="deploy-card">
        <div className="di">🔄</div>
        <h4>Hybrid Governance Model™</h4>
        <p>Continuously directing governance remotely, managing the project at critical milestones through targeted on-ground senior presence, and executing direct oversight at the points where physical engagement matters most.</p>
        <p className="deploy-best"><strong>Best for:</strong> Sponsors who want the depth of on-ground governance at critical points, supported by structured remote direction throughout the full project lifecycle.</p>
      </div>
      <div className="deploy-card">
        <div className="di">🏗️</div>
        <h4>Full On-Site Governance Command™</h4>
        <p>A dedicated senior governance presence embedded within the project environment — directing, managing, and executing governance on the sponsor's behalf on the ground in Africa, working alongside the project team with the sponsor's objectives at the centre of every decision.</p>
        <p className="deploy-best"><strong>Best for:</strong> GCC-based, diaspora, and overseas project sponsors who wish to appoint a trusted senior governance partner to represent their interests directly within the project environment in Africa.</p>
      </div>
    </div>
  </div>
</section>


<section className="about-section" id="about">
  <div className="container">
    <div className="about-grid">

      
      <div>
        <div className="about-card">
          <div className="about-photo">
            <img 
              src="/talibbhai.jpg" 
              alt="Talibbhai Khanji" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          <div className="aname">Talibbhai Khanji</div>
          <div className="arole">Founder &amp; Principal Consultant</div>

          <ul className="about-creds-list">
            <li><span className="acl-dot"></span>P.Eng Civil — ERB Registered, Tanzania &amp; Zambia</li>
            <li><span className="acl-dot"></span>PMP® — Project Management Professional, PMI USA</li>
            <li><span className="acl-dot"></span>MBA — Project Management Specialisation</li>
            <li><span className="acl-dot"></span>19+ Years Total Multinational Experience</li>
            <li><span className="acl-dot"></span>15+ Years Africa On-Ground Since 2010</li>
            <li><span className="acl-dot"></span>Active in Tanzania · Zambia · Kenya · Uganda</li>
          </ul>

          
          <div className="about-social">
            <a href="https://www.linkedin.com/in/talibkhanjipmp/" target="_blank" rel="noopener" title="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.instagram.com/talibkhanji_pmp/" target="_blank" rel="noopener" title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://wa.me/918530781153" target="_blank" rel="noopener" title="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href="mailto:info@proconixpmc.com" title="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
          </div>
        </div>
      </div>

      
      <div className="about-content">
        <div className="section-eyebrow">About Talibbhai Khanji</div>
        <h2 className="section-title">Africa&apos;s <em>Sponsor-Aligned<br/>Strategic Project Leader</em></h2>

        <p>With <strong>19+ years of total multinational experience — including 15+ years of on-ground execution in Africa since 2010</strong> — I have governed, rescued, and delivered construction projects across real estate, hospitality, and industrial sectors on the continent.</p>

        <p>The governance gap in African construction is not a theory. I have seen its consequences: cost overruns that were avoidable, handover failures that were preventable, and executive reputations damaged by decisions made in the absence of structured governance authority.</p>

        <p>Proconix was built to close that gap. <strong>Not as a monitoring layer.</strong> As a Sponsor-Aligned Strategic Project Leader who carries governance authority — embedded inside your project&apos;s decision structure from inception through to handover.</p>

        <div className="about-quote">
          <p>"When I take on a mandate, I am in the decision room — not the observation room. That is a structural difference, and you will feel it immediately."</p>
        </div>

        <p>The credentials I hold — the <strong>P.Eng Civil from ERB Tanzania and Zambia, the MBA in Project Management, and the PMP® from PMI USA</strong> — represent the Quad-Domain combination that makes Proconix structurally different from every other governance option available to a project sponsor in Africa.</p>

        <div className="about-scarcity">
          <span className="scarcity-icon">⚠</span>
          <p><strong>Mandate Availability:</strong> Proconix runs a maximum of 4 active mandates at any time — by design. New engagements open one per quarter. If your project window aligns, begin the discovery conversation now.</p>
        </div>
      </div>

    </div>
  </div>
</section>


<section className="cases-section" id="cases">
  <div className="container">
    <div className="section-eyebrow">Anonymised Case Evidence</div>
    <h2 className="section-title">Governance That Changed<br/><em>the Project Outcome</em></h2>
    <p className="section-intro">These are not case studies built around a single metric. They are governance situations — real African construction environments — where the absence of a structured authority layer was creating compounding capital exposure.</p>

    <div className="cases-grid">

      <div className="case-card">
        <div className="case-number">01</div>
        <div className="case-tag">Hospitality · Zanzibar · $50M+</div>
        <h4>High-Specification Resort — Multi-Stakeholder, International Operator Commitment</h4>
        <p className="case-situation">
          A hospitality development with an international operator opening commitment, multiple specialist subcontractors, and a design team operating across jurisdictions. Pre-construction governance architecture absent at inception. Design-constructability gaps were creating variation exposure before mobilisation was complete.
        </p>
        <ul className="case-results">
          <li>Pre-construction governance architecture installed before contractor full mobilisation</li>
          <li>Variation control protocol implemented — reducing variation claim frequency significantly</li>
          <li>Procurement governance established for imported FF&amp;E and long-lead MEP equipment</li>
          <li>Schedule recovered to operator opening commitment date</li>
          <li>Zero major quality issues raised at operator handover inspection</li>
        </ul>
      </div>

      <div className="case-card">
        <div className="case-number">02</div>
        <div className="case-tag">Real Estate · Tanzania · $15M</div>
        <h4>Residential Development — Governance Rescue at Crisis Point</h4>
        <p className="case-situation">
          A residential development 3 months into construction with no formal governance structure. Cost reporting was absent, the schedule was based on contractor verbal commitments, and procurement decisions were being made reactively. Quality accountability was distributed — meaning no party owned it. The sponsor was spending 12–14 hours weekly in conflict resolution.
        </p>
        <ul className="case-results">
          <li>Full governance architecture installed mid-construction — cost reporting, schedule baseline, procurement governance</li>
          <li>QS, Planning, and Procurement functions restructured</li>
          <li>Financial leakage eliminated — project cash flow stabilised within 60 days</li>
          <li>Contractor payment linked to stage-wise verification and billing control</li>
          <li>Project used as flagship portfolio piece to secure subsequent high-value contracts</li>
        </ul>
      </div>

      <div className="case-card">
        <div className="case-number">03</div>
        <div className="case-tag">Industrial · Zambia · $100M+</div>
        <h4>Large-Scale Industrial Build — Multi-EPC Complexity</h4>
        <p className="case-situation">
          A $100M+ industrial construction project involving multiple EPC packages across civil, structural, MEP, and infrastructure disciplines simultaneously. Design information evolving across packages, reactive procurement, and no consolidated financial reporting. The sponsor was the only entity absorbing the full weight of cross-package coordination — at the direct cost of strategic business attention.
        </p>
        <ul className="case-results">
          <li>End-to-end governance architecture integrated all project dimensions into a single sponsor-facing control environment</li>
          <li>Consolidated cost visibility framework established — early warning of budget drift across packages</li>
          <li>Escalation structure removed ownership from project coordination role entirely</li>
          <li>Procurement governed by structured supply chain timeline — not reactive to site demand</li>
          <li>Quality accountability unified across all specialist packages with single non-conformance framework</li>
        </ul>
      </div>

    </div>
  </div>
</section>


<section className="faq-section">
  <div className="container">
    <div className="section-eyebrow">Frequently Asked Questions</div>
    <h2 className="section-title">Questions Serious<br/><em>Project Sponsors Ask</em></h2>

    <div className="faq-grid">

      <div className="faq-intro">
        <p>The most common questions project sponsors ask before engaging Proconix — answered directly, without consulting jargon.</p>
        <br/>
        <p>If you have a question not addressed here, the discovery call is the right place to ask it. There is no obligation and no pitch — only a structured conversation about whether Proconix is the right governance partner for your specific project.</p>
        <br/>
        <button onClick={handleDiscoveryClick} className="btn-outline" style={{"marginTop":"8px"}}>Book the Discovery Call</button>
      </div>

      <div className="faq-list">

        <div className="faq-item">
          <div className="faq-q" onClick={toggleFaq}>
            Isn&apos;t Proconix just another project management consultant?
            <div className="faq-chevron">+</div>
          </div>
          <div className="faq-a">
            <strong>No.</strong> The consulting industry in construction has earned its reputation for generating reports and avoiding accountability. Proconix is not that model. When we take on a mandate, we are the Sponsor-Aligned Strategic Project Leader — with governance authority inside the project&apos;s decision structure. We are in the decision room, not the observation room. That is a structural difference. A monitoring consultant tells you what went wrong last month. A Proconix mandate prevents it from happening in the first place — and when the unexpected occurs, resolves it with the full authority of a structured governance mandate behind the decision.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-q" onClick={toggleFaq}>
            I already have a project manager and site engineers. Why do I need Proconix?
            <div className="faq-chevron">+</div>
          </div>
          <div className="faq-a">
            Your site engineers execute. Your project manager coordinates. <strong>Neither role carries the governance authority to protect your capital at the decision-making level.</strong> Proconix governs across cost, schedule, procurement, quality, risk, and stakeholder alignment — simultaneously — with a mandate that comes from the sponsor. This is not a layer over your team. It is the governance architecture that makes your existing team more effective, more accountable, and more focused on execution rather than escalation.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-q" onClick={toggleFaq}>
            What does a Proconix mandate actually cost?
            <div className="faq-chevron">+</div>
          </div>
          <div className="faq-a">
            Proconix fees are structured on a project-by-project basis. <strong>— depending on the mandate scope, deployment model, and project complexity. Pricing is discussed in the discovery consultation after understanding your specific project. </strong> What is consistent: the governance mandate protects far more capital than it costs. The discovery call is where that conversation begins.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-q" onClick={toggleFaq}>
            My project is already under construction. Is it too late?
            <div className="faq-chevron">+</div>
          </div>
          <div className="faq-a">
            <strong>No — but every week without governance is compounding exposure.</strong> Governance installed mid-construction is more expensive to implement and less complete than governance installed at inception. However, the case studies above include projects rescued at crisis point. The earlier governance is installed, the greater the protection. If your project is already in execution and you are experiencing cost drift, schedule slippage, or procurement pressure — the discovery call is the first step to understanding what is recoverable.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-q" onClick={toggleFaq}>
            I am based in the GCC / overseas. Can Proconix still govern my Africa project?
            <div className="faq-chevron">+</div>
          </div>
          <div className="faq-a">
            <strong>Yes — this is exactly who the Virtual Governance Control Room™ and Hybrid Governance Model™ are built for.</strong> GCC-based, diaspora, and cross-border investors represent a significant portion of Proconix&apos;s mandate portfolio. You receive real-time financial reporting, risk heatmaps, procurement governance, and direct access to a senior consultant who is on the ground in Africa — so you maintain full executive visibility without needing to be physically present on site.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-q" onClick={toggleFaq}>
            How quickly can Proconix mobilise?
            <div className="faq-chevron">+</div>
          </div>
          <div className="faq-a">
            Mobilisation timeline depends on the project stage and current mandate portfolio. <strong>Proconix accepts a maximum of four active Tier-1 mandates concurrently — one new engagement per quarter.</strong> This is a deliberate portfolio control decision that ensures every mandate receives undivided senior governance attention. The discovery call will confirm whether your project timeline aligns with current availability. If it does, governance architecture begins within the agreed mobilisation window.
          </div>
        </div>

      </div>
    </div>
  </div>
</section>


<section className="cta-section">
  <div className="container">
    <div className="section-eyebrow" style={{"justifyContent":"center"}}>Start the Conversation</div>
    <h2>Your Project Has a Window.<br/><em>Governance Has a Starting Point.</em></h2>
    <div>
      <p>Every day a construction project runs without a structured governance architecture is a day of compounding exposure. The discovery call is where we determine whether Proconix is the right governance partner for your project — and whether your project falls within our current mandate window.</p>
      <div className="cta-pair">
        <button onClick={handleDiscoveryClick} className="btn-gold">Book a Discovery Call</button>
        <form className="capture-form" onSubmit={handleFormSubmit} style={{ margin: 0, padding: 0, background: 'transparent', boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input type="text" placeholder="Your Full Name" name="name" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', minWidth: '180px' }} />
            <input type="email" placeholder="Your Email Address" name="email" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', minWidth: '180px' }} />
            <button type="submit" className="btn-outline" style={{ whiteSpace: 'nowrap' }}>Download Free Checklist</button>
          </div>
          {formStatus && <div className={`form-status ${formStatus.type}`} style={{ fontSize: '0.85rem' }}>{formStatus.message}</div>}
        </form>
      </div>
      <p className="cta-scarcity"><strong>Mandate Availability:</strong> Maximum 4 active Tier-1 mandates. One new engagement per quarter. Enquire to confirm current availability.</p>
    </div>
  </div>
</section>


<footer>
  <div className="container">
    <div className="footer-grid">

      <div className="footer-brand">
        <div className="nav-logo-wrapper" style={{ marginBottom: '15px' }}>
          <div className="nav-logo" style={{ fontSize: '1.3rem' }}>PROCONIX</div>
          <div className="nav-tagline" style={{ fontSize: '0.5rem' }}>Project Management Consultancy</div>
        </div>
        <p>We Direct, Manage, and Execute end-to-end construction project governance in Africa — across the full EPCM lifecycle, from inception through to successful handover.</p>
        <div className="footer-social-row">
          <a href="https://www.linkedin.com/in/talibkhanjipmp/" target="_blank" rel="noopener" title="LinkedIn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://www.instagram.com/talibkhanji_pmp/" target="_blank" rel="noopener" title="Instagram">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.333 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://wa.me/918530781153" target="_blank" rel="noopener" title="WhatsApp">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <a href="mailto:info@proconixpmc.com" title="Email">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
        </div>
      </div>

      <div className="footer-col">
        <h4>Navigate</h4>
        <ul>
          <li><a href="#identity" onClick={(e) => smoothScroll(e, "#identity")}>What We Are</a></li>
          <li><Link href="/features">Advanced Features</Link></li>
          <li><a href="#problem" onClick={(e) => smoothScroll(e, "#problem")}>The Governance Vacuum</a></li>
          <li><a href="#advantage" onClick={(e) => smoothScroll(e, "#advantage")}>Quad-Domain Advantage</a></li>
          <li><a href="#about" onClick={(e) => smoothScroll(e, "#about")}>About Talibbhai</a></li>
          <li><a href="#cases" onClick={(e) => smoothScroll(e, "#cases")}>Case Evidence</a></li>
          <li><a href="#lead-magnet" onClick={(e) => smoothScroll(e, "#lead-magnet")}>Free Checklist</a></li>
        </ul>
      </div>

      <div className="footer-col">
        <h4>Contact</h4>
        <div className="footer-contact-item">
          <span className="fc-icon">📧</span>
          <span>info@proconixpmc.com</span>
        </div>
        <div className="footer-contact-item">
          <span className="fc-icon">📞</span>
          <span>+255 695964527 / WhatsApp +91 8530781153</span>
        </div>
        <div className="footer-contact-item">
          <span className="fc-icon">🌐</span>
          <span>www.proconixpmc.com</span>
        </div>
        <div className="footer-contact-item">
          <span className="fc-icon">📍</span>
          <span>East Africa — Active Across Africa</span>
        </div>
      </div>

      <div className="footer-col">
        <h4>Connect</h4>
        <ul>
          <li><a href="https://www.linkedin.com/in/talibkhanjipmp/" target="_blank" rel="noopener">LinkedIn — Talibbhai Khanji</a></li>
          <li><a href="https://www.instagram.com/talibkhanji_pmp/" target="_blank" rel="noopener">Instagram — @talibkhanji_pmp</a></li>
          <li><a href="https://wa.me/918530781153" target="_blank" rel="noopener">WhatsApp — Direct Message</a></li>
          <li><a href="mailto:info@proconixpmc.com">Email — info@proconixpmc.com</a></li>
          <li><a href="#hero-card">Free Pre-Construction Checklist</a></li>
        </ul>
      </div>

    </div>

    <div className="footer-bottom">
      <p>© 2026 Proconix Project Management Consultancy · All rights reserved · www.proconixpmc.com</p>
      <p>ERB Registered: Tanzania · Zambia &nbsp;·&nbsp; PMP® PMI USA &nbsp;·&nbsp; Talibbhai Khanji, P.Eng (Civil), MBA, PMP®</p>
    </div>
  </div>
</footer>





    </>
  );
}
