

"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Plus,
  Loader2,
  AlertCircle,
  Tag,
  ArrowDownRight,
  Sparkles,
  X,
  BrainCircuit,
  Lightbulb,
  Target,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Modal from "@/components/Modal";
import AddBalanceForm from "@/components/AddBalanceForm";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ViewTransactions from "@/components/ViewTransactions";
import AddExpenseForm from "@/components/AddExpenseForm";
import Loading from "../loading";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>(null);
  // const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(data ? false : true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // AI States
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  const getCategoryColor = (label: string) => {
    switch (label) {
      case "Food & Drinks":
        return "bg-orange-400";
      case "Shopping":
        return "bg-purple-500";
      case "Transport":
        return "bg-blue-400";
      case "Enjoyment":
        return "bg-amber-300";
      case "Bills":
        return "bg-teal-400";
      case "Health":
        return "bg-rose-500";
      case "Education":
        return "bg-indigo-500";
      case "Personal Care":
        return "bg-cyan-500";
      case "Miscellaneous":
        return "bg-slate-500";
      default:
        return "bg-slate-400";
    }
  };

  const fetchDashboardData = async (isInitialLoad = false) => {
    if (status === "unauthenticated") return router.push("/login");
    if (status === "authenticated" && session?.user?.id) {
      try {
        // Only show the full-screen loader if it's the very first time
        if (isInitialLoad) setLoading(true);

        const response = await fetch(
          `/api/dashboard/stats?userId=${session.user.id}`,
        );
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };
  const getAIInsights = async () => {
    // 1. Check if we already have insights for this month/data to save quota
    const cachedInsights = localStorage.getItem("spendly_ai_cache");
    if (cachedInsights && !isAiLoading) {
      // You could optionally return here if you want to be very strict with quota
    }

    try {
      setIsAiLoading(true);
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryData: data?.categories,
          monthlySpend: data?.monthlySpend,
          userName: session?.user?.name,
          totalSavings: data?.totalSavings,
          balance: data?.balance,
        }),
      });

      const result = await response.json();

      if (response.status === 429) {
        toast.error("AI is resting! Try again in a minute.");
        return;
      }

      setAiInsights(result.insights);
      // 2. Cache the result
      localStorage.setItem("spendly_ai_cache", result.insights);
    } catch (error) {
      toast.error("AI Service Busy");
    } finally {
      setIsAiLoading(false);
    }
  };

  const calculateChange = (current: number, previous: number) => {
    if (!previous || previous === 0) return "0%";
    const diff = ((current - previous) / previous) * 100;
    return `${diff > 0 ? "+" : ""}${diff.toFixed(0)}%`;
  };

  // useEffect(() => {
  //   fetchDashboardData();
  // }, [session, status]);

  useEffect(() => {
    fetchDashboardData(!data);
  }, [session, status]);

  if (status === "loading" || loading) return <Loading />;

  const displayBalance = data?.balance < 0 ? 0 : data?.balance || 0;
  const displaySavings = data?.totalSavings < 0 ? 0 : data?.totalSavings || 0;
  const balanceChange = calculateChange(
    data?.balance || 0,
    (data as any)?.prevBalance || 0,
  );
  const spendChange = calculateChange(
    data?.monthlySpend || 0,
    (data as any)?.prevMonthlySpend || 0,
  );
  const savingsChange = calculateChange(
    data?.totalSavings || 0,
    (data as any)?.prevTotalSavings || 0,
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 relative overflow-hidden">
      {/* <Sidebar /> */}

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              Welcome back, {session?.user?.name || "User"}!
            </h2>
            <p className="text-slate-500">Your financial control center.</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsBalanceModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg transition active:scale-95"
            >
              <Plus size={18} /> <span>Add Balance</span>
            </button>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-medium shadow-lg transition active:scale-95"
            >
              <Plus size={18} /> <span>Add Expense</span>
            </button>
          </div>
        </header>

        {/* 1. Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            amount={`₹${displayBalance.toLocaleString("en-IN")}`}
            change={balanceChange}
            trend={parseFloat(balanceChange) >= 0 ? "up" : "down"}
            color="bg-blue-600"
            isMain
          />
          <StatCard
            title="Monthly Spend"
            amount={`₹${data?.monthlySpend?.toLocaleString("en-IN") || "0"}`}
            change={spendChange}
            trend={parseFloat(spendChange) <= 0 ? "up" : "down"}
            color="bg-white"
          />
          <StatCard
            title="Total Savings"
            amount={`₹${displaySavings.toLocaleString("en-IN")}`}
            change={savingsChange}
            trend={parseFloat(savingsChange) >= 0 ? "up" : "down"}
            color="bg-white"
          />
        </div>

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Recent Transactions</h3>
              <button
                onClick={() => router.push("/transactions")}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-sm uppercase tracking-wider border-b border-slate-50">
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Source</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.transactions?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-slate-400 font-medium"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    data?.transactions?.map((tx: any) => (
                      <ViewTransactions
                        key={tx._id}
                        id={tx._id}
                        name={tx.description || tx.category}
                        cat={tx.category}
                        source={tx.source}
                        date={new Date(tx.date).toLocaleDateString("en-GB")}
                        amount={`${tx.type === "expense" || (tx.type === "savings" && tx.amount < 0) ? "-" : "+"}₹${Math.abs(tx.amount).toLocaleString("en-IN")}`}
                        isNeg={
                          tx.type === "expense" ||
                          (tx.type === "savings" && tx.amount < 0)
                            ? "expense"
                            : tx.type
                        }
                        onDeleteSuccess={fetchDashboardData}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* top categories */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-125">
   <h3 className="font-bold text-lg mb-6">Top Categories</h3>

   {/* Added a scrollable container with fixed flex-grow and custom scrollbar styling */}
   <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
     {data && data.monthlySpend > 0 ? (
      data?.categories?.map((cat:any) => (
        <CategoryItem
          key={cat.label}
          label={cat.label}
          value={cat.value}
          color={getCategoryColor(cat.label)}
        />
      ))
    ) : (
      <div className="py-10 text-center">
        <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <Tag className="text-slate-300" size={24} />
        </div>
        <p className="text-sm text-slate-500 font-medium">
          No spending data yet.
        </p>
        <p className="text-xs text-slate-400 mt-1 font-bold">
          Monthly Spend resets to 0 after every month.
        </p>
      </div>
    )}
  </div>
</div>






        </div>

        {/* --- FLOATING AI ASSISTANT START --- */}
        <button
          onClick={() => setIsAiPanelOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
        >
          <Sparkles size={28} className="fill-white/20" />
        </button>

        {isAiPanelOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setIsAiPanelOpen(false)}
            />

            <div className="relative w-full max-w-md h-full bg-white/80 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-white/40 p-8 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <BrainCircuit size={24} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-slate-800">
                    Spendly Genius
                  </h3>
                </div>
                <button
                  onClick={() => setIsAiPanelOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
                <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-100">
                  <p className="text-sm opacity-80 mb-1">Total Monthly Spend</p>
                  <h4 className="text-3xl font-bold">
                    ₹{data?.monthlySpend?.toLocaleString("en-IN")}
                  </h4>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    AI Analysis
                  </h5>

                  {!aiInsights && !isAiLoading ? (
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                      <Lightbulb
                        size={32}
                        className="mx-auto text-amber-400 mb-3"
                      />
                      <p className="text-sm text-slate-600 mb-4">
                        Click below to generate a professional strategy for your
                        spending patterns.
                      </p>
                      <button
                        onClick={getAIInsights}
                        className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-black transition"
                      >
                        Analyze Patterns
                      </button>
                    </div>
                  ) : isAiLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2
                        className="animate-spin text-blue-600 mb-4"
                        size={40}
                      />
                      <p className="text-sm font-medium text-slate-500">
                        Scanning categories...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-black/10 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-5 space-y-4">
                          <p className="text-blue-900 text-xs font-bold uppercase tracking-widest px-2">
                            {aiInsights?.split("\n")[0]}
                          </p>
                          {aiInsights?.split("- ").map((line, index) => {
                            if (!line.trim() || index === 0) return null;
                            const isSummary = line.includes("[SUMMARY]");
                            const isGoal = line.includes("[GOAL]");
                            const isTip = line.includes("[TIP]");

                            return (
                              <div
                                key={index}
                                className={`p-4 rounded-2xl border transition-all ${
                                  isSummary
                                    ? "bg-blue-600/10 border-blue-400/30"
                                    : isGoal
                                      ? "bg-emerald-500/10 border-emerald-400/20 border-dashed"
                                      : "bg-white/40 border-white/20"
                                }`}
                              >
                                <div className="flex gap-3">
                                  <div className="mt-1">
                                    {isSummary && (
                                      <BrainCircuit
                                        size={18}
                                        className="text-blue-600"
                                      />
                                    )}
                                    {isTip && (
                                      <Lightbulb
                                        size={18}
                                        className="text-black"
                                      />
                                    )}
                                    {isGoal && (
                                      <Target
                                        size={18}
                                        className="text-emerald-600"
                                      />
                                    )}
                                  </div>
                                  <p
                                    className={`text-sm leading-relaxed ${
                                      isSummary
                                        ? "text-blue-900 font-semibold"
                                        : isGoal
                                          ? "text-emerald-900 font-bold"
                                          : "text-slate-700"
                                    }`}
                                  >
                                    {line
                                      .replace(
                                        /\[SUMMARY\]|\[TIP\]|\[GOAL\]/g,
                                        "",
                                      )
                                      .trim()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        onClick={getAIInsights}
                        className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline px-2"
                      >
                        Regenerate Audit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">
                  Powered by Spendly Intelligence
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        title="Manage Balance & Savings"
      >
        <AddBalanceForm
          userId={(session?.user as any)?.id}
          onSuccess={() => {
            setIsBalanceModalOpen(false);
            fetchDashboardData();
          }}
        />
      </Modal>
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Add New Expense"
      >
        <AddExpenseForm
          userId={(session?.user as any)?.id}
          onSuccess={() => {
            setIsExpenseModalOpen(false);
            fetchDashboardData();
          }}
        />
      </Modal>
    </div>
  );
};

const StatCard = ({
  title,
  amount,
  change,
  trend,
  color,
  isMain = false,
}: any) => {
  const isPositive = trend === "up";

  // FUNCTION TO FORMAT LARGE NUMBERS (Optional but recommended for Resume projects)
  // This turns 1000000 into 10L or 1M depending on your preference
  const formatCompact = (amtStr: string) => {
    const numericValue = parseInt(amtStr.replace(/[^0-9]/g, ""));
    if (isNaN(numericValue)) return amtStr;

    if (numericValue >= 10000000) return `₹${(numericValue / 10000000).toFixed(1)}Cr`;
    if (numericValue >= 100000) return `₹${(numericValue / 100000).toFixed(1)}L`;
    return amtStr;
  };

  return (
    <div
      className={`${
        isMain ? color + " text-white" : "bg-white text-slate-900 border border-slate-200"
      } p-5 md:p-6 rounded-3xl shadow-sm transition-all hover:shadow-md flex flex-col h-full min-w-0`}
    >
      <p className={`${isMain ? "text-blue-100" : "text-slate-500"} text-xs md:text-sm font-bold uppercase tracking-wider`}>
        {title}
      </p>

      <div className="mt-2 flex items-baseline flex-wrap overflow-hidden">
        <h3 
          className={`font-black tracking-tight break-all leading-tight ${
            amount.length > 10 ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
          }`}
        >
          {/* We use a smaller font size if the string is too long */}
          {amount}
        </h3>
      </div>

      <div className="mt-4 mt-auto pt-2">
        <div
          className={`inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
            isMain ? "bg-blue-500 text-white" : isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight size={12} className="mr-1" />
          ) : (
            <ArrowDownRight size={12} className="mr-1" />
          )}{" "}
          {change}
        </div>
      </div>
    </div>
  );
};

const CategoryItem = ({ label, value, color }: any) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="text-slate-600 font-medium">{label}</span>
      <span className="text-slate-900 font-bold">{value}%</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export default Dashboard;
