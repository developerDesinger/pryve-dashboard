"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authAPI, type User } from "@/lib/api/auth";
import { notificationsAPI } from "@/lib/api/notifications";
import { cookieUtils } from "@/lib/cookies";
import { useToast } from "@/hooks/useToast";

export function Topbar() {
  const router = useRouter();
  const { showError, showSuccess, showLoading, dismiss } = useToast();
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const filteredUsers = useMemo(() => {
    const query = userSearch.toLowerCase();
    return users.filter((user) =>
      `${user.fullName} ${user.email}`.toLowerCase().includes(query)
    );
  }, [userSearch, users]);

  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const token = cookieUtils.getAuthToken() || "";
      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await authAPI.getAllUsers(token, 1, 100);
      if (response.success && response.data) {
        setUsers(response.data.data ?? []);
        setHasLoadedUsers(true);
      } else {
        showError(response.message || "Unable to load users");
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      showError("Failed to load users. Please try again.");
    } finally {
      setLoadingUsers(false);
    }
  }, [showError]);

  useEffect(() => {
    if (isBroadcastOpen && !hasLoadedUsers && !loadingUsers) {
      loadUsers();
    }
  }, [isBroadcastOpen, hasLoadedUsers, loadingUsers, loadUsers]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const removeSelectedUser = (userId: string) => {
    setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
  };

  const handleSendBroadcast = async () => {
    if (!selectedUserIds.length) {
      showError("Please select at least one recipient.");
      return;
    }

    if (!broadcastMessage.trim()) {
      showError("Please enter a message.");
      return;
    }

    setIsSending(true);
    const loadingToast = showLoading("Sending broadcast...");
    try {
      const response = await notificationsAPI.sendBroadcast({
        title: "Broadcast Message",
        message: broadcastMessage.trim(),
        sendToAll: false,
        recipientIds: selectedUserIds,
        category: "BROADCAST",
      });

      if (response.success) {
        showSuccess(`Broadcast sent to ${selectedUserIds.length} ${selectedUserIds.length === 1 ? "user" : "users"}.`);
        setIsBroadcastOpen(false);
        setSelectedUserIds([]);
        setBroadcastMessage("");
        setUserSearch("");
        setIsUserDropdownOpen(false);
      } else {
        showError(response.message || "Failed to send broadcast. Please try again.");
      }
    } catch (error) {
      console.error("Broadcast send error:", error);
      showError("Failed to send broadcast. Please try again.");
    } finally {
      dismiss(loadingToast);
      setIsSending(false);
    }
  };

  const closeBroadcastModal = () => {
    if (isSending) return;
    setIsBroadcastOpen(false);
    setIsUserDropdownOpen(false);
    setUserSearch("");
    setSelectedUserIds([]);
    setBroadcastMessage("");
  };

  useEffect(() => {
    if (!isBroadcastOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeBroadcastModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isBroadcastOpen]);

  return (
    <>
      <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-white dark:bg-white">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden w-10 h-10 rounded-full border border-border inline-flex items-center justify-center bg-white dark:bg-white text-foreground cursor-pointer"
            aria-label="Open menu"
            onClick={(e) => {
              e.stopPropagation();
              const el = document.getElementById("app-sidebar");
              if (el) {
                el.classList.remove("-translate-x-full");
                el.classList.add("translate-x-0");
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="hidden md:flex flex-col">
            <span className="text-sm text-muted-foreground">Pryve Dashboard</span>
            <span className="text-lg font-semibold text-[#242424]">Settings & Insights</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => router.push("/dashboard/notifications")}
            aria-label="Notifications"
            className="w-10 h-10 aspect-square shrink-0 rounded-full border border-border inline-flex items-center justify-center text-muted-foreground bg-white dark:bg-white p-0 cursor-pointer hover:bg-accent transition-colors"
          >
            <img src="/icons/bell.svg" alt="Notifications" className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="h-10 rounded-[18px] px-2 sm:px-6 bg-[#757575] text-white hover:brightness-95 inline-flex items-center justify-center gap-1.5 sm:gap-3 font-semibold text-[12px] sm:text-[14px] min-w-[96px] sm:min-w-[160px] whitespace-nowrap cursor-pointer transition-all"
          >
            <img src="/icons/message-text.svg" alt="Send Broadcast" className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Send Broadcast</span>
            <span className="sm:hidden">Send</span>
          </button>
        </div>
      </header>

      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeBroadcastModal}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 space-y-6 z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[#242424]">Send Broadcast Message</h3>
                <p className="text-sm text-muted-foreground">
                  Select recipients and compose a message to send them directly.
                </p>
              </div>
              <button
                onClick={closeBroadcastModal}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent"
                aria-label="Close broadcast modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Recipients</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-left text-sm"
                >
                  <span className="truncate">
                    {selectedUserIds.length
                      ? `${selectedUserIds.length} recipient${selectedUserIds.length > 1 ? "s" : ""} selected`
                      : "Select users"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-4 space-y-3 max-h-80 overflow-hidden">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users by name or email..."
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#757575]"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                      {loadingUsers ? (
                        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                          Loading users...
                        </div>
                      ) : filteredUsers.length ? (
                        filteredUsers.map((user) => (
                          <label
                            key={user.id}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent cursor-pointer text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={selectedUserIds.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                              className="w-4 h-4 accent-[#757575]"
                            />
                            <div className="overflow-hidden">
                              <p className="font-medium text-gray-900 truncate">{user.fullName}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </label>
                        ))
                      ) : (
                        <div className="text-sm text-center text-muted-foreground py-4">
                          {userSearch ? "No users match your search." : "No users available."}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-gray-100">
                      <span>{selectedUserIds.length} selected</span>
                      <button
                        type="button"
                        className="text-[#757575] font-medium"
                        onClick={() => setSelectedUserIds(filteredUsers.map((user) => user.id))}
                      >
                        Select visible
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {selectedUserIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUserIds.map((userId) => {
                    const user = users.find((u) => u.id === userId);
                    if (!user) return null;
                    return (
                      <span
                        key={userId}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-sm text-gray-700"
                      >
                        {user.fullName}
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-900 focus:outline-none"
                          onClick={() => removeSelectedUser(userId)}
                          aria-label={`Remove ${user.fullName}`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#757575]"
                placeholder="Write your announcement or important update..."
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeBroadcastModal}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendBroadcast}
                disabled={isSending || !selectedUserIds.length || !broadcastMessage.trim()}
                className="px-5 py-2 rounded-xl bg-[#757575] text-white text-sm font-semibold hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


