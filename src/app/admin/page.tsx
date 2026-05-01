"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);

  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState({ type: "", message: "" });
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showAnonymous, setShowAnonymous] = useState(false);

  const handleBroadcastSubmit = async (e: React.FormEvent, isScheduled: boolean) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastMessage) {
      setBroadcastResult({ type: "error", message: "Subject and Message are required." });
      return;
    }
    
    // Get unique valid emails
    const validEmails = Array.from(new Set(
      submissions
        .map(sub => sub.email)
        .filter(email => email && email.includes('@'))
    ));

    if (validEmails.length === 0) {
      setBroadcastResult({ type: "error", message: "No valid recipient emails found." });
      return;
    }

    setIsBroadcasting(true);
    setBroadcastResult({ type: "", message: "" });

    try {
      const payload = {
        emails: validEmails,
        subject: broadcastSubject,
        message: broadcastMessage,
        secret: 'admin53',
        scheduledAt: (isScheduled && scheduledDate) ? new Date(scheduledDate).toISOString() : null
      };

      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        if (payload.scheduledAt) {
          setBroadcastResult({ type: "success", message: `Successfully scheduled email for ${new Date(payload.scheduledAt).toLocaleString()}.` });
        } else {
          setBroadcastResult({ type: "success", message: `Successfully sent broadcast to ${data.count} recipients.` });
        }
        setBroadcastSubject("");
        setBroadcastMessage("");
        setScheduledDate("");
      } else {
        setBroadcastResult({ type: "error", message: data.error || "Broadcast failed" });
      }
    } catch (err: any) {
      setBroadcastResult({ type: "error", message: err.message || "Broadcast failed" });
    } finally {
      setIsBroadcasting(false);
    }
  };

  useEffect(() => {
    const savedLogin = localStorage.getItem("proconix_admin_logged_in");
    if (savedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin53") {
      setIsLoggedIn(true);
      localStorage.setItem("proconix_admin_logged_in", "true");
      setError("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true);
      const q = query(collection(db, "formSubmissions"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubmissions(data);
        setIsLoading(false);
        setFirebaseError(null);
      }, (err) => {
        console.error("Error fetching submissions:", err);
        setFirebaseError(err.message);
        setIsLoading(false);
        
        // If it's a missing index error, Firebase provides a URL in the console
        if (err.message.includes("index")) {
          setFirebaseError("Firestore Index Missing: You need to create an index for 'formSubmissions' with 'createdAt' descending. Check the browser console for the direct link.");
        }
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#0B1D35", color: "#F7F8FA" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "12px", border: "1px solid rgba(201,168,76,0.3)", maxWidth: "400px", width: "100%" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#C9A84C" }}>PROCONIX ADMIN</h2>
          {error && <p style={{ color: "#ff6b6b", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: "12px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff" }}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "12px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff" }}
              required 
            />
            <button type="submit" style={{ padding: "12px", background: "#C9A84C", color: "#0B1D35", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .admin-header-actions { display: flex; gap: 15px; }
        .admin-title { font-size: 32px; }
        @media (max-width: 768px) {
          .admin-header { flex-direction: column; align-items: flex-start; gap: 15px; }
          .admin-header-actions { width: 100%; justify-content: space-between; }
          .admin-title { font-size: 24px; }
          .hide-on-mobile { display: none !important; }
        }
      `}} />
      <div style={{ minHeight: "100vh", backgroundColor: "#07142A", padding: "40px 20px", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="admin-header">
          <h1 className="admin-title" style={{ color: "#FFFFFF", margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>PROCONIX <span style={{ color: "#C9A84C" }}>DASHBOARD</span></h1>
          <div className="admin-header-actions">
            <button onClick={() => setShowBroadcast(!showBroadcast)} style={{ padding: "8px 16px", background: "#C9A84C", color: "#0B1D35", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif" }}>
              <span>{showBroadcast ? "Close Broadcast" : "Broadcast Email"}</span>
              <span style={{ background: "rgba(0,0,0,0.2)", padding: "2px 6px", borderRadius: "12px", fontSize: "0.8rem", color: "#0B1D35" }}>
                {Array.from(new Set(submissions.map(s => s.email).filter(e => e && e.includes('@')))).length}
              </span>
            </button>
            <button onClick={() => {
              setIsLoggedIn(false);
              localStorage.removeItem("proconix_admin_logged_in");
            }} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Logout</button>
          </div>
        </div>

        {showBroadcast && (
          <div style={{ background: "#122647", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", overflow: "hidden", marginBottom: "30px", border: "1px solid rgba(201,168,76,0.3)" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(201,168,76,0.1)", background: "#0B1D35" }}>
              <h3 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "24px" }}>Broadcast Email to All Leads</h3>
            </div>
            <div style={{ padding: "20px" }}>
              <p style={{ color: "#C2D4E4", marginBottom: "20px", fontSize: "0.95rem" }}>
                This will send an email from <strong style={{ color: "#C9A84C" }}>info@proconixpmc.com</strong> to all unique, valid email addresses in the table. Recipients are BCC'd for privacy.
              </p>
              
              <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#C9A84C", fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Subject</label>
                  <input 
                    type="text" 
                    placeholder="Enter email subject..." 
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    style={{ width: "100%", padding: "14px", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "4px", background: "rgba(11,29,53,0.6)", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: "15px" }}
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#C9A84C", fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Message Body</label>
                  <textarea 
                    placeholder="Write your message here... HTML tags will be escaped, but line breaks are preserved." 
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    style={{ width: "100%", padding: "14px", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "4px", minHeight: "180px", background: "rgba(11,29,53,0.6)", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", resize: "vertical" }}
                    required 
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#C9A84C", fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Schedule (Optional)</label>
                  <input 
                    type="datetime-local" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    style={{ width: "100%", padding: "14px", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "4px", background: "rgba(11,29,53,0.6)", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: "15px" }}
                  />
                  <p style={{ margin: "5px 0 0", color: "#8EA8C3", fontSize: "0.8rem" }}>Only required if you are clicking 'Schedule Email'.</p>
                </div>
                
                {broadcastResult.message && (
                  <div style={{ padding: "15px", borderRadius: "4px", backgroundColor: broadcastResult.type === 'success' ? 'rgba(46, 125, 50, 0.2)' : 'rgba(198, 40, 40, 0.2)', color: broadcastResult.type === 'success' ? '#81c784' : '#e57373', border: `1px solid ${broadcastResult.type === 'success' ? '#2e7d32' : '#c62828'}` }}>
                    {broadcastResult.message}
                  </div>
                )}
                
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                  <button 
                    type="button" 
                    onClick={(e) => handleBroadcastSubmit(e, false)}
                    disabled={isBroadcasting || submissions.length === 0}
                    style={{ 
                      padding: "14px 28px", 
                      background: "#C9A84C", 
                      color: "#0B1D35", 
                      border: "none", 
                      borderRadius: "4px", 
                      fontWeight: "bold", 
                      cursor: (isBroadcasting || submissions.length === 0) ? "not-allowed" : "pointer", 
                      opacity: (isBroadcasting || submissions.length === 0) ? 0.6 : 1,
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}
                  >
                    {isBroadcasting && !scheduledDate ? "Sending..." : "Send Broadcast Now"}
                  </button>

                  <button 
                    type="button" 
                    onClick={(e) => handleBroadcastSubmit(e, true)}
                    disabled={isBroadcasting || submissions.length === 0 || !scheduledDate}
                    style={{ 
                      padding: "14px 28px", 
                      background: "rgba(201,168,76,0.1)", 
                      color: "#C9A84C", 
                      border: "1px solid #C9A84C", 
                      borderRadius: "4px", 
                      fontWeight: "bold", 
                      cursor: (isBroadcasting || submissions.length === 0 || !scheduledDate) ? "not-allowed" : "pointer", 
                      opacity: (isBroadcasting || submissions.length === 0 || !scheduledDate) ? 0.6 : 1,
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}
                  >
                    {isBroadcasting && scheduledDate ? "Scheduling..." : "Schedule Email"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "#122647", padding: "20px", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", borderLeft: "4px solid #C9A84C", borderTop: "1px solid rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#8EA8C3", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Unique Emails</h4>
            <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif" }}>
              {Array.from(new Set(submissions.map(s => s.email).filter(e => e && e.includes('@')))).length}
            </div>
          </div>
          <div style={{ background: "#122647", padding: "20px", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", borderLeft: "4px solid #C9A84C", borderTop: "1px solid rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#8EA8C3", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Checklist Downloads</h4>
            <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif" }}>
              {submissions.filter(s => s.type && s.type.includes('Checklist')).length}
            </div>
          </div>
          <div style={{ background: "#122647", padding: "20px", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", borderLeft: "4px solid #C9A84C", borderTop: "1px solid rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#8EA8C3", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Discovery Calls</h4>
            <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif" }}>
              {submissions.filter(s => s.type && (s.type.includes('Call') || s.type.includes('Lead Capture'))).length}
            </div>
          </div>
          <div style={{ background: "#122647", padding: "20px", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", borderLeft: "4px solid #C9A84C", borderTop: "1px solid rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#8EA8C3", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Interactions</h4>
            <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif" }}>
              {submissions.length}
            </div>
          </div>
        </div>

        {/* Registered Leads Table */}
        <div style={{ background: "#122647", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "30px" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid rgba(201,168,76,0.1)", background: "#0B1D35" }}>
            <h3 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "24px" }}>Registered Leads ({submissions.filter(sub => sub.email && sub.email.includes('@') && sub.name !== 'Anonymous Click').length})</h3>
          </div>
          
          {firebaseError && (
            <div style={{ padding: "20px", backgroundColor: "rgba(198, 40, 40, 0.1)", color: "#e57373", borderBottom: "1px solid rgba(198, 40, 40, 0.2)" }}>
              <strong>Firebase Error:</strong> {firebaseError}
              <br/>
              <span style={{ fontSize: "0.85rem" }}>
                Ensure your <a href="https://console.firebase.google.com/u/0/project/proconix-pmc/firestore/rules" target="_blank" style={{ color: "#ef9a9a", textDecoration: "underline" }}>Firestore Rules</a> allow read/write and that indices are created.
              </span>
            </div>
          )}

          {isLoading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>
              No submissions found yet in <strong>formSubmissions</strong> collection.
              <br/>
              <br/>
              <a href="https://console.firebase.google.com/u/0/project/proconix-pmc/firestore/databases/-default-/data" target="_blank" style={{ color: "#C9A84C", textDecoration: "underline" }}>Check Firestore Console</a>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "rgba(11,29,53,0.5)", color: "#C9A84C", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <th style={{ padding: "15px", fontSize: "0.85rem" }}>Date & Time</th>
                    <th className="hide-on-mobile" style={{ padding: "15px", fontSize: "0.85rem" }}>Type</th>
                    <th style={{ padding: "15px", fontSize: "0.85rem" }}>First Name</th>
                    <th style={{ padding: "15px", fontSize: "0.85rem" }}>Email</th>
                    <th className="hide-on-mobile" style={{ padding: "15px", fontSize: "0.85rem" }}>Country</th>
                    <th className="hide-on-mobile" style={{ padding: "15px", fontSize: "0.85rem" }}>Sector & Budget</th>
                    <th className="hide-on-mobile" style={{ padding: "15px", fontSize: "0.85rem" }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.filter(sub => sub.email && sub.email.includes('@') && sub.name !== 'Anonymous Click').map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: "15px", color: "#8EA8C3", fontSize: "0.9rem" }}>
                        {sub.createdAt ? new Date(sub.createdAt.toDate()).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </td>
                      <td className="hide-on-mobile" style={{ padding: "15px" }}>
                        <span style={{ 
                          background: sub.type === 'Discovery Call Click' ? 'rgba(230, 81, 0, 0.1)' : (sub.type === 'Checklist Download' ? 'rgba(21, 101, 192, 0.1)' : 'rgba(46, 125, 50, 0.1)'), 
                          color: sub.type === 'Discovery Call Click' ? '#ffb74d' : (sub.type === 'Checklist Download' ? '#64b5f6' : '#81c784'), 
                          border: `1px solid ${sub.type === 'Discovery Call Click' ? 'rgba(230, 81, 0, 0.3)' : (sub.type === 'Checklist Download' ? 'rgba(21, 101, 192, 0.3)' : 'rgba(46, 125, 50, 0.3)')}`,
                          padding: "4px 10px", 
                          borderRadius: "12px", 
                          fontSize: "0.75rem", 
                          fontWeight: "bold",
                          letterSpacing: "0.5px"
                        }}>
                          {sub.type}
                        </span>
                      </td>
                      <td style={{ padding: "15px", color: "#FFFFFF", fontWeight: "500" }}>{sub.name ? sub.name.split(' ')[0] : ''}</td>
                      <td style={{ padding: "15px", color: "#C2D4E4" }}><a href={`mailto:${sub.email}`} style={{ color: "#C9A84C", textDecoration: "none" }}>{sub.email}</a></td>
                      <td className="hide-on-mobile" style={{ padding: "15px", color: "#C2D4E4" }}>{sub.country}</td>
                      <td className="hide-on-mobile" style={{ padding: "15px", color: "#C2D4E4" }}>
                        {sub.sector !== 'Not provided' ? sub.sector : ''}
                        {sub.budget !== 'Not provided' ? <span style={{ color: "#8EA8C3" }}> ({sub.budget})</span> : ''}
                      </td>
                      <td className="hide-on-mobile" style={{ padding: "15px", color: "#8EA8C3", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontStyle: "italic" }} title={sub.details}>
                        {sub.details !== 'Not provided' ? sub.details : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Anonymous Interactions Toggle */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button 
            onClick={() => setShowAnonymous(!showAnonymous)}
            style={{ 
              padding: "10px 20px", 
              background: "rgba(11,29,53,0.8)", 
              color: "#C2D4E4", 
              border: "1px solid rgba(201,168,76,0.3)", 
              borderRadius: "50px", 
              cursor: "pointer", 
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = "#C9A84C"; e.currentTarget.style.borderColor = "#C9A84C"; }}
            onMouseOut={(e) => { e.currentTarget.style.color = "#C2D4E4"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
          >
            {showAnonymous ? "Hide Anonymous Interactions" : `Show Anonymous Interactions (${submissions.filter(sub => !sub.email || !sub.email.includes('@') || sub.name === 'Anonymous Click').length})`}
          </button>
        </div>

        {/* Anonymous Interactions Table */}
        {showAnonymous && (
          <div style={{ background: "#122647", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(201,168,76,0.1)", background: "rgba(11,29,53,0.5)" }}>
              <h3 style={{ margin: 0, color: "#8EA8C3", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>Anonymous Interactions</h3>
            </div>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", opacity: 0.8 }}>
                <thead>
                  <tr style={{ background: "rgba(11,29,53,0.3)", color: "#C9A84C", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <th style={{ padding: "12px 15px", fontSize: "0.8rem" }}>Date & Time</th>
                    <th style={{ padding: "12px 15px", fontSize: "0.8rem" }}>Type</th>
                    <th className="hide-on-mobile" style={{ padding: "12px 15px", fontSize: "0.8rem" }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.filter(sub => !sub.email || !sub.email.includes('@') || sub.name === 'Anonymous Click').map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={{ padding: "12px 15px", color: "#8EA8C3", fontSize: "0.85rem" }}>
                        {sub.createdAt ? new Date(sub.createdAt.toDate()).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <span style={{ 
                          background: 'rgba(255, 255, 255, 0.05)', 
                          color: '#C2D4E4', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          padding: "3px 8px", 
                          borderRadius: "12px", 
                          fontSize: "0.7rem", 
                        }}>
                          {sub.type || 'Anonymous Click'}
                        </span>
                      </td>
                      <td style={{ padding: "12px 15px", color: "#8EA8C3", fontSize: "0.85rem", fontStyle: "italic" }}>
                        Unregistered intent
                      </td>
                    </tr>
                  ))}
                  {submissions.filter(sub => !sub.email || !sub.email.includes('@') || sub.name === 'Anonymous Click').length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: "20px", textAlign: "center", color: "#8EA8C3" }}>No anonymous interactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
