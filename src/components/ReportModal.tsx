import React, { useState } from 'react';
import { SocProjectInfo, IpBlock, BugRecord, PhaseStep } from '../types';
import { FileText, X, Printer, Copy, Check, ShieldCheck, AlertTriangle, Cpu } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: SocProjectInfo;
  blocks: IpBlock[];
  bugs: BugRecord[];
  phases: PhaseStep[];
  globalCoverage: number;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  project,
  blocks,
  bugs,
  phases,
  globalCoverage,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const markdown = `# DOSSIÊ EXECUTIVO DE TAPE-OUT: ${project.name} (${project.codeName})
Data: 11/09/2026
Prontidão Global: ${project.overallReadinessPercent}%
Nó de Processo: ${project.node} - ${project.foundry}
Shuttle Target: 18 de Novembro de 2026

## 1. Métricas PPA (Power, Performance, Area)
- Área do Die: ${project.currentEstimatedAreaMm2} mm² (Teto: ${project.targetAreaBudgetMm2} mm²)
- TDP: ${project.currentEstimatedTdpW} W (Teto: ${project.targetTdpW} W)
- Frequência CPU: ${project.boostClockGhz} GHz Boost
- Tensão Nominal: ${project.voltageNominalV} V

## 2. Status de Verificação e Qualidade
- Cobertura UVM/SVA Global: ${globalCoverage.toFixed(1)}%
- Bugs Abertos: ${bugs.filter((b) => b.status !== 'Closed').length} (P0 Bloqueadores: ${
      bugs.filter((b) => b.severity === 'P0_Blocker' && b.status !== 'Closed').length
    })

## 3. Prontidão dos Blocos IP
${blocks.map((b) => `- ${b.name}: RTL ${b.rtlStatus}%, Verif ${b.verificationCoverage}%, Slack: ${Math.round(b.timingSlackNs * 1000)}ps [${b.status}]`).join('\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const p0Count = bugs.filter((b) => b.severity === 'P0_Blocker' && b.status !== 'Closed').length;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0c0e14] border border-[#2b354d] rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 font-mono">
        <div className="flex items-center justify-between pb-4 border-b border-[#1c2230]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                  FOUNDRY SIGN-OFF AUDIT
                </span>
                <span className="text-[10px] text-slate-500">REV A0.3-RC2</span>
              </div>
              <h3 className="text-base font-bold text-white font-tech tracking-wide mt-0.5">
                DOSSIÊ TÉCNICO DE PRONTIDÃO DE TAPE-OUT
              </h3>
              <p className="text-[11px] text-slate-400">
                {project.name} • {project.node} • TSMC FAB 18A (TAINAN)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleCopyMarkdown}
              className="px-2.5 py-1.5 rounded text-xs bg-[#161b29] hover:bg-[#20273a] text-slate-200 border border-[#2b354d] flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? 'Copiado' : 'Markdown'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#161b29] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="mt-5 space-y-5 text-xs text-slate-300">
          {/* Executive Overview */}
          <div className="bg-[#08090d] p-4 rounded-lg border border-[#1f2638]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white font-tech tracking-wide">STATUS DA CONVERGÊNCIA: FECHAMENTO DE TIMING & DRC</span>
              <span className="text-xs font-bold text-amber-400">
                {project.overallReadinessPercent}% COMPLETO
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              O SoC <strong>{project.name}</strong> ({project.codeName}) encontra-se em fase avançada de fechamento físico
              no nó FinFET/GAA 4nm (TSMC N4P). Todos os 8 blocos RTL estão 100% congelados (Freeze #3). As atividades críticas
              concentram-se no fechamento do Worst Negative Slack (WNS) de -12ps no cluster de CPU e resolução da violação de hold time
              no tag array de cache L3 antes do congelamento final da máscara GDSII.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#08090d] p-3 rounded-lg border border-[#1f2638]">
              <span className="text-slate-500 block text-[9px]">SLOT DO SHUTTLE</span>
              <span className="font-mono text-xs font-bold text-amber-400 mt-0.5 block">18/NOV/2026</span>
              <span className="text-[10px] text-slate-400">TSMC Cybershuttle</span>
            </div>

            <div className="bg-[#08090d] p-3 rounded-lg border border-[#1f2638]">
              <span className="text-slate-500 block text-[9px]">ÁREA DE SILÍCIO</span>
              <span className="font-mono text-xs font-bold text-white mt-0.5 block">
                {project.currentEstimatedAreaMm2} mm²
              </span>
              <span className="text-[10px] text-emerald-400">
                Teto: {project.targetAreaBudgetMm2} mm² (Pass)
              </span>
            </div>

            <div className="bg-[#08090d] p-3 rounded-lg border border-[#1f2638]">
              <span className="text-slate-500 block text-[9px]">DISSIPAÇÃO TDP</span>
              <span className="font-mono text-xs font-bold text-white mt-0.5 block">
                {project.currentEstimatedTdpW} W
              </span>
              <span className="text-[10px] text-emerald-400">Teto: {project.targetTdpW} W (Pass)</span>
            </div>

            <div className="bg-[#08090d] p-3 rounded-lg border border-[#1f2638]">
              <span className="text-slate-500 block text-[9px]">COBERTURA UVM</span>
              <span className="font-mono text-xs font-bold text-emerald-400 mt-0.5 block">
                {globalCoverage.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400">98.8% Test Pass Rate</span>
            </div>
          </div>

          {/* Subsystem Health Table */}
          <div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>MATRIZ DE STATUS DOS BLOCOS IP (FINRETICLE N4P)</span>
              <span className="text-[10px] text-slate-500">{blocks.length} BLOCOS CATALOGADOS</span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-[#1f2638] text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-[#08090d] text-slate-400 border-b border-[#1f2638]">
                  <tr>
                    <th className="p-2 font-semibold">IP BLOCK</th>
                    <th className="p-2 font-semibold">RESPONSÁVEL</th>
                    <th className="p-2 font-semibold">ÁREA</th>
                    <th className="p-2 font-semibold">UVM COV</th>
                    <th className="p-2 font-semibold">TIMING WNS</th>
                    <th className="p-2 font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181d29] bg-[#090b10]">
                  {blocks.map((b) => (
                    <tr key={b.id} className="hover:bg-[#101420]">
                      <td className="p-2 text-white font-bold">{b.name}</td>
                      <td className="p-2 text-slate-400">{b.teamLead}</td>
                      <td className="p-2 text-slate-300">{b.areaMm2} mm²</td>
                      <td className="p-2 text-emerald-400 font-bold">{b.verificationCoverage}%</td>
                      <td className="p-2">
                        <span className={b.timingSlackNs < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          {Math.round(b.timingSlackNs * 1000)} ps
                        </span>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                            b.status === 'complete'
                              ? 'text-emerald-300 bg-emerald-950/80 border-emerald-800'
                              : b.status === 'warning'
                              ? 'text-amber-300 bg-amber-950/80 border-amber-800'
                              : 'text-cyan-300 bg-[#121c2c] border-cyan-800'
                          }`}
                        >
                          {b.status === 'complete' ? 'FECHADO' : b.status === 'warning' ? 'WNS SLACK' : 'ROUTING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Blocking Issues Alert */}
          {p0Count > 0 && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-rose-300 block text-xs font-tech tracking-wide">
                  BLOQUEIO ATIVO: {p0Count} DESVIO P0 IMPEDINDO LIBERAÇÃO DE MÁSCARA
                </span>
                <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed">
                  Violação de hold time de 18ps no tag array do L3 Cache da CPU. O comitê de sign-off
                  exige reinserção de buffers de atraso antes da emissão final da fita GDSII para o fotoplotter da TSMC.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-[#1c2230] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#161b29] hover:bg-[#20273a] text-slate-200 text-xs font-bold border border-[#2b354d]"
          >
            Fechar Dossiê
          </button>
        </div>
      </div>
    </div>
  );
};

