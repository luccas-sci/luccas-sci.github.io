import React, { useState } from 'react';
import { Milestone } from '../types';
import { Calendar, CheckCircle2, Clock, User, ArrowUpRight, Filter, Milestone as MilestoneIcon, Check } from 'lucide-react';

interface TimelineRoadmapProps {
  milestones: Milestone[];
}

export const TimelineRoadmap: React.FC<TimelineRoadmapProps> = ({ milestones }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = milestones.filter((m) => {
    if (filterCategory === 'all') return true;
    return m.category === filterCategory;
  });

  return (
    <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-5 mb-8 shadow-2xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c2230] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-semibold">
              FOUNDRY CRITICAL PATH
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              CYBERSHUTTLE SLOT: TSMC N4P #1126
            </span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mt-1 font-tech tracking-wide">
            <Calendar className="h-4 w-4 text-amber-400" />
            CRONOGRAMA DE MARCOS CRÍTICOS & CONTAGEM PARA TAPE-OUT
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Datas críticas de congelamento de arquitetura, entrega de netlists, sign-off de máscaras e retorno dos wafers.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3 w-3 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#08090d] border border-[#22293b] text-slate-300 text-xs font-mono rounded-md px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas as Disciplinas</option>
            <option value="RTL">Design RTL</option>
            <option value="Verif">Verificação UVM</option>
            <option value="Backend">Físico / P&R</option>
            <option value="Foundry">Foundry TSMC</option>
            <option value="Silicon">Silício & Validação</option>
          </select>
        </div>
      </div>

      {/* Timeline view */}
      <div className="relative mt-6 pl-6 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-[#1a2130]">
        {filtered.map((milestone) => {
          const isCompleted = milestone.status === 'completed';
          const isInProgress = milestone.status === 'in_progress';

          return (
            <div key={milestone.id} className="relative group">
              {/* Timeline dot */}
              <div
                className={`absolute -left-[31px] top-2 w-5 h-5 rounded flex items-center justify-center transition-all border ${
                  isCompleted
                    ? 'bg-[#091a13] border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    : isInProgress
                    ? 'bg-[#1f1609] border-amber-400 text-amber-400 ring-2 ring-amber-400/20 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'bg-[#08090d] border-[#22293b] text-slate-600'
                }`}
              >
                {isCompleted ? <Check className="h-3 w-3" /> : <div className="w-1.5 h-1.5 rounded-[1px] bg-current" />}
              </div>

              {/* Milestone Card */}
              <div
                className={`p-4 rounded-lg border transition-all ${
                  isInProgress
                    ? 'bg-[#0f131c] border-amber-500/40 shadow-lg'
                    : isCompleted
                    ? 'bg-[#08090d] border-[#1f2638] hover:border-[#2f394f]'
                    : 'bg-[#06080c] border-[#181d29] opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#161a26] border border-[#263045] text-amber-400 font-semibold">
                      {milestone.category}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-tech tracking-wide">
                      {milestone.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      {milestone.date}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        isCompleted
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : isInProgress
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                          : 'bg-[#121622] text-slate-400 border-[#22293b]'
                      }`}
                    >
                      {isCompleted ? 'CONCLUÍDO' : isInProgress ? 'EM EXECUÇÃO' : 'PLANEJADO'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 font-mono leading-relaxed">
                  {milestone.deliverable}
                </p>

                <div className="mt-3 pt-2.5 border-t border-[#1c2230] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <User className="h-3 w-3 text-amber-400" />
                    <span>LÍDER: <strong className="text-slate-200">{milestone.leadOwner}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>PROGRESSO:</span>
                    <div className="w-24 bg-[#141824] h-1.5 rounded-sm overflow-hidden flex gap-0.5">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-full rounded-[0.5px] ${
                            (i / 8) * 100 <= milestone.completionPercentage
                              ? isCompleted
                                ? 'bg-emerald-400'
                                : 'bg-amber-400'
                              : 'bg-[#1f2638]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-200 font-bold">{milestone.completionPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
