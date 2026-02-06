import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, Filter } from "lucide-react";
import { format } from "date-fns";

export default function TrainingDataTable({ trainingData }) {
  const [filterGpu, setFilterGpu] = useState('all');
  
  const gpus = [...new Set(trainingData.map(d => d.gpu_name))];
  
  const filteredData = filterGpu === 'all' 
    ? trainingData 
    : trainingData.filter(d => d.gpu_name === filterGpu);

  const getErrorColor = (error) => {
    if (error < 5) return 'text-emerald-400';
    if (error < 10) return 'text-cyan-400';
    if (error < 15) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20">
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <CardTitle className="text-base text-white">Training Dataset</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <Select value={filterGpu} onValueChange={setFilterGpu}>
              <SelectTrigger className="w-40 h-8 bg-slate-800/50 border-slate-700 text-white text-xs">
                <SelectValue placeholder="All GPUs" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All GPUs</SelectItem>
                {gpus.map(gpu => (
                  <SelectItem key={gpu} value={gpu}>{gpu}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400 text-xs">GPU</TableHead>
              <TableHead className="text-slate-400 text-xs">Algorithm</TableHead>
              <TableHead className="text-slate-400 text-xs">Settings</TableHead>
              <TableHead className="text-slate-400 text-xs">Actual</TableHead>
              <TableHead className="text-slate-400 text-xs">Predicted</TableHead>
              <TableHead className="text-slate-400 text-xs">Error</TableHead>
              <TableHead className="text-slate-400 text-xs">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No training data available
                </TableCell>
              </TableRow>
            ) : (
              filteredData.slice(0, 20).map((data) => (
                <TableRow key={data.id} className="border-slate-800/50 hover:bg-slate-800/20">
                  <TableCell className="font-medium text-white text-xs">{data.gpu_name}</TableCell>
                  <TableCell>
                    <Badge className="bg-slate-700/50 text-slate-300 border-0 text-[10px]">
                      {data.algorithm}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-mono text-slate-400">
                      {data.input_features?.core_clock}/{data.input_features?.memory_clock}
                      <span className="text-slate-600 ml-1">@{data.input_features?.power_limit}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-mono text-emerald-400">
                      {(data.output_metrics?.efficiency || 0).toFixed(3)} MH/W
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-mono text-cyan-400">
                      {data.predicted_metrics?.efficiency ? data.predicted_metrics.efficiency.toFixed(3) : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className={`font-mono font-semibold ${getErrorColor(data.prediction_error || 0)}`}>
                      {(data.prediction_error || 0).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-[10px]">
                    {format(new Date(data.created_date), 'MMM d, HH:mm')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {filteredData.length > 20 && (
        <div className="p-3 border-t border-slate-800/50 text-center">
          <p className="text-xs text-slate-500">
            Showing 20 of {filteredData.length} samples
          </p>
        </div>
      )}
    </Card>
  );
}