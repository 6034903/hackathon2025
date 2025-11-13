import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Appliance, EnergySource, EnergySourceConfig, SimulationConfig } from "@/types/simulator";
import { Plus, Trash2, Sun, Wind, Zap, Thermometer, Activity } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ConfigurationFormProps {
  onSimulate: (config: SimulationConfig, appliances: Appliance[]) => void;
}

const DEFAULT_APPLIANCES: Omit<Appliance, "id">[] = [
  { name: "Wasmachine", power: 2.0, duration: 2, startTime: 10, endTime: 12, flexible: true },
  { name: "Vaatwasser", power: 1.5, duration: 2, startTime: 20, endTime: 22, flexible: true },
  { name: "Elektrische Auto", power: 7.0, duration: 4, startTime: 23, endTime: 3, flexible: true },
  { name: "Basis verbruik", power: 0.3, duration: 24, startTime: 0, endTime: 0, flexible: false },
];

export function ConfigurationForm({ onSimulate }: ConfigurationFormProps) {
  const [batteryCapacity, setBatteryCapacity] = useState(10);
  const [prioritizeFreeEnergy, setPrioritizeFreeEnergy] = useState(true);
  const [energySources, setEnergySources] = useState<EnergySourceConfig[]>([
    { type: 'solar', capacity: 5, isActive: true },
    { type: 'wind', capacity: 2, isActive: false },
    { type: 'heat_pump', capacity: 0, isActive: false, efficiency: 3 },
    { type: 'kinetic', capacity: 0.1, isActive: false },
  ]);
  const [appliances, setAppliances] = useState<Appliance[]>(
    DEFAULT_APPLIANCES.map((a, i) => ({ ...a, id: `appliance-${i}` }))
  );

  const addAppliance = () => {
    const startTime = 12;
    const duration = 1;
    setAppliances([
      ...appliances,
      {
        id: `appliance-${Date.now()}`,
        name: "Nieuw apparaat",
        power: 1.0,
        duration,
        startTime,
        endTime: (startTime + duration) % 24,
        flexible: true,
      },
    ]);
  };

  const removeAppliance = (id: string) => {
    setAppliances(appliances.filter(a => a.id !== id));
  };

  const updateAppliance = (id: string, updates: Partial<Appliance>) => {
    setAppliances(appliances.map(a => {
      if (a.id !== id) return a;
      
      // If startTime or duration changes, update endTime
      const newAppliance = { ...a, ...updates };
      if ('startTime' in updates || 'duration' in updates) {
        newAppliance.endTime = (newAppliance.startTime + newAppliance.duration) % 24;
      }
      
      return newAppliance;
    }));
  };

  const handleSimulate = () => {
    onSimulate(
      {
        energySources,
        batteryCapacity,
        appliances,
        prioritizeFreeEnergy,
      },
      appliances
    );
  };

  const updateEnergySource = (type: EnergySource, updates: Partial<EnergySourceConfig>) => {
    setEnergySources(energySources.map(src => 
      src.type === type ? { ...src, ...updates } : src
    ));
  };

  const getSourceIcon = (type: EnergySource) => {
    switch (type) {
      case 'solar': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'wind': return <Wind className="h-4 w-4 text-blue-400" />;
      case 'heat_pump': return <Thermometer className="h-4 w-4 text-orange-500" />;
      case 'kinetic': return <Activity className="h-4 w-4 text-purple-500" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getSourceLabel = (type: EnergySource) => {
    switch (type) {
      case 'solar': return 'Zonnepanelen';
      case 'wind': return 'Windturbine';
      case 'heat_pump': return 'Warmtepomp';
      case 'kinetic': return 'Bewegingsenergie';
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuratie</CardTitle>
        <CardDescription>
          Stel je huishouden in om de energiesimulatie te starten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="battery">Batterij (kWh)</Label>
              <Input
                id="battery"
                type="number"
                min="0"
                max="30"
                step="1"
                value={batteryCapacity}
                onChange={(e) => setBatteryCapacity(parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="prioritize-free" 
                checked={prioritizeFreeEnergy}
                onCheckedChange={setPrioritizeFreeEnergy}
              />
              <Label htmlFor="prioritize-free" className="flex items-center">
                <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                Gratis energie eerst gebruiken
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Energiebronnen</Label>
            <div className="space-y-3">
              {energySources.map((source) => (
                <div key={source.type} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 flex-1">
                    {getSourceIcon(source.type)}
                    <span className="font-medium">{getSourceLabel(source.type)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`active-${source.type}`}
                      checked={source.isActive}
                      onCheckedChange={(checked) => 
                        updateEnergySource(source.type, { isActive: Boolean(checked) })
                      }
                    />
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={source.capacity}
                      onChange={(e) => 
                        updateEnergySource(source.type, { capacity: parseFloat(e.target.value) })
                      }
                      className="w-24 h-8"
                      disabled={!source.isActive}
                    />
                    <span className="text-sm text-muted-foreground">
                      {source.type === 'heat_pump' ? 'COP' : 'kW'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Apparaten</Label>
            <Button onClick={addAppliance} size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Toevoegen
            </Button>
          </div>

          <div className="space-y-3">
            {appliances.map((appliance) => (
              <Card key={appliance.id} className="border-muted">
                <CardContent className="p-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                    <div className="sm:col-span-2 lg:col-span-2">
                      <Label className="text-xs">Naam</Label>
                      <Input
                        value={appliance.name}
                        onChange={(e) =>
                          updateAppliance(appliance.id, { name: e.target.value })
                        }
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Vermogen(kW)</Label>
                      <Input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={appliance.power}
                        onChange={(e) =>
                          updateAppliance(appliance.id, {
                            power: parseFloat(e.target.value),
                          })
                        }
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Duur (uur)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="24"
                        value={appliance.duration}
                        onChange={(e) =>
                          updateAppliance(appliance.id, {
                            duration: parseInt(e.target.value),
                          })
                        }
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Start (uur)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={appliance.startTime}
                        onChange={(e) =>
                          updateAppliance(appliance.id, {
                            startTime: parseInt(e.target.value),
                          })
                        }
                        className="h-8"
                      />
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`flex-${appliance.id}`}
                          checked={appliance.flexible}
                          onCheckedChange={(checked) =>
                            updateAppliance(appliance.id, { flexible: checked as boolean })
                          }
                        />
                        <Label htmlFor={`flex-${appliance.id}`} className="text-xs">
                          Flexibel
                        </Label>
                      </div>
                      <Button
                        onClick={() => removeAppliance(appliance.id)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button onClick={handleSimulate} className="w-full" size="lg">
          Start Simulatie
        </Button>
      </CardContent>
    </Card>
  );
}
