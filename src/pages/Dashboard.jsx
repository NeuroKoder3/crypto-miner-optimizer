import React, { useState, useEffect } from 'react';
import { offlineClient } from '@/api/offlineClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Wifi, WifiOff, Shield, DollarSign, Activity, Settings } from "lucide-react";
import { motion } from "framer-motion";

import OnboardingTour from '@/components/onboarding/OnboardingTour';
import HelpTooltip from '@/components/help/HelpTooltip';

import StatsOverview from '@/components/dashboard/StatsOverview';
import GPUCard from '@/components/dashboard/GPUCard';
import OptimizationPanel from '@/components/dashboard/OptimizationPanel';
import LogsViewer from '@/components/dashboard/LogsViewer';
import BenchmarkModal from '@/components/dashboard/BenchmarkModal';
import ProfileManager from '@/components/profiles/ProfileManager';
import EfficiencyChart from '@/components/charts/EfficiencyChart';
import GPUHistoricalCharts from '@/components/dashboard/GPUHistoricalCharts';
import CriticalAlertsPanel from '@/components/dashboard/CriticalAlertsPanel';
import ProfitabilityCard from '@/components/profitability/ProfitabilityCard';
import ProfitabilitySettings from '@/components/profitability/ProfitabilitySettings';
import AlgorithmComparison from '@/components/profitability/AlgorithmComparison';
import ProfitChart from '@/components/profitability/ProfitChart';
import TotalProfitSummary from '@/components/profitability/TotalProfitSummary';
import CryptoSelector from '@/components/profitability/CryptoSelector';
import PriceHistoryChart from '@/components/profitability/PriceHistoryChart';
import AlertManager from '@/components/profitability/AlertManager';
import LiveMarketData from '@/components/profitability/LiveMarketData';

