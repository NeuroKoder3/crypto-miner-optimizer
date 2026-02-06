import React, { useState } from 'react';
import { offlineClient } from '@/api/offlineClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Download, Trash2, Plus, Star, Cpu, Settings, Copy, FileJson } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function Profiles() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    gpu_id: '',
    algorithm: 'ethash',
    core_clock: 1500,
    memory_clock: 2000,
    power_limit: 100
  });

  const queryClient = useQueryClient();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => offlineClient.entities.GPUProfile.list('-created_date'),
  });

  const { data: gpus = [] } = useQuery({
    queryKey: ['gpus'],
    queryFn: () => offlineClient.entities.GPU.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.GPUProfile.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setIsCreateOpen(false);
      setNewProfile({
        name: '',
        gpu_id: '',
        algorithm: 'ethash',
        core_clock: 1500,
        memory_clock: 2000,
        power_limit: 100
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => offlineClient.entities.GPUProfile.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => offlineClient.entities.GPUProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  });

  const handleCreate = () => {
    const gpu = gpus.find(g => g.gpu_id === newProfile.gpu_id);
    createMutation.mutate({
      ...newProfile,
      gpu_name: gpu?.name || 'Unknown GPU',
      expected_hashrate: gpu?.hashrate || 0,
      expected_power: gpu?.power_draw || 0,
      expected_efficiency: gpu?.efficiency || 0
    });
  };

  const handleSetDefault = (profile) => {
    // First unset all defaults for this GPU
    profiles
      .filter(p => p.gpu_id === profile.gpu_id && p.is_default)
      .forEach(p => updateMutation.mutate({ id: p.id, data: { is_default: false } }));
    
    // Set this one as default
    updateMutation.mutate({ id: profile.id, data: { is_default: true } });
  };

  const handleDuplicate = (profile) => {
    createMutation.mutate({
      ...profile,
      name: `${profile.name} (Copy)`,
      is_default: false
    });
  };

  const exportProfiles = () => {
    const dataStr = JSON.stringify(profiles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'gpu_profiles.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group profiles by GPU
  const profilesByGpu = gpus.map(gpu => ({
    gpu,
    profiles: profiles.filter(p => p.gpu_id === gpu.gpu_id)
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">
              GPU Profiles
            </h1>
            <p className="text-sm text-slate-500 mt-1">Save and manage optimized configurations</p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={exportProfiles}
              variant="outline" 
              className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300"
            >
              <FileJson className="w-4 h-4 mr-2" />
              Export All
            </Button>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 max-w-md">
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
                      placeholder="My Optimized Settings"
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

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                        Core
                      </label>
                      <Input
                        type="number"
                        value={newProfile.core_clock}
                        onChange={(e) => setNewProfile({...newProfile, core_clock: parseInt(e.target.value)})}
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                        Memory
                      </label>
                      <Input
                        type="number"
                        value={newProfile.memory_clock}
                        onChange={(e) => setNewProfile({...newProfile, memory_clock: parseInt(e.target.value)})}
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                        PL %
                      </label>
                      <Input
                        type="number"
                        value={newProfile.power_limit}
                        onChange={(e) => setNewProfile({...newProfile, power_limit: parseInt(e.target.value)})}
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreate}
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
        </motion.header>

        {/* Profiles Grid by GPU */}
        <div className="space-y-8">
          {profilesByGpu.map(({ gpu, profiles: gpuProfiles }, idx) => (
            <motion.div
              key={gpu.gpu_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
                  <Cpu className="w-4 h-4 text-slate-400" />
                </div>
                <h2 className="font-semibold text-white">{gpu.name}</h2>
                <Badge className="bg-slate-800 text-slate-400 border-0 text-xs">{gpu.gpu_id}</Badge>
                <span className="text-xs text-slate-500">{gpuProfiles.length} profiles</span>
              </div>

              {gpuProfiles.length === 0 ? (
                <Card className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-slate-800/50 backdrop-blur-xl">
                  <CardContent className="py-8 text-center">
                    <Settings className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No profiles saved for this GPU</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {gpuProfiles.map((profile) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl hover:border-slate-700/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-white">{profile.name}</h3>
                                {profile.is_default && (
                                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                )}
                              </div>
                              <Badge className="bg-slate-700/50 text-slate-300 border-0 text-xs">
                                {profile.algorithm}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-800/30 border border-slate-700/20 mb-3">
                              <div className="text-center">
                                <p className="text-[10px] text-slate-500 uppercase">Core</p>
                                <p className="text-sm font-mono text-cyan-400">{profile.core_clock}</p>
                              </div>
                              <div className="text-center border-x border-slate-700/30">
                                <p className="text-[10px] text-slate-500 uppercase">Memory</p>
                                <p className="text-sm font-mono text-emerald-400">{profile.memory_clock}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[10px] text-slate-500 uppercase">Power</p>
                                <p className="text-sm font-mono text-amber-400">{profile.power_limit}%</p>
                              </div>
                            </div>

                            {profile.expected_efficiency > 0 && (
                              <div className="text-xs text-slate-500 mb-3">
                                Expected: <span className="text-cyan-400 font-mono">{profile.expected_efficiency?.toFixed(3)} MH/W</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSetDefault(profile)}
                                disabled={profile.is_default}
                                className={`flex-1 h-8 text-xs ${
                                  profile.is_default 
                                    ? 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30' 
                                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                                }`}
                              >
                                <Star className="w-3 h-3 mr-1" />
                                {profile.is_default ? 'Default' : 'Set Default'}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDuplicate(profile)}
                                className="h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-400"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteMutation.mutate(profile.id)}
                                className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>

                            <p className="text-[10px] text-slate-600 mt-3">
                              Created {format(new Date(profile.created_date), 'MMM d, yyyy')}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ))}

          {profilesByGpu.length === 0 && (
            <div className="text-center py-16">
              <Cpu className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">No GPUs detected</p>
              <p className="text-sm text-slate-600 mt-1">Add GPUs from the Dashboard to create profiles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}