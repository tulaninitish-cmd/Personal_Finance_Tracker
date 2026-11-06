
// "use client"; 

// import { usePathname } from "next/navigation";
// import Link from "next/link"; 
// import {  BarChart, Calendar, LayoutDashboard, LineChart, LogOut, UserCircle, Wallet } from "lucide-react";
// import { signOut } from "next-auth/react";
// import toast from "react-hot-toast";

// export default function Sidebar() {
//   const pathname = usePathname();

//   const isActive = (path: string) => pathname === path;

//   const baseStyle = "flex items-center space-x-3 p-3 rounded-xl font-medium transition";
//   const activeStyle = "bg-blue-50 text-blue-600";
//   const inactiveStyle = "text-slate-500 hover:bg-slate-50";

//   return (
//     <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen">
//       <div className="p-6">
//         <Link href={"/dashboard"} className="text-2xl font-bold text-blue-600 tracking-tight">Spendly</Link>
//       </div>

//       <nav className="flex-1 px-4 space-y-2">

//         <Link href="/dashboard" className={`${baseStyle} ${isActive('/dashboard') ? activeStyle : inactiveStyle}`}>
//           <LayoutDashboard size={20} />
//           <span>Dashboard</span>
//         </Link>

//         <Link 
//           href="/transactions" 
//           className={`${baseStyle} ${isActive('/transactions') ? activeStyle : inactiveStyle}`}
//         >
//           <Wallet size={20} />
//           <span>Transactions</span>
//         </Link>

//         <Link 
//           href="/charts" 
//           className={`${baseStyle} ${isActive('/charts') ? activeStyle : inactiveStyle}`}
//         >
//           <LineChart   size={20} />
//           <span>Charts</span>
//         </Link>

//          <Link 
//           href="/calendar" 
//           className={`${baseStyle} ${isActive('/calendar') ? activeStyle : inactiveStyle}`}
//         >
//           <Calendar    size={20} />
//           <span>Calendar</span>
//         </Link>

//         <Link 
//           href="/profile" 
//           className={`${baseStyle} ${isActive('/profile') ? activeStyle : inactiveStyle}`}
//         >
//           <UserCircle size={20} />
//           <span>Profile</span>
//         </Link>



//       </nav>

//       <div className="p-4 border-t border-slate-100">
//   <button
//     onClick={async () => {
//         await signOut({ callbackUrl: "/login" });
//         toast.success("Logged out successfully");
//     }}
//     className="flex items-center space-x-3 text-red-500 hover:bg-red-50 w-full p-3 rounded-xl transition"
//   >
//     <LogOut size={20} />
//     <span>Logout</span>
//   </button>
  
// </div>


//     </aside>
//   );
// }


"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  LayoutDashboard,
  LineChart,
  LogOut,
  UserCircle,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile state

  const isActive = (path: string) => pathname === path;

  const baseStyle = "flex items-center space-x-3 p-3 rounded-xl font-medium transition";
  const activeStyle = "bg-blue-50 text-blue-600";
  const inactiveStyle = "text-slate-500 hover:bg-slate-50";

  const NavLinks = () => (
    <>
      <Link
        href="/dashboard"
        onClick={() => setIsOpen(false)}
        className={`${baseStyle} ${isActive("/dashboard") ? activeStyle : inactiveStyle}`}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </Link>

      <Link
        href="/transactions"
        onClick={() => setIsOpen(false)}
        className={`${baseStyle} ${isActive("/transactions") ? activeStyle : inactiveStyle}`}
      >
        <Wallet size={20} />
        <span>Transactions</span>
      </Link>

      <Link
        href="/charts"
        onClick={() => setIsOpen(false)}
        className={`${baseStyle} ${isActive("/charts") ? activeStyle : inactiveStyle}`}
      >
        <LineChart size={20} />
        <span>Charts</span>
      </Link>

      <Link
        href="/calendar"
        onClick={() => setIsOpen(false)}
        className={`${baseStyle} ${isActive("/calendar") ? activeStyle : inactiveStyle}`}
      >
        <Calendar size={20} />
        <span>Calendar</span>
      </Link>

      <Link
        href="/profile"
        onClick={() => setIsOpen(false)}
        className={`${baseStyle} ${isActive("/profile") ? activeStyle : inactiveStyle}`}
      >
        <UserCircle size={20} />
        <span>Profile</span>
      </Link>
    </>
  );

  return (
    <>
      {/* MOBILE TRIGGER BUTTON (Hamburger) */}
      <div className="md:hidden fixed top-4 left-4 z-60">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col h-screen
        `}
      >
        <div className="p-6">
          <Link
            href={"/dashboard"}
            className="text-2xl font-bold text-blue-600 tracking-tight"
          >
            Spendly
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={async () => {
              await signOut({ callbackUrl: "/login" });
              toast.success("Logged out successfully");
            }}
            className="flex items-center space-x-3 text-red-500 hover:bg-red-50 w-full p-3 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}