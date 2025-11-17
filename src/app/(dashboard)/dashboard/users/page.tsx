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
import { cookieUtils } from "@/lib/cookies";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { showError, showSuccess, showLoading, dismiss } = useToast();
  const fetchingRef = useRef(false);

  const fetchUsers = async (page: number = pagination.currentPage, limit: number = pagination.limit) => {
    if (!user || fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;
      setLoading(true);
      const token = cookieUtils.getAuthToken() || localStorage.getItem('authToken') || '';
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

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
  };

  const closeSelectedUser = () => setSelectedUser(null);

  useEffect(() => {
    if (!selectedUser) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSelectedUser();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;
    const updatedUser = users.find((u) => u.id === selectedUser.id);
    if (updatedUser && updatedUser !== selectedUser) {
      setSelectedUser(updatedUser);
    }
  }, [users, selectedUser]);

  const handleUpdateUserStatus = async (
    targetUser: User,
    newStatus: "ACTIVE" | "SUSPENDED"
  ) => {
    const token = cookieUtils.getAuthToken() || localStorage.getItem("authToken") || "";
    if (!token) {
      showError("Missing authentication token. Please sign in again.");
      return;
    }

    setActionLoadingId(targetUser.id);
    const loadingToastId = showLoading("Updating user status...");

    try {
      const response = await authAPI.updateUser(token, targetUser.id, {
        status: newStatus,
      });

      if (response.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === targetUser.id ? { ...u, status: newStatus } : u
          )
        );

        setCounts((prev) => {
          const next = { ...prev };
          const previousStatus = targetUser.status;

          if (previousStatus === "ACTIVE") {
            next.activeUsers = Math.max(0, next.activeUsers - 1);
          } else if (previousStatus === "SUSPENDED") {
            next.suspendedUsers = Math.max(0, next.suspendedUsers - 1);
          }

          if (newStatus === "ACTIVE") {
            next.activeUsers += 1;
          } else if (newStatus === "SUSPENDED") {
            next.suspendedUsers += 1;
          }

          return next;
        });

        showSuccess(
          `User ${newStatus === "ACTIVE" ? "activated" : "suspended"} successfully`
        );
      } else {
        showError(response.message || "Failed to update user status");
      }
    } catch (error) {
      showError("Network error. Please try again.");
    } finally {
      dismiss(loadingToastId);
      setActionLoadingId(null);
    }
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
            render: (row: User) => (
              <RowActions
                user={row}
                onView={() => handleViewUser(row)}
                onToggleStatus={() =>
                  handleUpdateUserStatus(
                    row,
                    row.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
                  )
                }
                isProcessing={actionLoadingId === row.id}
              />
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

      {selectedUser && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeSelectedUser}
          />
          <div className="relative ml-auto h-full w-full max-w-md bg-white shadow-2xl z-50">
            <div className="flex items-start justify-between px-6 py-5 border-b border-border">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {selectedUser.fullName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </p>
              </div>
              <button
                onClick={closeSelectedUser}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 overflow-y-auto h-[calc(100%-80px)]">
              <section>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Profile
                </h4>
                <div className="space-y-3 text-sm">
                  <DetailRow label="Role" value={selectedUser.role} />
                  <DetailRow label="Status" value={selectedUser.status} />
                  <DetailRow
                    label="Username"
                    value={selectedUser.userName || "N/A"}
                  />
                  <DetailRow label="Login Method" value={selectedUser.loginType} />
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Activity
                </h4>
                <div className="space-y-3 text-sm">
                  <DetailRow
                    label="Joined"
                    value={new Date(selectedUser.createdAt).toLocaleDateString()}
                  />
                  <DetailRow
                    label="Last Active"
                    value={new Date(selectedUser.updatedAt).toLocaleDateString()}
                  />
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Contact
                </h4>
                <div className="space-y-3 text-sm">
                  <DetailRow label="Email" value={selectedUser.email} />
                  <DetailRow
                    label="Phone"
                    value={selectedUser.phoneNumber || "Not provided"}
                  />
                  <DetailRow
                    label="Country"
                    value={selectedUser.country || "Not provided"}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type RowActionsProps = {
  user: User;
  onView: () => void;
  onToggleStatus: () => void;
  isProcessing: boolean;
};

function RowActions({ user, onView, onToggleStatus, isProcessing }: RowActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleAction = (callback: () => void) => {
    callback();
    setOpen(false);
  };

  return (
    <div className="relative inline-flex" ref={menuRef}>
      <button
        type="button"
        className="w-9 h-9 rounded-xl inline-flex items-center justify-center cursor-pointer border border-transparent hover:border-border transition-colors"
        aria-label="Row actions"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img src="/Leading%20Icon.svg" alt="Actions" className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto top-full z-20 mt-2 w-full max-w-[220px] min-w-[160px] rounded-2xl border border-border bg-white shadow-lg">
          <div className="flex flex-col gap-1 py-2">
            <button
              className="w-full px-4 py-2 text-left text-sm leading-5 hover:bg-accent transition-colors"
              onClick={() => handleAction(onView)}
            >
              View details
            </button>
            <button
              className={`w-full px-4 py-2 text-left text-sm leading-5 transition-colors ${
                user.status === "ACTIVE"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-green-600 hover:bg-emerald-50"
              } ${isProcessing ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => !isProcessing && handleAction(onToggleStatus)}
              disabled={isProcessing}
            >
              {user.status === "ACTIVE" ? "Suspend user" : "Activate user"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </span>
      <span className="text-foreground text-sm font-medium text-right">
        {value}
      </span>
    </div>
  );
}
