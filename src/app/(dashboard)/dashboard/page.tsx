import UserActivityChart from "@/components/dashboard/UserActivityChart";
import UserEngagementDonut from "@/components/dashboard/UserEngagementDonut";
import EmotionalTopicsAnalysis from "@/components/dashboard/EmotionalTopicsAnalysis";
import RecentActivityList from "@/components/dashboard/RecentActivityList";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
// import stats from "@/data/stats.json"; // Removed mock data

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">
          Welcome, Joe!
        </h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
          Here's what is happening with Pryve today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatsGrid />
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
