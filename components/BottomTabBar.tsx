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
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      <div className="max-w-md mx-auto bg-[#1c1a17]/90 backdrop-blur-md rounded-t-2xl border-t border-[#33312c]">
        <div className="flex items-center justify-around py-3 px-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link 
                key={tab.name} 
                href={tab.href}
                className="flex flex-col items-center gap-1 p-2"
              >
                <div className={`${isActive ? "text-[#f5b50a]" : "text-[#71717a] hover:text-[#a1a1aa]"} transition-colors`}>
                  {tab.icon}
                </div>
                <span className={`text-[10px] font-bold tracking-wide ${isActive ? "text-[#f5b50a]" : "text-[#71717a]"}`}>
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
