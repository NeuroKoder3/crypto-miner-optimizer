import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Target } from "lucide-react";
import { format } from "date-fns";

export default function PredictionAccuracyChart({ predictions }) {
  const appliedPredictions = predictions
    .filter(p => p.is_applied && p.prediction_accuracy !== undefined)
    .slice(0, 20)
    .reverse();

  const chartData = appliedPredictions.map(p => ({
    date: format(new Date(p.created_date), 'MMM d'),
    accuracy: p.prediction_accuracy,
    profit: p.actual_profit_24h
  }));

  const avgAccuracy = appliedPredictions.length > 0
    ? appliedPredictions.reduce((sum, p) => sum + p.prediction_accuracy, 0) / appliedPredictions.length
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-slate-400 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-slate-400">Accuracy:</span>
              <span className="text-emerald-400 ml-2 font-mono">{(payload[0]?.value || 0).toFixed(1)}%</span>
            </p>
            {payload[1] && (
              <p className="text-sm">
                <span className="text-slate-400">Profit:</span>
                <span className="text-white ml-2 font-mono">${(payload[1]?.value || 0).toFixed(2)}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20">
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <CardTitle className="text-base text-white">Prediction Accuracy</CardTitle>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-slate-500">Average Accuracy</p>
            <p className="text-lg font-bold text-emerald-400">{(avgAccuracy || 0).toFixed(1)}%</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {chartData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-sm text-slate-500">No prediction history yet</p>
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff9f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 9 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#00ff9f"
                  strokeWidth={2}
                  dot={{ fill: '#00ff9f', r: 3 }}
                  fill="url(#accuracyGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}