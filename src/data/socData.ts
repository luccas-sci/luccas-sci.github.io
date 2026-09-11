import { SocProjectInfo, IpBlock, PhaseStep, Milestone, EngineeringLog, BugRecord } from '../types';

export const initialProjectInfo: SocProjectInfo = {
  name: "Helios-4N",
  codeName: "Project Prometeu",
  node: "TSMC N4P (FinFET 4nm)",
  foundry: "TSMC Fab 18 (Tainan, Taiwan)",
  packageType: "FC-BGA 24x24 mm (840 esferas)",
  tapeOutTargetDate: "2026-11-18T00:00:00",
  totalTransistors: "18.4 Bilhões",
  targetAreaBudgetMm2: 82.0,
  currentEstimatedAreaMm2: 78.6,
  targetTdpW: 16.0,
  currentEstimatedTdpW: 14.3,
  boostClockGhz: 3.2,
  baseClockGhz: 2.4,
  voltageNominalV: 0.75,
  overallReadinessPercent: 78.4,
};

export const initialIpBlocks: IpBlock[] = [
  {
    id: "cpu-complex",
    name: "CPU Complex (RISC-V 8-Core)",
    category: "compute",
    teamLead: "Dra. Carolina Mendes",
    rtlStatus: 100,
    verificationCoverage: 96.4,
    timingSlackNs: -0.012, // slightly tight on 3.2GHz corner
    areaMm2: 24.8,
    powerMw: 6200,
    clockDomain: "3.2 GHz",
    status: "warning", // timing slack needs closure
    description: "Cluster heterogêneo de 8 núcleos RISC-V 64-bit (2x Performance @ 3.2GHz + 6x Efficiency @ 2.4GHz) com 8MB L3 Cache compartilhado.",
    gridArea: { colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 2 },
    notes: "RTL 100% congelado. Otimizando buffer trees no corner SSG (-40°C, 0.68V) para fechar WNS de -12ps."
  },
  {
    id: "npu-matrix",
    name: "NPU Neural Matrix (32 TOPS)",
    category: "compute",
    teamLead: "Eng. Rafael Tanaka",
    rtlStatus: 100,
    verificationCoverage: 98.2,
    timingSlackNs: 0.045,
    areaMm2: 16.2,
    powerMw: 3400,
    clockDomain: "1.8 GHz",
    status: "complete",
    description: "Acelerador de redes neurais com matriz sistólica para INT8, INT4 e FP16, com suporte a LLMs embarcados e visão computacional.",
    gridArea: { colStart: 4, colSpan: 3, rowStart: 1, rowSpan: 2 },
    notes: "Design fechado com margem positiva de timing em todas as 16 corners PVT. Verificação formal UVM concluída."
  },
  {
    id: "gpu-cluster",
    name: "GPU Shader Core (4-CU)",
    category: "compute",
    teamLead: "Dra. Sofia Alencar",
    rtlStatus: 95,
    verificationCoverage: 91.0,
    timingSlackNs: 0.015,
    areaMm2: 11.4,
    powerMw: 2600,
    clockDomain: "1.4 GHz",
    status: "in-progress",
    description: "Cluster gráfico de 4 Compute Units compatível com Vulkan 1.3, OpenCL e ray tracing leve para displays de alta resolução.",
    gridArea: { colStart: 1, colSpan: 2, rowStart: 3, rowSpan: 2 },
    notes: "Finalizando testes de regressão de texturização e anti-aliasing. Síntese física em andamento."
  },
  {
    id: "noc-interconnect",
    name: "Coherent NoC (Mesh Interconnect)",
    category: "interconnect",
    teamLead: "Eng. Lucas Silveira",
    rtlStatus: 100,
    verificationCoverage: 97.5,
    timingSlackNs: 0.080,
    areaMm2: 6.8,
    powerMw: 750,
    clockDomain: "2.0 GHz",
    status: "complete",
    description: "Rede em chip coerente AXI5/CHI com barramento de baixa latência interligando núcleos de CPU, NPU, memória e aceleradores.",
    gridArea: { colStart: 3, colSpan: 2, rowStart: 3, rowSpan: 2 },
    notes: "Validação de concorrência e ausência de deadlocks concluída com 10M de transações sintéticas."
  },
  {
    id: "security-enclave",
    name: "Security Enclave (Root of Trust)",
    category: "security",
    teamLead: "Dra. Beatriz Fontana",
    rtlStatus: 100,
    verificationCoverage: 99.8,
    timingSlackNs: 0.120,
    areaMm2: 2.1,
    powerMw: 110,
    clockDomain: "400 MHz",
    status: "complete",
    description: "Núcleo de segurança isolado com OTP fuses, acelerador criptográfico PQC (Pós-Quântico), AES-256-XTS e boot seguro criptografado.",
    gridArea: { colStart: 5, colSpan: 2, rowStart: 3, rowSpan: 1 },
    notes: "Auditoria externa de penetração e proteção contra side-channel attack (DPA/EMA) aprovada."
  },
  {
    id: "pmu-pll",
    name: "Analog PMU & Clock PLLs",
    category: "analog",
    teamLead: "Eng. Marcelo Siqueira",
    rtlStatus: 92,
    verificationCoverage: 88.5,
    timingSlackNs: 0.030,
    areaMm2: 2.8,
    powerMw: 180,
    clockDomain: "Misto / Analógico",
    status: "in-progress",
    description: "Gerador de clock frac-N ultra-low jitter, 12 sensores de temperatura de silício integrados e LDOs de regulação dinâmica de tensão (DVFS).",
    gridArea: { colStart: 5, colSpan: 2, rowStart: 4, rowSpan: 1 },
    notes: "Simulação analógica SPICE final no corner de temperatura máxima (125°C) em andamento."
  },
  {
    id: "lpddr5x-phy",
    name: "LPDDR5X-8533 PHY & Controller",
    category: "memory",
    teamLead: "Eng. Victor Albuquerque",
    rtlStatus: 98,
    verificationCoverage: 94.0,
    timingSlackNs: -0.008,
    areaMm2: 7.9,
    powerMw: 880,
    clockDomain: "4266 MHz (DDR)",
    status: "warning",
    description: "Controlador dual-channel de 64-bit para memórias LPDDR5X até 8533 MT/s, fornecendo até 68.2 GB/s de largura de banda de memória.",
    gridArea: { colStart: 1, colSpan: 3, rowStart: 5, rowSpan: 1 },
    notes: "Ajustando calibração DQS skew no pad ring. DRC limpo, fechando timing residual nos buffers de I/O."
  },
  {
    id: "isp-vpu",
    name: "ISP 4K HDR & VPU Codec",
    category: "compute",
    teamLead: "Dra. Juliana Prado",
    rtlStatus: 96,
    verificationCoverage: 92.4,
    timingSlackNs: 0.050,
    areaMm2: 4.2,
    powerMw: 450,
    clockDomain: "800 MHz",
    status: "in-progress",
    description: "Processamento de sinal de imagem triplo de 48MP com 3DNR, redutor de ruído neural e decodificador/codificador 8K AV1 e HEVC.",
    gridArea: { colStart: 4, colSpan: 1, rowStart: 5, rowSpan: 1 },
    notes: "Bitstreams de teste de vídeo 10-bit HDR em execução. Taxa de erro zero após 500 horas de playback simulado."
  },
  {
    id: "pcie-usb",
    name: "PCIe Gen5 x8 / USB4 PHY",
    category: "io",
    teamLead: "Eng. Gabriel Morais",
    rtlStatus: 94,
    verificationCoverage: 90.2,
    timingSlackNs: 0.022,
    areaMm2: 2.4,
    powerMw: 320,
    clockDomain: "32 GT/s SerDes",
    status: "in-progress",
    description: "Controladores SerDes de alta velocidade suportando PCIe Gen5 (32 GT/s por lane), CXL 2.0 e portas USB4 / Thunderbolt 4 com eDP 1.4.",
    gridArea: { colStart: 5, colSpan: 2, rowStart: 5, rowSpan: 1 },
    notes: "Olho de jitter do SerDes em conformidade com o padrão PCI-SIG. Layout de bump pitch validado."
  }
];

