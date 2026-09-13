/**
 * PLC Dataset & Architecture Definitions
 * Matches Delta EH3-L Register Mapping (D100-D237, M100-M109)
 */

export const LOSS_CODES = [
  { code: 'TB',  label: 'Tea breaks',             type: 'planned',   category: 'Breaks' },
  { code: 'LD',  label: 'Lunch / dinner break',   type: 'planned',   category: 'Breaks' },
  { code: 'TG',  label: 'Training',               type: 'planned',   category: 'Organisational' },
  { code: 'TL',  label: 'Trial',                  type: 'planned',   category: 'Setup & Trial' },
  { code: 'SUL', label: 'Startup loss',           type: 'planned',   category: 'Startup' },
  { code: 'PM',  label: 'Preventive maintenance', type: 'planned',   category: 'Maintenance' },
  { code: 'SA',  label: 'Setup & adjustment',     type: 'unplanned', category: 'Tooling & Setup' },
  { code: 'TC',  label: 'Tool / jig change',      type: 'unplanned', category: 'Tooling & Setup' },
  { code: 'ML',  label: 'Motion / material move', type: 'unplanned', category: 'Logistics' },
  { code: 'BD',  label: 'Breakdown / power cut',  type: 'unplanned', category: 'Equipment Failure' },
  { code: 'RR',  label: 'Rework / rejection',     type: 'unplanned', category: 'Quality Defect' },
  { code: 'LB',  label: 'Line balancing',         type: 'unplanned', category: 'Line Operations' },
  { code: 'NM',  label: 'No raw material',        type: 'unplanned', category: 'Starvation' },
  { code: 'NL',  label: 'No labour',              type: 'unplanned', category: 'Manpower' },
  { code: 'IN',  label: 'Inspection',             type: 'unplanned', category: 'Quality Check' },
];

