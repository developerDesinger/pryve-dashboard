import UserStatMiniCard, { type UserStat } from "@/components/dashboard/UserStatMiniCard";
import analyticsStats from "@/data/analytics-stats.json";
import TopFirstMessages from "@/components/dashboard/TopFirstMessages";
import EmotionalKeywordHeatmap from "@/components/dashboard/EmotionalKeywordHeatmap";
import ConversionMetrics from "@/components/dashboard/ConversionMetrics";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Analytics & Insights</h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
        Manage user accounts, subscriptions, and settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(analyticsStats as unknown as UserStat[]).map((s) => (
          <UserStatMiniCard key={s.id} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 items-stretch">
        <TopFirstMessages />
        <EmotionalKeywordHeatmap />
      </div>

      <ConversionMetrics />
    </div>
  );
}


