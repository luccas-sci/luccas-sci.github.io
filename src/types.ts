export type BlockStatus = 'complete' | 'in-progress' | 'warning' | 'pending';
export type MilestoneStatus = 'completed' | 'in_progress' | 'delayed' | 'upcoming';
export type BugSeverity = 'P0_Blocker' | 'P1_Critical' | 'P2_Major' | 'P3_Minor';

export interface IpBlock {
  id: string;
  name: string;
  category: 'compute' | 'memory' | 'interconnect' | 'io' | 'analog' | 'security';
  teamLead: string;
  rtlStatus: number; // 0-100%
  verificationCoverage: number; // 0-100%
  timingSlackNs: number; // Worst Negative Slack in ns
  areaMm2: number; // in mm²
  powerMw: number; // in mW
  clockDomain: string; // e.g., "3.2 GHz"
  status: BlockStatus;
  description: string;
  gridArea: {
    colStart: number;
    colSpan: number;
    rowStart: number;
    rowSpan: number;
  };
  notes: string;
}

export interface PhaseStep {
  id: string;
  name: string;
  phaseNumber: number;
  progress: number; // 0-100%
  status: 'done' | 'current' | 'upcoming' | 'blocked';
  lead: string;
  deadline: string;
  deliverables: string[];
}

export interface Milestone {
  id: string;
  title: string;
  category: 'RTL' | 'Verif' | 'Backend' | 'Foundry' | 'Silicon';
  date: string;
  status: MilestoneStatus;
  leadOwner: string;
  deliverable: string;
  completionPercentage: number;
}

export interface EngineeringLog {
  id: string;
  timestamp: string;
  category: 'STA' | 'RTL' | 'Verificação' | 'Síntese' | 'DRC/LVS' | 'Foundry';
  author: string;
  title: string;
  description: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  hash?: string;
}

export interface BugRecord {
  id: string;
  title: string;
  module: string;
  severity: BugSeverity;
  status: 'Open' | 'Investigating' | 'Fix_Verified' | 'Closed';
  assignee: string;
  createdDate: string;
}

export interface SocProjectInfo {
  name: string;
  codeName: string;
  node: string;
  foundry: string;
  packageType: string;
  tapeOutTargetDate: string;
  totalTransistors: string;
  targetAreaBudgetMm2: number;
  currentEstimatedAreaMm2: number;
  targetTdpW: number;
  currentEstimatedTdpW: number;
  boostClockGhz: number;
  baseClockGhz: number;
  voltageNominalV: number;
  overallReadinessPercent: number;
}