export const INITIAL_MACHINES = [
  {
    id: 'm1',
    name: 'End-Closure Bonding Station',
    line: '1',
    status: 'run',
    plcAddress: '192.168.1.101:502',
    model: 'Delta DVP-EH3-L',
    stationId: 'STA-ECB-01',
    sapPartNumber: 'BND-4420-A',
    targetOee: 0.85,
    days: [
      {
        day: 'Mon',
        date: '2026-09-08',
        shiftLengthHrs: 8,
        sapCycleMin: 2.5,
        good: 98,
        reject: 2,
        lossMinutes: { TB: 30, LD: 30, TG: 0, TL: 40, SUL: 10, PM: 0, SA: 60, TC: 0, ML: 10, BD: 0, RR: 0, LB: 0, NM: 0, NL: 0, IN: 0 }
      },
      {
        day: 'Tue',
        date: '2026-09-09',
        shiftLengthHrs: 8,
        sapCycleMin: 2.5,
        good: 88,
        reject: 2,
        lossMinutes: { TB: 30, LD: 30, TG: 30, TL: 0, SUL: 15, PM: 0, SA: 0, TC: 15, ML: 0, BD: 0, RR: 0, LB: 0, NM: 0, NL: 0, IN: 0 }
      },
      {
        day: 'Wed',
        date: '2026-09-10',
        shiftLengthHrs: 8,
        sapCycleMin: 2.5,
        good: 98,
        reject: 2,
        lossMinutes: { TB: 30, LD: 30, TG: 90, TL: 0, SUL: 15, PM: 0, SA: 30, TC: 0, ML: 15, BD: 0, RR: 0, LB: 0, NM: 0, NL: 0, IN: 0 }
      },
      {
        day: 'Thu',
        date: '2026-09-11',
        shiftLengthHrs: 8,
        sapCycleMin: 2.5,
        good: 79,
        reject: 9,
        lossMinutes: { TB: 30, LD: 30, TG: 30, TL: 120, SUL: 15, PM: 0, SA: 0, TC: 0, ML: 20, BD: 0, RR: 0, LB: 0, NM: 0, NL: 0, IN: 0 }
      },
      {
        day: 'Fri',
        date: '2026-09-12',
        shiftLengthHrs: 8,
        sapCycleMin: 2.5,
        good: 85,
        reject: 8,
        lossMinutes: { TB: 30, LD: 30, TG: 0, TL: 0, SUL: 10, PM: 0, SA: 60, TC: 60, ML: 25, BD: 40, RR: 0, LB: 0, NM: 30, NL: 60, IN: 0 }
      },
    ]
  },
  {
    id: 'm2',
    name: 'Side-Seam Bonding Line',
    line: '2',
    status: 'run',
    plcAddress: '192.168.1.102:502',
    model: 'Delta DVP-EH3-L',
    stationId: 'STA-SSB-02',
    sapPartNumber: 'SSB-2210-C',
    targetOee: 0.85,
    days: [
      {
        day: 'Mon',
        date: '2026-09-08',
        shiftLengthHrs: 8,
        sapCycleMin: 2.2,
        good: 78,
        reject: 2,
        lossMinutes: { TB: 30, LD: 30, TG: 60, TL: 40, SUL: 10, PM: 0, SA: 60, TC: 0, ML: 10, BD: 0, RR: 0, LB: 0, NM: 0, NL: 0, IN: 60 }
      },
      {
        day: 'Tue',
        date: '2026-09-09',
        shiftLengthHrs: 8,
        sapCycleMin: 2.2,
        good: 91,
        reject: 10,
        lossMinutes: { TB: 30, LD: 30, TG: 0, TL: 0, SUL: 0, PM: 0, SA: 90, TC: 60, ML: 0, BD: 60, RR: 0, LB: 0, NM: 0, NL: 0, IN: 0 }
      },
      {
        day: 'Wed',
        date: '2026-09-10',
        shiftLengthHrs: 8,
        sapCycleMin: 2.2,
        good: 90,
        reject: 2,
        lossMinutes: { TB: 30, LD: 30, TG: 90, TL: 0, SUL: 15, PM: 0, SA: 30, TC: 0, ML: 15, BD: 0, RR: 0, LB: 0, NM: 0, NL: 45, IN: 0 }
      },
      {
        day: 'Thu',
        date: '2026-09-11',
        shiftLengthHrs: 8,
        sapCycleMin: 2.2,
        good: 88,
        reject: 2,
        lossMinutes: { TB: 30, LD: 30, TG: 30, TL: 0, SUL: 15, PM: 0, SA: 0, TC: 0, ML: 20, BD: 0, RR: 0, LB: 0, NM: 0, NL: 0, IN: 0 }
      },
      {
        day: 'Fri',
        date: '2026-09-12',
        shiftLengthHrs: 8,
        sapCycleMin: 2.2,
        good: 98,
        reject: 10,
        lossMinutes: { TB: 30, LD: 30, TG: 0, TL: 0, SUL: 10, PM: 0, SA: 60, TC: 0, ML: 25, BD: 40, RR: 0, LB: 0, NM: 30, NL: 60, IN: 0 }
      },
    ]
  },
  {
    id: 'm3',
    name: 'Base Forming Press',
    line: '3',
    status: 'idle',
    plcAddress: '192.168.1.103:502',
    model: 'Delta DVP-EH3-L',
    stationId: 'STA-BFP-03',
    sapPartNumber: 'BFP-9900-X',
    targetOee: 0.85,
    days: [
      {
        day: 'Mon',
        date: '2026-09-08',
        shiftLengthHrs: 8,
        sapCycleMin: 2.7,
        good: 65,
        reject: 5,
        lossMinutes: { TB: 30, LD: 30, TG: 0, TL: 0, SUL: 15, PM: 20, SA: 45, TC: 20, ML: 15, BD: 35, RR: 10, LB: 0, NM: 30, NL: 0, IN: 0 }
      },
      {
        day: 'Tue',
        date: '2026-09-09',
        shiftLengthHrs: 8,
        sapCycleMin: 2.7,
        good: 60,
        reject: 6,
        lossMinutes: { TB: 30, LD: 30, TG: 0, TL: 0, SUL: 15, PM: 0, SA: 45, TC: 20, ML: 15, BD: 60, RR: 10, LB: 0, NM: 30, NL: 0, IN: 0 }
      },
      {
        day: 'Wed',
        date: '2026-09-10',
        shiftLengthHrs: 8,
        sapCycleMin: 2.7,
        good: 68,
        reject: 7,
        lossMinutes: { TB: 30, LD: 30, TG: 0, TL: 0, SUL: 15, PM: 0, SA: 30, TC: 20, ML: 15, BD: 30, RR: 10, LB: 0, NM: 15, NL: 0, IN: 0 }
      },
      {
        day: 'Thu',
        date: '2026-09-11',
        shiftLengthHrs: 8,
        sapCycleMin: 2.7,
        good: 55,
        reject: 5,
        lossMinutes: { TB: 30, LD: 30, TG: 0, TL: 0, SUL: 15, PM: 20, SA: 45, TC: 20, ML: 15, BD: 90, RR: 10, LB: 0, NM: 30, NL: 0, IN: 0 }
      },
      {
        day: 'Fri',
        date: '2026-09-12',
        shiftLengthHrs: 8,
        sapCycleMin: 2.7,
        good: 62,
        reject: 6,
        lossMinutes: { TB: 30, LD: 30, TG: 0, TL: 0, SUL: 15, PM: 0, SA: 45, TC: 20, ML: 15, BD: 50, RR: 10, LB: 0, NM: 30, NL: 0, IN: 0 }
      },
    ]
  }
];

export const PLC_REGISTER_SCHEMA = [
  { register: 'D100', name: 'Shift Length (Hours)', unit: 'hrs', format: 'INT' },
  { register: 'D101', name: 'SAP Target Cycle Time', unit: 'min', format: 'FLOAT' },
  { register: 'D102', name: 'Good Parts Counter', unit: 'pcs', format: 'DWORD' },
  { register: 'D103', name: 'Reject Parts Counter', unit: 'pcs', format: 'DWORD' },
  { register: 'D105', name: 'Total Quantity (D102+D103)', unit: 'pcs', format: 'DWORD' },
  { register: 'D230', name: 'Total Planned Time', unit: 'min', format: 'FLOAT' },
  { register: 'D231', name: 'Planned Available Time', unit: 'min', format: 'INT' },
  { register: 'D232', name: 'Actual Operating Time', unit: 'min', format: 'INT' },
  { register: 'D233', name: 'Availability Ratio (A)', unit: '%', format: 'FLOAT' },
  { register: 'D234', name: 'Performance Ratio (P)', unit: '%', format: 'FLOAT' },
  { register: 'D235', name: 'Quality Ratio (Q)', unit: '%', format: 'FLOAT' },
  { register: 'D236', name: 'Overall Equipment Effectiveness (OEE)', unit: '%', format: 'FLOAT' },
  { register: 'D237', name: 'Capacity Utilisation', unit: '%', format: 'FLOAT' },
  { register: 'M100', name: 'Machine Running State Flag', unit: 'bool', format: 'BIT' },
  { register: 'M101', name: 'Active Alarm / Fault Interlock', unit: 'bool', format: 'BIT' },
  { register: 'M102', name: 'Shift In-Progress Flag', unit: 'bool', format: 'BIT' },
];
