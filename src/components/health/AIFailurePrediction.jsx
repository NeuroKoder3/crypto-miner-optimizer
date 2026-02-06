import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, TrendingUp, Shield, RefreshCw, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function AIFailurePrediction({ 
  gpu, 
  trainingData, 
  alerts,
  onApplyRecommendation,
  onTrainModel 
}) {
  // Simulate AI prediction based on historical data
  const predictFailure = () => {
    if (!gpu || !trainingData || trainingData.length === 0) {
      return null;
    }

    // Calculate risk factors
    const tempRisk = gpu.temperature > 75 ? (gpu.temperature - 75) * 2 : 0;
    const fanRisk = gpu.fan_speed > 90 ? (gpu.fan_speed - 90) * 3 : 0;
    const powerRisk = gpu.power_draw > 300 ? (gpu.power_draw - 300) / 5 : 0;
    
    // Recent alert patterns
    const recentAlerts = alerts.filter(a => 
      a.gpu_id === gpu.gpu_id && 
      !a.is_resolved &&
      new Date(a.created_date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    const alertRisk = recentAlerts.length * 10;

    // Training data accuracy
    const avgAccuracy = trainingData.length > 0
      ? trainingData.reduce((sum, d) => sum + (100 - (d.prediction_error || 0)), 0) / trainingData.length
      : 85;

    const totalRisk = Math.min(100, tempRisk + fanRisk + powerRisk + alertRisk);
    const confidence = Math.min(95, avgAccuracy + (trainingData.length / 10));

    let prediction = {
      risk_score: totalRisk,
      confidence: confidence,
      time_to_failure: null,
      failure_type: null,
      recommendations: []
    };

    if (totalRisk > 60) {
      prediction.failure_type = 'thermal_failure';
      prediction.time_to_failure = totalRisk > 80 ? '2-6 hours' : '12-24 hours';
      prediction.recommendations.push({
        type: 'safe_mode',
        title: 'Enable Safe Mode',
        description: 'Reduce clocks and power to prevent thermal damage',
        action: 'safe_mode',
        priority: 'critical'
      });
    }

    if (gpu.fan_speed > 90) {
      prediction.failure_type = 'fan_failure';
      prediction.time_to_failure = '6-12 hours';
      prediction.recommendations.push({
        type: 'restart',
        title: 'Restart GPU',
        description: 'Fan controller may need reset',
        action: 'restart',
        priority: 'high'
      });
    }

    if (recentAlerts.length > 3) {
      prediction.recommendations.push({
        type: 'profile',
        title: 'Apply Conservative Profile',
        description: 'Switch to a stable, tested configuration',
        action: 'apply_profile',
        profile_name: 'Conservative',
        priority: 'medium'
      });
    }

    return prediction;
  };

  const prediction = predictFailure();

  if (!prediction || prediction.risk_score < 30) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
        <CardContent className="p-8 text-center">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/10 mb-3">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-sm font-medium text-white mb-1">System Healthy</h3>
          <p className="text-xs text-slate-500">AI predicts no immediate failures</p>
          <Button 
            onClick={onTrainModel} 
            variant="outline" 
            size="sm" 
            className="mt-4 bg-transparent border-slate-700 hover:bg-slate-800"
          >
            <Brain className="w-3 h-3 mr-2" />
            Train Model
          </Button>
        </CardContent>
      </Card>
    );
  }

  const riskColor = 
    prediction.risk_score >= 80 ? 'red' :
    prediction.risk_score >= 60 ? 'orange' :
    'yellow';

  const riskBgColor = 
    prediction.risk_score >= 80 ? 'bg-red-500/10' :
    prediction.risk_score >= 60 ? 'bg-orange-500/10' :
    'bg-yellow-500/10';

  const riskBorderColor = 
    prediction.risk_score >= 80 ? 'border-red-500/30' :
    prediction.risk_score >= 60 ? 'border-orange-500/30' :
    'border-yellow-500/30';

  const riskTextColor = 
    prediction.risk_score >= 80 ? 'text-red-400' :
    prediction.risk_score >= 60 ? 'text-orange-400' :
    'text-yellow-400';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className={`${riskBgColor} border-2 ${riskBorderColor} backdrop-blur-xl`}>
        <CardHeader className={`border-b ${riskBorderColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${riskBgColor} ${riskBorderColor} border animate-pulse`}>
                <Brain className={`w-4 h-4 ${riskTextColor}`} />
              </div>
              <div>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  AI Failure Prediction
                  <Badge className={`${riskBgColor} ${riskTextColor} border ${riskBorderColor} text-xs animate-pulse`}>
                    {prediction.risk_score}% Risk
                  </Badge>
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">{gpu.name}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-5">
          {/* Risk Assessment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Failure Risk</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-mono font-bold ${riskTextColor}`}>
                  {prediction.risk_score}%
                </span>
                <AlertTriangle className={`w-4 h-4 ${riskTextColor} animate-pulse`} />
              </div>
            </div>
            <Progress 
              value={prediction.risk_score} 
              className={`h-2.5 ${
                prediction.risk_score >= 80 ? '[&>div]:bg-red-500' :
                prediction.risk_score >= 60 ? '[&>div]:bg-orange-500' :
                '[&>div]:bg-yellow-500'
              }`}
            />
          </div>

          {/* AI Confidence */}
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">AI Confidence</span>
              <span className="text-sm font-mono text-cyan-400">{prediction.confidence.toFixed(0)}%</span>
            </div>
            <Progress value={prediction.confidence} className="h-1.5 [&>div]:bg-cyan-500" />
          </div>

          {/* Predicted Failure Details */}
          {prediction.failure_type && (
            <div className={`p-4 rounded-lg ${riskBgColor} border ${riskBorderColor}`}>
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className={`w-5 h-5 ${riskTextColor} mt-0.5`} />
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    {prediction.failure_type.replace(/_/g, ' ').toUpperCase()}
                  </h4>
                  {prediction.time_to_failure && (
                    <p className={`text-xs ${riskTextColor}`}>
                      Estimated time to failure: {prediction.time_to_failure}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {prediction.recommendations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                AI Recommendations
              </h4>

              {prediction.recommendations.map((rec, idx) => {
                const priorityColors = {
                  critical: 'border-red-500/30 bg-red-500/10',
                  high: 'border-orange-500/30 bg-orange-500/10',
                  medium: 'border-yellow-500/30 bg-yellow-500/10'
                };

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-3 rounded-lg border ${priorityColors[rec.priority]}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h5 className="text-sm font-medium text-white mb-1">{rec.title}</h5>
                        <p className="text-xs text-slate-300">{rec.description}</p>
                      </div>
                      <Badge className="text-[10px] shrink-0">
                        {rec.priority}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => onApplyRecommendation(gpu, rec)}
                      size="sm"
                      className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                    >
                      {rec.action === 'safe_mode' && <Shield className="w-3 h-3 mr-2" />}
                      {rec.action === 'restart' && <RefreshCw className="w-3 h-3 mr-2" />}
                      {rec.action === 'apply_profile' && <Zap className="w-3 h-3 mr-2" />}
                      Apply Action
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Training Stats */}
          <div className="pt-3 border-t border-slate-800/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Model trained on {trainingData.length} samples
              </span>
              <Button 
                onClick={onTrainModel} 
                variant="ghost" 
                size="sm"
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                <Brain className="w-3 h-3 mr-1" />
                Retrain
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}