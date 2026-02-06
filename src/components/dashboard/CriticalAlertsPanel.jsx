import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, X, Flame, Zap, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const alertIcons = {
  overheating: Flame,
  fan_failure: Activity,
  power_issue: Zap,
  low_hashrate: Activity,
  gpu_error: AlertCircle,
  safe_mode_engaged: AlertCircle
};

export default function CriticalAlertsPanel({ alerts, onResolveAlert }) {
  const criticalAlerts = alerts.filter(a => !a.is_resolved && (a.severity === 'critical' || a.severity === 'high'));

  if (criticalAlerts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-r from-red-950/50 to-orange-950/50 border-2 border-red-500/30 backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 animate-pulse" />
        
        <CardHeader className="border-b border-red-500/20 pb-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  Critical Hardware Alerts
                  <Badge className="bg-red-500 text-white animate-pulse">
                    {criticalAlerts.length}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-red-300 mt-0.5">Immediate attention required</p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 relative">
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            <AnimatePresence>
              {criticalAlerts.slice(0, 5).map((alert) => {
                const Icon = alertIcons[alert.alert_type] || AlertCircle;
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-3 rounded-lg bg-slate-900/50 border border-red-500/20 hover:border-red-500/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${
                        alert.severity === 'critical' ? 'text-red-400' : 'text-orange-400'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white truncate">
                            {alert.gpu_name}
                          </span>
                          <Badge className={`${
                            alert.severity === 'critical' 
                              ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                              : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          } border text-[10px]`}>
                            {alert.severity}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-slate-300 mb-2">{alert.message}</p>
                        
                        {alert.current_value !== undefined && alert.threshold_value !== undefined && (
                          <div className="flex items-center gap-2 text-[10px] mb-2">
                            <span className="text-slate-500">Current:</span>
                            <span className="font-mono text-red-400 font-semibold">{alert.current_value}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-500">Threshold:</span>
                            <span className="font-mono text-slate-400">{alert.threshold_value}</span>
                          </div>
                        )}
                        
                        <p className="text-[10px] text-slate-600">
                          {format(new Date(alert.created_date), 'MMM d, HH:mm:ss')}
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onResolveAlert(alert.id)}
                        className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-400 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}