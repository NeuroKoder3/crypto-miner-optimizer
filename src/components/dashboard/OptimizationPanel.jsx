import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Cpu, MemoryStick, Settings, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OptimizationPanel({ selectedGpu, onApplySettings, isOptimizing }) {
  const [settings, setSettings] = useState({
    core_clock: selectedGpu?.core_clock || 1500,
    memory_clock: selectedGpu?.memory_clock || 2000,
    power_limit: selectedGpu?.power_limit || 100,
    algorithm: selectedGpu?.algorithm || 'ethash'
  });

  React.useEffect(() => {
    if (selectedGpu) {
      setSettings({
        core_clock: selectedGpu.core_clock || 1500,
        memory_clock: selectedGpu.memory_clock || 2000,
        power_limit: selectedGpu.power_limit || 100,
        algorithm: selectedGpu.algorithm || 'ethash'
      });
    }
  }, [selectedGpu]);

  const handleReset = () => {
    setSettings({
      core_clock: 1500,
      memory_clock: 2000,
      power_limit: 100,
      algorithm: 'ethash'
    });
  };

  if (!selectedGpu) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-2xl bg-slate-800/50 mb-4">
            <Cpu className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 text-sm">Select a GPU to configure optimization settings</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/20">
              <Settings className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-base text-white">Optimization Panel</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">{selectedGpu.name}</p>
            </div>
          </div>
          <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs">
            {selectedGpu.gpu_id}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 space-y-5">
        {/* Algorithm Selection */}
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Algorithm</label>
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

        {/* Core Clock */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <label className="text-xs text-slate-400 uppercase tracking-wider">Core Clock</label>
            </div>
            <span className="text-sm font-mono text-white">{settings.core_clock} MHz</span>
          </div>
          <Slider
            value={[settings.core_clock]}
            onValueChange={([v]) => setSettings({...settings, core_clock: v})}
            min={800}
            max={2200}
            step={10}
            className="[&_[role=slider]]:bg-cyan-500 [&_[role=slider]]:border-cyan-400"
          />
          <div className="flex justify-between mt-1 text-[10px] text-slate-600">
            <span>800</span>
            <span>2200</span>
          </div>
        </div>

        {/* Memory Clock */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MemoryStick className="w-3.5 h-3.5 text-emerald-400" />
              <label className="text-xs text-slate-400 uppercase tracking-wider">Memory Clock</label>
            </div>
            <span className="text-sm font-mono text-white">{settings.memory_clock} MHz</span>
          </div>
          <Slider
            value={[settings.memory_clock]}
            onValueChange={([v]) => setSettings({...settings, memory_clock: v})}
            min={1000}
            max={3000}
            step={50}
            className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-400"
          />
          <div className="flex justify-between mt-1 text-[10px] text-slate-600">
            <span>1000</span>
            <span>3000</span>
          </div>
        </div>

        {/* Power Limit */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <label className="text-xs text-slate-400 uppercase tracking-wider">Power Limit</label>
            </div>
            <span className="text-sm font-mono text-white">{settings.power_limit}%</span>
          </div>
          <Slider
            value={[settings.power_limit]}
            onValueChange={([v]) => setSettings({...settings, power_limit: v})}
            min={50}
            max={120}
            step={1}
            className="[&_[role=slider]]:bg-amber-500 [&_[role=slider]]:border-amber-400"
          />
          <div className="flex justify-between mt-1 text-[10px] text-slate-600">
            <span>50%</span>
            <span>120%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onApplySettings(selectedGpu, settings)}
            disabled={isOptimizing}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white border-0"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Apply Settings
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}