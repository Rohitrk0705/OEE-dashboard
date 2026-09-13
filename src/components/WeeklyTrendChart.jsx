import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { computeShift } from '../data/oeeCalculator';
import { TrendingUp } from 'lucide-react';

export default function WeeklyTrendChart({ days, activeIndex, onSelectDay, theme }) {
  const [metric, setMetric] = useState('oee');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const metricConfigs = {
    oee: { label: 'OEE', color: '#10b981', gradientStart: 'rgba(16, 185, 129, 0.28)', gradientEnd: 'rgba(16, 185, 129, 0.01)' },
    availability: { label: 'Availability', color: '#3b82f6', gradientStart: 'rgba(59, 130, 246, 0.28)', gradientEnd: 'rgba(59, 130, 246, 0.01)' },
    performance: { label: 'Performance', color: '#f59e0b', gradientStart: 'rgba(245, 158, 11, 0.28)', gradientEnd: 'rgba(245, 158, 11, 0.01)' },
    quality: { label: 'Quality', color: '#ef4444', gradientStart: 'rgba(239, 68, 68, 0.28)', gradientEnd: 'rgba(239, 68, 68, 0.01)' },
  };

  const activeConfig = metricConfigs[metric];

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    const labels = days.map((d) => d.day);
    const data = days.map((d) => {
      const shift = computeShift(d);
      return Number((shift[metric] * 100).toFixed(1));
    });

    // Create subtle gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, activeConfig.gradientStart);
    gradient.addColorStop(1, activeConfig.gradientEnd);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const isDark = theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: activeConfig.label,
            data,
            borderColor: activeConfig.color,
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.36,
            pointBackgroundColor: labels.map((_, i) =>
              i === activeIndex ? activeConfig.color : isDark ? '#111a2d' : '#ffffff'
            ),
            pointBorderColor: activeConfig.color,
            pointBorderWidth: 2,
            pointRadius: labels.map((_, i) => (i === activeIndex ? 7 : 4.5)),
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#0b111e' : '#ffffff',
            titleColor: isDark ? '#f8fafc' : '#0f172a',
            bodyColor: isDark ? '#94a3b8' : '#475569',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'JetBrains Mono', size: 12 },
            callbacks: {
              label: (context) => ` ${activeConfig.label}: ${context.parsed.y.toFixed(1)}%`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: 'JetBrains Mono', size: 11, weight: '600' },
            },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: 'JetBrains Mono', size: 11 },
              callback: (v) => `${v}%`,
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedIndex = elements[0].index;
            onSelectDay(clickedIndex);
          }
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [days, activeIndex, metric, theme]);

  return (
    <div className="scada-card span-6">
      <div className="card-header">
        <div className="card-title">
          <TrendingUp size={16} style={{ color: 'var(--teal)' }} />
          <span>Weekly Performance Trend</span>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="trend-metric-toggles">
          {Object.keys(metricConfigs).map((k) => (
            <button
              key={k}
              className={`trend-metric-btn ${metric === k ? 'active' : ''}`}
              onClick={() => setMetric(k)}
            >
              {metricConfigs[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-canvas-wrapper">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
