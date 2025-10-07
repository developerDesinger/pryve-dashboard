"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";

type Topic = {
  name: string;
  members: number;
  percent: number; // 0..100
  color: string;
};

const DEFAULT_TOPICS: Topic[] = [
  { name: "Work-Life Balance", members: 23, percent: 20, color: "#20b2aa" },
  { name: "Relationship Issues", members: 328, percent: 72, color: "#8b5cf6" },
  { name: "Anxiety & Stress", members: 81, percent: 35, color: "#ef4444" },
  { name: "Self Confidence", members: 76, percent: 48, color: "#fb923c" },
  { name: "Career Transitions", members: 64, percent: 36, color: "#16a34a" },
  { name: "Family Dynamics", members: 245, percent: 44, color: "#3b82f6" },
];

export default function EmotionalTopicsAnalysis({ topics = DEFAULT_TOPICS }: { topics?: Topic[] }) {
  return (
    <Card className="rounded-2xl p-5 bg-white dark:bg-white w-full min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-border inline-flex items-center justify-center">
            <img src="/icons/Unselect-side/memory.svg" alt="topics" className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[20px] font-semibold">Emotional Topics Analysis</div>
            <div className="text-[14px] text-muted-foreground">AI-detected themes from user conversations</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Mentions", value: "847" },
          { label: "Positive Topics", value: "8" },
          { label: "Avg Growth", value: "14%" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-accent p-4 text-center">
            <div className="text-[14px] text-muted-foreground">{m.label}</div>
            <div className="text-[24px] font-semibold mt-1">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {topics.map((t) => (
          <div key={t.name} className="space-y-1">
            <div className="text-[14px] font-medium">{t.name}</div>
            <div className="text-[12px] text-muted-foreground">{t.members} members</div>
            <div className="relative h-2.5 rounded-full bg-[#e9ecef] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${t.percent}%`, background: t.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}


