
// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import { useSession } from "next-auth/react";
// import Sidebar from "@/components/Sidebar";
// import { 
//   format, addMonths, subMonths, startOfMonth, endOfMonth, 
//   startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO 
// } from "date-fns";
// import { 
//   ChevronLeft, ChevronRight, Loader2, BarChart3, TrendingUp, Wallet, Banknote, History,
//   FileDown
// } from "lucide-react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { exportToPDF } from "@/lib/exportUtils";

// // --- STRICT TYPES ---
// interface Transaction {
//   _id: string;
//   description: string;
//   category: string;
//   date: string;
//   amount: number;
//   type: "income" | "expense" | "savings";
//   source?: string;
// }

// interface YearlyData {
//   name: string;
//   income: number;
//   expense: number;
//   savings: number;
// }

// export default function CalendarPage() {
//   const router = useRouter();
//   const { data: session, status } = useSession();
  
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
//   const [loading, setLoading] = useState(true);

//   const formatCurrency = (amount: number) => {
//     return amount.toLocaleString("en-IN");
//   };

//   // --- AUTH REDIRECT ---
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       toast.error("Please, Login First");
//       router.push("/login");
//     }
//   }, [status, router]);

//   // 1. Add this state at the top with your other state hooks
// const [exporting, setExporting] = useState(false);

// // 2. Add this handler function
// const handleExport = async () => {
//   setExporting(true);
//   const monthYear = format(currentMonth, "MMMM yyyy");
  
//   // Use toast.promise to show the loading, success, and error states
//   await toast.promise(
//     exportToPDF(transactions, currentMonth, session?.user?.name || "User"),
//     {
//       loading: 'Preparing your report...',
//       success: `${monthYear} Report Downloaded!`,
//       error: 'Could not generate PDF',
//     }
//   );
//   setExporting(false);
// };

//   const exportpdf = () => (
//   <div className="flex items-center justify-between px-6 py-5 bg-white border-b rounded-t-3xl shadow-sm flex-shrink-0">
//     <div className="flex items-center gap-4">
//       <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
//         <ChevronLeft size={20} />
//       </button>
//       <h2 className="text-2xl font-black text-slate-800 tracking-tight">{format(currentMonth, "MMMM yyyy")}</h2>
//       <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
//         <ChevronRight size={20} />
//       </button>
//     </div>
    
//     <div className="flex items-center gap-4">
//       {/* Updated Button with Loading State */}
//       <button 
//         onClick={handleExport}
//         disabled={exporting}
//         className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
//           exporting 
//           ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
//           : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 shadow-sm"
//         }`}
//       >
//         {exporting ? (
//           <Loader2 className="animate-spin" size={16} /> 
//         ) : (
//           <FileDown size={16} />
//         )}
//         {exporting ? "Generating..." : "Export PDF"}
//       </button>
      
//       <div className="hidden md:flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
//         <TrendingUp size={16} /> Activity Calendar
//       </div>
//     </div>
//   </div>
// );
 

//   // --- CALCULATE TOTALS AT TOP LEVEL (Fixes ReferenceError) ---
//   const { selectedTxs, income, expense, savings } = useMemo(() => {
//     const filtered = transactions.filter(t => isSameDay(parseISO(t.date), selectedDate));
//     const inc = filtered.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
//     const exp = filtered.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
//     const sav = filtered.filter(t => t.type === "savings").reduce((acc, t) => acc + t.amount, 0);
//     return { selectedTxs: filtered, income: inc, expense: exp, savings: sav };
//   }, [transactions, selectedDate]);

