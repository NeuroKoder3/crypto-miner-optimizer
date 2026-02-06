import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Trash2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlertManager({ alerts, coins, onCreateAlert, onDeleteAlert }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    coin_symbol: '',
    alert_type: 'price_drop',
    threshold_value: 10,
    threshold_type: 'percentage'
  });

  const handleCreate = () => {
    if (newAlert.coin_symbol && newAlert.threshold_value) {
      onCreateAlert(newAlert);
      setNewAlert({
        coin_symbol: '',
        alert_type: 'price_drop',
        threshold_value: 10,
        threshold_type: 'percentage'
      });
      setIsCreateOpen(false);
    }
  };

  const triggeredAlerts = alerts.filter(a => a.is_triggered && a.is_active);
  const activeAlerts = alerts.filter(a => !a.is_triggered && a.is_active);

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <CardTitle className="text-base text-white">Price Alerts</CardTitle>
            {triggeredAlerts.length > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {triggeredAlerts.length} triggered
              </Badge>
            )}
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white h-8">
                <Plus className="w-3.5 h-3.5 mr-1" />
                New Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Create Price Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-400 mb-2 block">Cryptocurrency</Label>
                  <Select 
                    value={newAlert.coin_symbol} 
                    onValueChange={(v) => setNewAlert({...newAlert, coin_symbol: v})}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select coin" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {coins.map(coin => (
                        <SelectItem key={coin.symbol} value={coin.symbol}>
                          {coin.symbol} - {coin.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-slate-400 mb-2 block">Alert Type</Label>
                  <Select 
                    value={newAlert.alert_type} 
                    onValueChange={(v) => setNewAlert({...newAlert, alert_type: v})}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="price_drop">Price Drop</SelectItem>
                      <SelectItem value="price_increase">Price Increase</SelectItem>
                      <SelectItem value="profitability_threshold">Profitability Threshold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-slate-400 mb-2 block">Threshold</Label>
                    <Input
                      type="number"
                      value={newAlert.threshold_value}
                      onChange={(e) => setNewAlert({...newAlert, threshold_value: parseFloat(e.target.value)})}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-slate-400 mb-2 block">Type</Label>
                    <Select 
                      value={newAlert.threshold_type} 
                      onValueChange={(v) => setNewAlert({...newAlert, threshold_type: v})}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="absolute">Absolute ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleCreate}
                  className="w-full bg-amber-600 hover:bg-amber-500"
                  disabled={!newAlert.coin_symbol}
                >
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Triggered Alerts */}
          <AnimatePresence>
            {triggeredAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-400">{alert.coin_symbol} Alert Triggered</p>
                      <p className="text-xs text-slate-400 mt-1">{alert.notification_message}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteAlert(alert.id)}
                    className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Active Alerts */}
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{alert.coin_symbol}</span>
                  <Badge className="bg-slate-700/50 text-slate-300 border-0 text-[10px]">
                    {alert.alert_type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {alert.threshold_type === 'percentage' ? `${alert.threshold_value}%` : `$${alert.threshold_value}`}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteAlert(alert.id)}
                className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-6">
              <Bell className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No alerts configured</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}