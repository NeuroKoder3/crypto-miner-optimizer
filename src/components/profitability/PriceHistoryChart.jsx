import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function PriceHistoryChart({ priceHistory, selectedCoin, onCoinChange, availableCoins }) {
  const coinHistory = priceHistory.filter(h => h.coin_symbol === selectedCoin).slice(-50);
  
  const chartData = coinHistory.map(h => ({
    time: format(new Date(h.created_date), 'MMM d HH:mm'),
    price: h.price_usd,
    change: h.price_change_24h
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-slate-400 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-slate-400">Price:</span>
              <span className="text-white ml-2 font-mono">${payload[0]?.value?.toFixed(4)}</span>
            </p>
            {payload[0]?.payload?.change !== undefined && (
              <p className="text-xs">
                <span className="text-slate-400">24h Change:</span>
                <span className={`ml-2 font-mono ${
                  payload[0].payload.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {payload[0].payload.change >= 0 ? '+' : ''}{payload[0].payload.change.toFixed(2)}%
                </span>
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
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <CardTitle className="text-base text-white">Price History</CardTitle>
          </div>
          
          <Select value={selectedCoin} onValueChange={onCoinChange}>
            <SelectTrigger className="w-32 h-8 bg-slate-800/50 border-slate-700 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {availableCoins.map(coin => (
                <SelectItem key={coin.symbol} value={coin.symbol}>
                  {coin.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {chartData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-sm text-slate-500">No price history available for {selectedCoin}</p>
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 9 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => `$${v.toFixed(2)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  fill="url(#priceGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}