import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, 
  Cpu, 
  Activity, 
  Brain, 
  DollarSign, 
  Settings2,
  Play,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const guides = {
  quickstart: [
    {
      id: 'setup',
      title: 'Initial Setup',
      description: 'Get started with your first GPU optimization',
      icon: Settings2,
      difficulty: 'Beginner',
      duration: '5 min',
      steps: [
        'Navigate to the Dashboard and ensure your GPUs are detected',
        'Select a GPU by clicking on its card',
        'Click "AI Optimize" to run automatic optimization',
        'Review the performance improvements in the optimization panel'
      ]
    },
    {
      id: 'benchmark',
      title: 'Running Benchmarks',
      description: 'Collect performance data for AI training',
      icon: Activity,
      difficulty: 'Beginner',
      duration: '10 min',
      steps: [
        'Select a GPU from the Dashboard',
        'Click the "Benchmark" button on the GPU card',
        'Choose algorithm and duration (recommended: 5 minutes)',
        'Wait for benchmark to complete - data is saved automatically',
        'Run benchmarks for different algorithms to compare performance'
      ]
    }
  ],
  advanced: [
    {
      id: 'ai-training',
      title: 'Training the AI Model',
      description: 'Improve prediction accuracy with your data',
      icon: Brain,
      difficulty: 'Advanced',
      duration: '15 min',
      steps: [
        'Navigate to the AI Model page',
        'Ensure you have at least 5 benchmark results',
        'Click "Train Model" to start the training process',
        'Monitor training progress - accuracy should reach 85%+',
        'Review feature importance to understand what affects performance',
        'Retrain periodically as you collect more data'
      ]
    },
    {
      id: 'remote-control',
      title: 'Remote GPU Management',
      description: 'Control GPUs from anywhere',
      icon: Cpu,
      difficulty: 'Intermediate',
      duration: '10 min',
      steps: [
        'Go to Automation & Control page',
        'Select a GPU from the GPU selector',
        'Use sliders to adjust core clock, memory clock, and power limit',
        'Click "Apply Settings" to apply changes remotely',
        'Monitor GPU health metrics in the Health Monitor panel',
        'Use "Safe Mode" button if GPU shows instability'
      ]
    },
    {
      id: 'automation',
      title: 'Setting Up Automation Rules',
      description: 'Automate responses to hardware events',
      icon: Settings2,
      difficulty: 'Advanced',
      duration: '12 min',
      steps: [
        'Navigate to Automation & Control',
        'Click "Create New Rule" in the Automation Rules section',
        'Select trigger type (e.g., "high_temperature")',
        'Set threshold value (e.g., 85°C)',
        'Choose action (e.g., "safe_mode" or "reduce_clocks")',
        'Enable the rule and monitor trigger count',
        'Fine-tune thresholds based on your hardware'
      ]
    }
  ],
  profitability: [
    {
      id: 'market-data',
      title: 'Live Market Data Integration',
      description: 'Track real-time cryptocurrency prices',
      icon: DollarSign,
      difficulty: 'Beginner',
      duration: '5 min',
      steps: [
        'Switch to the Profitability tab on Dashboard',
        'Enable auto-refresh in the Live Market Data panel',
        'Click "Refresh" to fetch current crypto prices',
        'Review 24h price changes and market caps',
        'Data updates automatically every 5 minutes'
      ]
    },
    {
      id: 'profit-calc',
      title: 'Profitability Calculation',
      description: 'Understand your mining earnings',
      icon: DollarSign,
      difficulty: 'Intermediate',
      duration: '8 min',
      steps: [
        'Click the Settings button on Dashboard',
        'Configure your electricity cost per kWh',
        'Set pool fee percentage (usually 1-2%)',
        'Choose calculation mode (realistic recommended)',
        'Review daily/monthly profit for each GPU',
        'Compare algorithms using the Algorithm Comparison chart',
        'Set price alerts to monitor profitability changes'
      ]
    }
  ]
};

const tutorialVideos = [
  {
    title: 'Complete Onboarding Walkthrough',
    description: 'Full tour of all features and capabilities',
    duration: '12:30',
    category: 'Getting Started'
  },
  {
    title: 'Optimizing for Maximum Efficiency',
    description: 'Advanced techniques for best MH/W ratio',
    duration: '8:15',
    category: 'Optimization'
  },
  {
    title: 'AI Model Training Deep Dive',
    description: 'Understanding and improving AI predictions',
    duration: '15:45',
    category: 'AI & Machine Learning'
  }
];

export default function Guides() {
  const [selectedGuide, setSelectedGuide] = useState(null);

  const renderGuideCard = (guide) => {
    const Icon = guide.icon;
    return (
      <motion.div
        key={guide.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card 
          className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 hover:border-cyan-500/30 transition-all cursor-pointer"
          onClick={() => setSelectedGuide(guide)}
        >
          <CardHeader className="border-b border-slate-800/50">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-base text-white mb-1">{guide.title}</CardTitle>
                  <p className="text-xs text-slate-400">{guide.description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${
                guide.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                guide.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30'
              } border`}>
                {guide.difficulty}
              </Badge>
              <span className="text-xs text-slate-500">{guide.duration}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
              <Book className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Guides & Tutorials
            </h1>
          </div>
          <p className="text-sm text-slate-500">Learn how to maximize your mining efficiency</p>
        </motion.header>

        {selectedGuide ? (
          /* Detailed Guide View */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={() => setSelectedGuide(null)}
              variant="ghost"
              size="sm"
              className="mb-4 text-cyan-400"
            >
              ← Back to all guides
            </Button>

            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
                    <selectedGuide.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-white mb-2">{selectedGuide.title}</CardTitle>
                    <p className="text-sm text-slate-400 mb-3">{selectedGuide.description}</p>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 border">
                        {selectedGuide.difficulty}
                      </Badge>
                      <span className="text-sm text-slate-500">⏱ {selectedGuide.duration}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Step-by-Step Instructions</h3>
                <div className="space-y-4">
                  {selectedGuide.steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/30"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-300 pt-1">{step}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-400 mb-1">Pro Tip</h4>
                      <p className="text-xs text-emerald-300/80">
                        Bookmark this guide for quick reference. You can always return to the Guides page from the navigation menu.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Guides Overview */
          <Tabs defaultValue="quickstart" className="space-y-6">
            <TabsList className="bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="profitability">Profitability</TabsTrigger>
              <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
            </TabsList>

            <TabsContent value="quickstart" className="space-y-4">
              {guides.quickstart.map(renderGuideCard)}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              {guides.advanced.map(renderGuideCard)}
            </TabsContent>

            <TabsContent value="profitability" className="space-y-4">
              {guides.profitability.map(renderGuideCard)}
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              {tutorialVideos.map((video, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/20 flex items-center justify-center">
                          <Play className="w-6 h-6 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-white mb-1">{video.title}</h3>
                          <p className="text-xs text-slate-400 mb-2">{video.description}</p>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">{video.category}</Badge>
                            <span className="text-xs text-slate-500">{video.duration}</span>
                          </div>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-red-600 to-pink-600">
                          <Play className="w-3 h-3 mr-2" />
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}