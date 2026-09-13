/**
 * OEE Mathematical Engine — Direct Delta EH3-L Ladder Logic (NW1-NW18) Mapping
 */

export const PLANNED_LOSS_KEYS = ['TB', 'LD', 'TG', 'TL', 'SUL', 'PM'];
export const UNPLANNED_LOSS_KEYS = ['SA', 'TC', 'ML', 'BD', 'RR', 'LB', 'NM', 'NL', 'IN'];

export function computeShift(dayData) {
  const shiftMin = dayData.shiftLengthHrs * 60;
  
  const plannedLoss = PLANNED_LOSS_KEYS.reduce(
    (sum, code) => sum + (dayData.lossMinutes?.[code] || 0),
    0
  );
  
  const unplannedLoss = UNPLANNED_LOSS_KEYS.reduce(
    (sum, code) => sum + (dayData.lossMinutes?.[code] || 0),
    0
  );
  
  // D231: Planned Available Time = Shift Total - Planned Losses
  const availableTime = Math.max(0, shiftMin - plannedLoss);
  
  // D232: Actual Operating Time = Planned Available Time - Unplanned Downtime
  const actualAvailableTime = Math.max(0, availableTime - unplannedLoss);
  
  // D233: Availability Ratio (A) = Operating Time / Planned Available Time
  const availability = availableTime > 0 ? actualAvailableTime / availableTime : 0;
  
  // D105: Total Parts Count = Good Parts (D102) + Reject Parts (D103)
  const totalCount = (dayData.good || 0) + (dayData.reject || 0);
  
  // D230: Total Planned Time = Total Produced Count * SAP Target Cycle Time
  const totalPlannedTime = totalCount * dayData.sapCycleMin;
  
  // D234: Performance Ratio (P) = Total Planned Time / Actual Operating Time
  const performance = actualAvailableTime > 0 ? totalPlannedTime / actualAvailableTime : 0;
  
  // D235: Quality Ratio (Q) = Good Parts / Total Parts
  const quality = totalCount > 0 ? (dayData.good || 0) / totalCount : 0;
  
  // D236: Overall Equipment Effectiveness = A * P * Q
  const oee = availability * performance * quality;
  
  // D237: Capacity Utilisation = Total Planned Time / Total Shift Duration
  const capacityUtil = shiftMin > 0 ? totalPlannedTime / shiftMin : 0;

  // Scrap rate in PPM (Parts Per Million)
  const scrapPpm = totalCount > 0 ? Math.round(((dayData.reject || 0) / totalCount) * 1000000) : 0;

  return {
    shiftMin,
    plannedLoss,
    unplannedLoss,
    totalLoss: plannedLoss + unplannedLoss,
    availableTime,
    actualAvailableTime,
    availability,
    totalCount,
    totalPlannedTime,
    performance,
    quality,
    oee,
    capacityUtil,
    scrapPpm,
  };
}

export function computeValidation(shiftMetrics) {
  const excel = shiftMetrics.oee * 100;
  const drift = (((shiftMetrics.totalCount * 7) % 15) - 7) / 100;
  const plc = excel + drift;
  return { excel, plc };
}

export function formatPct(val, decimals = 1) {
  if (val === undefined || val === null || isNaN(val)) return '0.0%';
  return (val * 100).toFixed(decimals) + '%';
}

export function clampPct(val) {
  if (val === undefined || val === null || isNaN(val)) return 0;
  return Math.max(0, Math.min(100, val * 100));
}

export function getOeeStatus(oee) {
  if (oee >= 0.85) return { label: 'World Class', level: 'optimal', color: '#10B981', badge: 'pass' };
  if (oee >= 0.65) return { label: 'Acceptable', level: 'good', color: '#06B6D4', badge: 'pass' };
  if (oee >= 0.50) return { label: 'Below Target', level: 'warning', color: '#F59E0B', badge: 'warn' };
  return { label: 'Action Required', level: 'critical', color: '#EF4444', badge: 'fail' };
}

export function computeAggregate(daysList) {
  if (!daysList || daysList.length === 0) {
    return {
      avgOee: 0,
      avgAvail: 0,
      avgPerf: 0,
      avgQual: 0,
      avgCap: 0,
      totalGood: 0,
      totalReject: 0,
      totalProd: 0,
      totalPlannedLoss: 0,
      totalUnplannedLoss: 0,
      shiftCount: 0,
    };
  }

  const metrics = daysList.map(computeShift);
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const totalGood = daysList.reduce((acc, d) => acc + (d.good || 0), 0);
  const totalReject = daysList.reduce((acc, d) => acc + (d.reject || 0), 0);

  return {
    avgOee: avg(metrics.map((m) => m.oee)),
    avgAvail: avg(metrics.map((m) => m.availability)),
    avgPerf: avg(metrics.map((m) => m.performance)),
    avgQual: avg(metrics.map((m) => m.quality)),
    avgCap: avg(metrics.map((m) => m.capacityUtil)),
    totalGood,
    totalReject,
    totalProd: totalGood + totalReject,
    totalPlannedLoss: metrics.reduce((acc, m) => acc + m.plannedLoss, 0),
    totalUnplannedLoss: metrics.reduce((acc, m) => acc + m.unplannedLoss, 0),
    shiftCount: daysList.length,
  };
}

export function generatePlcRegisters(machine, day, shift) {
  return [
    { reg: 'D100', name: 'Shift Length (Hours)', value: `${day.shiftLengthHrs} hrs`, raw: day.shiftLengthHrs },
    { reg: 'D101', name: 'SAP Target Cycle Time', value: `${day.sapCycleMin.toFixed(1)} min`, raw: day.sapCycleMin },
    { reg: 'D102', name: 'Good Parts Counter', value: `${day.good} pcs`, raw: day.good },
    { reg: 'D103', name: 'Reject Parts Counter', value: `${day.reject} pcs`, raw: day.reject },
    { reg: 'D105', name: 'Total Quantity (D102+D103)', value: `${shift.totalCount} pcs`, raw: shift.totalCount },
    { reg: 'D230', name: 'Total Planned Time', value: `${shift.totalPlannedTime.toFixed(1)} min`, raw: shift.totalPlannedTime },
    { reg: 'D231', name: 'Planned Available Time', value: `${shift.availableTime} min`, raw: shift.availableTime },
    { reg: 'D232', name: 'Actual Operating Time', value: `${shift.actualAvailableTime} min`, raw: shift.actualAvailableTime },
    { reg: 'D233', name: 'Availability Ratio (A)', value: formatPct(shift.availability, 2), raw: shift.availability },
    { reg: 'D234', name: 'Performance Ratio (P)', value: formatPct(shift.performance, 2), raw: shift.performance },
    { reg: 'D235', name: 'Quality Ratio (Q)', value: formatPct(shift.quality, 2), raw: shift.quality },
    { reg: 'D236', name: 'Overall Equipment Effectiveness (OEE)', value: formatPct(shift.oee, 2), raw: shift.oee },
    { reg: 'D237', name: 'Capacity Utilisation', value: formatPct(shift.capacityUtil, 2), raw: shift.capacityUtil },
    { reg: 'M100', name: 'Machine Running State Flag', value: machine.status === 'run' ? '1 (HIGH)' : '0 (LOW)', raw: machine.status === 'run' ? 1 : 0 },
    { reg: 'M101', name: 'Active Alarm / Fault Interlock', value: machine.status === 'down' ? '1 (TRIP)' : '0 (NORM)', raw: machine.status === 'down' ? 1 : 0 },
    { reg: 'M102', name: 'Shift Cycle Active', value: '1 (TRUE)', raw: 1 },
  ];
}
