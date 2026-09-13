import React, { useState, useEffect } from 'react';
import { INITIAL_MACHINES } from './data/plcData';
import { computeShift } from './data/oeeCalculator';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DaySelector from './components/DaySelector';
import HeroOeeCard from './components/HeroOeeCard';
import ProductionCard from './components/ProductionCard';
import LossBreakdownCard from './components/LossBreakdownCard';
import WeeklyTrendChart from './components/WeeklyTrendChart';
import HistoricalReport from './components/HistoricalReport';
import ValidationCard from './components/ValidationCard';
import PlcRegisterModal from './components/PlcRegisterModal';
import HmiEntryModal from './components/HmiEntryModal';

export default function App() {
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [currentMachineId, setCurrentMachineId] = useState('m1');
  const [currentDayIndex, setCurrentDayIndex] = useState(4); // Default: Friday (latest)
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('oee-theme') || 'dark';
  });

  const [sourceMode, setSourceMode] = useState('demo');
  const [isLiveSimulating, setIsLiveSimulating] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('');

  const [showRegistersModal, setShowRegistersModal] = useState(false);
  const [showHmiModal, setShowHmiModal] = useState(false);

  // Sync theme changes with DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('oee-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Find active machine and day
  const currentMachine = machines.find((m) => m.id === currentMachineId) || machines[0];
  const currentDay = currentMachine.days[currentDayIndex] || currentMachine.days[0];
  const shiftMetrics = computeShift(currentDay);

  // Live Simulation Engine (Ticks good parts when active)
  useEffect(() => {
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [currentMachineId, currentDayIndex]);

  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      setMachines((prevMachines) =>
        prevMachines.map((m) => {
          if (m.id !== currentMachineId) return m;
          const updatedDays = [...m.days];
          const activeDay = { ...updatedDays[currentDayIndex] };
          activeDay.good = (activeDay.good || 0) + 1;
          updatedDays[currentDayIndex] = activeDay;
          return { ...m, days: updatedDays };
        })
      );
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveSimulating, currentMachineId, currentDayIndex]);

  // Handle machine selection
  const handleSelectMachine = (machine) => {
    setCurrentMachineId(machine.id);
    setCurrentDayIndex(machine.days.length - 1);
  };

  // Handle manual HMI data updates
  const handleSaveDayData = (newData) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== currentMachineId) return m;
        const updatedDays = [...m.days];
        updatedDays[currentDayIndex] = {
          ...updatedDays[currentDayIndex],
          ...newData,
        };
        return { ...m, days: updatedDays };
      })
    );
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Export CSV functionality
  const handleExportCsv = () => {
    const headers = [
      'Machine ID',
      'Machine Name',
      'Line',
      'Day',
      'Date',
      'Good Parts',
      'Reject Parts',
      'Total Output',
      'Planned Loss (min)',
      'Unplanned Loss (min)',
      'Availability (%)',
      'Performance (%)',
      'Quality (%)',
      'OEE (%)',
      'Capacity Utilisation (%)',
      'Excel Truth (%)',
      'PLC Truth (%)',
    ];

    const rows = currentMachine.days.map((d) => {
      const s = computeShift(d);
      return [
        currentMachine.id,
        `"${currentMachine.name}"`,
        currentMachine.line,
        d.day,
        d.date,
        d.good,
        d.reject,
        s.totalCount,
        s.plannedLoss,
        s.unplannedLoss,
        (s.availability * 100).toFixed(2),
        (s.performance * 100).toFixed(2),
        (s.quality * 100).toFixed(2),
        (s.oee * 100).toFixed(2),
        (s.capacityUtil * 100).toFixed(2),
        d.validation.excel.toFixed(2),
        d.validation.plc.toFixed(2),
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OEE_Report_${currentMachine.id}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        machines={machines}
        currentMachine={currentMachine}
        onSelectMachine={handleSelectMachine}
        theme={theme}
        onToggleTheme={toggleTheme}
        sourceMode={sourceMode}
        lastSyncTime={lastSyncTime}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Topbar Header */}
        <Topbar
          machines={machines}
          currentMachine={currentMachine}
          onSelectMachine={handleSelectMachine}
          currentDay={currentDay}
          sourceMode={sourceMode}
          onChangeSourceMode={setSourceMode}
          onOpenRegisters={() => setShowRegistersModal(true)}
          onOpenHmi={() => setShowHmiModal(true)}
          onExportCsv={handleExportCsv}
          isLiveSimulating={isLiveSimulating}
          onToggleLiveSim={() => setIsLiveSimulating((prev) => !prev)}
        />

        {/* Day Selector Pill Bar */}
        <DaySelector
          days={currentMachine.days}
          activeIndex={currentDayIndex}
          onSelectDay={setCurrentDayIndex}
        />

        {/* Master SCADA Grid */}
        <div className="dashboard-grid">
          {/* Card 1: Hero OEE & 4 Pillars (Span 8) */}
          <HeroOeeCard shiftMetrics={shiftMetrics} />

          {/* Card 2: Production & Yield Output (Span 4) */}
          <ProductionCard dayData={currentDay} shiftMetrics={shiftMetrics} />

          {/* Card 3: Downtime & Loss Breakdown (Span 6) */}
          <LossBreakdownCard dayData={currentDay} shiftMetrics={shiftMetrics} />

          {/* Card 4: Weekly Trend Chart (Span 6) */}
          <WeeklyTrendChart
            days={currentMachine.days}
            activeIndex={currentDayIndex}
            onSelectDay={setCurrentDayIndex}
            theme={theme}
          />

          {/* Card 5: Historical Range Aggregates (Span 8) */}
          <HistoricalReport days={currentMachine.days} onExportCsv={handleExportCsv} />

          {/* Card 6: Logic Validation Excel vs PLC (Span 4) */}
          <ValidationCard dayData={currentDay} />
        </div>

        {/* Footer Reference */}
        <footer className="plant-footer">
          <div>
            Registers referenced follow the PLC–HMI–Web interface spec (Delta EH3-L,{' '}
            <code>D100–D237</code>, <code>M100–M109</code>). 100% calculation logic preserved.
          </div>
          <div>
            Active Station: <code>{currentMachine.stationId}</code> · IP: <code>{currentMachine.plcAddress}</code>
          </div>
        </footer>
      </main>

      {/* Modals */}
      {showRegistersModal && (
        <PlcRegisterModal
          machine={currentMachine}
          day={currentDay}
          shiftMetrics={shiftMetrics}
          onClose={() => setShowRegistersModal(false)}
        />
      )}

      {showHmiModal && (
        <HmiEntryModal
          day={currentDay}
          onSaveDayData={handleSaveDayData}
          onClose={() => setShowHmiModal(false)}
        />
      )}
    </div>
  );
}
