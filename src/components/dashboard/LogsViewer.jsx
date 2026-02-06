import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Terminal, TrendingUp, TrendingDown, Minus, Activity, Settings, RotateCcw, Save, Download } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const actionIcons = {
  benchmark: Activity,
  optimize: TrendingUp,
  apply_settings: Settings,
  reset: RotateCcw,
  profile_save: Save,
  profile_load: Download
};

const actionColors = {
  benchmark: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  optimize: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  apply_settings: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  reset: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  profile_save: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  profile_load: "bg-amber-500/20 text-amber-400 border-amber-500/30"
};

export default function LogsViewer({ logs }) {
  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl h-full">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
            <Terminal className="w-4 h-4 text-purple-400" />
          </div>
          <CardTitle className="text-base text-white">Optimization Logs</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-2">
            <AnimatePresence initial={false}>
              {logs.length === 0 ? (
                <div className="text-center py-8">
                  <Terminal className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No optimization logs yet</p>
                  <p className="text-xs text-slate-600 mt-1">Run a benchmark or optimization to see logs</p>
                </div>
              ) : (
                logs.map((log, index) => {
                  const Icon = actionIcons[log.action] || Activity;
                  const improvement = log.improvement_percent || 0;
                  
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-lg ${actionColors[log.action]} border shrink-0`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-medium text-white truncate">
                              {log.gpu_name || log.gpu_id}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0">
                              {format(new Date(log.created_date), 'HH:mm:ss')}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-400 mb-2">{log.message}</p>
                          
                          {(log.before_efficiency !== undefined && log.after_efficiency !== undefined) && (
                            <div className="flex items-center gap-3 text-[10px]">
                              <span className="text-slate-500">
                                {(log.before_efficiency || 0).toFixed(3)} → {(log.after_efficiency || 0).toFixed(3)} MH/W
                              </span>
                              {improvement !== 0 && (
                                <Badge className={`text-[10px] px-1.5 py-0 ${
                                  improvement > 0 
                                    ? 'bg-emerald-500/20 text-emerald-400' 
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {improvement > 0 ? (
                                    <TrendingUp className="w-2.5 h-2.5 mr-1" />
                                  ) : (
                                    <TrendingDown className="w-2.5 h-2.5 mr-1" />
                                  )}
                                  {improvement > 0 ? '+' : ''}{(improvement || 0).toFixed(1)}%
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
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