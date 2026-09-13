import React from 'react';
import { Package, Check, X, Disc } from 'lucide-react';

export default function ProductionCard({ dayData, shiftMetrics }) {
  const good = dayData.good || 0;
  const reject = dayData.reject || 0;
  const total = shiftMetrics.totalCount || 0;
  
  const goodPct = total > 0 ? (good / total) * 100 : 0;
  const rejectPct = total > 0 ? (reject / total) * 100 : 0;

  return (
    <div className="scada-card span-4">
      <div className="card-header">
        <div className="card-title">
          <Package size={16} style={{ color: 'var(--cyan)' }} />
          <span>Production Output</span>
        </div>
        <div className="card-badge-hint">
          {dayData.day} Shift-1
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div className="prod-metric-row">
          <span className="name">
            <Check size={14} style={{ color: 'var(--teal)' }} />
            Good Parts (D102)
          </span>
          <span className="qty good">{good.toLocaleString()} pcs</span>
        </div>

        <div className="prod-metric-row">
          <span className="name">
            <X size={14} style={{ color: 'var(--rose)' }} />
            Rejects / Scraps (D103)
          </span>
          <span className="qty reject">{reject.toLocaleString()} pcs</span>
        </div>

        <div className="prod-metric-row">
          <span className="name">
            <Disc size={14} style={{ color: 'var(--text-muted)' }} />
            Total Produced (D105)
          </span>
          <span className="qty">{total.toLocaleString()} pcs</span>
        </div>
      </div>

      <div className="yield-bar-wrapper">
        <div className="yield-segmented-bar">
          <div
            className="seg-good"
            style={{ width: `${goodPct}%` }}
            title={`Good: ${goodPct.toFixed(1)}%`}
          />
          <div
            className="seg-reject"
            style={{ width: `${rejectPct}%` }}
            title={`Reject: ${rejectPct.toFixed(1)}%`}
          />
        </div>

        <div className="yield-meta-footer">
          <span>Yield: {goodPct.toFixed(1)}%</span>
          <span>Defect PPM: {shiftMetrics.scrapPpm.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
