"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CapexCalculator from '../CapexCalculator';

export default function FeaturesPage() {
  const [navPadding, setNavPadding] = useState('18px 0');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  // Quiz Questions
  const questions = [
    { q: "Is your cost baseline validated against African on-ground realities (local material prices, tax, customs)?", weight: 10 },
    { q: "Do you have a dedicated governance authority matrix separate from the PM's coordination role?", weight: 15 },
    { q: "Are variation claims verified against site progress and contract norms before reaching your desk?", weight: 10 },
    { q: "Is your critical path validated by an independent constructability review?", weight: 10 },
    { q: "Do you have real-time executive visibility into cash flow variance across all EPC packages?", weight: 15 },
    { q: "Is procurement governed by a sponsor-mandated supply chain timeline?", weight: 10 },
    { q: "Are escalation protocols established for cross-package coordination conflicts?", weight: 10 },
    { q: "Do you receive independent audit reports on quality accountability milestones?", weight: 10 },
    { q: "Is risk heatmap tracking updated weekly and reviewed at the sponsor level?", weight: 5 },
    { q: "Is your handover readiness plan established at the design phase?", weight: 5 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setNavPadding(window.scrollY > 60 ? '12px 0' : '18px 0');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuizAnswer = (answer: boolean) => {
    if (answer) {
      setQuizScore(prev => prev + questions[quizStep].weight);
    }
    setQuizStep(prev => prev + 1);
  };

  const getScoreResult = () => {
    if (quizScore >= 80) return { label: 'Protected', color: '#4CAF82', text: 'Your project has strong governance foundations. Minor optimization may still yield value.' };
    if (quizScore >= 50) return { label: 'Exposed', color: '#E09E4C', text: 'Mid-level risks detected. Capital leakage is likely occurring silently.' };
    return { label: 'High Risk', color: '#E05C5C', text: 'Critical governance vacuum identified. Immediate intervention recommended to protect capital.' };
  };

  return (
    <div className="features-page">
      {/* Navigation */}
      <nav id="main-nav" style={{ padding: navPadding, background: 'rgba(7, 20, 42, 0.95)' }}>
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">PROCONIX <span>PMC</span></Link>
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
              <Link href="/#lead-magnet" className="btn-gold">Book Discovery Call</Link>
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
          <Link href="/#lead-magnet" className="btn-gold" style={{ marginTop: '10px' }}>Book Discovery Call</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="features-hero" style={{ padding: '160px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <div className="hero-badge"><span className="hero-badge-dot"></span> Advanced Governance Features</div>
          <h1>The Sponsor&apos;s <em>Strategic Advantage</em></h1>
          <p className="hero-sub" style={{ margin: '0 auto 40px' }}>
            A suite of high-trust tools and transparency frameworks designed to provide 
            total control to the $5M–$100M+ project sponsor in Africa.
          </p>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <CapexCalculator />
          </div>
        </div>
      </section>

      {/* Feature 1: Health Score Audit */}
      <section id="audit" className="quiz-section" style={{ background: 'var(--navy-mid)', padding: '100px 0' }}>
        <div className="container">
          <div className="section-eyebrow">Interactive Diagnostic</div>
          <h2 className="section-title">The Governance Health Score™</h2>
          
          <div className="quiz-container" style={{ maxWidth: '700px', margin: '50px auto', background: 'var(--navy-card)', padding: '40px', border: '1px solid var(--border)', position: 'relative' }}>
            {quizStep < questions.length ? (
              <div className="quiz-step">
                <div style={{ fontSize: '0.8rem', color: 'var(--gold)', marginBottom: '20px' }}>Question {quizStep + 1} of {questions.length}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', marginBottom: '30px', color: 'var(--white)' }}>{questions[quizStep].q}</h3>
                <div className="quiz-actions" style={{ display: 'flex', gap: '20px' }}>
                  <button className="btn-gold" onClick={() => handleQuizAnswer(true)} style={{ flex: 1 }}>Yes</button>
                  <button className="btn-outline" onClick={() => handleQuizAnswer(false)} style={{ flex: 1 }}>No / Not Sure</button>
                </div>
              </div>
            ) : (
              <div className="quiz-result" style={{ textAlign: 'center' }}>
                <div className="mnum" style={{ fontSize: '4rem', color: getScoreResult().color }}>{quizScore}%</div>
                <h3 style={{ color: getScoreResult().color, textTransform: 'uppercase', letterSpacing: '2px' }}>{getScoreResult().label}</h3>
                <p style={{ margin: '20px 0', color: 'var(--text-light)' }}>{getScoreResult().text}</p>
                <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(201, 168, 76, 0.1)', border: '1px solid var(--gold-dim)' }}>
                  <p style={{ fontSize: '0.9rem' }}>A detailed risk report is available via a discovery call.</p>
                  <a href="/#lead-magnet" className="btn-gold" style={{ display: 'inline-block', marginTop: '10px' }}>Get Full Report</a>
                </div>
                <button onClick={() => { setQuizStep(0); setQuizScore(0); }} style={{ marginTop: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>Retake Audit</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature 2: Project Map */}
      <section id="map" className="map-section" style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="section-eyebrow">Boots on the Ground</div>
          <h2 className="section-title">Regional Governance Hubs</h2>
          <p className="section-intro">Proconix maintains active governance command across critical African construction markets.</p>
          
          <div className="map-wrapper" style={{ marginTop: '60px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Simple Stylized Abstract Map of Africa with Hotspots */}
            <div className="map-placeholder" style={{ width: '100%', maxWidth: '800px', height: '500px', background: 'rgba(11,29,53,0.4)', borderRadius: '12px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.1, fontSize: '10rem' }}>🌍</div>
              
              {/* Hotspots */}
              <div className="hotspot" style={{ position: 'absolute', top: '60%', left: '65%' }}>
                <div className="pulse"></div>
                <div className="hotspot-card"><strong>Tanzania</strong><br/>Hospitality & Infrastructure</div>
              </div>
              <div className="hotspot" style={{ position: 'absolute', top: '70%', left: '60%' }}>
                <div className="pulse"></div>
                <div className="hotspot-card"><strong>Zambia</strong><br/>Industrial & Mining Builds</div>
              </div>
              <div className="hotspot" style={{ position: 'absolute', top: '55%', left: '62%' }}>
                <div className="pulse"></div>
                <div className="hotspot-card"><strong>Kenya</strong><br/>Mixed-Use Developments</div>
              </div>
              <div className="hotspot" style={{ position: 'absolute', top: '52%', left: '58%' }}>
                <div className="pulse"></div>
                <div className="hotspot-card"><strong>Uganda</strong><br/>Institutional Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Transparency Portal */}
      <section id="portal" className="portal-section" style={{ background: 'var(--navy-mid)', padding: '100px 0' }}>
        <div className="container">
          <div className="section-eyebrow">Executive Visibility</div>
          <h2 className="section-title">The Virtual Governance Control Room™</h2>
          <p className="section-intro">What you receive every Monday morning. Total control without the on-site chaos.</p>
          
          <div className="portal-demo" style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div className="portal-visual" style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', padding: '20px', borderRadius: '8px' }}>
               <div style={{ height: '300px', background: 'rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
                  {/* Fake UI Dashboard */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                      <div style={{ flex: 1, height: '60px', background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold-dim)' }}></div>
                      <div style={{ flex: 1, height: '60px', background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold-dim)' }}></div>
                      <div style={{ flex: 1, height: '60px', background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold-dim)' }}></div>
                    </div>
                    <div style={{ height: '150px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}></div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '0.6rem', color: 'var(--gold)' }}>DEMO VIEW: Project Governance Heatmap</div>
               </div>
            </div>
            <div className="portal-text">
               <ul className="yes-list">
                 <li><span className="yes-tick">✔</span> <strong>Real-Time Financial Variance:</strong> Know exactly where every dollar sits across packages.</li>
                 <li><span className="yes-tick">✔</span> <strong>Critical Path Risk Tracking:</strong> Early warning systems for schedule drift.</li>
                 <li><span className="yes-tick">✔</span> <strong>Procurement Pipeline Visibility:</strong> Tracking items before they reach customs.</li>
                 <li><span className="yes-tick">✔</span> <strong>Variation Verification Status:</strong> Only approved variations reach your final report.</li>
               </ul>
               <a href="mailto:info@proconixpmc.com?subject=Dashboard%20Demo%20Request" className="btn-gold" style={{ marginTop: '30px' }}>Book Live Demo</a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4: Sector Magnets */}
      <section id="magnets" className="magnets-section" style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="section-eyebrow">Expertise Depth</div>
          <h2 className="section-title">Sector-Specific Governance Intelligence</h2>
          <p className="section-intro">Download specialized diagnostic resources for your project niche.</p>
          
          <div className="magnets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '50px' }}>
            <div className="who-card">
              <div className="who-icon">🏨</div>
              <h4>The 7 Fatal Errors in African Hospitality Procurement</h4>
              <p>Specialized guide for resort and hotel developers on FF&E, OS&E, and operator handover governance.</p>
              <a href="#" className="btn-outline" style={{ marginTop: '20px', display: 'block', textAlign: 'center' }}>Download (Sector A)</a>
            </div>
            <div className="who-card">
              <div className="who-icon">🏭</div>
              <h4>Navigating Multi-EPC Industrial Complexity in Zambia</h4>
              <p>Technical brief on governing concurrent industrial packages and cross-package coordination risk.</p>
              <a href="#" className="btn-outline" style={{ marginTop: '20px', display: 'block', textAlign: 'center' }}>Download (Sector B)</a>
            </div>
            <div className="who-card">
              <div className="who-icon">🏥</div>
              <h4>Institutional Build Readiness Framework</h4>
              <p>Scored assessment tool for healthcare, office, and large-scale public project sponsors.</p>
              <a href="#" className="btn-outline" style={{ marginTop: '20px', display: 'block', textAlign: 'center' }}>Download (Sector C)</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="cta-section" style={{ background: 'var(--navy-card)', padding: '100px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', marginBottom: '30px' }}>Ready for a Sensitive Discussion?</h2>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:info@proconixpmc.com?subject=NDA%20Request" className="btn-outline" style={{ padding: '16px 32px' }}>Request Mutual NDA First</a>
            <Link href="/#lead-magnet" className="btn-gold" style={{ padding: '16px 32px' }}>Book Discovery Call</Link>
          </div>
          <p style={{ marginTop: '30px', color: 'var(--text-muted)' }}>We protect your capital. We also protect your data.</p>
        </div>
      </section>

      <footer style={{ background: 'var(--navy-deep)', padding: '40px 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
           <Link href="/" className="nav-logo" style={{ marginBottom: '20px', display: 'block' }}>PROCONIX <span>PMC</span></Link>
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
