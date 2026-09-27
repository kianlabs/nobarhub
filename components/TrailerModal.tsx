"use client";

import type { Video } from "@/types";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  trailer: Video | null | undefined;
  isLoading: boolean;
}

export function TrailerModal({ isOpen, onClose, title, trailer, isLoading }: TrailerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative z-10 w-full max-w-3xl bg-[#1c1a17] rounded-xl overflow-hidden shadow-2xl border border-[#33312c]">
        <div className="flex justify-between items-center p-4 border-b border-[#33312c]">
          <h3 className="font-bold text-white line-clamp-1">{title}</h3>
          <button 
            onClick={onClose}
            className="text-[#a1a1aa] hover:text-white p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="aspect-video bg-black flex items-center justify-center relative">
          {isLoading ? (
            <div className="text-[#f5b50a] flex flex-col items-center gap-2">
              <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span className="text-sm">Memuat trailer...</span>
            </div>
          ) : trailer ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="text-[#a1a1aa] flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              <p>Trailer tidak tersedia.</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#f5b50a]/10 border-t border-[#33312c] text-center">
          <p className="text-[#f5b50a] font-bold text-sm flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Tonton Film Full — Segera Hadir
          </p>
          <p className="text-xs text-[#a1a1aa] mt-1">Hanya memutar trailer resmi legal.</p>
        </div>
      </div>
    </div>
  );
}
