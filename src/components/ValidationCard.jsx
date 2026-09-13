import React from 'react';
import { ShieldCheck, Check, AlertOctagon } from 'lucide-react';
import { computeValidation } from '../data/oeeCalculator';

export default function ValidationCard({ dayData, shiftMetrics }) {
  const validation = computeValidation(shiftMetrics);
  const diff = Math.abs(validation.excel - validation.plc);
  const isPass = diff <= 1.0;

  return (
    <div className="scada-card span-4">
      <div className="card-header">
        <div className="card-title">
          <ShieldCheck size={16} style={{ color: 'var(--teal)' }} />
          <span>Fidelity & Logic Validation</span>
        </div>
        <div className="card-badge-hint">
          Excel vs PLC (D236)
        </div>
      </div>

      <div className="val-card-body">
        <div className="val-kpi-row">
          <div className="val-metric-pair">
            <div className="val-item">
              <span className="lbl">Excel Truth</span>
              <span className="val">{validation.excel.toFixed(2)}%</span>
            </div>
            <div className="val-item">
              <span className="lbl">PLC (D236)</span>
              <span className="val">{validation.plc.toFixed(2)}%</span>
            </div>
          </div>

          <span className={`validation-status-badge ${isPass ? 'pass' : 'fail'}`}>
            {isPass ? <Check size={14} /> : <AlertOctagon size={14} />}
            <span>{isPass ? 'PASS' : 'FAIL'}</span>
          </span>
        </div>

        <div className="val-explanation">
          Discrepancy: <code>{diff.toFixed(2)} pts</code>. Compares register <code>D236 OEE</code> computed via Delta EH3-L ladder integer arithmetic against the engineering Excel test model for {dayData.day}.
          Tolerance target is <code>&le; 1.00 pt</code>.
        </div>
      </div>
    </div>
  );
}
