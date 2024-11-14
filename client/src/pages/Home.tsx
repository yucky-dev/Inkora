import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTrendingCrops } from "@/hooks/use-analytics";
import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { ArrowRight, Leaf, ShieldCheck, TrendingUp, HandCoins } from "lucide-react";
import { PriceInsightWidget } from "@/components/PriceInsightWidget";

export default function Home() {
  const { data: trendingCrops } = useTrendingCrops();
  const { data: listings, isLoading } = useListings();

  const featuredListings = listings?.filter(l => l.listing.boosted).slice(0, 3) || [];
  const recentListings = listings?.filter(l => !l.listing.boosted).slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* landing page hero agricultural landscape farmer field */}
          <img 
            src="https://pixabay.com/get/g4a3136ea0725985c8c4ad8ce97f12ad83f14fd81d4dc074097c635815086743674f708ee0b416572355fc5ca749437c2069c2196f1aa6374a22af1cc618fa8a6_1280.jpg" 
            alt="Farm landscape" 
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 text-sm">
              Direct Farmer-to-Buyer Marketplace
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-foreground mb-8">
              Harvesting Value, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Empowering Farmers
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 text-balance max-w-2xl mx-auto">
              AgriBridge connects smallholder farmers directly with buyers. Cut out the middlemen, get fair prices, and source fresh quality crops from verified local farms.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-primary/20 rounded-full">
                <Link href="/browse">Browse Marketplace</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg w-full sm:w-auto rounded-full bg-background/50 backdrop-blur-sm border-2">
                <Link href="/auth">Start Selling</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Features Banner */}
      <section className="py-12 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <HandCoins className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Zero Middlemen</h3>
                <p className="text-sm text-muted-foreground">Direct pricing benefits everyone</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Verified Farmers</h3>
                <p className="text-sm text-muted-foreground">Trust and transparency built-in</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-accent-foreground">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Market Insights</h3>
                <p className="text-sm text-muted-foreground">Real-time price tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row: Market Insights & Trending */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-display font-bold">Featured Harvests</h2>
                <Button variant="ghost" asChild className="text-primary hover:text-primary/80">
                  <Link href="/browse" className="flex items-center gap-2">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-80 bg-muted rounded-2xl animate-pulse"></div>
                  <div className="h-80 bg-muted rounded-2xl animate-pulse"></div>
                </div>
              ) : featuredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredListings.slice(0, 2).map(item => (
                    <ListingCard key={item.listing.id} data={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed">
                  <Leaf className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No featured listings currently available.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-display font-bold">Market Watch</h2>
              <PriceInsightWidget />
              
              <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Trending Crops
                </h3>
                {trendingCrops ? (
                  <div className="space-y-3">
                    {trendingCrops.map((crop, idx) => (
                      <div key={crop.cropName} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-medium text-sm w-4">{idx + 1}</span>
                          <span className="font-medium group-hover:text-primary transition-colors">{crop.cropName}</span>
                        </div>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                          {crop.count} listings
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[1,2,3,4].map(i => <div key={i} className="h-6 bg-muted rounded animate-pulse" />)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Listings */}
          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold mb-8">Recently Added</h2>
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[1,2,3].map(i => <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse"></div>)}
               </div>
            ) : recentListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentListings.map(item => (
                  <ListingCard key={item.listing.id} data={item} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No recent listings.</p>
            )}
          </div>
          
        </div>
      </section>
    </div>
  );
}

// Temporary Badge component to ensure it exists for the hero
function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>{children}</span>;
}
