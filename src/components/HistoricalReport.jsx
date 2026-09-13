import React, { useState } from 'react';
import { computeAggregate, formatPct } from '../data/oeeCalculator';
import { History, FileText } from 'lucide-react';

export default function HistoricalReport({ days, onExportCsv }) {
  const [fromDate, setFromDate] = useState(() => new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Filter days within the selected date range, then compute aggregate metrics
  const filteredDays = days.filter((d) => d.date >= fromDate && d.date <= toDate);
  const stats = computeAggregate(filteredDays);

  const tiles = [
    { label: 'Average OEE', val: formatPct(stats.avgOee, 1), color: 'var(--teal)' },
    { label: 'Average Availability', val: formatPct(stats.avgAvail, 1), color: 'var(--blue)' },
    { label: 'Average Performance', val: formatPct(stats.avgPerf, 1), color: 'var(--amber)' },
    { label: 'Average Quality', val: formatPct(stats.avgQual, 1), color: 'var(--rose)' },
    { label: 'Total Production', val: `${stats.totalProd.toLocaleString()} pcs`, color: 'var(--text-primary)' },
    { label: 'Total Rejects', val: `${stats.totalReject.toLocaleString()} pcs`, color: 'var(--rose)' },
    { label: 'Total Planned Loss', val: `${stats.totalPlannedLoss} min`, color: 'var(--blue)' },
    { label: 'Total Unplanned Loss', val: `${stats.totalUnplannedLoss} min`, color: 'var(--amber)' },
  ];

  return (
    <div className="scada-card span-8">
      <div className="card-header">
        <div className="card-title">
          <History size={16} style={{ color: 'var(--cyan)' }} />
          <span>Historical Shift Aggregates & Audit</span>
        </div>
        <div className="card-badge-hint">
          {stats.shiftCount} Shifts Analysed
        </div>
      </div>

      <div className="hist-filter-row">
        <div className="hist-input-group">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="hist-input-group">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          className="action-chip"
          style={{ height: '36px', marginTop: 'auto' }}
          onClick={() => onExportCsv(filteredDays)}
        >
          <FileText size={14} />
          <span>Export Historical CSV</span>
        </button>
      </div>

      <div className="kpi-stat-deck">
        {tiles.map((t, idx) => (
          <div key={idx} className="kpi-stat-tile">
            <span className="title">{t.label}</span>
            <span className="metric" style={{ color: t.color }}>
              {t.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
