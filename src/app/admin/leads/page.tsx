"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function LeadsDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [leads, setLeads] = useState<any[]>([]);
  const [drips, setDrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'analytics' | 'submissions' | 'drips'>('analytics');

  useEffect(() => {
    const savedLogin = localStorage.getItem("proconix_admin_logged_in");
    if (savedLogin === "true") {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin53") {
      setIsAuthorized(true);
      localStorage.setItem("proconix_admin_logged_in", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      setIsLoading(true);
      
      // Fetch submissions
      const leadsQuery = query(collection(db, "leadSubmissions"), orderBy("submittedAt", "desc"));
      const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeads(data);
        setIsLoading(false);
        setFirebaseError(null);
      }, (err) => {
        console.error("Error fetching submissions:", err);
        setFirebaseError(err.message);
        setIsLoading(false);
      });

      // Fetch drip states
      const dripsQuery = query(collection(db, "leadDripStates"));
      const unsubscribeDrips = onSnapshot(dripsQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDrips(data);
      }, (err) => {
        console.error("Error fetching drip states:", err);
      });

      return () => {
        unsubscribeLeads();
        unsubscribeDrips();
      };
    }
  }, [isAuthorized]);

  const handleClearAllLeads = async () => {
    if (confirm("Are you sure you want to delete ALL captured leads and drip queue records? This action is irreversible.") &&
        confirm("Are you absolutely sure?")) {
      try {
        const leadSnap = await getDocs(collection(db, "leadSubmissions"));
        const leadDeletes = leadSnap.docs.map(d => deleteDoc(doc(db, "leadSubmissions", d.id)));

        const dripSnap = await getDocs(collection(db, "leadDripStates"));
        const dripDeletes = dripSnap.docs.map(d => deleteDoc(doc(db, "leadDripStates", d.id)));

        await Promise.all([...leadDeletes, ...dripDeletes]);
        alert("All lead records have been successfully cleared.");
      } catch (e: any) {
        alert("Failed to clear records: " + e.message);
      }
    }
  };

  const handleBackToMainDashboard = () => {
    window.location.href = "/admin";
  };

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#0B1D35", color: "#F7F8FA" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "12px", border: "1px solid rgba(201,168,76,0.3)", maxWidth: "400px", width: "100%" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#C9A84C" }}>PROCONIX LEADS</h2>
          {loginError && <p style={{ color: "#ff6b6b", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{loginError}</p>}
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

  // Aggregate channel metrics
  const utmSources = leads.reduce((acc: any, lead) => {
    const src = lead.utmSource || "Direct / Referral";
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});

  const utmMediums = leads.reduce((acc: any, lead) => {
    const med = lead.utmMedium || "None";
    acc[med] = (acc[med] || 0) + 1;
    return acc;
  }, {});

  const slugStats = leads.reduce((acc: any, lead) => {
    const slug = lead.slug || "unknown";
    acc[slug] = (acc[slug] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#07142A", padding: "40px 20px", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", color: "#FFFFFF" }}>
              LEAD FUNNEL <span style={{ color: "#C9A84C" }}>OPERATIONS</span>
            </h1>
            <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#8EA8C3" }}>Multi-funnel capture analytics & follow-up drip flows</p>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <button 
              onClick={handleBackToMainDashboard} 
              style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#FFFFFF", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
              Main Dashboard
            </button>
            <button 
              onClick={handleClearAllLeads} 
              style={{ padding: "8px 16px", background: "rgba(229, 115, 115, 0.1)", border: "1px solid rgba(229, 115, 115, 0.3)", color: "#e57373", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
              Clear Leads Data
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>
          <button 
            onClick={() => setActiveTab('analytics')}
            style={{ padding: "10px 20px", background: activeTab === 'analytics' ? "#C9A84C" : "transparent", color: activeTab === 'analytics' ? "#0B1D35" : "#FFFFFF", border: "none", borderRadius: "4px 4px 0 0", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s" }}
          >
            Attribution Analytics
          </button>
          <button 
            onClick={() => setActiveTab('submissions')}
            style={{ padding: "10px 20px", background: activeTab === 'submissions' ? "#C9A84C" : "transparent", color: activeTab === 'submissions' ? "#0B1D35" : "#FFFFFF", border: "none", borderRadius: "4px 4px 0 0", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s" }}
          >
            Submissions Log ({leads.length})
          </button>
          <button 
            onClick={() => setActiveTab('drips')}
            style={{ padding: "10px 20px", background: activeTab === 'drips' ? "#C9A84C" : "transparent", color: activeTab === 'drips' ? "#0B1D35" : "#FFFFFF", border: "none", borderRadius: "4px 4px 0 0", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s" }}
          >
            Drip Queue Active Channels ({drips.filter(d => d.status === 'active').length})
          </button>
        </div>

        {firebaseError && (
          <div style={{ padding: "15px", backgroundColor: "rgba(198, 40, 40, 0.15)", border: "1px solid rgba(198, 40, 40, 0.3)", color: "#e57373", borderRadius: "4px", marginBottom: "20px" }}>
            <strong>Firebase Error:</strong> {firebaseError}
          </div>
        )}

        {/* Tab content 1: Analytics */}
        {activeTab === 'analytics' && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
            
            {/* Traffic Channel Sources */}
            <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
              <h3 style={{ margin: "0 0 20px 0", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>Marketing Channels (UTM Source)</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {Object.entries(utmSources).map(([src, count]: any) => (
                  <div key={src} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px" }}>
                    <span style={{ color: "#C2D4E4", fontSize: "0.9rem" }}>{src}</span>
                    <span style={{ color: "#FFFFFF", fontWeight: "bold" }}>{count} lead(s)</span>
                  </div>
                ))}
                {Object.keys(utmSources).length === 0 && (
                  <p style={{ color: "#8EA8C3", fontSize: "0.9rem", textAlign: "center", margin: "20px 0" }}>No traffic channels recorded yet.</p>
                )}
              </div>
            </div>

            {/* Traffic Mediums */}
            <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
              <h3 style={{ margin: "0 0 20px 0", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>Traffic Mediums (UTM Medium)</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {Object.entries(utmMediums).map(([med, count]: any) => (
                  <div key={med} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px" }}>
                    <span style={{ color: "#C2D4E4", fontSize: "0.9rem" }}>{med}</span>
                    <span style={{ color: "#FFFFFF", fontWeight: "bold" }}>{count} lead(s)</span>
                  </div>
                ))}
                {Object.keys(utmMediums).length === 0 && (
                  <p style={{ color: "#8EA8C3", fontSize: "0.9rem", textAlign: "center", margin: "20px 0" }}>No traffic mediums recorded yet.</p>
                )}
              </div>
            </div>

            {/* Leads per Lead Magnet Slug */}
            <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
              <h3 style={{ margin: "0 0 20px 0", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>Funnel Performance (Conversions)</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {Object.entries(slugStats).map(([slugName, count]: any) => (
                  <div key={slugName} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px" }}>
                    <span style={{ color: "#C2D4E4", fontSize: "0.9rem" }}>{slugName}</span>
                    <span style={{ color: "#FFFFFF", fontWeight: "bold" }}>{count} download(s)</span>
                  </div>
                ))}
                {Object.keys(slugStats).length === 0 && (
                  <p style={{ color: "#8EA8C3", fontSize: "0.9rem", textAlign: "center", margin: "20px 0" }}>No asset downloads recorded yet.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Tab content 2: Submissions Log */}
        {activeTab === 'submissions' && (
          <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(201,168,76,0.1)", background: "#0B1D35" }}>
              <h3 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>Lead Submissions Stream</h3>
            </div>
            
            {isLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>Loading submissions...</div>
            ) : leads.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>No lead submissions recorded yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "rgba(11,29,53,0.5)", color: "#C9A84C", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px" }}>
                      <th style={{ padding: "15px" }}>Date & Time</th>
                      <th style={{ padding: "15px" }}>Email Address</th>
                      <th style={{ padding: "15px" }}>Funnel / Slug</th>
                      <th style={{ padding: "15px" }}>Attribution Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.9rem" }}>
                        <td style={{ padding: "15px", color: "#8EA8C3" }}>
                          {lead.submittedAt ? new Date(lead.submittedAt).toLocaleString() : 'N/A'}
                        </td>
                        <td style={{ padding: "15px", color: "#FFFFFF", fontWeight: "bold" }}>{lead.email}</td>
                        <td style={{ padding: "15px", color: "#C9A84C" }}>{lead.slug}</td>
                        <td style={{ padding: "15px", color: "#C2D4E4" }}>
                          {lead.utmSource ? (
                            <span style={{ fontSize: "0.8rem" }}>
                              Source: <strong>{lead.utmSource}</strong> | Medium: <strong>{lead.utmMedium || 'N/A'}</strong> | Campaign: <strong>{lead.utmCampaign || 'N/A'}</strong>
                            </span>
                          ) : (
                            <span style={{ color: "#8EA8C3", fontStyle: "italic", fontSize: "0.8rem" }}>Direct/Organic Referral</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab content 3: Drip States */}
        {activeTab === 'drips' && (
          <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(201,168,76,0.1)", background: "#0B1D35" }}>
              <h3 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>Drip Sequence Campaign Queue</h3>
            </div>
            
            {drips.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>No drip sequences initialized yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "rgba(11,29,53,0.5)", color: "#C9A84C", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px" }}>
                      <th style={{ padding: "15px" }}>Email</th>
                      <th style={{ padding: "15px" }}>Funnel / Slug</th>
                      <th style={{ padding: "15px" }}>Drip Progress</th>
                      <th style={{ padding: "15px" }}>Next Scheduled Dispatch</th>
                      <th style={{ padding: "15px" }}>Workflow Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drips.map((drip) => (
                      <tr key={drip.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.9rem" }}>
                        <td style={{ padding: "15px", color: "#FFFFFF" }}>{drip.email}</td>
                        <td style={{ padding: "15px", color: "#C9A84C" }}>{drip.slug}</td>
                        <td style={{ padding: "15px", color: "#C2D4E4" }}>
                          Day {drip.currentDay} of 4
                        </td>
                        <td style={{ padding: "15px", color: "#8EA8C3" }}>
                          {drip.scheduledFor ? new Date(drip.scheduledFor).toLocaleString() : 'Completed'}
                        </td>
                        <td style={{ padding: "15px" }}>
                          <span style={{ 
                            background: drip.status === 'active' ? 'rgba(46, 125, 50, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                            color: drip.status === 'active' ? '#81c784' : '#8EA8C3',
                            border: `1px solid ${drip.status === 'active' ? 'rgba(46, 125, 50, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                            padding: "3px 10px", 
                            borderRadius: "12px", 
                            fontSize: "0.75rem", 
                            fontWeight: "bold",
                            textTransform: "uppercase" 
                          }}>
                            {drip.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
