"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ReceiptText, Calendar, User, LineChart } from "lucide-react";

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/dashboard", icon: LayoutDashboard },
    { name: "History", path: "/transactions", icon: ReceiptText },
    { name: "Charts", path: "/charts", icon:LineChart  },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 pb-6 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link 
              key={item.path} 
              href={item.path}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" 
                  : "text-slate-400 group-hover:text-slate-600"
              }`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;