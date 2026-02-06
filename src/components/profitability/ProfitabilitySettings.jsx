import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings, DollarSign, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfitabilitySettings({ settings, onSave, isOpen, onOpenChange }) {
  const [localSettings, setLocalSettings] = useState(settings || {
    electricity_cost_per_kwh: 0.12,
    currency: 'USD',
    currency_symbol: '$',
    profit_calculation_mode: 'realistic',
    include_pool_fees: true,
    pool_fee_percent: 1.0,
    show_profitability_alerts: true
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar', symbol: '$' },
    { value: 'EUR', label: 'Euro', symbol: '€' },
    { value: 'GBP', label: 'British Pound', symbol: '£' },
    { value: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
    { value: 'JPY', label: 'Japanese Yen', symbol: '¥' }
  ];

  const handleCurrencyChange = (currency) => {
    const selected = currencyOptions.find(c => c.value === currency);
    setLocalSettings({
      ...localSettings,
      currency,
      currency_symbol: selected?.symbol || '$'
    });
  };

  const handleSave = () => {
    onSave(localSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20">
              <Settings className="w-4 h-4 text-green-400" />
            </div>
            Profitability Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Electricity Cost */}
          <div>
            <Label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Electricity Cost (per kWh)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-white text-lg">{localSettings.currency_symbol}</span>
              <Input
                type="number"
                step="0.01"
                value={localSettings.electricity_cost_per_kwh}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  electricity_cost_per_kwh: parseFloat(e.target.value)
                })}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Average US: $0.12 | EU: €0.20 | Asia: $0.08
            </p>
          </div>

          {/* Currency */}
          <div>
            <Label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-green-400" />
              Currency
            </Label>
            <Select 
              value={localSettings.currency} 
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {currencyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.symbol} {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pool Fees */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-400">Include Pool Fees</Label>
              <Switch
                checked={localSettings.include_pool_fees}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings,
                  include_pool_fees: checked
                })}
              />
            </div>
            
            {localSettings.include_pool_fees && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Label className="text-sm text-slate-400 mb-2 block">Pool Fee (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={localSettings.pool_fee_percent}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    pool_fee_percent: parseFloat(e.target.value)
                  })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </motion.div>
            )}
          </div>

          {/* Calculation Mode */}
          <div>
            <Label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              Calculation Mode
            </Label>
            <Select 
              value={localSettings.profit_calculation_mode} 
              onValueChange={(v) => setLocalSettings({
                ...localSettings,
                profit_calculation_mode: v
              })}
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="conservative">Conservative (-10%)</SelectItem>
                <SelectItem value="realistic">Realistic (Actual)</SelectItem>
                <SelectItem value="optimistic">Optimistic (+10%)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              Adjusts estimates based on market volatility
            </p>
          </div>

          {/* Profitability Alerts */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
            <div>
              <Label className="text-sm text-white">Profitability Alerts</Label>
              <p className="text-xs text-slate-500 mt-0.5">Notify when profit drops</p>
            </div>
            <Switch
              checked={localSettings.show_profitability_alerts}
              onCheckedChange={(checked) => setLocalSettings({
                ...localSettings,
                show_profitability_alerts: checked
              })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}