export const initialPhases: PhaseStep[] = [
  {
    id: "phase-1",
    phaseNumber: 1,
    name: "Especificação & Arquitetura",
    progress: 100,
    status: "done",
    lead: "Comitê de Arquitetura",
    deadline: "Março 2026",
    deliverables: ["Microarchitecture Spec v1.0", "Modelagem de Desempenho C++ (Gem5)", "Orçamento PPA Preliminar"]
  },
  {
    id: "phase-2",
    phaseNumber: 2,
    name: "Design RTL & Integração",
    progress: 100,
    status: "done",
    lead: "Dra. Carolina Mendes",
    deadline: "Julho 2026",
    deliverables: ["RTL Freeze Oficial (Git Tag v1.0-RC)", "Linting & CDC (Spyglass) Limpo", "Upf 3.0 Power Intent Definido"]
  },
  {
    id: "phase-3",
    phaseNumber: 3,
    name: "Verificação Funcional & UVM",
    progress: 94,
    status: "current",
    lead: "Eng. Rafael Tanaka",
    deadline: "Outubro 2026",
    deliverables: ["100% Cobertura de Código", "95%+ Cobertura Funcional de Assertivas", "Pass Rate de Regressões > 99%"]
  },
  {
    id: "phase-4",
    phaseNumber: 4,
    name: "Síntese Lógica & DFT",
    progress: 88,
    status: "current",
    lead: "Eng. Lucas Silveira",
    deadline: "Outubro 2026",
    deliverables: ["Gate-level Netlist", "Inserção de Scan Chains (ATPG)", "Memories BIST & Boundary Scan"]
  },
  {
    id: "phase-5",
    phaseNumber: 5,
    name: "Design Físico (P&R Floorplan)",
    progress: 76,
    status: "current",
    lead: "Dra. Sofia Alencar",
    deadline: "Novembro 2026",
    deliverables: ["Clock Tree Synthesis (CTS)", "Power Grid & IR Drop < 2.5%", "Roteamento Final de Metal 1-13"]
  },
  {
    id: "phase-6",
    phaseNumber: 6,
    name: "STA (Static Timing) & Sign-Off",
    progress: 62,
    status: "current",
    lead: "Dra. Carolina Mendes",
    deadline: "10 de Novembro 2026",
    deliverables: ["Zero Setup / Hold Violations", "Análise de Signal Integrity (SI)", "16 PVT Sign-off Corners Fechadas"]
  },
  {
    id: "phase-7",
    phaseNumber: 7,
    name: "DRC/LVS & GDSII Tape-out",
    progress: 45,
    status: "current",
    lead: "Eng. Victor Albuquerque",
    deadline: "18 de Novembro 2026",
    deliverables: ["DRC Calibre 100% Limpo", "LVS (Layout vs Schematic) Limpo", "GDSII / OASIS Exportado para TSMC"]
  },
  {
    id: "phase-8",
    phaseNumber: 8,
    name: "Fabricação na Foundry (Wafer Shuttle)",
    progress: 0,
    status: "upcoming",
    lead: "TSMC Foundry Account",
    deadline: "Janeiro 2027",
    deliverables: ["Máscaras Fotolitográficas N4P", "Wafer Run de 25 wafers de teste", "Wafer Sort & Probing inicial"]
  },
  {
    id: "phase-9",
    phaseNumber: 9,
    name: "Packaging & Bring-Up no Laboratório",
    progress: 0,
    status: "upcoming",
    lead: "Equipe de Validação de Silício",
    deadline: "Fevereiro 2027",
    deliverables: ["Montagem dos chips em placa de validação", "Boot do Linux no 1º Silício", "Caracterização Térmica e de Frequência"]
  }
];

