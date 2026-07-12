"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
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
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});

  // Settings state
  const [dripEnabled, setDripEnabled]     = useState(true);
  const [dripHour, setDripHour]           = useState(-1);
  const [slackEnabled, setSlackEnabled]   = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Drip run state
  const [isRunningDrip, setIsRunningDrip] = useState(false);
  const [dripRunLog, setDripRunLog]       = useState<string[] | null>(null);

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

  // ── Upload PDF ────────────────────────────────────────────────────────────
  const handleFileUpload = async (slug: string, file: File) => {
    if (!file) return;
    setUploadingSlug(slug);
    setUploadStatus(prev => ({ ...prev, [slug]: "Uploading..." }));
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", slug);

    try {
      const res = await fetch("/api/admin/leads/upload", {
        method: "POST",
        headers: { Authorization: AUTH },
        body: formData,
      });
      if (res.ok) {
        setUploadStatus(prev => ({ ...prev, [slug]: "✓ PDF Saved!" }));
      } else {
        const d = await res.json();
        setUploadStatus(prev => ({ ...prev, [slug]: `✗ Error: ${d.error}` }));
      }
    } catch {
      setUploadStatus(prev => ({ ...prev, [slug]: "✗ Connection error" }));
    } finally {
      setUploadingSlug(null);
    }
  };

  // ── Firestore listener ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthorized) return;
    loadSettings();
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
  }, [isAuthorized, loadSettings]);

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
            <a href="/lead" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", color: "#C9A84C", borderRadius: "4px", textDecoration: "none", fontWeight: "bold", fontSize: "0.85rem" }}>
              👁️ View Lead Page
            </a>
            <button onClick={handleClearAll}
              style={{ padding: "8px 16px", background: "rgba(229,115,115,0.1)", border: "1px solid rgba(229,115,115,0.3)", color: "#e57373", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem" }}>
              Clear All Leads
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "30px" }}>
          {[
            { label: "Total Captures", value: totalLeads, color: "#FFFFFF" },
            { label: "Drip Active", value: activeLeads, color: "#81c784" },
            { label: "Drip Completed", value: completedLeads, color: "#64b5f6" },
            { label: "Email Open Rate", value: `${openRate}%`, color: "#C9A84C" },
          ].map(s => (
            <div key={s.label} style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", padding: "20px" }}>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: s.color, fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", color: "#8EA8C3", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0", flexWrap: "wrap" }}>
          {tabBtn("analytics",   "📊 Analytics & Settings")}
          {tabBtn("submissions", `📥 Submissions (${totalLeads})`)}
          {tabBtn("drips",       `📧 Drip Queue (${activeLeads} active)`)}
          {tabBtn("links",       "🔗 Share Links")}
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
              <h3 style={{ margin: "0 0 20px", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>⚙️ Drip Email Settings</h3>
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
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#8EA8C3" }}>
                  Vercel cron runs every hour. Drip fires at the scheduled time for each lead.
                </p>
              </div>
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
        {activeTab === "submissions" && (
          <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", background: "#0B1D35", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
              <h3 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>All Lead Captures</h3>
            </div>
            {isLoading ? <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>Loading...</div> :
              leads.length === 0 ? <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>No leads captured yet.</div> : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "rgba(11,29,53,0.5)", color: "#C9A84C", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px" }}>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Date</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Email</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Funnel</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Source</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Campaign</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Drip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => (
                        <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "0.85rem" }}>
                          <td style={{ padding: "13px 16px", color: "#8EA8C3", whiteSpace: "nowrap" }}>
                            {lead.capturedAt?.toDate ? new Date(lead.capturedAt.toDate()).toLocaleDateString() : "—"}
                          </td>
                          <td style={{ padding: "13px 16px", color: "#FFFFFF", fontWeight: 600 }}>{lead.email}</td>
                          <td style={{ padding: "13px 16px", color: "#C9A84C", fontSize: "0.78rem" }}>{(lead.slug || "").replace(/-/g, " ")}</td>
                          <td style={{ padding: "13px 16px", color: "#C2D4E4" }}>{lead.utmSource || "—"}</td>
                          <td style={{ padding: "13px 16px", color: "#C2D4E4" }}>{lead.utmCampaign || "—"}</td>
                          <td style={{ padding: "13px 16px" }}><StatusBadge status={lead.dripStatus || "unknown"} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

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
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Email</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Funnel</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Status</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Day Progress + Opens</th>
                        <th style={{ padding: "14px 16px", textAlign: "left" }}>Next Send</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.filter(l => l.dripStatus && l.dripStatus !== "duplicate").map(lead => (
                        <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "0.85rem" }}>
                          <td style={{ padding: "14px 16px", color: "#FFFFFF", fontWeight: 600 }}>{lead.email}</td>
                          <td style={{ padding: "14px 16px", color: "#C9A84C", fontSize: "0.78rem" }}>{(lead.slug || "").replace(/-/g, " ")}</td>
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

        {/* ── TAB: Share Links ── */}
        {activeTab === "links" && (
          <div style={{ background: "#122647", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", background: "#0B1D35", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
              <h3 style={{ margin: 0, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>Lead Magnet Funnel Share Links</h3>
              <p style={{ margin: "4px 0 0", color: "#8EA8C3", fontSize: "0.82rem" }}>Share these in email campaigns, LinkedIn, WhatsApp, or any marketing channel.</p>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {funnels.map((f, i) => {
                const url = `${BASE_URL}${FUNNEL_PATH}/${f.slug}`;
                const isCopied = copiedSlug === f.slug;
                return (
                  <div key={f.slug} style={{ display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "14px 18px" }}>
                    <span style={{ fontSize: "20px", flexShrink: 0 }}>{f.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "0.88rem", marginBottom: "3px" }}>
                        <span style={{ color: "#C9A84C", marginRight: "8px", fontSize: "0.75rem" }}>#{i + 1}</span>{f.title}
                      </div>
                      <div style={{ color: "#8EA8C3", fontSize: "0.75rem", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</div>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#8EA8C3", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "12px" }}>
                      {bySlug[f.slug] || 0} leads
                    </span>
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      style={{ padding: "6px 12px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", borderRadius: "4px", textDecoration: "none", fontSize: "0.75rem", fontWeight: "bold", whiteSpace: "nowrap" }}>
                      Preview
                    </a>
                    <button onClick={() => navigator.clipboard.writeText(url).then(() => { setCopiedSlug(f.slug); setTimeout(() => setCopiedSlug(null), 2000); })}
                      style={{ padding: "6px 14px", background: isCopied ? "rgba(46,125,50,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${isCopied ? "rgba(46,125,50,0.4)" : "rgba(255,255,255,0.12)"}`, color: isCopied ? "#81c784" : "#FFFFFF", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                      {isCopied ? "✓ Copied!" : "Copy"}
                    </button>

                    {/* PDF Upload */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: "14px" }}>
                      <label style={{ cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "6px 12px", fontSize: "0.75rem", fontWeight: "bold", whiteSpace: "nowrap" }}>
                        Upload PDF
                        <input type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(f.slug, file);
                        }} />
                      </label>
                      {uploadStatus[f.slug] && (
                        <span style={{ fontSize: "0.72rem", color: uploadStatus[f.slug].includes("✓") ? "#81c784" : uploadStatus[f.slug].includes("✗") ? "#e57373" : "#C9A84C", fontWeight: "bold" }}>
                          {uploadStatus[f.slug]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
