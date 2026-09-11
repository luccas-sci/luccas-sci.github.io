import React, { useState } from 'react';
import { IpBlock, SocProjectInfo } from '../types';
import { Zap, Cpu, Gauge, AlertTriangle, CheckCircle, Info, ChevronRight, BarChart2, Activity, Sliders, ArrowRight } from 'lucide-react';

interface PpaAnalysisProps {
  blocks: IpBlock[];
  project: SocProjectInfo;
}

export const PpaAnalysis: React.FC<PpaAnalysisProps> = ({ blocks, project }) => {
  const [selectedCorner, setSelectedCorner] = useState<string>('ssg_cold');

  const totalAllocatedArea = blocks.reduce((acc, b) => acc + b.areaMm2, 0);
  const totalAllocatedPower = blocks.reduce((acc, b) => acc + b.powerMw, 0) / 1000;

  const corners = [
    {
      id: 'tt_typ',
      name: 'TT (Typical-Typical)',
      condition: '0.75V, 25°C',
      wnsPs: +48,
      tnsPs: 0,
      status: 'pass',
      description: 'Condição nominal de laboratório e uso padrão.'
    },
    {
      id: 'ss_hot',
      name: 'SS (Slow-Slow Hot)',
      condition: '0.68V, 125°C',
      wnsPs: +12,
      tnsPs: 0,
      status: 'pass',
      description: 'Pior caso de calor com transistores lentos e subtensão.'
    },
    {
      id: 'ssg_cold',
      name: 'SSG (Slow-Slow Cold)',
      condition: '0.68V, -40°C',
      wnsPs: -12,
      tnsPs: -48,
      status: 'fail',
      description: 'Pior caso para atraso de fiação (interconnect RC delay). Violação de setup ativa.'
    },
    {
      id: 'ff_cold',
      name: 'FF (Fast-Fast Cold)',
      condition: '0.82V, -40°C',
      wnsPs: +95,
      tnsPs: 0,
      status: 'pass',
      description: 'Pior caso para violações de Hold time (sinais velozes demais).'
    }
  ];

  // Critical paths list
  const criticalPaths = [
    {
      id: 'CP-01',
      startPoint: 'u_cpu_cluster/u_core0/reg_pc_stage3',
      endPoint: 'u_cpu_cluster/u_l3_cache/tag_ram_din[42]',
      clockDomain: 'clk_cpu_main (3.2 GHz)',
      slackPs: -12,
      levelsOfLogic: 28,
      violatingCorner: 'SSG (-40°C, 0.68V)',
      ecoAction: 'Swap to ULVT cell + net shielding M6'
    },
    {
      id: 'CP-02',
      startPoint: 'u_lpddr5_phy/dqs_sampler_ch0',
      endPoint: 'u_lpddr5_ctrl/fifo_rd_ptr_sync[2]',
      clockDomain: 'clk_ddr_phy (4266 MHz)',
      slackPs: -8,
      levelsOfLogic: 14,
      violatingCorner: 'SSG (-40°C, 0.68V)',
      ecoAction: 'Buffer tree insertion + CTS balance'
    },
    {
      id: 'CP-03',
      startPoint: 'u_gpu_cu0/alu_mul_accum_r3',
      endPoint: 'u_gpu_cu0/reg_file_bank1[15]',
      clockDomain: 'clk_gpu (1.4 GHz)',
      slackPs: +15,
      levelsOfLogic: 22,
      violatingCorner: 'SS (125°C, 0.68V)',
      ecoAction: 'None (Timing Closed)'
    },
    {
      id: 'CP-04',
      startPoint: 'u_npu_matrix/pe_array_row7_col15',
      endPoint: 'u_npu_matrix/acc_fifo_wdata[63]',
      clockDomain: 'clk_npu (1.8 GHz)',
      slackPs: +45,
      levelsOfLogic: 19,
      violatingCorner: 'SS (125°C, 0.68V)',
      ecoAction: 'None (Timing Closed)'
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* PPA Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Power Card */}
        <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-4 shadow-xl relative">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono text-[11px]">
              <Zap className="h-3.5 w-3.5" /> POWER BUDGET (TDP)
            </span>
            <span className="font-mono text-xs text-slate-300">
              {totalAllocatedPower.toFixed(2)} W / {project.targetTdpW} W
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {totalAllocatedPower.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono">Watts nominais</span>
          </div>

          {/* Segmented Power Meter */}
          <div className="flex gap-1 mt-3">
            {Array.from({ length: 20 }).map((_, i) => {
              const active = (i / 20) <= (totalAllocatedPower / project.targetTdpW);
              const warning = i >= 16;
              return (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-[1px] transition-colors ${
                    active
                      ? warning
                        ? 'bg-rose-500'
                        : 'bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.5)]'
                      : 'bg-[#1a202c]'
                  }`}
                />
              );
            })}
          </div>

          <p className="text-[11px] text-emerald-400 mt-2.5 font-mono flex items-center gap-1">
            <span>●</span> Margem térmica segura: +{(project.targetTdpW - totalAllocatedPower).toFixed(2)} W
          </p>
        </div>

        {/* Performance Card */}
        <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono text-[11px]">
              <Gauge className="h-3.5 w-3.5" /> PERFORMANCE FMAX
            </span>
            <span className="font-mono text-xs text-emerald-400 font-bold">LOCKED @ 3.2 GHz</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">3.20</span>
            <span className="text-xs text-slate-400 font-mono">GHz CPU Max</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-3 text-[10px] font-mono">
            <div className="bg-[#08090d] p-1.5 rounded border border-[#1f2638] text-center">
              <span className="text-slate-500 block text-[9px]">NPU CORE</span>
              <span className="text-white font-bold">1.8 GHz</span>
            </div>
            <div className="bg-[#08090d] p-1.5 rounded border border-[#1f2638] text-center">
              <span className="text-slate-500 block text-[9px]">GPU SHADER</span>
              <span className="text-white font-bold">1.4 GHz</span>
            </div>
            <div className="bg-[#08090d] p-1.5 rounded border border-[#1f2638] text-center">
              <span className="text-slate-500 block text-[9px]">LPDDR5X</span>
              <span className="text-white font-bold">8.5 Gbps</span>
            </div>
          </div>
        </div>

        {/* Area Card */}
        <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono text-[11px]">
              <Cpu className="h-3.5 w-3.5" /> SILICON DIE BUDGET
            </span>
            <span className="font-mono text-xs text-slate-300">
              {totalAllocatedArea.toFixed(1)} / {project.targetAreaBudgetMm2} mm²
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {totalAllocatedArea.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono">mm² alocados (96.5%)</span>
          </div>

          <div className="flex gap-1 mt-3">
            {Array.from({ length: 20 }).map((_, i) => {
              const active = (i / 20) <= (totalAllocatedArea / project.targetAreaBudgetMm2);
              return (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-[1px] ${
                    active ? 'bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.5)]' : 'bg-[#1a202c]'
                  }`}
                />
              );
            })}
          </div>

          <p className="text-[11px] text-emerald-400 mt-2.5 font-mono flex items-center gap-1">
            <span>●</span> Área livre para decap/filler cells: {(project.targetAreaBudgetMm2 - totalAllocatedArea).toFixed(1)} mm²
          </p>
        </div>
      </div>

      {/* Static Timing Analysis (STA) & PVT Corners */}
      <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-5 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c2230] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-semibold">
                TIMING CLOSURE IN PROGRESS
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                SIGN-OFF ENGINE: PRIMETIME v2025.06
              </span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-1 font-tech tracking-wide">
              <Activity className="h-4 w-4 text-amber-400" />
              ANÁLISE DE TIMING ESTÁTICO (STA) & SIGN-OFF CORNERS
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Validação das 16 esquinas de Processo, Tensão e Temperatura (PVT) exigidas pela fundição TSMC N4P.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-700 font-bold">
              WNS: -12 ps
            </span>
            <span className="px-2.5 py-1 rounded bg-[#08090d] text-slate-300 border border-[#22293b]">
              TNS: -48 ps
            </span>
          </div>
        </div>

        {/* PVT Corners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {corners.map((corner) => {
            const isSelected = selectedCorner === corner.id;
            const isPass = corner.status === 'pass';
            return (
              <button
                key={corner.id}
                onClick={() => setSelectedCorner(corner.id)}
                className={`p-3.5 rounded-lg border text-left transition-all relative ${
                  isSelected
                    ? 'ring-1 ring-amber-400 bg-[#131622] border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'bg-[#08090d] border-[#1f2638] hover:border-[#2f394f]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-white">{corner.name}</span>
                  {isPass ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                      PASSED
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-700 animate-pulse font-bold">
                      VIOLAÇÃO
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mb-2">{corner.condition}</div>
                <div className="flex items-baseline justify-between text-xs font-mono pt-2 border-t border-[#1a202f]">
                  <span className="text-slate-500 text-[10px]">WORST SLACK:</span>
                  <span className={`font-bold ${corner.wnsPs < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {corner.wnsPs >= 0 ? `+${corner.wnsPs}` : corner.wnsPs} ps
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed line-clamp-2 font-mono">
                  {corner.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Critical Timing Paths Table */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              CAMINHOS CRÍTICOS REMANESCENTES (SETUP & HOLD)
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Violações de Setup: 2 | ECOs Planejados: 2</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#1f2638]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#08090d] text-slate-400 border-b border-[#1f2638]">
                <tr>
                  <th className="p-2.5 font-semibold text-[11px]">ID</th>
                  <th className="p-2.5 font-semibold text-[11px]">LAUNCH PIN</th>
                  <th className="p-2.5 font-semibold text-[11px]">CAPTURE PIN</th>
                  <th className="p-2.5 font-semibold text-[11px]">CLOCK DOMAIN</th>
                  <th className="p-2.5 font-semibold text-[11px]">SLACK</th>
                  <th className="p-2.5 font-semibold text-[11px]">AÇÃO DE ECO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181e2b] bg-[#090b10]">
                {criticalPaths.map((cp) => (
                  <tr key={cp.id} className="hover:bg-[#101420] transition-colors">
                    <td className="p-2.5 text-amber-400 font-bold">{cp.id}</td>
                    <td className="p-2.5 text-slate-300 max-w-[170px] truncate text-[11px]" title={cp.startPoint}>
                      {cp.startPoint}
                    </td>
                    <td className="p-2.5 text-slate-300 max-w-[170px] truncate text-[11px]" title={cp.endPoint}>
                      {cp.endPoint}
                    </td>
                    <td className="p-2.5 text-slate-400 text-[11px]">{cp.clockDomain}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          cp.slackPs < 0
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {cp.slackPs >= 0 ? `+${cp.slackPs}` : cp.slackPs} ps
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-300 text-[11px]">
                      {cp.ecoAction.includes('Swap') ? (
                        <span className="text-amber-300 font-semibold">{cp.ecoAction}</span>
                      ) : cp.ecoAction.includes('Buffer') ? (
                        <span className="text-amber-300 font-semibold">{cp.ecoAction}</span>
                      ) : (
                        <span className="text-slate-500">{cp.ecoAction}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Subsystem Power & Area Breakdown */}
      <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-tech tracking-wide">
            <BarChart2 className="h-4 w-4 text-amber-400" />
            DISTRIBUIÇÃO DE ÁREA (mm²) E ENERGIA (W) POR SUBSISTEMA
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Total: 7 Blocos Mapeados</span>
        </div>

        <div className="space-y-2.5">
          {blocks.map((block) => {
            const areaShare = ((block.areaMm2 / totalAllocatedArea) * 100).toFixed(1);
            const powerShare = ((block.powerMw / (totalAllocatedPower * 1000)) * 100).toFixed(1);

            return (
              <div key={block.id} className="bg-[#08090d] p-3 rounded-lg border border-[#1c2230]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 mb-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{block.name}</span>
                    <span className="text-[10px] text-slate-500">[{block.clockDomain}]</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-300">
                    <span>
                      ÁREA: <strong className="text-cyan-300">{block.areaMm2} mm²</strong> ({areaShare}%)
                    </span>
                    <span>
                      TDP: <strong className="text-amber-300">{(block.powerMw / 1000).toFixed(2)} W</strong> ({powerShare}%)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#121622] h-2 rounded overflow-hidden flex gap-0.5 p-[1px]">
                  <div
                    className="bg-cyan-400 h-full rounded-[1px]"
                    style={{ width: `${areaShare}%` }}
                    title={`Área: ${areaShare}%`}
                  ></div>
                  <div
                    className="bg-amber-400 h-full rounded-[1px]"
                    style={{ width: `${powerShare}%` }}
                    title={`Consumo: ${powerShare}%`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
