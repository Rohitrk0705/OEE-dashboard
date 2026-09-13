import React from 'react';
import { computeShift, formatPct } from '../data/oeeCalculator';
import { Calendar } from 'lucide-react';

export default function DaySelector({ days, activeIndex, onSelectDay }) {
  return (
    <div className="day-selector-bar">
      <div className="day-bar-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Calendar size={13} style={{ color: 'var(--teal)' }} />
        <span>Shift Day:</span>
      </div>

      <div className="day-pill-list">
        {days.map((d, idx) => {
          const shiftMetrics = computeShift(d);
          const isActive = idx === activeIndex;
          const oeePct = formatPct(shiftMetrics.oee, 1);

          return (
            <button
              key={d.day}
              className={`day-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectDay(idx)}
            >
              <span>{d.day}</span>
              <span
                className="mini-oee"
                style={{
                  color: isActive ? '#ffffff' : shiftMetrics.oee >= 0.65 ? 'var(--teal)' : 'var(--amber)',
                }}
              >
                {oeePct}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
