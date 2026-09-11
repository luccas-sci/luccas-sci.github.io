import React, { useState } from 'react';
import { PhaseStep } from '../types';
import { CheckCircle2, Clock, ChevronDown, ChevronRight, AlertCircle, Calendar, User, FileCheck, Layers, GitBranch, ShieldCheck } from 'lucide-react';

interface PipelineTrackerProps {
  phases: PhaseStep[];
  onUpdatePhaseProgress?: (phaseId: string, delta: number) => void;
}

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({ phases }) => {
  const [expandedPhaseId, setExpandedPhaseId] = useState<string>('phase-6');

  const togglePhase = (id: string) => {
    setExpandedPhaseId(expandedPhaseId === id ? '' : id);
  };

  const getStatusBadge = (status: PhaseStep['status']) => {
    switch (status) {
      case 'done':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            SIGN-OFF CONCLUÍDO
          </span>
        );
      case 'current':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1 animate-pulse">
            <Clock className="h-3 w-3" />
            FASE ATIVA
          </span>
        );
      case 'blocked':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            BLOQUEIO DRC
          </span>
        );
      case 'upcoming':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#131620] text-slate-400 border border-[#232a3b] flex items-center gap-1">
            AGENDADO
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-5 mb-8 shadow-2xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c2230] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-semibold">
              FOUNDRY ASIC WORKFLOW
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              TOOLCHAIN: CADENCE / SYNOPSYS / CALIBRE
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-1 font-tech tracking-wide">
            <GitBranch className="h-4 w-4 text-amber-400" />
            ESTEIRA DE DESENVOLVIMENTO ASIC (TAPE-OUT PIPELINE)
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Do conceito arquitetural até a entrega do GDSII e fabricação de silício na foundry TSMC.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-[#08090d] px-3 py-1.5 rounded-lg border border-[#22293b]">
          <span>PROGRESSO TOTAL:</span>
          <span className="text-amber-400 font-bold font-mono">78.4%</span>
        </div>
      </div>

      {/* Pipeline Stepper Progression Bar */}
      <div className="mt-6 mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center min-w-[760px] justify-between relative px-4">
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[2px] bg-[#1c2230] z-0"></div>
          {phases.map((phase) => {
            const isDone = phase.status === 'done';
            const isCurrent = phase.status === 'current';
            const isExpanded = expandedPhaseId === phase.id;

            return (
              <button
                key={phase.id}
                onClick={() => togglePhase(phase.id)}
                className="relative z-10 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center font-mono text-xs font-bold transition-all border ${
                    isDone
                      ? 'bg-[#091a13] border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : isCurrent
                      ? 'bg-[#1f1609] border-amber-400 text-amber-300 ring-2 ring-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-[#0a0c12] border-[#22293b] text-slate-400 group-hover:border-slate-500'
                  } ${isExpanded ? 'scale-110' : ''}`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : `0${phase.phaseNumber}`}
                </div>
                <span
                  className={`text-[11px] font-mono mt-2 max-w-[90px] text-center leading-tight truncate ${
                    isCurrent ? 'text-amber-300 font-bold' : isDone ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {phase.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {phase.progress}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Phase Accordion List */}
      <div className="space-y-2.5">
        {phases.map((phase) => {
          const isExpanded = expandedPhaseId === phase.id;
          return (
            <div
              key={phase.id}
              className={`rounded-lg border transition-all ${
                isExpanded
                  ? 'bg-[#0a0c12] border-amber-500/40 shadow-lg'
                  : 'bg-[#08090d] border-[#1f2636] hover:border-[#2f394f]'
              }`}
            >
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-7 h-7 rounded font-mono text-xs font-bold flex items-center justify-center border ${
                      phase.status === 'done'
                        ? 'bg-[#091a13] text-emerald-400 border-emerald-800'
                        : phase.status === 'current'
                        ? 'bg-[#1f1609] text-amber-400 border-amber-700'
                        : 'bg-[#11141c] text-slate-500 border-[#22293b]'
                    }`}
                  >
                    F{phase.phaseNumber}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-tech tracking-wide">
                      {phase.name}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 font-mono">
                      <span className="flex items-center gap-1 text-slate-300">
                        <User className="h-3 w-3 text-amber-400" />
                        {phase.lead}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400 font-mono">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        {phase.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-300">
                    <div className="w-24 bg-[#141824] rounded-sm h-1.5 overflow-hidden flex gap-0.5">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-full rounded-[0.5px] ${
                            (i / 8) * 100 <= phase.progress
                              ? phase.status === 'done'
                                ? 'bg-emerald-400'
                                : 'bg-amber-400'
                              : 'bg-[#1f2638]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="w-9 text-right font-mono text-[11px]">{phase.progress}%</span>
                  </div>

                  {getStatusBadge(phase.status)}

                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-amber-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Expanded details & Deliverables list */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-[#1c2230] mt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="bg-[#0f121a] rounded-lg p-3 border border-[#22293b]">
                      <h4 className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2">
                        <FileCheck className="h-3.5 w-3.5" />
                        CHECKLIST DE ENTREGÁVEIS & ASSINATURA EDA
                      </h4>
                      <ul className="space-y-1.5 text-xs font-mono">
                        {phase.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <span
                              className={`mt-0.5 rounded p-0.5 ${
                                phase.status === 'done'
                                  ? 'text-emerald-400 bg-emerald-950 border border-emerald-800'
                                  : idx === 0
                                  ? 'text-amber-400 bg-amber-950 border border-amber-800'
                                  : 'text-slate-500 bg-[#131622] border border-[#22293b]'
                              }`}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </span>
                            <span className="text-[11px] leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#0f121a] rounded-lg p-3 border border-[#22293b] flex flex-col justify-between">
                      <div>
                        <h4 className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono mb-2">
                          PARECER TÉCNICO DA FASE
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-mono">
                          {phase.status === 'done' && 'Fase 100% aprovada e assinada pelo comitê técnico. Artefatos congelados no controle de versão Git/Perforce.'}
                          {phase.status === 'current' && 'Equipe focada na convergência de timing, fechamento de caminhos críticos SSG -40°C e extração parasitária StarRC.'}
                          {phase.status === 'upcoming' && 'Aguardando encerramento da fase anterior para liberação de slots de fabricação na TSMC CyberShuttle.'}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#1f2638] flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500">PDK: TSMC_N4P_1.4B</span>
                        <span className="text-amber-400">Entrega: {phase.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
