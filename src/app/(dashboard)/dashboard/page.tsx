import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/dashboard/StatCard";
import UserActivityChart from "@/components/dashboard/UserActivityChart";
import UserEngagementDonut from "@/components/dashboard/UserEngagementDonut";
import EmotionalTopicsAnalysis from "@/components/dashboard/EmotionalTopicsAnalysis";
import RecentActivityList from "@/components/dashboard/RecentActivityList";
// import stats from "@/data/stats.json"; // Removed mock data

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Welcome, Joe!</h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
          Here's what is happening with Pryve today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats cards will be populated from API data */}
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" className="text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stats available</h3>
          <p className="text-gray-500">Dashboard statistics will be loaded from API</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <div className="min-w-0">
          <UserActivityChart />
        </div>
        <div className="min-w-0">
          <UserEngagementDonut />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 items-stretch">
        <div className="min-w-0">
          <EmotionalTopicsAnalysis />
        </div>
        <div className="min-w-0">
          <RecentActivityList />
        </div>
      </div>
    </div>
  );
}


