import React from 'react';
import { SocProjectInfo, BugRecord } from '../types';
import { CheckCircle2, AlertTriangle, Cpu, Zap, Activity, Bug } from 'lucide-react';

interface MetricCardsProps {
  project: SocProjectInfo;
  bugs: BugRecord[];
  globalCoverage: number;
  passRate: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  project,
  bugs,
  globalCoverage,
  passRate,
}) => {
  const p0Bugs = bugs.filter((b) => b.severity === 'P0_Blocker' && b.status !== 'Closed').length;
  const p1Bugs = bugs.filter((b) => b.severity === 'P1_Critical' && b.status !== 'Closed').length;
  const activeBugsCount = bugs.filter((b) => b.status !== 'Closed').length;

  const areaPercent = Math.round((project.currentEstimatedAreaMm2 / project.targetAreaBudgetMm2) * 100);
  const powerPercent = Math.round((project.currentEstimatedTdpW / project.targetTdpW) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
      {/* 1. Tape-out Readiness */}
      <div className="bg-[#0e111a] border border-[#222938] rounded-lg p-3 flex flex-col justify-between shadow-md relative group hover:border-amber-500/50 transition-all reticle-corner">
        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
          <span className="text-amber-400/90 font-semibold">[M01] PRONTIDÃO</span>
          <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
        </div>
        <div className="my-1">
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1">
            {project.overallReadinessPercent}<span className="text-xs text-amber-400 font-normal">%</span>
          </div>
          <p className="text-[10px] font-mono text-slate-400">GDSII FREEZE: 87%</p>
        </div>
        {/* Hardware Segmented Bar */}
        <div className="w-full bg-[#161a26] h-1.5 rounded-sm mt-2 overflow-hidden flex gap-0.5">
          {Array.from({ length: 12 }).map((_, i) => {
            const filled = (i / 12) * 100 <= project.overallReadinessPercent;
            return (
              <div
                key={i}
                className={`flex-1 h-full rounded-[1px] transition-all ${
                  filled ? 'bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.5)]' : 'bg-[#1e2433]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Silicon Area (Die Size) */}
      <div className="bg-[#0e111a] border border-[#222938] rounded-lg p-3 flex flex-col justify-between shadow-md relative group hover:border-slate-600 transition-all reticle-corner">
        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
          <span className="text-slate-300 font-semibold">[M02] ÁREA DO DIE</span>
          <Cpu className="h-3.5 w-3.5 text-slate-300" />
        </div>
        <div className="my-1">
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1">
            {project.currentEstimatedAreaMm2} <span className="text-xs font-normal text-slate-400">mm²</span>
          </div>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <span>+{project.targetAreaBudgetMm2 - project.currentEstimatedAreaMm2} mm² guarda</span>
          </p>
        </div>
        <div className="w-full bg-[#161a26] h-1.5 rounded-sm mt-2 overflow-hidden flex gap-0.5">
          {Array.from({ length: 12 }).map((_, i) => {
            const filled = (i / 12) * 100 <= areaPercent;
            return (
              <div
                key={i}
                className={`flex-1 h-full rounded-[1px] ${
                  filled ? 'bg-slate-300' : 'bg-[#1e2433]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 3. TDP / Power */}
      <div className="bg-[#0e111a] border border-[#222938] rounded-lg p-3 flex flex-col justify-between shadow-md relative group hover:border-amber-600/50 transition-all reticle-corner">
        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
          <span className="text-amber-500 font-semibold">[M03] POTÊNCIA TDP</span>
          <Zap className="h-3.5 w-3.5 text-amber-500" />
        </div>
        <div className="my-1">
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1">
            {project.currentEstimatedTdpW} <span className="text-xs font-normal text-slate-400">W</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            TETO MÁX: <span className="text-amber-300">{project.targetTdpW}W</span>
          </p>
        </div>
        <div className="w-full bg-[#161a26] h-1.5 rounded-sm mt-2 overflow-hidden flex gap-0.5">
          {Array.from({ length: 12 }).map((_, i) => {
            const filled = (i / 12) * 100 <= powerPercent;
            return (
              <div
                key={i}
                className={`flex-1 h-full rounded-[1px] ${
                  filled ? 'bg-amber-500' : 'bg-[#1e2433]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 4. Verification Coverage */}
      <div className="bg-[#0e111a] border border-[#222938] rounded-lg p-3 flex flex-col justify-between shadow-md relative group hover:border-emerald-500/50 transition-all reticle-corner">
        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
          <span className="text-emerald-400 font-semibold">[M04] COBERTURA UVM</span>
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <div className="my-1">
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1">
            {globalCoverage.toFixed(1)}<span className="text-xs text-emerald-400 font-normal">%</span>
          </div>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <span>{passRate.toFixed(1)}% PASS RATE</span>
          </p>
        </div>
        <div className="w-full bg-[#161a26] h-1.5 rounded-sm mt-2 overflow-hidden flex gap-0.5">
          {Array.from({ length: 12 }).map((_, i) => {
            const filled = (i / 12) * 100 <= globalCoverage;
            return (
              <div
                key={i}
                className={`flex-1 h-full rounded-[1px] ${
                  filled ? 'bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.5)]' : 'bg-[#1e2433]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 5. Timing Slack WNS */}
      <div className="bg-[#0e111a] border border-[#222938] rounded-lg p-3 flex flex-col justify-between shadow-md relative group hover:border-rose-500/50 transition-all reticle-corner">
        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
          <span className="text-rose-400 font-semibold">[M05] TIMING WNS</span>
          <AlertTriangle className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
        </div>
        <div className="my-1">
          <div className="text-2xl font-bold font-mono text-rose-400 flex items-baseline gap-1">
            -12 <span className="text-xs font-normal text-slate-400">ps</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            4 CAMINHOS CRÍTICOS
          </p>
        </div>
        <div className="w-full bg-[#161a26] h-1.5 rounded-sm mt-2 overflow-hidden flex gap-0.5">
          {Array.from({ length: 12 }).map((_, i) => {
            const filled = i < 10;
            return (
              <div
                key={i}
                className={`flex-1 h-full rounded-[1px] ${
                  filled ? 'bg-rose-500' : 'bg-[#1e2433]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 6. Active Bugs */}
      <div className="bg-[#0e111a] border border-[#222938] rounded-lg p-3 flex flex-col justify-between shadow-md relative group hover:border-purple-500/50 transition-all reticle-corner">
        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
          <span className="text-purple-400 font-semibold">[M06] DESVIOS SILÍCIO</span>
          <Bug className="h-3.5 w-3.5 text-purple-400" />
        </div>
        <div className="my-1">
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1">
            {activeBugsCount}
            <span className="text-xs text-slate-400 font-normal">abertos</span>
          </div>
          <p className="text-[10px] text-rose-400 font-mono">
            {p0Bugs} P0 BLOCK • {p1Bugs} P1
          </p>
        </div>
        <div className="w-full bg-[#161a26] h-1.5 rounded-sm mt-2 overflow-hidden flex gap-0.5">
          {Array.from({ length: 12 }).map((_, i) => {
            const filled = (i / 12) * 100 <= (activeBugsCount / 8) * 100;
            return (
              <div
                key={i}
                className={`flex-1 h-full rounded-[1px] ${
                  filled ? 'bg-purple-400' : 'bg-[#1e2433]'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
