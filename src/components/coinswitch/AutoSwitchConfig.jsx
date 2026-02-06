import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";

export default function AutoSwitchConfig({ config, onConfigChange }) {
  const handleChange = (key, value) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
            <Settings className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <CardTitle className="text-base text-white">Auto-Switch Settings</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Configure automatic coin switching</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label className="text-sm text-white">Enable Auto-Switch</Label>
            <p className="text-xs text-slate-500 mt-1">Automatically apply AI predictions</p>
          </div>
          <Switch
            checked={config.auto_switch_enabled || false}
            onCheckedChange={(v) => handleChange('auto_switch_enabled', v)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm text-slate-400">Minimum Confidence</Label>
            <span className="text-sm font-mono text-white">{config.min_confidence || 75}%</span>
          </div>
          <Slider
            value={[config.min_confidence || 75]}
            onValueChange={([v]) => handleChange('min_confidence', v)}
            min={50}
            max={95}
            step={5}
            disabled={!config.auto_switch_enabled}
          />
          <p className="text-xs text-slate-600 mt-1">Only apply predictions above this confidence level</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm text-slate-400">Profit Threshold</Label>
            <span className="text-sm font-mono text-white">${config.min_profit_increase || 0.50}</span>
          </div>
          <Input
            type="number"
            step="0.10"
            value={config.min_profit_increase || 0.50}
            onChange={(e) => handleChange('min_profit_increase', parseFloat(e.target.value))}
            disabled={!config.auto_switch_enabled}
            className="bg-slate-800/50 border-slate-700 text-white"
          />
          <p className="text-xs text-slate-600 mt-1">Minimum profit increase to trigger switch (per 24h)</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm text-slate-400">Check Interval</Label>
            <span className="text-sm font-mono text-white">{config.check_interval_hours || 6}h</span>
          </div>
          <Slider
            value={[config.check_interval_hours || 6]}
            onValueChange={([v]) => handleChange('check_interval_hours', v)}
            min={1}
            max={24}
            step={1}
            disabled={!config.auto_switch_enabled}
          />
          <p className="text-xs text-slate-600 mt-1">How often to generate new predictions</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
          <div className="flex-1">
            <Label className="text-sm text-white">Learning Mode</Label>
            <p className="text-xs text-slate-500 mt-1">Improve predictions from actual results</p>
          </div>
          <Switch
            checked={config.learning_mode || true}
            onCheckedChange={(v) => handleChange('learning_mode', v)}
          />
        </div>

        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <p className="text-xs text-purple-400 mb-2">🧠 Self-Learning Status</p>
          <p className="text-[10px] text-slate-400">
            The AI continuously learns from your mining results to improve future predictions
          </p>
        </div>
      </CardContent>
    </Card>
  );
}