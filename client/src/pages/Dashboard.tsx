import { useAuth } from "@/hooks/use-auth";
import { useMyFarm } from "@/hooks/use-farms";
import { useMyListings, useUpdateListing, useDeleteListing } from "@/hooks/use-listings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Plus, Edit, Trash2, Sprout, TrendingUp, Search, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

export default function Dashboard() {
  const { data: user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: farm, isLoading: isFarmLoading } = useMyFarm();
  const { data: listings, isLoading: isListingsLoading } = useMyListings();
  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();

  if (!user || user.role !== "farmer") {
    setLocation("/");
    return null;
  }

  const handleToggleStatus = (id: number, current: string) => {
    updateListing.mutate({ id, updates: { status: current === "Available" ? "Sold" : "Available" } });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteListing.mutate(id);
    }
  };

  const handleBoost = (id: number, currentlyBoosted: boolean) => {
    updateListing.mutate({ id, updates: { boosted: !currentlyBoosted } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Farmer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your farm profile and crop listings.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="bg-background shadow-sm">
            <Link href="/farm-profile">
              <Edit className="w-4 h-4 mr-2" /> {farm ? "Edit Profile" : "Create Profile"}
            </Link>
          </Button>
          {farm && (
            <Button asChild className="shadow-lg shadow-primary/20">
              <Link href="/create-listing">
                <Plus className="w-4 h-4 mr-2" /> New Listing
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Farm Profile Summary & Stats */}
        <div className="space-y-8">
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" /> My Farm
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isFarmLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ) : farm ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Farm Size</p>
                    <p className="font-semibold text-foreground">{farm.farmSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Main Crops</p>
                    <p className="font-semibold text-foreground">{farm.mainCrops}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                    <p className="font-semibold text-foreground">{farm.lga}, {user.state}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/30 rounded-xl">
                  <p className="text-muted-foreground mb-4 text-sm">You haven't set up your farm profile yet. Buyers won't see your full details.</p>
                  <Button asChild size="sm" variant="secondary"><Link href="/farm-profile">Create Profile Now</Link></Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border bg-primary text-primary-foreground border-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 font-medium mb-1">Total Listings</p>
                  <p className="text-4xl font-display font-bold">{listings?.length || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Listings */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle>My Listings</CardTitle>
                <CardDescription>Manage your active and past harvests</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6 p-0">
              {isListingsLoading ? (
                <div className="p-6 space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse"></div>)}
                </div>
              ) : listings && listings.length > 0 ? (
                <div className="divide-y divide-border">
                  {listings.map(item => (
                    <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 border">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.cropName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Sprout className="w-6 h-6 text-muted-foreground/40" /></div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg text-foreground">{item.cropName}</h4>
                            {item.status === "Available" ? (
                              <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20">Available</Badge>
                            ) : (
                              <Badge variant="destructive">Sold</Badge>
                            )}
                            {item.boosted && <Badge variant="secondary" className="border-none shadow-sm">Boosted</Badge>}
                          </div>
                          <p className="text-sm font-semibold text-primary">₦{Number(item.price).toLocaleString()} <span className="text-muted-foreground font-normal">/ {item.unit}</span></p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {item.views || 0} views
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleToggleStatus(item.id, item.status)}
                        >
                          Mark {item.status === "Available" ? "Sold" : "Available"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={item.boosted ? "border-secondary text-secondary hover:text-secondary hover:bg-secondary/10" : ""}
                          onClick={() => handleBoost(item.id, item.boosted || false)}
                        >
                          {item.boosted ? "Unboost" : "Boost"}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">No listings found</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">You haven't added any crops to the marketplace yet. Start selling to connect with buyers.</p>
                  {farm ? (
                    <Button asChild><Link href="/create-listing"><Plus className="w-4 h-4 mr-2"/> Add First Listing</Link></Button>
                  ) : (
                    <p className="text-sm text-secondary font-medium">Please complete your farm profile first to add listings.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
