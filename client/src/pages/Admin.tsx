import { useAuth } from "@/hooks/use-auth";
import { useAdminUsers, useAdminStats, useVerifyFarmer } from "@/hooks/use-admin";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ShieldAlert, Users, MapPin, Activity } from "lucide-react";

export default function Admin() {
  const { data: user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const verifyFarmer = useVerifyFarmer();

  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const handleVerify = (id: number) => {
    verifyFarmer.mutate(id);
  };

  const farmers = users?.filter(u => u.role?.toLowerCase() === "farmer") || [];
  const buyers = users?.filter(u => u.role?.toLowerCase() === "buyer") || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-primary" /> Admin Control Panel
        </h1>
        <p className="text-muted-foreground mt-2">Manage users and view platform statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" /> Total Farmers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-display font-bold">{farmers.length}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" /> Total Buyers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-display font-bold">{buyers.length}</span>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Verified Farmers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-display font-bold">{farmers.filter(f => f.isVerified).length}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-sm h-full">
            <CardHeader className="border-b">
              <CardTitle>Farmer Management</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {usersLoading ? (
                <div className="p-6">Loading users...</div>
              ) : farmers.length > 0 ? (
                <div className="divide-y divide-border">
                  {farmers.map(farmer => (
                    <div key={farmer.id} className="p-4 sm:p-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          {farmer.name}
                          {farmer.isVerified && <CheckCircle className="w-4 h-4 text-primary" />}
                        </h4>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {farmer.state}</span>
                          <span>📞 {farmer.phone}</span>
                        </div>
                      </div>
                      <div>
                        {farmer.isVerified ? (
                          <Badge variant="outline" className="text-primary border-primary bg-primary/5">Verified</Badge>
                        ) : (
                          <Button size="sm" onClick={() => handleVerify(farmer.id)} disabled={verifyFarmer.isPending}>
                            Verify Farmer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">No farmers registered yet.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle>Stats: Crops by State</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {statsLoading ? (
                <div>Loading stats...</div>
              ) : stats && stats.totalCropsPerState && Object.keys(stats.totalCropsPerState).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(stats.totalCropsPerState).map(([state, count]) => (
                    <div key={state} className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{state}</span>
                      <Badge variant="secondary">{count as number} listings</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Not enough data available.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
