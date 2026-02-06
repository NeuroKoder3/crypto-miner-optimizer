import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function EfficiencyChart({ benchmarks }) {
  const chartData = benchmarks
    .slice(-20)
    .map(b => ({
      date: format(new Date(b.created_date), 'HH:mm'),
      efficiency: b.efficiency || 0,
      hashrate: b.avg_hashrate || 0,
      power: b.avg_power || 0
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-slate-400 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-cyan-400 font-mono font-bold">
                {(payload[0]?.value || 0).toFixed(3)}
              </span>
              <span className="text-slate-500 ml-1">MH/W</span>
            </p>
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/20">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <CardTitle className="text-base text-white">Efficiency Trend</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {chartData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-sm text-slate-500">No benchmark data yet</p>
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d9ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => (v || 0).toFixed(2)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#00d9ff"
                  strokeWidth={2}
                  fill="url(#efficiencyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}