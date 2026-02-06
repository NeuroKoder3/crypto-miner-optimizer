import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function ProfitChart({ profitHistory, settings }) {
  const chartData = profitHistory
    .slice(-30)
    .map(h => ({
      date: format(new Date(h.created_date), 'MMM d'),
      profit: h.daily_profit,
      revenue: h.daily_revenue,
      cost: h.daily_electricity_cost
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
                <span className="text-white ml-2 font-mono">
                  {settings.currency_symbol}{(entry.value || 0).toFixed(2)}
                </span>
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20">
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <CardTitle className="text-base text-white">Profit History (30 Days)</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {chartData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-sm text-slate-500">No profit history available</p>
          </div>
        ) : (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff9f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
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
                  label={{ 
                    value: `Amount (${settings.currency_symbol})`, 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: '#64748b',
                    fontSize: 11
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="line"
                  formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#00ff9f"
                  strokeWidth={2.5}
                  dot={{ fill: '#00ff9f', r: 3 }}
                  name="Net Profit"
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00d9ff"
                  strokeWidth={1.5}
                  dot={false}
                  name="Revenue"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#f87171"
                  strokeWidth={1.5}
                  dot={false}
                  name="Power Cost"
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