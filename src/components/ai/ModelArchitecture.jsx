import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Layers, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function ModelArchitecture() {
  const layers = [
    { name: 'Input Layer', neurons: 7, description: 'GPU features (core, memory, power, etc.)' },
    { name: 'Hidden Layer 1', neurons: 64, activation: 'ReLU', description: 'Feature extraction' },
    { name: 'Hidden Layer 2', neurons: 128, activation: 'ReLU', description: 'Pattern recognition' },
    { name: 'Hidden Layer 3', neurons: 64, activation: 'ReLU', description: 'Optimization learning' },
    { name: 'Output Layer', neurons: 3, activation: 'Linear', description: 'Hashrate, Power, Efficiency' }
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
            <Network className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <CardTitle className="text-base text-white">Neural Network Architecture</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Multi-Layer Perceptron (MLP)</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-24 text-right ${
                  index === 0 ? 'text-cyan-400' : 
                  index === layers.length - 1 ? 'text-emerald-400' : 
                  'text-purple-400'
                }`}>
                  <div className="text-xs text-slate-500">{layer.name}</div>
                  <div className="text-lg font-bold font-mono">{layer.neurons}</div>
                </div>
                
                <div className="flex-1 relative">
                  <div className={`h-12 rounded-lg border-2 flex items-center justify-center ${
                    index === 0 ? 'bg-cyan-500/10 border-cyan-500/30' : 
                    index === layers.length - 1 ? 'bg-emerald-500/10 border-emerald-500/30' : 
                    'bg-purple-500/10 border-purple-500/30'
                  }`}>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(layer.neurons, 10) }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-6 rounded-full ${
                            index === 0 ? 'bg-cyan-500' : 
                            index === layers.length - 1 ? 'bg-emerald-500' : 
                            'bg-purple-500'
                          }`}
                          style={{ opacity: 0.3 + (i / 10) * 0.7 }}
                        />
                      ))}
                      {layer.neurons > 10 && (
                        <span className="text-xs text-slate-500 ml-1">...</span>
                      )}
                    </div>
                  </div>
                  
                  {layer.activation && (
                    <Badge className="absolute -top-2 left-2 bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                      {layer.activation}
                    </Badge>
                  )}
                </div>
                
                <div className="flex-shrink-0 w-32">
                  <p className="text-xs text-slate-500">{layer.description}</p>
                </div>
              </div>
              
              {index < layers.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-px h-4 bg-slate-700" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-500 mb-1">Total Parameters</p>
              <p className="text-white font-mono">~12,800</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Optimizer</p>
              <p className="text-white">Adam (lr=0.001)</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Loss Function</p>
              <p className="text-white">MSE + Huber</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Regularization</p>
              <p className="text-white">Dropout (0.2)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}