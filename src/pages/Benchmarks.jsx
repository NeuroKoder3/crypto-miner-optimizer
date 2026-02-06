import React, { useState } from 'react';
import { offlineClient } from '@/api/offlineClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Zap, TrendingUp, Clock, Filter } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Benchmarks() {
  const [filterGpu, setFilterGpu] = useState('all');
  const [filterAlgorithm, setFilterAlgorithm] = useState('all');

  const { data: benchmarks = [], isLoading } = useQuery({
    queryKey: ['benchmarks'],
    queryFn: () => offlineClient.entities.BenchmarkResult.list('-created_date', 100),
  });

  const { data: gpus = [] } = useQuery({
    queryKey: ['gpus'],
    queryFn: () => offlineClient.entities.GPU.list(),
  });

  const filteredBenchmarks = benchmarks.filter(b => {
    const gpuMatch = filterGpu === 'all' || b.gpu_id === filterGpu;
    const algoMatch = filterAlgorithm === 'all' || b.algorithm === filterAlgorithm;
    return gpuMatch && algoMatch;
  });

  // Prepare chart data - group by GPU
  const chartData = gpus.map(gpu => {
    const gpuBenchmarks = benchmarks.filter(b => b.gpu_id === gpu.gpu_id);
    const avgEfficiency = gpuBenchmarks.length > 0
      ? gpuBenchmarks.reduce((sum, b) => sum + (b.efficiency || 0), 0) / gpuBenchmarks.length
      : 0;
    const avgHashrate = gpuBenchmarks.length > 0
      ? gpuBenchmarks.reduce((sum, b) => sum + (b.avg_hashrate || 0), 0) / gpuBenchmarks.length
      : 0;
    return {
      name: gpu.name?.split(' ').slice(-2).join(' ') || gpu.gpu_id,
      efficiency: avgEfficiency,
      hashrate: avgHashrate
    };
  }).filter(d => d.efficiency > 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-white mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-xs">
              <span className="text-cyan-400">Efficiency:</span>
              <span className="text-white ml-2 font-mono">{(payload[0]?.value || 0).toFixed(3)} MH/W</span>
            </p>
            <p className="text-xs">
              <span className="text-emerald-400">Hashrate:</span>
              <span className="text-white ml-2 font-mono">{(payload[1]?.value || 0).toFixed(2)} MH/s</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Benchmark History
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track and compare GPU performance over time</p>
        </motion.header>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-400">Filters:</span>
          </div>
          
          <Select value={filterGpu} onValueChange={setFilterGpu}>
            <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700 text-white">
              <SelectValue placeholder="GPU" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">All GPUs</SelectItem>
              {gpus.map(gpu => (
                <SelectItem key={gpu.gpu_id} value={gpu.gpu_id}>{gpu.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterAlgorithm} onValueChange={setFilterAlgorithm}>
            <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700 text-white">
              <SelectValue placeholder="Algorithm" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">All Algorithms</SelectItem>
              <SelectItem value="ethash">Ethash</SelectItem>
              <SelectItem value="kawpow">KawPow</SelectItem>
              <SelectItem value="autolykos">Autolykos</SelectItem>
              <SelectItem value="kheavyhash">KHeavyHash</SelectItem>
            </SelectContent>
          </Select>

          <Badge className="bg-slate-800 text-slate-400 border-slate-700">
            {filteredBenchmarks.length} results
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Efficiency Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <CardTitle className="text-base text-white">GPU Efficiency Comparison</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {chartData.length === 0 ? (
                  <div className="h-[250px] flex items-center justify-center">
                    <p className="text-sm text-slate-500">No benchmark data available</p>
                  </div>
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tick={{ fill: '#94a3b8', fontSize: 11 }}
                          width={100}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="efficiency" fill="#00d9ff" radius={[0, 4, 4, 0]} name="Efficiency" />
                        <Bar dataKey="hashrate" fill="#00ff9f" radius={[0, 4, 4, 0]} name="Hashrate" opacity={0.5} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              {
                label: "Best Efficiency",
                value: (Math.max(...filteredBenchmarks.map(b => b.efficiency || 0), 0) || 0).toFixed(3),
                unit: "MH/W",
                icon: TrendingUp,
                color: "from-cyan-500/20 to-emerald-500/20",
                iconColor: "text-cyan-400"
              },
              {
                label: "Peak Hashrate",
                value: (Math.max(...filteredBenchmarks.map(b => b.peak_hashrate || 0), 0) || 0).toFixed(2),
                unit: "MH/s",
                icon: Activity,
                color: "from-emerald-500/20 to-green-500/20",
                iconColor: "text-emerald-400"
              },
              {
                label: "Avg Power",
                value: filteredBenchmarks.length > 0 
                  ? (filteredBenchmarks.reduce((sum, b) => sum + (b.avg_power || 0), 0) / filteredBenchmarks.length).toFixed(0)
                  : '0',
                unit: "W",
                icon: Zap,
                color: "from-amber-500/20 to-orange-500/20",
                iconColor: "text-amber-400"
              },
              {
                label: "Total Tests",
                value: filteredBenchmarks.length,
                unit: "runs",
                icon: Clock,
                color: "from-purple-500/20 to-pink-500/20",
                iconColor: "text-purple-400"
              }
            ].map((stat, i) => (
              <Card key={i} className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} border border-slate-700/30 w-fit mb-3`}>
                    <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white font-mono">{stat.value}</span>
                    <span className="text-xs text-slate-500">{stat.unit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>

        {/* Benchmark Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <CardTitle className="text-base text-white">Benchmark Results</CardTitle>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">GPU</TableHead>
                    <TableHead className="text-slate-400">Algorithm</TableHead>
                    <TableHead className="text-slate-400">Hashrate</TableHead>
                    <TableHead className="text-slate-400">Power</TableHead>
                    <TableHead className="text-slate-400">Efficiency</TableHead>
                    <TableHead className="text-slate-400">Temp</TableHead>
                    <TableHead className="text-slate-400">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        Loading benchmarks...
                      </TableCell>
                    </TableRow>
                  ) : filteredBenchmarks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No benchmark results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBenchmarks.map((benchmark) => (
                      <TableRow key={benchmark.id} className="border-slate-800/50 hover:bg-slate-800/20">
                        <TableCell className="font-medium text-white">{benchmark.gpu_name}</TableCell>
                        <TableCell>
                          <Badge className="bg-slate-700/50 text-slate-300 border-0 text-xs">
                            {benchmark.algorithm}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-emerald-400">
                          {(benchmark.avg_hashrate || 0).toFixed(2)} MH/s
                        </TableCell>
                        <TableCell className="font-mono text-amber-400">
                          {(benchmark.avg_power || 0).toFixed(0)} W
                        </TableCell>
                        <TableCell className="font-mono text-cyan-400">
                          {(benchmark.efficiency || 0).toFixed(3)} MH/W
                        </TableCell>
                        <TableCell className="font-mono text-slate-400">
                          {(benchmark.avg_temperature || 0).toFixed(0)}°C
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs">
                          {format(new Date(benchmark.created_date), 'MMM d, HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}