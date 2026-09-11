import React, { useState } from 'react';
import { IpBlock } from '../types';
import { Cpu, Zap, Activity, Clock, User, AlertCircle, Shield, CheckCircle2, ChevronRight, Layers, Maximize2, Crosshair, Disc, Sliders, Hash } from 'lucide-react';

interface DieFloorplanProps {
  blocks: IpBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onUpdateBlockNotes?: (id: string, notes: string) => void;
}

type ViewOverlayMode = 'status' | 'power' | 'coverage' | 'timing';

export const DieFloorplan: React.FC<DieFloorplanProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlockNotes,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [overlayMode, setOverlayMode] = useState<ViewOverlayMode>('status');
  const [hoverCoord, setHoverCoord] = useState<{ x: string; y: string } | null>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || blocks[0];

  const filteredBlocks = blocks.filter((b) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'compute') return b.category === 'compute';
    if (filterCategory === 'memory') return b.category === 'memory' || b.category === 'interconnect';
    if (filterCategory === 'io_analog') return b.category === 'io' || b.category === 'analog';
    if (filterCategory === 'security') return b.category === 'security';
    return true;
  });

  const getBlockColor = (block: IpBlock) => {
    if (overlayMode === 'status') {
      if (block.status === 'complete') return 'bg-[#091a13] border-emerald-500/70 text-emerald-300 hover:border-emerald-400 hover:bg-[#0c241b]';
      if (block.status === 'warning') return 'bg-[#1f1609] border-amber-500/80 text-amber-300 hover:border-amber-400 hover:bg-[#2c1f0d]';
      return 'bg-[#0f172a] border-blue-500/60 text-blue-200 hover:border-blue-400 hover:bg-[#14203a]';
    }

    if (overlayMode === 'power') {
      // Heatmap based on mW
      if (block.powerMw > 4000) return 'bg-[#290a0d] border-rose-500/90 text-rose-300 hover:bg-[#3b0e14]';
      if (block.powerMw > 2000) return 'bg-[#271607] border-amber-500/90 text-amber-300 hover:bg-[#38200b]';
      if (block.powerMw > 500) return 'bg-[#111e2e] border-cyan-500/80 text-cyan-300 hover:bg-[#16293f]';
      return 'bg-[#0c1f17] border-emerald-500/80 text-emerald-300 hover:bg-[#122c21]';
    }

    if (overlayMode === 'coverage') {
      if (block.verificationCoverage >= 96) return 'bg-[#0c1f17] border-emerald-500/90 text-emerald-300';
      if (block.verificationCoverage >= 92) return 'bg-[#122030] border-cyan-500/80 text-cyan-300';
      return 'bg-[#271607] border-amber-500/90 text-amber-300';
    }

    if (overlayMode === 'timing') {
      if (block.timingSlackNs < 0) return 'bg-[#2d090d] border-rose-500/90 text-rose-300 animate-pulse';
      if (block.timingSlackNs < 0.02) return 'bg-[#261507] border-amber-500/90 text-amber-300';
      return 'bg-[#0c1f17] border-emerald-500/90 text-emerald-300';
    }

    return 'bg-[#11141d] border-[#222938] text-slate-300';
  };

  const getMetricTag = (block: IpBlock) => {
    if (overlayMode === 'status') {
      return block.status === 'complete' ? 'SIGN-OFF OK' : block.status === 'warning' ? 'WNS SLACK NEG' : 'P&R ACTIVE';
    }
    if (overlayMode === 'power') {
      return `${(block.powerMw / 1000).toFixed(2)} W`;
    }
    if (overlayMode === 'coverage') {
      return `${block.verificationCoverage}% COV`;
    }
    if (overlayMode === 'timing') {
      const ps = Math.round(block.timingSlackNs * 1000);
      return `${ps >= 0 ? '+' : ''}${ps} ps`;
    }
    return '';
  };

  // Mock I/O pads around perimeter
  const topPads = ['VDD_0', 'DDR_DQ0', 'DDR_DQ1', 'DDR_DQS', 'VSS_0', 'PCIE_TX0', 'PCIE_TX1', 'VDD_1', 'REFCLK_P', 'REFCLK_N', 'VSS_1', 'MIPI_DP0'];
  const sidePads = ['GPIO_0', 'I2C_SDA', 'SPI_CLK', 'UART_TX', 'JTAG_TMS', 'TRST_N', 'SYS_RST'];

  return (
    <div className="bg-[#0c0e14] border border-[#222938] rounded-xl p-5 mb-8 shadow-2xl relative">
      {/* Industrial Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1c2230]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-semibold">
              CADENCE INNOVUS / TSMC N4P GDSII
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              TOP_CELL: <strong className="text-slate-200">HELIOS_SOC_REV_A0</strong>
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-1 font-tech tracking-wide">
            <Crosshair className="h-4 w-4 text-amber-400" />
            FLOORPLAN FÍSICO DO SILÍCIO (DIE MAP)
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Área Total: <span className="text-amber-300">78.60 mm²</span> (8.82 × 8.91 mm) • Scribe Ring: 65µm • 15 Camadas Metálicas (Cu/Ru)
          </p>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mechanical Mode Selector */}
          <div className="bg-[#08090d] border border-[#22293b] rounded-lg p-1 flex text-[11px] font-mono shadow-inner">
            <button
              onClick={() => setOverlayMode('status')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                overlayMode === 'status'
                  ? 'bg-[#181d2a] text-amber-300 border border-amber-500/50 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>[01] Status RTL</span>
            </button>
            <button
              onClick={() => setOverlayMode('power')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                overlayMode === 'power'
                  ? 'bg-[#181d2a] text-amber-400 border border-amber-500/50 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>[02] Calor / TDP</span>
            </button>
            <button
              onClick={() => setOverlayMode('coverage')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                overlayMode === 'coverage'
                  ? 'bg-[#181d2a] text-emerald-400 border border-emerald-500/50 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>[03] UVM Cobertura</span>
            </button>
            <button
              onClick={() => setOverlayMode('timing')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                overlayMode === 'timing'
                  ? 'bg-[#181d2a] text-rose-400 border border-rose-500/50 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>[04] STA Slack</span>
            </button>
          </div>

          {/* Subsystem Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#08090d] border border-[#262e40] text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">TODOS OS SUBSISTEMAS</option>
            <option value="compute">COMPUTAÇÃO (CPU/GPU/NPU)</option>
            <option value="memory">MEMÓRIA & FABRIC</option>
            <option value="io_analog">I/O & ANALÓGICO PHY</option>
            <option value="security">ROOT OF TRUST / CRYPTO</option>
          </select>
        </div>
      </div>

      {/* Main Floorplan Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Left: Interactive Die Representation */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {/* Coordinates HUD Bar */}
          <div className="w-full max-w-[560px] mb-2 flex items-center justify-between text-[10px] font-mono text-slate-400 px-2 select-none">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">CROSSHAIR:</span>
              <span className="text-slate-200">{hoverCoord ? `X: +${hoverCoord.x}mm | Y: +${hoverCoord.y}mm` : 'X: +04.41mm | Y: +04.45mm'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>ACTIVE LAYER:</span>
              <span className="text-amber-300 font-bold">{overlayMode.toUpperCase()}</span>
            </div>
          </div>

          {/* Simulated Silicon Die with Seal Ring, Fiducials, and I/O Pad Ring */}
          <div 
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = ((e.clientX - rect.left) / rect.width * 8.82).toFixed(2);
              const relY = ((e.clientY - rect.top) / rect.height * 8.91).toFixed(2);
              setHoverCoord({ x: relX, y: relY });
            }}
            onMouseLeave={() => setHoverCoord(null)}
            className="w-full max-w-[560px] aspect-square rounded-lg bg-[#090b10] p-2.5 border-2 border-[#2b3345] shadow-2xl relative silicon-grid"
          >
            {/* Photolithography Reticle Marks on the 4 corners */}
            <div className="absolute top-1 left-2 text-[9px] font-mono text-amber-500/80 flex items-center gap-1 select-none pointer-events-none">
              <span>+ PDK_N4P_LL</span>
            </div>
            <div className="absolute top-1 right-2 text-[9px] font-mono text-amber-500/80 select-none pointer-events-none">
              <span>RETICLE_ALIGN +</span>
            </div>
            <div className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-500 select-none pointer-events-none">
              <span>+ SCRIBE_GUARD</span>
            </div>
            <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-500 select-none pointer-events-none">
              <span>TSMC_FAB18 +</span>
            </div>

            {/* Perimeter I/O Micro Bond-Pad Array (Authentic IC Micrograph Visual) */}
            <div className="absolute top-3.5 left-8 right-8 flex justify-between pointer-events-none">
              {topPads.map((pad, idx) => (
                <div key={idx} className="w-1.5 h-1 bg-amber-500/60 rounded-[0.5px] border border-amber-300/80" title={pad} />
              ))}
            </div>
            <div className="absolute bottom-3.5 left-8 right-8 flex justify-between pointer-events-none">
              {topPads.map((pad, idx) => (
                <div key={idx} className="w-1.5 h-1 bg-amber-500/60 rounded-[0.5px] border border-amber-300/80" title={pad} />
              ))}
            </div>
            <div className="absolute left-3.5 top-8 bottom-8 flex flex-col justify-between pointer-events-none">
              {sidePads.map((pad, idx) => (
                <div key={idx} className="w-1 h-1.5 bg-amber-500/60 rounded-[0.5px] border border-amber-300/80" title={pad} />
              ))}
            </div>
            <div className="absolute right-3.5 top-8 bottom-8 flex flex-col justify-between pointer-events-none">
              {sidePads.map((pad, idx) => (
                <div key={idx} className="w-1 h-1.5 bg-amber-500/60 rounded-[0.5px] border border-amber-300/80" title={pad} />
              ))}
            </div>

            {/* Scribe line / Silicon Seal Ring border */}
            <div className="w-full h-full border border-amber-500/30 rounded-md p-3.5 flex flex-col justify-between bg-[#08090d]/90">
              {/* Functional Core Floorplan Grid */}
              <div className="w-full h-full grid grid-cols-6 grid-rows-5 gap-1.5 bg-[#06070a] rounded p-1.5 border border-[#1e2536]">
                {blocks.map((block) => {
                  const isFiltered = filteredBlocks.some((fb) => fb.id === block.id);
                  const isSelected = block.id === selectedBlock.id;
                  const colorClass = getBlockColor(block);

                  return (
                    <button
                      key={block.id}
                      onClick={() => onSelectBlock(block.id)}
                      style={{
                        gridColumnStart: block.gridArea.colStart,
                        gridColumnEnd: `span ${block.gridArea.colSpan}`,
                        gridRowStart: block.gridArea.rowStart,
                        gridRowEnd: `span ${block.gridArea.rowSpan}`,
                      }}
                      className={`relative rounded p-1.5 border text-left transition-all duration-150 flex flex-col justify-between group overflow-hidden ${
                        isSelected
                          ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-[#06070a] z-10 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                          : ''
                      } ${!isFiltered ? 'opacity-20 grayscale' : 'opacity-100'} ${colorClass}`}
                    >
                      {/* Integrated Circuit Metal Traces Pattern */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[10px] sm:text-[11px] font-bold truncate tracking-tight text-white">
                            {block.name.split(' (')[0]}
                          </span>
                          {block.status === 'complete' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_4px_#34d399]"></span>
                          )}
                          {block.status === 'warning' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 animate-ping"></span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 block truncate font-mono">
                          {block.clockDomain}
                        </span>
                      </div>

                      <div className="relative z-10 flex items-end justify-between mt-1 text-[9px] font-mono">
                        <span className="font-semibold text-slate-300">{block.areaMm2}mm²</span>
                        <span className="px-1 py-0.2 rounded bg-black/60 text-amber-300 font-bold border border-black/80">
                          {getMetricTag(block)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Wafer 300mm Minimap & Reticle Legend Widget */}
          <div className="w-full max-w-[560px] mt-3.5 bg-[#080a0f] border border-[#1c2230] rounded-lg p-2.5 flex items-center justify-between text-xs font-mono text-slate-400">
            {/* 300mm Wafer Disk Graphic */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full bg-[#161a26] border border-amber-500/50 flex items-center justify-center shadow-inner" title="Wafer 300mm (Die #42 de 584)">
                {/* Silicon Wafer Notch at 6 o'clock */}
                <div className="absolute bottom-0 w-1.5 h-0.5 bg-slate-900 rounded-t-sm" />
                {/* Active Die highlight on Wafer map */}
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-xs shadow-[0_0_4px_#fbbf24] animate-pulse" />
              </div>
              <div className="text-[10px] leading-tight">
                <span className="text-slate-200 font-bold block">WAFER 300mm Ø</span>
                <span className="text-slate-500">DIE #42 DE 584 NO RETÍCULO</span>
              </div>
            </div>

            {/* Micro status legend */}
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-[1px] bg-emerald-500"></span>
                Sign-off
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-[1px] bg-blue-500"></span>
                P&R
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-[1px] bg-amber-500"></span>
                Timing
              </span>
            </div>
          </div>
        </div>

        {/* Right: Selected IP Block Inspection Dossier */}
        <div className="lg:col-span-5 bg-[#090b10] border border-[#222938] rounded-xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            {/* Block Header with Technical Stamp */}
            <div className="flex items-start justify-between pb-3 border-b border-[#1c2230]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                    [IP-{selectedBlock.id.toUpperCase()}]
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    GDSII LAYER: M1-M15
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5 font-tech tracking-wide">
                  {selectedBlock.name}
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                  selectedBlock.status === 'complete'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                    : selectedBlock.status === 'warning'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                    : 'bg-blue-950/80 text-blue-300 border-blue-700'
                }`}
              >
                {selectedBlock.status === 'complete' ? 'SIGN-OFF OK' : selectedBlock.status === 'warning' ? 'WNS ALERTA' : 'P&R EM CURSO'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {selectedBlock.description}
            </p>

            {/* Precision Telemetry Dossier Grid */}
            <div className="grid grid-cols-2 gap-2 mt-3.5">
              <div className="bg-[#11141e] border border-[#202636] rounded-lg p-2.5">
                <span className="text-[10px] font-mono text-slate-400 block">ÁREA FÍSICA NO SILÍCIO</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-mono font-bold text-white">{selectedBlock.areaMm2} mm²</span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    ({((selectedBlock.areaMm2 / 78.6) * 100).toFixed(1)}% do Die)
                  </span>
                </div>
              </div>

              <div className="bg-[#11141e] border border-[#202636] rounded-lg p-2.5">
                <span className="text-[10px] font-mono text-slate-400 block">DISSIPAÇÃO TÉRMICA (TDP)</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-mono font-bold text-white">
                    {(selectedBlock.powerMw / 1000).toFixed(2)} W
                  </span>
                  <span className="text-[10px] text-amber-500 font-mono">
                    ({((selectedBlock.powerMw / 14300) * 100).toFixed(1)}% SoC)
                  </span>
                </div>
              </div>

              <div className="bg-[#11141e] border border-[#202636] rounded-lg p-2.5">
                <span className="text-[10px] font-mono text-slate-400 block">DOMÍNIO DE CLOCK (PLL)</span>
                <div className="text-sm font-mono font-bold text-slate-100 mt-0.5">
                  {selectedBlock.clockDomain}
                </div>
              </div>

              <div className="bg-[#11141e] border border-[#202636] rounded-lg p-2.5">
                <span className="text-[10px] font-mono text-slate-400 block">COBERTURA FUNCIONAL (UVM)</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {selectedBlock.verificationCoverage}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">ASSERTIONS</span>
                </div>
              </div>

              {/* Timing Slack Block with SSG Corner details */}
              <div className="bg-[#11141e] border border-[#202636] rounded-lg p-2.5 col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">WORST NEGATIVE SLACK (WNS)</span>
                  <span className="text-[9px] font-mono text-amber-400/90 bg-amber-950/40 px-1 py-0.2 rounded border border-amber-800/40">
                    CORNER: SSG 0.68V -40°C
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-sm font-mono font-bold ${
                      selectedBlock.timingSlackNs < 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {selectedBlock.timingSlackNs < 0
                      ? `${Math.round(selectedBlock.timingSlackNs * 1000)} ps (Violação STA)`
                      : `+${Math.round(selectedBlock.timingSlackNs * 1000)} ps (Margem Fechada)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Lead Info */}
            <div className="mt-3 p-2 bg-[#11141e] border border-[#202636] rounded-lg flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-slate-400">Líder de Arquitetura:</span>
              </div>
              <span className="font-semibold text-slate-100">{selectedBlock.teamLead}</span>
            </div>

            {/* Engineering Note / Sign-off Log */}
            <div className="mt-2.5 p-2.5 bg-[#07080c] border border-[#202636] rounded-lg">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-medium block mb-1">
                DIÁRIO DE ENGENHARIA DO BLOCO:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {selectedBlock.notes}
              </p>
            </div>
          </div>

          {/* Bottom telemetry footer */}
          <div className="mt-3 pt-2.5 border-t border-[#1c2230] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Clique nos blocos do die para inspecionar</span>
            <span className="text-amber-400">{filteredBlocks.length} subsistemas no filtro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
