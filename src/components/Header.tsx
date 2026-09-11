import React, { useState, useEffect } from 'react';
import { Cpu, Calendar, Zap, RefreshCw, FileText, Plus, ShieldCheck, Clock, Layers, Radio, Activity, Terminal } from 'lucide-react';
import { SocProjectInfo } from '../types';

interface HeaderProps {
  project: SocProjectInfo;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewLog: () => void;
  onOpenReport: () => void;
  onRunRegression: () => void;
  isSimulatingRegression: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  activeTab,
  setActiveTab,
  onOpenNewLog,
  onOpenReport,
  onRunRegression,
  isSimulatingRegression,
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 68, hours: 12, minutes: 34, seconds: 18 });

  useEffect(() => {
    const targetDate = new Date(project.tapeOutTargetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [project.tapeOutTargetDate]);

  const navItems = [
    { id: 'overview', index: '01', label: 'Silício & Floorplan', icon: Cpu },
    { id: 'pipeline', index: '02', label: 'Esteira ASIC Flow', icon: Layers },
    { id: 'ppa', index: '03', label: 'PPA & Timing STA', icon: Zap },
    { id: 'verif', index: '04', label: 'Cockpit UVM & Bugs', icon: ShieldCheck },
    { id: 'roadmap', index: '05', label: 'Marcos & Shuttle', icon: Calendar },
    { id: 'logs', index: '06', label: 'Diário de Engenharia', icon: Clock },
  ];

  return (
    <header className="border-b border-[#222938] bg-[#0c0e14]/95 backdrop-blur-md sticky top-0 z-30 font-sans shadow-2xl">
      {/* Precision Foundry Micro-Ticker / Status Bar */}
      <div className="border-b border-[#1a1f2b] bg-[#08090d] px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between text-[11px] font-mono select-none">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            FOUNDRY STATUS: TSMC TAINAN FAB 18A
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">PDK: <strong className="text-slate-200">TSMC_N4P_v1.4b</strong></span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">RETICLE: <strong className="text-slate-200">26.0 × 33.0 mm</strong></span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-slate-500 font-mono hidden lg:inline">COORDINATES: X:+14.82 Y:+08.40</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-mono">
            DRC: 0 ERR
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80 font-mono">
            LVS: CLEAN
          </span>
        </div>
      </div>

      {/* Main Bar with SoC identity & Countdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Silicon Identity */}
        <div className="flex items-center gap-3.5">
          {/* Authentic Physical Silicon Die Emblem */}
          <div className="relative h-11 w-11 rounded-lg bg-[#141824] p-0.5 border border-amber-500/40 shadow-inner flex items-center justify-center reticle-corner group">
            <div className="w-full h-full bg-[#090b10] rounded-[6px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(245,158,11,0.08)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
              <Cpu className="h-5 w-5 text-amber-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
                {project.name}
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#161a26] text-amber-300 border border-amber-500/30 font-mono font-medium">
                  {project.codeName}
                </span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                SIGN-OFF A0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
              <span className="text-slate-300">{project.node} FinFET</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">{project.foundry}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400/90">{project.totalTransistors} transistores</span>
            </p>
          </div>
        </div>

        {/* Tape-Out Hardware Segmented Countdown & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
          {/* Segmented Countdown Unit */}
          <div className="bg-[#090b10] border border-[#262e3f] rounded-lg px-3 py-1.5 flex items-center gap-3 shadow-inner">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
              <Radio className="h-3 w-3 text-amber-400 animate-pulse" />
              <span>TAPE-OUT T-MINUS:</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-xs tracking-wider">
              <div className="bg-[#121622] border border-[#22293b] px-1.5 py-0.5 rounded text-amber-300">
                {String(timeLeft.days).padStart(3, '0')}<span className="text-[9px] text-slate-500 font-normal ml-0.5">D</span>
              </div>
              <span className="text-amber-500/50">:</span>
              <div className="bg-[#121622] border border-[#22293b] px-1.5 py-0.5 rounded text-slate-200">
                {String(timeLeft.hours).padStart(2, '0')}<span className="text-[9px] text-slate-500 font-normal ml-0.5">H</span>
              </div>
              <span className="text-amber-500/50">:</span>
              <div className="bg-[#121622] border border-[#22293b] px-1.5 py-0.5 rounded text-slate-200">
                {String(timeLeft.minutes).padStart(2, '0')}<span className="text-[9px] text-slate-500 font-normal ml-0.5">M</span>
              </div>
              <span className="text-amber-500/50">:</span>
              <div className="bg-[#121622] border border-[#22293b] px-1.5 py-0.5 rounded text-amber-400">
                {String(timeLeft.seconds).padStart(2, '0')}<span className="text-[9px] text-slate-500 font-normal ml-0.5">S</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-run-regression"
              onClick={onRunRegression}
              disabled={isSimulatingRegression}
              title="Executar bateria de testes de regressão randômica no cluster LSF"
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#131722] hover:bg-[#1a2130] text-slate-200 border border-[#293245] flex items-center gap-1.5 transition-all disabled:opacity-50 hover:border-amber-500/40"
            >
              <RefreshCw className={`h-3 w-3 text-amber-400 ${isSimulatingRegression ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSimulatingRegression ? 'Simulando...' : 'Regressão UVM'}</span>
            </button>

            <button
              id="btn-new-log"
              onClick={onOpenNewLog}
              title="Registrar nota técnica ou marco de engenharia"
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#131722] hover:bg-[#1a2130] text-slate-200 border border-[#293245] flex items-center gap-1.5 transition-all hover:border-emerald-500/40"
            >
              <Plus className="h-3 w-3 text-emerald-400" />
              <span className="hidden sm:inline">Nova Nota</span>
            </button>

            <button
              id="btn-export-report"
              onClick={onOpenReport}
              title="Visualizar relatório executivo do SoC para a Foundry"
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-amber-500 hover:bg-amber-400 text-[#090b10] shadow-sm shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Dossier de Tape-Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Industrial Segmented Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1a1f2b]">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-1.5 scrollbar-none" aria-label="Tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-2 transition-all relative ${
                  isActive
                    ? 'bg-[#181d2a] text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121622] border border-transparent'
                }`}
              >
                <span className={`text-[10px] font-bold ${isActive ? 'text-amber-400' : 'text-slate-600'}`}>
                  [{item.index}]
                </span>
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
