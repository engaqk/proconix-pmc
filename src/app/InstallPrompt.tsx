"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Hide our user interface that shows our A2HS button
    setShowPrompt(false);
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
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
