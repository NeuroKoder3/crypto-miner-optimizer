import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Zap, Thermometer } from "lucide-react";
import { format } from "date-fns";

export default function GPUHistoricalCharts({ gpu, benchmarks }) {
  const gpuBenchmarks = benchmarks
    .filter(b => b.gpu_id === gpu.gpu_id)
    .slice(-20)
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

  const chartData = gpuBenchmarks.map(b => ({
    time: format(new Date(b.created_date), 'HH:mm'),
    hashrate: b.avg_hashrate || 0,
    power: b.avg_power || 0,
    temperature: b.avg_temperature || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-slate-400 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-xs">
                <span style={{ color: entry.color }}>{entry.name}:</span>
                <span className="text-white ml-2 font-mono">{(entry.value || 0).toFixed(2)}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-slate-500">No historical data available yet</p>
          <p className="text-xs text-slate-600 mt-1">Run benchmarks to see charts</p>
        </CardContent>
      </Card>
    );
  }

  const charts = [
    {
      title: "Hashrate History",
      dataKey: "hashrate",
      color: "#00ff9f",
      icon: Activity,
      unit: "MH/s"
    },
    {
      title: "Power Consumption",
      dataKey: "power",
      color: "#fbbf24",
      icon: Zap,
      unit: "W"
    },
    {
      title: "Temperature",
      dataKey: "temperature",
      color: "#00d9ff",
      icon: Thermometer,
      unit: "°C"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {charts.map((chart) => (
        <Card key={chart.dataKey} className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
          <CardHeader className="border-b border-slate-800/50 pb-3">
            <div className="flex items-center gap-2">
              <chart.icon className="w-4 h-4" style={{ color: chart.color }} />
              <CardTitle className="text-sm text-white">{chart.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: '#64748b', fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={45}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey={chart.dataKey}
                    stroke={chart.color}
                    strokeWidth={2}
                    dot={{ fill: chart.color, r: 2 }}
                    name={chart.title}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}