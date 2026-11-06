"use client";
import React, { useEffect, useState } from 'react';
import { IndianRupee, Tag, AlignLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const AddBalanceForm = ({ userId, onSuccess }: { userId: string, onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const [activeType, setActiveType] = useState('income');

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Initial Balance',
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

useEffect(() => {
    if (activeType === 'savings') {
      setFormData(prev => ({
        ...prev,
        category: 'Initial Savings',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        category: 'Initial Balance',
        description: '' 
      }));
    }
  }, [activeType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseInt(formData.amount);
    if(amountNum <= 0 ) return toast.error("Please enter a valid amount.")
      
      setLoading(true);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId,
          source: activeType === 'income' ? 'balance' : 'savings',
          type: activeType, // Use the activeType from our toggle state
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        onSuccess();
        toast.success(`${activeType === 'income' ? 'Balance' : 'Savings'} Added Successfully`);
      }
    } catch (error) {
      toast.error(`Error in adding ${activeType}`);
      console.error("Error adding balance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Transaction Type Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => setActiveType("income")}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeType === 'income' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-600'
          }`}
        >
          REGULAR INCOME
        </button>
        <button
          type="button"
          onClick={() => setActiveType("savings")}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeType === 'savings' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-600'
          }`}
        >
          ADD TO SAVINGS
        </button>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            {activeType === 'income' ? 'Income Amount' : 'Savings Amount'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <IndianRupee size={18} />
          </div>
          <input
            required
            type="number"
            placeholder="0.00"
            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Tag size={18} />
          </div>
          <select
            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {/* <option value="Initial Balance">Initial Balance</option> */}
            {activeType === 'income' && <option value="Initial Balance">Initial Balance</option>}
            {activeType === 'income' && <option value="Pocket Money">Pocket Money</option>}
            {activeType === 'savings' && <option value="Initial Savings">Initial Savings</option>}
            {activeType === 'savings' && <option value="Saving Goal">Saving Goal</option>}
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Gift">Gift</option>
            {activeType === 'savings' && <option value="Emergency Fund">Emergency Fund</option>}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description (Optional)</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <AlignLeft size={18} />
          </div>
          <input
            type="text"
            placeholder={activeType === 'income' ? "e.g. Monthly salary" : "e.g. For a new Gadget"}
            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
      >
        {loading ? 'Processing...' : `Add ${activeType === 'income' ? 'Balance' : 'Savings'}`}
      </button>
    </form>
  );
};

export default AddBalanceForm;
