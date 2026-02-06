import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Zap, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function PredictiveCoinSwitch({ predictions, gpus, onGeneratePrediction, onApplySwitch, isGenerating }) {
  const latestPredictions = predictions.slice(0, 5);

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 60) return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-base text-white">AI Coin Switch Predictions</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Offline predictive intelligence</p>
            </div>
          </div>
          
          <Button
            onClick={onGeneratePrediction}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white h-8"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-3.5 h-3.5 mr-2" />
                Generate Predictions
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {latestPredictions.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-2">No predictions yet</p>
            <p className="text-xs text-slate-600">Generate AI predictions to find the most profitable coin</p>
          </div>
        ) : (
          <div className="space-y-3">
            {latestPredictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{prediction.gpu_name}</span>
                      {prediction.is_applied && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                          Applied
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{prediction.gpu_id}</p>
                  </div>
                  
                  <Badge className={`${getConfidenceColor(prediction.confidence_score)} border text-xs`}>
                    {(prediction.confidence_score || 0).toFixed(0)}% confidence
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Recommended Coin</p>
                    <p className="text-lg font-bold text-purple-400">{prediction.predicted_coin}</p>
                    <p className="text-[10px] text-slate-600">{prediction.predicted_algorithm.toUpperCase()}</p>
                  </div>
                  
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Predicted Profit</p>
                    <p className="text-lg font-bold text-emerald-400">${((prediction.predicted_profit_24h || 0)).toFixed(2)}</p>
                    <p className="text-[10px] text-slate-600">per 24h</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 p-2 rounded bg-slate-900/50">
                  <div>
                    <p className="text-[10px] text-slate-500">Core</p>
                    <p className="text-xs font-mono text-white">{prediction.recommended_settings?.core_clock || 0}MHz</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Memory</p>
                    <p className="text-xs font-mono text-white">{prediction.recommended_settings?.memory_clock || 0}MHz</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Power</p>
                    <p className="text-xs font-mono text-white">{prediction.recommended_settings?.power_limit || 0}%</p>
                  </div>
                </div>

                {prediction.factors_analyzed && (
                  <div className="mb-3 p-2 rounded bg-slate-800/30">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">AI Analysis Factors</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(prediction.factors_analyzed).slice(0, 4).map(([key, value]) => (
                        <Badge key={key} className="bg-slate-700/50 text-slate-400 border-0 text-[9px]">
                          {key}: {typeof value === 'number' ? (value || 0).toFixed(1) : value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {!prediction.is_applied && (
                  <Button
                    onClick={() => onApplySwitch(prediction)}
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                  >
                    <Zap className="w-3.5 h-3.5 mr-2" />
                    Apply This Prediction
                  </Button>
                )}

                {prediction.prediction_accuracy !== undefined && (
                  <div className="mt-3 pt-3 border-t border-slate-700/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Actual vs Predicted:</span>
                      <Badge className={prediction.prediction_accuracy >= 90 ? 
                        'bg-emerald-500/20 text-emerald-400' : 
                        'bg-amber-500/20 text-amber-400'
                      }>
                        {(prediction.prediction_accuracy || 0).toFixed(1)}% accurate
                      </Badge>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}