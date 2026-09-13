import React from 'react';
import { Cpu, Activity, Sun, Moon, Radio } from 'lucide-react';

export default function Sidebar({
  machines,
  currentMachine,
  onSelectMachine,
  theme,
  onToggleTheme,
  sourceMode,
  lastSyncTime,
}) {
  return (
    <aside className="sidebar">
      {/* Brand & Theme Header */}
      <div className="brand-wrapper">
        <div className="brand-block">
          <div className="brand-badge">OEE</div>
          <div className="brand-meta">
            <div className="title">
              Plant Monitor
            </div>
            <div className="sub">Delta EH3-L · SCADA v2.4</div>
          </div>
        </div>

        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>

      {/* Machine Selection Section */}
      <div>
        <div className="nav-section-title">
          <span>Production Machines</span>
          <span>{machines.length} Units</span>
        </div>
        <div className="machine-nav-list">
          {machines.map((m, idx) => {
            const isActive = m.id === currentMachine.id;
            return (
              <button
                key={m.id}
                className={`machine-card-nav ${isActive ? 'active' : ''}`}
                onClick={() => onSelectMachine(m)}
              >
                <div className="machine-info">
                  <span className="m-title">
                    M{idx + 1} — {m.name}
                  </span>
                  <span className="m-sub">
                    Line {m.line} · {m.sapPartNumber}
                  </span>
                </div>
                <span
                  className={`status-beacon ${m.status}`}
                  title={`Status: ${m.status.toUpperCase()}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* PLC Link Diagnostics */}
      <div className="plc-diagnostics">
        <div className="nav-section-title" style={{ margin: 0, paddingBottom: 4 }}>
          <span>Telemetry Health</span>
          <Radio size={13} style={{ color: 'var(--teal)' }} />
        </div>

        <div className="diag-row">
          <span>PLC Link</span>
          <span className="diag-val live">
            <span className="diag-dot"></span>
            {sourceMode === 'plc' ? 'LIVE (192.168.1.101)' : sourceMode === 'sim' ? 'SIMULATED FEED' : 'MANUAL HMI'}
          </span>
        </div>

        <div className="diag-row">
          <span>Scan Cycle</span>
          <span className="diag-val">12 ms · Modbus TCP</span>
        </div>

        <div className="diag-row">
          <span>Last Sync</span>
          <span className="diag-val">{lastSyncTime || 'Just now'}</span>
        </div>

        <div className="diag-row">
          <span>Engine</span>
          <span className="diag-val">Delta Ladder NW1–18</span>
        </div>
      </div>
    </aside>
  );
}
