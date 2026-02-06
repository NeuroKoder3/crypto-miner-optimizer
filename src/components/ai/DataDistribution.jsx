import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Database } from "lucide-react";

export default function DataDistribution({ trainingData }) {
  // GPU type distribution
  const gpuDistribution = trainingData.reduce((acc, data) => {
    const gpuType = data.gpu_name?.split(' ').slice(0, 3).join(' ') || 'Unknown';
    acc[gpuType] = (acc[gpuType] || 0) + 1;
    return acc;
  }, {});

  const gpuChartData = Object.entries(gpuDistribution).map(([gpu, count]) => ({
    name: gpu,
    value: count
  }));

  // Algorithm distribution
  const algoDistribution = trainingData.reduce((acc, data) => {
    acc[data.algorithm] = (acc[data.algorithm] || 0) + 1;
    return acc;
  }, {});

  const algoChartData = Object.entries(algoDistribution).map(([algo, count]) => ({
    algorithm: algo.toUpperCase(),
    samples: count
  }));

  const COLORS = ['#00ff9f', '#00d9ff', '#a855f7', '#f59e0b', '#f87171'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm text-white font-medium">{payload[0].name}</p>
          <p className="text-xs text-slate-400 mt-1">
            Samples: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* GPU Distribution */}
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
        <CardHeader className="border-b border-slate-800/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <CardTitle className="text-base text-white">Training Data by GPU</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gpuChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split(' ').slice(-1)} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gpuChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Distribution */}
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
        <CardHeader className="border-b border-slate-800/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <CardTitle className="text-base text-white">Training Data by Algorithm</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={algoChartData}>
                <XAxis 
                  dataKey="algorithm" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="samples" radius={[4, 4, 0, 0]}>
                  {algoChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}