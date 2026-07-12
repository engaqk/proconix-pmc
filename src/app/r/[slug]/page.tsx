'use client';
import PreConstructionChecklist from './PreConstructionChecklist';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const CONTENT: Record<string, {
  badge: string;
  headline: string;
  subheadline: string;
  stats: { value: string; label: string }[];
  pain: { icon: string; title: string; desc: string }[];
  benefits: string[];
  cta: string;
  assetTitle: string;
}> = {
  'pre-construction-checklist': {
    badge: 'FREE CHECKLIST',
    assetTitle: 'Pre-Construction Governance Checklist',
    headline: '70% of Capital Project Failures Are Determined Before Ground Breaks',
    subheadline: 'If you are sponsoring a $5M–$100M+ construction project in Africa, the decisions made in the next 90 days will define whether your capital is protected or exposed.',
    stats: [
      { value: '70%', label: 'of failures happen before site mobilisation' },
      { value: '10×', label: 'cost to fix issues post-ground-break vs. pre-design' },
      { value: '13', label: 'governance checkpoints covered in this resource' },
    ],
    pain: [
      { icon: '⚠️', title: 'No Governance Structure', desc: 'Projects without a structured pre-construction oversight framework face uncontrolled variation claims and design gaps from day one.' },
      { icon: '📐', title: 'Design Freeze Failures', desc: 'Awarding construction contracts before design is fully frozen locks in cost and schedule risks that cannot be reversed post-mobilisation.' },
      { icon: '💸', title: 'Uncontrolled Budget Exposure', desc: 'Without a variation control protocol in place before breaking ground, contractors routinely issue retrospective claims with no sponsor leverage.' },
    ],
    benefits: [
      'A 13-point pre-construction governance diagnostic tailored for African capital projects',
      'Identify which governance gaps will cause cost overruns before your first payment certificate',
      'Design freeze milestone checklist to prevent premature contractor mobilisation',
      'Variation control protocol template to block unbudgeted retrospective claims',
      'Constructability review criteria to align international designs with local execution realities',
    ],
    cta: 'Download Your Free Pre-Construction Governance Checklist',
  },
  'contractor-risk-audit': {
    badge: 'FREE AUDIT GUIDE',
    assetTitle: 'Contractor Risk Audit Guide',
    headline: 'Mid-Project Contractor Default Is Preventable — If You Know What to Audit',
    subheadline: 'Contractor insolvency mid-project is one of the most catastrophic events a capital project sponsor can face. This guide shows you how to screen it out at procurement stage.',
    stats: [
      { value: '40%', label: 'of contractor defaults linked to systematic underbidding' },
      { value: '$12M+', label: 'average additional cost of contractor default in Africa' },
      { value: '6', label: 'financial risk indicators most sponsors never check' },
    ],
    pain: [
      { icon: '🏚️', title: 'The Low-Bid Trap', desc: 'Contractors who win on lowest price often face financial collapse mid-project, leaving sponsors with incomplete structures and zero legal leverage.' },
      { icon: '🔗', title: 'Unverified Subcontractor Networks', desc: 'A contractor is only as strong as their subcontractor chain. Failure to audit sub-tier suppliers creates cascading payment defaults on site.' },
      { icon: '📜', title: 'Weak Performance Bonds', desc: 'Many performance bonds issued in Africa are from insurance companies rather than commercial banks and are uncallable in practice.' },
    ],
    benefits: [
      'A step-by-step contractor financial capability audit framework',
      'The 6 balance sheet indicators that reveal hidden contractor risk before award',
      'Subcontractor network verification methodology for East African markets',
      'Performance bond strength assessment — bank vs. insurance distinction',
      'Red flag checklist for contractor tender evaluation panels',
    ],
    cta: 'Download Your Free Contractor Risk Audit Guide',
  },
  'capex-allocation-strategy': {
    badge: 'FREE STRATEGY GUIDE',
    assetTitle: 'CAPEX Allocation Strategy Guide',
    headline: 'Currency Devaluation and Misallocated Contingencies Cost African Projects Billions Annually',
    subheadline: 'Cross-border capital projects in Africa face unique CAPEX pressure from FX volatility, tariff exposure and escalation claims. This guide shows you how to build a resilient budget structure.',
    stats: [
      { value: '35%', label: 'average CAPEX overrun on African megaprojects' },
      { value: '15–22%', label: 'FX devaluation impact on USD-denominated contracts' },
      { value: '4', label: 'contingency governance mistakes most sponsors make' },
    ],
    pain: [
      { icon: '💱', title: 'Foreign Exchange Volatility', desc: 'Projects procuring international equipment in USD while revenues are in local currency face compounding FX losses when currencies devalue mid-project.' },
      { icon: '📊', title: 'Contingency Mismanagement', desc: 'Contingency controlled by contractors — rather than the owner — is drawn down on contractor convenience, not sponsor-verified need.' },
      { icon: '📈', title: 'Open-Ended Escalation Clauses', desc: 'Contracts without material price index caps expose sponsors to unlimited cost escalation as local and global commodity prices fluctuate.' },
    ],
    benefits: [
      'Dual-currency budget structure for Africa cross-border projects',
      'Contingency governance protocol — sponsor-controlled drawdown framework',
      'Material price index escalation clause templates',
      'FX hedging strategy options for construction procurement packages',
      'CAPEX baseline validation checklist for institutional project sponsors',
    ],
    cta: 'Download Your Free CAPEX Allocation Strategy Guide',
  },
  'epcm-execution-playbook': {
    badge: 'FREE PLAYBOOK',
    assetTitle: 'EPCM Execution Playbook',
    headline: 'Interface Failures Between EPCM Packages Cause 60% of Major Project Schedule Delays',
    subheadline: "Managing multiple Engineering, Procurement and Construction packages simultaneously requires an Owner's Engineer governance mandate that is built before the first contract is signed.",
    stats: [
      { value: '60%', label: 'of major delays caused by package interface failures' },
      { value: '3–5', label: 'EPCM packages on a typical $50M+ African infrastructure project' },
      { value: '18mo', label: 'average commissioning delay without structured handover criteria' },
    ],
    pain: [
      { icon: '⚙️', title: 'Conflicted EPCM Relationships', desc: 'When the same entity designs and manages construction, conflicts of interest undermine independent governance and sponsor protection.' },
      { icon: '🔌', title: 'Interface Risk Gaps', desc: 'Undefined interfaces between civil, MEP and specialist packages create unresolved scope gaps that become expensive disputes at commissioning.' },
      { icon: '📋', title: 'Late Commissioning Planning', desc: 'Projects that plan handover criteria after construction begins consistently face costly defect rectification periods that delay beneficial occupation.' },
    ],
    benefits: [
      "Owner's Engineer mandate structure for multi-package EPCM projects",
      'Package interface matrix template for civil, MEP and specialist contracts',
      'Commissioning readiness criteria — planning from day one of design',
      'EPCM governance separation protocols to eliminate conflicts of interest',
      'Stage-gate approval framework for multi-package milestone sign-offs',
    ],
    cta: 'Download Your Free EPCM Execution Playbook',
  },
  'procurement-intelligence': {
    badge: 'FREE INTELLIGENCE REPORT',
    assetTitle: 'Africa Construction Procurement Intelligence',
    headline: 'Import Duties, Port Delays and Local Content Laws Can Add 25% to Your Project Cost — If You Are Not Prepared',
    subheadline: 'Navigating African procurement environments requires intelligence on duty exemptions, local content compliance, and port transit logistics that most international sponsors lack.',
    stats: [
      { value: '25%', label: 'additional cost from unprepared procurement strategies' },
      { value: '6–14wks', label: 'typical port clearance delays at Dar es Salaam / Mombasa' },
      { value: '8', label: 'procurement pathways covered in this intelligence report' },
    ],
    pain: [
      { icon: '🚢', title: 'Port and Demurrage Exposure', desc: 'Without coordinated shipping management, heavy equipment sits at port incurring demurrage charges of $5,000–$25,000 per day.' },
      { icon: '📑', title: 'Local Content Compliance Risk', desc: 'Failure to structure procurement in compliance with state local content laws results in permit delays, fines and contractual disputes with regulators.' },
      { icon: '🏗️', title: 'Duty Exemption Failures', desc: 'Projects that do not secure investment approval and duty exemptions upfront pay 15–25% tariff premiums on capital equipment imports.' },
    ],
    benefits: [
      'Duty exemption pathway guide for Tanzania, Kenya and GCC markets',
      'Local content compliance framework for African construction procurement',
      'Port-to-site logistics coordination protocol for heavy capital equipment',
      'Vendor pre-qualification framework for African supply chains',
      'Import risk register template for cross-border procurement packages',
    ],
    cta: 'Download Your Free Procurement Intelligence Report',
  },
  'hospitality-resort-governance': {
    badge: 'FREE GOVERNANCE GUIDE',
    assetTitle: 'Zanzibar & East Africa Resort Governance Guide',
    headline: 'Luxury Resort Delivery in East Africa Demands a Governance System That Standard Project Management Cannot Provide',
    subheadline: 'Island logistics, brand operator standards and specialist MEP requirements make Zanzibar and coastal resort projects uniquely complex. Most sponsors discover this after the first major delay.',
    stats: [
      { value: '2–4yr', label: 'typical delivery timeline for a luxury resort in Zanzibar' },
      { value: '40%', label: 'of resort projects face operator rejection at handover' },
      { value: '$8M+', label: 'average cost of failed brand operator handover' },
    ],
    pain: [
      { icon: '🚤', title: 'Island Supply Chain Complexity', desc: 'All materials must arrive by ferry or barge. Seasonal restrictions, weather windows and port capacity limit when and how much you can bring to site.' },
      { icon: '🏨', title: 'Brand Operator Standards', desc: 'International hotel operators have rigid technical standards that local contractors are rarely familiar with, creating expensive rework at commissioning.' },
      { icon: '💧', title: 'Specialist MEP for Hospitality', desc: 'Resort MEP — water treatment, backup power, HVAC for beachfront conditions — requires specialist engineering oversight that generic PM firms cannot provide.' },
    ],
    benefits: [
      'Island construction logistics framework for Zanzibar and coastal East Africa',
      'Brand operator pre-opening checklist aligned to international hotel standards',
      'Specialist MEP governance protocol for luxury hospitality environments',
      'Seasonal procurement and material float planning for island projects',
      'Handover readiness criteria for international brand operator acceptance',
    ],
    cta: 'Download Your Free Resort Governance Guide',
  },
  'cost-control-protocol': {
    badge: 'FREE PROTOCOL',
    assetTitle: 'Variations & Cost Control Protocol',
    headline: 'Uncontrolled Variations Account for 20–35% of Final Project Cost Overruns in African Capital Projects',
    subheadline: 'A structured Variation Control Protocol (VCP) is the single most effective financial governance tool a project sponsor can implement. This guide gives you one.',
    stats: [
      { value: '35%', label: 'of overruns attributable to variation and billing leakage' },
      { value: '$0', label: 'leverage once a variation is retrospectively claimed' },
      { value: '5', label: 'financial authorization gates in a robust VCP' },
    ],
    pain: [
      { icon: '📝', title: 'Retrospective Variation Claims', desc: 'When contractors execute changes before getting written approval, sponsors lose all negotiating leverage and face inflated retrospective bills.' },
      { icon: '🔢', title: 'No Approval Authority Matrix', desc: 'Without defined CAPEX thresholds for site engineers, project managers and board directors, variations bypass governance at every level.' },
      { icon: '📦', title: 'Material Measure vs. Estimate', desc: 'Approving progress payments on contractor estimates rather than verified material measures is a systematic source of billing leakage.' },
    ],
    benefits: [
      'Variation Control Protocol (VCP) template with defined approval authority thresholds',
      'Payment certification governance — measured works vs. contractor estimates',
      'Scope creep prevention: change order request workflow before work execution',
      'Variation register template for real-time cost trend monitoring',
      'Board-level cost reporting framework for CAPEX milestone tracking',
    ],
    cta: 'Download Your Free Variations & Cost Control Protocol',
  },
  'capital-project-reporting': {
    badge: 'FREE REPORTING GUIDE',
    assetTitle: 'Board-Level Capital Project Reporting Guide',
    headline: 'Cross-Border Investors and Institutional Sponsors Demand Real-Time Project Performance Transparency',
    subheadline: 'Board-level capital project reporting requires executive dashboards, KPI structures and risk heat maps that translate construction complexity into sponsor-readable intelligence.',
    stats: [
      { value: '78%', label: 'of institutional investors require monthly project performance reports' },
      { value: '3–6mo', label: 'average delay in identifying project distress without proper dashboards' },
      { value: '12', label: 'KPI categories covered in this reporting framework' },
    ],
    pain: [
      { icon: '📊', title: 'No Earned Value Tracking', desc: 'Without SV and CV tracking, sponsors receive lagging indicators — they discover schedule and cost overruns months after the point of control has passed.' },
      { icon: '🌐', title: 'Remote Stakeholder Blind Spots', desc: 'Cross-border boards and institutional funds cannot exercise governance without structured virtual data rooms and standardised reporting formats.' },
      { icon: '🎯', title: 'Risk Register Not Escalated', desc: 'Risk registers that stay at the PM level and never reach board visibility cause sponsors to be blindsided by issues that were flagged months earlier.' },
    ],
    benefits: [
      'Executive project dashboard template — schedule, cost and quality KPIs',
      'Earned Value Analysis (EVA) framework for capital project tracking',
      'Risk heat map structure for board-level risk escalation',
      'Virtual data room setup guide for cross-border institutional sponsors',
      'Monthly reporting cadence protocol for multi-stakeholder project governance',
    ],
    cta: 'Download Your Free Capital Project Reporting Guide',
  },
  'constructability-standards': {
    badge: 'FREE STANDARDS GUIDE',
    assetTitle: 'Constructability Review Standards',
    headline: 'International Designs That Cannot Be Built Locally Generate Variation Claims Before the Foundation Is Poured',
    subheadline: 'Constructability review is the process of validating that architectural and engineering designs can be executed efficiently using local skills, materials and supply chains. Most African projects skip it.',
    stats: [
      { value: '65%', label: 'of African projects face constructability-related variation claims' },
      { value: '2–3×', label: 'cost premium for specialist materials not available locally' },
      { value: '7', label: 'constructability failure modes covered in this guide' },
    ],
    pain: [
      { icon: '🏛️', title: 'Design Office vs. Site Reality', desc: 'International design firms produce specifications calibrated to European or Middle Eastern supply chains — not East African material availability and skill sets.' },
      { icon: '🔩', title: 'Specialist Material Imports', desc: "Designs that require imported structural or architectural components create 12–20 week lead times that immediately invalidate the contractor's baseline programme." },
      { icon: '🛠️', title: 'Informal Material Substitutions', desc: 'When contractors substitute specified materials without engineer approval, quality is compromised and contractual liability shifts to the sponsor.' },
    ],
    benefits: [
      'Constructability review checklist for East African design packages',
      'Material availability audit — local vs. import dependency matrix',
      'Structural specification review against local fabrication capabilities',
      'Prefabrication opportunity assessment for faster site execution',
      'Material substitution approval protocol to protect quality and contract compliance',
    ],
    cta: 'Download Your Free Constructability Review Standards',
  },
  'delay-avoidance': {
    badge: 'FREE AVOIDANCE GUIDE',
    assetTitle: 'Construction Delay & Dispute Avoidance Guide',
    headline: 'Every Uncontested Extension of Time Claim Is a Legal Transfer of Risk From the Contractor to the Project Sponsor',
    subheadline: 'Schedule disputes and liquidated damages failures are the most common legal battleground on African construction projects. This guide shows you how to win before it starts.',
    stats: [
      { value: '85%', label: 'of African projects experience schedule disputes' },
      { value: '14mo', label: 'average project overrun on East African infrastructure projects' },
      { value: '6', label: 'EOT claim types addressed in this dispute avoidance framework' },
    ],
    pain: [
      { icon: '📅', title: 'Baseline Programme Failures', desc: 'Contractors who do not maintain an active CPM schedule in P6 or MS Project cannot be held accountable to milestone dates in dispute proceedings.' },
      { icon: '⏱️', title: 'Uncontested EOT Claims', desc: 'When sponsors fail to rigorously audit Extension of Time claims, they inadvertently waive their rights to liquidated damages — often worth millions.' },
      { icon: '⚖️', title: 'Weak Liquidated Damages Clauses', desc: 'Poorly drafted LD clauses that are challenged as penalties rather than genuine pre-estimates are frequently struck down in East African courts.' },
    ],
    benefits: [
      'CPM schedule audit framework — what to check every month',
      'EOT claim validation criteria — critical path impact analysis protocol',
      'Liquidated damages clause drafting guide for East African jurisdictions',
      'Dispute prevention register: contemporaneous record-keeping system',
      'Acceleration cost recovery framework when contractor delays occur',
    ],
    cta: 'Download Your Free Delay & Dispute Avoidance Guide',
  },
};

