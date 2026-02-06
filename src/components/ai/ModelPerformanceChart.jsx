import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Brain, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ModelPerformanceChart({ history }) {
  const chartData = history
    .sort((a, b) => a.training_session - b.training_session)
    .map(h => ({
      session: h.training_session,
      accuracy: h.accuracy || 0,
      loss: (h.loss || 0) * 100,
      error: h.avg_prediction_error || 0
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-slate-400 mb-2">Session {label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-xs">
                <span style={{ color: entry.color }}>{entry.name}:</span>
                <span className="text-white ml-2 font-mono">{(entry.value || 0).toFixed(2)}%</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <CardTitle className="text-base text-white">Model Performance Over Time</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {chartData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center">
            <div className="text-center">
              <Brain className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No training history yet</p>
              <p className="text-xs text-slate-600 mt-1">Run optimizations to train the model</p>
            </div>
          </div>
        ) : (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff9f" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="session" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  label={{ value: 'Training Session', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                  formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#00ff9f"
                  strokeWidth={2}
                  dot={{ fill: '#00ff9f', r: 3 }}
                  name="Accuracy"
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="error"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={{ fill: '#f87171', r: 3 }}
                  name="Avg Error"
                  activeDot={{ r: 5 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}