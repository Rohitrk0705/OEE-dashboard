import React, { useState } from 'react';
import { LOSS_CODES } from '../data/plcData';
import { Edit3, X, Save } from 'lucide-react';

export default function HmiEntryModal({ day, onSaveDayData, onClose }) {
  const [formData, setFormData] = useState({
    good: day.good || 0,
    reject: day.reject || 0,
    sapCycleMin: day.sapCycleMin || 2.5,
    shiftLengthHrs: day.shiftLengthHrs || 8,
    lossMinutes: { ...(day.lossMinutes || {}) },
  });

  const handleCountChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, Number(val) || 0),
    }));
  };

  const handleLossChange = (code, val) => {
    setFormData((prev) => ({
      ...prev,
      lossMinutes: {
        ...prev.lossMinutes,
        [code]: Math.max(0, Number(val) || 0),
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveDayData(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <div className="modal-header">
          <h3>
            <Edit3 size={18} style={{ color: 'var(--amber)' }} />
            <span>Manual HMI Entry & Shift Override ({day.day})</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Primary Counts Section */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                1. Production Part Counters
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <div className="hist-input-group">
                  <label>Good Parts (D102)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.good}
                    onChange={(e) => handleCountChange('good', e.target.value)}
                  />
                </div>

                <div className="hist-input-group">
                  <label>Reject Parts (D103)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reject}
                    onChange={(e) => handleCountChange('reject', e.target.value)}
                  />
                </div>

                <div className="hist-input-group">
                  <label>SAP Cycle Time (min)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.sapCycleMin}
                    onChange={(e) => handleCountChange('sapCycleMin', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Loss Minutes Section */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                2. Downtime & Stoppage Minutes (Planned / Unplanned)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {LOSS_CODES.map((l) => (
                  <div key={l.code} className="hist-input-group">
                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{l.code} — {l.label}</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lossMinutes[l.code] || 0}
                      onChange={(e) => handleLossChange(l.code, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            <button type="button" className="action-chip" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="action-chip primary">
              <Save size={14} />
              <span>Apply & Recalculate OEE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
