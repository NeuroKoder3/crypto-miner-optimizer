import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PredictionSimulator({ gpus, onPredict }) {
  const [settings, setSettings] = useState({
    gpu_id: '',
    algorithm: 'ethash',
    core_clock: 1500,
    memory_clock: 2000,
    power_limit: 100
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    setIsLoading(true);
    
    // Simulate AI prediction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const baseHashrate = 50 + (settings.memory_clock / 2000) * 40;
    const basePower = 100 + (settings.power_limit / 100) * 150;
    const efficiency = baseHashrate / basePower;
    
    const result = {
      predicted_hashrate: baseHashrate * (0.95 + Math.random() * 0.1),
      predicted_power: basePower * (0.95 + Math.random() * 0.1),
      predicted_efficiency: efficiency * (0.95 + Math.random() * 0.1),
      confidence: 85 + Math.random() * 10,
      improvement_vs_current: 5 + Math.random() * 15
    };
    
    setPrediction(result);
    setIsLoading(false);
    
    if (onPredict) {
      onPredict(settings, result);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <CardTitle className="text-base text-white">What-If Scenario Simulator</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Test hypothetical settings before applying</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white mb-3">Input Settings</h3>
            
            <div>
              <Label className="text-xs text-slate-400 mb-2 block">GPU Model</Label>
              <Select 
                value={settings.gpu_id} 
                onValueChange={(v) => setSettings({...settings, gpu_id: v})}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="Select GPU" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {gpus.map(gpu => (
                    <SelectItem key={gpu.gpu_id} value={gpu.gpu_id}>
                      {gpu.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-slate-400 mb-2 block">Algorithm</Label>
              <Select 
                value={settings.algorithm} 
                onValueChange={(v) => setSettings({...settings, algorithm: v})}
              >
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-slate-400">Core Clock</Label>
                <span className="text-xs font-mono text-white">{settings.core_clock} MHz</span>
              </div>
              <Slider
                value={[settings.core_clock]}
                onValueChange={([v]) => setSettings({...settings, core_clock: v})}
                min={800}
                max={2500}
                step={10}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-slate-400">Memory Clock</Label>
                <span className="text-xs font-mono text-white">{settings.memory_clock} MHz</span>
              </div>
              <Slider
                value={[settings.memory_clock]}
                onValueChange={([v]) => setSettings({...settings, memory_clock: v})}
                min={1000}
                max={3500}
                step={50}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-slate-400">Power Limit</Label>
                <span className="text-xs font-mono text-white">{settings.power_limit}%</span>
              </div>
              <Slider
                value={[settings.power_limit]}
                onValueChange={([v]) => setSettings({...settings, power_limit: v})}
                min={50}
                max={120}
                step={1}
              />
            </div>

            <Button 
              onClick={handlePredict}
              disabled={!settings.gpu_id || isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Predicting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run Prediction
                </>
              )}
            </Button>
          </div>

          {/* Prediction Results */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">AI Prediction</h3>
            
            <AnimatePresence mode="wait">
              {!prediction ? (
                <div className="h-full flex items-center justify-center text-center py-12">
                  <div>
                    <Sparkles className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Configure settings and run prediction</p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-3"
                >
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Confidence Score</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                        {prediction.confidence.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Hashrate</p>
                      <p className="text-lg font-mono text-emerald-400">
                        {prediction.predicted_hashrate.toFixed(2)}
                        <span className="text-xs text-slate-500 ml-1">MH/s</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Power</p>
                      <p className="text-lg font-mono text-amber-400">
                        {prediction.predicted_power.toFixed(0)}
                        <span className="text-xs text-slate-500 ml-1">W</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Efficiency</p>
                    <p className="text-2xl font-mono text-cyan-400">
                      {prediction.predicted_efficiency.toFixed(3)}
                      <span className="text-xs text-slate-500 ml-2">MH/W</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-400">Improvement vs Current</p>
                      <p className="text-sm font-semibold text-purple-400">
                        +{prediction.improvement_vs_current.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}