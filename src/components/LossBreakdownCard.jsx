import React, { useState } from 'react';
import { LOSS_CODES } from '../data/plcData';
import { Clock } from 'lucide-react';

export default function LossBreakdownCard({ dayData, shiftMetrics }) {
  const [filterType, setFilterType] = useState('all');

  const lossMinutes = dayData.lossMinutes || {};
  
  // Filter and sort active losses by duration (Pareto order)
  const activeLosses = LOSS_CODES
    .filter((l) => (lossMinutes[l.code] || 0) > 0)
    .filter((l) => filterType === 'all' || l.type === filterType)
    .sort((a, b) => (lossMinutes[b.code] || 0) - (lossMinutes[a.code] || 0));

  const maxLossMin = Math.max(1, ...LOSS_CODES.map((l) => lossMinutes[l.code] || 0));

  return (
    <div className="scada-card span-6">
      <div className="card-header">
        <div className="card-title">
          <Clock size={16} style={{ color: 'var(--amber)' }} />
          <span>Downtime & Loss Breakdown</span>
        </div>
        <div className="card-badge-hint">
          {shiftMetrics.totalLoss} min total
        </div>
      </div>

      {/* Planned vs Unplanned Summary Cards */}
      <div className="loss-summary-deck">
        <div className="loss-summary-card planned">
          <span className="type">Planned Stoppages</span>
          <span className="val">{shiftMetrics.plannedLoss} min</span>
        </div>
        <div className="loss-summary-card unplanned">
          <span className="type">Unplanned Losses</span>
          <span className="val">{shiftMetrics.unplannedLoss} min</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="loss-filter-tabs">
        <button
          className={`loss-tab-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All ({LOSS_CODES.filter((l) => (lossMinutes[l.code] || 0) > 0).length})
        </button>
        <button
          className={`loss-tab-btn ${filterType === 'planned' ? 'active' : ''}`}
          onClick={() => setFilterType('planned')}
        >
          Planned
        </button>
        <button
          className={`loss-tab-btn ${filterType === 'unplanned' ? 'active' : ''}`}
          onClick={() => setFilterType('unplanned')}
        >
          Unplanned
        </button>
      </div>

      {/* Pareto Loss List */}
      <div className="loss-scroll-list">
        {activeLosses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '12px' }}>
            No losses recorded under this filter.
          </div>
        ) : (
          activeLosses.map((l) => {
            const mins = lossMinutes[l.code] || 0;
            const barWidth = ((mins / maxLossMin) * 100).toFixed(0);
            const isPlanned = l.type === 'planned';

            return (
              <div key={l.code} className="loss-row-item">
                <span className="loss-badge-code">{l.code}</span>
                <div className="loss-bar-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {l.label}
                    </span>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      {l.category}
                    </span>
                  </div>
                  <div className="loss-bar-track">
                    <div
                      className="loss-bar-fill"
                      style={{
                        width: `${barWidth}%`,
                        background: isPlanned
                          ? 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)'
                          : 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
                      }}
                    />
                  </div>
                </div>
                <span className="loss-min-digits">{mins}m</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
