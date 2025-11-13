import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Leaf, Zap, Battery, Sun, Wind, Thermometer, Activity } from "lucide-react";
import { ComparisonResult } from "@/types/simulator";

interface EnergySource {
  name: string;
  value: string;
  icon: any;
  color: string;
  total: number;
  percentage: number;
}

interface SavingsDashboardProps {
  results: ComparisonResult;
}

export function SavingsDashboard({ results }: SavingsDashboardProps) {
  const optimized = results.optimized;
  
  // Calculate totals from hourly data
  const totalFreeEnergy = optimized.hourlyData.reduce(
    (sum, hour) => sum + (hour.solarGeneration + hour.windGeneration + 
      hour.heatPumpGeneration + hour.kineticGeneration),
    0
  );

  const totalGridEnergy = optimized.hourlyData.reduce(
    (sum, hour) => sum + hour.gridImport,
    0
  );

  const totalConsumption = optimized.totalConsumption;
  const freeEnergyPercentage = optimized.selfSufficiency || 0;
  
  // Calculate potential costs without optimization
  const normalCost = results.normal.totalCost;
  const optimizedCost = results.optimized.totalCost;
  const normalCO2 = results.normal.totalCO2;
  const optimizedCO2 = results.optimized.totalCO2;
  
  const costSavings = results.costSavings;
  const co2Savings = results.co2Savings;
  
  // Calculate potential costs if no free energy was used
  const costPerKwh = 0.30; // Average price per kWh
  const co2PerKwh = 0.35;  // Average CO2 per kWh
  const potentialCost = totalConsumption * costPerKwh;
  const potentialCO2 = totalConsumption * co2PerKwh;
  
  // Calculate energy sources breakdown
  const energySources: EnergySource[] = [
    { 
      name: 'Zonne-energie', 
      value: 'solarGeneration', 
      icon: Sun, 
      color: 'text-yellow-500',
      total: 0,
      percentage: 0
    },
    { 
      name: 'Windenergie', 
      value: 'windGeneration', 
      icon: Wind, 
      color: 'text-blue-400',
      total: 0,
      percentage: 0
    },
    { 
      name: 'Warmtepomp', 
      value: 'heatPumpGeneration', 
      icon: Thermometer, 
      color: 'text-orange-500',
      total: 0,
      percentage: 0
    },
    { 
      name: 'Bewegingsenergie', 
      value: 'kineticGeneration', 
      icon: Activity, 
      color: 'text-purple-500',
      total: 0,
      percentage: 0
    },
  ].map(source => {
    const total = optimized.hourlyData.reduce(
      (sum, hour) => sum + (hour[source.value as keyof typeof hour] as number || 0),
      0
    );
    const percentage = totalFreeEnergy > 0 ? (total / totalFreeEnergy) * 100 : 0;
    
    return {
      ...source,
      total,
      percentage
    };
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Zap className="h-7 w-7 text-yellow-500" />
          Besparingsdashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Gratis energie</CardTitle>
              <Sun className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">{totalFreeEnergy.toFixed(1)} kWh</div>
              <p className="text-xs text-muted-foreground">
                {freeEnergyPercentage.toFixed(1)}% van totaal verbruik
              </p>
            </CardContent>
          </Card>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Kostenbesparing</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">€{costSavings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {potentialCost > 0 ? ((costSavings / potentialCost) * 100).toFixed(1) : '0'}% bespaard
              </p>
            </CardContent>
          </Card>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">CO₂ Besparing</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">{co2Savings.toFixed(1)} kg</div>
              <p className="text-xs text-muted-foreground">
                {potentialCO2 > 0 ? ((co2Savings / potentialCO2) * 100).toFixed(1) : '0'}% minder uitstoot
              </p>
            </CardContent>
          </Card>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Zelfvoorziening</CardTitle>
              <Battery className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">{optimized.selfSufficiency.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                van je energiebehoefte gedekt
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Energiebronnen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {energySources.map((source) => (
                  <div key={source.name} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <source.icon className={`h-4 w-4 ${source.color}`} />
                      <span className="text-sm">{source.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{source.total.toFixed(1)} kWh</div>
                      <div className="text-xs text-muted-foreground">
                        {source.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Energiebalans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Opgewekte energie</span>
                    <span className="font-medium">{totalFreeEnergy.toFixed(1)} kWh</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${Math.min(100, (totalFreeEnergy / totalConsumption) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Netto verbruik</span>
                    <span className="font-medium">{totalGridEnergy.toFixed(1)} kWh</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${(totalGridEnergy / totalConsumption) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Totaal verbruik</span>
                    <span>{totalConsumption.toFixed(1)} kWh</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
