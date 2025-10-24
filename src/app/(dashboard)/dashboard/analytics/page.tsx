import UserStatMiniCard, { type UserStat } from "@/components/dashboard/UserStatMiniCard";
// import analyticsStats from "@/data/analytics-stats.json"; // Removed mock data
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
        {/* Analytics stats will be populated from API data */}
        <div className="text-center py-8 col-span-full">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" className="text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
          <p className="text-gray-500">Analytics statistics will be loaded from API</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 items-stretch">
        <TopFirstMessages />
        <EmotionalKeywordHeatmap />
      </div>

      <ConversionMetrics />
    </div>
  );
}


