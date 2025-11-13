import { Appliance, EnergySourceConfig, HourlyData, SimulationConfig, SimulationResult } from "@/types/simulator";

// Energy prices per hour (€/kWh) - simplified dynamic pricing
// const ENERGY_PRICES = [
//   0.25, 0.23, 0.22, 0.21, 0.20, 0.22, // 0-5: Night (cheap)
//   0.30, 0.35, 0.38, 0.32, 0.28, 0.25, // 6-11: Morning peak
//   0.24, 0.23, 0.22, 0.24, 0.26, 0.35, // 12-17: Afternoon
//   0.40, 0.38, 0.35, 0.32, 0.28, 0.26, // 18-23: Evening peak
// ];
const ENERGY_PRICES = [
 0.19, 0.18, 0.17, 0.16, 0.15, 0.17,
  0.22, 0.27, 0.30, 0.28, 0.25, 0.23,
  0.21, 0.20, 0.19, 0.22, 0.24, 0.28,
  0.33, 0.31, 0.29, 0.27, 0.25, 0.24
];

// CO2 intensity per hour (kg CO₂/kWh) - grid intensity varies
// const CO2_INTENSITY = [
//   0.35, 0.33, 0.32, 0.30, 0.28, 0.30, // 0-5: Night (coal/gas)
//   0.38, 0.42, 0.40, 0.35, 0.28, 0.22, // 6-11: Morning (increasing renewables)
//   0.18, 0.15, 0.16, 0.20, 0.25, 0.35, // 12-17: Afternoon (peak solar)
//   0.42, 0.40, 0.38, 0.37, 0.36, 0.35, // 18-23: Evening (less renewables)
// ];
const CO2_INTENSITY = [
  0.36, 0.35, 0.34, 0.33, 0.32, 0.34,
  0.38, 0.42, 0.39, 0.36, 0.30, 0.26,
  0.22, 0.20, 0.21, 0.24, 0.28, 0.31,
  0.35, 0.34, 0.33, 0.32, 0.31, 0.30
];

// Generation patterns (percentage of peak capacity)
const GENERATION_PATTERNS = {
  solar: [
    0, 0, 0, 0, 0, 0, // 0-5: Night
    0.05, 0.20, 0.45, 0.70, 0.85, 0.95, // 6-11: Morning rise
    1.0, 0.95, 0.85, 0.70, 0.45, 0.20, // 12-17: Afternoon decline
    0.05, 0, 0, 0, 0, 0, // 18-23: Evening/Night
  ],
  wind: Array(24).fill(0).map(() => 0.3 + Math.random() * 0.7), // Random wind between 30-100%
  heat_pump: Array(24).fill(1), // Constant output when active
  kinetic: Array(24).fill(0).map((_, i) => {
    // Higher during morning and evening when people are active
    const hour = i % 24;
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 21)) {
      return 0.7 + Math.random() * 0.3; // 70-100%
    }
    return 0.2 + Math.random() * 0.5; // 20-70%
  })
};

interface EnergyGeneration {
  solar: number;
  wind: number;
  heat_pump: number;
  kinetic: number;
  total: number;
}

export function calculateEnergyGeneration(hour: number, sources: EnergySourceConfig[]): EnergyGeneration {
  const result: EnergyGeneration = {
    solar: 0,
    wind: 0,
    heat_pump: 0,
    kinetic: 0,
    total: 0
  };

  sources.forEach(source => {
    if (!source.isActive || source.capacity <= 0) return;
    
    const pattern = GENERATION_PATTERNS[source.type];
    const generation = pattern[hour] * source.capacity;
    
    // Apply efficiency for heat pumps (COP)
    const effectiveGeneration = source.type === 'heat_pump' 
      ? generation * (source.efficiency || 1)
      : generation;
    
    result[source.type] += effectiveGeneration;
    result.total += effectiveGeneration;
  });

  return result;
}

export function calculateConsumption(hour: number, appliances: Appliance[]): number {
  return appliances.reduce((total, appliance) => {
    const endTime = appliance.startTime + appliance.duration;
    if (hour >= appliance.startTime && hour < endTime) {
      return total + appliance.power;
    }
    return total;
  }, 0);
}

