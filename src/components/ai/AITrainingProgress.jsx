import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Database, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AITrainingProgress({ open, onClose, stage, progress, currentEpoch, totalEpochs, accuracy, loss }) {
  const stages = [
    { id: 'preparing', label: 'Preparing Data', icon: Database },
    { id: 'training', label: 'Training Model', icon: Brain },
    { id: 'validating', label: 'Validating', icon: Zap },
    { id: 'complete', label: 'Complete', icon: CheckCircle2 }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === stage);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
              <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            AI Model Training
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stage Progress */}
          <div className="space-y-3">
            {stages.map((stageItem, index) => {
              const isActive = index === currentStageIndex;
              const isComplete = index < currentStageIndex;
              const Icon = stageItem.icon;

              return (
                <motion.div
                  key={stageItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isActive 
                      ? 'bg-purple-500/10 border-purple-500/30' 
                      : isComplete
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-slate-800/30 border-slate-700/30'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-purple-500/20' 
                      : isComplete
                      ? 'bg-emerald-500/20'
                      : 'bg-slate-700/30'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      isActive 
                        ? 'text-purple-400' 
                        : isComplete
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    } ${isActive ? 'animate-pulse' : ''}`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive || isComplete ? 'text-white' : 'text-slate-500'
                  }`}>
                    {stageItem.label}
                  </span>
                  {isComplete && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Overall Progress */}
          {stage !== 'complete' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Overall Progress</span>
                <span className="text-white font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-2" />
                <div 
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Training Details */}
          {stage === 'training' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className="text-[10px] text-slate-500 uppercase mb-1">Epoch</p>
                <p className="text-lg font-mono text-white">
                  {currentEpoch}/{totalEpochs}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className="text-[10px] text-slate-500 uppercase mb-1">Accuracy</p>
                <p className="text-lg font-mono text-emerald-400">
                  {accuracy.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 col-span-2">
                <p className="text-[10px] text-slate-500 uppercase mb-1">Loss</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-mono text-amber-400">
                    {loss.toFixed(4)}
                  </p>
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all"
                      style={{ width: `${Math.min(loss * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Complete State */}
          {stage === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Training Complete!</h3>
              <p className="text-sm text-slate-400 mb-4">
                Model updated successfully with improved accuracy
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1.5">
                  Accuracy: {accuracy.toFixed(1)}%
                </Badge>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 px-3 py-1.5">
                  Loss: {loss.toFixed(4)}
                </Badge>
              </div>
            </motion.div>
          )}

          {/* Info */}
          {stage !== 'complete' && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-400">
                💡 The AI model is learning from historical benchmark data to predict optimal settings more accurately
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}