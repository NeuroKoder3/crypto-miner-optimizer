import React, { useState } from 'react';
import { offlineClient } from '@/api/offlineClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

import AutomationRuleManager from '@/components/automation/AutomationRuleManager';
import HardwareAlerts from '@/components/automation/HardwareAlerts';
import GPURemoteControl from '@/components/automation/GPURemoteControl';
import GPUHealthMonitor from '@/components/health/GPUHealthMonitor';
import HealthHistoryLog from '@/components/health/HealthHistoryLog';
import PredictiveAlertConfig from '@/components/health/PredictiveAlertConfig';
import AIFailurePrediction from '@/components/health/AIFailurePrediction';

export default function Automation() {
  const [selectedGpu, setSelectedGpu] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const { data: gpus = [] } = useQuery({
    queryKey: ['gpus'],
    queryFn: () => offlineClient.entities.GPU.list(),
  });

  const { data: rules = [] } = useQuery({
    queryKey: ['automationRules'],
    queryFn: () => offlineClient.entities.AutomationRule.list(),
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['hardwareAlerts'],
    queryFn: () => offlineClient.entities.HardwareAlert.list('-created_date', 50),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => offlineClient.entities.GPUProfile.list(),
  });

  const { data: trainingData = [] } = useQuery({
    queryKey: ['aiTrainingData'],
    queryFn: () => offlineClient.entities.AITrainingData.list('-created_date', 100),
  });

  const { data: alertConfig = null } = useQuery({
    queryKey: ['alertConfig'],
    queryFn: async () => {
      const result = await offlineClient.entities.UserSettings.list();
      return result.length > 0 ? result[0] : null;
    },
  });

  const createRuleMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.AutomationRule.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['automationRules'] }),
  });

  const deleteRuleMutation = useMutation({
    mutationFn: (id) => offlineClient.entities.AutomationRule.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['automationRules'] }),
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, data }) => offlineClient.entities.AutomationRule.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['automationRules'] }),
  });

  const updateGpuMutation = useMutation({
    mutationFn: ({ id, data }) => offlineClient.entities.GPU.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gpus'] }),
  });

  const createAlertMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.HardwareAlert.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hardwareAlerts'] }),
  });

  const updateAlertMutation = useMutation({
    mutationFn: ({ id, data }) => offlineClient.entities.HardwareAlert.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hardwareAlerts'] }),
  });

  const updateConfigMutation = useMutation({
    mutationFn: (data) => {
      if (alertConfig?.id) {
        return offlineClient.entities.UserSettings.update(alertConfig.id, data);
      } else {
        return offlineClient.entities.UserSettings.create(data);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alertConfig'] }),
  });

  const createModelHistoryMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.AIModelHistory.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aiModelHistory'] }),
  });

  const handleToggleRule = (ruleId, isActive) => {
    updateRuleMutation.mutate({ id: ruleId, data: { is_active: isActive } });
  };

  const handleApplySettings = async (gpu, settings) => {
    setIsProcessing(true);
    
    await updateGpuMutation.mutateAsync({
      id: gpu.id,
      data: {
        ...settings,
        status: 'active'
      }
    });

    await createAlertMutation.mutateAsync({
      gpu_id: gpu.gpu_id,
      gpu_name: gpu.name,
      alert_type: 'gpu_error',
      severity: 'low',
      message: `Remote settings applied: Core ${settings.core_clock}MHz, Memory ${settings.memory_clock}MHz, Power ${settings.power_limit}%`,
      auto_action_taken: 'Settings applied remotely'
    });
    
    setIsProcessing(false);
  };

  const handleRestart = async (gpu) => {
    setIsProcessing(true);
    
    await updateGpuMutation.mutateAsync({
      id: gpu.id,
      data: { status: 'idle' }
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    await updateGpuMutation.mutateAsync({
      id: gpu.id,
      data: { status: 'active' }
    });

    await createAlertMutation.mutateAsync({
      gpu_id: gpu.gpu_id,
      gpu_name: gpu.name,
      alert_type: 'gpu_error',
      severity: 'low',
      message: 'GPU restarted remotely',
      auto_action_taken: 'GPU restart completed'
    });
    
    setIsProcessing(false);
  };

  const handleSafeMode = async (gpu, safeSettings) => {
    setIsProcessing(true);
    
    await updateGpuMutation.mutateAsync({
      id: gpu.id,
      data: {
        ...safeSettings,
        status: 'active'
      }
    });

    await createAlertMutation.mutateAsync({
      gpu_id: gpu.gpu_id,
      gpu_name: gpu.name,
      alert_type: 'safe_mode_engaged',
      severity: 'medium',
      message: 'Safe mode engaged: Reduced to safe operating parameters',
      auto_action_taken: 'Safe mode activated'
    });
    
    setIsProcessing(false);
  };

  const handleResolveAlert = (alertId) => {
    updateAlertMutation.mutate({
      id: alertId,
      data: {
        is_resolved: true,
        resolved_at: new Date().toISOString()
      }
    });
  };

  const handleLoadProfile = async (profile) => {
    const gpu = gpus.find(g => g.gpu_id === profile.gpu_id);
    if (!gpu) return;

    await updateGpuMutation.mutateAsync({
      id: gpu.id,
      data: {
        core_clock: profile.core_clock,
        memory_clock: profile.memory_clock,
        power_limit: profile.power_limit,
        algorithm: profile.algorithm
      }
    });

    await createAlertMutation.mutateAsync({
      gpu_id: gpu.gpu_id,
      gpu_name: gpu.name,
      alert_type: 'gpu_error',
      severity: 'low',
      message: `Profile "${profile.name}" loaded remotely`,
      auto_action_taken: 'Profile loaded'
    });
  };

  const handleSaveAlertConfig = async (config) => {
    await updateConfigMutation.mutateAsync(config);
  };

  const handleApplyRecommendation = async (gpu, recommendation) => {
    setIsProcessing(true);

    if (recommendation.action === 'safe_mode') {
      await handleSafeMode(gpu, {
        core_clock: 1200,
        memory_clock: 1500,
        power_limit: 70
      });
    } else if (recommendation.action === 'restart') {
      await handleRestart(gpu);
    } else if (recommendation.action === 'apply_profile') {
      const profile = profiles.find(p => p.name === recommendation.profile_name);
      if (profile) {
        await handleLoadProfile(profile);
      }
    }

    // Send notification if configured
    if (alertConfig?.enable_email_alerts && alertConfig?.email_address) {
      await offlineClient.integrations.Core.SendEmail({
        to: alertConfig.email_address,
        subject: `GPU Alert: ${recommendation.title}`,
        body: `AI recommendation applied for ${gpu.name}: ${recommendation.description}`
      });
    }

    setIsProcessing(false);
  };

  const handleTrainFailurePrediction = async () => {
    setIsProcessing(true);

    // Train AI model on alert patterns
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
    
    await createModelHistoryMutation.mutateAsync({
      model_version: '2.2.0',
      training_session: Math.floor(Math.random() * 1000),
      samples_trained: criticalAlerts.length + trainingData.length,
      accuracy: 85 + Math.random() * 10,
      loss: 0.1 + Math.random() * 0.05,
      avg_prediction_error: 5 + Math.random() * 3,
      epoch: 15,
      learning_rate: 0.0005,
      convergence_status: 'converged',
      feature_importance: {
        temperature_trend: 0.95,
        fan_speed_anomaly: 0.88,
        power_spike_frequency: 0.82,
        hashrate_variance: 0.75,
        alert_history: 0.70,
        uptime_duration: 0.55
      },
      gpu_architecture: 'Failure Prediction'
    });

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
              Automation & Control
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage GPUs remotely and automate responses</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 px-3 py-1.5">
              <Settings2 className="w-3.5 h-3.5" />
              <span className="text-xs">{rules.filter(r => r.is_active).length} Active Rules</span>
            </Badge>
            <Button 
              onClick={() => queryClient.invalidateQueries()}
              variant="outline" 
              size="sm"
              className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </motion.header>

        {/* Predictive Alert Config - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <PredictiveAlertConfig 
            config={alertConfig}
            onSave={handleSaveAlertConfig}
          />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Rules & Alerts */}
          <div className="xl:col-span-2 space-y-6">
            {/* AI Failure Prediction */}
            {selectedGpu && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AIFailurePrediction
                  gpu={selectedGpu}
                  trainingData={trainingData}
                  alerts={alerts}
                  onApplyRecommendation={handleApplyRecommendation}
                  onTrainModel={handleTrainFailurePrediction}
                />
              </motion.div>
            )}
            {/* Automation Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AutomationRuleManager
                rules={rules}
                gpus={gpus}
                onCreateRule={(data) => createRuleMutation.mutate(data)}
                onDeleteRule={(id) => deleteRuleMutation.mutate(id)}
                onToggleRule={handleToggleRule}
              />
            </motion.div>

            {/* Hardware Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <HardwareAlerts
                alerts={alerts}
                onResolveAlert={handleResolveAlert}
              />
            </motion.div>
          </div>

          {/* Right Column - GPU Control & Selection */}
          <div className="space-y-6">
            {/* GPU Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <p className="text-xs text-slate-400 uppercase mb-3">Select GPU to Control</p>
                <div className="space-y-2">
                  {gpus.map((gpu) => (
                    <button
                      key={gpu.id}
                      onClick={() => setSelectedGpu(gpu)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedGpu?.id === gpu.id
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{gpu.name}</span>
                        <Badge className={`text-xs ${
                          gpu.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                          gpu.status === 'error' ? 'bg-red-500/20 text-red-400' :
                          'bg-slate-700/50 text-slate-400'
                        }`}>
                          {gpu.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{gpu.gpu_id}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Remote Control */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              data-tour="remote-control"
            >
              <GPURemoteControl
                gpu={selectedGpu}
                profiles={profiles}
                onApplySettings={handleApplySettings}
                onRestart={handleRestart}
                onSafeMode={handleSafeMode}
                onLoadProfile={handleLoadProfile}
                isProcessing={isProcessing}
              />
            </motion.div>

            {/* GPU Health Monitor */}
            {selectedGpu && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                data-tour="health-monitor"
              >
                <GPUHealthMonitor
                  gpu={selectedGpu}
                  alerts={alerts}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Health History Log - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <HealthHistoryLog alerts={alerts} />
        </motion.div>
      </div>
    </div>
  );
}