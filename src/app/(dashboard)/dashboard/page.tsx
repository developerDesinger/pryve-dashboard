import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/dashboard/StatCard";
import stats from "@/data/stats.json";

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
        {stats.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            changeText={item.changeText}
            changeClassName={item.changeClassName}
            icon={<img src={item.iconSrc} alt={item.id} className="w-5 h-5" />}
            iconContainerClassName={item.iconContainerClassName}
          />
        ))}
      </div>
    </div>
  );
}


