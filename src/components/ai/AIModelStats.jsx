import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Database, TrendingUp, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function AIModelStats({ history, trainingData }) {
  const latestModel = history.length > 0 ? history[history.length - 1] : null;
  const totalSamples = trainingData.length;
  const avgAccuracy = history.length > 0
    ? history.reduce((sum, h) => sum + (h.accuracy || 0), 0) / history.length
    : 0;
  const latestAccuracy = latestModel?.accuracy || 0;
  const convergenceStatus = latestModel?.convergence_status || 'training';

  const statusColors = {
    training: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    converged: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    overfitting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    plateau: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  };

  const stats = [
    {
      label: "Model Accuracy",
      value: (latestAccuracy || 0).toFixed(1),
      unit: "%",
      icon: Target,
      color: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-400",
      trend: history.length >= 2 ? latestAccuracy - history[history.length - 2].accuracy : 0
    },
    {
      label: "Training Samples",
      value: totalSamples,
      unit: "",
      icon: Database,
      color: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400"
    },
    {
      label: "Avg Accuracy",
      value: (avgAccuracy || 0).toFixed(1),
      unit: "%",
      icon: TrendingUp,
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      label: "Training Sessions",
      value: history.length,
      unit: "",
      icon: Zap,
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Deep Learning Model</p>
                  <p className="text-xs text-slate-500">Version {latestModel?.model_version || '1.0.0'}</p>
                </div>
              </div>
              <Badge className={`${statusColors[convergenceStatus]} border text-xs capitalize`}>
                {convergenceStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} border border-slate-700/30 w-fit mb-3`}>
                  <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white font-mono">{stat.value}</span>
                  <span className="text-xs text-slate-500">{stat.unit}</span>
                </div>
                {stat.trend !== undefined && (
                  <div className="mt-2">
                    <Badge className={`text-[10px] px-1.5 py-0 ${
                      stat.trend > 0 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : stat.trend < 0
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {stat.trend > 0 ? '+' : ''}{(stat.trend || 0).toFixed(1)}% vs last
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}