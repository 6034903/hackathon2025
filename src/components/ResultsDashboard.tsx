import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComparisonResult } from "@/types/simulator";
import { ArrowDown, Leaf, Euro, Zap, Battery, TrendingDown } from "lucide-react";

interface ResultsDashboardProps {
  results: ComparisonResult;
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  const { normal, optimized, costSavings, co2Savings, costSavingsPercentage, co2SavingsPercentage } =
    results;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kosten Normaal</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{normal.totalCost.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per dag</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kosten Geoptimaliseerd</CardTitle>
          <Euro className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            €{optimized.totalCost.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Per dag</p>
        </CardContent>
      </Card>

      <Card className="border-success/50 bg-success/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kostenbesparing</CardTitle>
          <TrendingDown className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">€{costSavings.toFixed(2)}</div>
          <p className="text-xs text-success flex items-center gap-1">
            <ArrowDown className="h-3 w-3" />
            {costSavingsPercentage.toFixed(1)}% besparing
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CO₂ Normaal</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{normal.totalCO2.toFixed(1)} kg</div>
          <p className="text-xs text-muted-foreground">Per dag</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CO₂ Geoptimaliseerd</CardTitle>
          <Leaf className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {optimized.totalCO2.toFixed(1)} kg
          </div>
          <p className="text-xs text-muted-foreground">Per dag</p>
        </CardContent>
      </Card>

      <Card className="border-success/50 bg-success/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CO₂ Besparing</CardTitle>
          <Leaf className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{co2Savings.toFixed(1)} kg</div>
          <p className="text-xs text-success flex items-center gap-1">
            <ArrowDown className="h-3 w-3" />
            {co2SavingsPercentage.toFixed(1)}% reductie
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Zelfvoorziening Normaal</CardTitle>
          <Battery className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{normal.selfSufficiency.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Van eigen energie</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Zelfvoorziening Optimaal</CardTitle>
          <Battery className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {optimized.selfSufficiency.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">Van eigen energie</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Totaal Verbruik</CardTitle>
          <Zap className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{normal.totalConsumption.toFixed(1)} kWh</div>
          <p className="text-xs text-muted-foreground">Opgewekt: {normal.totalGeneration.toFixed(1)} kWh</p>
        </CardContent>
      </Card>
    </div>
  );
}
