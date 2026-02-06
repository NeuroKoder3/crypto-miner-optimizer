import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Activity, Thermometer, Zap, Fan, Gauge } from "lucide-react";
import { motion } from "framer-motion";

const healthMetrics = [
  { key: 'temperature', label: 'Core Temp', icon: Thermometer, unit: '°C', warningThreshold: 75, criticalThreshold: 85, color: 'cyan' },
  { key: 'fan_speed', label: 'Fan Speed', icon: Fan, unit: '%', warningThreshold: 90, criticalThreshold: 100, color: 'blue' },
  { key: 'power_draw', label: 'Power Draw', icon: Zap, unit: 'W', warningThreshold: 300, criticalThreshold: 350, color: 'yellow' },
  { key: 'core_voltage', label: 'Core Voltage', icon: Gauge, unit: 'V', warningThreshold: 1.1, criticalThreshold: 1.2, color: 'purple' }
];

const getHealthStatus = (value, warningThreshold, criticalThreshold) => {
  if (!value) return 'unknown';
  if (value >= criticalThreshold) return 'critical';
  if (value >= warningThreshold) return 'warning';
  return 'healthy';
};

const statusColors = {
  healthy: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  unknown: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' }
};

export default function GPUHealthMonitor({ gpu, alerts }) {
  const gpuData = {
    temperature: gpu.temperature || 65,
    fan_speed: gpu.fan_speed || 60,
    power_draw: gpu.power_draw || 150,
    core_voltage: 1.05,
    vram_temperature: (gpu.temperature || 65) + 10,
    memory_usage: 85
  };

  // Calculate overall health score (0-100)
  const calculateHealthScore = () => {
    let score = 100;
    healthMetrics.forEach(metric => {
      const value = gpuData[metric.key];
      if (!value) return;
      
      if (value >= metric.criticalThreshold) score -= 25;
      else if (value >= metric.warningThreshold) score -= 10;
    });
    return Math.max(0, score);
  };

  const healthScore = calculateHealthScore();
  const overallStatus = healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical';

  // Recent alerts for this GPU
  const recentAlerts = alerts
    .filter(a => a.gpu_id === gpu.gpu_id && !a.is_resolved)
    .slice(0, 3);

  const predictiveWarnings = [];
  
  // Predictive analysis
  if (gpuData.temperature > 70 && gpuData.fan_speed < 50) {
    predictiveWarnings.push({
      type: 'cooling',
      message: 'Low fan speed with high temperature - potential cooling issue',
      severity: 'warning'
    });
  }
  
  if (gpuData.power_draw > 280) {
    predictiveWarnings.push({
      type: 'power',
      message: 'High power consumption detected - monitor for stability',
      severity: 'warning'
    });
  }

  if (gpuData.vram_temperature > 90) {
    predictiveWarnings.push({
      type: 'vram',
      message: 'VRAM temperature critical - thermal throttling likely',
      severity: 'critical'
    });
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Health Monitor - {gpu.name}
          </CardTitle>
          <Badge className={`${statusColors[overallStatus].bg} ${statusColors[overallStatus].text} border ${statusColors[overallStatus].border}`}>
            {healthScore}% Health
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Health Score Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Overall Health Score</span>
            <span className={`text-sm font-mono font-semibold ${statusColors[overallStatus].text}`}>
              {healthScore}/100
            </span>
          </div>
          <Progress 
            value={healthScore} 
            className={`h-2 ${
              healthScore >= 80 ? '[&>div]:bg-emerald-500' : 
              healthScore >= 60 ? '[&>div]:bg-yellow-500' : 
              '[&>div]:bg-red-500'
            }`}
          />
        </div>

        {/* Vital Metrics */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Vital Metrics</h3>
          {healthMetrics.map(metric => {
            const value = gpuData[metric.key];
            const status = getHealthStatus(value, metric.warningThreshold, metric.criticalThreshold);
            const Icon = metric.icon;
            const percentage = Math.min(100, (value / metric.criticalThreshold) * 100);

            return (
              <div key={metric.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${statusColors[status].text}`} />
                    <span className="text-xs text-slate-300">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono font-semibold ${statusColors[status].text}`}>
                      {value?.toFixed(metric.key === 'core_voltage' ? 2 : 0)}{metric.unit}
                    </span>
                    {status === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />}
                    {status === 'healthy' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className={`h-1.5 ${
                    status === 'critical' ? '[&>div]:bg-red-500' :
                    status === 'warning' ? '[&>div]:bg-yellow-500' :
                    '[&>div]:bg-emerald-500'
                  }`}
                />
              </div>
            );
          })}

          {/* Additional Metrics */}
          <div className="pt-2 border-t border-slate-800/50 grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-xs text-slate-500">VRAM Temp</span>
              <div className="flex items-center gap-2">
                <Thermometer className={`w-3 h-3 ${gpuData.vram_temperature > 90 ? 'text-red-400' : 'text-cyan-400'}`} />
                <span className={`text-sm font-mono ${gpuData.vram_temperature > 90 ? 'text-red-400' : 'text-white'}`}>
                  {gpuData.vram_temperature}°C
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">VRAM Usage</span>
              <div className="flex items-center gap-2">
                <Gauge className="w-3 h-3 text-purple-400" />
                <span className="text-sm font-mono text-white">{gpuData.memory_usage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Warnings */}
        {predictiveWarnings.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Predictive Alerts
            </h3>
            {predictiveWarnings.map((warning, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-2 rounded-lg ${
                  warning.severity === 'critical' 
                    ? 'bg-red-500/10 border border-red-500/30' 
                    : 'bg-yellow-500/10 border border-yellow-500/30'
                }`}
              >
                <p className={`text-xs ${warning.severity === 'critical' ? 'text-red-300' : 'text-yellow-300'}`}>
                  {warning.message}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recent Alerts */}
        {recentAlerts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Recent Alerts</h3>
            <div className="space-y-1.5">
              {recentAlerts.map(alert => (
                <div key={alert.id} className="p-2 rounded bg-slate-800/30 border border-slate-700/30">
                  <p className="text-xs text-slate-300">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}