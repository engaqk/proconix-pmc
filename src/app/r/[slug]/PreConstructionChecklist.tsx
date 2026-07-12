'use client';

import { useState } from 'react';

interface PreConstructionChecklistProps {
  slug: string;
  utm: Record<string, string>;
}

export default function PreConstructionChecklist({ slug, utm }: PreConstructionChecklistProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, slug, ...utm }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const d = await res.json();
        setError(d.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diag-page-container">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
.diag-page-container {
    --bg: #12181C;
    --bg-deep: #0A0E11;
    --card: #1B2329;
    --amber: #F2994A;
    --amber-bright: #FFB35C;
    --teal: #2DD4C8;
    --white: #F6F7F8;
    --muted: #98A3AA;
    --border: rgba(242,153,74,0.25);
  }.diag-page-container * {box-sizing:border-box;margin:0;padding:0;}.diag-page-container body {
    background: radial-gradient(ellipse at top, #182129 0%, var(--bg-deep) 65%);
    color: var(--white);
    font-family: 'DM Sans', -apple-system, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }.diag-page-container .wrap {max-width: 720px; margin: 0 auto; padding: 48px 24px 80px;}.diag-page-container .logo-row {
    display:flex;
    align-items:center;
    gap:12px;
    margin-bottom: 30px;
  }.diag-page-container .logo-row img {
    width: 56px;
    height: 56px;
    border-radius: 10px;
    display:block;
  }.diag-page-container .logo-row .word {
    font-family:'Cormorant Garamond', serif;
    font-weight:600;
    font-size: 20px;
    letter-spacing: 0.04em;
    color: var(--white);
  }.diag-page-container .logo-row .word span {
    display:block;
    font-family:'DM Sans', sans-serif;
    font-weight:400;
    font-size: 10.5px;
    letter-spacing: 0.12em;
    color: var(--muted);
    text-transform: uppercase;
    margin-top: 2px;
  }.diag-page-container .eyebrow {
    display:inline-block;
    font-family:'DM Sans', sans-serif;
    font-weight:600;
    font-size:12.5px;
    letter-spacing:0.14em;
    color: var(--bg-deep);
    background: linear-gradient(120deg, var(--amber-bright), var(--amber));
    padding: 7px 16px;
    border-radius: 999px;
    margin-bottom: 26px;
    text-transform: uppercase;
  }.diag-page-container h1 {
    font-family:'Cormorant Garamond', serif;
    font-weight:700;
    font-size: clamp(34px, 6vw, 48px);
    line-height:1.14;
    color: var(--white);
    margin-bottom: 18px;
    letter-spacing:-0.01em;
  }.diag-page-container h1 span {color: var(--amber-bright);}.diag-page-container .sub {
    font-size: 17px;
    color: var(--muted);
    max-width: 600px;
    margin-bottom: 34px;
  }.diag-page-container .sub b {color:var(--white); font-weight:600;}.diag-page-container .divider {
    height:1px;
    background: linear-gradient(90deg, var(--border), transparent);
    margin: 8px 0 34px;
  }.diag-page-container .bullets {list-style:none; margin-bottom: 38px;}.diag-page-container .bullets li {
    display:flex;
    gap:14px;
    align-items:flex-start;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 18px 20px;
    margin-bottom: 14px;
  }.diag-page-container .check {
    flex-shrink:0;
    width:26px; height:26px;
    border-radius:50%;
    background: linear-gradient(135deg, var(--teal), #1AA79C);
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:700; color:var(--bg-deep);
    margin-top:2px;
  }.diag-page-container .bullets p {font-size:15.5px; color:var(--white);}.diag-page-container .bullets p b {color:var(--amber-bright);}.diag-page-container .cta-block {
    text-align:center;
    margin: 44px 0 38px;
    padding: 34px 26px;
    background: linear-gradient(160deg, #1E2730, #141B20);
    border: 1px solid var(--border);
    border-radius: 18px;
  }.diag-page-container .cta-btn {
    display:inline-block;
    font-family:'DM Sans', sans-serif;
    font-weight:700;
    font-size: 18px;
    color: var(--bg-deep);
    background: linear-gradient(120deg, var(--amber-bright), var(--amber));
    padding: 18px 38px;
    border-radius: 12px;
    text-decoration:none;
    box-shadow: 0 8px 24px rgba(242,153,74,0.28);
    transition: transform .15s ease;
  }.diag-page-container .cta-btn:hover {transform: translateY(-2px);}.diag-page-container .micro {
    font-size: 13px;
    color: var(--muted);
    margin-top: 16px;
  }.diag-page-container .keyword {
    color: var(--teal);
    font-weight:700;
    letter-spacing:0.04em;
  }.diag-page-container .authority {
    border-top: 1px solid var(--border);
    padding-top: 34px;
    margin-top: 12px;
  }.diag-page-container .authority h3 {
    font-family:'DM Sans', sans-serif;
    font-size:13px;
    letter-spacing:0.12em;
    color: var(--teal);
    margin-bottom: 14px;
    text-transform:uppercase;
  }.diag-page-container .authority p {
    font-size: 14.5px;
    color: var(--muted);
    margin-bottom: 10px;
  }.diag-page-container .authority p b {color: var(--white);}.diag-page-container .authority .credentials {
    display:flex;
    flex-wrap:wrap;
    gap: 8px 10px;
    margin: 14px 0 16px;
  }.diag-page-container .tag {
    font-size:12px;
    color: var(--amber-bright);
    border: 1px solid var(--border);
    padding: 5px 12px;
    border-radius: 999px;
  }.diag-page-container footer {
    text-align:center;
    font-size:12.5px;
    color: #5C666C;
    margin-top: 40px;
  }.diag-page-container footer a {color: var(--teal); text-decoration:none;}.diag-page-container @media (max-width:480px) {
    .wrap}.diag-page-container .cta-btn {width:100%; text-align:center;}
  }

      ` }} />

<div className="wrap">

  <div className="logo-row">
    <img src="/logo.png" alt="Proconix Logo" />
    <span className="word">PROCONIX<span>Project Management Consultancy</span></span>
  </div>

  <span className="eyebrow">FREE PROJECT DIAGNOSTIC CHEATSHEET FOR CONSTRUCTION SPONSORS</span>

  <h1>9 Places African Construction Budgets <span>Quietly Bleed Money</span></h1>

  <p className="sub">In this free 3-page diagnostic, you'll see <b>9 specific mechanisms</b> — with real dollar and percentage exposure — where $5M–$100M+ construction budgets leak money across Africa, before your final account tells you the hard way.</p>

  <div className="divider"></div>

  <ul className="bullets">
    <li>
      <span className="check">✓</span>
      <p>The <b>9 specific places</b> African construction budgets silently leak — named and explained line by line, not just implied in a generic warning.</p>
    </li>
    <li>
      <span className="check">✓</span>
      <p>Real exposure ranges for each leak — <b>8–15%</b> on uncontrolled variations, <b>1–3% per month</b> on delay, up to <b>$2M</b> in mishandled retention — so you know the scale before you call anyone.</p>
    </li>
    <li>
      <span className="check">✓</span>
      <p>A straight answer on <b>why each leak resists in-house fixing</b> — so you know exactly what you're up against before it shows up in your final account.</p>
    </li>
  </ul>

    <div className="cta-block">
    {!submitted ? (
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '420px', margin: '0 auto' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: 'var(--amber-bright)', fontWeight: 600, marginBottom: '4px' }}>
          Get the Free 3-Page Diagnostic
        </h3>
        
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your Full Name"
          required
          style={{
            width: '100%',
            padding: '14px 18px',
            background: 'var(--bg-deep)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--white)',
            fontSize: '15px',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your Professional Email Address"
          required
          style={{
            width: '100%',
            padding: '14px 18px',
            background: 'var(--bg-deep)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--white)',
            fontSize: '15px',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />

        {error && <p style={{ color: '#ff6b6b', fontSize: '13px', margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="cta-btn"
          style={{
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            width: '100%',
            textAlign: 'center',
            fontFamily: 'inherit'
          }}
        >
          {loading ? 'Sending Diagnostic...' : 'Get Free Diagnostic →'}
        </button>

        <p className="micro" style={{ marginTop: '4px' }}>
          🔒 We respect your privacy. The PDF will be delivered instantly to your inbox.
        </p>
      </form>
    ) : (
      <div style={{ padding: '20px 10px' }}>
        <div style={{ fontSize: '44px', marginBottom: '12px' }}>📨</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: 'var(--teal)', fontWeight: 700, marginBottom: '8px' }}>
          Diagnostic Requested!
        </h3>
        <p style={{ fontSize: '15px', color: 'var(--white)', lineHeight: 1.5 }}>
          Please check your inbox at <strong style={{ color: 'var(--amber-bright)' }}>{email}</strong>.
          We have sent the download link for your PDF.
        </p>
      </div>
    )}
  </div>

  <div className="authority">
    <h3>Who is Talibbhai?</h3>
    <p><b>Talibbhai Khanji</b> is a P.Eng-registered civil engineer, PMP® (PMI USA), and MBA in Project Management — Founder of <b>Proconix Project Management Consultancy</b>, a construction governance firm working across Africa since 2010.</p>
    <div className="credentials">
      <span className="tag">19+ yrs multinational</span>
      <span className="tag">15+ yrs Africa execution</span>
      <span className="tag">$250M+ governed</span>
      <span className="tag">Up to 97% on-time delivery</span>
      <span className="tag">Up to 20% cost savings</span>
    </div>
    <p>He built this diagnostic because most of the "surprise" cost overruns he's been called in to fix were visible months earlier — if someone had known exactly where to look.</p>
  </div>

  <footer>
    Proconix Project Management Consultancy  ·  <a href="https://www.proconixpmc.com" target="_blank" rel="noopener">www.proconixpmc.com</a>
  </footer>

</div>

    </div>
  );
}
