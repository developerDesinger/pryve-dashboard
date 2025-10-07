import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[14px] text-muted-foreground">
            This is your new dashboard scaffold. Start adding widgets here.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent className="text-[28px] font-semibold">1,247</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Chats</CardTitle>
        </CardHeader>
        <CardContent className="text-[28px] font-semibold">342</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Badge variant="warning">Prototype</Badge>
        </CardHeader>
        <CardContent className="text-[14px] text-muted-foreground">
          Hook this up to real data when ready.
        </CardContent>
      </Card>
    </div>
  );
}


