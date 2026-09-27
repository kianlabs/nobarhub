"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomTabBar() {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Beranda",
      href: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      )
    },
    {
      name: "Cari",
      href: "/cari",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      )
    },
    {
      name: "Watchlist",
      href: "/watchlist",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      )
    },
    {
      name: "Profil",
      href: "/profil",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      )
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden px-3 pb-4">
      <div className="max-w-md mx-auto bg-black/30 backdrop-blur-2xl rounded-[28px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-around py-1.5 px-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 p-1.5 min-w-[56px] rounded-2xl transition-all ${
                  isActive ? "bg-[#f5b50a]/20" : "hover:bg-white/5"
                }`}
              >
                <div className={`${isActive ? "text-[#f5b50a]" : "text-white/60"} transition-colors scale-[0.85]`}>
                  {tab.icon}
                </div>
                <span className={`text-[8.5px] font-semibold ${isActive ? "text-[#f5b50a]" : "text-white/50"}`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
