import React, { useState, useEffect } from 'react';
import {
  initialProjectInfo,
  initialIpBlocks,
  initialPhases,
  initialMilestones,
  initialBugs,
  initialLogs,
} from './data/socData';
import {
  SocProjectInfo,
  IpBlock,
  PhaseStep,
  Milestone,
  BugRecord,
  EngineeringLog,
} from './types';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { DieFloorplan } from './components/DieFloorplan';
import { PipelineTracker } from './components/PipelineTracker';
import { PpaAnalysis } from './components/PpaAnalysis';
import { VerificationCockpit } from './components/VerificationCockpit';
import { TimelineRoadmap } from './components/TimelineRoadmap';
import { EngineeringLogs } from './components/EngineeringLogs';
import { NewLogModal } from './components/NewLogModal';
import { ReportModal } from './components/ReportModal';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  // Persistence states
  const [project] = useState<SocProjectInfo>(() => {
    const saved = localStorage.getItem('soc_project_info');
    return saved ? JSON.parse(saved) : initialProjectInfo;
  });

  const [blocks, setBlocks] = useState<IpBlock[]>(() => {
    const saved = localStorage.getItem('soc_ip_blocks');
    return saved ? JSON.parse(saved) : initialIpBlocks;
  });

  const [phases, setPhases] = useState<PhaseStep[]>(() => {
    const saved = localStorage.getItem('soc_phases');
    return saved ? JSON.parse(saved) : initialPhases;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('soc_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  const [bugs, setBugs] = useState<BugRecord[]>(() => {
    const saved = localStorage.getItem('soc_bugs');
    return saved ? JSON.parse(saved) : initialBugs;
  });

  const [logs, setLogs] = useState<EngineeringLog[]>(() => {
    const saved = localStorage.getItem('soc_logs');
    return saved ? JSON.parse(saved) : initialLogs;
  });

  // UI Navigation states
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('cpu-complex');
  const [isNewLogOpen, setIsNewLogOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isSimulatingRegression, setIsSimulatingRegression] = useState<boolean>(false);
  const [globalCoverage, setGlobalCoverage] = useState<number>(94.2);
  const [passRate, setPassRate] = useState<number>(98.8);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('soc_ip_blocks', JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => {
    localStorage.setItem('soc_bugs', JSON.stringify(bugs));
  }, [bugs]);

  useEffect(() => {
    localStorage.setItem('soc_logs', JSON.stringify(logs));
  }, [logs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Actions
  const handleRunRegression = () => {
    if (isSimulatingRegression) return;
    setIsSimulatingRegression(true);
    showToast('Executando bateria de regressão noturna com 25.000 sementes no cluster LSF...');

    setTimeout(() => {
      setIsSimulatingRegression(false);
      const newCov = Math.min(99.5, +(globalCoverage + 0.3).toFixed(1));
      const newPass = Math.min(99.9, +(passRate + 0.1).toFixed(1));
      setGlobalCoverage(newCov);
      setPassRate(newPass);

      const newLog: EngineeringLog = {
        id: `log-${Date.now()}`,
        title: `Regressão Interativa #${Math.floor(500 + Math.random() * 50)} concluída`,
        category: 'Verificação',
        author: 'Cluster LSF Automatizado',
        description: `25.000 sementes UVM aleatórias simuladas em paralelo. Nova cobertura global alcançada: ${newCov}%. Taxa de aprovação: ${newPass}%.`,
        severity: 'success',
        timestamp: 'Agora mesmo',
        hash: `seed-run#${Math.floor(1000 + Math.random() * 9000)}`,
      };

      setLogs((prev) => [newLog, ...prev]);
      showToast(`Regressão finalizada com sucesso! Cobertura UVM atualizada para ${newCov}%.`);
    }, 2500);
  };

  const handleAddBug = (newBug: Omit<BugRecord, 'id' | 'createdDate'>) => {
    const created: BugRecord = {
      ...newBug,
      id: `BUG-${105 + bugs.length}`,
      createdDate: 'Hoje',
    };
    setBugs((prev) => [created, ...prev]);

    const newLog: EngineeringLog = {
      id: `log-${Date.now()}`,
      title: `Novo desvio reportado: ${created.id}`,
      category: 'Verificação',
      author: created.assignee,
      description: `[${created.severity}] Registrado no módulo ${created.module}: "${created.title}".`,
      severity: created.severity === 'P0_Blocker' ? 'critical' : 'warning',
      timestamp: 'Agora mesmo',
      hash: created.id.toLowerCase(),
    };
    setLogs((prev) => [newLog, ...prev]);
    showToast(`Bug ${created.id} registrado com sucesso.`);
  };

  const handleUpdateBugStatus = (id: string, status: BugRecord['status']) => {
    setBugs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );

    const bug = bugs.find((b) => b.id === id);
    if (bug) {
      const newLog: EngineeringLog = {
        id: `log-${Date.now()}`,
        title: `Status do ${id} atualizado para ${status}`,
        category: 'Verificação',
        author: bug.assignee,
        description: `Desvio ${id} no módulo ${bug.module} teve seu status alterado para "${status}".`,
        severity: status === 'Closed' || status === 'Fix_Verified' ? 'success' : 'info',
        timestamp: 'Agora mesmo',
        hash: id.toLowerCase(),
      };
      setLogs((prev) => [newLog, ...prev]);
    }
    showToast(`Bug ${id} atualizado para ${status}.`);
  };

  const handleAddLog = (newLogData: Omit<EngineeringLog, 'id'>) => {
    const created: EngineeringLog = {
      ...newLogData,
      id: `log-${Date.now()}`,
    };
    setLogs((prev) => [created, ...prev]);
    showToast('Registro de engenharia adicionado ao diário.');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200 font-sans relative">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0e1713] border border-emerald-600/70 text-emerald-300 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs font-mono font-medium animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        project={project}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewLog={() => setIsNewLogOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onRunRegression={handleRunRegression}
        isSimulatingRegression={isSimulatingRegression}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Metric Telemetry Cards */}
        <MetricCards
          project={project}
          bugs={bugs}
          globalCoverage={globalCoverage}
          passRate={passRate}
        />

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <>
            <DieFloorplan
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Pipeline Quick glance */}
              <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#1c2230]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-white font-tech tracking-wide uppercase">
                      Sequenciador de Fases (Alvo: Tape-Out GDSII)
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('pipeline')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-mono font-bold flex items-center gap-1"
                  >
                    Ver Todas as Fases →
                  </button>
                </div>
                <div className="mt-4 space-y-2.5 font-mono">
                  {phases.slice(4, 8).map((phase) => (
                    <div
                      key={phase.id}
                      className="p-2.5 rounded-lg bg-[#08090d] border border-[#1f2638] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white">
                          F{phase.phaseNumber}: {phase.name}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          ENTREGA: {phase.deadline}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#121622] h-1.5 rounded-sm overflow-hidden flex gap-0.5">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-full rounded-[0.5px] ${
                                (i / 8) * 100 <= phase.progress
                                  ? phase.progress === 100
                                    ? 'bg-emerald-400'
                                    : 'bg-amber-400'
                                  : 'bg-[#1f2638]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-slate-300 w-9 text-right font-bold text-[11px]">
                          {phase.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Digest */}
              <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-5 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#1c2230]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <h3 className="text-sm font-bold text-white font-tech tracking-wide uppercase">
                        Últimos Registros do Diário EDA
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('logs')}
                      className="text-xs text-amber-400 hover:text-amber-300 font-mono font-bold"
                    >
                      Ver Diário Completo →
                    </button>
                  </div>
                  <div className="mt-3.5 space-y-2.5 font-mono">
                    {logs.slice(0, 3).map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-lg bg-[#08090d] border border-[#1f2638] text-xs"
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-amber-400 font-semibold">{log.category}</span>
                          <span className="text-slate-500">{log.timestamp}</span>
                        </div>
                        <p className="font-semibold text-slate-200 text-xs">{log.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {log.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1c2230] flex items-center justify-between text-xs text-slate-400 font-mono text-[11px]">
                  <span>FOUNDRY: TSMC FAB 18A (4nm N4P)</span>
                  <span className="text-amber-400 font-bold">GDSII TARGET: 18/NOV</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'pipeline' && (
          <PipelineTracker phases={phases} />
        )}

        {activeTab === 'ppa' && (
          <PpaAnalysis blocks={blocks} project={project} />
        )}

        {activeTab === 'verif' && (
          <VerificationCockpit
            bugs={bugs}
            onAddBug={handleAddBug}
            onUpdateBugStatus={handleUpdateBugStatus}
            onRunRegression={handleRunRegression}
            isSimulatingRegression={isSimulatingRegression}
            globalCoverage={globalCoverage}
            passRate={passRate}
          />
        )}

        {activeTab === 'roadmap' && (
          <TimelineRoadmap milestones={milestones} />
        )}

        {activeTab === 'logs' && (
          <EngineeringLogs
            logs={logs}
            onOpenNewLog={() => setIsNewLogOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a202d] bg-[#07090e] py-4 mt-auto text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">{project.name}</span>
            <span>•</span>
            <span>Estação de Acompanhamento de Desenvolvimento de SoC & Silício</span>
          </div>
          <div className="text-[11px] text-slate-400">
            TSMC N4P PDK v1.4.2 • GDSII Stream-out • Shuttle Slot: Q4 2026
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewLogModal
        isOpen={isNewLogOpen}
        onClose={() => setIsNewLogOpen(false)}
        onAddLog={handleAddLog}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        project={project}
        blocks={blocks}
        bugs={bugs}
        phases={phases}
        globalCoverage={globalCoverage}
      />
    </div>
  );
}
