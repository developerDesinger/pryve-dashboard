"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { dashboardAPI } from "@/lib/api/dashboard";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, ChartTooltip, Legend);

type Props = {
  active?: number;
  inactive?: number;
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function UserEngagementDonut({ active, inactive }: Props) {
  const [counts, setCounts] = React.useState({
    active: active ?? 0,
    inactive: inactive ?? 0,
  });
  const [meta, setMeta] = React.useState({
    totalUsers: (active ?? 0) + (inactive ?? 0),
    engagementRate: "--",
  });
  const shouldAutoFetch = active === undefined && inactive === undefined;

  React.useEffect(() => {
    if (!shouldAutoFetch) {
      setCounts({
        active: active ?? 0,
        inactive: inactive ?? 0,
      });
      setMeta((prev) => ({
        totalUsers: (active ?? 0) + (inactive ?? 0),
        engagementRate: prev.engagementRate,
      }));
      return;
    }

    let mounted = true;
    (async () => {
      const response = await dashboardAPI.getUserEngagement();
      if (!mounted) return;
      if (response.success) {
        const payload = response.data;
        const breakdown = payload?.breakdown ?? {};
        setCounts((prev) => {
          const nextActive = toNumber(
            breakdown.activeUsers,
            toNumber(
              payload?.activeUsers,
              toNumber(payload?.active, prev.active)
            )
          );
          const nextInactive = toNumber(
            breakdown.inactiveUsers,
            toNumber(
              payload?.inactiveUsers,
              toNumber(payload?.inactive, prev.inactive)
            )
          );
          const totalUsers = toNumber(
            breakdown.totalUsers,
            nextActive + nextInactive
          );
          const engagementRate =
            payload?.recentActivity?.engagementRate ??
            (payload?.percentages?.activePercentage !== undefined
              ? `${payload.percentages.activePercentage}% active`
              : "--");
          setMeta({
            totalUsers,
            engagementRate,
          });
          return {
            active: nextActive,
            inactive: nextInactive,
          };
        });
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, inactive, shouldAutoFetch]);

  const activeValue = counts.active;
  const inactiveValue = counts.inactive;

  const data: ChartData<"doughnut", number[], string> = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        data: [activeValue, inactiveValue],
        backgroundColor: ["#ef9a9a", "#6b7280"],
        borderColor: ["#ef9a9a", "#6b7280"],
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#111827",
        bodyColor: "#111827",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
  };

  return (
    <Card className="rounded-2xl p-5 bg-white dark:bg-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl border border-border inline-flex items-center justify-center">
          <img
            src="/icons/Unselect-side/users.svg"
            alt="engagement"
            className="w-5 h-5"
          />
        </div>
        <div className="text-[20px] font-semibold">User Engagement</div>
      </div>

      <div className="relative w-full min-w-0" style={{ height: 300 }}>
        <Doughnut data={data} options={options} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-center text-[14px]">
        <div className="rounded-2xl border border-border bg-accent/50 p-3">
          <div className="text-[12px] uppercase tracking-wide text-muted-foreground">
            Total Users
          </div>
          <div className="text-[18px] font-semibold">{meta.totalUsers}</div>
        </div>
        <div className="rounded-2xl border border-border bg-accent/50 p-3">
          <div className="text-[12px] uppercase tracking-wide text-muted-foreground">
            Engagement
          </div>
          <div className="text-[18px] font-semibold">{meta.engagementRate}</div>
        </div>
      </div>

      {/* Legend below chart to avoid overflow */}
      <div className="mt-3 flex items-center justify-center gap-6 text-[14px] flex-wrap">
        <div className="inline-flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ background: "#ef9a9a" }}
          />
          <span>Active Users</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ background: "#6b7280" }}
          />
          <span>Inactive Users</span>
        </div>
      </div>
    </Card>
  );
}
