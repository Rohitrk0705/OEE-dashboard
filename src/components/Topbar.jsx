import React from 'react';
import { Layers, Database, Edit3, Download, Play, Pause } from 'lucide-react';

export default function Topbar({
  machines,
  currentMachine,
  onSelectMachine,
  currentDay,
  sourceMode,
  onChangeSourceMode,
  onOpenRegisters,
  onOpenHmi,
  onExportCsv,
  isLiveSimulating,
  onToggleLiveSim,
}) {
  const formattedToday = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="topbar">
      <div className="topbar-header">
        <h1>
          {currentMachine.name}
          <span className="tag-pill" style={{ color: 'var(--teal)', borderColor: 'var(--teal)' }}>
            Station {currentMachine.stationId}
          </span>
        </h1>
        <div className="topbar-meta">
          <span>Line {currentMachine.line}</span>
          <span>•</span>
          <span>Shift-1 (06:00 – 14:00)</span>
          <span>•</span>
          <span>Part {currentMachine.sapPartNumber}</span>
          <span>•</span>
          <span>{formattedToday}</span>
        </div>
      </div>

      <div className="topbar-actions">
        {/* Machine Quick Selector Dropdown */}
        <div className="action-chip">
          <Layers size={15} style={{ color: 'var(--cyan)' }} />
          <select
            value={currentMachine.id}
            onChange={(e) => {
              const selected = machines.find((m) => m.id === e.target.value);
              if (selected) onSelectMachine(selected);
            }}
            aria-label="Select Machine"
          >
            {machines.map((m, idx) => (
              <option key={m.id} value={m.id}>
                M{idx + 1}: {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Live Simulation Toggle */}
        <button
          className={`action-chip ${isLiveSimulating ? 'primary' : ''}`}
          onClick={onToggleLiveSim}
          title={isLiveSimulating ? 'Pause Telemetry Simulation' : 'Start Live Cycle Simulation'}
        >
          {isLiveSimulating ? <Pause size={14} /> : <Play size={14} />}
          <span>{isLiveSimulating ? 'Simulating Live' : 'Simulate Feed'}</span>
        </button>

        {/* Data Feed Mode Dropdown */}
        <div className="action-chip">
          <Database size={14} style={{ color: 'var(--teal)' }} />
          <select
            value={sourceMode}
            onChange={(e) => onChangeSourceMode(e.target.value)}
            aria-label="Data Feed Source"
          >
            <option value="demo">Demo Data (Snapshot)</option>
            <option value="manual">Manual HMI Feed</option>
            <option value="plc">PLC Live (Modbus/TCP)</option>
          </select>
        </div>

        {/* PLC Register Inspector Button */}
        <button
          className="action-chip"
          onClick={onOpenRegisters}
          title="Inspect Delta EH3-L Register Mapping"
        >
          <span>Registers (D100–D237)</span>
        </button>

        {/* Manual HMI Editor Button */}
        <button
          className="action-chip"
          onClick={onOpenHmi}
          title="Manual Production / Loss Overwrite"
        >
          <Edit3 size={14} />
          <span>Edit Shift</span>
        </button>

        {/* Export Data Button */}
        <button
          className="action-chip"
          onClick={onExportCsv}
          title="Export CSV Shift Telemetry Report"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>
    </header>
  );
}
