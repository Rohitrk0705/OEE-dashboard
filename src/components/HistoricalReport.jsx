import React, { useState } from 'react';
import { computeAggregate, formatPct } from '../data/oeeCalculator';
import { History, Calendar, FileText, CheckCircle } from 'lucide-react';

export default function HistoricalReport({ days, onExportCsv }) {
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState(weekAgo);
  const [toDate, setToDate] = useState(today);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Compute aggregate metrics across all days in range (or all loaded days)
  const stats = computeAggregate(days);

  const handleGenerate = () => {
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 2000);
  };

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
          className="action-chip primary"
          style={{ height: '36px', marginTop: 'auto' }}
          onClick={handleGenerate}
        >
          {reportGenerated ? <CheckCircle size={14} /> : <FileText size={14} />}
          <span>{reportGenerated ? 'Updated!' : 'Generate Report'}</span>
        </button>

        <button
          className="action-chip"
          style={{ height: '36px', marginTop: 'auto' }}
          onClick={onExportCsv}
        >
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
