"use client";

import { useEffect, useMemo, useState } from "react";
import UserStatMiniCard, {
  type UserStat,
} from "@/components/dashboard/UserStatMiniCard";
import TopFirstMessages from "@/components/dashboard/TopFirstMessages";
import EmotionalKeywordHeatmap from "@/components/dashboard/EmotionalKeywordHeatmap";
import ConversionMetrics from "@/components/dashboard/ConversionMetrics";
import {
  analyticsAPI,
  type EmotionsAnalyticsResponse,
} from "@/lib/api/analytics";

type Cell = { id: string; label: string; value: string; tone: "pos" | "neg" };
type FirstMessageItem = {
  id: string;
  title: string;
  subtitle: string;
  count: number;
};

// Helper function to determine emotion tone
const getEmotionTone = (emotion: string): "pos" | "neg" => {
  const positiveEmotions = [
    "joy",
    "happy",
    "grateful",
    "excited",
    "hopeful",
    "confident",
    "curious",
    "surprise",
    "neutral",
  ];
  const negativeEmotions = [
    "anger",
    "sad",
    "stressed",
    "overwhelmed",
    "anxiety",
    "confusion",
    "fear",
    "disgust",
  ];

  const lowerEmotion = emotion.toLowerCase();
  if (positiveEmotions.includes(lowerEmotion)) return "pos";
  if (negativeEmotions.includes(lowerEmotion)) return "neg";
  return "pos"; // Default to positive
};

// Helper function to capitalize first letter
const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function AnalyticsPage() {
  const [emotionsData, setEmotionsData] = useState<Cell[]>([]);
  const [firstMessagesData, setFirstMessagesData] = useState<
    FirstMessageItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<EmotionsAnalyticsResponse | null>(
    null
  );

  useEffect(() => {
    const fetchEmotionsAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analyticsAPI.getEmotionsAnalytics();

        if (response.success && response.data) {
          const payload = response.data;
          setSummary(payload);
          // Transform emotions data
          const emotionItems = Array.isArray(payload.emotions)
            ? payload.emotions
            : [];
          const transformedEmotions: Cell[] = emotionItems.map(
            (emotion, index) => {
              const id =
                emotion.emotion.toLowerCase().replace(/\s+/g, "-") ||
                `emotion-${index}`;
              const label = capitalizeFirst(emotion.emotion);
              const value = `${emotion.count} mentions`;
              const tone = getEmotionTone(emotion.emotion);

              return {
                id,
                label,
                value,
                tone,
              };
            }
          );

          setEmotionsData(transformedEmotions);

          // Transform first message starters data
          const starterItems = Array.isArray(
            payload.firstMessageStarters?.items
          )
            ? payload.firstMessageStarters?.items ?? []
            : [];
          const transformedFirstMessages: FirstMessageItem[] = starterItems.map(
            (item, index) => {
              const id = `message-${index}`;
              // Create a title from the message (first few words or capitalize)
              const messageWords = item.message.split(" ");
              const title =
                messageWords.length > 1
                  ? capitalizeFirst(messageWords[0]) +
                    " " +
                    messageWords.slice(1).join(" ")
                  : capitalizeFirst(item.message);
              const subtitle = `"${item.message}"`;

              return {
                id,
                title,
                subtitle,
                count: item.count,
              };
            }
          );

          setFirstMessagesData(transformedFirstMessages);
        } else {
          setError(response.message || "Failed to fetch emotions analytics");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEmotionsAnalytics();
  }, []);

  const buildFilterLabel = (
    filters: EmotionsAnalyticsResponse["filtersApplied"]
  ) => {
    if (!filters) return "None";
    if (filters.userId) return "User filter";
    if (filters.chatId) return "Chat filter";
    if (filters.startDate || filters.endDate) return "Date range";
    return "None";
  };

  const summaryCards: UserStat[] = useMemo(() => {
    if (!summary) return [];
    const categorizedPercent =
      summary.totalMessages > 0
        ? Math.round((summary.totalCategorized / summary.totalMessages) * 100)
        : 0;

    const cards: UserStat[] = [
      {
        id: "total-messages",
        title: "Total Messages",
        value: summary.totalMessages,
        iconSrc: "/icons/Stats-card/chats.svg",
        iconBg: "#F4F6FF",
      },
      {
        id: "categorized",
        title: "Categorized",
        value: `${summary.totalCategorized} (${categorizedPercent}%)`,
        iconSrc: "/icons/Stats-card/upgrades.svg",
        iconBg: "#F1FCF5",
      },
      {
        id: "first-messages",
        title: "First Message Starters",
        value: summary.firstMessageStarters?.total ?? 0,
        iconSrc: "/icons/Stats-card/revenue.svg",
        iconBg: "#FFF7F0",
      },
      {
        id: "ai-included",
        title: "Include AI",
        value: summary.includeAI ? "Enabled" : "Disabled",
        iconSrc: "/icons/Stats-card/users.svg",
        iconBg: "#F0F9FF",
      },
      {
        id: "filters",
        title: "Filters Applied",
        value: buildFilterLabel(summary.filtersApplied),
        iconSrc: "/icons/Analytics/Icon (2).svg",
        iconBg: "#F7F3FF",
      },
    ];

    return cards;
  }, [summary]);

  const hasSummary = summaryCards.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">
          Analytics & Insights
        </h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
          Manage user accounts, subscriptions, and settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hasSummary ? (
          summaryCards.map((card) => (
            <UserStatMiniCard key={card.id} {...card} />
          ))
        ) : (
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
              No analytics data available
            </h3>
            <p className="text-gray-500">
              Analytics statistics will be loaded from API
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 items-stretch">
        {loading ? (
          <div className="rounded-2xl p-5 bg-white border border-gray-200 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-[#757575] rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading analytics...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl p-5 bg-white border border-red-200 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <p className="text-red-600 font-medium mb-2">
                Error loading analytics
              </p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          </div>
        ) : (
          <TopFirstMessages
            items={firstMessagesData.length > 0 ? firstMessagesData : undefined}
          />
        )}
        {loading ? (
          <div className="rounded-2xl p-5 bg-white border border-gray-200 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-[#757575] rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading emotions analytics...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl p-5 bg-white border border-red-200 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <p className="text-red-600 font-medium mb-2">
                Error loading emotions analytics
              </p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          </div>
        ) : (
          <EmotionalKeywordHeatmap
            cells={emotionsData.length > 0 ? emotionsData : undefined}
          />
        )}
      </div>

      <ConversionMetrics />
    </div>
  );
}
