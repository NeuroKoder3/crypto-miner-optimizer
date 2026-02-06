import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles } from "lucide-react";

export default function FeatureImportanceChart({ featureImportance }) {
  if (!featureImportance) {
    return null;
  }

  const chartData = Object.entries(featureImportance)
    .map(([feature, importance]) => ({
      feature: feature.replace(/_/g, ' '),
      importance: importance * 100
    }))
    .sort((a, b) => b.importance - a.importance);

  const getColor = (importance) => {
    if (importance > 80) return '#00ff9f';
    if (importance > 60) return '#00d9ff';
    if (importance > 40) return '#a855f7';
    if (importance > 20) return '#f59e0b';
    return '#64748b';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-white mb-1">{payload[0].payload.feature}</p>
          <p className="text-xs text-slate-400">
            Importance: <span className="text-cyan-400 font-mono">{payload[0].value.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <CardTitle className="text-base text-white">Feature Importance</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 100]} />
              <YAxis 
                type="category" 
                dataKey="feature" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.importance)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Critical (80%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="text-slate-500">High (60-80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-slate-500">Medium (40-60%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}