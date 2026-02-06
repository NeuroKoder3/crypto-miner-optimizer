import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Zap, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfitabilityCard({ gpu, coin, settings, profitData }) {
  if (!profitData) return null;

  const { daily_profit, daily_revenue, daily_electricity_cost, monthly_profit, roi_days } = profitData;
  const isProfitable = daily_profit > 0;
  const breakEven = roi_days > 0 && roi_days < 365;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative overflow-hidden border ${
        isProfitable 
          ? 'bg-gradient-to-br from-emerald-500/5 to-green-500/5 border-emerald-500/20' 
          : 'bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20'
      }`}>
        {/* Glow effect */}
        <div className={`absolute top-0 right-0 w-24 h-24 ${
          isProfitable ? 'bg-emerald-500/10' : 'bg-red-500/10'
        } rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
        
        <CardContent className="p-4 relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-sm font-medium text-white mb-0.5">{gpu.name}</h4>
              <p className="text-xs text-slate-500">Mining {coin.symbol}</p>
            </div>
            <Badge className={`${
              isProfitable 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            } border text-xs`}>
              {isProfitable ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {isProfitable ? 'Profitable' : 'Not Profitable'}
            </Badge>
          </div>

          {/* Main Profit Display */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-3xl font-bold font-mono ${
                isProfitable ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {isProfitable ? '+' : ''}{settings.currency_symbol}{Math.abs(daily_profit || 0).toFixed(2)}
              </span>
              <span className="text-xs text-slate-500">/day</span>
            </div>
            <p className="text-xs text-slate-500">
              {settings.currency_symbol}{(monthly_profit || 0).toFixed(2)}/month
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3 h-3 text-green-400" />
                <span className="text-[10px] text-slate-500 uppercase">Revenue</span>
              </div>
              <p className="text-sm font-mono text-white">
                {settings.currency_symbol}{(daily_revenue || 0).toFixed(2)}
              </p>
            </div>
            
            <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-slate-500 uppercase">Power Cost</span>
              </div>
              <p className="text-sm font-mono text-white">
                {settings.currency_symbol}{(daily_electricity_cost || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">{(gpu.hashrate || 0).toFixed(1)} MH/s</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-500">{(gpu.power_draw || 0).toFixed(0)}W</span>
            </div>
            {breakEven && (
              <div className="flex items-center gap-1 text-cyan-400">
                <Clock className="w-3 h-3" />
                <span>ROI: {(roi_days || 0).toFixed(0)} days</span>
              </div>
            )}
          </div>

          {/* Price Info */}
          <div className="mt-3 pt-3 border-t border-slate-700/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{coin.symbol} Price:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{settings.currency_symbol}{(coin.price_usd || 0).toFixed(2)}</span>
                {coin.price_change_24h !== undefined && (
                  <Badge className={`text-[10px] px-1.5 py-0 ${
                    coin.price_change_24h >= 0 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {coin.price_change_24h >= 0 ? '+' : ''}{(coin.price_change_24h || 0).toFixed(1)}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}