//   const fetchCalendarData = async () => {
//     if (!session?.user?.id) return;
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/calendar?userId=${session.user.id}&month=${currentMonth.getMonth()}&year=${currentMonth.getFullYear()}&mode=month`);
//       const data = await res.json();
//       setTransactions(data);

//       const yearRes = await fetch(`/api/calendar?userId=${session.user.id}&year=${currentMonth.getFullYear()}&mode=year`);
//       const yearData = await yearRes.json();
      
//       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//       const formattedYear = months.map((m, i) => {
//         const found = yearData.find((d: any) => d._id === i + 1);
//         return { 
//           name: m, 
//           income: found?.income || 0,
//           expense: found?.expense || 0, 
//           savings: found?.savings || 0 
//         };
//       });
//       setYearlyData(formattedYear);
//     } catch (err) {
//       toast.error("Connecting to server...");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (status === "authenticated") fetchCalendarData();
//   }, [currentMonth, session, status]);

//   const renderHeader = () => (
//     <div className="flex items-center justify-between px-6 py-5 bg-white border-b rounded-t-3xl shadow-sm flex-shrink-0">
//       <div className="flex items-center gap-4">
//         <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={20} /></button>
//         <h2 className="text-2xl font-black text-slate-800 tracking-tight">{format(currentMonth, "MMMM yyyy")}</h2>
//         <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight size={20} /></button>
//       </div>
//       <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest"><TrendingUp size={16} /> Activity Calendar</div>
//     </div>
//   );

//   const renderCells = () => {
//     const monthStart = startOfMonth(currentMonth);
//     const monthEnd = endOfMonth(monthStart);
//     const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
//     const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

//     const rows = [];
//     let days = [];
//     let day = startDate;

//     while (day <= endDate) {
//       for (let i = 0; i < 7; i++) {
//         const cloneDay = day;
//         const dayTxs = transactions.filter(t => isSameDay(parseISO(t.date), cloneDay));
//         const dayInc = dayTxs.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
//         const dayExp = dayTxs.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
//         const daySav = dayTxs.filter(t => t.type === "savings").reduce((acc, t) => acc + t.amount, 0);

//         days.push(
//           <div
//             key={day.toString()}
//             onClick={() => setSelectedDate(cloneDay)}
//             className={`h-24 border-r border-b p-2 transition-all cursor-pointer relative ${!isSameMonth(day, monthStart) ? "bg-slate-50/50 text-slate-300" : "bg-white hover:bg-blue-50/40"} ${isSameDay(day, selectedDate) ? "ring-2 ring-inset ring-blue-500 z-10" : ""}`}
//           >
//             <span className={`text-sm font-bold ${isSameDay(day, new Date()) ? "text-blue-600 underline decoration-2 underline-offset-4" : ""}`}>{format(day, "d")}</span>
//             <div className="mt-1 flex flex-col gap-0.5">
//               {dayInc > 0 && <span className="text-[9px] font-bold text-emerald-500">+₹{formatCurrency(dayInc)}</span>}
//               {dayExp > 0 && <span className="text-[9px] font-bold text-rose-500">-₹{formatCurrency(dayExp)}</span>}
//               {daySav > 0 && <span className="text-[9px] font-bold text-yellow-600">S: ₹{formatCurrency(daySav)}</span>}
//             </div>
//           </div>
//         );
//         day = addDays(day, 1);
//       }
//       rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
//       days = [];
//     }
//     return <div className="border-l border-t shadow-sm flex-1">{rows}</div>;
//   };

//   if (status === "loading") return (
//     <div className="flex h-screen items-center justify-center bg-slate-50">
//       <Loader2 className="animate-spin text-blue-600" size={48} />
//     </div>
//   );

//   return (
//     <div className="flex h-screen bg-[#f8fafc] font-sans">
//       <Sidebar />
//       <main className="flex-1 p-6 md:p-10 overflow-y-auto">
//         <div className="max-w-400 mx-auto space-y-10">
          
//           <div className="flex flex-col xl:flex-row gap-8 items-stretch">
//             {/* Calendar Section (Left) - MATCH HEIGHT */}
//             <div className="xl:w-2/3 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-152.5">
//               {exportpdf()}
//               <div className="grid grid-cols-7 bg-slate-50/50 border-y border-slate-100 text-[11px] font-black uppercase text-slate-400 py-4 text-center flex-shrink-0">
//                 {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d}>{d}</div>)}
//               </div>
//               <div className="flex-1 overflow-hidden flex flex-col">
//                 {loading ? (
//                   <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
//                 ) : renderCells()}
//               </div>
//             </div>

//             {/* Daily Transactions Panel (Right) - FIXED HEIGHT PREVENTS GROWING */}
//             <div className="xl:w-1/3 flex flex-col">
//               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-152.5 overflow-hidden">
//                 <div className="p-8 border-b border-slate-50 shrink-0">
//                    <div className="flex justify-between items-start mb-6">
//                       <div>
//                         <h3 className="font-black text-slate-900 text-2xl tracking-tight">{format(selectedDate, "do MMM")}</h3>
//                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{format(selectedDate, "yyyy")}</p>
//                       </div>
//                       <div className="text-right">
//                         <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Day Summary</span>
//                       </div>
//                    </div>
                   
//                    <div className="grid grid-cols-3 gap-2">
//                       <div className="bg-emerald-50/50 p-3 rounded-2xl text-center">
//                         <p className="text-[9px] font-black text-emerald-600/60 uppercase">In</p>
//                         <p className="text-xs font-black text-emerald-600">₹{formatCurrency(income)}</p>
//                       </div>
//                       <div className="bg-rose-50/50 p-3 rounded-2xl text-center">
//                         <p className="text-[9px] font-black text-rose-600/60 uppercase">Out</p>
//                         <p className="text-xs font-black text-rose-600">₹{formatCurrency(expense)}</p>
//                       </div>
//                       <div className="bg-amber-50/50 p-3 rounded-2xl text-center">
//                         <p className="text-[9px] font-black text-amber-600/60 uppercase">Saved</p>
//                         <p className="text-xs font-black text-amber-600">₹{formatCurrency(savings)}</p>
//                       </div>
//                    </div>
//                 </div>

//                 {/* SCROLLABLE LIST - flex-1 and overflow-y-auto enables the scrollbar */}
//                 <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
//   {selectedTxs.length === 0 ? (
//     <div className="h-full flex flex-col items-center justify-center opacity-40">
//        <History size={48} className="text-slate-200 mb-2" />
//        <p className="text-sm font-bold text-slate-400">Rest day! No transactions.</p>
//     </div>
//   ) : (
//     selectedTxs.map(tx => (
//       <div key={tx._id} className="group flex justify-between items-center p-5 bg-slate-50/40 rounded-3xl hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
//         <div className="flex items-center gap-4">
//            {/* Icon Background Logic: Green for Income, Red for Expense, Yellow for Savings */}
//            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
//              tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 
//              tx.type === 'expense' ? 'bg-rose-100 text-rose-600' : 
//              'bg-amber-100 text-yellow-500'
//            }`}>
//              {tx.source === 'savings' ? <Banknote size={20} /> : <Wallet size={20} />}
//            </div>
//            <div>
//               <p className="text-sm font-black text-slate-800 leading-tight">{tx.description || tx.category}</p>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 flex items-center gap-1">
//                 Source: {tx.source || 'balance'}
//               </p>
//            </div>
//         </div>
        
