import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Crypto Mining Optimizer!',
    description: 'Your AI-powered GPU optimization platform. Let\'s take a quick tour of the key features.',
    target: null,
    page: 'Dashboard'
  },
  {
    id: 'gpu-cards',
    title: 'GPU Monitoring',
    description: 'View real-time performance metrics for all your GPUs. Click on any GPU to select it for optimization.',
    target: '[data-tour="gpu-cards"]',
    page: 'Dashboard'
  },
  {
    id: 'optimization',
    title: 'AI Optimization',
    description: 'Use AI-powered optimization to automatically find the best settings for maximum efficiency.',
    target: '[data-tour="optimization-panel"]',
    page: 'Dashboard'
  },
  {
    id: 'profitability',
    title: 'Profitability Tracking',
    description: 'Monitor live crypto prices and calculate real-time profitability for each GPU.',
    target: '[data-tour="profitability-tab"]',
    page: 'Dashboard'
  },
  {
    id: 'remote-control',
    title: 'Remote GPU Control',
    description: 'Apply profiles, restart GPUs, or enable safe mode remotely from anywhere.',
    target: '[data-tour="remote-control"]',
    page: 'Automation'
  },
  {
    id: 'health-monitoring',
    title: 'Health Monitoring',
    description: 'Track vital metrics and get predictive alerts for potential hardware failures.',
    target: '[data-tour="health-monitor"]',
    page: 'Automation'
  },
  {
    id: 'ai-model',
    title: 'AI Learning Model',
    description: 'Train the AI on your benchmark data to improve prediction accuracy over time.',
    target: '[data-tour="ai-model"]',
    page: 'AIModel'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start optimizing your mining rigs. Check the Guides section anytime for detailed tutorials.',
    target: null,
    page: null
  }
];

export default function OnboardingTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('onboarding_completed');
    if (!hasCompletedTour) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollToTarget(tourSteps[currentStep + 1].target);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollToTarget(tourSteps[currentStep - 1].target);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const scrollToTarget = (target) => {
    if (!target) return;
    setTimeout(() => {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      >
        {/* Highlight Target */}
        {step.target && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" style={{
              boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6)`
            }} />
          </div>
        )}

        {/* Tour Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101]"
        >
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-cyan-500/30 shadow-2xl">
            <CardContent className="p-6">
              {/* Close Button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Step {currentStep + 1} of {tourSteps.length}
                </p>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-300">{step.description}</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400"
                  >
                    Skip Tour
                  </Button>
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="bg-gradient-to-r from-cyan-600 to-blue-600"
                  >
                    {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                    {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}