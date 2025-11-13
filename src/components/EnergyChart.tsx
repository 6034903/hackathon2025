import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComparisonResult } from "@/types/simulator";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EnergyChartProps {
  results: ComparisonResult;
}

export function EnergyChart({ results }: EnergyChartProps) {
  const normalData = results.normal.hourlyData.map((d) => ({
    hour: `${d.hour}:00`,
    "Zon": d.solarGeneration,
    "Verbruik": d.consumption,
    "Batterij": d.batteryLevel,
    "Import": d.gridImport,
  }));

  const optimizedData = results.optimized.hourlyData.map((d) => ({
    hour: `${d.hour}:00`,
    "Zon": d.solarGeneration,
    "Verbruik": d.consumption,
    "Batterij": d.batteryLevel,
    "Import": d.gridImport,
  }));

  const costComparisonData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    "Normaal": results.normal.hourlyData[i].cost,
    "Geoptimaliseerd": results.optimized.hourlyData[i].cost,
  }));

  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Energiestromen - Normaal Scenario</CardTitle>
          <CardDescription className="text-sm">Opwekking, verbruik en batterijniveau over 24 uur</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250} className="text-xs">
            <LineChart data={normalData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="hour"
                className="text-xs"
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--foreground))" }}
                label={{ value: "kW / kWh", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Zon"
                stroke="hsl(var(--chart-solar))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Verbruik"
                stroke="hsl(var(--chart-consumption))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Batterij"
                stroke="hsl(var(--chart-battery))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Energiestromen - Geoptimaliseerd Scenario</CardTitle>
          <CardDescription className="text-sm">Opwekking, verbruik en batterijniveau na optimalisatie</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250} className="text-xs">
            <LineChart data={optimizedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="hour"
                className="text-xs"
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--foreground))" }}
                label={{ value: "kW / kWh", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Zon"
                stroke="hsl(var(--chart-solar))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Verbruik"
                stroke="hsl(var(--chart-consumption))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Batterij"
                stroke="hsl(var(--chart-battery))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kostenvergelijking</CardTitle>
          <CardDescription className="text-sm">Vergelijking van de kosten tussen normaal en geoptimaliseerd scenario</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250} className="text-xs">
            <BarChart data={costComparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="hour"
                className="text-xs"
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--foreground))" }}
                label={{ value: "€", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="Normaal" fill="hsl(var(--chart-consumption))" />
              <Bar dataKey="Geoptimaliseerd" fill="hsl(var(--chart-battery))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
