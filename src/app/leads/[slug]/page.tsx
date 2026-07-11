"use client";

import React, { useEffect, useState } from "react";
import { leadRegistry } from "../../../lib/leadConfig";

export default function LeadCanvas({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const asset = leadRegistry[slug];

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utmParams, setUtmParams] = useState<any>({});

  useEffect(() => {
    // Parse URL query search parameters for marketing analytics
    const searchParams = new URLSearchParams(window.location.search);
    setUtmParams({
      utmSource: searchParams.get("utm_source"),
      utmMedium: searchParams.get("utm_medium"),
      utmCampaign: searchParams.get("utm_campaign"),
      utmContent: searchParams.get("utm_content"),
      utmTerm: searchParams.get("utm_term"),
      referrer: document.referrer || null,
    });
  }, []);

  if (!asset) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0B1D35", color: "#FFFFFF" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif" }}>Asset Not Found</h1>
          <p style={{ marginTop: "10px", color: "#8EA8C3", fontFamily: "'DM Sans', sans-serif" }}>The requested lead magnet does not exist.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus({ type: 'error', message: "Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          slug,
          ...utmParams
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({
          type: 'success',
          message: "Checklist copy sent. Please check your inbox (or spam folder) for immediate access."
        });
        setEmail("");
      } else {
        setStatus({ type: 'error', message: data.error || "Something went wrong. Please try again." });
      }
    } catch (err) {
      setStatus({ type: 'error', message: "Network error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#07142A", color: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "450px", width: "100%", background: "#122647", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "8px", padding: "40px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", position: "relative" }}>
        <div style={{ height: "3px", background: "linear-gradient(90deg, #9A7A35, #C9A84C, #9A7A35)", position: "absolute", top: 0, left: 0, right: 0, borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}></div>
        
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#C9A84C", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px" }}>Exclusive Executive Resource</div>
          <h1 style={{ fontSize: "1.8rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", color: "#FFFFFF", lineHeight: "1.2", margin: "0 0 15px 0" }}>{asset.title}</h1>
          <p style={{ fontSize: "0.88rem", color: "#C2D4E4", fontWeight: "300", lineHeight: "1.6", margin: 0 }}>{asset.description}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <p style={{ fontSize: "0.75rem", color: "#C9A84C", marginBottom: "2px", fontStyle: "italic", textAlign: "center" }}>
            * Please enter your correct email address below to receive the resource.
          </p>
          <input
            type="email"
            placeholder="Enter your professional email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "14px", backgroundColor: "#0B1D35", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "4px", color: "#FFFFFF", fontSize: "0.9rem", outline: "none" }}
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ width: "100%", backgroundColor: "#C9A84C", color: "#0B1D35", fontWeight: "bold", padding: "14px", borderRadius: "4px", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", transition: "background 0.2s" }}
          >
            {isSubmitting ? "Processing..." : "Get Instant PDF Access →"}
          </button>
        </form>

        {status.message && (
          <div style={{ marginTop: "24px", padding: "15px", borderRadius: "4px", fontSize: "0.8rem", lineHeight: "1.5", border: `1px solid ${status.type === 'success' ? 'rgba(46,125,50,0.3)' : 'rgba(198,40,40,0.3)'}`, backgroundColor: status.type === 'success' ? 'rgba(46,125,50,0.1)' : 'rgba(198,40,40,0.1)', color: status.type === 'success' ? '#81c784' : '#e57373' }}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
