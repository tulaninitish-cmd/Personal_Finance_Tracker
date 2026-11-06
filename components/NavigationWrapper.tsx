"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define pages where navigation should NOT be shown
  const noNavPages = ["/", "/login", "/register"];
  const hideNav = noNavPages.includes(pathname);

  if (hideNav) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main App Content */}
      <main className="flex-1 pb-24 md:pb-0 relative">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}