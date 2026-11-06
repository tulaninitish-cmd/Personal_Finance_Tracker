

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart, Bar, Cell, ResponsiveContainer, Tooltip,
  XAxis, YAxis, CartesianGrid, LineChart, Line, Legend,
} from "recharts";
import {
  TrendingUp, ArrowLeft, Loader2, BarChart3,
  MoreVertical, History, Zap, SearchX
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import Loading from "../loading";

const BAR_COLORS = ["#1e3a8a", "#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#6366f1"];

export default function ChartsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();


  
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [last7DaysData, setLast7DaysData] = useState([]);
  const [monthlyComparisonData, setMonthlyComparisonData] = useState([]);
  const [hasLastMonthData, setHasLastMonthData] = useState(false);
  const [stats, setStats] = useState({
    weeklyAvg: 0, savingsRate: 0, highestSpendDay: "N/A",
    highestSpendAmount: 0, projectedSavings: 0, efficiency: 0
  });
    const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN");
  };

  let color = "tx-black";
  let bg = "bg-white"
  function setcardColor(savings:number){
    if(savings <= 20){
      color = "text-red-600";
      bg = "bg-slate-900";
    }
  }
  setcardColor(stats.savingsRate);

  useEffect(() => {
  if (status === "unauthenticated") {
    toast.error("Please, Login First");
    router.push("/login");
  }
}, [status, router]);

  const fetchAnalytics = async () => {
   
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard/analytics?userId=${session.user.id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();

      // 1. Format 7-Day Bar Chart Data with JS-based Day Formatting
      const formattedBars = (data.last7Days || []).map((d: any) => {
        const dateObj = new Date(d._id);
        const dayName = dateObj.toLocaleDateString('en-GB', { weekday: 'short' });
        return {
          day: `${dateObj.getDate()} ${dayName}`,
          income: d.income || 0,
          expense: d.expense || 0,
          savings: d.savings || 0,
        };
      });
      setLast7DaysData(formattedBars);

      // 2. Format Monthly Comparison & Track Historical Data
      let lastMonthExists = false;
      const formattedLines = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        const thisMonth = data.thisMonthData?.find((d: any) => d._id === day)?.dailyTotal || 0;
        const lastMonth = data.lastMonthData?.find((d: any) => d._id === day)?.dailyTotal || 0;
        const sortedByExpense = [...formattedBars].sort((a, b) => b.expense - a.expense);
const topDay = sortedByExpense[0];

// Only set a "Highest Day" if the amount spent is greater than zero
    const hasSpending = topDay && topDay.expense > 0;
        if (lastMonth > 0) lastMonthExists = true;
        return { day: day.toString(), thisMonth, lastMonth };
      }).filter(d => d.thisMonth > 0 || d.lastMonth > 0);
      // @ts-ignore
      setMonthlyComparisonData(formattedLines);
      setHasLastMonthData(lastMonthExists);

      // 3. Stats Calculation & Celebration Trigger
      // Inside fetchAnalytics function after receiving data
const totalExp = data.allStats?.find((s: any) => s._id === "expense")?.total || 0;
const totalInc = data.allStats?.find((s: any) => s._id === "income")?.total || 0;
const totalSavings = data.allStats?.find((s: any) => s._id === "savings")?.total || 0;

// NEW: Sort by expense but check if any spending actually exists
const sortedByExpense = [...formattedBars].sort((a, b) => b.expense - a.expense);
const topDay = sortedByExpense[0];

// Only set a "Highest Day" if the amount spent is greater than zero
const hasSpending = topDay && topDay.expense > 0;

