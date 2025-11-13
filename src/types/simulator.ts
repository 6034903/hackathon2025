export interface Appliance {
  id: string;
  name: string;
  power: number; // kW
  duration: number; // hours
  startTime: number; // 0-23
  endTime: number; // 0-23, calculated as (startTime + duration) % 24
  flexible: boolean; // Can be rescheduled
}

export type EnergySource = 'solar' | 'wind' | 'heat_pump' | 'kinetic';

export interface EnergySourceConfig {
  type: EnergySource;
  capacity: number;
  isActive: boolean;
  efficiency?: number; // For heat pumps (COP)
}

export interface SimulationConfig {
  energySources: EnergySourceConfig[];
  batteryCapacity: number;
  appliances: Appliance[];
  prioritizeFreeEnergy: boolean;
}

export interface HourlyData {
  hour: number;
  solarGeneration: number;
  windGeneration: number;
  heatPumpGeneration: number;
  kineticGeneration: number;
  totalGeneration: number;
  consumption: number;
  batteryLevel: number;
  gridImport: number;
  gridExport: number;
  freeEnergyUsed: number;
  cost: number;
  co2: number;
}

export interface SimulationResult {
  hourlyData: HourlyData[];
  totalCost: number;
  totalCO2: number;
  totalConsumption: number;
  totalGeneration: number;
  selfSufficiency: number; // percentage
  gridImport: number;
  gridExport: number;
  batteryLevel: number;
  freeEnergyUsed: number;
}

export interface ComparisonResult {
  normal: SimulationResult;
  optimized: SimulationResult;
  costSavings: number;
  co2Savings: number;
  costSavingsPercentage: number;
  co2SavingsPercentage: number;
}
