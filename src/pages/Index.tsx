import { useState } from "react";
import { ConfigurationForm } from "@/components/ConfigurationForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { EnergyChart } from "@/components/EnergyChart";
import { SavingsDashboard } from "@/components/SavingsDashboard";
import { Button } from "@/components/ui/button";
import { Appliance, ComparisonResult, SimulationConfig } from "@/types/simulator";
import { runSimulation, optimizeSchedule } from "@/lib/simulator";
import { Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [currentConfig, setCurrentConfig] = useState<SimulationConfig | null>(null);
  const [currentAppliances, setCurrentAppliances] = useState<Appliance[]>([]);

  const handleSimulate = (config: SimulationConfig, appliances: Appliance[]) => {
    setCurrentConfig(config);
    setCurrentAppliances(appliances);

    // Run normal simulation
    const normalResult = runSimulation(config, appliances);

    // Run optimized simulation
    const optimizedAppliances = optimizeSchedule(config, appliances);
    const optimizedResult = runSimulation(config, optimizedAppliances);

    // Calculate savings
    const costSavings = normalResult.totalCost - optimizedResult.totalCost;
    const co2Savings = normalResult.totalCO2 - optimizedResult.totalCO2;
    const costSavingsPercentage = (costSavings / normalResult.totalCost) * 100;
    const co2SavingsPercentage = (co2Savings / normalResult.totalCO2) * 100;

    setResults({
      normal: normalResult,
      optimized: optimizedResult,
      costSavings,
      co2Savings,
      costSavingsPercentage,
      co2SavingsPercentage,
    });

    toast.success("Simulatie voltooid!", {
      description: `Besparing: €${costSavings.toFixed(2)} en ${co2Savings.toFixed(1)} kg CO₂`,
    });
  };

  const handleOptimizeAgain = () => {
    if (currentConfig && currentAppliances) {
      handleSimulate(currentConfig, currentAppliances);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Zap className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">SmartGrid Simulator</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Slim omgaan met energie, zonder moeilijk gedoe
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Configuratie</h2>
            <ConfigurationForm onSimulate={handleSimulate} />
          </div>
          
          <div className="w-full lg:w-2/3 flex flex-col h-[calc(130vh-50px)]">
            {results ? (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                  <div className="space-y-8 pr-2">
                    {/* Savings Dashboard */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                      <SavingsDashboard results={results} />
                    </div>
                    
                    {/* Main Results Grid */}
                    <div className="space-y-8">
                      <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
                        {/* Results Summary */}
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Samenvatting</h2>
                          <ResultsDashboard results={results} />
                        </div>
                        
                        {/* Energy Chart */}
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Energieverbruik</h2>
                          </div>
                          <div className="h-[350px] w-full -mx-2">
                            <EnergyChart results={results} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Charts/Info can be added here */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border rounded-lg p-8 text-center shadow-sm h-full flex flex-col items-center justify-center">
                <div className="max-w-md mx-auto">
                  <Zap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Start met simuleren</h2>
                  <p className="text-muted-foreground mb-6">
                    Vul het configuratieformulier in en klik op 'Simuleer' om te zien hoeveel u kunt besparen op uw energiekosten.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                      Bespaar tot 30% op uw energiekosten
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                      Zie direct het effect
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>SmartGrid Simulator - Slim & Groen Project</p>
          <p className="mt-1">
            Ontwikkeld door Malik Omri, Mylo van Loenen & Gabriel Kalkhuis
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
