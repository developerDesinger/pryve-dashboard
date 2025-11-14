"use client";

import * as React from "react";
import StatCard from "@/components/dashboard/StatCard";
import {
  dashboardAPI,
  type DashboardStat,
  type DashboardSummaryResponse,
} from "@/lib/api/dashboard";

const formatValue = (value: number | string | undefined) => {
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  return value ?? "--";
};

const formatChange = (stat: DashboardStat) => {
  if (stat.changeText) {
    return stat.changeText;
  }
  if (typeof stat.changePercentage === "number") {
    return `${stat.changePercentage > 0 ? "+" : ""}${
      stat.changePercentage
    }% vs last period`;
  }
  return "No change data";
};

const changeClass = (stat: DashboardStat) => {
  if (stat.changeClassName) return stat.changeClassName;
  if (typeof stat.changePercentage === "number") {
    return stat.changePercentage >= 0 ? "text-emerald-500" : "text-rose-500";
  }
  if (stat.changeDirection === "down") return "text-rose-500";
  if (stat.changeDirection === "up") return "text-emerald-500";
  return "text-foreground";
};

const sanitizeStats = (items: unknown): DashboardStat[] => {
  if (!Array.isArray(items)) return [];
  return items.filter((stat): stat is DashboardStat =>
    Boolean(stat && typeof stat === "object")
  );
};

const buildDerivedStats = (
  payload: DashboardSummaryResponse | DashboardStat[] | undefined
): DashboardStat[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return sanitizeStats(payload);
  }
  if (!Array.isArray(payload.stats)) {
    const stats: DashboardStat[] = [];
    const activitySummary = payload.userActivityTrends?.summary;
    const engagement = payload.userEngagement;
    const topicsSummary = payload.emotionalTopicsAnalysis?.summary;
    const recentActivity = payload.recentActivity;

    if (activitySummary) {
      stats.push({
        id: "total-active-users",
        title: "Total Active Users",
        value: activitySummary.totalActiveUsers ?? 0,
        changeText: activitySummary.averageDailyActiveUsers
          ? `Avg daily ${activitySummary.averageDailyActiveUsers}`
          : undefined,
        changeClassName: "text-muted-foreground",
      });
      stats.push({
        id: "total-messages",
        title: "Total Messages",
        value: activitySummary.totalMessages ?? 0,
        changeText: activitySummary.averageDailyMessages
          ? `Avg daily ${activitySummary.averageDailyMessages}`
          : undefined,
        changeClassName: "text-muted-foreground",
      });
    }

    if (engagement) {
      const breakdown = engagement.breakdown ?? {};
      stats.push({
        id: "engagement-rate",
        title: "Engagement Rate",
        value: engagement.recentActivity?.engagementRate ?? "--",
        changeText:
          breakdown.totalUsers !== undefined
            ? `${breakdown.activeUsers ?? 0}/${breakdown.totalUsers} active`
            : undefined,
        changeClassName: "text-emerald-500",
      });
    }

    if (topicsSummary || recentActivity) {
      stats.push({
        id: "positive-topics",
        title: "Positive Topics",
        value:
          topicsSummary?.positiveTopics ?? topicsSummary?.totalMentions ?? "--",
        changeText: topicsSummary?.avgGrowth
          ? `Avg growth ${topicsSummary.avgGrowth}`
          : undefined,
        changeClassName: "text-emerald-500",
      });
      if (recentActivity) {
        stats.push({
          id: "recent-activity-count",
          title: "Recent Activities",
          value: recentActivity.total ?? recentActivity.activities?.length ?? 0,
          changeText: "Last updates",
          changeClassName: "text-muted-foreground",
        });
      }
    }

    return stats;
  }

  return sanitizeStats(payload.stats);
};

export default function DashboardStatsGrid() {
  const [stats, setStats] = React.useState<DashboardStat[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const response = await dashboardAPI.getDashboardSummary("monthly");
      if (!mounted) return;
      if (response.success) {
        const derived = buildDerivedStats(response.data);
        setStats(derived);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!stats.length) {
    return (
      <div className="text-center py-8 col-span-full">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            width="24"
            height="24"
            className="text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {loading ? "Loading stats..." : "No stats available"}
        </h3>
        <p className="text-gray-500">
          Dashboard statistics will be loaded from API
        </p>
      </div>
    );
  }

  return (
    <>
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id ?? `${stat.title ?? "stat"}-${index}`}
          title={stat.title ?? "Untitled metric"}
          value={formatValue(stat.value)}
          changeText={formatChange(stat)}
          changeClassName={changeClass(stat)}
        />
      ))}
    </>
  );
}
