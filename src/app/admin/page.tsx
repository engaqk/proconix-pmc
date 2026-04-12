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

  useEffect(() => {
    if (isLoggedIn) {
      const q = query(collection(db, "formSubmissions"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubmissions(data);
      }, (err) => {
        console.error("Error fetching submissions:", err);
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
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F8FA", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#0B1D35", margin: 0 }}>Proconix Dashboard</h1>
          <button onClick={() => {
            setIsLoggedIn(false);
            localStorage.removeItem("proconix_admin_logged_in");
          }} style={{ padding: "8px 16px", background: "#0B1D35", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Logout</button>
        </div>
        
        <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid #eee", background: "#fafafa" }}>
            <h3 style={{ margin: 0, color: "#455065" }}>Recent Form Submissions ({submissions.length})</h3>
          </div>
          
          {submissions.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8EA8C3" }}>No submissions found yet.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#0B1D35", color: "#fff" }}>
                    <th style={{ padding: "15px", fontSize: "0.9rem" }}>Date</th>
                    <th style={{ padding: "15px", fontSize: "0.9rem" }}>Type</th>
                    <th style={{ padding: "15px", fontSize: "0.9rem" }}>Name</th>
                    <th style={{ padding: "15px", fontSize: "0.9rem" }}>Email</th>
                    <th style={{ padding: "15px", fontSize: "0.9rem" }}>Country</th>
                    <th style={{ padding: "15px", fontSize: "0.9rem" }}>Sector</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px", color: "#455065", fontSize: "0.9rem" }}>
                        {sub.createdAt ? new Date(sub.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ 
                          background: sub.type === 'Discovery Call Click' ? '#fff3e0' : (sub.type === 'Checklist Download' ? '#e3f2fd' : '#e8f5e9'), 
                          color: sub.type === 'Discovery Call Click' ? '#e65100' : (sub.type === 'Checklist Download' ? '#1565c0' : '#2e7d32'), 
                          padding: "4px 8px", 
                          borderRadius: "12px", 
                          fontSize: "0.8rem", 
                          fontWeight: "bold" 
                        }}>
                          {sub.type}
                        </span>
                      </td>
                      <td style={{ padding: "15px", color: "#0B1D35", fontWeight: "bold" }}>{sub.name}</td>
                      <td style={{ padding: "15px", color: "#455065" }}>{sub.email}</td>
                      <td style={{ padding: "15px", color: "#455065" }}>{sub.country}</td>
                      <td style={{ padding: "15px", color: "#455065" }}>{sub.sector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
