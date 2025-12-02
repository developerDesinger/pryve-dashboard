"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import UserStatMiniCard, {
  type UserStat,
} from "@/components/dashboard/UserStatMiniCard";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import { FcGoogle } from "react-icons/fc";
import { authAPI, type User, type PaginationInfo } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { PageLoader } from "@/components/ui/loader";
import { cookieUtils } from "@/lib/cookies";

function AdminStatMiniCardsRow({ admins }: { admins: User[] }) {
  const counts = useMemo(() => {
    const totalAdmins = admins.length;
    const activeAdmins = admins.filter((u) => u.status === "ACTIVE").length;
    const suspendedAdmins = admins.filter(
      (u) => u.status === "SUSPENDED"
    ).length;
    const superAdmins = admins.filter((u) =>
      (u.role || "").toUpperCase().includes("SUPER")
    ).length;

    return { totalAdmins, activeAdmins, suspendedAdmins, superAdmins };
  }, [admins]);

  const stats: UserStat[] = [
    {
      id: "total",
      title: "Total Admins",
      value: counts.totalAdmins,
      iconSrc: "/icons/Users/Icon.svg",
      iconBg: "#eef5ff",
    },
    {
      id: "active",
      title: "Active Admins",
      value: counts.activeAdmins,
      iconSrc: "/icons/Users/flash.svg",
      iconBg: "#eef5ff",
    },
    {
      id: "suspended",
      title: "Suspended",
      value: counts.suspendedAdmins,
      iconSrc: "/icons/Users/Icon (1).svg",
      iconBg: "#fee2e2",
    },
    {
      id: "super",
      title: "Super Admins",
      value: counts.superAdmins,
      iconSrc: "/icons/Users/crown.svg",
      iconBg: "#ecfdf5",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <UserStatMiniCard key={s.id} {...s} />
      ))}
    </div>
  );
}

