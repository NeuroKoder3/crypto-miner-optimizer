import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, MessageSquare, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function PredictiveAlertConfig({ config, onSave }) {
  const [settings, setSettings] = useState(config || {
    temperature_threshold: 80,
    fan_speed_threshold: 95,
    power_spike_threshold: 320,
    hashrate_drop_threshold: 15,
    prediction_confidence_minimum: 70,
    enable_email_alerts: false,
    enable_sms_alerts: false,
    enable_in_app_alerts: true,
    email_address: '',
    phone_number: '',
    alert_frequency: 'immediate',
    auto_action_enabled: true,
    auto_restart_on_hang: true,
    auto_safe_mode_on_overheat: true
  });

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20">
              <Bell className="w-4 h-4 text-yellow-400" />
            </div>
            <CardTitle className="text-base text-white">Alert Configuration</CardTitle>
          </div>
          <Button onClick={handleSave} size="sm" className="bg-gradient-to-r from-cyan-600 to-blue-600">
            <Save className="w-3 h-3 mr-2" />
            Save
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Alert Thresholds */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            Alert Thresholds
            <Badge variant="outline" className="text-[10px]">Predictive AI</Badge>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-slate-400">Temperature (°C)</Label>
                <span className="text-sm font-mono text-white">{settings.temperature_threshold}°C</span>
              </div>
              <Slider
                value={[settings.temperature_threshold]}
                onValueChange={([v]) => setSettings({...settings, temperature_threshold: v})}
                min={60}
                max={95}
                step={1}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-slate-400">Fan Speed (%)</Label>
                <span className="text-sm font-mono text-white">{settings.fan_speed_threshold}%</span>
              </div>
              <Slider
                value={[settings.fan_speed_threshold]}
                onValueChange={([v]) => setSettings({...settings, fan_speed_threshold: v})}
                min={80}
                max={100}
                step={1}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-slate-400">Power Spike (W)</Label>
                <span className="text-sm font-mono text-white">{settings.power_spike_threshold}W</span>
              </div>
              <Slider
                value={[settings.power_spike_threshold]}
                onValueChange={([v]) => setSettings({...settings, power_spike_threshold: v})}
                min={250}
                max={400}
                step={10}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-slate-400">Hashrate Drop (%)</Label>
                <span className="text-sm font-mono text-white">{settings.hashrate_drop_threshold}%</span>
              </div>
              <Slider
                value={[settings.hashrate_drop_threshold]}
                onValueChange={([v]) => setSettings({...settings, hashrate_drop_threshold: v})}
                min={5}
                max={30}
                step={1}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-slate-400">AI Confidence Minimum (%)</Label>
                <span className="text-sm font-mono text-white">{settings.prediction_confidence_minimum}%</span>
              </div>
              <Slider
                value={[settings.prediction_confidence_minimum]}
                onValueChange={([v]) => setSettings({...settings, prediction_confidence_minimum: v})}
                min={50}
                max={95}
                step={5}
              />
              <p className="text-[10px] text-slate-600 mt-1">Only trigger alerts when AI is this confident</p>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4 pt-4 border-t border-slate-800/50">
          <h3 className="text-sm font-medium text-slate-300">Notification Channels</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-cyan-400" />
                <div>
                  <Label className="text-sm text-white">In-App Alerts</Label>
                  <p className="text-xs text-slate-500">Show alerts in dashboard</p>
                </div>
              </div>
              <Switch
                checked={settings.enable_in_app_alerts}
                onCheckedChange={(checked) => setSettings({...settings, enable_in_app_alerts: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <div>
                  <Label className="text-sm text-white">Email Notifications</Label>
                  <p className="text-xs text-slate-500">Send email alerts</p>
                </div>
              </div>
              <Switch
                checked={settings.enable_email_alerts}
                onCheckedChange={(checked) => setSettings({...settings, enable_email_alerts: checked})}
              />
            </div>

            {settings.enable_email_alerts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={settings.email_address}
                  onChange={(e) => setSettings({...settings, email_address: e.target.value})}
                  className="bg-slate-800/50 border-slate-700"
                />
              </motion.div>
            )}

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-green-400" />
                <div>
                  <Label className="text-sm text-white">SMS Alerts</Label>
                  <p className="text-xs text-slate-500">Critical alerts via SMS</p>
                </div>
              </div>
              <Switch
                checked={settings.enable_sms_alerts}
                onCheckedChange={(checked) => setSettings({...settings, enable_sms_alerts: checked})}
              />
            </div>

            {settings.enable_sms_alerts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={settings.phone_number}
                  onChange={(e) => setSettings({...settings, phone_number: e.target.value})}
                  className="bg-slate-800/50 border-slate-700"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Alert Frequency */}
        <div className="space-y-3 pt-4 border-t border-slate-800/50">
          <h3 className="text-sm font-medium text-slate-300">Alert Frequency</h3>
          <Select 
            value={settings.alert_frequency}
            onValueChange={(value) => setSettings({...settings, alert_frequency: value})}
          >
            <SelectTrigger className="bg-slate-800/50 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="hourly">Hourly Digest</SelectItem>
              <SelectItem value="daily">Daily Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auto Actions */}
        <div className="space-y-3 pt-4 border-t border-slate-800/50">
          <h3 className="text-sm font-medium text-slate-300">Automatic Actions</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/20">
              <Label className="text-xs text-slate-300">Enable Auto-Actions</Label>
              <Switch
                checked={settings.auto_action_enabled}
                onCheckedChange={(checked) => setSettings({...settings, auto_action_enabled: checked})}
              />
            </div>

            {settings.auto_action_enabled && (
              <>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/20">
                  <Label className="text-xs text-slate-300">Auto-restart on GPU hang</Label>
                  <Switch
                    checked={settings.auto_restart_on_hang}
                    onCheckedChange={(checked) => setSettings({...settings, auto_restart_on_hang: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/20">
                  <Label className="text-xs text-slate-300">Auto safe mode on overheat</Label>
                  <Switch
                    checked={settings.auto_safe_mode_on_overheat}
                    onCheckedChange={(checked) => setSettings({...settings, auto_safe_mode_on_overheat: checked})}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}