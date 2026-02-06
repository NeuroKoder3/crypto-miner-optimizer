import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Cpu, Zap, Thermometer, Wind, Activity, Settings2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  idle: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  optimizing: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30"
};

export default function GPUCard({ gpu, onOptimize, onBenchmark, isOptimizing }) {
  const efficiencyPercent = Math.min((gpu.efficiency || 0) / 0.5 * 100, 100);
  const tempPercent = Math.min((gpu.temperature || 0) / 100 * 100, 100);
  const tempColor = gpu.temperature > 80 ? "text-red-400" : gpu.temperature > 65 ? "text-amber-400" : "text-emerald-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/50 backdrop-blur-xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="p-5 relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/20">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{gpu.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{gpu.gpu_id}</p>
              </div>
            </div>
            <Badge className={`${statusColors[gpu.status]} border text-xs`}>
              {gpu.status === 'optimizing' && (
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-1.5 animate-pulse" />
              )}
              {gpu.status}
            </Badge>
          </div>

          {/* Main Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-slate-400">Hashrate</span>
              </div>
              <p className="text-xl font-bold text-white font-mono">
                {gpu.hashrate?.toFixed(2) || '0.00'}
                <span className="text-xs text-slate-500 ml-1">MH/s</span>
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-slate-400">Power</span>
              </div>
              <p className="text-xl font-bold text-white font-mono">
                {gpu.power_draw?.toFixed(0) || '0'}
                <span className="text-xs text-slate-500 ml-1">W</span>
              </p>
            </div>
          </div>

          {/* Efficiency Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Efficiency</span>
              <span className="text-xs font-mono text-emerald-400">
                {gpu.efficiency?.toFixed(3) || '0.000'} MH/W
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${efficiencyPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Thermometer className={`w-3.5 h-3.5 ${tempColor}`} />
              <span className="text-slate-400">{gpu.temperature || 0}°C</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">{gpu.fan_speed || 0}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-mono">{gpu.algorithm || 'ethash'}</span>
            </div>
          </div>

          {/* Clock Settings */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/20 mb-4">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Core</p>
              <p className="text-sm font-mono text-white">{gpu.core_clock || 0}</p>
            </div>
            <div className="text-center border-x border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Memory</p>
              <p className="text-sm font-mono text-white">{gpu.memory_clock || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Power</p>
              <p className="text-sm font-mono text-white">{gpu.power_limit || 100}%</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onOptimize(gpu)}
              disabled={isOptimizing}
              className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white border-0 text-xs h-9 relative overflow-hidden group"
            >
              {isOptimizing ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  <span className="relative z-10">AI Learning...</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 animate-pulse" />
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span className="relative z-10">AI Optimize</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </>
              )}
            </Button>
            <Button
              onClick={() => onBenchmark(gpu)}
              variant="outline"
              className="bg-transparent border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-300 text-xs h-9"
            >
              Benchmark
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}