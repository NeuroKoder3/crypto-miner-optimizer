import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

export default function HelpTooltip({ content, title }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center justify-center p-1 rounded-full hover:bg-slate-800 transition-colors">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-cyan-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-slate-900 border-slate-700">
        {title && (
          <h4 className="text-sm font-semibold text-white mb-2">{title}</h4>
        )}
        <p className="text-xs text-slate-300 leading-relaxed">{content}</p>
      </PopoverContent>
    </Popover>
  );
}