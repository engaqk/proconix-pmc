"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, where, onSnapshot, getDocs, deleteDoc, doc, updateDoc, addDoc, limit, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";

function parseDetails(details: string) {
  const data: any = {};
  if (!details || details === "Not provided") return data;
  
  const lines = details.split("\n");
  for (const line of lines) {
    const parts = line.split(": ");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(": ").trim();
      
      if (key === "UTM Source") data.utmSource = val;
      else if (key === "UTM Medium") data.utmMedium = val;
      else if (key === "UTM Campaign") data.utmCampaign = val;
      else if (key === "UTM Content") data.utmContent = val;
      else if (key === "UTM Term") data.utmTerm = val;
      else if (key === "Referrer") data.referrer = val;
      else if (key === "Drip Status") data.dripStatus = val;
      else if (key === "Drip Day") data.dripDay = parseInt(val);
      else if (key === "Drip Scheduled For") data.dripScheduledFor = val;
    }
  }
  return data;
}

export default function LeadsDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [leads, setLeads] = useState<any[]>([]);
  const [drips, setDrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'analytics' | 'submissions' | 'drips' | 'links'>('analytics');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  
  const [isSlackEnabled, setIsSlackEnabled] = useState(false);
  const [isUpdatingSlack, setIsUpdatingSlack] = useState(false);

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

  const handleToggleSlack = async () => {
    setIsUpdatingSlack(true);
    try {
      const snap = await getDocs(
        query(collection(db, "formSubmissions"), where("type", "==", "Settings: LeadsConfig"), limit(1))
      );
      
      const newSlackState = !isSlackEnabled;
      const detailsText = `Slack Enabled: ${newSlackState}`;
      
      if (!snap.empty) {
        // Update existing Settings doc
        await updateDoc(doc(db, "formSubmissions", snap.docs[0].id), {
          details: detailsText,
          createdAt: serverTimestamp()
        });
      } else {
        // Create new Settings doc
        await addDoc(collection(db, "formSubmissions"), {
          name: "System Settings",
          email: "system@proconixpmc.com",
          type: "Settings: LeadsConfig",
          country: "System",
          sector: "System",
          budget: "System",
          details: detailsText,
          createdAt: serverTimestamp()
        });
      }
      setIsSlackEnabled(newSlackState);
    } catch (e: any) {
      alert("Failed to update Slack setting: " + e.message);
    } finally {
      setIsUpdatingSlack(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      setIsLoading(true);
      
      // Fetch all submissions from formSubmissions
      const leadsQuery = query(collection(db, "formSubmissions"), orderBy("createdAt", "desc"));
      const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
        const allData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        
        // Filter only Lead Magnet funnels
        const leadMagnets = allData.filter(item => item.type && item.type.startsWith("Lead Magnet: "));
        const mappedLeads = leadMagnets.map(item => {
          const parsed = parseDetails(item.details || '');
          return {
            ...item,
            slug: item.type.replace("Lead Magnet: ", ""),
            utmSource: parsed.utmSource || null,
            utmMedium: parsed.utmMedium || null,
            utmCampaign: parsed.utmCampaign || null,
            displayDetails: Object.keys(parsed).length > 0 
              ? `Source: ${parsed.utmSource || 'N/A'}, Medium: ${parsed.utmMedium || 'N/A'}, Campaign: ${parsed.utmCampaign || 'N/A'}` 
              : item.details
          };
        });
        
        setLeads(mappedLeads);

        // Map drip workflow states from the same dataset
        const activeDrips = leadMagnets.filter(item => {
          const parsed = parseDetails(item.details || '');
          return parsed.dripStatus;
        });
        
        const mappedDrips = activeDrips.map(item => {
          const parsed = parseDetails(item.details || '');
          return {
            id: item.id,
            email: item.email,
            slug: item.type.replace("Lead Magnet: ", ""),
            currentDay: parsed.dripDay || 0,
            scheduledFor: parsed.dripScheduledFor || null,
            status: parsed.dripStatus
          };
        });
        setDrips(mappedDrips);

        // Check for Slack Settings doc
        const settingsDoc = allData.find(item => item.type === 'Settings: LeadsConfig');
        if (settingsDoc && settingsDoc.details && settingsDoc.details.includes('Slack Enabled: true')) {
          setIsSlackEnabled(true);
        } else {
          setIsSlackEnabled(false);
        }
        
        setIsLoading(false);
        setFirebaseError(null);
      }, (err) => {
        console.error("Error fetching submissions:", err);
        setFirebaseError(err.message);
        setIsLoading(false);
      });

      return () => {
        unsubscribeLeads();
      };
    }
  }, [isAuthorized]);

  const handleClearAllLeads = async () => {
    if (confirm("Are you sure you want to delete ALL captured leads and drip queue records? This action is irreversible.") &&
        confirm("Are you absolutely sure?")) {
      try {
        const leadSnap = await getDocs(collection(db, "formSubmissions"));
        const leadDeletes = leadSnap.docs
          .filter(d => d.data().type && d.data().type.startsWith("Lead Magnet: "))
          .map(d => deleteDoc(doc(db, "formSubmissions", d.id)));

        await Promise.all(leadDeletes);
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
          <button 
            onClick={() => setActiveTab('links')}
            style={{ padding: "10px 20px", background: activeTab === 'links' ? "#C9A84C" : "transparent", color: activeTab === 'links' ? "#0B1D35" : "#FFFFFF", border: "none", borderRadius: "4px 4px 0 0", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s" }}
          >
            🔗 Funnel Share Links
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

            {/* Slack Notifications Settings Card */}
            <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(201,168,76,0.2)", padding: "24px", gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>Notification Settings</h3>
                  <p style={{ margin: 0, color: "#8EA8C3", fontSize: "0.85rem" }}>New leads always trigger an internal email via <strong style={{ color: "#C9A84C" }}>info@proconixpmc.com</strong>. Optionally, also send Slack alerts.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "0.9rem", color: isSlackEnabled ? "#4CAF50" : "#8EA8C3" }}>
                    {isSlackEnabled ? "🟢 Slack Alerts ON" : "⚪ Slack Alerts OFF"}
                  </span>
                  <button
                    onClick={handleToggleSlack}
                    disabled={isUpdatingSlack}
                    style={{
                      padding: "8px 20px",
                      background: isSlackEnabled ? "rgba(229, 115, 115, 0.15)" : "rgba(201,168,76,0.15)",
                      border: `1px solid ${isSlackEnabled ? "rgba(229,115,115,0.4)" : "rgba(201,168,76,0.4)"}`,
                      color: isSlackEnabled ? "#e57373" : "#C9A84C",
                      borderRadius: "4px",
                      cursor: isUpdatingSlack ? "wait" : "pointer",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      opacity: isUpdatingSlack ? 0.6 : 1,
                      transition: "all 0.2s"
                    }}
                  >
                    {isUpdatingSlack ? "Saving..." : isSlackEnabled ? "Disable Slack" : "Enable Slack"}
                  </button>
                </div>
              </div>
            </div>

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
                          {lead.createdAt ? new Date(lead.createdAt.toDate ? lead.createdAt.toDate() : lead.createdAt).toLocaleString() : 'N/A'}
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

        {/* Tab content 4: Funnel Share Links */}
        {activeTab === 'links' && (() => {
          const BASE_URL = 'https://proconixpmc.com';
          const funnels = [
            { slug: 'pre-construction-checklist',   title: 'Pre-Construction Governance Checklist',       icon: '📋' },
            { slug: 'contractor-risk-audit',         title: 'Contractor Risk Audit Guide',                 icon: '🔍' },
            { slug: 'capex-allocation-strategy',     title: 'CAPEX Allocation Strategy Guide',             icon: '💰' },
            { slug: 'epcm-execution-playbook',       title: 'EPCM Execution Playbook',                     icon: '📘' },
            { slug: 'procurement-intelligence',      title: 'Africa Construction Procurement Intelligence', icon: '🌍' },
            { slug: 'hospitality-resort-governance', title: 'Zanzibar & East Africa Resort Governance',    icon: '🏨' },
            { slug: 'cost-control-protocol',         title: 'Variations & Cost Control Protocol',          icon: '📊' },
            { slug: 'capital-project-reporting',     title: 'Board-Level Capital Project Reporting',       icon: '📈' },
            { slug: 'constructability-standards',    title: 'Constructability Review Standards',           icon: '🏗️' },
            { slug: 'delay-avoidance',               title: 'Construction Delay & Dispute Avoidance',      icon: '⚠️' },
          ];

          const handleCopy = (slug: string, url: string) => {
            navigator.clipboard.writeText(url).then(() => {
              setCopiedSlug(slug);
              setTimeout(() => setCopiedSlug(null), 2000);
            });
          };

          return (
            <div style={{ background: '#122647', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(201,168,76,0.1)', background: '#0B1D35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#FFFFFF', fontFamily: "'Cormorant Garamond', serif", fontSize: '20px' }}>Lead Magnet Funnel Share Links</h3>
                  <p style={{ margin: '4px 0 0', color: '#8EA8C3', fontSize: '0.82rem' }}>Copy and share these URLs in email campaigns, LinkedIn posts, WhatsApp, or any marketing channel.</p>
                </div>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {funnels.map((f, i) => {
                  const url = `${BASE_URL}/leads/${f.slug}`;
                  const isCopied = copiedSlug === f.slug;
                  return (
                    <div key={f.slug} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '14px 18px' }}>
                      <span style={{ fontSize: '22px', flexShrink: 0 }}>{f.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                          <span style={{ color: '#C9A84C', marginRight: '8px', fontSize: '0.8rem' }}>#{i + 1}</span>
                          {f.title}
                        </div>
                        <div style={{ color: '#8EA8C3', fontSize: '0.78rem', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {url}
                        </div>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '6px 12px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', borderRadius: '4px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                      >
                        Preview
                      </a>
                      <button
                        onClick={() => handleCopy(f.slug, url)}
                        style={{ padding: '6px 14px', background: isCopied ? 'rgba(46,125,50,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isCopied ? 'rgba(46,125,50,0.4)' : 'rgba(255,255,255,0.12)'}`, color: isCopied ? '#81c784' : '#FFFFFF', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                      >
                        {isCopied ? '✓ Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
