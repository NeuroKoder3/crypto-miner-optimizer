import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const severityConfig = {
  critical: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertTriangle },
  high: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertCircle },
  medium: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Info },
  low: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Info }
};

const alertTypeLabels = {
  overheating: 'Overheating',
  fan_failure: 'Fan Failure',
  power_issue: 'Power Issue',
  low_hashrate: 'Low Hashrate',
  gpu_error: 'GPU Error',
  safe_mode_engaged: 'Safe Mode Engaged'
};

export default function HardwareAlerts({ alerts, onResolveAlert }) {
  const activeAlerts = alerts.filter(a => !a.is_resolved);
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical').length;

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <CardTitle className="text-base text-white">Hardware Alerts</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Critical issues and warnings</p>
            </div>
          </div>
          {criticalAlerts > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
              {criticalAlerts} Critical
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-2">
            <AnimatePresence>
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">All systems normal</p>
                  <p className="text-xs text-slate-600 mt-1">No active hardware alerts</p>
                </div>
              ) : (
                activeAlerts.map((alert) => {
                  const config = severityConfig[alert.severity];
                  const Icon = config.icon;
                  
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-3 rounded-lg border ${config.color}`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white truncate">
                              {alert.gpu_name}
                            </span>
                            <Badge className={`${config.color} border text-[10px]`}>
                              {alertTypeLabels[alert.alert_type]}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-slate-300 mb-2">{alert.message}</p>
                          
                          {alert.current_value !== undefined && alert.threshold_value !== undefined && (
                            <div className="flex items-center gap-2 text-[10px] mb-2">
                              <span className="text-slate-500">Current:</span>
                              <span className="font-mono text-white">{alert.current_value}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-500">Threshold:</span>
                              <span className="font-mono text-slate-400">{alert.threshold_value}</span>
                            </div>
                          )}
                          
                          {alert.auto_action_taken && (
                            <div className="p-2 rounded bg-slate-900/50 mb-2">
                              <p className="text-[10px] text-cyan-400">
                                ⚡ Auto-action: {alert.auto_action_taken}
                              </p>
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
                          className="h-7 w-7 p-0 hover:bg-slate-700/50 shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}