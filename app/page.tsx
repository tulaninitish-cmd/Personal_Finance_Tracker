

"use client"
import Link from 'next/link';
import { ArrowRight, BarChart3, ShieldCheck, Zap, Wallet, TrendingUp } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function LandingPage() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Background - Matching Dashboard Slate/Blue tones */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[#f8fafc] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent"></div>
      </div>

      {/* Navigation - Responsive alignment for buttons */}
      <nav className="relative z-10 flex flex-row items-center justify-between px-4 sm:px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 md:gap-2.5">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-blue-600">Spendly</span>
        </div>
        
        <div className="flex gap-2 sm:gap-4 md:gap-8 items-center">
          {session ? (
            <Link href="/dashboard" className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="bg-slate-900 text-white px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95">
              Login
            </Link>
          )}
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section - Scaled typography for small screens */}
      <header className="relative z-10 px-6 pt-12 md:pt-16 pb-20 md:pb-24 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-6 md:mb-8">
          <TrendingUp size={14} className="font-bold" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Live Financial Insights</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-[1.1] text-slate-900">
          Master your money <br className="hidden sm:block" />
          <span className="text-blue-600">without the stress.</span>
        </h1>
        
        <p className="text-base md:text-xl text-slate-500 mb-10 md:mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          The all-in-one dashboard designed for modern savers. 
          Track daily expenses, set smart budgets, and visualize growth with precision.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center">
          <Link 
            href="/register" 
            className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1"
          >
            Start Tracking Now 
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Bento-Style Feature Grid - Responsive columns */}
      <section className="relative z-10 bg-white border-y border-slate-100 py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center md:text-left mb-12 md:text-left mb-16">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase mb-2">Built for Performance</h2>
            <p className="text-slate-400 font-medium italic text-sm md:text-base">Everything you need to visualize your financial future.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 - Instant Logging */}
            <div className="group bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all duration-300">
              <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-blue-100 text-white">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Instant Logging</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Record transactions in seconds with automated categorization for Food, Shopping, and more.</p>
            </div>

            {/* Feature 2 - Smart Analytics */}
            <div className="group bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300">
              <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-indigo-100 text-white">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Visual Insights</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Interactive line charts and category bars to track your monthly spending patterns.</p>
            </div>

            {/* Feature 3 - Secure Data */}
            <div className="group bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-50 transition-all duration-300">
              <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-emerald-100 text-white">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Secure Assets</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Bank-grade security ensures your balance and savings data stay private and protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Responsive stacking */}
      <footer className="relative z-10 py-12 md:py-16 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
           <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-1 rounded-lg">
                <Wallet className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-black tracking-tighter text-blue-600">Spendly</span>
           </div>
           <p className="text-slate-400 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-center">
             © 2026 Spendly Finance. 
           </p>
           <div className="flex gap-8 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
           </div>
        </div>
      </footer>
    </div>
  );
}