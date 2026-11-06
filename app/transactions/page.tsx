
// "use client";

// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { 
//   ChevronLeft, ChevronRight, Loader2, Search, Filter, 
//   CheckSquare, Square, CalendarDays, X, ListFilter, TrendingDown, Layers
// } from "lucide-react";
// import Sidebar from "./../../components/Sidebar";
// import ViewTransactions from "./../../components/ViewTransactions";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import Loading from "../loading";

// const CATEGORIES = ["Food & Drinks", "Shopping", "Transport", "Enjoyment", "Bills", "Health", "Education", "Personal Care", "Miscellaneous"];
// const TYPES = [{ label: "Balance", value: "income" }, { label: "Savings", value: "savings" }, { label: "Expense", value: "expense" }];

// export default function Transactions() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [globalTotal, setGlobalTotal] = useState<number>(0); // State for the API-provided total

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
//   const [showAllTime, setShowAllTime] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);

//   const fetchTransactions = async (page: number) => {
//     if (status !== "authenticated" || !session?.user) return;
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         userId: session?.user?.id as string,
//         page: page.toString(),
//         search: searchQuery,
//         categories: selectedCategories.join(","),
//         types: selectedTypes.join(","),
//         allTime: showAllTime.toString(),
//         month: selectedMonth 
//       });
//       const response = await fetch(`/api/transactions?${params.toString()}`);
//       if (!response.ok) throw new Error("Failed to fetch");
//       const data = await response.json();
      
