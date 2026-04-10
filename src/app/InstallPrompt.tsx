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
      backgroundColor: '#0B1D35',
      border: '1px solid #C9A84C',
      padding: '12px 20px',
      borderRadius: '12px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 10000,
      fontFamily: '"DM Sans", sans-serif',
      width: '92%',
      maxWidth: '380px',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img 
          src="/icon.png" 
          alt="App Icon" 
          style={{ width: '48px', height: '48px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', color: '#fff', flex: 1 }}>
          <strong style={{ fontSize: '1rem', color: '#C9A84C', fontWeight: 700 }}>Proconix App</strong>
          <span style={{ fontSize: '0.82rem', color: '#DCE4EF', opacity: 0.9 }}>
            {isIOS ? "Add to Home Screen" : "Install App Directly"}
          </span>
        </div>
        <button 
          onClick={handleClose}
          style={{ background: 'transparent', border: 'none', color: '#8EA8C3', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '2px 0' }}>
        {isIOS ? (
          <div style={{ color: '#fff', fontSize: '0.8rem', lineHeight: '1.4', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #C9A84C' }}>
             Tap the <img src="https://developer.apple.com/design/human-interface-guidelines/macos/images/icons/system-icons/share.png" style={{ height: '16px', verticalAlign: 'middle', filter: 'invert(1)' }} alt="share" /> icon, then scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.
          </div>
        ) : (
          <p style={{ color: '#DCE4EF', fontSize: '0.85rem', margin: 0 }}>
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
            padding: '10px', 
            borderRadius: '6px', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            fontSize: '0.9rem',
            boxShadow: '0 4px 15px rgba(201, 168, 76, 0.3)',
            marginTop: '4px'
          }}
        >
          Install Directly
        </button>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
