"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const AUTH = "Bearer admin53";

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    active:     { bg: "rgba(46,125,50,0.15)",   color: "#81c784", border: "rgba(46,125,50,0.3)"   },
    completed:  { bg: "rgba(25,118,210,0.15)",  color: "#64b5f6", border: "rgba(25,118,210,0.3)"  },
    paused:     { bg: "rgba(245,127,23,0.15)",  color: "#ffb74d", border: "rgba(245,127,23,0.3)"  },
    duplicate:  { bg: "rgba(255,255,255,0.05)", color: "#8EA8C3", border: "rgba(255,255,255,0.1)"  },
    failed:     { bg: "rgba(198,40,40,0.15)",   color: "#e57373", border: "rgba(198,40,40,0.3)"   },
  };
  const s = colors[status] || colors.duplicate;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: "3px 10px", borderRadius: "12px", fontSize: "0.72rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
      {status}
    </span>
  );
}

// ── Open tracking dots ────────────────────────────────────────────────────────
function OpenDots({ opens, sentHistory }: { opens: any[]; sentHistory: any[] }) {
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {[1, 2, 3, 4].map(day => {
        const sent = sentHistory?.find((s: any) => s.day === day);
        const opened = opens?.find((o: any) => o.day === day);
        if (!sent) return (
          <div key={day} title={`Day ${day}: Not yet sent`}
            style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#4a6a8a" }}>
            {day}
          </div>
        );
        return (
          <div key={day} title={opened ? `Day ${day}: Opened ${new Date(opened.openedAt).toLocaleString()}` : `Day ${day}: Sent, not opened`}
            style={{ width: "26px", height: "26px", borderRadius: "50%", background: opened ? "rgba(46,125,50,0.2)" : "rgba(201,168,76,0.1)", border: `1px solid ${opened ? "rgba(46,125,50,0.5)" : "rgba(201,168,76,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: opened ? "#81c784" : "#C9A84C", cursor: "help" }}>
            {opened ? "✓" : day}
          </div>
        );
      })}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function LeadsDashboard() {
  const [isAuthorized, setIsAuthorized]   = useState(false);
  const [username, setUsername]           = useState("");
  const [password, setPassword]           = useState("");
  const [loginError, setLoginError]       = useState("");

  const [leads, setLeads]                 = useState<any[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [activeTab, setActiveTab]         = useState<"analytics" | "submissions" | "drips" | "links">("analytics");
  const [copiedSlug, setCopiedSlug]       = useState<string | null>(null);

  // PDF Upload states
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({}); // session status
  const [pdfStatuses, setPdfStatuses] = useState<Record<string, { filename: string; sizeKb: number; uploadedAt: string }>>({});

  // Settings state
  const [dripEnabled, setDripEnabled]     = useState(true);
  const [dripHour, setDripHour]           = useState(-1);
  const [slackEnabled, setSlackEnabled]   = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Drip run state
  const [isRunningDrip, setIsRunningDrip] = useState(false);
  const [dripRunLog, setDripRunLog]       = useState<string[] | null>(null);

  // Email template state
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSavingTemplates, setIsSavingTemplates] = useState(false);
  const [templatesSaved, setTemplatesSaved] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<Record<string, string>>({});
  const [templateSlug, setTemplateSlug] = useState('pre-construction-checklist');

  // Custom slug states
  const [customSlugs, setCustomSlugs]       = useState<Record<string, string>>({});
  const [editingSlugKey, setEditingSlugKey] = useState<string | null>(null);
  const [editingSlugVal, setEditingSlugVal] = useState("");
  const [isSavingSlug, setIsSavingSlug]     = useState(false);
  const [selectedFunnelSlug, setSelectedFunnelSlug] = useState<string | null>(null);

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem("proconix_admin_logged_in") === "true") setIsAuthorized(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin53") {
      setIsAuthorized(true);
      localStorage.setItem("proconix_admin_logged_in", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid credentials.");
    }
  };

  // ── Load settings ─────────────────────────────────────────────────────────
  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/leads/settings", { headers: { Authorization: AUTH } });
      if (res.ok) {
        const s = await res.json();
        setDripEnabled(s.dripEnabled ?? true);
        setDripHour(s.dripHour ?? -1);
        setSlackEnabled(s.slackEnabled ?? false);
      }
    } catch {}
  }, []);

  // ── Save settings ─────────────────────────────────────────────────────────
  const saveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await fetch("/api/leads/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: AUTH },
        body: JSON.stringify({ dripEnabled, dripHour, slackEnabled }),
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch (e: any) {
      alert("Save failed: " + e.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // ── Run drip now ──────────────────────────────────────────────────────────
  const runDripNow = async () => {
    setIsRunningDrip(true);
    setDripRunLog(null);
    try {
      const res = await fetch("/api/cron/drip", {
        method: "POST",
        headers: { Authorization: AUTH },
      });
      const data = await res.json();
      setDripRunLog(data.logs || ["No logs returned"]);
    } catch (e: any) {
      setDripRunLog(["ERROR: " + e.message]);
    } finally {
      setIsRunningDrip(false);
    }
  };

  // ── Load persistent PDF statuses from Firestore ──────────────────────────
  const loadPdfStatuses = async (slugList: string[]) => {
    const statuses: Record<string, { filename: string; sizeKb: number; uploadedAt: string }> = {};
    await Promise.all(slugList.map(async (slug) => {
      try {
        const snap = await getDoc(doc(db, 'leadPdfs', slug));
        if (snap.exists()) {
          const d = snap.data();
          statuses[slug] = {
            filename: d.filename || `${slug}.pdf`,
            sizeKb: Math.round((d.sizeBytes || 0) / 1024),
            uploadedAt: d.uploadedAt?.toDate ? new Date(d.uploadedAt.toDate()).toLocaleDateString() : '',
          };
        }
      } catch {}
    }));
    setPdfStatuses(prev => ({ ...prev, ...statuses }));
  };

  // ── Upload PDF ────────────────────────────────────────────────────────────
  const handleFileUpload = async (slug: string, file: File) => {
    if (!file) return;
    setUploadingSlug(slug);
    setUploadStatus(prev => ({ ...prev, [slug]: "⏳ Uploading..." }));
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", slug);

    try {
      const res = await fetch("/api/admin/leads/upload", {
        method: "POST",
        headers: { Authorization: AUTH },
        body: formData,
      });
      const d = await res.json();
      if (res.ok) {
        setUploadStatus(prev => ({ ...prev, [slug]: `✓ Saved (${d.sizeKb}KB)` }));
        // Refresh persistent status from Firestore
        await loadPdfStatuses([slug]);
      } else {
        setUploadStatus(prev => ({ ...prev, [slug]: `✗ ${d.error}` }));
      }
    } catch {
      setUploadStatus(prev => ({ ...prev, [slug]: "✗ Connection error" }));
    } finally {
      setUploadingSlug(null);
    }
  };

  const loadCustomSlugs = useCallback(async () => {
    try {
      const { getDocs, collection } = await import('firebase/firestore');
      const snap = await getDocs(collection(db, 'leadSlugs'));
      const mapping: Record<string, string> = {};
      snap.forEach(d => {
        mapping[d.id] = d.data().customSlug || "";
      });
      setCustomSlugs(mapping);
    } catch (err) {
      console.error("Error loading custom slugs:", err);
    }
  }, []);

  // ── Firestore listener ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthorized) return;
    loadSettings();
    loadCustomSlugs();
    // Load persistent PDF upload statuses
    const allSlugs = ["pre-construction-checklist","contractor-risk-audit","capex-allocation-strategy","epcm-execution-playbook","procurement-intelligence","hospitality-resort-governance","cost-control-protocol","capital-project-reporting","constructability-standards","delay-avoidance"];
    loadPdfStatuses(allSlugs);
    setIsLoading(true);
    const q = query(collection(db, "leadSubmissions"), orderBy("capturedAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
      setFirebaseError(null);
    }, err => {
      setFirebaseError(err.message);
      setIsLoading(false);
    });
    return () => unsub();
  }, [isAuthorized, loadSettings, loadCustomSlugs]);

  // ── Load email templates from Firestore ────────────────────────────────────
  useEffect(() => {
    if (!isAuthorized || (activeTab !== "links" && activeTab !== "analytics") || !templateSlug) return;
    
    const fetchTemplate = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'leadEmailTemplates', templateSlug));
        if (snap.exists()) {
          const d = snap.data();
          setEmailTemplates({
            day1_subject: d.day1?.subject || '',
            day1_body: d.day1?.body || '',
            day2_subject: d.day2?.subject || '',
            day2_body: d.day2?.body || '',
            day3_subject: d.day3?.subject || '',
            day3_body: d.day3?.body || '',
            day4_subject: d.day4?.subject || '',
            day4_body: d.day4?.body || '',
          });
        } else {
          setEmailTemplates({});
        }
      } catch (err) {
        console.error("Failed to load email templates:", err);
      }
    };
    
    fetchTemplate();
  }, [isAuthorized, activeTab, templateSlug]);

  // ── Delete all ────────────────────────────────────────────────────────────
  const handleClearAll = async () => {
    if (!confirm("Delete ALL lead magnet captures? This cannot be undone.")) return;
    if (!confirm("Final confirmation — are you sure?")) return;
    try {
      await Promise.all(leads.map(l => deleteDoc(doc(db, "leadSubmissions", l.id))));
      alert("All lead records cleared.");
    } catch (e: any) {
      alert("Failed: " + e.message);
    }
  };

  // ── Aggregate stats ───────────────────────────────────────────────────────
  const totalLeads    = leads.length;
  const activeLeads   = leads.filter(l => l.dripStatus === "active").length;
  const completedLeads= leads.filter(l => l.dripStatus === "completed").length;
  const openedAny     = leads.filter(l => (l.emailOpens || []).length > 0).length;
  const openRate      = totalLeads > 0 ? Math.round((openedAny / totalLeads) * 100) : 0;

  const bySlug = leads.reduce((a: any, l) => { a[l.slug] = (a[l.slug] || 0) + 1; return a; }, {});
  const bySource = leads.reduce((a: any, l) => { const s = l.utmSource || "Direct"; a[s] = (a[s] || 0) + 1; return a; }, {});

  // PDF Downloads high overview calculations
  const totalDownloads = leads.reduce((sum, l) => sum + (l.linkClicks || 0), 0);
  const downloadedLeads = leads.filter(l => l.linkClicks > 0 && l.linkClickedAt);
  const latestDownloadedLead = downloadedLeads.length > 0
    ? downloadedLeads.reduce((latest, current) => {
        return new Date(current.linkClickedAt).getTime() > new Date(latest.linkClickedAt).getTime() ? current : latest;
      }, downloadedLeads[0])
    : null;
  const latestDownloadText = latestDownloadedLead
    ? `Latest: ${(latestDownloadedLead.slug || "").replace(/-/g, " ")} (${new Date(latestDownloadedLead.linkClickedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
    : "Latest: No downloads yet";

  // ── Funnels list ──────────────────────────────────────────────────────────
  const funnels = [
    { slug: "pre-construction-checklist",   title: "Pre-Construction Governance Checklist",         icon: "📋" },
    { slug: "contractor-risk-audit",         title: "Contractor Risk Audit Guide",                   icon: "🔍" },
    { slug: "capex-allocation-strategy",     title: "CAPEX Allocation Strategy Guide",               icon: "💰" },
    { slug: "epcm-execution-playbook",       title: "EPCM Execution Playbook",                       icon: "📘" },
    { slug: "procurement-intelligence",      title: "Africa Construction Procurement Intelligence",  icon: "🌍" },
    { slug: "hospitality-resort-governance", title: "Zanzibar & East Africa Resort Governance",      icon: "🏨" },
    { slug: "cost-control-protocol",         title: "Variations & Cost Control Protocol",            icon: "📊" },
    { slug: "capital-project-reporting",     title: "Board-Level Capital Project Reporting",         icon: "📈" },
    { slug: "constructability-standards",    title: "Constructability Review Standards",             icon: "🏗️" },
    { slug: "delay-avoidance",               title: "Construction Delay & Dispute Avoidance",        icon: "⚠️" },
  ];

  const BASE_URL = "https://proconixpmc.com";
  const FUNNEL_PATH = "/r"; // non-descriptive path — doesn't expose lead intent

  const tabBtn = (id: typeof activeTab, label: string) => (
    <button onClick={() => setActiveTab(id)}
      style={{ padding: "10px 20px", background: activeTab === id ? "#C9A84C" : "transparent", color: activeTab === id ? "#0B1D35" : "#FFFFFF", border: "none", borderRadius: "4px 4px 0 0", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem", transition: "all 0.2s" }}>
      {label}
    </button>
  );

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#0B1D35" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "12px", border: "1px solid rgba(201,168,76,0.3)", maxWidth: "400px", width: "100%" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif" }}>LEADS ADMIN</h2>
          {loginError && <p style={{ color: "#ff6b6b", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{loginError}</p>}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
              style={{ padding: "12px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff" }} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              style={{ padding: "12px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff" }} required />
            <button type="submit" style={{ padding: "12px", background: "#C9A84C", color: "#0B1D35", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#07142A", padding: "40px 20px", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: "32px" }}>
              LEAD MAGNET <span style={{ color: "#C9A84C" }}>MANAGEMENT</span>
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#8EA8C3" }}>
              Dedicated lead capture, drip automation & email tracking — separate from main admin
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="/admin" style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#FFFFFF", borderRadius: "4px", textDecoration: "none", fontWeight: "bold", fontSize: "0.85rem" }}>
              ← Main Admin
            </a>
            <button onClick={handleClearAll}
              style={{ padding: "8px 16px", background: "rgba(229,115,115,0.1)", border: "1px solid rgba(229,115,115,0.3)", color: "#e57373", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem" }}>
              Clear All Leads
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px" }}>
          {[
            { label: "Total Captures", value: totalLeads, subtext: "All-time form submissions", color: "#FFFFFF" },
            { label: "Total Downloads", value: totalDownloads, subtext: latestDownloadText, color: "#81c784" },
            { label: "Drip Active / Done", value: `${activeLeads} / ${completedLeads}`, subtext: "Leads currently in queue", color: "#64b5f6" },
            { label: "Email Open Rate", value: `${openRate}%`, subtext: "Drip open metrics", color: "#C9A84C" },
          ].map(s => (
            <div key={s.label} style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: s.color, fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                <div style={{ fontSize: "0.8rem", color: "#8EA8C3", marginTop: "4px" }}>{s.label}</div>
              </div>
              <div style={{ fontSize: "0.72rem", color: "#4a6a8a", marginTop: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={s.subtext}>{s.subtext}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0", flexWrap: "wrap" }}>
          {tabBtn("links",       "🔗 Share Leads Link")}
          {tabBtn("submissions", `📋 Leads Captured (${totalLeads})`)} 
          {tabBtn("analytics",   "⚙️ Cron Settings")}
          {tabBtn("drips",       `📧 Email Queue (${activeLeads} active)`)}
        </div>

        {firebaseError && (
          <div style={{ padding: "15px", backgroundColor: "rgba(198,40,40,0.15)", border: "1px solid rgba(198,40,40,0.3)", color: "#e57373", borderRadius: "4px", marginBottom: "20px" }}>
            <strong>Firebase:</strong> {firebaseError} — Check Firestore security rules for <code>leadSubmissions</code> & <code>leadSettings</code>.
          </div>
        )}

        {/* ── TAB: Analytics & Settings ── */}
        {activeTab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Drip Settings Card */}
            <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(201,168,76,0.2)", padding: "28px" }}>
              <h3 style={{ margin: "0 0 20px", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>⚙️ Cron & Drip Settings</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "24px" }}>

                {/* Drip toggle */}
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "18px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "0.85rem", color: "#8EA8C3", marginBottom: "10px" }}>Recurring Drip (4 days after capture)</div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => setDripEnabled(true)}
                      style={{ flex: 1, padding: "10px", background: dripEnabled ? "rgba(46,125,50,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${dripEnabled ? "rgba(46,125,50,0.5)" : "rgba(255,255,255,0.1)"}`, color: dripEnabled ? "#81c784" : "#8EA8C3", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.83rem" }}>
                      🟢 Enabled
                    </button>
                    <button onClick={() => setDripEnabled(false)}
                      style={{ flex: 1, padding: "10px", background: !dripEnabled ? "rgba(198,40,40,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${!dripEnabled ? "rgba(198,40,40,0.5)" : "rgba(255,255,255,0.1)"}`, color: !dripEnabled ? "#e57373" : "#8EA8C3", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.83rem" }}>
                      ⚫ Paused
                    </button>
                  </div>
                </div>

                {/* Send hour */}
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "18px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "0.85rem", color: "#8EA8C3", marginBottom: "10px" }}>Daily Send Hour (UTC, -1 = same as capture time)</div>
                  <select value={dripHour} onChange={e => setDripHour(parseInt(e.target.value))}
                    style={{ width: "100%", padding: "10px", background: "#0B1D35", border: "1px solid rgba(201,168,76,0.3)", color: "#FFFFFF", borderRadius: "4px", fontSize: "0.9rem" }}>
                    <option value={-1}>Same time as capture (±1h)</option>
                    {Array.from({ length: 24 }, (_, i) => {
                      const localDate = new Date();
                      localDate.setUTCHours(i, 0, 0, 0);
                      const localStr = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const utcLabel = i < 12 ? `${i === 0 ? 12 : i}am` : `${i === 12 ? 12 : i - 12}pm`;
                      return (
                        <option key={i} value={i}>
                          {String(i).padStart(2, "0")}:00 UTC ({utcLabel}) — {localStr} Local
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Slack toggle */}
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "18px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "0.85rem", color: "#8EA8C3", marginBottom: "10px" }}>Slack Notifications (requires webhook URL in env)</div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => setSlackEnabled(true)}
                      style={{ flex: 1, padding: "10px", background: slackEnabled ? "rgba(46,125,50,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${slackEnabled ? "rgba(46,125,50,0.5)" : "rgba(255,255,255,0.1)"}`, color: slackEnabled ? "#81c784" : "#8EA8C3", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.83rem" }}>
                      🔔 ON
                    </button>
                    <button onClick={() => setSlackEnabled(false)}
                      style={{ flex: 1, padding: "10px", background: !slackEnabled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${!slackEnabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`, color: !slackEnabled ? "#FFFFFF" : "#8EA8C3", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.83rem" }}>
                      🔕 OFF
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={saveSettings} disabled={isSavingSettings}
                  style={{ padding: "10px 28px", background: settingsSaved ? "rgba(46,125,50,0.3)" : "#C9A84C", color: settingsSaved ? "#81c784" : "#0B1D35", border: `1px solid ${settingsSaved ? "rgba(46,125,50,0.5)" : "transparent"}`, borderRadius: "4px", cursor: isSavingSettings ? "wait" : "pointer", fontWeight: "bold", fontSize: "0.85rem", transition: "all 0.2s" }}>
                  {isSavingSettings ? "Saving..." : settingsSaved ? "✓ Saved!" : "Save Settings"}
                </button>
                <button onClick={() => setShowTemplates(v => !v)}
                  style={{ padding: "10px 24px", background: showTemplates ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${showTemplates ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.15)"}`, color: showTemplates ? "#C9A84C" : "#FFFFFF", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem", transition: "all 0.2s" }}>
                  ✉️ Configure Email Templates {showTemplates ? "▲" : "▼"}
                </button>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#8EA8C3" }}>
                  Cron runs daily at midnight UTC. Drip fires at the scheduled time for each lead.
                </p>
              </div>

              {/* Email Template Editor */}
              {showTemplates && (
                <div style={{ marginTop: "28px", borderTop: "1px solid rgba(201,168,76,0.12)", paddingTop: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                    <h4 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>✉️ Drip Email Templates</h4>
                    <select value={templateSlug} onChange={e => { setTemplateSlug(e.target.value); setEmailTemplates({}); }}
                      style={{ padding: "8px 14px", background: "#0B1D35", border: "1px solid rgba(201,168,76,0.3)", color: "#FFFFFF", borderRadius: "4px", fontSize: "0.82rem" }}>
                      {["pre-construction-checklist","contractor-risk-audit","capex-allocation-strategy","epcm-execution-playbook","procurement-intelligence","hospitality-resort-governance","cost-control-protocol","capital-project-reporting","constructability-standards","delay-avoidance"].map(s => (
                        <option key={s} value={s}>{s.replace(/-/g, " ")}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[1,2,3,4].map(day => (
                      <div key={day} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "18px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: "0.8rem", color: "#C9A84C", fontWeight: "bold", letterSpacing: "1px", marginBottom: "12px", textTransform: "uppercase" }}>Day {day} Email</div>
                        <input
                          placeholder={`Day ${day} subject line…`}
                          value={emailTemplates[`day${day}_subject`] ?? ""}
                          onChange={e => setEmailTemplates(prev => ({ ...prev, [`day${day}_subject`]: e.target.value }))}
                          style={{ width: "100%", padding: "9px 12px", background: "#0B1D35", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "10px", outline: "none" }}
                        />
                        <textarea
                          placeholder={`Day ${day} email body HTML…`}
                          value={emailTemplates[`day${day}_body`] ?? ""}
                          onChange={e => setEmailTemplates(prev => ({ ...prev, [`day${day}_body`]: e.target.value }))}
                          rows={4}
                          style={{ width: "100%", padding: "9px 12px", background: "#0B1D35", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF", borderRadius: "4px", fontSize: "0.82rem", resize: "vertical", outline: "none", fontFamily: "monospace", lineHeight: "1.5" }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
                    <button
                      disabled={isSavingTemplates}
                      onClick={async () => {
                        setIsSavingTemplates(true);
                        try {
                          const { doc, setDoc } = await import('firebase/firestore');
                          await setDoc(doc(db, 'leadEmailTemplates', templateSlug), {
                            slug: templateSlug,
                            day1: { subject: emailTemplates['day1_subject'] || '', body: emailTemplates['day1_body'] || '' },
                            day2: { subject: emailTemplates['day2_subject'] || '', body: emailTemplates['day2_body'] || '' },
                            day3: { subject: emailTemplates['day3_subject'] || '', body: emailTemplates['day3_body'] || '' },
                            day4: { subject: emailTemplates['day4_subject'] || '', body: emailTemplates['day4_body'] || '' },
                            updatedAt: new Date().toISOString(),
                          });
                          setTemplatesSaved(true);
                          setTimeout(() => setTemplatesSaved(false), 3000);
                        } catch (err: any) {
                          alert('Save failed: ' + err.message);
                        } finally {
                          setIsSavingTemplates(false);
                        }
                      }}
                      style={{ padding: "10px 28px", background: templatesSaved ? "rgba(46,125,50,0.3)" : "#C9A84C", color: templatesSaved ? "#81c784" : "#0B1D35", border: `1px solid ${templatesSaved ? "rgba(46,125,50,0.5)" : "transparent"}`, borderRadius: "4px", cursor: isSavingTemplates ? "wait" : "pointer", fontWeight: "bold", fontSize: "0.85rem", transition: "all 0.2s" }}>
                      {isSavingTemplates ? "Saving..." : templatesSaved ? "✓ Templates Saved!" : "Save Templates"}
                    </button>
                    <span style={{ fontSize: "0.75rem", color: "#4a6a8a" }}>Templates saved here will override the default hardcoded templates for this funnel.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Run Drip Now */}
            <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: dripRunLog ? "20px" : "0" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>🚀 Manual Drip Trigger</h3>
                  <p style={{ margin: 0, color: "#8EA8C3", fontSize: "0.82rem" }}>Run the drip processor immediately — sends all due emails regardless of scheduled time.</p>
                </div>
                <button onClick={runDripNow} disabled={isRunningDrip}
                  style={{ padding: "10px 24px", background: isRunningDrip ? "rgba(255,255,255,0.05)" : "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", color: isRunningDrip ? "#8EA8C3" : "#C9A84C", borderRadius: "4px", cursor: isRunningDrip ? "wait" : "pointer", fontWeight: "bold", fontSize: "0.85rem" }}>
                  {isRunningDrip ? "⏳ Running..." : "Run Drip Now"}
                </button>
              </div>
              {dripRunLog && (
                <div style={{ background: "#0B1D35", borderRadius: "6px", padding: "16px", fontFamily: "monospace", fontSize: "0.78rem", color: "#8EA8C3", lineHeight: "1.8", maxHeight: "220px", overflowY: "auto" }}>
                  {dripRunLog.map((line, i) => (
                    <div key={i} style={{ color: line.includes("✓") ? "#81c784" : line.includes("✗") || line.includes("ERROR") ? "#e57373" : line.includes("WARN") ? "#ffb74d" : "#8EA8C3" }}>
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>By Funnel</h3>
                {Object.keys(bySlug).length === 0 ? <p style={{ color: "#8EA8C3", fontSize: "0.85rem" }}>No data yet</p> :
                  Object.entries(bySlug).sort((a: any, b: any) => b[1] - a[1]).map(([slug, cnt]: any) => (
                    <div key={slug} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: "0.82rem" }}>
                      <span style={{ color: "#C2D4E4" }}>{slug.replace(/-/g, " ")}</span>
                      <span style={{ color: "#FFFFFF", fontWeight: "bold" }}>{cnt}</span>
                    </div>
                  ))}
              </div>
              <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>By Source</h3>
                {Object.keys(bySource).length === 0 ? <p style={{ color: "#8EA8C3", fontSize: "0.85rem" }}>No data yet</p> :
                  Object.entries(bySource).sort((a: any, b: any) => b[1] - a[1]).map(([src, cnt]: any) => (
                    <div key={src} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: "0.82rem" }}>
                      <span style={{ color: "#C2D4E4" }}>{src}</span>
                      <span style={{ color: "#FFFFFF", fontWeight: "bold" }}>{cnt}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Submissions ── */}
        {activeTab === "submissions" && (() => {
          const downloadTimeline = leads
            .filter(l => l.linkClicks > 0 && l.linkClickedAt)
            .flatMap(l => {
              if (l.linkClickHistory && l.linkClickHistory.length > 0) {
                return l.linkClickHistory.map((t: string) => ({
                  id: `${l.id}-${t}`,
                  name: l.name || "Lead Magnet User",
                  email: l.email,
                  slug: l.slug,
                  timestamp: t
                }));
              }
              return [{
                id: l.id,
                name: l.name || "Lead Magnet User",
                email: l.email,
                slug: l.slug,
                timestamp: l.linkClickedAt
              }];
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5);

          const slugStats = funnels.map(f => {
            const matchingLeads = leads.filter(l => l.slug === f.slug && l.linkClicks > 0);
            const totalDownloads = matchingLeads.reduce((sum, l) => sum + (l.linkClicks || 0), 0);
            const clickTimes = matchingLeads
              .map(l => l.linkClickedAt)
              .filter(Boolean)
              .map(t => new Date(t).getTime());
            const lastDownloadedAt = clickTimes.length > 0 
              ? new Date(Math.max(...clickTimes)).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
              : "Never";

            return {
              ...f,
              totalDownloads,
              lastDownloadedAt
            };
          });

          const maxDownloads = Math.max(...slugStats.map(s => s.totalDownloads), 1);

          return (
            <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", background: "#0B1D35", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                <h3 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>All Lead Captures</h3>
              </div>

              {/* Interactive Feed & Performance Panel */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
                
                {/* Recent Downloads Feed */}
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)", padding: "20px" }}>
                  <h4 style={{ margin: "0 0 16px", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                    🔥 Recent PDF Downloads Feed
                  </h4>
                  {downloadTimeline.length === 0 ? (
                    <p style={{ color: "#8EA8C3", fontSize: "0.82rem", margin: 0 }}>No downloads recorded yet.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {downloadTimeline.map(item => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px", background: "rgba(11,29,53,0.4)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.03)" }}>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#8EA8C3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }}>
                              {item.email}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "#C9A84C", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              📁 {item.slug.replace(/-/g, " ")}
                            </div>
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#81c784", background: "rgba(46,125,50,0.12)", border: "1px solid rgba(46,125,50,0.25)", padding: "2px 8px", borderRadius: "10px", fontWeight: "bold", whiteSpace: "nowrap", marginLeft: "10px" }}>
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })})
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PDF Performance */}
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)", padding: "20px" }}>
                  <h4 style={{ margin: "0 0 16px", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>
                    📊 PDF Download Performance
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {slugStats.sort((a,b) => b.totalDownloads - a.totalDownloads).slice(0, 4).map(stat => {
                      const percentage = Math.round((stat.totalDownloads / maxDownloads) * 100);
                      return (
                        <div key={stat.slug} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                            <span style={{ color: "#C2D4E4", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{stat.icon} {stat.title}</span>
                            <span style={{ color: "#81c784", fontWeight: "bold" }}>{stat.totalDownloads} downloads</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{ width: `${percentage}%`, height: "100%", background: "#C9A84C", borderRadius: "3px", transition: "width 0.5s ease" }} />
                            </div>
                            <span style={{ fontSize: "0.7rem", color: "#8EA8C3", minWidth: "90px", textAlign: "right" }}>
                              Last: {stat.lastDownloadedAt}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {isLoading ? <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>Loading...</div> :
                leads.length === 0 ? <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>No leads captured yet.</div> : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(11,29,53,0.5)", color: "#C9A84C", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px" }}>
                          <th style={{ padding: "14px 16px", textAlign: "left" }}>Date</th>
                          <th style={{ padding: "14px 16px", textAlign: "left" }}>Name</th>
                          <th style={{ padding: "14px 16px", textAlign: "left" }}>Email</th>
                          <th style={{ padding: "14px 16px", textAlign: "left" }}>Funnel</th>
                          <th style={{ padding: "14px 16px", textAlign: "left" }}>PDF Clicked</th>
                          <th style={{ padding: "14px 16px", textAlign: "left" }}>Drip</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map(lead => (
                          <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "0.85rem" }}>
                            <td style={{ padding: "13px 16px", color: "#8EA8C3", whiteSpace: "nowrap" }}>
                              {lead.capturedAt?.toDate ? new Date(lead.capturedAt.toDate()).toLocaleDateString() : "—"}
                            </td>
                            <td style={{ padding: "13px 16px", color: "#FFFFFF", fontWeight: 600 }}>{lead.name || "—"}</td>
                            <td style={{ padding: "13px 16px", color: "#C9A84C" }}><a href={`mailto:${lead.email}`} style={{ color: "#C9A84C", textDecoration: "none" }}>{lead.email}</a></td>
                            <td style={{ padding: "13px 16px", color: "#C2D4E4", fontSize: "0.78rem" }}>{(lead.slug || "").replace(/-/g, " ")}</td>
                            <td style={{ padding: "13px 16px" }}>
                              {lead.linkClicks > 0 ? (
                                <span 
                                  title={lead.linkClickHistory && lead.linkClickHistory.length > 0 ? lead.linkClickHistory.map((t: string, idx: number) => `Click ${idx+1}: ${new Date(t).toLocaleString()}`).join('\n') : `Clicked: ${lead.linkClickedAt ? new Date(lead.linkClickedAt).toLocaleString() : ''}`}
                                  style={{ background: "rgba(46,125,50,0.15)", color: "#81c784", border: "1px solid rgba(46,125,50,0.3)", padding: "4px 10px", borderRadius: "12px", fontSize: "0.72rem", fontWeight: "bold", cursor: "help" }}
                                >
                                  ✓ {lead.linkClicks}x · {lead.linkClickedAt ? new Date(lead.linkClickedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ""}
                                </span>
                              ) : (
                                <span style={{ color: "#4a6a8a", fontSize: "0.78rem" }}>Not yet</span>
                              )}
                            </td>
                            <td style={{ padding: "13px 16px" }}><StatusBadge status={lead.dripStatus || "unknown"} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          );
        })()}

        {/* ── TAB: Drip Queue ── */}
        {activeTab === "drips" && (
          <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", background: "#0B1D35", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
              <h3 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>Drip Campaign & Email Open History</h3>
              <p style={{ margin: "4px 0 0", color: "#8EA8C3", fontSize: "0.8rem" }}>
                Day circles: <span style={{ color: "#8EA8C3" }}>grey=not sent</span> · <span style={{ color: "#C9A84C" }}>gold=sent</span> · <span style={{ color: "#81c784" }}>green=opened</span>
              </p>
            </div>
            {isLoading ? <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>Loading...</div> :
              leads.length === 0 ? <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>No drip sequences yet.</div> : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "rgba(11,29,53,0.5)", color: "#C9A84C", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px" }}>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Name</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Email</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>PDF Clicked</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Status</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Day Progress + Opens</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Next Send</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.filter(l => l.dripStatus && l.dripStatus !== "duplicate").map(lead => (
                        <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "0.85rem" }}>
                          <td style={{ padding: "14px 16px", color: "#FFFFFF", fontWeight: 600 }}>{lead.name || "—"}</td>
                          <td style={{ padding: "14px 16px", color: "#C9A84C" }}><a href={`mailto:${lead.email}`} style={{ color: "#C9A84C", textDecoration: "none" }}>{lead.email}</a></td>
                          <td style={{ padding: "14px 16px" }}>
                            {lead.linkClicks > 0 ? (
                              <span 
                                title={lead.linkClickHistory && lead.linkClickHistory.length > 0 ? lead.linkClickHistory.map((t: string, idx: number) => `Click ${idx+1}: ${new Date(t).toLocaleString()}`).join('\n') : `Clicked: ${lead.linkClickedAt ? new Date(lead.linkClickedAt).toLocaleString() : ''}`}
                                style={{ background: "rgba(46,125,50,0.15)", color: "#81c784", border: "1px solid rgba(46,125,50,0.3)", padding: "3px 10px", borderRadius: "12px", fontSize: "0.72rem", fontWeight: "bold", cursor: "help" }}
                              >
                                ✓ {lead.linkClicks}x · {lead.linkClickedAt ? new Date(lead.linkClickedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ""}
                              </span>
                            ) : (
                              <span style={{ color: "#4a6a8a", fontSize: "0.78rem" }}>Not yet</span>
                            )}
                          </td>
                          <td style={{ padding: "14px 16px" }}><StatusBadge status={lead.dripStatus} /></td>
                          <td style={{ padding: "14px 16px" }}>
                            <OpenDots opens={lead.emailOpens || []} sentHistory={lead.dripSentHistory || []} />
                          </td>
                          <td style={{ padding: "14px 16px", color: "#8EA8C3", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                            {lead.dripScheduledFor ? new Date(lead.dripScheduledFor).toLocaleString() : lead.dripStatus === "completed" ? "✓ Complete" : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* ── TAB: Funnel Hub ── */}
        {activeTab === "links" && (
          <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", background: "#0B1D35", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
              <h3 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>🎯 Lead Funnel Hub</h3>
              <p style={{ margin: "4px 0 0", color: "#8EA8C3", fontSize: "0.82rem" }}>Select a lead magnet page below to manage its custom slug, PDF asset, email sequences, and specific capture logs.</p>
            </div>

            {/* Grid of Funnels */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", padding: "24px", background: "rgba(255,255,255,0.01)" }}>
              {funnels.map((f, i) => {
                const isSelected = selectedFunnelSlug === f.slug;
                const funnelLeads = leads.filter(l => l.slug === f.slug);
                const capturesCount = funnelLeads.length;
                const downloadsCount = funnelLeads.reduce((sum, l) => sum + (l.linkClicks || 0), 0);
                
                return (
                  <div 
                    key={f.slug} 
                    onClick={() => {
                      setSelectedFunnelSlug(f.slug);
                      setTemplateSlug(f.slug);
                    }}
                    style={{ 
                      background: isSelected ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)", 
                      borderRadius: "8px", 
                      border: isSelected ? "2px solid #C9A84C" : "1px solid rgba(255,255,255,0.06)", 
                      padding: "20px", 
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "28px" }}>{f.icon}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "0.92rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {f.title}
                        </div>
                        <div style={{ color: "#8EA8C3", fontSize: "0.75rem", marginTop: "2px" }}>
                          {customSlugs[f.slug] ? `/r/${customSlugs[f.slug]}` : `/r/${f.slug}`}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "16px", marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "12px" }}>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#8EA8C3", textTransform: "uppercase" }}>Captures</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif" }}>{capturesCount}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#8EA8C3", textTransform: "uppercase" }}>Downloads</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#81c784", fontFamily: "'Cormorant Garamond', serif" }}>{downloadsCount}</div>
                      </div>
                      {pdfStatuses[f.slug] && (
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                          <span style={{ background: "rgba(46,125,50,0.15)", color: "#81c784", border: "1px solid rgba(46,125,50,0.3)", padding: "2px 8px", borderRadius: "10px", fontSize: "0.65rem", fontWeight: "bold" }}>
                            ✓ PDF Uploaded
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Centralized Funnel Control Center */}
            {selectedFunnelSlug && (() => {
              const f = funnels.find(fun => fun.slug === selectedFunnelSlug)!;
              const customSlug = customSlugs[f.slug] || f.slug;
              const url = `${BASE_URL}${FUNNEL_PATH}/${customSlug}`;
              const isCopied = copiedSlug === f.slug;
              const funnelLeads = leads.filter(l => l.slug === f.slug);
              
              return (
                <div style={{ margin: "24px", background: "#0B1D35", borderRadius: "8px", border: "1px solid rgba(201,168,76,0.3)", overflow: "hidden" }}>
                  
                  {/* Control Center Header */}
                  <div style={{ padding: "20px 24px", background: "rgba(201,168,76,0.06)", borderBottom: "1px solid rgba(201,168,76,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "24px" }}>{f.icon}</span>
                        <h3 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "22px" }}>
                          {f.title} Control Center
                        </h3>
                      </div>
                      <p style={{ margin: "4px 0 0", color: "#8EA8C3", fontSize: "0.8rem" }}>Configure links, custom PDF files, templates, and view captured leads for this funnel.</p>
                    </div>
                    <button 
                      onClick={() => setSelectedFunnelSlug(null)}
                      style={{ padding: "6px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#FFFFFF", borderRadius: "4px", cursor: "pointer", fontSize: "0.78rem" }}
                    >
                      Close Control Center ✕
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", padding: "24px" }}>
                    
                    {/* Column 1: Links, URL Settings, PDF Upload */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      
                      {/* URL Settings & Copy Link */}
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", padding: "20px" }}>
                        <h4 style={{ margin: "0 0 14px", color: "#C9A84C", fontSize: "0.95rem" }}>🔗 URL & Slug Settings</h4>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div>
                            <div style={{ fontSize: "0.75rem", color: "#8EA8C3", marginBottom: "4px" }}>Target URL Slug:</div>
                            {editingSlugKey === f.slug ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ color: "#8EA8C3", fontSize: "0.75rem", fontFamily: "monospace" }}>{FUNNEL_PATH}/</span>
                                <input 
                                  type="text" 
                                  value={editingSlugVal} 
                                  onChange={e => setEditingSlugVal(e.target.value)} 
                                  disabled={isSavingSlug}
                                  style={{ padding: "6px 10px", background: "#0B1D35", border: "1px solid rgba(201,168,76,0.5)", color: "#FFFFFF", borderRadius: "4px", fontSize: "0.78rem", fontFamily: "monospace", flex: 1, outline: "none" }} 
                                />
                                <button
                                  disabled={isSavingSlug}
                                  onClick={async () => {
                                    const cleanVal = editingSlugVal.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
                                    if (!cleanVal) { alert("Slug cannot be empty!"); return; }
                                    setIsSavingSlug(true);
                                    try {
                                      const { doc: fsDoc, setDoc } = await import('firebase/firestore');
                                      await setDoc(fsDoc(db, 'leadSlugs', f.slug), { customSlug: cleanVal, updatedAt: new Date().toISOString() });
                                      setCustomSlugs(prev => ({ ...prev, [f.slug]: cleanVal }));
                                      setEditingSlugKey(null);
                                    } catch (err: any) {
                                      alert("Failed to save slug: " + err.message);
                                    } finally {
                                      setIsSavingSlug(false);
                                    }
                                  }}
                                  style={{ padding: "6px 12px", background: "rgba(46,125,50,0.2)", border: "1px solid rgba(46,125,50,0.5)", color: "#81c784", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer", fontWeight: "bold" }}
                                >
                                  Save
                                </button>
                                <button onClick={() => setEditingSlugKey(null)} style={{ padding: "6px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#FFFFFF", borderRadius: "4px", fontSize: "0.72rem" }}>Cancel</button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "8px" }}>
                                <span style={{ color: "#FFFFFF", fontFamily: "monospace", fontSize: "0.85rem" }}>{customSlug}</span>
                                <button 
                                  onClick={() => { setEditingSlugKey(f.slug); setEditingSlugVal(customSlug); }}
                                  style={{ background: "none", border: "none", color: "#C9A84C", cursor: "pointer", fontSize: "0.72rem", textDecoration: "underline", padding: 0 }}
                                >
                                  ✏️ Edit Slug
                                </button>
                              </div>
                            )}
                          </div>

                          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "12px", marginTop: "4px" }}>
                            <div style={{ fontSize: "0.75rem", color: "#8EA8C3", marginBottom: "6px" }}>Full Campaign Share Link:</div>
                            <div style={{ background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "4px", fontSize: "0.78rem", fontFamily: "monospace", color: "#C2D4E4", wordBreak: "break-all", border: "1px solid rgba(255,255,255,0.04)" }}>
                              {url}
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                              <button 
                                onClick={() => navigator.clipboard.writeText(url).then(() => { setCopiedSlug(f.slug); setTimeout(() => setCopiedSlug(null), 2000); })}
                                style={{ padding: "6px 16px", background: isCopied ? "rgba(46,125,50,0.15)" : "rgba(201,168,76,0.15)", border: `1px solid ${isCopied ? "rgba(46,125,50,0.4)" : "rgba(201,168,76,0.4)"}`, color: isCopied ? "#81c784" : "#C9A84C", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold" }}
                              >
                                {isCopied ? "✓ Link Copied!" : "📋 Copy Link"}
                              </button>
                              <a href={url} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#FFFFFF", borderRadius: "4px", textDecoration: "none", fontSize: "0.75rem", fontWeight: "bold" }}>
                                🔗 Open Landing Page
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PDF File Uploader */}
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", padding: "20px" }}>
                        <h4 style={{ margin: "0 0 14px", color: "#C9A84C", fontSize: "0.95rem" }}>📤 Custom PDF Asset File</h4>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <label style={{ display: "block", cursor: uploadingSlug === f.slug ? "wait" : "pointer", background: uploadingSlug === f.slug ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "12px", textAlign: "center", fontSize: "0.8rem", fontWeight: "bold", color: uploadingSlug === f.slug ? "#8EA8C3" : "#FFFFFF" }}>
                            {uploadingSlug === f.slug ? "⏳ Uploading to Firestore..." : "📤 Select & Upload PDF File"}
                            <input type="file" accept=".pdf" disabled={uploadingSlug === f.slug} style={{ display: "none" }} onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(f.slug, file);
                            }} />
                          </label>
                          {uploadStatus[f.slug] && (
                            <div style={{ fontSize: "0.75rem", color: uploadStatus[f.slug].includes("✓") ? "#81c784" : uploadStatus[f.slug].includes("✗") ? "#e57373" : "#C9A84C", fontWeight: "bold", textAlign: "center" }}>
                              {uploadStatus[f.slug]}
                            </div>
                          )}

                          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "12px", marginTop: "4px" }}>
                            <div style={{ fontSize: "0.75rem", color: "#8EA8C3", marginBottom: "6px" }}>Asset Status:</div>
                            {pdfStatuses[f.slug] ? (
                              <div style={{ padding: "10px", background: "rgba(46,125,50,0.1)", border: "1px solid rgba(46,125,50,0.2)", borderRadius: "4px" }}>
                                <div style={{ color: "#81c784", fontWeight: "bold", fontSize: "0.78rem" }}>✓ Custom PDF Active</div>
                                <div style={{ color: "#8EA8C3", fontSize: "0.7rem", marginTop: "2px", fontFamily: "monospace" }}>
                                  {pdfStatuses[f.slug].filename} · {pdfStatuses[f.slug].sizeKb}KB<br />
                                  Uploaded: {pdfStatuses[f.slug].uploadedAt}
                                </div>
                              </div>
                            ) : (
                              <div style={{ padding: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px" }}>
                                <div style={{ color: "#8EA8C3", fontSize: "0.75rem" }}>Using code default static PDF:</div>
                                <div style={{ color: "#C2D4E4", fontSize: "0.7rem", fontFamily: "monospace", marginTop: "2px" }}>
                                  /public/assets/lead-magnets/{f.slug}.pdf
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Column 2: Drip Email Templates Editor */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                          <h4 style={{ margin: 0, color: "#C9A84C", fontSize: "0.95rem" }}>📧 Drip Campaign Email Templates</h4>
                          {templatesSaved && <span style={{ color: "#81c784", fontSize: "0.72rem", fontWeight: "bold" }}>✓ Saved to DB</span>}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {/* Day 1 - 4 Templates */}
                          {["day1", "day2", "day3", "day4"].map(dayKey => {
                            const labelMap: Record<string, string> = {
                              day1: "Day 1 (Immediate Deliverable Followup)",
                              day2: "Day 2 (Educational Case Study)",
                              day3: "Day 3 (Framework & Strategy)",
                              day4: "Day 4 (Discovery Invitation CTA)"
                            };
                            return (
                              <div key={dayKey} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "10px", marginBottom: "6px" }}>
                                <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#FFFFFF", marginBottom: "4px" }}>{labelMap[dayKey]}</div>
                                <input 
                                  type="text" 
                                  placeholder="Email Subject Line"
                                  value={emailTemplates[`${dayKey}_subject`] || ""}
                                  onChange={e => {
                                    setTemplatesSaved(false);
                                    setEmailTemplates(prev => ({ ...prev, [`${dayKey}_subject`]: e.target.value }));
                                  }}
                                  style={{ width: "100%", padding: "6px 8px", background: "#0B1D35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#FFFFFF", fontSize: "0.78rem", marginBottom: "4px", outline: "none" }}
                                />
                                <textarea 
                                  placeholder="HTML or Text Body Content"
                                  rows={4}
                                  value={emailTemplates[`${dayKey}_body`] || ""}
                                  onChange={e => {
                                    setTemplatesSaved(false);
                                    setEmailTemplates(prev => ({ ...prev, [`${dayKey}_body`]: e.target.value }));
                                  }}
                                  style={{ width: "100%", padding: "6px 8px", background: "#0B1D35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#FFFFFF", fontSize: "0.75rem", fontFamily: "monospace", resize: "vertical", outline: "none" }}
                                />
                              </div>
                            );
                          })}

                          <button 
                            disabled={isSavingTemplates}
                            onClick={async () => {
                              setIsSavingTemplates(true);
                              try {
                                const { doc: fsDoc, setDoc } = await import('firebase/firestore');
                                await setDoc(fsDoc(db, 'leadEmailTemplates', f.slug), {
                                  day1: { subject: emailTemplates.day1_subject || '', body: emailTemplates.day1_body || '' },
                                  day2: { subject: emailTemplates.day2_subject || '', body: emailTemplates.day2_body || '' },
                                  day3: { subject: emailTemplates.day3_subject || '', body: emailTemplates.day3_body || '' },
                                  day4: { subject: emailTemplates.day4_subject || '', body: emailTemplates.day4_body || '' },
                                  updatedAt: new Date().toISOString()
                                });
                                setTemplatesSaved(true);
                                setTimeout(() => setTemplatesSaved(false), 3000);
                              } catch (err: any) {
                                alert("Failed to save templates: " + err.message);
                              } finally {
                                setIsSavingTemplates(false);
                              }
                            }}
                            style={{ width: "100%", padding: "10px", background: "#C9A84C", color: "#0B1D35", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: isSavingTemplates ? "wait" : "pointer" }}
                          >
                            {isSavingTemplates ? "⏳ Saving Templates..." : "💾 Save Email Templates"}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Funnel-Specific Leads Table */}
                  <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)", background: "rgba(0,0,0,0.1)" }}>
                    <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ margin: 0, color: "#C9A84C", fontSize: "0.95rem" }}>👥 Leads Captured for this Funnel ({funnelLeads.length})</h4>
                    </div>
                    {funnelLeads.length === 0 ? (
                      <div style={{ padding: "24px", textAlign: "center", color: "#8EA8C3", fontSize: "0.8rem" }}>No captures for this lead page yet.</div>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: "rgba(0,0,0,0.2)", color: "#C9A84C", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "1px" }}>
                              <th style={{ padding: "10px 16px", textAlign: "left" }}>Date</th>
                              <th style={{ padding: "10px 16px", textAlign: "left" }}>Name</th>
                              <th style={{ padding: "10px 16px", textAlign: "left" }}>Email</th>
                              <th style={{ padding: "10px 16px", textAlign: "left" }}>Source</th>
                              <th style={{ padding: "10px 16px", textAlign: "left" }}>Downloads</th>
                              <th style={{ padding: "10px 16px", textAlign: "left" }}>Drip Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {funnelLeads.map(lead => (
                              <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: "0.78rem" }}>
                                <td style={{ padding: "10px 16px", color: "#8EA8C3" }}>
                                  {lead.capturedAt?.toDate ? new Date(lead.capturedAt.toDate()).toLocaleDateString() : "—"}
                                </td>
                                <td style={{ padding: "10px 16px", color: "#FFFFFF", fontWeight: "bold" }}>{lead.name}</td>
                                <td style={{ padding: "10px 16px", color: "#C9A84C" }}>
                                  <a href={`mailto:${lead.email}`} style={{ color: "#C9A84C", textDecoration: "none" }}>{lead.email}</a>
                                </td>
                                <td style={{ padding: "10px 16px", color: "#8EA8C3" }}>{lead.utmSource || "Direct"}</td>
                                <td style={{ padding: "10px 16px" }}>
                                  {lead.linkClicks > 0 ? (
                                    <span 
                                      title={lead.linkClickHistory && lead.linkClickHistory.length > 0 ? lead.linkClickHistory.map((t: string, idx: number) => `Click ${idx+1}: ${new Date(t).toLocaleString()}`).join('\n') : `Clicked: ${lead.linkClickedAt ? new Date(lead.linkClickedAt).toLocaleString() : ''}`}
                                      style={{ background: "rgba(46,125,50,0.15)", color: "#81c784", border: "1px solid rgba(46,125,50,0.3)", padding: "2px 8px", borderRadius: "10px", fontSize: "0.68rem", fontWeight: "bold", cursor: "help" }}
                                    >
                                      ✓ {lead.linkClicks}x · {lead.linkClickedAt ? new Date(lead.linkClickedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ""}
                                    </span>
                                  ) : (
                                    <span style={{ color: "#4a6a8a" }}>Not yet</span>
                                  )}
                                </td>
                                <td style={{ padding: "10px 16px" }}>
                                  <StatusBadge status={lead.dripStatus || "unknown"} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

          </div>
        )}

      </div>
    </div>
  );
}
