import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh grid grid-cols-[256px_1fr] bg-background">
      <Sidebar />
      <div className="flex flex-col min-w-0">
        <Topbar />
        <main className="p-4 md:p-6 space-y-6 bg-background">{children}</main>
      </div>
    </div>
  );
}


