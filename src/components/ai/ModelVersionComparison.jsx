import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { GitBranch } from "lucide-react";

export default function ModelVersionComparison({ history }) {
  // Group by version
  const versionData = history.reduce((acc, h) => {
    if (!acc[h.model_version]) {
      acc[h.model_version] = [];
    }
    acc[h.model_version].push(h);
    return acc;
  }, {});

  const chartData = Object.keys(versionData).map(version => {
    const sessions = versionData[version];
    const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
    const avgError = sessions.reduce((sum, s) => sum + s.avg_prediction_error, 0) / sessions.length;
    
    return {
      version,
      accuracy: avgAccuracy,
      error: avgError,
      sessions: sessions.length
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-white mb-2">Version {label}</p>
          <div className="space-y-1">
            <p className="text-xs">
              <span className="text-emerald-400">Accuracy:</span>
              <span className="text-white ml-2 font-mono">{payload[0]?.value?.toFixed(1)}%</span>
            </p>
            <p className="text-xs">
              <span className="text-red-400">Avg Error:</span>
              <span className="text-white ml-2 font-mono">{payload[1]?.value?.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20">
            <GitBranch className="w-4 h-4 text-green-400" />
          </div>
          <CardTitle className="text-base text-white">Model Version Performance</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {chartData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-sm text-slate-500">No version history available</p>
          </div>
        ) : (
          <>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="version" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#00ff9f"
                    strokeWidth={2}
                    dot={{ fill: '#00ff9f', r: 4 }}
                    name="Accuracy"
                  />
                  <Line
                    type="monotone"
                    dataKey="error"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={{ fill: '#f87171', r: 4 }}
                    name="Error"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {chartData.slice(-3).reverse().map((version, index) => (
                <div 
                  key={version.version}
                  className={`p-3 rounded-lg border ${
                    index === 0 
                      ? 'bg-emerald-500/10 border-emerald-500/20' 
                      : 'bg-slate-800/30 border-slate-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">v{version.version}</span>
                    {index === 0 && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">
                        Latest
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-mono text-white">{version.accuracy.toFixed(1)}%</p>
                  <p className="text-[10px] text-slate-500">{version.sessions} sessions</p>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}