export const initialMilestones: Milestone[] = [
  {
    id: "m-1",
    title: "Congelamento de Arquitetura e Specs",
    category: "RTL",
    date: "15/04/2026",
    status: "completed",
    leadOwner: "Dra. Carolina Mendes",
    deliverable: "Documento de Microarquitetura Helios-4N aprovado",
    completionPercentage: 100
  },
  {
    id: "m-2",
    title: "RTL Freeze Geral dos IPs",
    category: "RTL",
    date: "30/07/2026",
    status: "completed",
    leadOwner: "Eng. Lucas Silveira",
    deliverable: "Repositório RTL travado para novas funcionalidades",
    completionPercentage: 100
  },
  {
    id: "m-3",
    title: "Primeira Síntese Física e CTS",
    category: "Backend",
    date: "25/08/2026",
    status: "completed",
    leadOwner: "Dra. Sofia Alencar",
    deliverable: "Clock Tree preliminar com skew < 35ps",
    completionPercentage: 100
  },
  {
    id: "m-4",
    title: "Marco de Cobertura de Verificação 95%",
    category: "Verif",
    date: "15/09/2026",
    status: "in_progress",
    leadOwner: "Eng. Rafael Tanaka",
    deliverable: "Bateria de 50.000 testes randômicos UVM",
    completionPercentage: 94
  },
  {
    id: "m-5",
    title: "Fechamento de Timing STA (WNS < 0ps)",
    category: "Backend",
    date: "05/11/2026",
    status: "in_progress",
    leadOwner: "Dra. Carolina Mendes",
    deliverable: "Zero violações de setup e hold em todas as esquinas PVT",
    completionPercentage: 62
  },
  {
    id: "m-6",
    title: "Tape-out Final GDSII para TSMC",
    category: "Foundry",
    date: "18/11/2026",
    status: "upcoming",
    leadOwner: "Eng. Victor Albuquerque",
    deliverable: "Entrega do arquivo OASIS/GDSII no portal da TSMC",
    completionPercentage: 45
  },
  {
    id: "m-7",
    title: "Chegada dos Wafers e 1º Silício",
    category: "Silicon",
    date: "28/01/2027",
    status: "upcoming",
    leadOwner: "Equipe de Validação",
    deliverable: "Amostras A0 recebidas para teste elétrico",
    completionPercentage: 0
  }
];

