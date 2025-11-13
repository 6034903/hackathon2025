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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Energiestromen - Normaal Scenario</CardTitle>
          <CardDescription>Opwekking, verbruik en batterijniveau over 24 uur</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
          <CardTitle>Energiestromen - Geoptimaliseerd Scenario</CardTitle>
          <CardDescription>Slim geplande apparaten voor lagere kosten en uitstoot</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
          <CardTitle>Kostenvergelijking per Uur</CardTitle>
          <CardDescription>Besparing door slimme planning zichtbaar gemaakt</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
