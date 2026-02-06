import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function AlgorithmComparison({ comparisonData, settings }) {
  const chartData = comparisonData.map(item => ({
    algorithm: item.algorithm.toUpperCase(),
    profit: item.daily_profit,
    coin: item.coin_symbol
  })).sort((a, b) => b.profit - a.profit);

  const getBarColor = (profit) => {
    if (profit > 5) return '#00ff9f';
    if (profit > 2) return '#00d9ff';
    if (profit > 0) return '#a855f7';
    return '#f87171';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-white mb-2">{data.algorithm}</p>
          <div className="space-y-1">
            <p className="text-xs">
              <span className="text-slate-400">Coin:</span>
              <span className="text-white ml-2">{data.coin}</span>
            </p>
            <p className="text-xs">
              <span className="text-slate-400">Daily Profit:</span>
              <span className={`ml-2 font-mono font-semibold ${
                data.profit > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {settings.currency_symbol}{(data.profit || 0).toFixed(2)}
              </span>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <CardTitle className="text-base text-white">Algorithm Profitability</CardTitle>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5" />
            <span>Based on current rates</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {chartData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-sm text-slate-500">No algorithm data available</p>
          </div>
        ) : (
          <>
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="algorithm" 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ 
                      value: `Daily Profit (${settings.currency_symbol})`, 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: '#64748b',
                      fontSize: 11
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.profit)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Best Option */}
            {chartData[0] && chartData[0].profit > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-400 font-medium">Most Profitable</p>
                    <p className="text-sm text-white mt-0.5">
                      {chartData[0].algorithm} ({chartData[0].coin})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Daily</p>
                    <p className="text-lg font-bold font-mono text-emerald-400">
                      {settings.currency_symbol}{(chartData[0].profit || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}