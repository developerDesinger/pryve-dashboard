"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { notificationsAPI, type Notification } from "@/lib/api/notifications";
import { useToast } from "@/hooks/useToast";
import { PageLoader } from "@/components/ui/loader";

type NotificationScope = "inbox" | "sent" | "all";
type NotificationCategory = "BROADCAST" | "PAYMENT" | "ACCOUNT" | "all";

export default function NotificationsPage() {
  const { showError, showSuccess, showLoading, dismiss } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<NotificationScope>("inbox");
  const [category, setCategory] = useState<NotificationCategory>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  const fetchNotifications = async () => {
    setLoading(true);
    const loadingToast = showLoading("Loading notifications...");
    
    try {
      const response = await notificationsAPI.getNotifications({
        scope,
        category: category === "all" ? undefined : category,
        page: currentPage,
        pageSize,
      });

      if (response.success && response.data) {
        setNotifications(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        showError(response.message || "Failed to load notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showError("An error occurred while loading notifications");
    } finally {
      dismiss(loadingToast);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [scope, category, currentPage]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await notificationsAPI.markAsRead(notificationId);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
        showSuccess("Notification marked as read");
      } else {
        showError(response.message || "Failed to mark notification as read");
      }
    } catch (error) {
      showError("An error occurred while marking notification as read");
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "BROADCAST":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "PAYMENT":
        return "bg-green-100 text-green-700 border-green-200";
      case "ACCOUNT":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (loading && notifications.length === 0) {
    return <PageLoader text="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Notifications</h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
          View and manage your notifications
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white rounded-2xl border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Scope</label>
            <select
              value={scope}
              onChange={(e) => {
                setScope(e.target.value as NotificationScope);
                setCurrentPage(1);
              }}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#757575]"
            >
              <option value="inbox">Inbox</option>
              <option value="sent">Sent</option>
              <option value="all">All (Admin)</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as NotificationCategory);
                setCurrentPage(1);
              }}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#757575]"
            >
              <option value="all">All Categories</option>
              <option value="BROADCAST">Broadcast</option>
              <option value="PAYMENT">Payment</option>
              <option value="ACCOUNT">Account</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-8 bg-white rounded-2xl border border-gray-200 text-center">
            <div className="text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 mx-auto mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm mt-2">
                {scope === "inbox"
                  ? "You don't have any notifications yet."
                  : scope === "sent"
                  ? "You haven't sent any notifications yet."
                  : "No notifications available."}
              </p>
            </div>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 bg-white rounded-2xl border transition-all ${
                notification.isRead
                  ? "border-gray-200 bg-gray-50/50"
                  : "border-[#757575] bg-white shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                        notification.category
                      )}`}
                    >
                      {notification.category}
                    </span>
                    {notification.eventType && (
                      <span className="text-xs text-muted-foreground">
                        {notification.eventType.replace(/_/g, " ")}
                      </span>
                    )}
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#757575]"></span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                  <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatDate(notification.createdAt)}</span>
                    {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                      <span className="text-[#757575]">• Has metadata</span>
                    )}
                  </div>
                </div>
                {!notification.isRead && scope === "inbox" && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#757575] text-white text-xs font-medium hover:brightness-95 transition-colors whitespace-nowrap"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4 bg-white rounded-2xl border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to{" "}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems} notifications
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-[#757575] text-white text-sm font-semibold hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

