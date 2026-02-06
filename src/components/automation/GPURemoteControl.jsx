import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Power, RefreshCw, Shield, Zap, Activity, Save, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GPURemoteControl({ gpu, profiles = [], onApplySettings, onRestart, onSafeMode, onLoadProfile, isProcessing }) {
  const [actionStatus, setActionStatus] = useState(null);
  const [settings, setSettings] = useState({
    core_clock: gpu?.core_clock || 1500,
    memory_clock: gpu?.memory_clock || 2000,
    power_limit: gpu?.power_limit || 100
  });

  if (!gpu) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-slate-500">Select a GPU to control</p>
        </CardContent>
      </Card>
    );
  }

  const handleApply = async () => {
    setActionStatus({ type: 'applying', message: 'Applying settings...' });
    await onApplySettings(gpu, settings);
    setActionStatus({ type: 'success', message: 'Settings applied successfully!' });
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handleSafeMode = async () => {
    const safeSettings = {
      core_clock: 1200,
      memory_clock: 1500,
      power_limit: 70
    };
    setSettings(safeSettings);
    setActionStatus({ type: 'applying', message: 'Engaging safe mode...' });
    await onSafeMode(gpu, safeSettings);
    setActionStatus({ type: 'success', message: 'Safe mode activated!' });
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handleRestart = async () => {
    setActionStatus({ type: 'applying', message: 'Restarting GPU...' });
    await onRestart(gpu);
    setActionStatus({ type: 'success', message: 'GPU restarted successfully!' });
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handleProfileLoad = async (profileId) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    setSettings({
      core_clock: profile.core_clock,
      memory_clock: profile.memory_clock,
      power_limit: profile.power_limit
    });
    
    setActionStatus({ type: 'applying', message: `Loading profile "${profile.name}"...` });
    await onLoadProfile(profile);
    setActionStatus({ type: 'success', message: `Profile "${profile.name}" loaded!` });
    setTimeout(() => setActionStatus(null), 3000);
  };

  const gpuProfiles = profiles.filter(p => p.gpu_id === gpu?.gpu_id || p.gpu_id === 'all');

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-base text-white">Remote Control</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">{gpu.name}</p>
            </div>
          </div>
          <Badge className={`${
            gpu.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
            gpu.status === 'error' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
            'bg-slate-700/50 text-slate-400 border-slate-600/30'
          } border text-xs`}>
            {gpu.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 space-y-5">
        {/* Action Status */}
        <AnimatePresence>
          {actionStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3 rounded-lg border ${
                actionStatus.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-cyan-500/10 border-cyan-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionStatus.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                )}
                <span className={`text-sm ${
                  actionStatus.type === 'success' ? 'text-emerald-300' : 'text-cyan-300'
                }`}>
                  {actionStatus.message}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Selector */}
        {gpuProfiles.length > 0 && (
          <div>
            <Label className="text-xs text-slate-400 uppercase mb-2 block">Load Saved Profile</Label>
            <Select onValueChange={handleProfileLoad} disabled={isProcessing}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700">
                <SelectValue placeholder="Select a profile..." />
              </SelectTrigger>
              <SelectContent>
                {gpuProfiles.map(profile => (
                  <SelectItem key={profile.id} value={profile.id}>
                    <div className="flex items-center gap-2">
                      <Save className="w-3 h-3" />
                      {profile.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Core Clock */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-slate-400 uppercase">Core Clock</Label>
            <span className="text-sm font-mono text-white">{settings.core_clock} MHz</span>
          </div>
          <Slider
            value={[settings.core_clock]}
            onValueChange={([v]) => setSettings({...settings, core_clock: v})}
            min={800}
            max={2500}
            step={10}
            disabled={isProcessing}
          />
          <div className="flex justify-between mt-1 text-[10px] text-slate-600">
            <span>800</span>
            <span>2500</span>
          </div>
        </div>

        {/* Memory Clock */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-slate-400 uppercase">Memory Clock</Label>
            <span className="text-sm font-mono text-white">{settings.memory_clock} MHz</span>
          </div>
          <Slider
            value={[settings.memory_clock]}
            onValueChange={([v]) => setSettings({...settings, memory_clock: v})}
            min={1000}
            max={3500}
            step={50}
            disabled={isProcessing}
          />
          <div className="flex justify-between mt-1 text-[10px] text-slate-600">
            <span>1000</span>
            <span>3500</span>
          </div>
        </div>

        {/* Power Limit */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-slate-400 uppercase">Power Limit</Label>
            <span className="text-sm font-mono text-white">{settings.power_limit}%</span>
          </div>
          <Slider
            value={[settings.power_limit]}
            onValueChange={([v]) => setSettings({...settings, power_limit: v})}
            min={50}
            max={120}
            step={1}
            disabled={isProcessing}
          />
          <div className="flex justify-between mt-1 text-[10px] text-slate-600">
            <span>50%</span>
            <span>120%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <Button
            onClick={handleApply}
            disabled={isProcessing}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            Apply Settings
          </Button>
          
          <Button
            onClick={handleSafeMode}
            disabled={isProcessing}
            variant="outline"
            className="bg-transparent border-amber-700 hover:bg-amber-500/10 text-amber-400"
          >
            <Shield className="w-4 h-4 mr-2" />
            Safe Mode
          </Button>
        </div>

        <Button
          onClick={handleRestart}
          disabled={isProcessing}
          variant="outline"
          className="w-full bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Restart GPU
        </Button>

        {/* Current Metrics */}
        <div className="pt-3 border-t border-slate-700/30">
          <p className="text-xs text-slate-500 uppercase mb-3">Current Metrics</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded-lg bg-slate-800/30">
              <p className="text-[10px] text-slate-500">Hashrate</p>
              <p className="text-sm font-mono text-emerald-400">{(gpu.hashrate || 0).toFixed(1)}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/30">
              <p className="text-[10px] text-slate-500">Power</p>
              <p className="text-sm font-mono text-amber-400">{(gpu.power_draw || 0).toFixed(0)}W</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/30">
              <p className="text-[10px] text-slate-500">Temp</p>
              <p className="text-sm font-mono text-cyan-400">{(gpu.temperature || 0).toFixed(0)}°C</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}