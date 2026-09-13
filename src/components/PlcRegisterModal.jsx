import React, { useState } from 'react';
import { generatePlcRegisters } from '../data/oeeCalculator';
import { Cpu, X, Copy, Check } from 'lucide-react';

export default function PlcRegisterModal({ machine, day, shiftMetrics, onClose }) {
  const [copiedReg, setCopiedReg] = useState(null);
  const registers = generatePlcRegisters(machine, day, shiftMetrics);

  const handleCopy = (reg, val) => {
    navigator.clipboard.writeText(`${reg}: ${val}`);
    setCopiedReg(reg);
    setTimeout(() => setCopiedReg(null), 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Cpu size={18} style={{ color: 'var(--cyan)' }} />
            <span>Delta EH3-L PLC Register Inspector (Modbus Map)</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: 16, fontSize: 12.5, color: 'var(--text-muted)' }}>
            Inspecting live registers for <strong>{machine.name}</strong> (Line {machine.line}) — Shift <strong>{day.day}</strong>.
            All registers follow Delta DVP-EH3-L memory spec NW1–NW18.
          </div>

          <table className="plc-table">
            <thead>
              <tr>
                <th>Register</th>
                <th>Signal Description</th>
                <th>Engineering Value</th>
                <th>Raw / Hex</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registers.map((r) => (
                <tr key={r.reg}>
                  <td>
                    <span className="plc-reg-badge">{r.reg}</span>
                  </td>
                  <td>{r.name}</td>
                  <td>
                    <span className="plc-val-digit">{r.value}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    {typeof r.raw === 'number' ? `0x${Math.round(r.raw).toString(16).toUpperCase()}` : String(r.raw)}
                  </td>
                  <td>
                    <button
                      className="action-chip"
                      style={{ padding: '4px 8px', fontSize: 11 }}
                      onClick={() => handleCopy(r.reg, r.value)}
                    >
                      {copiedReg === r.reg ? (
                        <>
                          <Check size={12} style={{ color: 'var(--teal)' }} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