export default function AdminsPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { showError, showSuccess, showLoading, dismiss } = useToast();
  const fetchingRef = useRef(false);

  const filterAdmins = (users: User[]) =>
    users.filter((u) => (u.role || "").toUpperCase().includes("ADMIN"));

  const fetchUsers = async (
    page: number = pagination.currentPage,
    limit: number = pagination.limit
  ) => {
    if (!user || fetchingRef.current) return;

    try {
      fetchingRef.current = true;
      setLoading(true);
      const token =
        cookieUtils.getAuthToken() || localStorage.getItem("authToken") || "";
      const response = await authAPI.getAllUsers(token, page, limit);

      if (response.success && response.data) {
        const users = response.data.data || [];
        setAllUsers(users);
        const adminsOnly = filterAdmins(users);
        setAdmins(adminsOnly);
        // compute pagination based on admins only
        setPagination((prev) => ({ ...prev, currentPage: page, limit }));
      } else {
        showError(response.message || "Failed to fetch admins");
      }
    } catch (error) {
      showError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Client-side pagination of admins
  const pagedAdmins = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.limit;
    const end = start + pagination.limit;
    return admins.slice(start, end);
  }, [admins, pagination.currentPage, pagination.limit]);

  const derivedPagination: PaginationInfo = useMemo(() => {
    const totalItems = admins.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pagination.limit));
    return {
      currentPage: Math.min(pagination.currentPage, totalPages),
      totalPages,
      totalItems,
      limit: pagination.limit,
    };
  }, [admins.length, pagination.currentPage, pagination.limit]);

  const handlePageChange = (page: number) => {
    setPagination((p) => ({ ...p, currentPage: page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((p) => ({ ...p, currentPage: 1, limit }));
  };

  const handleViewUser = (u: User) => setSelectedUser(u);
  const closeSelectedUser = () => setSelectedUser(null);

  useEffect(() => {
    if (!selectedUser) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSelectedUser();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selectedUser]);

  // Keep drawer data in sync if list changes
  useEffect(() => {
    if (!selectedUser) return;
    const updated = admins.find((u) => u.id === selectedUser.id);
    if (updated && updated !== selectedUser) setSelectedUser(updated);
  }, [admins, selectedUser]);

  const handleUpdateUserStatus = async (
    targetUser: User,
    newStatus: "ACTIVE" | "SUSPENDED"
  ) => {
    const token =
      cookieUtils.getAuthToken() || localStorage.getItem("authToken") || "";
    if (!token) {
      showError("Missing authentication token. Please sign in again.");
      return;
    }

    setActionLoadingId(targetUser.id);
    const loadingToastId = showLoading("Updating admin status...");

    try {
      const response = await authAPI.updateUser(token, targetUser.id, {
        status: newStatus,
      });

      if (response.success) {
        // update locally
        setAdmins((prev) =>
          prev.map((u) =>
            u.id === targetUser.id ? { ...u, status: newStatus } : u
          )
        );
        setAllUsers((prev) =>
          prev.map((u) =>
            u.id === targetUser.id ? { ...u, status: newStatus } : u
          )
        );
        showSuccess(
          `Admin ${
            newStatus === "ACTIVE" ? "activated" : "suspended"
          } successfully`
        );
      } else {
        showError(response.message || "Failed to update admin status");
      }
    } catch (error) {
      showError("Network error. Please try again.");
    } finally {
      dismiss(loadingToastId);
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <PageLoader text="Loading admins..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">
          Admin Management
        </h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
          Manage admin accounts, roles, and access
        </p>
      </div>

      <AdminStatMiniCardsRow admins={admins} />

      <DataTable
        title="Admins"
        columns={
          [
            {
              key: "user",
              header: "Admin",
              render: (row: User) => {
                const firstLetter =
                  row.fullName?.charAt(0)?.toUpperCase() || "U";
                const colors = [
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-purple-500",
                  "bg-pink-500",
                  "bg-indigo-500",
                  "bg-yellow-500",
                  "bg-red-500",
                  "bg-teal-500",
                ];
                const colorIndex =
                  row.fullName?.charCodeAt(0) % colors.length || 0;

                return (
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-semibold text-sm`}
                    >
                      {firstLetter}
                    </div>
                    <div>
                      <div className="font-medium">{row.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {row.email}
                      </div>
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
                <span
                  className="inline-flex items-center px-4 h-8 rounded-full border text-[14px] font-semibold"
                  style={{
                    color: row.status === "ACTIVE" ? "#16a34a" : "#dc2626",
                    background: row.status === "ACTIVE" ? "#ecfdf5" : "#fee2e2",
                    borderColor:
                      row.status === "ACTIVE" ? "#bbf7d0" : "#fecaca",
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
              render: (row: User) =>
                new Date(row.createdAt).toLocaleDateString(),
            },
            {
              key: "lastActive",
              header: "Last Active",
              render: (row: User) =>
                new Date(row.updatedAt).toLocaleDateString(),
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
                      <span className="text-xs font-medium text-gray-600">
                        E
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {row.loginType}
                  </span>
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
          ] as Column<User>[]
        }
        data={pagedAdmins}
        pagination={derivedPagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        rightSlot={
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl border border-border bg-accent inline-flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
            </button>
            <div className="h-9 rounded-xl border border-border bg-accent px-3 inline-flex items-center gap-2">
              <span className="text-[14px] font-semibold">All Admins</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
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
                  <DetailRow
                    label="Login Method"
                    value={selectedUser.loginType}
                  />
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Activity
                </h4>
                <div className="space-y-3 text-sm">
                  <DetailRow
                    label="Joined"
                    value={new Date(
                      selectedUser.createdAt
                    ).toLocaleDateString()}
                  />
                  <DetailRow
                    label="Last Active"
                    value={new Date(
                      selectedUser.updatedAt
                    ).toLocaleDateString()}
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

function RowActions({
  user,
  onView,
  onToggleStatus,
  isProcessing,
}: RowActionsProps) {
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
              } ${
                isProcessing
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => !isProcessing && handleAction(onToggleStatus)}
              disabled={isProcessing}
            >
              {user.status === "ACTIVE" ? "Suspend admin" : "Activate admin"}
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
