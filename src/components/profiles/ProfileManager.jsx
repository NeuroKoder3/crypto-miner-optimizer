import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Download, Trash2, Plus, Star, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileManager({ 
  profiles, 
  gpus,
  onSaveProfile, 
  onLoadProfile, 
  onDeleteProfile,
  selectedGpu 
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    gpu_id: '',
    algorithm: 'ethash'
  });

  const handleCreateProfile = () => {
    if (!newProfile.name || !newProfile.gpu_id) return;
    
    const gpu = gpus.find(g => g.gpu_id === newProfile.gpu_id);
    if (!gpu) return;

    onSaveProfile({
      ...newProfile,
      gpu_name: gpu.name,
      core_clock: gpu.core_clock || 1500,
      memory_clock: gpu.memory_clock || 2000,
      power_limit: gpu.power_limit || 100,
      expected_hashrate: gpu.hashrate || 0,
      expected_power: gpu.power_draw || 0,
      expected_efficiency: gpu.efficiency || 0
    });

    setNewProfile({ name: '', gpu_id: '', algorithm: 'ethash' });
    setIsCreateOpen(false);
  };

  const gpuProfiles = selectedGpu 
    ? profiles.filter(p => p.gpu_id === selectedGpu.gpu_id)
    : profiles;

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20">
              <Save className="w-4 h-4 text-blue-400" />
            </div>
            <CardTitle className="text-base text-white">Saved Profiles</CardTitle>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white h-8 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                    Profile Name
                  </label>
                  <Input
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                    placeholder="My Optimized Profile"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                    GPU
                  </label>
                  <Select 
                    value={newProfile.gpu_id} 
                    onValueChange={(v) => setNewProfile({...newProfile, gpu_id: v})}
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
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                    Algorithm
                  </label>
                  <Select 
                    value={newProfile.algorithm} 
                    onValueChange={(v) => setNewProfile({...newProfile, algorithm: v})}
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
                <Button 
                  onClick={handleCreateProfile}
                  className="w-full bg-blue-600 hover:bg-blue-500"
                  disabled={!newProfile.name || !newProfile.gpu_id}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <div className="p-4 space-y-2">
            <AnimatePresence>
              {gpuProfiles.length === 0 ? (
                <div className="text-center py-6">
                  <Cpu className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No saved profiles</p>
                  <p className="text-xs text-slate-600 mt-1">Create a profile to save your settings</p>
                </div>
              ) : (
                gpuProfiles.map((profile) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white truncate">{profile.name}</span>
                          {profile.is_default && (
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-slate-700/50 text-slate-400 border-0 text-[10px]">
                            {profile.algorithm}
                          </Badge>
                          <span className="text-[10px] text-slate-500">
                            Core: {profile.core_clock} • Mem: {profile.memory_clock} • PL: {profile.power_limit}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onLoadProfile(profile)}
                          className="h-7 w-7 p-0 hover:bg-cyan-500/20 hover:text-cyan-400"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteProfile(profile)}
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}