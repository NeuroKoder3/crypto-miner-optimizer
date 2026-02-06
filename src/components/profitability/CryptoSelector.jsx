import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function CryptoSelector({ coins, selectedCoins, onSelectionChange, onRefreshPrices, isRefreshing }) {
  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-white">Track Cryptocurrencies</CardTitle>
          <Button
            onClick={onRefreshPrices}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Updating...' : 'Refresh Prices'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          {coins.map((coin) => {
            const isSelected = selectedCoins.includes(coin.symbol);
            const priceChange = coin.price_change_24h || 0;
            
            return (
              <motion.div
                key={coin.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isSelected 
                    ? 'bg-cyan-500/10 border-cyan-500/30' 
                    : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50'
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    const newSelection = checked
                      ? [...selectedCoins, coin.symbol]
                      : selectedCoins.filter(s => s !== coin.symbol);
                    onSelectionChange(newSelection);
                  }}
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{coin.symbol}</span>
                    <span className="text-xs text-slate-500">{coin.name}</span>
                    <Badge className="bg-slate-700/50 text-slate-300 border-0 text-[10px]">
                      {coin.algorithm}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-white font-mono">${(coin.price_usd || 0).toFixed(4)}</span>
                    <Badge className={`text-[10px] px-1.5 py-0 ${
                      priceChange >= 0 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {priceChange >= 0 ? (
                        <TrendingUp className="w-2.5 h-2.5 mr-1" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5 mr-1" />
                      )}
                      {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}