//         {/* Text Color Logic: Emerald for Income, Rose for Expense, Amber for Savings */}
//         <span className={`text-base font-black ${
//           tx.type === 'income' ? 'text-emerald-500' : 
//           tx.type === 'expense' ? 'text-rose-500' : 
//           'text-yellow-500'
//         }`}>
//           {tx.type === 'expense' ? '-' : '+'}₹{formatCurrency(tx.amount)}
//         </span>
//       </div>
//     ))
//   )}
// </div>

//               </div>
//             </div>
//           </div>

//           {/* Yearly Performance Section */}
//           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm w-full">
//             {/* ... Yearly Chart UI ... */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-100">
//                   <BarChart3 size={28} />
//                 </div>
//                 <div>
//                   <h3 className="font-black text-slate-900 text-2xl tracking-tight uppercase">Yearly Performance</h3>
//                   <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-1">Summary {currentMonth.getFullYear()}</p>
//                 </div>
//               </div>
//               <div className="flex bg-slate-50 p-2 rounded-2xl gap-2">
//                 {[
//                   { label: "Income", color: "#10b981" },
//                   { label: "Expense", color: "#ef4444" },
//                   { label: "Savings", color: "#f59e0b" }
//                 ].map((item) => (
//                   <div key={item.label} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
//                     <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
//                     <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">{item.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="h-[450px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 900, fill: "black" }} dy={15} />
//                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "black" }} tickFormatter={(value) => `₹${formatCurrency(value)}`} />
//                  <Tooltip 
//   cursor={{ fill: '#f8fafc' }} 
//   contentStyle={{ 
//     borderRadius: '24px', 
//     border: 'none', 
//     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', 
//     padding: '20px' 
//   }}
//   //@ts-ignore
//   formatter={(value: number, name: string) => {
//     // This adds the label (Income, Expense, or Savings) before the amount
//     return [`₹${formatCurrency(value)}`, name];
//   }}
// />
//                   <Bar name="Income" dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} barSize={35} />
//                   <Bar name="Expense" dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} barSize={35} />
//                   <Bar name="Savings" dataKey="savings" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={35} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO 
} from "date-fns";
import { 
  ChevronLeft, ChevronRight, Loader2, BarChart3, TrendingUp, Wallet, Banknote, History,
  FileDown, Calendar as CalendarIcon
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { exportToPDF } from "@/lib/exportUtils";

// --- STRICT TYPES ---
interface Transaction {
  _id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense" | "savings";
  source?: string;
}

interface YearlyData {
  name: string;
  income: number;
  expense: number;
  savings: number;
}

export default function CalendarPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN");
  };

  // --- AUTH REDIRECT ---
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please, Login First");
      router.push("/login");
    }
  }, [status, router]);

  const handleExport = async () => {
    setExporting(true);
    const monthYear = format(currentMonth, "MMMM yyyy");
    await toast.promise(
      exportToPDF(transactions, currentMonth, session?.user?.name || "User"),
      {
        loading: 'Preparing your report...',
        success: `${monthYear} Report Downloaded!`,
        error: 'Could not generate PDF',
      }
    );
    setExporting(false);
  };

  const exportpdf = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 md:py-5 bg-white border-b rounded-t-4xl md:rounded-t-3xl shadow-sm flex-shrink-0 gap-4">
      <div className="flex items-center gap-2 md:gap-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight whitespace-nowrap">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <button 
          onClick={handleExport}
          disabled={exporting}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border flex-1 sm:flex-none ${
            exporting 
            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
            : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 shadow-sm"
          }`}
        >
          {exporting ? <Loader2 className="animate-spin" size={14} /> : <FileDown size={14} />}
          {exporting ? "Wait..." : "Export"}
        </button>
        
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
          <TrendingUp size={14} className="hidden sm:block" /> Activity
        </div>
      </div>
    </div>
  );

  const { selectedTxs, income, expense, savings } = useMemo(() => {
    const filtered = transactions.filter(t => isSameDay(parseISO(t.date), selectedDate));
    const inc = filtered.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const exp = filtered.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    const sav = filtered.filter(t => t.type === "savings").reduce((acc, t) => acc + t.amount, 0);
    return { selectedTxs: filtered, income: inc, expense: exp, savings: sav };
  }, [transactions, selectedDate]);

  const fetchCalendarData = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/calendar?userId=${session.user.id}&month=${currentMonth.getMonth()}&year=${currentMonth.getFullYear()}&mode=month`);
      const data = await res.json();
      setTransactions(data);

      const yearRes = await fetch(`/api/calendar?userId=${session.user.id}&year=${currentMonth.getFullYear()}&mode=year`);
      const yearData = await yearRes.json();
      
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedYear = months.map((m, i) => {
        const found = yearData.find((d: any) => d._id === i + 1);
        return { 
          name: m, 
          income: found?.income || 0,
          expense: found?.expense || 0, 
          savings: found?.savings || 0 
        };
      });
      setYearlyData(formattedYear);
    } catch (err) {
      toast.error("Connecting to server...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchCalendarData();
  }, [currentMonth, session, status]);

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayTxs = transactions.filter(t => isSameDay(parseISO(t.date), cloneDay));
        const dayInc = dayTxs.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
        const dayExp = dayTxs.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
        const daySav = dayTxs.filter(t => t.type === "savings").reduce((acc, t) => acc + t.amount, 0);

        days.push(
          <div
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
            className={`h-20 md:h-24 border-r border-b p-1 md:p-2 transition-all cursor-pointer relative ${!isSameMonth(day, monthStart) ? "bg-slate-50/50 text-slate-300" : "bg-white hover:bg-blue-50/40"} ${isSameDay(day, selectedDate) ? "ring-2 ring-inset ring-blue-500 z-10" : ""}`}
          >
            <span className={`text-[10px] md:text-sm font-bold ${isSameDay(day, new Date()) ? "text-blue-600 underline decoration-2 underline-offset-4" : ""}`}>{format(day, "d")}</span>
            <div className="mt-0.5 md:mt-1 flex flex-col gap-0.5 overflow-hidden">
              {dayInc > 0 && <span className="text-[7px] md:text-[9px] font-black text-emerald-500 truncate">+{formatCurrency(dayInc)}</span>}
              {dayExp > 0 && <span className="text-[7px] md:text-[9px] font-black text-rose-500 truncate">-{formatCurrency(dayExp)}</span>}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="border-l border-t shadow-sm flex-1">{rows}</div>;
  };

  if (status === "loading") return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f8fafc] font-sans">
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">
          
          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 items-stretch">
            {/* Calendar Section */}
            <div className="w-full xl:w-2/3 bg-white rounded-4xl md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-125 md:h-152.5">
              {exportpdf()}
              <div className="grid grid-cols-7 bg-slate-50/50 border-y border-slate-100 text-[9px] md:text-[11px] font-black uppercase text-slate-400 py-3 md:py-4 text-center">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
              </div>
              <div className="flex-1 overflow-hidden flex flex-col">
                {loading ? (
                  <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
                ) : renderCells()}
              </div>
            </div>

            {/* Daily Transactions Panel */}
            <div className="w-full xl:w-1/3 flex flex-col">
              <div className="bg-white rounded-4xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-125 md:h-152.5 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-50 shrink-0">
                   <div className="flex justify-between items-start mb-4 md:mb-6">
                      <div>
                        <h3 className="font-black text-slate-900 text-xl md:text-2xl tracking-tight">{format(selectedDate, "do MMM")}</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{format(selectedDate, "yyyy")}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Summary</span>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-2">
                      <div className="bg-emerald-50/50 p-2 md:p-3 rounded-2xl text-center">
                        <p className="text-[8px] font-black text-emerald-600/60 uppercase">In</p>
                        <p className="text-[10px] md:text-xs font-black text-emerald-600">₹{formatCurrency(income)}</p>
                      </div>
                      <div className="bg-rose-50/50 p-2 md:p-3 rounded-2xl text-center">
                        <p className="text-[8px] font-black text-rose-600/60 uppercase">Out</p>
                        <p className="text-[10px] md:text-xs font-black text-rose-600">₹{formatCurrency(expense)}</p>
                      </div>
                      <div className="bg-amber-50/50 p-2 md:p-3 rounded-2xl text-center">
                        <p className="text-[8px] font-black text-amber-600/60 uppercase">Save</p>
                        <p className="text-[10px] md:text-xs font-black text-amber-600">₹{formatCurrency(savings)}</p>
                      </div>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 custom-scrollbar">
                  {selectedTxs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                       <History size={40} className="text-slate-200 mb-2" />
                       <p className="text-xs font-bold text-slate-400 text-center">No transactions on this date.</p>
                    </div>
                  ) : (
                    selectedTxs.map(tx => (
                      <div key={tx._id} className="group flex justify-between items-center p-3 md:p-5 bg-slate-50/40 rounded-3xl md:rounded-3xl hover:bg-white border border-transparent hover:border-slate-100 transition-all duration-300">
                        <div className="flex items-center gap-3 md:gap-4">
                           <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${
                             tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 
                             tx.type === 'expense' ? 'bg-rose-100 text-rose-600' : 
                             'bg-amber-100 text-yellow-500'
                           }`}>
                             {tx.source === 'savings' ? <Banknote size={18} /> : <Wallet size={18} />}
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs md:text-sm font-black text-slate-800 leading-tight truncate">{tx.description || tx.category}</p>
                              <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase truncate mt-1">Source: {tx.source || 'balance'}</p>
                           </div>
                        </div>
                        <span className={`text-xs md:text-base font-black whitespace-nowrap ml-2 ${
                          tx.type === 'income' ? 'text-emerald-500' : 
                          tx.type === 'expense' ? 'text-rose-500' : 
                          'text-yellow-500'
                        }`}>
                          {tx.type === 'expense' ? '-' : '+'}₹{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Yearly Performance Section */}
          <div className="bg-white p-6 md:p-10 rounded-4xl md:rounded-[3rem] border border-slate-100 shadow-sm w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 md:p-4 bg-indigo-600 text-white rounded-2xl md:rounded-3xl shadow-xl shadow-indigo-100">
                  
<BarChart3 className="w-6 h-6 md:w-7 md:h-7" />                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg md:text-2xl tracking-tight uppercase">Yearly Analytics</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{currentMonth.getFullYear()} Performance</p>
                </div>
              </div>
              <div className="flex flex-wrap bg-slate-50 p-2 rounded-2xl gap-2">
                {[
                  { label: "In", color: "#10b981" },
                  { label: "Out", color: "#ef4444" },
                  { label: "Save", color: "#f59e0b" }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[9px] font-black uppercase text-slate-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-75 md:h-112.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "black" }} dy={10} />
                  <YAxis hide={window.innerWidth < 768} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "black" }} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    //@ts-ignore
                    formatter={(value: number, name: string) => [`₹${formatCurrency(value)}`, name]}
                  />
                  <Bar name="Income" dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={window.innerWidth < 768 ? 8 : 25} />
                  <Bar name="Expense" dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={window.innerWidth < 768 ? 8 : 25} />
                  <Bar name="Savings" dataKey="savings" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={window.innerWidth < 768 ? 8 : 25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}