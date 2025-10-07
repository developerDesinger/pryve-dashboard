"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";

type Activity = {
  id: string;
  name: string;
  desc: string;
  impact: "High Impact" | "Medium" | "Low";
};

const DEFAULT: Activity[] = [
  { id: "1", name: "Emma Johnson", desc: "Upgraded to premium after trial", impact: "High Impact" },
  { id: "2", name: "Sara Chen", desc: "New user registration via Google", impact: "Medium" },
  { id: "3", name: "Alex Rivera", desc: "Heavy usage - 25 messages", impact: "High Impact" },
  { id: "4", name: "Sara Chen", desc: "New user registration via Google", impact: "Medium" },
  { id: "5", name: "Emma Johnson", desc: "Upgraded to premium after trial", impact: "High Impact" },
  { id: "6", name: "Marcus Lee", desc: "Cancelled subscription", impact: "Low" },
  { id: "7", name: "Priya Kapoor", desc: "Invited 3 teammates", impact: "Medium" },
  { id: "8", name: "Diego Martinez", desc: "Reached 100 messages this week", impact: "High Impact" },
  { id: "9", name: "Ava Thompson", desc: "Password reset via email", impact: "Low" },
  { id: "10", name: "Noah Williams", desc: "Started free trial", impact: "Medium" },
  { id: "11", name: "Liu Wei", desc: "Payment failed - card declined", impact: "High Impact" },
  { id: "12", name: "Fatima Ali", desc: "Changed workspace name", impact: "Low" },
];

export default function RecentActivityList({ items = DEFAULT, className, maxHeight = 520 }: { items?: Activity[]; className?: string; maxHeight?: number }) {
  const colorFor = (impact: Activity["impact"]) =>
    impact === "High Impact" ? "#fecdd3" : impact === "Medium" ? "#fde68a" : "#e5e7eb";

  return (
    <Card className={`rounded-2xl p-5 bg-white dark:bg-white w-full min-w-0 h-full flex flex-col ${className ?? ""}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl border border-border inline-flex items-center justify-center">
          <img src="/icons/Unselect-side/chat-flow.svg" alt="recent" className="w-5 h-5" />
        </div>
        <div className="text-[20px] font-semibold">Recent Activity</div>
      </div>

      <div className="space-y-3 overflow-auto pr-1 flex-1" style={{ maxHeight }}>
        {items.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-accent p-4 flex items-center justify-between">
            <div>
              <div className="text-[16px] font-semibold">{a.name}</div>
              <div className="text-[12px] text-muted-foreground">{a.desc}</div>
            </div>
            <span className="text-[12px] px-3 py-1 rounded-full" style={{ background: colorFor(a.impact) }}>
              {a.impact}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}


