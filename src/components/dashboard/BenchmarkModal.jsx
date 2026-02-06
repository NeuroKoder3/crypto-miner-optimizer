import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Thermometer, Clock, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BenchmarkModal({ open, onClose, gpu, onComplete }) {
  const [stage, setStage] = useState('setup'); // setup, running, complete
  const [algorithm, setAlgorithm] = useState('ethash');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [iterations, setIterations] = useState(0);

  useEffect(() => {
    if (stage === 'running') {
      const duration = 8000;
      const interval = 100;
      let elapsed = 0;
      let currentIteration = 0;
      
      const timer = setInterval(() => {
        elapsed += interval;
        const newProgress = (elapsed / duration) * 100;
        setProgress(newProgress);
        
        if (elapsed % 1600 === 0) {
          currentIteration++;
          setIterations(currentIteration);
        }
        
        if (elapsed >= duration) {
          clearInterval(timer);
          
          // Generate simulated benchmark results
          const baseHashrate = 30 + Math.random() * 20;
          const basePower = 120 + Math.random() * 80;
          const simulatedResults = {
            gpu_id: gpu.gpu_id,
            gpu_name: gpu.name,
            algorithm,
            avg_hashrate: baseHashrate,
            peak_hashrate: baseHashrate * 1.05,
            avg_power: basePower,
            avg_temperature: 55 + Math.random() * 20,
            efficiency: baseHashrate / basePower,
            duration_seconds: duration / 1000,
            iterations: 5,
            core_clock: gpu.core_clock || 1500,
            memory_clock: gpu.memory_clock || 2000,
            power_limit: gpu.power_limit || 100
          };
          
          setResults(simulatedResults);
          setStage('complete');
          onComplete(simulatedResults);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [stage, algorithm, gpu, onComplete]);

  const handleStart = () => {
    setProgress(0);
    setIterations(0);
    setResults(null);
    setStage('running');
  };

  const handleClose = () => {
    setStage('setup');
    setProgress(0);
    setResults(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            GPU Benchmark
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {gpu && (
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">{gpu.name}</span>
                <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/30 text-xs">
                  {gpu.gpu_id}
                </Badge>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {stage === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                    Select Algorithm
                  </label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="ethash">Ethash</SelectItem>
                      <SelectItem value="kawpow">KawPow</SelectItem>
                      <SelectItem value="autolykos">Autolykos</SelectItem>
                      <SelectItem value="kheavyhash">KHeavyHash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-400">
                    ⚡ Benchmark will run 5 iterations and take approximately 8 seconds
                  </p>
                </div>

                <Button
                  onClick={handleStart}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Start Benchmark
                </Button>
              </motion.div>
            )}

            {stage === 'running' && (
              <motion.div
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="text-center py-4">
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-800 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white font-mono">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${progress * 2.26} 226`}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/30 text-center">
                    <p className="text-[10px] text-slate-500 uppercase">Algorithm</p>
                    <p className="text-sm font-mono text-white">{algorithm}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/30 text-center">
                    <p className="text-[10px] text-slate-500 uppercase">Iteration</p>
                    <p className="text-sm font-mono text-white">{iterations}/5</p>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-500">
                  Running synthetic workload...
                </p>
              </motion.div>
            )}

            {stage === 'complete' && results && (
              <motion.div
                key="complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-2 py-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Benchmark Complete</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-slate-500">Avg Hashrate</span>
                    </div>
                    <p className="text-lg font-bold font-mono text-white">
                      {results.avg_hashrate.toFixed(2)} <span className="text-xs text-slate-500">MH/s</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] text-slate-500">Avg Power</span>
                    </div>
                    <p className="text-lg font-bold font-mono text-white">
                      {results.avg_power.toFixed(0)} <span className="text-xs text-slate-500">W</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] text-slate-500">Avg Temp</span>
                    </div>
                    <p className="text-lg font-bold font-mono text-white">
                      {results.avg_temperature.toFixed(0)} <span className="text-xs text-slate-500">°C</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-slate-500">Efficiency</span>
                    </div>
                    <p className="text-lg font-bold font-mono text-emerald-400">
                      {results.efficiency.toFixed(3)} <span className="text-xs">MH/W</span>
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleClose}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                >
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}