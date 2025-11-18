"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
// import sidebarData from "@/data/sidebar.json"; // Removed mock data

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href; // only exact match for Dashboard
    }
    return pathname === href || pathname?.startsWith(href + "/");
  };
  
  const NavItem = ({ item, active }: { item: any; active: boolean }) => (
    <div className="relative">
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-sm" style={{ backgroundColor: '#797878' }} />
      )}
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-r-[10px] text-[14px] text-foreground hover:bg-accent transition-colors",
          active && "rounded-r-[10px]"
        )}
        style={active ? { backgroundColor: '#f3f0f1' } : {}}
      >
        {active ? (
          <span
            className="w-4 h-4 inline-block"
            style={{
              backgroundColor: '#797878',
              WebkitMaskImage: `url(${item.icon})`,
              maskImage: `url(${item.icon})`,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
            aria-hidden
          />
        ) : (
          <img src={item.icon} alt={item.label} className="w-4 h-4" />
        )}
        <span className="font-medium">{item.label}</span>
      </Link>
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
      <span className="text-[12px] font-medium text-foreground">{title}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );

  return (
    <aside 
      id="app-sidebar"
      className="fixed md:static z-40 top-0 left-0 h-dvh w-64 md:w-64 shrink-0 flex-col p-4 bg-white dark:bg-white border-r border-border -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-[21px] font-semibold mb-4 pb-4 border-b border-border -mx-4 px-4">pryve</div>
      
      <nav className="flex flex-col gap-1" onClick={() => {
        const el = document.getElementById('app-sidebar');
        if (el) {
          el.classList.add('-translate-x-full');
          el.classList.remove('translate-x-0');
        }
      }}>
        <SectionHeader title="Main" />
        <NavItem item={{ href: "/dashboard", label: "Dashboard", icon: "/icons/Unselect-side/home.svg" }} active={isActive("/dashboard")} />
        <NavItem item={{ href: "/dashboard/users", label: "Users", icon: "/icons/Unselect-side/users.svg" }} active={isActive("/dashboard/users")} />
        <NavItem item={{ href: "/dashboard/analytics", label: "Analytics", icon: "/icons/Unselect-side/analytics.svg" }} active={isActive("/dashboard/analytics")} />
        <NavItem item={{ href: "/dashboard/memory", label: "Memory", icon: "/icons/Unselect-side/memory.svg" }} active={isActive("/dashboard/memory")} />
        <NavItem item={{ href: "/dashboard/tone", label: "Tone", icon: "/icons/Unselect-side/Tone.svg" }} active={isActive("/dashboard/tone")} />
        <NavItem item={{ href: "/dashboard/prompts", label: "Prompts", icon: "/icons/Unselect-side/prompts.svg" }} active={isActive("/dashboard/prompts")} />
        <NavItem item={{ href: "/dashboard/flows", label: "Flows", icon: "/icons/Unselect-side/chat-flow.svg" }} active={isActive("/dashboard/flows")} />
        <NavItem item={{ href: "/dashboard/payments", label: "Payments", icon: "/icons/Unselect-side/payments.svg" }} active={isActive("/dashboard/payments")} />
        
        <SectionHeader title="Other" />
        <NavItem item={{ href: "/dashboard/notifications", label: "Notifications", icon: "/icons/bell.svg" }} active={isActive("/dashboard/notifications")} />
        <NavItem item={{ href: "/dashboard/settings", label: "Settings", icon: "/icons/Unselect-side/settings.svg" }} active={isActive("/dashboard/settings")} />
      </nav>
      
      {/* Logout Section */}
      <div className="mt-auto pt-4 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-r-[10px] text-[14px] text-foreground hover:bg-accent transition-colors w-full text-left"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="w-4 h-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}


