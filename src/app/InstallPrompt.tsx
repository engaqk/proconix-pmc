"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isIOS && !isStandalone) {
      // Show iOS specific instructions after a small delay
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If it's iOS, show manual instructions
      alert("To install Proconix on iOS:\n1. Tap the 'Share' icon (bottom square with arrow)\n2. Scroll down and tap 'Add to Home Screen'");
      setShowPrompt(false);
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
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(11, 29, 53, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid #C9A84C',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      zIndex: 9999,
      fontFamily: '"DM Sans", sans-serif',
      width: '90%',
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', color: '#fff', flex: 1 }}>
        <strong style={{ fontSize: '1rem', marginBottom: '4px', color: '#C9A84C' }}>Install Proconix App</strong>
        <span style={{ fontSize: '0.85rem', color: '#DCE4EF' }}>Add to home screen for faster access.</span>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleClose}
          style={{ background: 'transparent', border: 'none', color: '#8EA8C3', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Later
        </button>
        <button 
          onClick={handleInstallClick}
          style={{ background: '#C9A84C', color: '#0B1D35', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Install
        </button>
      </div>
    </div>
  );
}