export const initialBugs: BugRecord[] = [
  {
    id: "BUG-104",
    title: "Hold violation de 18ps no domínio de clock da CPU (L3 cache tag array)",
    module: "CPU Complex",
    severity: "P0_Blocker",
    status: "Investigating",
    assignee: "Dra. Carolina Mendes",
    createdDate: "09/09/2026"
  },
  {
    id: "BUG-102",
    title: "DQS skew timing fora da tolerância no pad ring LPDDR5X (corner Fast-Cold)",
    module: "LPDDR5X-8533 PHY",
    severity: "P1_Critical",
    status: "Investigating",
    assignee: "Eng. Victor Albuquerque",
    createdDate: "08/09/2026"
  },
  {
    id: "BUG-099",
    title: "Deadlock corner case sob tráfego saturado de GPU e NPU no NoC",
    module: "Coherent NoC",
    severity: "P1_Critical",
    status: "Fix_Verified",
    assignee: "Eng. Lucas Silveira",
    createdDate: "04/09/2026"
  },
  {
    id: "BUG-095",
    title: "Gaguejo de sincronização em transições de clock gating do cluster GPU",
    module: "GPU Shader Core",
    severity: "P2_Major",
    status: "Open",
    assignee: "Dra. Sofia Alencar",
    createdDate: "02/09/2026"
  },
  {
    id: "BUG-091",
    title: "Calibração de corrente de banda proibida (bandgap) varia 1.2% além do esperado a 110°C",
    module: "Analog PMU",
    severity: "P3_Minor",
    status: "Open",
    assignee: "Eng. Marcelo Siqueira",
    createdDate: "28/08/2026"
  }
];

export const initialLogs: EngineeringLog[] = [
  {
    id: "log-1",
    timestamp: "Hoje, 10:42",
    category: "STA",
    author: "Dra. Carolina Mendes",
    title: "Redução de WNS na CPU de -35ps para -12ps",
    description: "Aplicado re-buffering e útil de-skew nas redes de clock do L3 tag RAM. Restam apenas 4 caminhos em violação no corner SSG.",
    severity: "success",
    hash: "sta-run#9124"
  },
  {
    id: "log-2",
    timestamp: "Hoje, 08:15",
    category: "Verificação",
    author: "Eng. Rafael Tanaka",
    title: "Regressão Noturna #482 finalizada com 98.8% de aprovação",
    description: "21.450 sementes randômicas executadas no cluster LSF. 0 bugs de integridade de dados detectados no acelerador NPU.",
    severity: "info",
    hash: "reg-suite-v4"
  },
  {
    id: "log-3",
    timestamp: "Ontem, 17:30",
    category: "DRC/LVS",
    author: "Eng. Victor Albuquerque",
    title: "Calibre DRC: Metal 7 e Metal 8 100% limpos",
    description: "Corrigidos 14 erros de espaçamento mínimo de trilhas nos barramentos de alimentação do core central. Densidade de metal aprovada.",
    severity: "success",
    hash: "calibre-drc-pass"
  },
  {
    id: "log-4",
    timestamp: "Ontem, 14:10",
    category: "Foundry",
    author: "Eng. Lucas Silveira",
    title: "TSMC DRC Rule Deck v1.4 importado e configurado",
    description: "Atualizadas as regras de restrição de litografia EUV para contato de porta FinFET. Sem impacto na área total do chip.",
    severity: "info",
    hash: "tsmc-deck-v1.4"
  },
  {
    id: "log-5",
    timestamp: "09/09/2026, 11:20",
    category: "STA",
    author: "Eng. Victor Albuquerque",
    title: "Alerta de Violação de Hold no I/O Ring",
    description: "Identificada violação de hold de 18ps no pad ring LPDDR5X sob baixa temperatura (-40°C). Ajuste de delay cell agendado.",
    severity: "warning",
    hash: "sta-err-pad#11"
  }
];
