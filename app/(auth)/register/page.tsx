

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
// Added Eye and EyeOff icons
import { Wallet, Mail, Lock, ArrowRight, Loader2, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/lib/zod";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for toggle
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = registerSchema.safeParse({ name, email, password });
      if (!validation.success) {
        toast.error(validation.error.issues[0].message);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      toast.success("Account created! Please login.");
      router.push("/login");
      
    } catch (err: any) {
      toast.error(err.message, { 
        style: { borderRadius: '16px', background: '#333', color: '#fff' } 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[480px] z-10">
        <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-8 md:p-12">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200 mb-4 transition-transform hover:rotate-6">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Spendly</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-sm font-medium">Start your journey to financial freedom.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300" 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="email" 
                  required 
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300" 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} // Dynamic type
                  required 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300" 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:shadow-blue-200 disabled:opacity-70 active:scale-[0.98] mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Join Spendly <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[9px]"><span className="px-4 bg-white/0 text-slate-400 font-black uppercase tracking-[0.2em]">Social Registration</span></div>
          </div>

          <button 
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full bg-white border border-slate-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm active:scale-[0.98]"
          >
            <img src="https://authjs.dev/img/providers/google.svg" className="w-4 h-4" alt="Google" />
            <span className="text-slate-700">Google Account</span>
          </button>

          <p className="text-center mt-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
          </p>
          <p className="text-center mt-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
            Back to Dashboard? <Link href="/" className="text-blue-600 hover:underline">Back</Link>
          </p>
        </div>
      </div>
    </div>
  );
}