setStats({
  weeklyAvg: Math.round(totalExp / 4) || 0,
  savingsRate: totalInc > 0 ? Math.round(((totalInc - totalExp) / totalInc) * 100) : 0,
  highestSpendDay: hasSpending ? topDay.day : "None",
  highestSpendAmount: hasSpending ? topDay.expense : 0,
  projectedSavings: (totalInc + totalSavings) - totalExp,
  efficiency: totalInc > 0 ? Math.min(100, Math.round((totalExp / totalInc) * 100)) : 0
});

    } catch (err) {
      toast.error("Connecting to server...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchAnalytics();
  }, [session, status]);


  if (loading) return (
    <Loading/>
  );

  

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div>
              
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Advanced Analytics</h1>
              <p className="text-slate-500">Insights for {session?.user?.name || "User"}</p>
            </div>
          </header>

          {last7DaysData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <SearchX className="text-slate-300" size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Transactions Found</h3>
              <p className="text-slate-400 mt-1 max-w-xs text-center text-sm">Add your first income or expense to start seeing detailed analytics.</p>
              <button onClick={() => router.push("/dashboard")} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                Add Transaction
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 1. Bar Chart Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-112.5">
                  <div className="flex items-center justify-between mb-6 relative">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><BarChart3 size={20} /></div>
                      <h3 className="font-bold text-lg capitalize">{activeFilter} - Last 7 Days</h3>
                    </div>
                    <div className="relative">
                      <MoreVertical size={20} className="text-slate-400 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
                      {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-2">
                          {["all", "income", "expense", "savings"].map((type) => (
                            <button key={type} onClick={() => { setActiveFilter(type); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm font-bold capitalize hover:bg-slate-50 ${activeFilter === type ? "text-blue-600" : "text-slate-600"}`}>
                              {type}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(value) => `₹${formatCurrency(value)}`}/>
<Tooltip 
  cursor={{ fill: '#f8fafc' }} 
  contentStyle={{ 
    borderRadius: '24px', 
    border: 'none', 
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', 
    padding: '20px' 
  }}
  //@ts-ignore
  formatter={(value: number, name: string) => {
    // This adds the label (Income, Expense, or Savings) before the amount
    return [`₹${formatCurrency(value)}`, name];
  }}
/>                        {(activeFilter === "all" || activeFilter === "income") && <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={activeFilter === "all" ? 12 : 35} />}
                        {(activeFilter === "all" || activeFilter === "expense") && <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={activeFilter === "all" ? 12 : 35} />}
                        {(activeFilter === "all" || activeFilter === "savings") && <Bar dataKey="savings" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={activeFilter === "all" ? 12 : 35} />}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Line Chart Card with "First Month" Overlay */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-112.5 relative">
  {/* Header Container: Added justify-between to space out the title and the card */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
        <History size={20} />
      </div>
      <h3 className="font-bold text-lg">Monthly Spending Pattern</h3>
    </div>

    {/* NEW: Placed directly in the header flex row */}
    {!hasLastMonthData && (
      <div className="bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100 hidden sm:block">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest whitespace-nowrap">
          First Month Detected
        </p>
      </div>
    )}
  </div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyComparisonData} margin={{ top: 10, right: 20, left: -3, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(value) => `₹${formatCurrency(value)}`} />
                        <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        //@ts-ignore
                        formatter={(value: number, name: string) => {
    return [`₹${formatCurrency(value)}`, name];
  }}/>
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Line type="monotone" dataKey="thisMonth" name="This Month" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, fill: "#2563eb" }} />
                        {hasLastMonthData && <Line type="monotone" dataKey="lastMonth" name="Last Month" stroke="#cbd5e1" strokeWidth={3} strokeDasharray="5 5" dot={false} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* 3. Quick Stats Cards - Fully Implemented */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:scale-[1.02]">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Weekly Average</p>
                  <h4 className="text-2xl font-black text-slate-800">₹{stats.weeklyAvg.toLocaleString("en-IN")}</h4>
                  <p className="text-slate-400 text-xs mt-2 italic font-medium">Avg. weekly burn rate</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:scale-[1.02]">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Highest Spend Day</p>
                  <h4 className="text-2xl font-black text-slate-800">{stats.highestSpendDay}</h4>
                  <p className="text-rose-500 text-xs mt-1 font-bold">₹{stats.highestSpendAmount.toLocaleString("en-IN")} spent</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:scale-[1.02]">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Savings Rate</p>
                  <h4 className="text-2xl font-black text-slate-800">{stats.savingsRate}%</h4>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-700" style={{ width: `${stats.savingsRate}%` }}></div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:scale-[1.02]">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Projected Net</p>
                  <h4 className="text-2xl font-black text-slate-800">₹{stats.projectedSavings.toLocaleString("en-IN")}</h4>
                  <p className="text-slate-400 text-xs mt-1 italic font-medium">Estimated monthly surplus</p>
                </div>

                <div className={`${bg} p-6 rounded-3xl shadow-xl transition-transform hover:scale-[1.02]`}>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Financial Status</p>
                  <h4 className={`text-2xl font-black ${color}`}>{stats.savingsRate > 20 ? "Healthy" : "Watchful"}</h4>
                  <p className="text-emerald-400 text-xs mt-2 font-bold flex items-center">
                    <Zap size={12} className="mr-1" /> Tracking Real-time
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:scale-[1.02]">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Expense/Income Efficiency</p>
                  <h4 className="text-2xl font-black text-slate-800">{stats.efficiency}%</h4>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-3">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-700" style={{ width: `${stats.efficiency}%` }}></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}