"use client";

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import CapexCalculator from './CapexCalculator';

export default function PageComponent() {
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
        setTimeout(() => setFormStatus(null), 6000);
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
            <Link href="/" className="nav-logo-wrapper">
              <img src="/logo.png" alt="Proconix PMC — construction project governance in Africa" className="nav-logo-img" />
              <div className="nav-logo-text-group">
                <div className="nav-logo">PROCONIX</div>
                <div className="nav-tagline">Project Management Consultancy</div>
              </div>
            </Link>

            <ul className="nav-links">
              <li><a href="/construction-project-governance" >What We Are</a></li>
              <li><Link href="/governance-diagnostic-tools">Features</Link></li>
              <li><a href="/construction-project-governance#problem" >The Problem</a></li>
              <li><a href="/construction-project-governance#advantage" >Our Advantage</a></li>
              <li><a href="/about-talibbhai-khanji" >About</a></li>
              <li><a href="/case-evidence/case-1" >Case Evidence</a></li>
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
              <button onClick={handleDiscoveryClick} className="btn-gold">Executive Governance Briefing Call</button>
            </div>

            <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="/construction-project-governance" >What We Are</a>
          <Link href="/governance-diagnostic-tools">Features</Link>
          <a href="/construction-project-governance#problem" >The Problem</a>
          <a href="/construction-project-governance#advantage" >Our Advantage</a>
          <a href="/about-talibbhai-khanji" >About</a>
          <a href="/case-evidence/case-1" >Case Evidence</a>
          <button onClick={handleDiscoveryClick} className="btn-gold" style={{ marginTop: '10px' }}>Executive Governance Briefing Call</button>
        </div>
      </nav>
      {/* Hero Section */}
      





<main>
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
</main>
<footer>
  <div className="container">
    <div className="footer-grid">

      <div className="footer-brand">
        <Link href="/" className="nav-logo-wrapper" style={{ marginBottom: '15px' }}>
          <img src="/logo.png" alt="Proconix PMC — construction project governance in Africa" className="nav-logo-img" />
          <div className="nav-logo-text-group">
            <div className="nav-logo" style={{ fontSize: '1.3rem' }}>PROCONIX</div>
            <div className="nav-tagline" style={{ fontSize: '0.5rem' }}>Project Management Consultancy</div>
          </div>
        </Link>
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
          <li><a href="/construction-project-governance" >What We Are</a></li>
          <li><Link href="/governance-diagnostic-tools">Advanced Features</Link></li>
          <li><a href="/construction-project-governance#problem" >The Governance Vacuum</a></li>
          <li><a href="/construction-project-governance#advantage" >Quad-Domain Advantage</a></li>
          <li><a href="/about-talibbhai-khanji" >About Talibbhai</a></li>
          <li><a href="/case-evidence/case-1" >Case Evidence</a></li>
          <li><a href="/resources/pre-construction-governance-checklist" >Free Checklist</a></li>
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
          <li><a href="/resources/pre-construction-governance-checklist">Free Pre-Construction Checklist</a></li>
        </ul>
      </div>

    </div>

    <div className="footer-bottom">
      <p>© 2026 Proconix Project Management Consultancy · All rights reserved · www.proconixpmc.com</p>
      <p>ERB Registered: Tanzania · Zambia &nbsp;·&nbsp; PMP® PMI USA &nbsp;·&nbsp; Talibbhai Khanji, P.Eng (Civil), MBA, PMP®</p>
    </div>
  </div>
</footer>





      {formStatus && formStatus.type === 'success' && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#4CAF50',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999,
          maxWidth: '350px',
          fontSize: '0.95rem',
          lineHeight: '1.4',
          borderLeft: '4px solid #fff',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>{formStatus.message}</div>
          <button 
            onClick={() => setFormStatus(null)}
            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1, padding: 0 }}
          >×</button>
        </div>
      )}
    </>
  );
}
