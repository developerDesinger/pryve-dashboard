"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { dashboardAPI, type EmotionalTopic } from "@/lib/api/dashboard";

const COLOR_PALETTE = [
  "#20b2aa",
  "#8b5cf6",
  "#ef4444",
  "#fb923c",
  "#16a34a",
  "#3b82f6",
  "#0ea5e9",
];

const DEFAULT_TOPICS: EmotionalTopic[] = [
  {
    name: "Work-Life Balance",
    members: 23,
    percent: 20,
    color: COLOR_PALETTE[0],
  },
  {
    name: "Relationship Issues",
    members: 328,
    percent: 72,
    color: COLOR_PALETTE[1],
  },
  {
    name: "Anxiety & Stress",
    members: 81,
    percent: 35,
    color: COLOR_PALETTE[2],
  },
  {
    name: "Self Confidence",
    members: 76,
    percent: 48,
    color: COLOR_PALETTE[3],
  },
  {
    name: "Career Transitions",
    members: 64,
    percent: 36,
    color: COLOR_PALETTE[4],
  },
  {
    name: "Family Dynamics",
    members: 245,
    percent: 44,
    color: COLOR_PALETTE[5],
  },
];

const normalizeTopics = (
  list: EmotionalTopic[] | undefined
): EmotionalTopic[] => {
  if (!list?.length) return DEFAULT_TOPICS;
  return list.map((topic, index) => ({
    ...topic,
    name: topic.name ?? topic.topic ?? `Topic ${index + 1}`,
    members: topic.members ?? topic.mentions ?? 0,
    percent: topic.percent ?? topic.percentage ?? 0,
    color: topic.color ?? COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));
};

const DEFAULT_SUMMARY = {
  totalMentions: 847,
  positiveTopics: 8,
  avgGrowth: "14%",
};

export default function EmotionalTopicsAnalysis({
  topics,
}: {
  topics?: EmotionalTopic[];
}) {
  const [items, setItems] = React.useState<EmotionalTopic[]>(
    normalizeTopics(topics ?? DEFAULT_TOPICS)
  );
  const [summary, setSummary] = React.useState(DEFAULT_SUMMARY);

  React.useEffect(() => {
    if (topics) {
      setItems(normalizeTopics(topics));
      return;
    }

    let mounted = true;
    (async () => {
      const response = await dashboardAPI.getEmotionalTopics();
      if (!mounted) return;
      if (response.success) {
        const remoteTopics = Array.isArray(response.data?.topics)
          ? (response.data.topics as EmotionalTopic[])
          : Array.isArray(response.data?.emotionalTopicsAnalysis?.topics)
          ? (response.data.emotionalTopicsAnalysis?.topics as EmotionalTopic[])
          : [];
        const normalized = normalizeTopics(remoteTopics);
        setItems(normalized.length ? normalized : DEFAULT_TOPICS);

        const summaryData =
          response.data?.summary ??
          response.data?.emotionalTopicsAnalysis?.summary ??
          null;
        if (summaryData) {
          setSummary({
            totalMentions:
              summaryData.totalMentions ?? DEFAULT_SUMMARY.totalMentions,
            positiveTopics:
              summaryData.positiveTopics ?? DEFAULT_SUMMARY.positiveTopics,
            avgGrowth: summaryData.avgGrowth ?? DEFAULT_SUMMARY.avgGrowth,
          });
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [topics]);

  return (
    <Card className="rounded-2xl p-5 bg-white dark:bg-white w-full min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-border inline-flex items-center justify-center">
            <img
              src="/icons/Unselect-side/memory.svg"
              alt="topics"
              className="w-5 h-5"
            />
          </div>
          <div>
            <div className="text-[20px] font-semibold">
              Emotional Topics Analysis
            </div>
            <div className="text-[14px] text-muted-foreground">
              AI-detected themes from user conversations
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Mentions", value: summary.totalMentions },
          { label: "Positive Topics", value: summary.positiveTopics },
          { label: "Avg Growth", value: summary.avgGrowth },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-border bg-accent p-4 text-center"
          >
            <div className="text-[14px] text-muted-foreground">{m.label}</div>
            <div className="text-[24px] font-semibold mt-1">
              {m.value ?? "--"}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {items.map((t, index) => (
          <div key={`${t.name}-${index}`} className="space-y-1">
            <div className="text-[14px] font-medium">{t.name}</div>
            <div className="text-[12px] text-muted-foreground">
              {(t.members ?? t.mentions ?? 0).toLocaleString()} members
            </div>
            <div className="relative h-2.5 rounded-full bg-[#e9ecef] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, t.percent ?? 0)}%`,
                  background: t.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
