import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { offlineClient } from '@/api/offlineClient';

export default function LiveMarketData({ 
  coins, 
  onUpdateComplete,
  autoRefreshEnabled = false,
  refreshInterval = 300000 // 5 minutes
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(autoRefreshEnabled);
  const [liveData, setLiveData] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(null);

  const fetchLiveMarketData = async () => {
    setIsUpdating(true);
    setUpdateStatus('Fetching live market data...');

    try {
      // Fetch real-time prices using AI with internet context
      const response = await offlineClient.integrations.Core.InvokeLLM({
        prompt: `Get the current real-time cryptocurrency market data for the following coins: ${coins.map(c => `${c.name} (${c.symbol})`).join(', ')}.

For each coin, provide:
- Current USD price (accurate to 2 decimals)
- 24-hour price change percentage
- Market cap in USD
- 24-hour trading volume

Return the data in a structured format with exact current values from live market sources.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            timestamp: { type: "string" },
            coins: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  symbol: { type: "string" },
                  name: { type: "string" },
                  price_usd: { type: "number" },
                  price_change_24h: { type: "number" },
                  market_cap: { type: "number" },
                  volume_24h: { type: "number" }
                }
              }
            }
          }
        }
      });

      setLiveData(response.coins || []);
      setUpdateStatus('Updating database...');

      // Update CryptoCurrency entities and create price history
      let updatedCount = 0;
      for (const coin of coins) {
        const liveInfo = response.coins?.find(
          c => c.symbol === coin.symbol || c.name === coin.name
        );

        if (liveInfo) {
          // Update cryptocurrency entity
          await offlineClient.entities.CryptoCurrency.update(coin.id, {
            price_usd: liveInfo.price_usd,
            price_change_24h: liveInfo.price_change_24h,
            last_updated: new Date().toISOString()
          });

          // Create price history record
          await offlineClient.entities.CryptoPriceHistory.create({
            coin_symbol: coin.symbol,
            coin_name: coin.name,
            price_usd: liveInfo.price_usd,
            market_cap: liveInfo.market_cap,
            volume_24h: liveInfo.volume_24h,
            price_change_24h: liveInfo.price_change_24h,
            timestamp: new Date().toISOString()
          });

          updatedCount++;
        }
      }

      setUpdateStatus(`✓ Updated ${updatedCount} coins successfully`);
      setLastUpdate(new Date());
      
      if (onUpdateComplete) {
        onUpdateComplete();
      }

      setTimeout(() => setUpdateStatus(null), 5000);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      setUpdateStatus('✗ Update failed. Please try again.');
      setTimeout(() => setUpdateStatus(null), 5000);
    }

    setIsUpdating(false);
  };

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLiveMarketData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getChangeColor = (change) => {
    if (change > 0) return 'text-emerald-400';
    if (change < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  const formatNumber = (num) => {
    if (!num) return '0.00';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-base text-white">Live Market Data</CardTitle>
              {lastUpdate && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/30">
              <Label className="text-xs text-slate-400">Auto-refresh</Label>
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                disabled={isUpdating}
              />
            </div>
            <Button
              onClick={fetchLiveMarketData}
              disabled={isUpdating}
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500"
            >
              <RefreshCw className={`w-3 h-3 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Update Status */}
        <AnimatePresence>
          {updateStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-4 p-3 rounded-lg ${
                updateStatus.includes('✓') 
                  ? 'bg-emerald-500/10 border border-emerald-500/30' 
                  : updateStatus.includes('✗')
                  ? 'bg-red-500/10 border border-red-500/30'
                  : 'bg-cyan-500/10 border border-cyan-500/30'
              }`}
            >
              <p className={`text-sm ${
                updateStatus.includes('✓') 
                  ? 'text-emerald-300' 
                  : updateStatus.includes('✗')
                  ? 'text-red-300'
                  : 'text-cyan-300'
              }`}>
                {updateStatus}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Coin Data */}
        <div className="space-y-2">
          {liveData.length > 0 ? (
            liveData.map((coinData, idx) => (
              <motion.div
                key={coinData.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{coinData.symbol}</span>
                        <Badge variant="outline" className="text-[10px]">{coinData.name}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400">
                          Vol: {formatNumber(coinData.volume_24h)}
                        </span>
                        <span className="text-xs text-slate-400">
                          MCap: {formatNumber(coinData.market_cap)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-mono font-bold text-white">
                      ${coinData.price_usd.toFixed(2)}
                    </div>
                    <div className={`flex items-center justify-end gap-1 text-xs font-medium ${getChangeColor(coinData.price_change_24h)}`}>
                      {coinData.price_change_24h > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {coinData.price_change_24h > 0 ? '+' : ''}{coinData.price_change_24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Click refresh to fetch live market data</p>
              <p className="text-xs text-slate-600 mt-1">Data updates every 5 minutes when auto-refresh is enabled</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}