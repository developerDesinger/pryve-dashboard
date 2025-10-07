"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-white">
      <div className="hidden md:flex items-center gap-3 min-w-0 w-full">
        <div className="flex-1 max-w-[720px]">
          <form
            className="h-11 w-full rounded-[18px] bg-accent text-foreground/80 flex items-center gap-2 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              const q = query.trim();
              if (!q) return;
              router.push(`/dashboard?query=${encodeURIComponent(q)}`);
            }}
            role="search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 text-muted-foreground"
              aria-hidden
              focusable="false"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none placeholder:text-muted-foreground text-[14px] w-full"
              placeholder="Search query..."
              aria-label="Search"
            />
          </form>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          aria-label="Notifications"
          className="w-10 h-10 aspect-square shrink-0 rounded-full border border-border inline-flex items-center justify-center text-muted-foreground bg-white p-0 cursor-pointer hover:bg-accent transition-colors"
        >
          <img src="/icons/bell.svg" alt="Notifications" className="w-4 h-4" />
        </button>
        <button
          className="h-10 rounded-[18px] px-3 sm:px-6 bg-[#757575] text-white hover:brightness-95 inline-flex items-center justify-center gap-2 sm:gap-3 font-semibold text-[12px] sm:text-[14px] min-w-[120px] sm:min-w-[160px] whitespace-nowrap cursor-pointer transition-all"
        >
          <img src="/icons/message-text.svg" alt="Send Broadcast" className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Send Broadcast</span>
          <span className="sm:hidden">Send</span>
        </button>
      </div>
    </header>
  );
}


