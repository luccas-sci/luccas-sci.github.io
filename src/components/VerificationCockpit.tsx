import React, { useState } from 'react';
import { BugRecord, BugSeverity } from '../types';
import { ShieldCheck, Bug, Play, CheckCircle2, Clock, AlertTriangle, Filter, Plus, User, Search, Terminal, Cpu, Check, X } from 'lucide-react';

interface VerificationCockpitProps {
  bugs: BugRecord[];
  onAddBug: (bug: Omit<BugRecord, 'id' | 'createdDate'>) => void;
  onUpdateBugStatus: (id: string, status: BugRecord['status']) => void;
  onRunRegression: () => void;
  isSimulatingRegression: boolean;
  globalCoverage: number;
  passRate: number;
}

export const VerificationCockpit: React.FC<VerificationCockpitProps> = ({
  bugs,
  onAddBug,
  onUpdateBugStatus,
  onRunRegression,
  isSimulatingRegression,
  globalCoverage,
  passRate,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewBugModal, setShowNewBugModal] = useState<boolean>(false);

  // New bug form state
  const [newTitle, setNewTitle] = useState('');
  const [newModule, setNewModule] = useState('CPU Complex');
  const [newSeverity, setNewSeverity] = useState<BugSeverity>('P1_Critical');
  const [newAssignee, setNewAssignee] = useState('Dra. Carolina Mendes');

  const filteredBugs = bugs.filter((bug) => {
    const matchesSeverity = filterSeverity === 'all' || bug.severity === filterSeverity;
    const matchesSearch =
      bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleCreateBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddBug({
      title: newTitle.trim(),
      module: newModule,
      severity: newSeverity,
      status: 'Open',
      assignee: newAssignee,
    });

    setNewTitle('');
    setShowNewBugModal(false);
  };

  const getSeverityBadge = (sev: BugSeverity) => {
    switch (sev) {
      case 'P0_Blocker':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse">
            P0 BLOCKER
          </span>
        );
      case 'P1_Critical':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800">
            P1 CRITICAL
          </span>
        );
      case 'P2_Major':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#142238] text-cyan-300 border border-cyan-800">
            P2 MAJOR
          </span>
        );
      case 'P3_Minor':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#121622] text-slate-400 border border-[#232a3b]">
            P3 MINOR
          </span>
        );
    }
  };

  const getStatusBadge = (status: BugRecord['status']) => {
    switch (status) {
      case 'Fix_Verified':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> VERIFICADO
          </span>
        );
      case 'Investigating':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1">
            <Clock className="h-3 w-3" /> EM ANÁLISE
          </span>
        );
      case 'Closed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#11141c] text-slate-500 border border-[#202738] line-through">
            FECHADO
          </span>
        );
      case 'Open':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/70 text-rose-300 border border-rose-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> ABERTO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Verification Suite Cockpit Header */}
      <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-5 shadow-2xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1c2230] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold">
                UVM 1.2 TESTBENCH
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                SIMULATOR: SYNOPSYS VCS 2024.12
              </span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-1 font-tech tracking-wide">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              COCKPIT DE VERIFICAÇÃO UVM & REGRESSÕES DE SILÍCIO
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Validação funcional por simulação dirigida, sementes randômicas restringidas e assertivas SVA formais.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRunRegression}
              disabled={isSimulatingRegression}
              className="px-3.5 py-2 rounded-lg text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)] flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Play className={`h-3.5 w-3.5 fill-current ${isSimulatingRegression ? 'animate-spin' : ''}`} />
              <span>{isSimulatingRegression ? 'SIMULANDO 25.000 SEMENTES...' : 'DISPARAR REGRESSÃO NOTURNA'}</span>
            </button>
          </div>
        </div>

        {/* Coverage gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-[#08090d] p-3 rounded-lg border border-[#1f2638]">
            <span className="text-[10px] text-slate-400 font-mono block">COBERTURA DE CÓDIGO (LINE)</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">97.4%</div>
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-[0.5px] ${
                    i < 11 ? 'bg-emerald-400' : 'bg-[#1f2638]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-[#08090d] p-3 rounded-lg border border-[#1f2638]">
            <span className="text-[10px] text-slate-400 font-mono block">COBERTURA DE RAMOS (BRANCH)</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">94.8%</div>
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-[0.5px] ${
                    i < 11 ? 'bg-cyan-400' : 'bg-[#1f2638]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-[#08090d] p-3 rounded-lg border border-[#1f2638]">
            <span className="text-[10px] text-slate-400 font-mono block">TOGGLE COVERAGE (NÓS)</span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">91.6%</div>
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-[0.5px] ${
                    i < 10 ? 'bg-amber-400' : 'bg-[#1f2638]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-[#08090d] p-3 rounded-lg border border-[#1f2638]">
            <span className="text-[10px] text-slate-400 font-mono block">ASSERTIVAS UVM SVA</span>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">92.9%</div>
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-[0.5px] ${
                    i < 11 ? 'bg-purple-400' : 'bg-[#1f2638]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bug Tracking Section */}
      <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c2230] gap-3">
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-rose-400" />
            <h3 className="text-base font-bold text-white font-tech tracking-wide">
              BACKLOG DE ANOMALIAS & DESVIOS DE SILÍCIO
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#161a26] text-amber-400 font-mono border border-[#22293b]">
              {filteredBugs.length} ITENS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="h-3 w-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por ID ou módulo..."
                className="pl-7 pr-3 py-1.5 text-xs font-mono bg-[#08090d] border border-[#22293b] rounded-md text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-[#08090d] border border-[#22293b] text-slate-300 text-xs font-mono rounded-md px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
            >
              <option value="all">Todas as Severidades</option>
              <option value="P0_Blocker">P0 Bloqueadores</option>
              <option value="P1_Critical">P1 Críticos</option>
              <option value="P2_Major">P2 Maiores</option>
              <option value="P3_Minor">P3 Menores</option>
            </select>

            {/* Add Bug Button */}
            <button
              onClick={() => setShowNewBugModal(true)}
              className="px-2.5 py-1.5 rounded-md text-xs font-mono font-semibold bg-[#161b29] hover:bg-[#20273a] text-slate-200 border border-[#2b354d] flex items-center gap-1.5 transition-all"
            >
              <Plus className="h-3.5 w-3.5 text-rose-400" />
              <span>Reportar Bug</span>
            </button>
          </div>
        </div>

        {/* Bug Table */}
        <div className="overflow-x-auto rounded-lg border border-[#1f2638] mt-4">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#08090d] text-slate-400 border-b border-[#1f2638]">
              <tr>
                <th className="p-2.5 font-semibold text-[11px]">BUG ID</th>
                <th className="p-2.5 font-semibold text-[11px]">DESCRIÇÃO DO ERRO</th>
                <th className="p-2.5 font-semibold text-[11px]">MÓDULO AFETADO</th>
                <th className="p-2.5 font-semibold text-[11px]">SEVERIDADE</th>
                <th className="p-2.5 font-semibold text-[11px]">STATUS</th>
                <th className="p-2.5 font-semibold text-[11px]">RESPONSÁVEL</th>
                <th className="p-2.5 text-right font-semibold text-[11px]">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181e2b] bg-[#090b10]">
              {filteredBugs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500 font-mono">
                    Nenhum registro encontrado para o filtro selecionado.
                  </td>
                </tr>
              ) : (
                filteredBugs.map((bug) => (
                  <tr key={bug.id} className="hover:bg-[#101420] transition-colors">
                    <td className="p-2.5 text-amber-400 font-bold">{bug.id}</td>
                    <td className="p-2.5 text-slate-200 max-w-sm">
                      <div className="font-semibold text-white text-[11px]">{bug.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Criado em {bug.createdDate}</div>
                    </td>
                    <td className="p-2.5 text-slate-300 text-[11px]">{bug.module}</td>
                    <td className="p-2.5">{getSeverityBadge(bug.severity)}</td>
                    <td className="p-2.5">{getStatusBadge(bug.status)}</td>
                    <td className="p-2.5 text-slate-300 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-slate-500" />
                        <span>{bug.assignee}</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-right">
                      {bug.status !== 'Closed' && bug.status !== 'Fix_Verified' ? (
                        <button
                          onClick={() => onUpdateBugStatus(bug.id, 'Fix_Verified')}
                          className="px-2 py-1 rounded bg-[#091a13] hover:bg-[#0e2c20] text-emerald-300 border border-emerald-800 text-[10px] font-semibold transition-all"
                        >
                          Verificar Fix
                        </button>
                      ) : bug.status === 'Fix_Verified' ? (
                        <button
                          onClick={() => onUpdateBugStatus(bug.id, 'Closed')}
                          className="px-2 py-1 rounded bg-[#151926] hover:bg-[#20273a] text-slate-300 text-[10px] font-semibold border border-[#2b354d] transition-all"
                        >
                          Fechar Bug
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500">Resolvido</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Bug Modal */}
      {showNewBugModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0e14] border border-[#2b354d] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1 font-tech tracking-wide">
              <Bug className="h-4 w-4 text-rose-400" />
              REGISTRAR DESVIO / ANOMALIA DE SILÍCIO
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Registre falhas de verificação funcional, violações de clock CDC ou falhas em assertions SVA.
            </p>

            <form onSubmit={handleCreateBug} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-[11px]">TÍTULO DO DEFEITO</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Violação de hold time de 22ps no buffer do PCIe..."
                  className="w-full bg-[#08090d] border border-[#22293b] rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1 text-[11px]">MÓDULO / IP</label>
                  <select
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    className="w-full bg-[#08090d] border border-[#22293b] rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
                  >
                    <option value="CPU Complex">CPU Complex</option>
                    <option value="NPU Neural Matrix">NPU Neural Matrix</option>
                    <option value="GPU Shader Core">GPU Shader Core</option>
                    <option value="LPDDR5X-8533 PHY">LPDDR5X-8533 PHY</option>
                    <option value="Coherent NoC">Coherent NoC</option>
                    <option value="PCIe Gen5 / USB4">PCIe Gen5 / USB4</option>
                    <option value="Analog PMU">Analog PMU</option>
                    <option value="Security Enclave">Security Enclave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 text-[11px]">SEVERIDADE</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as BugSeverity)}
                    className="w-full bg-[#08090d] border border-[#22293b] rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
                  >
                    <option value="P0_Blocker">P0 (Bloqueador de Tape-Out)</option>
                    <option value="P1_Critical">P1 (Crítico)</option>
                    <option value="P2_Major">P2 (Maior)</option>
                    <option value="P3_Minor">P3 (Menor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 text-[11px]">RESPONSÁVEL TÉCNICO</label>
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full bg-[#08090d] border border-[#22293b] rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1c2230]">
                <button
                  type="button"
                  onClick={() => setShowNewBugModal(false)}
                  className="px-3 py-1.5 rounded text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-[0_0_10px_rgba(225,29,72,0.4)]"
                >
                  Registrar Anomalia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