export function runSimulation(config: SimulationConfig, appliances: Appliance[]): SimulationResult {
  const hourlyData: HourlyData[] = [];
  let batteryLevel = config.batteryCapacity * 0.5; // Start at 50%
  
  let totalCost = 0;
  let totalCO2 = 0;
  let totalConsumption = 0;
  let totalGeneration = 0;
  let totalGridImport = 0;

  // Filter active energy sources
  const activeSources = config.energySources.filter(source => source.isActive && source.capacity > 0);

  for (let hour = 0; hour < 24; hour++) {
    // Calculate energy generation from all sources
    const generation = calculateEnergyGeneration(hour, config.energySources);
    const consumption = calculateConsumption(hour, appliances);
    
    let gridImport = 0;
    let gridExport = 0;
    let freeEnergyUsed = 0;
    
    // Energy balance - start with total generation minus consumption
    let energyBalance = generation.total - consumption;
    
    // Handle battery charging/discharging
    if (energyBalance > 0) {
      // Surplus: charge battery or export to grid
      const canCharge = config.batteryCapacity - batteryLevel;
      const charging = Math.min(canCharge, energyBalance);
      batteryLevel += charging;
      energyBalance -= charging;
      
      if (energyBalance > 0) {
        gridExport = energyBalance;
      }
    } else {
      // Deficit: discharge battery or import from grid
      const needed = Math.abs(energyBalance);
      const canDischarge = batteryLevel;
      const discharging = Math.min(canDischarge, needed);
      batteryLevel -= discharging;
      
      const stillNeeded = needed - discharging;
      if (stillNeeded > 0) {
        gridImport = stillNeeded;
      }
    }
    
    // Calculate costs and CO2 based on grid import/export
    const cost = gridImport * ENERGY_PRICES[hour] - gridExport * ENERGY_PRICES[hour] * 0.7; // Export is 70% of import price
    const co2 = gridImport * CO2_INTENSITY[hour];
    
    hourlyData.push({
      hour,
      solarGeneration: generation.solar,
      windGeneration: generation.wind,
      heatPumpGeneration: generation.heat_pump,
      kineticGeneration: generation.kinetic,
      totalGeneration: generation.total,
      consumption,
      batteryLevel,
      gridImport,
      gridExport,
      freeEnergyUsed,
      cost,
      co2,
    });
    
    totalCost += cost;
    totalCO2 += co2;
    totalConsumption += consumption;
    totalGeneration += generation.total;
    totalGridImport += gridImport;
  }
  
  const selfSufficiency = totalConsumption > 0 
    ? Math.min(100, (totalGeneration / totalConsumption) * 100)
    : 0;

  return {
    hourlyData,
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalCO2: parseFloat(totalCO2.toFixed(1)),
    totalConsumption: parseFloat(totalConsumption.toFixed(1)),
    totalGeneration: parseFloat(totalGeneration.toFixed(1)),
    selfSufficiency: parseFloat(selfSufficiency.toFixed(1)),
    gridImport: parseFloat(totalGridImport.toFixed(1)),
    gridExport: 0, // We're not currently tracking exports
    batteryLevel: 0, // We're not currently tracking battery level
    freeEnergyUsed: parseFloat((totalGeneration - totalGridImport).toFixed(1)),
  };
}

export function optimizeSchedule(config: SimulationConfig, appliances: Appliance[]): Appliance[] {
  const optimizedAppliances = appliances.map(a => ({ ...a }));
  
  // First, run the simulation with the original schedule to get baseline metrics
  const baselineResult = runSimulation(config, optimizedAppliances);
  const baselineScore = baselineResult.totalCost * 1.5 + baselineResult.totalCO2 * 1.0;
  
  // Optimize flexible appliances
  const flexibleAppliances = optimizedAppliances.filter(a => a.flexible);
  
  flexibleAppliances.forEach(appliance => {
    if (!appliance.flexible) return;
    
    let bestTime = appliance.startTime;
    let bestScore = baselineScore;
    
    // Try different start times
    for (let startTime = 0; startTime < 24 - appliance.duration; startTime++) {
      // Create a temporary copy of the appliance with the new start time
      const tempAppliance = { ...appliance, startTime };
      const tempAppliances = optimizedAppliances.map(a => 
        a.id === appliance.id ? tempAppliance : a
      );
      
      // Run simulation with this configuration
      const result = runSimulation(config, tempAppliances);
      // const currentScore = result.totalCost;
      const currentScore = result.totalCost * 1.5 + result.totalCO2 * 1.0;
      
      // If this is better than our best score, update
      if (currentScore < bestScore) {
        bestScore = currentScore;
        bestTime = startTime;
      }
    }
    
    // Update appliance with best start time if it's better than original
    if (bestTime !== appliance.startTime) {
      appliance.startTime = bestTime;
      appliance.endTime = (bestTime + appliance.duration) % 24;
    }
  });
  
  // Final check to ensure we didn't make things worse
  const finalResult = runSimulation(config, optimizedAppliances);
  if (finalResult.totalCost > baselineResult.totalCost) {
    // If optimization made things worse, return the original appliances
    return appliances.map(a => ({ ...a }));
  }
  
  return optimizedAppliances;
}
