"use client";

import { useState, useEffect } from "react";

const sectors = [
  { id: 'hospitality', name: 'Hospitality & Resorts', riskFactor: 0.22, icon: '🏨' },
  { id: 'realestate', name: 'Commercial Real Estate', riskFactor: 0.18, icon: '🏢' },
  { id: 'industrial', name: 'Industrial & EPC', riskFactor: 0.25, icon: '🏭' },
  { id: 'infrastructure', name: 'Public Infrastructure', riskFactor: 0.30, icon: '🌉' }
];

const riskQuestions = [
  { id: 'contract', label: 'Fixed-Price Contract with Variation Lockdown?', weight: 0.15 },
  { id: 'audit', label: 'Third-Party Independent Technical Audit?', weight: 0.20 },
  { id: 'reporting', label: 'Real-Time Financial Dashboard access?', weight: 0.15 },
  { id: 'oversight', label: 'Sponsor-Aligned On-Ground Authority?', weight: 0.25 },
  { id: 'procurement', label: 'Direct Control of Long-Lead Supply Chain?', weight: 0.25 }
];

export default function GovernanceSimulator() {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(25000000);
  const [selectedSector, setSelectedSector] = useState(sectors[0]);
  const [answers, setAnswers] = useState<Record<string, boolean>>({
    contract: false, audit: false, reporting: false, oversight: false, procurement: false
  });
  const [score, setScore] = useState(0);
  const [leakage, setLeakage] = useState(0);

  // Calculate results when moving to result step
  useEffect(() => {
    if (step === 3) {
      let riskReduction = 0;
      riskQuestions.forEach(q => {
        if (answers[q.id]) riskReduction += q.weight;
      });

      const baseRisk = selectedSector.riskFactor;
      const finalRisk = Math.max(0.03, baseRisk * (1 - riskReduction)); // Min 3% unavoidable risk
      
      const healthScore = Math.round(riskReduction * 100);
      const potentialLeakage = budget * finalRisk;

      setScore(healthScore);
      setLeakage(potentialLeakage);
    }
  }, [step, budget, selectedSector, answers]);

  const toggleAnswer = (id: string) => {
    setAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const handleConversion = async () => {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Simulator Lead', 
          email: 'Pending registration', 
          type: 'Simulator Audit Click',
          sector: selectedSector.name,
          details: `Budget: ${formatCurrency(budget)}, Readiness: ${score}%, Leakage: ${formatCurrency(leakage)}`
        }),
      });
    } catch {}
    window.open("https://topmate.io/talibkhanji_pmp/2043275", "_blank");
  };

  return (
    <div className="simulator-card">
      {/* Progress Bar */}
      <div className="sim-progress">
        <div className={`progress-dot ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className="progress-line" />
        <div className={`progress-dot ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className="progress-line" />
        <div className={`progress-dot ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      {step === 1 && (
        <div className="sim-step animate-in">
          <h3>Step 1: Project Scope</h3>
          <p>Define your capital deployment window in Africa.</p>
          
          <div className="input-group">
            <label>Project Budget (CapEx)</label>
            <div className="budget-slider-wrapper">
              <input 
                type="range" min="5000000" max="250000000" step="1000000"
                value={budget} onChange={(e) => setBudget(Number(e.target.value))}
              />
              <div className="budget-value">{formatCurrency(budget)}</div>
            </div>
          </div>

          <div className="sector-grid">
            {sectors.map(s => (
              <button 
                key={s.id}
                className={`sector-btn ${selectedSector.id === s.id ? 'active' : ''}`}
                onClick={() => setSelectedSector(s)}
              >
                <span className="s-icon">{s.icon}</span>
                <span className="s-name">{s.name}</span>
              </button>
            ))}
          </div>

          <button className="btn-next" onClick={() => setStep(2)}>Verify Risk Profile →</button>
        </div>
      )}

      {step === 2 && (
        <div className="sim-step animate-in">
          <h3>Step 2: Risk Architecture</h3>
          <p>Identify active governance barriers currently in place.</p>
          
          <div className="question-list">
            {riskQuestions.map(q => (
              <div key={q.id} className={`q-row ${answers[q.id] ? 'checked' : ''}`} onClick={() => toggleAnswer(q.id)}>
                <div className="q-checkbox">{answers[q.id] ? '✔' : ''}</div>
                <div className="q-label">{q.label}</div>
              </div>
            ))}
          </div>

          <div className="btn-row">
            <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
            <button className="btn-next" onClick={() => setStep(3)}>Generate Diagnostic Result</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="sim-step result-step animate-in">
          <div className="score-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <text x="18" y="20.35" className="percentage">{score}%</text>
            </svg>
            <label>Governance Readiness</label>
          </div>

          <div className="exposure-box">
            <div className="exp-label">Potential Capital Exposure (Leakage)</div>
            <div className="exp-value">{formatCurrency(leakage)}</div>
            <p className="exp-note">Estimate based on {selectedSector.name} risk profiles in unsupported African construction environments.</p>
          </div>

          <div className="result-actions">
            <button className="btn-gold" onClick={handleConversion}>
              Book Strategic Audit
            </button>
            <button className="btn-outline" onClick={() => setStep(1)}>Restart Diagnostic</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .simulator-card {
          padding: 40px;
          background: #0B1D35;
          color: #fff;
          text-align: left;
        }
        .sim-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
        }
        .progress-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: bold;
          color: rgba(255,255,255,0.3);
          transition: all 0.3s;
        }
        .progress-dot.active {
          border-color: #C9A84C;
          color: #C9A84C;
          box-shadow: 0 0 15px rgba(201,168,76,0.3);
        }
        .progress-line {
          width: 40px; height: 1px;
          background: rgba(255,255,255,0.1);
        }
        
        h3 { 
          font-family: 'DM Sans', sans-serif;
          font-size: 1.5rem; color: #C9A84C; 
          margin-bottom: 8px; 
          font-weight: 700;
        }
        p { color: #8EA8C3; font-size: 0.9rem; margin-bottom: 30px; }

        .input-group label {
          display: block; font-size: 0.8rem; text-transform: uppercase;
          letter-spacing: 1px; color: #fff; margin-bottom: 15px;
          opacity: 0.8;
        }
        .budget-slider-wrapper {
          display: flex; align-items: center; gap: 20px;
          background: rgba(0,0,0,0.2); padding: 15px 20px;
          border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);
        }
        input[type="range"] {
          flex: 1; accent-color: #C9A84C;
        }
        .budget-value {
          font-weight: 700; color: #C9A84C; min-width: 120px; text-align: right;
          font-family: 'DM Sans', sans-serif;
        }

        .sector-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-top: 25px; margin-bottom: 30px;
        }
        .sector-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 15px; border-radius: 8px;
          display: flex; flex-direction: column; align-items: center;
          gap: 8px; cursor: pointer; transition: all 0.3s;
          color: #fff;
        }
        .sector-btn .s-icon { font-size: 1.4rem; }
        .sector-btn .s-name { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .sector-btn:hover { background: rgba(201,168,76,0.05); border-color: rgba(201,168,76,0.3); }
        .sector-btn.active {
          background: rgba(201,168,76,0.1);
          border-color: #C9A84C;
          box-shadow: inset 0 0 10px rgba(201,168,76,0.2);
        }

        .btn-next {
          width: 100%; background: #C9A84C; color: #0B1D35;
          border: none; padding: 16px; border-radius: 8px;
          font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
          cursor: pointer; transition: 0.3s;
        }
        .btn-next:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(201,168,76,0.25); }

        .question-list {
          display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;
        }
        .q-row {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 14px 18px; border-radius: 8px;
          display: flex; align-items: center; gap: 15px;
          cursor: pointer; transition: 0.2s;
        }
        .q-row:hover { background: rgba(255,255,255,0.06); }
        .q-row.checked {
          background: rgba(201,168,76,0.05);
          border-color: rgba(201,168,76,0.4);
        }
        .q-checkbox {
          width: 20px; height: 20px; border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px; display: flex; align-items: center; justify-content: center;
          color: #C9A84C; font-weight: bold; font-size: 0.8rem;
        }
        .q-row.checked .q-checkbox { border-color: #C9A84C; background: rgba(201,168,76,0.1); }
        .q-label { font-size: 0.9rem; color: #DCE4EF; }

        .btn-row { display: flex; gap: 12px; }
        .btn-back {
          background: transparent; border: 1px solid rgba(255,255,255,0.1);
          color: #fff; padding: 16px 25px; border-radius: 8px; cursor: pointer;
        }

        /* Result Styles */
        .result-step { text-align: center; }
        .score-circle {
          width: 150px; margin: 0 auto 30px;
        }
        .circular-chart { display: block; margin: 10px auto; max-width: 100%; max-height: 250px; }
        .circle-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 2.8; }
        .circle {
          fill: none; stroke-width: 2.8; stroke-linecap: round;
          stroke: #C9A84C;
          animation: progress 1s ease-out forwards;
        }
        .percentage {
          fill: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.5rem;
          text-anchor: middle; font-weight: 700;
        }
        .score-circle label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #8EA8C3; }

        .exposure-box {
          background: rgba(255,107,107,0.05);
          border: 1px solid rgba(255,107,107,0.15);
          border-radius: 12px; padding: 25px; margin-bottom: 30px;
          border-top: 3px solid #ff6b6b;
        }
        .exp-label { color: #ff6b6b; font-size: 0.8rem; font-weight: 700; transform: uppercase; margin-bottom: 10px; }
        .exp-value { font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 15px; font-family: 'DM Sans', sans-serif; }
        .exp-note { margin: 0; font-size: 0.8rem; color: #8EA8C3; line-height: 1.5; }

        .result-actions { display: flex; flex-direction: column; gap: 12px; }
        .btn-gold { 
          background: #C9A84C; color: #0B1D35; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;
        }
        .btn-outline {
          background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 0.85rem;
        }

        .animate-in {
          animation: slideIn 0.4s ease-out forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
