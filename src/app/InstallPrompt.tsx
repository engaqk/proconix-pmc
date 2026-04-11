"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);
    
    // FORCE SHOW prompt after 2 seconds for first-load visibility
    // This acts as the fallback if the browser event is slow
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired - browser is ready');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
      // If event fired, we don't need the timer anymore
      clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        // No action needed, user reads the guide in the card
      } else {
        // Android/Chrome Fallback
        alert("To install Proconix App:\n1. Open your browser menu (three dots ⋮)\n2. Tap 'Install App' or 'Add to Home Screen'");
      }
      return;
    }
    
    setShowPrompt(false);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '15px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(11, 29, 53, 0.98)',
      border: '1px solid rgba(201, 168, 76, 0.3)',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      zIndex: 10000,
      fontFamily: '"DM Sans", sans-serif',
      width: '94%',
      maxWidth: '400px',
      animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img 
          src="/icon.jpg" 
          alt="App Icon" 
          style={{ width: '56px', height: '56px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', color: '#fff', flex: 1 }}>
          <strong style={{ fontSize: '1.1rem', color: '#C9A84C', fontWeight: 700, letterSpacing: '-0.5px' }}>Proconix App</strong>
          <span style={{ fontSize: '0.85rem', color: '#DCE4EF', opacity: 0.8 }}>
            {isIOS ? "Add to Home Screen" : "Install App Directly"}
          </span>
        </div>
        <button 
          onClick={handleClose}
          style={{ background: 'transparent', border: 'none', color: '#8EA8C3', cursor: 'pointer', fontSize: '1.4rem', padding: '5px', opacity: 0.6 }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '2px 0' }}>
        {isIOS ? (
          <div style={{ color: '#fff', fontSize: '0.85rem', lineHeight: '1.5', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', borderLeft: '3px solid #C9A84C' }}>
             Tap the <img src="https://developer.apple.com/design/human-interface-guidelines/macos/images/icons/system-icons/share.png" style={{ height: '18px', verticalAlign: 'middle', filter: 'invert(1)' }} alt="share" /> icon, then scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.
          </div>
        ) : (
          <p style={{ color: '#DCE4EF', fontSize: '0.9rem', margin: 0, opacity: 0.9 }}>
            Install the <strong>Proper Proconix App</strong> for 1-click access to governance tools.
          </p>
        )}
      </div>

      {!isIOS && (
        <button 
          onClick={handleInstallClick}
          style={{ 
            background: 'linear-gradient(135deg, #C9A84C 0%, #A68A3B 100%)', 
            color: '#0B1D35', 
            border: 'none', 
            padding: '12px', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            fontSize: '0.95rem',
            boxShadow: '0 8px 20px rgba(201, 168, 76, 0.2)',
            marginTop: '5px'
          }}
        >
          Install Now
        </button>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { transform: translate(-50%, 40px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