//       setTransactions(data.transactions || []);
//       setTotalPages(data.totalPages || 1);
//       setCurrentPage(data.currentPage || 1);
//       // Ensure your backend returns this totalFilteredAmount field
//       setGlobalTotal(data.totalFilteredAmount || 0); 
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (status === "authenticated") {
//       const timeoutId = setTimeout(() => fetchTransactions(currentPage), 300);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [session, status, currentPage, searchQuery, selectedCategories, selectedTypes, showAllTime, selectedMonth]);

//   if (status === "loading") return <Loading />;

//   return (
//     <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
//       <Sidebar />
//       <main className="flex-1 p-4 md:p-8 overflow-y-auto">
//         <div className="max-w-6xl mx-auto space-y-4">
          
//           {/* COMPACT FILTER COMMAND CENTER */}
//           <div className="bg-white rounded-4xl border border-slate-200 shadow-xl shadow-slate-200/40 p-2">
//             <div className="flex flex-col lg:flex-row gap-2">
              
//               {/* Primary Filters (Search & Time) */}
//               <div className="flex flex-1 items-center gap-2 p-2 bg-slate-50 rounded-3xl border border-slate-100">
//                 <div className="flex-1 relative group">
//                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
//                   <input 
//                     type="text" 
//                     placeholder="Search descriptions (e.g. Milk)..." 
//                     value={searchQuery} 
//                     onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
//                     className="w-full bg-transparent pl-12 pr-4 py-3 outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400"
//                   />
//                 </div>
//                 <div className="h-8 w-px bg-slate-200 hidden md:block" />
//                 <div className="flex items-center gap-2 px-2">
//                   <input 
//                     type="month" 
//                     disabled={showAllTime} 
//                     value={selectedMonth} 
//                     onChange={(e) => {setSelectedMonth(e.target.value); setCurrentPage(1);}} 
//                     className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
//                   />
//                 </div>
//               </div>

//               {/* Quick Actions */}
//               <div className="flex items-center gap-2 px-2 py-2 lg:py-0">
//                 <button 
//                   onClick={() => {setShowAllTime(!showAllTime); setCurrentPage(1);}} 
//                   className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${showAllTime ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
//                 >
//                   {showAllTime ? <CheckSquare size={16} /> : <Layers size={16} />}
//                   All Time
//                 </button>
//                 <button onClick={() => {setSearchQuery(""); setSelectedCategories([]); setSelectedTypes([]); setShowAllTime(false); setCurrentPage(1); toast.success("Filters Cleared");}} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Sub-Filters (Types & Categories) */}
//             <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4 border-t border-slate-50 mt-2">
//               <div className="flex items-center gap-3">
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Types:</span>
//                 <div className="flex gap-2">
//                   {TYPES.map((t) => (
//                     <button key={t.value} onClick={() => {setSelectedTypes(prev => prev.includes(t.value) ? prev.filter(v => v !== t.value) : [...prev, t.value]); setCurrentPage(1);}} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${selectedTypes.includes(t.value) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
//                       {t.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div className="h-4 w-px bg-slate-200 hidden md:block" />
//               <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categories:</span>
//                 {CATEGORIES.map((cat) => (
//                   <button key={cat} onClick={() => {setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]); setCurrentPage(1);}} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${selectedCategories.includes(cat) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* GLOBAL TOTAL CARD (Sum of all pages) */}
//           <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
//             <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
//             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Total Accumulated Expense</p>
//                 <div className="flex items-center gap-4">
//                   <h4 className="text-3xl font-black tracking-tighter italic">₹ {globalTotal.toLocaleString("en-IN")}</h4>
//                   <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
//                     <TrendingDown className="text-blue-400" size={14} />
//                     <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Global Audit</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center md:items-end">
//                 <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-2xl uppercase tracking-widest text-slate-400">
//                   {searchQuery ? `Matching "${searchQuery}"` : "Active Filter Set"}
//                 </span>
//                 <p className="text-[11px] text-slate-500 mt-3 font-medium">Scanning all historical matching records</p>
//               </div>
//             </div>
//           </div>

//           {/* List Table */}
//           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30 overflow-hidden">
//             <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
//               <div>
//                 <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Transaction Ledger</h3>
//                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
//                   {showAllTime ? "Complete History" : `${new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
//                 <span className="text-xs font-black uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
//               </div>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50/50">
//                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</th>
//                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
//                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Source</th>
//                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
//                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {loading ? (
//                     <tr><td colSpan={6} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
//                   ) : transactions.length > 0 ? (
//                     transactions.map((tx: any) => (
//                       <ViewTransactions 
//                         key={tx._id} 
//                         id={tx._id} 
//                         name={tx.description || tx.category} 
//                         cat={tx.category} 
//                         source={tx.source} 
//                         date={new Date(tx.date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})} 
//                         amount={`${tx.type === "expense" ? "-" : "+"}₹${tx.amount.toLocaleString("en-IN")}`} 
//                         isNeg={tx.type} 
//                         onDeleteSuccess={() => fetchTransactions(currentPage)} 
//                       />
//                     ))
//                   ) : (
//                     <tr><td colSpan={6} className="py-32 text-center text-slate-400 italic font-medium">No records matching current filter criteria.</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>


//             {/* Pagination Container */}
// <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
//   <button 
//     onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
//     disabled={currentPage === 1 || loading} 
//     className="group flex items-center gap-2 px-3 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase transition-all hover:border-blue-500 hover:text-blue-600 disabled:opacity-30"
//   >
//     <ChevronLeft size={18} /> Previous
//   </button>

//   <div className="hidden md:flex items-center gap-2">
//     {(() => {
//       const pages = [];
//       const range = 2; // Number of pages to show before and after current page
      
//       for (let i = 1; i <= totalPages; i++) {
//         // Always show first page, last page, and pages within the range of current page
//         if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
//           pages.push(
//             <button 
//               key={i} 
//               onClick={() => setCurrentPage(i)} 
//               className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${
//                 currentPage === i ? "bg-slate-900 text-white shadow-xl scale-110" : "bg-white border border-slate-100 text-slate-400 hover:text-blue-600"
//               }`}
//             >
//               {i}
//             </button>
//           );
//         } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
//           // Add ellipses
//           pages.push(<span key={i} className="px-2 text-slate-300 font-bold">...</span>);
//         }
//       }
//       return pages;
//     })()}
//   </div>

//   <button 
//     onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
//     disabled={currentPage === totalPages || loading} 
//     className="group flex items-center gap-2 px-3 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase transition-all hover:border-blue-500 hover:text-blue-600 disabled:opacity-30"
//   >
//     Next <ChevronRight size={18} />
//   </button>
// </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }




"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  ChevronLeft, ChevronRight, Loader2, Search, 
  CheckSquare, X, TrendingDown, Layers
} from "lucide-react";
import Sidebar from "./../../components/Sidebar";
import ViewTransactions from "./../../components/ViewTransactions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "../loading";

const CATEGORIES = ["Food & Drinks", "Shopping", "Transport", "Enjoyment", "Bills", "Health", "Education", "Personal Care", "Miscellaneous"];
const TYPES = [{ label: "Balance", value: "income" }, { label: "Savings", value: "savings" }, { label: "Expense", value: "expense" }];

