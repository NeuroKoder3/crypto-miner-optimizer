import React from 'react';
import { Card } from "@/components/ui/card";
import { Activity, Zap, TrendingUp, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsOverview({ gpus }) {
  const totalHashrate = gpus.reduce((sum, gpu) => sum + (gpu.hashrate || 0), 0);
  const totalPower = gpus.reduce((sum, gpu) => sum + (gpu.power_draw || 0), 0);
  const avgEfficiency = totalPower > 0 ? totalHashrate / totalPower : 0;
  const activeGpus = gpus.filter(g => g.status === 'active').length;

  const stats = [
    {
      label: "Total Hashrate",
      value: totalHashrate.toFixed(2),
      unit: "MH/s",
      icon: Activity,
      color: "from-emerald-500 to-cyan-500",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-400"
    },
    {
      label: "Total Power",
      value: totalPower.toFixed(0),
      unit: "W",
      icon: Zap,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-400"
    },
    {
      label: "Avg Efficiency",
      value: avgEfficiency.toFixed(3),
      unit: "MH/W",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-500/10",
      iconColor: "text-cyan-400"
    },
    {
      label: "Active GPUs",
      value: activeGpus,
      unit: `/ ${gpus.length}`,
      icon: Cpu,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400"
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
          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl p-4">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl lg:text-3xl font-bold text-white font-mono">{stat.value}</span>
                <span className="text-sm text-slate-500">{stat.unit}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}