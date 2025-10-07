"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";

type Item = { id: string; title: string; subtitle: string; count: number };

const DEFAULT_ITEMS: Item[] = [
  { id: "stress", title: "Stress", subtitle: "“I'm feeling overwhelmed today”", count: 127 },
  { id: "relationship", title: "Relationship", subtitle: "“I'm having a tough time in my relationships”", count: 1328 },
  { id: "anxiety", title: "Anxiety", subtitle: "“I need help with anxiety”", count: 235 },
  { id: "welcome", title: "Welcome", subtitle: "“How are you today”", count: 110 },
  { id: "work", title: "Work-life Balance", subtitle: "“I'm struggling with work stress”", count: 169 },
];

export default function TopFirstMessages({ items = DEFAULT_ITEMS }: { items?: Item[] }) {
  return (
    <Card className="rounded-2xl p-5 bg-white dark:bg-white w-full min-w-0 h-full flex flex-col">
      <div className="mb-2">
        <div className="flex items-center gap-1 text-[18px] font-semibold">
          <span className="w-9 h-9 rounded-xl inline-flex items-center justify-center">
            <img src="/icons/Analytics/Icon%20(2).svg" alt="Top First Messages" className="w-5 h-5" />
          </span>
          <span>Top First Messages</span>
        </div>
        <div className="text-[14px] text-muted-foreground">Most common conversation starters</div>
      </div>
      <div className="mt-2 space-y-3 overflow-auto pr-1 flex-1">
        {items.map((it) => (
          <div key={it.id} className="rounded-2xl border border-border bg-accent p-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl inline-flex items-center justify-center">
                <img src="/icons/Analytics/Icon%20(3).svg" alt="" className="w-5 h-5" />
              </span>
              <div>
                <div className="text-[16px] font-semibold">{it.title}</div>
                <div className="text-[12px] text-muted-foreground">{it.subtitle}</div>
              </div>
            </div>
            <span className="text-[12px] px-3 py-1 rounded-full bg-white border border-border">{it.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}


