"use client";
import UserStatMiniCard, { type UserStat } from "@/components/dashboard/UserStatMiniCard";
import userStats from "@/data/user-stats.json";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import users from "@/data/users";
import { FcGoogle } from "react-icons/fc";

function UserStatMiniCardsRow() {
  const stats = userStats as unknown as UserStat[];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <UserStatMiniCard key={s.id} {...s} />
      ))}
    </div>
  );
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">User Management</h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
        Manage user accounts, subscriptions, and settings
        </p>
      </div>

      <UserStatMiniCardsRow />

      <DataTable
        title="Users"
        columns={[
          {
            key: "user",
            header: "User",
            render: (row: (typeof users)[number]) => (
              <div className="flex items-center gap-3">
                <img src={(row as any).avatar || "/icons/Users/Icon.svg"} alt="avatar" className="w-8 h-8 rounded-full" />
                <span className="font-medium">{row.user}</span>
              </div>
            ),
          },
          { key: "plan", header: "Plan" },
          {
            key: "status",
            header: "Status",
            render: (row: (typeof users)[number]) => (
              <span className="inline-flex items-center px-4 h-8 rounded-full border text-[14px] font-semibold"
                style={{
                  color: row.status === "Active" ? "#16a34a" : "#dc2626",
                  background: row.status === "Active" ? "#ecfdf5" : "#fee2e2",
                  borderColor: row.status === "Active" ? "#bbf7d0" : "#fecaca",
                }}
              >
                {row.status}
              </span>
            ),
          },
          { key: "usage", header: "Usage" },
          { key: "joined", header: "Joined" },
          { key: "lastActive", header: "Last Active" },
          {
            key: "login",
            header: "Login Method",
            render: () => <FcGoogle className="w-5 h-5" />,
          },
          {
            key: "actions",
            header: "Actions",
            render: () => (
              <button
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center cursor-pointer"
                aria-label="Row actions"
              >
                <img src="/Leading%20Icon.svg" alt="Actions" className="w-4 h-4" />
              </button>
            ),
          },
        ] as Column<(typeof users)[number]>[]}
        data={users as any}
        rightSlot={
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl border border-border bg-accent inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
            </button>
            <div className="h-9 rounded-xl border border-border bg-accent px-3 inline-flex items-center gap-2">
              <span className="text-[14px] font-semibold">All Users</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        }
      />
    </div>
  );
}
