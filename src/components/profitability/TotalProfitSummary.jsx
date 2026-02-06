import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Zap, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function TotalProfitSummary({ gpuProfits, settings }) {
  const totalDailyProfit = gpuProfits.reduce((sum, p) => sum + p.daily_profit, 0);
  const totalDailyRevenue = gpuProfits.reduce((sum, p) => sum + p.daily_revenue, 0);
  const totalDailyCost = gpuProfits.reduce((sum, p) => sum + p.daily_electricity_cost, 0);
  const totalMonthlyProfit = totalDailyProfit * 30;
  const totalYearlyProfit = totalDailyProfit * 365;

  const stats = [
    {
      label: "Daily Profit",
      value: totalDailyProfit,
      unit: "/day",
      icon: DollarSign,
      color: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-400",
      valueColor: totalDailyProfit >= 0 ? "text-emerald-400" : "text-red-400"
    },
    {
      label: "Monthly Profit",
      value: totalMonthlyProfit,
      unit: "/month",
      icon: Calendar,
      color: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400",
      valueColor: totalMonthlyProfit >= 0 ? "text-cyan-400" : "text-red-400"
    },
    {
      label: "Daily Revenue",
      value: totalDailyRevenue,
      unit: "/day",
      icon: TrendingUp,
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
      valueColor: "text-purple-400"
    },
    {
      label: "Power Cost",
      value: totalDailyCost,
      unit: "/day",
      icon: Zap,
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
      valueColor: "text-amber-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
            
            <CardContent className="p-4 relative">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} border border-slate-700/30 w-fit mb-3`}>
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold font-mono ${stat.valueColor}`}>
                  {stat.value >= 0 ? settings.currency_symbol : '-' + settings.currency_symbol}{Math.abs(stat.value).toFixed(2)}
                </span>
                <span className="text-xs text-slate-500">{stat.unit}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}