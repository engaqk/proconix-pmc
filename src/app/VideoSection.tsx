'use client';

import { useState, useEffect, useRef } from 'react';

const TRANSCRIPT_TEXT = `You run your business, anywhere. We run your construction projects, in Africa.

If you are a sponsor or investor building in Africa, you know the gap. You approve the budget and the contractor. Then you step back, and cost, schedule and quality start to move without you. That is not anyone’s fault. It is a governance vacuum.

I am Talibbhai Khanji, Strategic Project Leader and founder of Proconix PMC. Sponsor-Aligned Construction Project Governance in Africa.

We are your owner-side construction project delivery partner. We direct, manage and execute end-to-end construction project governance across the full Engineering, Procurement and Construction Management lifecycle, EPCM, from inception to successful handover. In short, we manage your construction projects end-to-end on your behalf, so you can concentrate on your core business and its growth.

We help real estate, hospitality and industrial project sponsors and investors deliver their construction projects in Africa on time, within approved cost, quality and scope. To obtain maximum ROI on your construction project investment, your strategic business objectives, project value, and a hassle-free experience.

On projects from five million to over one hundred million US dollars. On-site, hybrid, or through our Virtual Governance Control Room, working alongside your in-house team, never replacing it.

I am a registered civil engineer, holder of an MBA in Project Management, and of the Project Management Professional, PMP, global credential awarded by the Project Management Institute, USA. I bring over nineteen years of experience, more than fifteen of them on the ground in Africa. I have managed large-scale, complex and fast-track residential townships, mixed-use, high-rise, commercial, industrial, hospitality, healthcare and institutional projects, with their complete external development and infrastructure works. Most recently, I led the Meliá Zanzibar and Four Seasons builds. I have successfully led and delivered various types of construction projects for these leading organizations. Over two hundred and fifty million dollars of construction projects delivered.

The result: fifteen to twenty executive hours reclaimed, every week.

If you are a real estate, hospitality or industrial construction project sponsor who already has an ongoing construction project, or is about to start one, let us discuss.

Scan the card on your screen, or send us a message.

Thank you.

Best regards,
Talibbhai Khanji
Founder & Principal Consultant, Proconix PMC
info@proconixpmc.com · +255 695964527
https://proconixpmc.com`;

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "What Proconix PMC Does — Talibbhai Khanji, Strategic Project Leader",
  "description": "Talibbhai Khanji explains how Proconix PMC, an owner-side construction project delivery partner, directs, manages and executes end-to-end construction project governance for project sponsors with construction projects in Africa.",
  "thumbnailUrl": "https://www.proconixpmc.com/talibbhai.jpg",
  "uploadDate": "2026-10-23",
  "embedUrl": "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7519311133703467008",
  "contentUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7519311230508101633/",
  "transcript": TRANSCRIPT_TEXT,
  "publisher": {
    "@id": "https://www.proconixpmc.com/#organization"
  }
};

export default function VideoSection() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="video-section" 
      id="video-briefing" 
      style={{ 
        padding: '70px 0', 
        background: 'linear-gradient(180deg, rgba(7, 20, 42, 0.95) 0%, rgba(11, 29, 53, 0.98) 100%)',
        borderTop: '1px solid rgba(201, 168, 76, 0.12)',
        borderBottom: '1px solid rgba(201, 168, 76, 0.12)'
      }}
    >
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} 
      />

      <div className="container" style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
        <div 
          className="section-eyebrow" 
          style={{ justifyContent: 'center', marginBottom: '10px' }}
        >
          Executive Video Briefing
        </div>
        
        <h2 
          className="section-title" 
          style={{ fontSize: '2.1rem', lineHeight: 1.25, marginBottom: '24px', color: '#FFFFFF' }}
        >
          Watch: What Proconix PMC Does
        </h2>

        <p 
          style={{ 
            fontSize: '1rem', 
            color: 'var(--text-light, #C2D4E4)', 
            maxWidth: '620px', 
            margin: '0 auto 36px', 
            lineHeight: 1.7 
          }}
        >
          Talibbhai Khanji, Strategic Project Leader, explains how owner-side construction project governance eliminates the exposure gap for project sponsors in Africa.
        </p>

        {/* Video Embed Container (Centered, max 504px desktop, 100% mobile) */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '100%', 
            margin: '0 auto 28px' 
          }}
        >
          <div 
            style={{ 
              width: '100%', 
              maxWidth: '504px', 
              minHeight: shouldLoad ? 'auto' : '520px', 
              background: 'rgba(0, 0, 0, 0.3)', 
              borderRadius: '8px', 
              overflow: 'hidden',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {shouldLoad ? (
              <iframe 
                src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7519311133703467008?collapsed=1" 
                height="1000" 
                width="504" 
                frameBorder="0" 
                allowFullScreen={true} 
                title="What Proconix PMC Does — Talibbhai Khanji" 
                loading="lazy"
                style={{ 
                  width: '100%', 
                  maxWidth: '504px', 
                  border: 'none', 
                  borderRadius: '8px',
                  display: 'block'
                }}
              />
            ) : (
              <div style={{ padding: '60px 20px', color: '#8EA8C3', fontSize: '0.9rem' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>▶</div>
                <div>Loading executive briefing video...</div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Transcript Block */}
        <div 
          style={{ 
            maxWidth: '504px', 
            margin: '0 auto', 
            textAlign: 'left',
            background: 'rgba(18, 38, 71, 0.5)',
            border: '1px solid rgba(201, 168, 76, 0.2)',
            borderRadius: '6px',
            overflow: 'hidden'
          }}
        >
          <button
            type="button"
            onClick={() => setTranscriptOpen(!transcriptOpen)}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '0.92rem',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              outline: 'none'
            }}
            aria-expanded={transcriptOpen}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--gold, #C9A84C)' }}>📄</span>
              Read the transcript
            </span>
            <span style={{ color: 'var(--gold, #C9A84C)', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {transcriptOpen ? '−' : '+'}
            </span>
          </button>

          {transcriptOpen && (
            <div 
              style={{ 
                padding: '16px 20px 24px', 
                borderTop: '1px solid rgba(201, 168, 76, 0.15)',
                color: '#C2D4E4',
                fontSize: '0.88rem',
                lineHeight: 1.8,
                background: 'rgba(7, 20, 42, 0.7)',
                whiteSpace: 'pre-line'
              }}
            >
              {TRANSCRIPT_TEXT}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