export default function Transactions() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalTotal, setGlobalTotal] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showAllTime, setShowAllTime] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchTransactions = async (page: number) => {
    if (status !== "authenticated" || !session?.user) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        userId: session?.user?.id as string,
        page: page.toString(),
        search: searchQuery,
        categories: selectedCategories.join(","),
        types: selectedTypes.join(","),
        allTime: showAllTime.toString(),
        month: selectedMonth 
      });
      const response = await fetch(`/api/transactions?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      
      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
      setGlobalTotal(data.totalFilteredAmount || 0); 
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      const timeoutId = setTimeout(() => fetchTransactions(currentPage), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [session, status, currentPage, searchQuery, selectedCategories, selectedTypes, showAllTime, selectedMonth]);

  if (status === "loading") return <Loading />;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-900">
      <main className="flex-1 p-3 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          
          {/* COMPACT FILTER COMMAND CENTER */}
          <div className="bg-white rounded-3xl md:rounded-4xl border border-slate-200 shadow-xl shadow-slate-200/40 p-2">
            <div className="flex flex-col lg:flex-row gap-2">
              
              {/* Primary Filters (Search & Time) */}
              <div className="flex flex-col sm:flex-row flex-1 items-center gap-2 p-2 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100">
                <div className="w-full relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search descriptions..." 
                    value={searchQuery} 
                    onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                    className="w-full bg-transparent pl-11 pr-4 py-3 outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                <div className="w-full sm:w-auto flex items-center gap-2 px-2">
                  <input 
                    type="month" 
                    disabled={showAllTime} 
                    value={selectedMonth} 
                    onChange={(e) => {setSelectedMonth(e.target.value); setCurrentPage(1);}} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 px-2 pb-2 lg:pb-0">
                <button 
                  onClick={() => {setShowAllTime(!showAllTime); setCurrentPage(1);}} 
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${showAllTime ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  {showAllTime ? <CheckSquare size={16} /> : <Layers size={16} />}
                  <span className="whitespace-nowrap">All Time</span>
                </button>
                <button onClick={() => {setSearchQuery(""); setSelectedCategories([]); setSelectedTypes([]); setShowAllTime(false); setCurrentPage(1); toast.success("Filters Cleared");}} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Sub-Filters (Types & Categories) - Added Scroll on Mobile */}
            <div className="flex flex-col gap-4 px-4 md:px-6 py-4 border-t border-slate-50 mt-2">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Types:</span>
                <div className="flex gap-2">
                  {TYPES.map((t) => (
                    <button key={t.value} onClick={() => {setSelectedTypes(prev => prev.includes(t.value) ? prev.filter(v => v !== t.value) : [...prev, t.value]); setCurrentPage(1);}} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition-all border ${selectedTypes.includes(t.value) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Categories:</span>
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => {setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]); setCurrentPage(1);}} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition-all border ${selectedCategories.includes(cat) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GLOBAL TOTAL CARD */}
          <div className="bg-slate-900 text-white p-5 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-20" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Total Accumulated Expense</p>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                  <h4 className="text-2xl md:text-3xl font-black tracking-tighter italic">₹ {globalTotal.toLocaleString("en-IN")}</h4>
                  <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
                    <TrendingDown className="text-blue-400" size={12} />
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Global Audit</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[9px] font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-2xl uppercase tracking-widest text-slate-400">
                  {searchQuery ? `Matching "${searchQuery}"` : "Active Filter Set"}
                </span>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">Scanning all historical records</p>
              </div>
            </div>
          </div>

          {/* List Table */}
          <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30 overflow-hidden">
            <div className="p-5 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50">
              <div className="text-center sm:text-left">
                <h3 className="font-black text-lg md:text-xl text-slate-900 uppercase tracking-tight">Transaction Ledger</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {showAllTime ? "Complete History" : `${new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap">Page {currentPage} of {totalPages}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-175 md:min-w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400">
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Description</th>
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Category</th>
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden md:table-cell">Source</th>
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Date</th>
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
                  ) : transactions.length > 0 ? (
                    transactions.map((tx: any) => (
                      <ViewTransactions 
                        key={tx._id} 
                        id={tx._id} 
                        name={tx.description || tx.category} 
                        cat={tx.category} 
                        source={tx.source} 
                        date={new Date(tx.date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})} 
                        amount={`${tx.type === "expense" ? "-" : "+"}₹${tx.amount.toLocaleString("en-IN")}`} 
                        isNeg={tx.type} 
                        onDeleteSuccess={() => fetchTransactions(currentPage)} 
                      />
                    ))
                  ) : (
                    <tr><td colSpan={6} className="py-24 text-center text-slate-400 italic font-medium">No records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Container */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1 || loading} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-[10px] uppercase transition-all hover:text-blue-600 disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {(() => {
                  const pages = [];
                  const range = window.innerWidth < 640 ? 1 : 2;
                  
                  for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
                      pages.push(
                        <button 
                          key={i} 
                          onClick={() => setCurrentPage(i)} 
                          className={`w-8 h-8 rounded-lg font-black text-[10px] shrink-0 transition-all ${
                            currentPage === i ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-100 text-slate-400 hover:text-blue-600"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
                      pages.push(<span key={i} className="px-1 text-slate-300 font-bold">...</span>);
                    }
                  }
                  return pages;
                })()}
              </div>

              <button 
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages || loading} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-[10px] uppercase transition-all hover:text-blue-600 disabled:opacity-30"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}