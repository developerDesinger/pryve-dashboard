"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";

type Cell = { id: string; label: string; value: string; tone: "pos" | "neg" };

const DEFAULT_CELLS: Cell[] = [
  { id: "anxiety", label: "Anxiety", value: "234 mentions", tone: "neg" },
  { id: "happy", label: "Happy", value: "189 mentions", tone: "pos" },
  { id: "confused", label: "Confused", value: "14%", tone: "pos" },
  { id: "stressed", label: "Stressed", value: "167 mentions", tone: "neg" },
  { id: "grateful", label: "Grateful", value: "143 mentions", tone: "pos" },
  { id: "excited", label: "Excited", value: "14%", tone: "pos" },
  { id: "overwhelmed", label: "Overwhelmed", value: "128 mentions", tone: "neg" },
  { id: "sad", label: "Sad", value: "98 mentions", tone: "neg" },
  { id: "hopeful", label: "Hopeful", value: "14%", tone: "pos" },
  { id: "confident", label: "Confident", value: "14%", tone: "pos" },
];

export default function EmotionalKeywordHeatmap({ cells = DEFAULT_CELLS }: { cells?: Cell[] }) {
  const colorFor = (t: Cell["tone"]) => (t === "neg" ? "#ef4444" : "#16a34a");
  return (
    <Card className="rounded-2xl p-5 bg-white dark:bg-white w-full min-w-0 h-full">
      <div className="mb-2">
        <div className="flex items-center gap-1 text-[18px] font-semibold">
          <span className="w-9 h-9 rounded-xl inline-flex items-center justify-center">
            <img src="/icons/Unselect-side/analytics.svg" alt="Emotional Keyword Heatmap" className="w-5 h-5" />
          </span>
          <span>Emotional Keyword Heatmap</span>
        </div>
        <div className="text-[14px] text-muted-foreground">Most frequently mentioned emotional keywords</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cells.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border p-6 text-center"
            style={{ borderColor: colorFor(c.tone) }}
          >
            <div className="font-semibold" style={{ color: colorFor(c.tone) }}>{c.label}</div>
            <div className="text-[14px] text-muted-foreground mt-2">{c.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}


