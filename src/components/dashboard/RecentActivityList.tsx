"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { dashboardAPI, type RecentActivityItem } from "@/lib/api/dashboard";

type Activity = RecentActivityItem;

const DEFAULT: Activity[] = [
  {
    id: "1",
    name: "Emma Johnson",
    desc: "Upgraded to premium after trial",
    impact: "High Impact",
  },
  {
    id: "2",
    name: "Sara Chen",
    desc: "New user registration via Google",
    impact: "Medium",
  },
  {
    id: "3",
    name: "Alex Rivera",
    desc: "Heavy usage - 25 messages",
    impact: "High Impact",
  },
  {
    id: "4",
    name: "Sara Chen",
    desc: "New user registration via Google",
    impact: "Medium",
  },
  {
    id: "5",
    name: "Emma Johnson",
    desc: "Upgraded to premium after trial",
    impact: "High Impact",
  },
  {
    id: "6",
    name: "Marcus Lee",
    desc: "Cancelled subscription",
    impact: "Low",
  },
  {
    id: "7",
    name: "Priya Kapoor",
    desc: "Invited 3 teammates",
    impact: "Medium",
  },
  {
    id: "8",
    name: "Diego Martinez",
    desc: "Reached 100 messages this week",
    impact: "High Impact",
  },
  {
    id: "9",
    name: "Ava Thompson",
    desc: "Password reset via email",
    impact: "Low",
  },
  {
    id: "10",
    name: "Noah Williams",
    desc: "Started free trial",
    impact: "Medium",
  },
  {
    id: "11",
    name: "Liu Wei",
    desc: "Payment failed - card declined",
    impact: "High Impact",
  },
  {
    id: "12",
    name: "Fatima Ali",
    desc: "Changed workspace name",
    impact: "Low",
  },
];

const normalizeActivities = (payload: unknown): Activity[] => {
  if (!payload) return [];

  const candidateArrays = [
    (payload as any)?.items,
    (payload as any)?.activities,
    (payload as any)?.recentActivity?.activities,
    Array.isArray(payload) ? payload : null,
  ].filter(Boolean) as unknown[][];

  const activitiesArray =
    candidateArrays.find((arr) => Array.isArray(arr)) ?? [];

  const toImpact = (value: unknown): Activity["impact"] => {
    if (value === "High Impact" || value === "Medium" || value === "Low") {
      return value;
    }
    if (typeof value === "string" && value.toLowerCase().includes("high"))
      return "High Impact";
    if (typeof value === "string" && value.toLowerCase().includes("low"))
      return "Low";
    return "Medium";
  };

  return activitiesArray.map((item, index) => {
    const entry = item as Record<string, any>;
    const user = entry?.user ?? {};
    const fallbackName =
      entry?.name ??
      user.name ??
      user.email ??
      user.fullName ??
      `User ${index + 1}`;
    return {
      id: entry?.id ?? entry?.activityId ?? `activity-${index}`,
      name: fallbackName,
      desc: entry?.desc ?? entry?.description ?? "Recent account activity",
      impact: toImpact(entry?.impact),
    };
  });
};

export default function RecentActivityList({
  items,
  className,
  maxHeight = 520,
}: {
  items?: Activity[];
  className?: string;
  maxHeight?: number;
}) {
  const [activities, setActivities] = React.useState<Activity[]>(
    items ?? DEFAULT
  );

  React.useEffect(() => {
    if (items) {
      setActivities(items);
      return;
    }

    let mounted = true;
    (async () => {
      const response = await dashboardAPI.getRecentActivity(20);
      if (!mounted) return;
      if (response.success) {
        const remoteItems = normalizeActivities(response.data);
        setActivities(remoteItems.length ? remoteItems : DEFAULT);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [items]);

  const colorFor = (impact: Activity["impact"]) =>
    impact === "High Impact"
      ? "#fecdd3"
      : impact === "Medium"
      ? "#fde68a"
      : "#e5e7eb";

  return (
    <Card
      className={`rounded-2xl p-5 bg-white dark:bg-white w-full min-w-0 h-full flex flex-col ${
        className ?? ""
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl border border-border inline-flex items-center justify-center">
          <img
            src="/icons/Unselect-side/chat-flow.svg"
            alt="recent"
            className="w-5 h-5"
          />
        </div>
        <div className="text-[20px] font-semibold">Recent Activity</div>
      </div>

      <div
        className="space-y-3 overflow-auto pr-1 flex-1"
        style={{ maxHeight }}
      >
        {activities.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-border bg-accent p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-[16px] font-semibold">{a.name}</div>
              <div className="text-[12px] text-muted-foreground">{a.desc}</div>
            </div>
            <span
              className="text-[12px] px-3 py-1 rounded-full"
              style={{ background: colorFor(a.impact) }}
            >
              {a.impact}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
