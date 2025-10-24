"use client";
import { useState, useEffect, useRef } from "react";
import UserStatMiniCard, { type UserStat } from "@/components/dashboard/UserStatMiniCard";
// Remove static userStats import
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import { FcGoogle } from "react-icons/fc";
import { authAPI, type User, type PaginationInfo, type UserCounts } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { PageLoader } from "@/components/ui/loader";

function UserStatMiniCardsRow({ counts }: { counts: UserCounts }) {
  const stats: UserStat[] = [
    {
      id: "total",
      title: "Total Users",
      value: counts.totalUsers,
      iconSrc: "/icons/Users/Icon.svg",
      iconBg: "#eef5ff"
    },
    {
      id: "active", 
      title: "Active Users",
      value: counts.activeUsers,
      iconSrc: "/icons/Users/flash.svg",
      iconBg: "#eef5ff"
    },
    {
      id: "suspended",
      title: "Suspended", 
      value: counts.suspendedUsers,
      iconSrc: "/icons/Users/Icon (1).svg",
      iconBg: "#fee2e2"
    },
    {
      id: "premium",
      title: "Premium Users",
      value: counts.premiumUsers,
      iconSrc: "/icons/Users/crown.svg",
      iconBg: "#ecfdf5"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <UserStatMiniCard key={s.id} {...s} />
      ))}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [counts, setCounts] = useState<UserCounts>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    premiumUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showError } = useToast();
  const fetchingRef = useRef(false);

  const fetchUsers = async (page: number = pagination.currentPage, limit: number = pagination.limit) => {
    if (!user || fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;
      setLoading(true);
      const token = localStorage.getItem('authToken') || '';
      const response = await authAPI.getAllUsers(token, page, limit);
      
      if (response.success && response.data) {
        setUsers(response.data.data || []);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          limit: 10,
        });
        // Set counts from API response
        if (response.data.counts) {
          setCounts(response.data.counts);
        }
      } else {
        showError(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      showError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]); // Only depend on user changes

  const handlePageChange = (page: number) => {
    fetchUsers(page, pagination.limit);
  };

  const handleLimitChange = (limit: number) => {
    fetchUsers(1, limit); // Reset to first page when changing limit
  };

  if (loading) {
    return <PageLoader text="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">User Management</h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
        Manage user accounts, subscriptions, and settings
        </p>
      </div>

      <UserStatMiniCardsRow counts={counts} />

      <DataTable
        title="Users"
        columns={[
          {
            key: "user",
            header: "User",
            render: (row: User) => {
              const firstLetter = row.fullName?.charAt(0)?.toUpperCase() || 'U';
              const colors = [
                'bg-blue-500',
                'bg-green-500', 
                'bg-purple-500',
                'bg-pink-500',
                'bg-indigo-500',
                'bg-yellow-500',
                'bg-red-500',
                'bg-teal-500'
              ];
              const colorIndex = row.fullName?.charCodeAt(0) % colors.length || 0;
              
              return (
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-semibold text-sm`}>
                    {firstLetter}
                  </div>
                  <div>
                    <div className="font-medium">{row.fullName}</div>
                    <div className="text-sm text-muted-foreground">{row.email}</div>
                  </div>
                </div>
              );
            },
          },
          {
            key: "role",
            header: "Role",
            render: (row: User) => (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {row.role}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row: User) => (
              <span className="inline-flex items-center px-4 h-8 rounded-full border text-[14px] font-semibold"
                style={{
                  color: row.status === "ACTIVE" ? "#16a34a" : "#dc2626",
                  background: row.status === "ACTIVE" ? "#ecfdf5" : "#fee2e2",
                  borderColor: row.status === "ACTIVE" ? "#bbf7d0" : "#fecaca",
                }}
              >
                {row.status}
              </span>
            ),
          },
          {
            key: "userName",
            header: "Username",
            render: (row: User) => row.userName || "N/A",
          },
          {
            key: "joined",
            header: "Joined",
            render: (row: User) => new Date(row.createdAt).toLocaleDateString(),
          },
          {
            key: "lastActive",
            header: "Last Active",
            render: (row: User) => new Date(row.updatedAt).toLocaleDateString(),
          },
          {
            key: "login",
            header: "Login Method",
            render: (row: User) => (
              <div className="flex items-center gap-2">
                {row.loginType === "GOOGLE" ? (
                  <FcGoogle className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">E</span>
                  </div>
                )}
                <span className="text-sm text-muted-foreground">{row.loginType}</span>
              </div>
            ),
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
        ] as Column<User>[]}
        data={users}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
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
