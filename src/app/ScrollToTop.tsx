'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <style>{`
        .scroll-top-btn {
          position: fixed;
          bottom: 32px;
          right: 24px;
          z-index: 9998;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(18, 38, 71, 0.95);
          border: 1px solid rgba(201, 168, 76, 0.45);
          color: #C9A84C;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s ease, border-color 0.2s ease;
          pointer-events: auto;
        }
        .scroll-top-btn.hidden {
          opacity: 0;
          transform: translateY(16px);
          pointer-events: none;
        }
        .scroll-top-btn.hovered {
          background: rgba(201, 168, 76, 0.15);
          border-color: rgba(201, 168, 76, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.2);
        }
        .scroll-top-btn svg {
          transition: transform 0.2s ease;
        }
        .scroll-top-btn.hovered svg {
          transform: translateY(-2px);
        }
        @media (max-width: 600px) {
          .scroll-top-btn {
            bottom: 80px;
            right: 16px;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>

      <button
        className={`scroll-top-btn${!visible ? ' hidden' : ''}${isHovered ? ' hovered' : ''}`}
        onClick={scrollTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}
