import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const severityConfig = {
  critical: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  high: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  medium: { icon: Info, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  low: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' }
};

export default function HealthHistoryLog({ alerts }) {
  const sortedAlerts = [...alerts].sort((a, b) => 
    new Date(b.created_date) - new Date(a.created_date)
  );

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    resolved: alerts.filter(a => a.is_resolved).length,
    active: alerts.filter(a => !a.is_resolved).length
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-white">Health History Log</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {stats.active} Active
            </Badge>
            <Badge variant="outline" className="text-xs text-slate-500">
              {stats.resolved} Resolved
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="p-2 rounded-lg bg-slate-800/30 text-center">
            <div className="text-lg font-bold text-white">{stats.total}</div>
            <div className="text-[10px] text-slate-500 uppercase">Total</div>
          </div>
          <div className="p-2 rounded-lg bg-red-500/10 text-center border border-red-500/30">
            <div className="text-lg font-bold text-red-400">{stats.critical}</div>
            <div className="text-[10px] text-red-500 uppercase">Critical</div>
          </div>
          <div className="p-2 rounded-lg bg-yellow-500/10 text-center border border-yellow-500/30">
            <div className="text-lg font-bold text-yellow-400">{stats.active}</div>
            <div className="text-[10px] text-yellow-500 uppercase">Active</div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-center border border-emerald-500/30">
            <div className="text-lg font-bold text-emerald-400">{stats.resolved}</div>
            <div className="text-[10px] text-emerald-500 uppercase">Resolved</div>
          </div>
        </div>

        {/* Alert Log */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {sortedAlerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No alerts recorded</p>
                <p className="text-xs text-slate-600 mt-1">System is healthy</p>
              </div>
            ) : (
              sortedAlerts.map(alert => {
                const config = severityConfig[alert.severity] || severityConfig.medium;
                const Icon = config.icon;

                return (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${config.bg} ${config.border} ${
                      alert.is_resolved ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white truncate">
                            {alert.gpu_name}
                          </span>
                          <Badge className={`${config.bg} ${config.color} border ${config.border} text-[10px]`}>
                            {alert.alert_type.replace(/_/g, ' ')}
                          </Badge>
                          {alert.is_resolved && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-slate-300 mb-2">{alert.message}</p>
                        
                        {(alert.current_value !== undefined && alert.threshold_value !== undefined) && (
                          <div className="flex items-center gap-3 text-[10px] mb-2">
                            <span className="text-slate-500">Current: 
                              <span className={`font-mono ml-1 ${config.color} font-semibold`}>
                                {alert.current_value}
                              </span>
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-500">Threshold: 
                              <span className="font-mono text-slate-400 ml-1">
                                {alert.threshold_value}
                              </span>
                            </span>
                          </div>
                        )}

                        {alert.auto_action_taken && (
                          <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20 mb-2">
                            <p className="text-[10px] text-cyan-300">
                              Auto Action: {alert.auto_action_taken}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-slate-600">
                            {format(new Date(alert.created_date), 'MMM d, yyyy HH:mm:ss')}
                          </p>
                          {alert.is_resolved && alert.resolved_at && (
                            <p className="text-[10px] text-emerald-500">
                              Resolved: {format(new Date(alert.resolved_at), 'HH:mm:ss')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}