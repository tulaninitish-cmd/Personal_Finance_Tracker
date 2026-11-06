"use client";

import { Loader2, Tag, Wallet } from "lucide-react";

export default function Loading() {
 return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="relative flex items-center justify-center">
        {/* Outer thin ring - provides a track for the spinner */}
        <Loader2 
          className="animate-spin text-blue-600 opacity-20" 
          size={90} 
          strokeWidth={1}
        />
        
        {/* Inner thicker segment - creates the high-end "chasing" effect */}
        <Loader2 
          className="absolute animate-spin text-blue-600" 
          size={90} 
          strokeWidth={2}
          style={{ animationDuration: '1.5s' }}
        />

        {/* Center Branded Pulse - uses the Tag icon from your dashboard */}
        <div className="absolute animate-pulse bg-blue-50 p-4 rounded-full">
          <Tag className="text-blue-600" size={32} />
        </div>
      </div>

      {/* Branded Text Section */}
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
          Spendly
        </h3>
        <div className="flex items-center justify-center space-x-2 mt-2">
          {/* Animated Bouncing Dots */}
          <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] pl-2">
            Syncing your finances
          </p>
        </div>
      </div>
    </div>
  );
}