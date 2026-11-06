

"use client";
import React, { useState } from 'react';
// Added Sparkles and Loader2 icons for AI feedback
import { IndianRupee, Tag, AlignLeft, Calendar, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddExpenseForm = ({ userId, onSuccess }: { userId: string, onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'balance' | 'savings'>('balance');
  // New state for AI processing status
  const [isAiLoading, setIsAiLoading] = useState(false); 

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food & Drinks',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Helper to format date as YYYY-MM-DD without timezone shifts
  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const now = new Date();
  const minDate = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
  const maxDate = formatDate(now);

  // AI Categorization Function
//   const handleAICategorize = async () => {
//   if (formData.description.length < 3) return;

//   setIsAiLoading(true);
//   try {
//     const res = await fetch("/api/ai/categorize", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ description: formData.description }),
//     });
    
//     const data = await res.json();
//     console.log("AI Response:", data.category); // CHECK YOUR BROWSER CONSOLE (F12)

//     if (data.category) {
//       // We use a functional update to ensure we don't lose other form data
//       setFormData((prev) => ({ 
//         ...prev, 
//         category: data.category.trim() // .trim() removes any hidden spaces
//       }));
//       toast.success(`AI suggested: ${data.category}`);
//     }
//   } catch (err) {
//     console.error("Fetch Error:", err);
//   } finally {
//     setIsAiLoading(false);
//   }
// };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount);

    if (amountNum <= 0) return toast.error("Please enter a valid amount");

    setLoading(true); 
    
    try {
      const statsResponse = await fetch(`/api/dashboard/stats?userId=${userId}`);
      if (!statsResponse.ok) throw new Error("Failed to fetch stats");

      const stats = await statsResponse.json();

      if (source === "balance" && amountNum > stats.balance) {
        setLoading(false);
        return toast.error(`Insufficient Balance (Available: ₹${stats.balance.toLocaleString('en-IN')})`);
      }
      
      if (source === "savings" && amountNum > stats.totalSavings) {
        setLoading(false);
        return toast.error(`Insufficient Savings (Available: ₹${stats.totalSavings.toLocaleString('en-IN')})`);
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId,
          type: 'expense',
          source: source,
          amount: amountNum,
          spendFromSavings: source === 'savings'
        }),
      });

      if (response.ok) {
        onSuccess(); 
        toast.success(`Expense added using ${source}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add expense");
      }
    } catch (error) {
      toast.error("Process failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Source Selection Toggle */}
      <div className="p-1 bg-slate-100 rounded-2xl flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setSource('balance')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            source === 'balance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          USE BALANCE
        </button>
        <button
          type="button"
          onClick={() => setSource('savings')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            source === 'savings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          USE SAVINGS
        </button>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">Amount</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <IndianRupee size={18} />
          </div>
          <input
            required
            type="number"
            placeholder='0.00'
            min="0"
            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">Category</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Tag size={18} />
          </div>
          <select
            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Food & Drinks">Food & Drinks</option>
            <option value="Shopping">Shopping</option>
            <option value="Transport">Transport</option>
            <option value="Enjoyment">Enjoyment</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>
      </div>

      {/* Description with AI Integration */}
      {/* Description Input Field */}
<div>
  <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">
    Description (Optional)
  </label>
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
      <AlignLeft size={18} />
    </div>
    
    {/* REPLACE YOUR OLD INPUT WITH THIS ONE */}
    <input
      type="text"
      placeholder="e.g. clothes"
      className="block w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
      value={formData.description}
      onChange={(e) => setFormData({...formData, description: e.target.value})}
      
      // This line triggers the AI when the user clicks out of the box
      // onBlur={handleAICategorize} 
    />

    {/* The Manual Sparkle Button */}
    {/* <button
      type="button"
      onClick={handleAICategorize}
      disabled={isAiLoading || !formData.description}
      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30"
    >
      {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
    </button> */}
  </div>
</div>

      {/* Date Input with Restrictions */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">Date</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Calendar size={18} />
          </div>
          <input
            type="date"
            min={minDate} 
            max={maxDate} 
            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 ${
            source === 'balance' ? 'bg-blue-600 shadow-blue-100 hover:bg-blue-700' : 'bg-slate-900 shadow-slate-100 hover:bg-black'
        }`}
      >
        {loading ? 'Adding...' : `Add Expense from ${source.charAt(0).toUpperCase() + source.slice(1)}`}
      </button>
    </form>
  );
};

export default AddExpenseForm;