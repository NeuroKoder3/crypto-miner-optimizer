import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus, Trash2, Settings2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const triggerOptions = [
  { value: 'low_hashrate', label: 'Low Hashrate', icon: '📉' },
  { value: 'high_temperature', label: 'High Temperature', icon: '🌡️' },
  { value: 'error_status', label: 'Error Status', icon: '⚠️' },
  { value: 'fan_failure', label: 'Fan Failure', icon: '🌀' },
  { value: 'power_spike', label: 'Power Spike', icon: '⚡' }
];

const actionOptions = [
  { value: 'restart_gpu', label: 'Restart GPU', description: 'Restart the GPU' },
  { value: 'safe_mode', label: 'Safe Mode', description: 'Reduce to safe settings' },
  { value: 'adjust_power', label: 'Adjust Power', description: 'Reduce power limit' },
  { value: 'reduce_clocks', label: 'Reduce Clocks', description: 'Lower core/memory clocks' },
  { value: 'send_alert', label: 'Send Alert', description: 'Send notification only' }
];

export default function AutomationRuleManager({ rules, gpus, onCreateRule, onDeleteRule, onToggleRule }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    gpu_id: 'all',
    trigger_type: 'high_temperature',
    trigger_threshold: 80,
    action_type: 'safe_mode',
    action_parameters: {}
  });

  const handleCreate = () => {
    if (newRule.name && newRule.trigger_type && newRule.action_type) {
      onCreateRule({...newRule, is_active: true, trigger_count: 0});
      setNewRule({
        name: '',
        gpu_id: 'all',
        trigger_type: 'high_temperature',
        trigger_threshold: 80,
        action_type: 'safe_mode',
        action_parameters: {}
      });
      setIsCreateOpen(false);
    }
  };

  const severityColors = {
    low_hashrate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high_temperature: 'bg-red-500/20 text-red-400 border-red-500/30',
    error_status: 'bg-red-500/20 text-red-400 border-red-500/30',
    fan_failure: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    power_spike: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20">
              <Zap className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-base text-white">Automation Rules</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Automatic GPU management</p>
            </div>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white h-8">
                <Plus className="w-3.5 h-3.5 mr-1" />
                New Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Create Automation Rule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-400 mb-2 block">Rule Name</Label>
                  <Input
                    value={newRule.name}
                    onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                    placeholder="Auto-restart on overheat"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-sm text-slate-400 mb-2 block">Target GPU</Label>
                  <Select 
                    value={newRule.gpu_id} 
                    onValueChange={(v) => setNewRule({...newRule, gpu_id: v})}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="all">All GPUs</SelectItem>
                      {gpus.map(gpu => (
                        <SelectItem key={gpu.gpu_id} value={gpu.gpu_id}>
                          {gpu.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-slate-400 mb-2 block">Trigger Condition</Label>
                  <Select 
                    value={newRule.trigger_type} 
                    onValueChange={(v) => setNewRule({...newRule, trigger_type: v})}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {triggerOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.icon} {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-slate-400 mb-2 block">Threshold</Label>
                  <Input
                    type="number"
                    value={newRule.trigger_threshold}
                    onChange={(e) => setNewRule({...newRule, trigger_threshold: parseFloat(e.target.value)})}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-600 mt-1">
                    {newRule.trigger_type === 'high_temperature' && '°C temperature limit'}
                    {newRule.trigger_type === 'low_hashrate' && 'MH/s minimum hashrate'}
                    {newRule.trigger_type === 'power_spike' && 'Watts maximum'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-slate-400 mb-2 block">Action</Label>
                  <Select 
                    value={newRule.action_type} 
                    onValueChange={(v) => setNewRule({...newRule, action_type: v})}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {actionOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-600 mt-1">
                    {actionOptions.find(a => a.value === newRule.action_type)?.description}
                  </p>
                </div>

                <Button 
                  onClick={handleCreate}
                  className="w-full bg-orange-600 hover:bg-orange-500"
                  disabled={!newRule.name}
                >
                  Create Rule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <AnimatePresence>
            {rules.length === 0 ? (
              <div className="text-center py-6">
                <Settings2 className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No automation rules configured</p>
              </div>
            ) : (
              rules.map((rule) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-3 rounded-lg border ${
                    rule.is_active 
                      ? 'bg-slate-800/30 border-slate-700/30' 
                      : 'bg-slate-800/10 border-slate-700/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-white">{rule.name}</span>
                        <Badge className={`${severityColors[rule.trigger_type]} border text-[10px]`}>
                          {triggerOptions.find(t => t.value === rule.trigger_type)?.label}
                        </Badge>
                        {!rule.is_active && (
                          <Badge className="bg-slate-700/50 text-slate-400 border-0 text-[10px]">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        <span>When {rule.gpu_id === 'all' ? 'any GPU' : 'GPU'} exceeds </span>
                        <span className="text-white font-mono">{rule.trigger_threshold}</span>
                        <span> → </span>
                        <span className="text-orange-400">
                          {actionOptions.find(a => a.value === rule.action_type)?.label}
                        </span>
                      </div>
                      {rule.trigger_count > 0 && (
                        <p className="text-xs text-slate-600 mt-1">
                          Triggered {rule.trigger_count} times
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-3">
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={() => onToggleRule(rule.id, !rule.is_active)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteRule(rule.id)}
                        className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}