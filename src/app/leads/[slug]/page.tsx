'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function DownloadPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawSlug = ((params?.slug as string) || 'pre-construction-checklist').toLowerCase();
  const id = searchParams.get('id') || '';

  const [resolvedSlug, setResolvedSlug] = useState<string | null>(null);
  const [loadingMapping, setLoadingMapping] = useState(true);
  const [status, setStatus] = useState<'starting' | 'downloading' | 'done' | 'error'>('starting');
  const [progress, setProgress] = useState(0);
  const triggered = useRef(false);

  useEffect(() => {
    const resolveSlug = async () => {
      try {
        const q = query(collection(db, 'leadSlugs'), where('customSlug', '==', rawSlug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setResolvedSlug(snap.docs[0].id);
        } else {
          setResolvedSlug(rawSlug);
        }
      } catch (err) {
        console.error("Error resolving custom slug:", err);
        setResolvedSlug(rawSlug);
      } finally {
        setLoadingMapping(false);
      }
    };
    resolveSlug();
  }, [rawSlug]);

  useEffect(() => {
    if (!resolvedSlug || loadingMapping) return;
    if (triggered.current) return;
    triggered.current = true;

    // Animate progress bar
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 95) { p = 95; clearInterval(interval); }
      setProgress(Math.min(p, 95));
    }, 180);

    // Small delay for UX — let user see the page before download starts
    const timer = setTimeout(() => {
      setStatus('downloading');

      const url = `/api/leads/download?slug=${resolvedSlug}${id ? `&id=${id}` : ''}`;
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resolvedSlug}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Complete the progress bar
      clearInterval(interval);
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setStatus('done'), 400);
      }, 800);
    }, 1200);

    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [resolvedSlug, loadingMapping, id]);

  const titles: Record<string, string> = {
    'pre-construction-checklist': 'Pre-Construction Governance Checklist',
    'contractor-risk-audit': 'Contractor Risk Audit Guide',
    'capex-allocation-strategy': 'CAPEX Allocation Strategy Guide',
    'epcm-execution-playbook': 'EPCM Execution Playbook',
    'procurement-intelligence': 'Africa Construction Procurement Intelligence',
    'hospitality-resort-governance': 'Zanzibar & East Africa Resort Governance',
    'cost-control-protocol': 'Variations & Cost Control Protocol',
    'capital-project-reporting': 'Board-Level Capital Project Reporting',
    'constructability-standards': 'Constructability Review Standards',
    'delay-avoidance': 'Construction Delay & Dispute Avoidance',
  };
  const title = titles[resolvedSlug || ''] || 'Your Resource';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07142A; }

        .dl-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #07142A 0%, #0B1D35 50%, #07142A 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .dl-page::before {
          content: '';
          position: absolute;
          top: -200px; left: 50%; transform: translateX(-50%);
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .dl-card {
          background: #122647;
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 8px;
          padding: 56px 48px;
          max-width: 560px;
          width: 100%;
          text-align: center;
          position: relative;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }
        .dl-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
          border-radius: 8px 8px 0 0;
        }

        .dl-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 40px;
        }
        .dl-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #FFFFFF;
          text-transform: uppercase;
        }
        .dl-logo-sub {
          font-size: 9px;
          letter-spacing: 2.5px;
          color: #C9A84C;
          text-transform: uppercase;
          font-weight: 600;
        }

        .dl-icon-wrap {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 28px;
          font-size: 36px;
          transition: all 0.4s ease;
        }
        .dl-icon-wrap.done {
          background: rgba(46,125,50,0.15);
          border-color: rgba(46,125,50,0.4);
        }

        .dl-label {
          font-size: 10px;
          letter-spacing: 2px;
          color: #C9A84C;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .dl-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.3;
          margin-bottom: 20px;
        }
        .dl-status-text {
          font-size: 14px;
          color: #8EA8C3;
          line-height: 1.6;
          margin-bottom: 32px;
          min-height: 44px;
          transition: all 0.3s ease;
        }
        .dl-status-text.done { color: #81c784; }

        .dl-progress-track {
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .dl-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #C9A84C, #e8c96a);
          border-radius: 4px;
          transition: width 0.25s ease-out;
        }
        .dl-progress-bar.done {
          background: linear-gradient(90deg, #2e7d32, #81c784);
        }
        .dl-progress-label {
          font-size: 11px;
          color: #4a6a8a;
          margin-bottom: 36px;
          text-align: right;
        }

        .dl-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 0 -48px 32px;
        }

        .dl-cta-label {
          font-size: 11px;
          color: #4a6a8a;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .dl-cta-btn {
          display: inline-block;
          padding: 14px 32px;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.35);
          color: #C9A84C;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-radius: 4px;
          transition: all 0.2s ease;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .dl-cta-btn:hover {
          background: rgba(201,168,76,0.2);
          border-color: rgba(201,168,76,0.6);
          color: #e8c96a;
          transform: translateY(-1px);
        }
        .dl-retry {
          font-size: 12px;
          color: #4a6a8a;
          margin-top: 16px;
        }
        .dl-retry a {
          color: #8EA8C3;
          text-decoration: underline;
          cursor: pointer;
        }
        .dl-retry a:hover { color: #C9A84C; }

        .dl-footer {
          margin-top: 32px;
          font-size: 11px;
          color: #2a4a6a;
          letter-spacing: 0.5px;
        }

        @media (max-width: 600px) {
          .dl-card { padding: 40px 28px; }
          .dl-title { font-size: 22px; }
          .dl-divider { margin: 0 -28px 28px; }
        }
      `}</style>

      <div className="dl-page">
        <div className="dl-card">

          {/* Logo */}
          <a href="https://proconixpmc.com" target="_blank" rel="noopener noreferrer" className="dl-logo" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <Image src="/logo.png" alt="Proconix" width={48} height={48} style={{ objectFit: 'contain' }} />
            <div className="dl-logo-text">Proconix</div>
            <div className="dl-logo-sub">Project Management Consultancy</div>
          </a>

          {/* Icon */}
          <div className={`dl-icon-wrap${status === 'done' ? ' done' : ''}`}>
            {status === 'done' ? '✅' : '📄'}
          </div>

          {/* Title */}
          <div className="dl-label">Your Resource</div>
          <h1 className="dl-title">{title}</h1>

          {/* Status text */}
          <div className={`dl-status-text${status === 'done' ? ' done' : ''}`}>
            {status === 'starting' && 'Preparing your document — this will only take a moment…'}
            {status === 'downloading' && 'Your download has started. Check your Downloads folder if it doesn\'t open automatically.'}
            {status === 'done' && '✓ Download complete! Your PDF has been saved to your device.'}
            {status === 'error' && 'Something went wrong. Please use the button below to try again.'}
          </div>

          {/* Progress bar */}
          <div className="dl-progress-track">
            <div
              className={`dl-progress-bar${status === 'done' ? ' done' : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="dl-progress-label">
            {status === 'done' ? '✓ Complete' : `${Math.round(progress)}%`}
          </div>

          {/* Divider */}
          <div className="dl-divider" />

          {/* CTA */}
          {status === 'done' ? (
            <>
              <div className="dl-cta-label">Ready to protect your project?</div>
              <a href="https://proconixpmc.com/#contact" className="dl-cta-btn">
                Book a Discovery Call →
              </a>
              <div className="dl-retry">
                Didn't receive the file?{' '}
                <a href={`/api/leads/download?slug=${resolvedSlug || ''}${id ? `&id=${id}` : ''}`} download>
                  Click here to download again
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="dl-cta-label">While you wait</div>
              <a href="https://proconixpmc.com" className="dl-cta-btn">
                Visit Proconix PMC →
              </a>
            </>
          )}
        </div>

        <div className="dl-footer">
          © 2026 Proconix Project Management Consultancy · Africa · GCC
        </div>
      </div>
    </>
  );
}
