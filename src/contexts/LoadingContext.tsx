"use client";

import * as React from "react";
import { loadingEmitter } from "@/lib/loadingEmitter";
import { enableGlobalFetchLoader } from "@/lib/globalFetchLoader";

const LoadingContext = React.createContext<{ activeRequests: number }>({
  activeRequests: 0,
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    enableGlobalFetchLoader();
    const unsubscribe = loadingEmitter.subscribe(setCount);
    return () => unsubscribe();
  }, []);

  return (
    <LoadingContext.Provider value={{ activeRequests: count }}>
      {children}
      <GlobalLoader active={count > 0} />
    </LoadingContext.Provider>
  );
}

export const useLoading = () => React.useContext(LoadingContext);

function GlobalLoader({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(240,240,240,0.92)] backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center text-foreground">
        <span className="relative flex h-16 w-16">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-45"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <span
            className="relative inline-flex h-full w-full items-center justify-center rounded-full shadow-lg ring-4 ring-white/60"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--color-primary), #8aa4ff)",
            }}
          >
            <span className="h-6 w-6 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
          </span>
        </span>
        <div>
          <p className="text-base font-semibold">Syncing insights</p>
          <p className="text-sm text-muted-foreground">
            Fetching the latest dashboard data…
          </p>
        </div>
      </div>
    </div>
  );
}
