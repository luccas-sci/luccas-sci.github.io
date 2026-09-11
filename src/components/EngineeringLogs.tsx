import React, { useState } from 'react';
import { EngineeringLog } from '../types';
import { Clock, Plus, Tag, User, Hash, AlertTriangle, CheckCircle2, Info, AlertOctagon, Terminal } from 'lucide-react';

interface EngineeringLogsProps {
  logs: EngineeringLog[];
  onOpenNewLog: () => void;
}

export const EngineeringLogs: React.FC<EngineeringLogsProps> = ({ logs, onOpenNewLog }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    if (filterCategory === 'all') return true;
    return log.category === filterCategory;
  });

  const getSeverityIcon = (sev: EngineeringLog['severity']) => {
    switch (sev) {
      case 'success':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      case 'critical':
        return <AlertOctagon className="h-3.5 w-3.5 text-rose-400 shrink-0 animate-pulse" />;
      case 'info':
      default:
        return <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-5 mb-8 shadow-2xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c2230] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold">
              LSF CLUSTER JOURNAL
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              HOST: synopsys-grid.foundry.lan • SYNC ACTIVE
            </span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mt-1 font-tech tracking-wide">
            <Terminal className="h-4 w-4 text-emerald-400" />
            DIÁRIO DE ENGENHARIA & HISTÓRICO DE BUILDS EDA
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Registro cronológico de sínteses lógicas, timing runs PrimeTime, DRC Calibre e liberações de layout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#08090d] border border-[#22293b] text-slate-300 text-xs font-mono rounded-md px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas as Categorias</option>
            <option value="STA">STA (Timing PrimeTime)</option>
            <option value="Verificação">Verificação UVM</option>
            <option value="DRC/LVS">DRC / LVS Calibre</option>
            <option value="Síntese">Síntese & DFT</option>
            <option value="Foundry">Foundry TSMC</option>
          </select>

          <button
            onClick={onOpenNewLog}
            className="px-3 py-1.5 rounded-md text-xs font-mono font-bold bg-[#161b29] hover:bg-[#20273a] text-slate-200 border border-[#2b354d] flex items-center gap-1.5 transition-all"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400" />
            <span>Adicionar Nota</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="p-3.5 rounded-lg bg-[#08090d] border border-[#1f2638] hover:border-[#2f3b54] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2.5">
                {getSeverityIcon(log.severity)}
                <span className="font-mono text-[10px] font-bold text-amber-400 bg-[#161a26] px-1.5 py-0.5 rounded border border-[#22293b]">
                  {log.category}
                </span>
                <h4 className="text-xs font-bold text-white font-tech tracking-wide">{log.title}</h4>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                {log.hash && (
                  <span className="flex items-center gap-1 text-slate-400 bg-[#10131c] px-1.5 py-0.5 rounded border border-[#1c2230] text-[10px]">
                    <Hash className="h-2.5 w-2.5 text-slate-500" />
                    {log.hash}
                  </span>
                )}
                <span className="text-[10px] text-slate-500">{log.timestamp}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-2 font-mono leading-relaxed pl-6">
              {log.description}
            </p>

            <div className="mt-2.5 pt-2 border-t border-[#181d29] flex items-center justify-between text-xs text-slate-400 pl-6 font-mono">
              <div className="flex items-center gap-1.5 text-[11px]">
                <User className="h-3 w-3 text-slate-500" />
                <span>AUTOR: <strong className="text-slate-200">{log.author}</strong></span>
              </div>
              <span className="text-[10px] text-slate-500">ASIC DESIGN TEAM • BRASIL</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
