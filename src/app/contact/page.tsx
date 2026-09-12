import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{"@type":"ListItem","position":1,"name":"Contact","item":"https://www.proconixpmc.com/contact"}]
      }) }} />

      <section className="page-header" style={{ padding: '120px 20px 60px', textAlign: 'center', backgroundColor: '#0B1D35', color: '#fff' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Contact Proconix PMC</h1>
        <p style={{ fontSize: '1.2rem', color: '#8EA8C3', maxWidth: '600px', margin: '0 auto' }}>
          Get in touch with us to discuss your construction project governance needs in Africa.
        </p>
      </section>

      <section style={{ padding: '60px 20px', backgroundColor: '#f9f9f9', color: '#333' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Direct Contact</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
              <strong>Email:</strong> <a href="mailto:info@proconixpmc.com" style={{ color: '#0B1D35', textDecoration: 'underline' }}>info@proconixpmc.com</a>
            </p>
            <p style={{ fontSize: '1.1rem' }}>
              <strong>WhatsApp (Priority Channel):</strong> <a href="https://wa.me/255695964527" target="_blank" rel="noopener noreferrer" style={{ color: '#0B1D35', textDecoration: 'underline' }}>+255 695 964 527</a>
            </p>
          </div>

          <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Operating Regions</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              Proconix PMC provides sponsor-aligned construction project governance across Africa, with a strong focus on:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', fontSize: '1.1rem', lineHeight: '1.6' }}>
              <li>Tanzania & Zanzibar</li>
              <li>Kenya</li>
              <li>Uganda</li>
              <li>Zambia</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
             <Link href="/executive-governance-briefing-call" style={{ display: 'inline-block', padding: '15px 30px', backgroundColor: '#0B1D35', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
               Book the Executive Governance Briefing Call
             </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
