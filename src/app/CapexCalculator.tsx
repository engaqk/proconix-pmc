"use client";

import { useState } from "react";

export default function CapexCalculator() {
  // Setup standard state for calculation
  const [budgetStr, setBudgetStr] = useState<string>("25000000");

  const budget = parseInt(budgetStr) || 0;
  
  // High-end typical conservative leakage range in unsupported African construction: 15% - 20%
  const leakageMin = budget * 0.15;
  const leakageMax = budget * 0.20;

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(201, 168, 76, 0.2)',
      borderRadius: '12px',
      padding: '30px',
      marginTop: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        backgroundColor: 'rgba(201,168,76,0.1)',
        color: '#C9A84C',
        padding: '6px 14px',
        borderBottomLeftRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Interactive Tool
      </div>

      <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '10px', fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic' }}>
        Estimate Your CapEx Leakage Risk
      </h3>
      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '25px', maxWidth: '500px' }}>
        In African infrastructure, uncontrolled execution generally bleeds 15-20% of your total budget. Enter your project size to see exactly what's at stake.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', color: 'var(--white)', fontSize: '0.85rem', marginBottom: '10px', fontWeight: 'bold' }}>
            Expected CapEx Budget ($)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input 
              type="range" 
              min="5000000" 
              max="200000000" 
              step="1000000"
              value={budget}
              onChange={(e) => setBudgetStr(e.target.value)}
              style={{ flex: 1, accentColor: '#C9A84C' }}
            />
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '10px 16px',
              borderRadius: '6px',
              color: '#fff',
              fontWeight: 'bold',
              minWidth: '140px',
              textAlign: 'center'
            }}>
              {formatCurrency(budget)}
            </div>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(11, 29, 53, 0.5)', 
          border: '1px solid rgba(255,107,107,0.2)',
          borderLeft: '4px solid #ff6b6b',
          padding: '20px',
          borderRadius: '6px',
          marginTop: '10px'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#ff6b6b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 'bold' }}>
            Potential Leakage Exposure (Without Proconix)
          </div>
          <div style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 'bold', fontFamily: '"Cormorant Garamond", serif' }}>
            {formatCurrency(leakageMin)} <span style={{ color: 'var(--text-light)', fontSize: '1.2rem', fontWeight: 300 }}>to</span> {formatCurrency(leakageMax)}
          </div>
        </div>
        
        <p style={{ color: '#C9A84C', fontSize: '0.85rem', margin: '0 0', fontStyle: 'italic' }}>
          * We engineer out this leakage from day 1. Book a discovery call to audit your project governance.
        </p>
      </div>
    </div>
  );
}
