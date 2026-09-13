import React from 'react';
import { formatPct, clampPct, getOeeStatus } from '../data/oeeCalculator';
import { Gauge, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

export default function HeroOeeCard({ shiftMetrics }) {
  const oee = shiftMetrics.oee;
  const status = getOeeStatus(oee);

  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const strokeDashoffset = circumference - (Math.min(1, Math.max(0, oee)) * circumference);

  const pillars = [
    {
      key: 'avail',
      label: 'Availability (A)',
      reg: 'D233',
      val: shiftMetrics.availability,
      color: 'var(--blue)',
      desc: `${shiftMetrics.actualAvailableTime}m / ${shiftMetrics.availableTime}m`,
    },
    {
      key: 'perf',
      label: 'Performance (P)',
      reg: 'D234',
      val: shiftMetrics.performance,
      color: 'var(--teal)',
      desc: `${shiftMetrics.totalPlannedTime.toFixed(0)}m / ${shiftMetrics.actualAvailableTime}m`,
    },
    {
      key: 'qual',
      label: 'Quality (Q)',
      reg: 'D235',
      val: shiftMetrics.quality,
      color: 'var(--amber)',
      desc: `${shiftMetrics.totalCount > 0 ? (100 - (shiftMetrics.scrapPpm / 10000)).toFixed(1) : 100}% Yield`,
    },
    {
      key: 'cap',
      label: 'Capacity Utilisation',
      reg: 'D237',
      val: shiftMetrics.capacityUtil,
      color: 'var(--rose)',
      desc: `${shiftMetrics.totalPlannedTime.toFixed(0)}m / ${shiftMetrics.shiftMin}m total`,
    },
  ];

  return (
    <div className="scada-card span-8">
      <div className="card-header">
        <div className="card-title">
          <Gauge size={16} style={{ color: 'var(--teal)' }} />
          <span>Overall Equipment Effectiveness</span>
        </div>
        <div className="card-badge-hint">
          PLC Register D236 · A × P × Q
        </div>
      </div>

      <div className="hero-wrapper">
        {/* Glowing Circular Radial Gauge */}
        <div className="gauge-box">
          <svg className="gauge-svg" viewBox="0 0 160 160">
            <defs>
              <linearGradient id="oeeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={status.color} />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={status.color} floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="var(--bg-elevated)"
              strokeWidth="12"
            />

            {/* Active Gauge Progress */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="url(#oeeGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              filter="url(#gaugeGlow)"
              style={{
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease',
              }}
            />
          </svg>

          <div className="gauge-center-content">
            <div className="val">{formatPct(oee, 1)}</div>
            <div
              className="sub-label"
              style={{
                color: status.color,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {oee >= 0.65 ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
              <span>{status.label}</span>
            </div>
          </div>
        </div>

        {/* 4 Performance Pillars */}
        <div className="hero-stats-grid">
          {pillars.map((p) => {
            const pctVal = clampPct(p.val);
            return (
              <div key={p.key} className="stat-box">
                <div className="meta">
                  <span className="lbl">{p.label}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {p.reg}
                  </span>
                </div>

                <div className="meta" style={{ alignItems: 'baseline', marginTop: 2 }}>
                  <span className="num" style={{ color: p.color }}>
                    {formatPct(p.val, 1)}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {p.desc}
                  </span>
                </div>

                <div className="scada-progress" style={{ marginTop: 6 }}>
                  <div
                    className="scada-progress-bar"
                    style={{
                      width: `${pctVal}%`,
                      backgroundColor: p.color,
                      boxShadow: `0 0 10px ${p.color}40`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
