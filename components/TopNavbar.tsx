"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Cari", href: "/cari" },
    { name: "Watchlist", href: "/watchlist" },
  ];

  return (
    <nav className="hidden md:flex fixed top-0 inset-x-0 z-50 bg-[#121110]/90 backdrop-blur-md border-b border-[#33312c]">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="112" fill="#121110"/>
            <path d="M 128 176 L 384 176 L 384 216 A 40 40 0 0 0 384 296 L 384 336 L 128 336 L 128 296 A 40 40 0 0 0 128 216 Z" fill="#f5b50a"/>
            <path d="M 235 220 L 295 256 L 235 292 Z" fill="#121110"/>
          </svg>
          <span className="text-[#f5b50a] font-black tracking-tight text-xl">NOBARHUB</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-semibold text-sm transition-colors ${
                  isActive ? "text-[#f5b50a]" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Search Icon & Profile placeholder */}
        <div className="flex items-center gap-6 text-white">
          <Link href="/cari" className="text-[#a1a1aa] hover:text-[#f5b50a] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Link>
          <Link href="/profil" className={`transition-colors ${pathname === "/profil" ? "text-[#f5b50a]" : "text-[#a1a1aa] hover:text-white"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
