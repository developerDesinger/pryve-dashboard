"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";

type Metric = {
  id: string;
  title: string;
  description: string;
  value: string; // percentage text
  badgeBg: string; // background for the right badge
};

const DEFAULT_METRICS: Metric[] = [
  {
    id: "free-to-trial",
    title: "Free to Trial",
    description: "Percentage of free users converting to trial, with a sample user sentiment.",
    value: "8.9%",
    badgeBg: "#e9f1ff",
  },
  {
    id: "trial-to-premium",
    title: "Trial to Premium",
    description: "Percentage of trial users upgrading to premium, with a representative quote.",
    value: "23.7%",
    badgeBg: "#eaf8f1",
  },
  {
    id: "churn",
    title: "Churn Rate",
    description: "Percentage of users leaving the platform, paired with an example concern.",
    value: "4.3%",
    badgeBg: "#fee2e2",
  },
];

export default function ConversionMetrics({ metrics = DEFAULT_METRICS }: { metrics?: Metric[] }) {
  return (
    <Card className="rounded-2xl p-5 bg-white dark:bg-white w-full min-w-0">
      <div className="mb-4">
        <div className="flex items-center gap-1 text-[18px] font-semibold">
          <span className="w-9 h-9 rounded-xl inline-flex items-center justify-center">
            <img src="/icons/Analytics/Icon%20(4).svg" alt="Conversion Metrics" className="w-5 h-5" />
          </span>
          <span>Conversion Metrics</span>
        </div>
        <div className="text-[14px] text-muted-foreground">User progression through funnel</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border bg-accent p-5 flex items-start gap-4">
            <span className="w-9 h-9 rounded-xl inline-flex items-center justify-center">
              <img src="/icons/Analytics/Icon%20(3).svg" alt="" className="w-5 h-5" />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{m.title}</div>
                <span className="text-[12px] px-3 py-1 rounded-full" style={{ background: m.badgeBg }}>{m.value}</span>
              </div>
              <div className="text-[12px] text-muted-foreground mt-2">{m.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}


