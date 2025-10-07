"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import sidebarData from "@/data/sidebar.json";

export function Sidebar() {
  const pathname = usePathname();
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
        {sidebarData.main.map((item) => {
          const active = isActive(item.href);
          return <NavItem key={item.href} item={item} active={active} />;
        })}
        
        <SectionHeader title="Other" />
        {sidebarData.other.map((item) => {
          const active = isActive(item.href);
          return <NavItem key={item.href} item={item} active={active} />;
        })}
      </nav>
    </aside>
  );
}