export default function ResourcePage() {
  const params = useParams();
  const slug = (params?.slug as string || '').toLowerCase();
  const content = CONTENT[slug];

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [utm, setUtm] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    const p = new URLSearchParams(window.location.search);
    setUtm({
      utmSource: p.get('utm_source') || '',
      utmMedium: p.get('utm_medium') || '',
      utmCampaign: p.get('utm_campaign') || '',
      utmContent: p.get('utm_content') || '',
      utmTerm: p.get('utm_term') || '',
      referrer: document.referrer || '',
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { setError('Please enter a valid email address.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug, ...utm }),
      });
      if (res.ok) { setSubmitted(true); }
      else { const d = await res.json(); setError(d.error || 'Something went wrong. Please try again.'); }
    } catch { setError('Network error. Please check your connection.'); }
    finally { setLoading(false); }
  };

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#07142A' }} />
    );
  }

  if (!content) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07142A', color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#C9A84C' }}>Resource Not Found</h2>
          <p style={{ color: '#8EA8C3' }}>This resource does not exist.</p>
          <a href="https://proconixpmc.com" style={{ color: '#C9A84C' }}>Return to Website</a>
        </div>
      </div>
    );
  }

    if (slug === 'pre-construction-checklist') {
    return <PreConstructionChecklist slug={slug} utm={utm} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#07142A', fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", color: '#FFFFFF' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{ background: '#0B1D35', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" className="nav-logo-wrapper">
          <img src="/logo.png" alt="Proconix Logo" className="nav-logo-img" />
          <div className="nav-logo-text-group">
            <div className="nav-logo" style={{ fontSize: '22px' }}>PROCONIX</div>
            <div className="nav-tagline" style={{ fontSize: '9px', color: '#C9A84C' }}>Project Management Consultancy</div>
          </div>
        </a>
        <a href="https://proconixpmc.com" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px' }}>Visit Website →</a>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(180deg, #0B1D35 0%, #07142A 100%)', padding: '80px 24px 60px', textAlign: 'center', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '6px 18px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '28px' }}>{content.badge}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.2, color: '#FFFFFF', margin: '0 0 24px' }}>{content.headline}</h1>
          <p style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#C2D4E4', lineHeight: 1.7, margin: '0 0 48px', maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto' }}>{content.subheadline}</p>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
            {content.stats.map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '8px', padding: '20px 12px' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#8EA8C3', marginTop: '8px', lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section style={{ padding: '70px 24px', background: '#0B1D35' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '3px', color: '#C9A84C', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>THE PROBLEM</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 4vw, 36px)', textAlign: 'center', color: '#FFFFFF', marginBottom: '48px', lineHeight: 1.3 }}>Why Most Sponsors Face These Challenges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {content.pain.map((p, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '28px 24px' }}>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{p.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#FFFFFF', fontSize: '20px', marginBottom: '10px', fontWeight: 600 }}>{p.title}</h3>
                <p style={{ color: '#8EA8C3', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #122647 0%, #0B1D35 100%)', borderTop: '1px solid rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.1)' }} id="download">
        <div style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '2px', background: '#C9A84C', margin: '0 auto 24px' }}></div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 4vw, 38px)', color: '#FFFFFF', marginBottom: '16px', fontWeight: 700 }}>{content.cta}</h2>
          <p style={{ color: '#8EA8C3', fontSize: '0.9rem', marginBottom: '32px', lineHeight: 1.6 }}>Enter your correct email address to receive your complimentary resource instantly. You will also receive 4 days of follow-up insights from our Principal Consultant.</p>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '0.78rem', color: '#C9A84C', marginBottom: '10px', fontStyle: 'italic' }}>⚠ Please ensure you enter your correct email address to receive the resource.</p>
              <div style={{ display: 'flex', gap: '0', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(201,168,76,0.4)' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your professional email address"
                  required
                  style={{ flex: 1, padding: '16px 20px', background: '#0B1D35', border: 'none', color: '#FFFFFF', fontSize: '0.9rem', outline: 'none' }}
                />
                <button type="submit" disabled={loading}
                  style={{ padding: '16px 28px', background: '#C9A84C', color: '#0B1D35', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: loading ? 'wait' : 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {loading ? 'Sending...' : 'Get Free Resource'}
                </button>
              </div>
              {error && <p style={{ color: '#e57373', marginTop: '12px', fontSize: '0.85rem' }}>{error}</p>}
              <p style={{ color: '#4a6a8a', fontSize: '0.75rem', marginTop: '14px' }}>We respect your privacy. No spam — only 4 days of relevant project governance insights.</p>
            </form>
          ) : (
            <div style={{ background: 'rgba(46,125,50,0.15)', border: '1px solid rgba(46,125,50,0.4)', borderRadius: '8px', padding: '32px' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ color: '#81c784', marginBottom: '12px', fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>Resource Sent!</h3>
              <p style={{ color: '#C2D4E4', fontSize: '0.9rem', lineHeight: 1.6 }}>Check your inbox for <strong style={{ color: '#FFFFFF' }}>{email}</strong>. Your {content.assetTitle} is on its way. Over the next 4 days, you will receive follow-up insights from our Principal Consultant.</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '70px 24px', background: '#07142A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '3px', color: '#C9A84C', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>WHAT YOU WILL GET</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 4vw, 34px)', textAlign: 'center', color: '#FFFFFF', marginBottom: '40px', lineHeight: 1.3 }}>Inside Your {content.assetTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {content.benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '20px 24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '28px', height: '28px', background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#C9A84C', fontSize: '14px', fontWeight: 700 }}>✓</div>
                <p style={{ color: '#C2D4E4', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authority */}
      <section style={{ padding: '60px 24px', background: '#0B1D35', borderTop: '1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 700, color: '#C9A84C' }}>15+</div>
            <div style={{ fontSize: '12px', color: '#8EA8C3', marginTop: '4px' }}>Years in African Capital Projects</div>
          </div>
          <div style={{ width: '1px', height: '60px', background: 'rgba(201,168,76,0.2)', flex: '0 0 auto' }}></div>
          <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 700, color: '#C9A84C' }}>$500M+</div>
            <div style={{ fontSize: '12px', color: '#8EA8C3', marginTop: '4px' }}>Capital Projects Governed</div>
          </div>
          <div style={{ width: '1px', height: '60px', background: 'rgba(201,168,76,0.2)', flex: '0 0 auto' }}></div>
          <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 700, color: '#C9A84C' }}>GCC &amp; Africa</div>
            <div style={{ fontSize: '12px', color: '#8EA8C3', marginTop: '4px' }}>Operational Mandate</div>
          </div>
        </div>
        <div style={{ maxWidth: '600px', margin: '40px auto 0', textAlign: 'center' }}>
          <p style={{ color: '#8EA8C3', fontSize: '0.85rem', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>&ldquo;Proconix was established specifically to serve capital project sponsors in Africa and the GCC who require independent, expert-level project governance — not just project management.&rdquo;</p>
          <p style={{ color: '#C9A84C', fontSize: '0.8rem', fontWeight: 600, marginTop: '12px', letterSpacing: '1px' }}>— Talibbhai Khanji, Founder &amp; Principal Consultant, Proconix PMC</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#07142A', borderTop: '1px solid rgba(201,168,76,0.1)', padding: '32px 24px', textAlign: 'center' }}>
        <div className="nav-logo-wrapper" style={{ justifyContent: 'center', marginBottom: '15px' }}>
          <img src="/logo.png" alt="Proconix Logo" className="nav-logo-img" />
          <div className="nav-logo-text-group" style={{ textAlign: 'left' }}>
            <div className="nav-logo" style={{ fontSize: '18px' }}>PROCONIX</div>
            <div className="nav-tagline" style={{ fontSize: '9px', color: '#C9A84C' }}>Project Management Consultancy</div>
          </div>
        </div>
        <a href="https://proconixpmc.com" style={{ color: '#C9A84C', fontSize: '0.8rem', textDecoration: 'none' }}>proconixpmc.com</a>
        <div style={{ color: '#4a6a8a', fontSize: '0.72rem', marginTop: '16px' }}>© 2026 Proconix Project Management Consultancy. All rights reserved.</div>
      </footer>
    </div>
  );
}