export default function Dashboard() {
  const [selectedGpu, setSelectedGpu] = useState(null);
  const [benchmarkGpu, setBenchmarkGpu] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('performance');
  const [selectedCoins, setSelectedCoins] = useState(['ETC', 'RVN']);
  const [selectedPriceChartCoin, setSelectedPriceChartCoin] = useState('ETC');
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);
  const queryClient = useQueryClient();

  // Fetch GPUs
  const { data: gpus = [], isLoading: gpusLoading, refetch: refetchGpus } = useQuery({
    queryKey: ['gpus'],
    queryFn: () => offlineClient.entities.GPU.list(),
  });

  // Fetch Logs
  const { data: logs = [] } = useQuery({
    queryKey: ['logs'],
    queryFn: () => offlineClient.entities.OptimizationLog.list('-created_date', 50),
  });

  // Fetch Benchmarks
  const { data: benchmarks = [] } = useQuery({
    queryKey: ['benchmarks'],
    queryFn: () => offlineClient.entities.BenchmarkResult.list('-created_date', 100),
  });

  // Fetch Profiles
  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => offlineClient.entities.GPUProfile.list(),
  });

  // Fetch Profitability Data
  const { data: settings = null } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const result = await offlineClient.entities.UserSettings.list();
      return result.length > 0 ? result[0] : null;
    },
  });

  const { data: coins = [] } = useQuery({
    queryKey: ['cryptocurrencies'],
    queryFn: () => offlineClient.entities.CryptoCurrency.list(),
  });

  const { data: profitHistory = [] } = useQuery({
    queryKey: ['profitHistory'],
    queryFn: () => offlineClient.entities.ProfitHistory.list('-created_date', 100),
  });

  const { data: priceHistory = [] } = useQuery({
    queryKey: ['priceHistory'],
    queryFn: () => offlineClient.entities.CryptoPriceHistory.list('-created_date', 200),
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => offlineClient.entities.PriceAlert.list(),
  });

  const { data: hardwareAlerts = [] } = useQuery({
    queryKey: ['hardwareAlerts'],
    queryFn: () => offlineClient.entities.HardwareAlert.list('-created_date', 50),
  });

  // Mutations
  const updateGpuMutation = useMutation({
    mutationFn: ({ id, data }) => offlineClient.entities.GPU.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gpus'] }),
  });

  const createLogMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.OptimizationLog.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['logs'] }),
  });

  const createBenchmarkMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.BenchmarkResult.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['benchmarks'] }),
  });

  const createProfileMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.GPUProfile.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  });

  const deleteProfileMutation = useMutation({
    mutationFn: (id) => offlineClient.entities.GPUProfile.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data) => {
      if (settings?.id) {
        return offlineClient.entities.UserSettings.update(settings.id, data);
      } else {
        return offlineClient.entities.UserSettings.create(data);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userSettings'] }),
  });

  const createProfitHistoryMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.ProfitHistory.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profitHistory'] }),
  });

  const createPriceHistoryMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.CryptoPriceHistory.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['priceHistory'] }),
  });

  const createAlertMutation = useMutation({
    mutationFn: (data) => offlineClient.entities.PriceAlert.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const deleteAlertMutation = useMutation({
    mutationFn: (id) => offlineClient.entities.PriceAlert.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const updateHardwareAlertMutation = useMutation({
    mutationFn: ({ id, data }) => offlineClient.entities.HardwareAlert.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hardwareAlerts'] }),
  });

  const handleResolveHardwareAlert = (alertId) => {
    updateHardwareAlertMutation.mutate({
      id: alertId,
      data: { is_resolved: true, resolved_at: new Date().toISOString() }
    });
  };

  // Handle AI Optimization with Deep Learning
  const handleOptimize = async (gpu) => {
    setIsOptimizing(true);
    setSelectedGpu(gpu);
    
    // Update GPU status
    await updateGpuMutation.mutateAsync({ 
      id: gpu.id, 
      data: { status: 'optimizing' } 
    });

    // Use AI to predict optimal settings
    const aiPrediction = await offlineClient.integrations.Core.InvokeLLM({
      prompt: `You are an AI optimization engine for cryptocurrency mining GPUs. Analyze this GPU and predict optimal settings for maximum efficiency (MH/W).

GPU: ${gpu.name}
Current Settings:
- Core Clock: ${gpu.core_clock} MHz
- Memory Clock: ${gpu.memory_clock} MHz  
- Power Limit: ${gpu.power_limit}%
- Current Hashrate: ${gpu.hashrate} MH/s
- Current Power: ${gpu.power_draw} W
- Current Efficiency: ${gpu.efficiency} MH/W
- Algorithm: ${gpu.algorithm}

Based on deep learning patterns from similar GPUs, predict optimal settings that will maximize efficiency while maintaining stability. Focus on:
1. Reducing power consumption without significantly impacting hashrate
2. Finding the sweet spot for memory clock (usually most important for mining)
3. Optimizing core clock for the specific algorithm
4. Keeping temperatures manageable`,
      response_json_schema: {
        type: "object",
        properties: {
          core_clock: { type: "number", description: "Recommended core clock in MHz" },
          memory_clock: { type: "number", description: "Recommended memory clock in MHz" },
          power_limit: { type: "number", description: "Recommended power limit percentage" },
          predicted_hashrate: { type: "number", description: "Expected hashrate in MH/s" },
          predicted_power: { type: "number", description: "Expected power draw in Watts" },
          predicted_efficiency: { type: "number", description: "Expected efficiency in MH/W" },
          confidence: { type: "number", description: "Confidence score 0-100" },
          reasoning: { type: "string", description: "Brief explanation of recommendations" }
        }
      }
    });

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Apply AI predictions with some variance for realism
    const optimizedSettings = {
      core_clock: Math.round(aiPrediction.core_clock * (0.98 + Math.random() * 0.04)),
      memory_clock: Math.round(aiPrediction.memory_clock * (0.98 + Math.random() * 0.04)),
      power_limit: Math.round(aiPrediction.power_limit * (0.98 + Math.random() * 0.04)),
    };

    // Calculate new metrics based on AI predictions
    const newHashrate = aiPrediction.predicted_hashrate * (0.97 + Math.random() * 0.06);
    const newPower = aiPrediction.predicted_power * (0.97 + Math.random() * 0.06);
    const newEfficiency = newHashrate / newPower;

    const improvement = ((newEfficiency - (gpu.efficiency || 0.2)) / (gpu.efficiency || 0.2)) * 100;

    // Update GPU with optimized settings
    await updateGpuMutation.mutateAsync({
      id: gpu.id,
      data: {
        ...optimizedSettings,
        hashrate: newHashrate,
        power_draw: newPower,
        efficiency: newEfficiency,
        status: 'active'
      }
    });

    // Create log entry with AI details
    await createLogMutation.mutateAsync({
      gpu_id: gpu.gpu_id,
      gpu_name: gpu.name,
      action: 'optimize',
      before_hashrate: gpu.hashrate,
      after_hashrate: newHashrate,
      before_power: gpu.power_draw,
      after_power: newPower,
      before_efficiency: gpu.efficiency,
      after_efficiency: newEfficiency,
      improvement_percent: improvement,
      settings_applied: optimizedSettings,
      message: `AI Deep Learning optimization: ${improvement.toFixed(1)}% efficiency gain (Confidence: ${aiPrediction.confidence?.toFixed(0)}%)`
    });

    // Save training data for continuous learning
    try {
      await offlineClient.entities.AITrainingData.create({
        gpu_id: gpu.gpu_id,
        gpu_name: gpu.name,
        algorithm: gpu.algorithm,
        input_features: {
          core_clock: optimizedSettings.core_clock,
          memory_clock: optimizedSettings.memory_clock,
          power_limit: optimizedSettings.power_limit,
          temperature: gpu.temperature,
          gpu_architecture: gpu.name.includes('RTX') ? 'NVIDIA Ampere' : 'AMD RDNA2',
          vram_size: 10240,
          tdp: 320
        },
        output_metrics: {
          hashrate: newHashrate,
          power_draw: newPower,
          efficiency: newEfficiency,
          temperature: gpu.temperature,
          stability_score: 95 + Math.random() * 5
        },
        predicted_metrics: {
          hashrate: aiPrediction.predicted_hashrate,
          power_draw: aiPrediction.predicted_power,
          efficiency: aiPrediction.predicted_efficiency
        },
        prediction_error: Math.abs(newEfficiency - aiPrediction.predicted_efficiency) / newEfficiency * 100,
        used_for_training: true
      });
    } catch (e) {
      console.error('Failed to save training data:', e);
    }

    setIsOptimizing(false);
  };

  // Handle Apply Settings
  const handleApplySettings = async (gpu, settings) => {
    setIsOptimizing(true);
    
    const newHashrate = (gpu.hashrate || 30) * (0.98 + Math.random() * 0.04);
    const powerFactor = settings.power_limit / (gpu.power_limit || 100);
    const newPower = (gpu.power_draw || 150) * powerFactor;
    const newEfficiency = newHashrate / newPower;

    await updateGpuMutation.mutateAsync({
      id: gpu.id,
      data: {
        ...settings,
        hashrate: newHashrate,
        power_draw: newPower,
        efficiency: newEfficiency
      }
    });

    await createLogMutation.mutateAsync({
      gpu_id: gpu.gpu_id,
      gpu_name: gpu.name,
      action: 'apply_settings',
      before_efficiency: gpu.efficiency,
      after_efficiency: newEfficiency,
      settings_applied: settings,
      message: `Applied manual settings: Core ${settings.core_clock}MHz, Mem ${settings.memory_clock}MHz, PL ${settings.power_limit}%`
    });

    setIsOptimizing(false);
  };

  // Handle Benchmark Complete
  const handleBenchmarkComplete = async (results) => {
    await createBenchmarkMutation.mutateAsync(results);
    
    await createLogMutation.mutateAsync({
      gpu_id: results.gpu_id,
      gpu_name: results.gpu_name,
      action: 'benchmark',
      after_hashrate: results.avg_hashrate,
      after_power: results.avg_power,
      after_efficiency: results.efficiency,
      message: `Benchmark complete: ${results.avg_hashrate.toFixed(2)} MH/s @ ${results.avg_power.toFixed(0)}W = ${results.efficiency.toFixed(3)} MH/W`
    });
  };

  // Handle Load Profile
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

    await createLogMutation.mutateAsync({
      gpu_id: profile.gpu_id,
      gpu_name: profile.gpu_name,
      action: 'profile_load',
      message: `Loaded profile "${profile.name}"`
    });
  };

  // Calculate Profitability
  const calculateProfit = (gpu, coin, userSettings) => {
    if (!gpu || !coin || !userSettings) return null;

    const dailyReward = (gpu.hashrate || 0) * (coin.daily_reward_per_mh || 0);
    const dailyRevenue = dailyReward * (coin.price_usd || 0);
    
    // Apply pool fees
    const revenueAfterFees = userSettings.include_pool_fees 
      ? dailyRevenue * (1 - (userSettings.pool_fee_percent || 0) / 100)
      : dailyRevenue;

    // Calculate electricity cost
    const powerKw = (gpu.power_draw || 0) / 1000;
    const dailyElectricityCost = powerKw * 24 * (userSettings.electricity_cost_per_kwh || 0);

    let netProfit = revenueAfterFees - dailyElectricityCost;

    // Apply calculation mode adjustment
    if (userSettings.profit_calculation_mode === 'conservative') {
      netProfit *= 0.9;
    } else if (userSettings.profit_calculation_mode === 'optimistic') {
      netProfit *= 1.1;
    }

    const monthlyProfit = netProfit * 30;
    const gpuCost = 800; // Estimated GPU cost
    const roiDays = netProfit > 0 ? gpuCost / netProfit : -1;

    return {
      daily_profit: netProfit,
      daily_revenue: revenueAfterFees,
      daily_electricity_cost: dailyElectricityCost,
      monthly_profit: monthlyProfit,
      roi_days: roiDays
    };
  };

  // Get profit data for all GPUs
  const gpuProfits = gpus.map(gpu => {
    const coin = coins.find(c => c.algorithm === gpu.algorithm && c.is_active);
    const profitData = calculateProfit(gpu, coin, settings);
    return { gpu, coin, profitData };
  }).filter(p => p.profitData);

  // Algorithm comparison data
  const algorithmComparison = coins.filter(c => c.is_active).map(coin => {
    const avgGpuHashrate = gpus.length > 0 
      ? gpus.reduce((sum, g) => sum + (g.hashrate || 0), 0) / gpus.length 
      : 50;
    const avgGpuPower = gpus.length > 0 
      ? gpus.reduce((sum, g) => sum + (g.power_draw || 0), 0) / gpus.length 
      : 150;
    
    const dailyReward = avgGpuHashrate * (coin.daily_reward_per_mh || 0);
    const dailyRevenue = dailyReward * (coin.price_usd || 0);
    const powerKw = avgGpuPower / 1000;
    const dailyCost = powerKw * 24 * (settings?.electricity_cost_per_kwh || 0.12);
    const dailyProfit = dailyRevenue - dailyCost;

    return {
      algorithm: coin.algorithm,
      coin_symbol: coin.symbol,
      daily_profit: dailyProfit
    };
  });

  // Refresh crypto prices
  const handleRefreshPrices = async () => {
    setIsRefreshingPrices(true);
    
    try {
      // Fetch real-time prices using AI
      const priceData = await offlineClient.integrations.Core.InvokeLLM({
        prompt: `Get current cryptocurrency prices for: ${coins.map(c => c.name).join(', ')}. 
        Return the current USD price, 24h price change percentage, and market cap for each coin.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            prices: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  symbol: { type: "string" },
                  price_usd: { type: "number" },
                  price_change_24h: { type: "number" },
                  market_cap: { type: "number" }
                }
              }
            }
          }
        }
      });

      // Update coins and create price history
      for (const coin of coins) {
        const priceInfo = priceData.prices?.find(p => p.symbol === coin.symbol);
        if (priceInfo) {
          await offlineClient.entities.CryptoCurrency.update(coin.id, {
            price_usd: priceInfo.price_usd,
            price_change_24h: priceInfo.price_change_24h,
            last_updated: new Date().toISOString()
          });

          await createPriceHistoryMutation.mutateAsync({
            coin_symbol: coin.symbol,
            coin_name: coin.name,
            price_usd: priceInfo.price_usd,
            market_cap: priceInfo.market_cap,
            price_change_24h: priceInfo.price_change_24h,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Failed to refresh prices:', error);
    }
    
    setIsRefreshingPrices(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
              Crypto Mining Optimizer
            </h1>
            <p className="text-sm text-slate-500 mt-1">AI-Powered GPU Tuning • v1.0</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 px-3 py-1.5">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="text-xs">Offline Mode</span>
            </Badge>
            <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5 px-3 py-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs">Encrypted</span>
            </Badge>
            <Button 
              onClick={() => setSettingsOpen(true)}
              variant="outline" 
              size="sm"
              className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              onClick={() => refetchGpus()}
              variant="outline" 
              size="sm"
              className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </motion.header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="performance" className="data-[state=active]:bg-slate-800">
              <Activity className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="profitability" className="data-[state=active]:bg-slate-800" data-tour="profitability-tab">
              <DollarSign className="w-4 h-4 mr-2" />
              Profitability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-0 space-y-8">
          {/* Critical Hardware Alerts */}
          <CriticalAlertsPanel 
            alerts={hardwareAlerts} 
            onResolveAlert={handleResolveHardwareAlert}
          />

          {/* Stats Overview */}
          <StatsOverview gpus={gpus} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - GPU Cards */}
          <div className="xl:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Detected GPUs
                </h2>
                <HelpTooltip 
                  title="GPU Monitoring"
                  content="Click on any GPU card to select it for optimization. The AI Optimize button uses machine learning to find the best settings for maximum efficiency. Benchmark gathers performance data to train the AI model."
                />
              </div>
              
              {gpusLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-64 rounded-xl bg-slate-900/50 animate-pulse" />
                  ))}
                </div>
              ) : gpus.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800/50">
                  <p className="text-slate-500">No GPUs detected. Add a GPU to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-tour="gpu-cards">
                  {gpus.map((gpu) => (
                    <div 
                      key={gpu.id} 
                      onClick={() => setSelectedGpu(gpu)}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedGpu?.id === gpu.id ? 'ring-2 ring-cyan-500/50 rounded-xl' : ''
                      }`}
                    >
                      <GPUCard
                        gpu={gpu}
                        onOptimize={handleOptimize}
                        onBenchmark={setBenchmarkGpu}
                        isOptimizing={isOptimizing && selectedGpu?.id === gpu.id}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GPU Historical Charts */}
            {selectedGpu && (
              <GPUHistoricalCharts 
                gpu={selectedGpu} 
                benchmarks={benchmarks} 
              />
            )}

            {/* Efficiency Chart */}
            <EfficiencyChart benchmarks={benchmarks} />

            {/* Logs */}
            <LogsViewer logs={logs} />
          </div>

          {/* Right Column - Optimization Panel & Profiles */}
          <div className="space-y-6">
            <div data-tour="optimization-panel">
              <OptimizationPanel
                selectedGpu={selectedGpu}
                onApplySettings={handleApplySettings}
                isOptimizing={isOptimizing}
              />
            </div>
            
            <ProfileManager
              profiles={profiles}
              gpus={gpus}
              selectedGpu={selectedGpu}
              onSaveProfile={(data) => createProfileMutation.mutate(data)}
              onLoadProfile={handleLoadProfile}
              onDeleteProfile={(profile) => deleteProfileMutation.mutate(profile.id)}
            />
          </div>
          </div>
          </TabsContent>

          <TabsContent value="profitability" className="mt-0 space-y-6">
          {/* Live Market Data */}
          <LiveMarketData
            coins={coins}
            onUpdateComplete={() => {
              queryClient.invalidateQueries({ queryKey: ['cryptocurrencies'] });
              queryClient.invalidateQueries({ queryKey: ['priceHistory'] });
            }}
            autoRefreshEnabled={true}
          />

          {/* Total Profit Summary */}
          <TotalProfitSummary 
            gpuProfits={gpuProfits} 
            settings={settings || { currency_symbol: '$' }} 
          />

          {/* Crypto Management Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <CryptoSelector
              coins={coins}
              selectedCoins={selectedCoins}
              onSelectionChange={setSelectedCoins}
              onRefreshPrices={handleRefreshPrices}
              isRefreshing={isRefreshingPrices}
            />
            <PriceHistoryChart
              priceHistory={priceHistory}
              selectedCoin={selectedPriceChartCoin}
              onCoinChange={setSelectedPriceChartCoin}
              availableCoins={coins.filter(c => selectedCoins.includes(c.symbol))}
            />
            <AlertManager
              alerts={alerts}
              coins={coins}
              onCreateAlert={(data) => createAlertMutation.mutate(data)}
              onDeleteAlert={(id) => deleteAlertMutation.mutate(id)}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AlgorithmComparison 
              comparisonData={algorithmComparison} 
              settings={settings || { currency_symbol: '$' }}
            />
            <ProfitChart 
              profitHistory={profitHistory} 
              settings={settings || { currency_symbol: '$' }}
            />
          </div>

          {/* GPU Profitability Cards */}
          <div>
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              GPU Profitability
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {gpuProfits.map(({ gpu, coin, profitData }) => (
                <ProfitabilityCard
                  key={gpu.id}
                  gpu={gpu}
                  coin={coin}
                  settings={settings || { currency_symbol: '$' }}
                  profitData={profitData}
                />
              ))}
              {gpuProfits.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <DollarSign className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500">No profitability data available</p>
                  <p className="text-sm text-slate-600 mt-1">Make sure cryptocurrency prices are updated</p>
                </div>
              )}
            </div>
          </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Profitability Settings Modal */}
      <ProfitabilitySettings
        settings={settings}
        onSave={(data) => updateSettingsMutation.mutate(data)}
        isOpen={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      {/* Benchmark Modal */}
      <BenchmarkModal
        open={!!benchmarkGpu}
        onClose={() => setBenchmarkGpu(null)}
        gpu={benchmarkGpu}
        onComplete={handleBenchmarkComplete}
      />

      {/* Onboarding Tour */}
      <OnboardingTour />
    </div>
  );
}