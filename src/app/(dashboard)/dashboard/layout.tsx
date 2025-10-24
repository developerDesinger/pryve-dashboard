"use client";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refreshSession } = useAuth();

  // Refresh session on user activity (with debounce)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleUserActivity = () => {
      // Clear existing timeout
      clearTimeout(timeoutId);
      
      // Set new timeout to debounce the refresh
      timeoutId = setTimeout(() => {
        refreshSession();
      }, 1000); // 1 second debounce
    };

    // Refresh session on various user activities
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Cleanup event listeners and timeout
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [refreshSession]);

  return (
    <ProtectedRoute>
      <div className="h-dvh overflow-hidden grid grid-cols-1 md:grid-cols-[256px_1fr] bg-background">
        <Sidebar />
        <div 
          className="flex flex-col min-w-0 min-h-0"
          onClick={() => {
            const el = document.getElementById("app-sidebar");
            if (el) {
              el.classList.add("-translate-x-full");
              el.classList.remove("translate-x-0");
            }
          }}
        >
          <Topbar />
          <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-6 bg-background">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}


