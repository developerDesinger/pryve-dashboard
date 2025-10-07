"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import engagement from "@/data/engagement.json";
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

export default function UserEngagementDonut({ active = engagement.active, inactive = engagement.inactive }: Props) {
  const data: ChartData<'doughnut', number[], string> = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        data: [active, inactive],
        backgroundColor: ["#ef9a9a", "#6b7280"],
        borderColor: ["#ef9a9a", "#6b7280"],
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
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
          <img src="/icons/Unselect-side/users.svg" alt="engagement" className="w-5 h-5" />
        </div>
        <div className="text-[20px] font-semibold">User Engagement</div>
      </div>

      <div className="relative w-full min-w-0" style={{ height: 300 }}>
        <Doughnut data={data} options={options} />
      </div>

      {/* Legend below chart to avoid overflow */}
      <div className="mt-3 flex items-center justify-center gap-6 text-[14px] flex-wrap">
        <div className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#ef9a9a" }} />
          <span>Active Users</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#6b7280" }} />
          <span>Inactive Users</span>
        </div>
      </div>
    </Card>
  );
}


