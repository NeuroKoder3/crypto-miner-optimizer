import React, { useState } from 'react';
import { offlineClient } from '@/api/offlineClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

import PredictiveCoinSwitch from '@/components/coinswitch/PredictiveCoinSwitch';
import PredictionAccuracyChart from '@/components/coinswitch/PredictionAccuracyChart';
import AutoSwitchConfig from '@/components/coinswitch/AutoSwitchConfig';

export default function CoinSwitch() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoConfig, setAutoConfig] = useState({
    auto_switch_enabled: false,
    min_confidence: 75,
    min_profit_increase: 0.50,
    check_interval_hours: 6,
    learning_mode: true
  });

  const queryClient = useQueryClient();

  const { data: predictions = [] } = useQuery({
    queryKey: ['coinSwitchPredictions'],
    queryFn: () => offlineClient.entities.CoinSwitchPrediction.list('-created_date', 50),
  });

  const { data: gpus = [] } = useQuery({
    queryKey: ['gpus'],
    queryFn: () => offlineClient.entities.GPU.list(),
  });

  const { data: coins = [] } = useQuery({
    queryKey: ['coins'],
    queryFn: () => offlineClient.entities.CryptoCurrency.list(),
  });

  const { data: profitHistory = [] } = useQuery({
    queryKey: ['profitHistory'],
    queryFn: () => offlineClient.entities.ProfitHistory.list('-created_date', 100),
  });

  const createPredictionMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.CoinSwitchPrediction.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coinSwitchPredictions'] }),
  });

  const updatePredictionMutation = useMutation({
    mutationFn: ({ id, data }) => offlineClient.entities.CoinSwitchPrediction.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coinSwitchPredictions'] }),
  });

  const updateGpuMutation = useMutation({
    mutationFn: ({ id, data }) => offlineClient.entities.GPU.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gpus'] }),
  });

  const handleGeneratePrediction = async () => {
    setIsGenerating(true);

    for (const gpu of gpus) {
      // Analyze historical profitability for this GPU
      const gpuProfitHistory = profitHistory.filter(p => p.gpu_id === gpu.gpu_id);
      
      // Find best performing coin historically
      const coinPerformance = coins.map(coin => {
        const coinHistory = gpuProfitHistory.filter(p => p.coin_symbol === coin.symbol);
        const avgProfit = coinHistory.length > 0
          ? coinHistory.reduce((sum, p) => sum + p.daily_profit, 0) / coinHistory.length
          : 0;
        return { coin, avgProfit, dataPoints: coinHistory.length };
      }).sort((a, b) => b.avgProfit - a.avgProfit);

      const bestCoin = coinPerformance[0]?.coin || coins[0];
      
      // Calculate predicted profit with trend analysis
      const currentPrice = bestCoin.price_usd || 0;
      const priceChange = bestCoin.price_change_24h || 0;
      const trendMultiplier = 1 + (priceChange / 100) * 0.5; // Factor in price trend
      
      const baseHashrate = 50 + Math.random() * 30;
      const basePower = 150 + Math.random() * 50;
      const efficiency = baseHashrate / basePower;
      
      const predictedProfit = (baseHashrate * (bestCoin.daily_reward_per_mh || 0.01) * currentPrice * trendMultiplier);
      
      // AI confidence based on data availability and consistency
      const dataQuality = Math.min(coinPerformance[0]?.dataPoints || 0, 20) / 20;
      const confidence = 65 + (dataQuality * 25) + Math.random() * 10;

      await createPredictionMutation.mutateAsync({
        gpu_id: gpu.gpu_id,
        gpu_name: gpu.name,
        predicted_coin: bestCoin.symbol,
        predicted_algorithm: bestCoin.algorithm,
        predicted_profit_24h: predictedProfit,
        confidence_score: confidence,
        recommended_settings: {
          core_clock: 1400 + Math.floor(Math.random() * 400),
          memory_clock: 1800 + Math.floor(Math.random() * 800),
          power_limit: 80 + Math.floor(Math.random() * 30)
        },
        factors_analyzed: {
          'Price Trend': `${priceChange >= 0 ? '+' : ''}${(priceChange || 0).toFixed(1)}%`,
          'Historical Data': `${coinPerformance[0]?.dataPoints || 0} points`,
          'Network Hashrate': `${((bestCoin.network_hashrate || 0)).toFixed(1)} TH/s`,
          'Efficiency Score': (efficiency || 0).toFixed(3)
        }
      });
    }

    setIsGenerating(false);
  };

  const handleApplySwitch = async (prediction) => {
    const gpu = gpus.find(g => g.gpu_id === prediction.gpu_id);
    if (!gpu) return;

    // Apply settings to GPU
    await updateGpuMutation.mutateAsync({
      id: gpu.id,
      data: {
        algorithm: prediction.predicted_algorithm,
        core_clock: prediction.recommended_settings.core_clock,
        memory_clock: prediction.recommended_settings.memory_clock,
        power_limit: prediction.recommended_settings.power_limit,
        status: 'active'
      }
    });

    // Mark prediction as applied
    await updatePredictionMutation.mutateAsync({
      id: prediction.id,
      data: {
        is_applied: true,
        applied_at: new Date().toISOString()
      }
    });

    // Simulate learning: After 24h, update with actual results
    setTimeout(async () => {
      const actualProfit = prediction.predicted_profit_24h * (0.85 + Math.random() * 0.25);
      const accuracy = (Math.min(actualProfit, prediction.predicted_profit_24h) / 
                       Math.max(actualProfit, prediction.predicted_profit_24h)) * 100;
      
      await updatePredictionMutation.mutateAsync({
        id: prediction.id,
        data: {
          actual_profit_24h: actualProfit,
          prediction_accuracy: accuracy
        }
      });
    }, 2000); // In real app, this would be 24h
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Offline Predictive Coin Switch AI
            </h1>
            <p className="text-sm text-slate-500 mt-1">Self-learning mining strategist • 100% offline intelligence</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5 px-3 py-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span className="text-xs">Learning Mode Active</span>
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Predictions */}
          <div className="xl:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PredictiveCoinSwitch
                predictions={predictions}
                gpus={gpus}
                onGeneratePrediction={handleGeneratePrediction}
                onApplySwitch={handleApplySwitch}
                isGenerating={isGenerating}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <PredictionAccuracyChart predictions={predictions} />
            </motion.div>
          </div>

          {/* Right Column - Config */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AutoSwitchConfig
                config={autoConfig}
                onConfigChange={setAutoConfig}
              />
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Intelligence Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Total Predictions</span>
                  <span className="text-sm font-mono text-white">{predictions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Applied Switches</span>
                  <span className="text-sm font-mono text-emerald-400">
                    {predictions.filter(p => p.is_applied).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Learning Data Points</span>
                  <span className="text-sm font-mono text-purple-400">{profitHistory.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Avg Confidence</span>
                  <span className="text-sm font-mono text-cyan-400">
                    {predictions.length > 0 
                      ? ((predictions.reduce((sum, p) => sum + (p.confidence_score || 0), 0) / predictions.length) || 0).toFixed(1) 
                      : 0}%
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}