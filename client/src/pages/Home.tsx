import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTrendingCrops, usePriceInsights } from "@/hooks/use-analytics";
import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { ArrowRight, ShieldCheck, TrendingUp, ShoppingBag, Globe, Zap } from "lucide-react";

export default function Home() {
  const { data: trendingCrops } = useTrendingCrops();
  const { data: listings, isLoading } = useListings();
  const { data: globalPrices } = usePriceInsights();

  const featuredListings = listings?.filter(l => l.listing.boosted).slice(0, 4) || [];
  const recentListings = listings?.filter(l => !l.listing.boosted).slice(0, 8) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5EF]">
      {/* Mature Business Header/Hero */}
      <section className="bg-[#003F3A] text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Globe className="w-full h-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D8C9A3] text-xs font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" /> Real-time Agriculture Exchange
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight mb-6 leading-tight">
              The Professional Gateway to <span className="text-[#D8C9A3]">Global Agri-Trade.</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
              AgriBridge provides a secure, transparent marketplace for professional buyers and verified farmers. 
              Access real-time market data and direct sourcing from the source.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-[#D8C9A3] text-[#003F3A] hover:bg-[#D8C9A3]/90 h-14 px-8 rounded-md font-bold transition-all shadow-lg">
                <Link href="/browse">Access Marketplace</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/20 hover:bg-white/10 text-white h-14 px-8 rounded-md font-bold transition-all backdrop-blur-sm">
                <Link href="/auth">Register as Seller</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Ticker / Market Bar */}
      <div className="bg-[#D8C9A3] border-y border-[#003F3A]/10 py-3 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee gap-12 items-center">
          {trendingCrops?.map((crop) => (
            <div key={crop.cropName} className="flex items-center gap-3">
              <span className="text-[#003F3A] font-bold uppercase text-sm">{crop.cropName}</span>
              <span className="text-[#8C6239] font-mono font-bold">
                ${(Math.random() * 50 + 10).toFixed(2)}
              </span>
              <span className="text-green-700 text-xs flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +{(Math.random() * 2).toFixed(2)}%
              </span>
            </div>
          ))}
          {/* Duplicate for seamless loop if needed, simplified here */}
        </div>
      </div>

      {/* Main Marketplace Grid - Facebook Marketplace Style */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Content Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-4">
              <h2 className="text-2xl font-display font-bold text-[#2A2A2A] flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-[#8C6239]" /> Live Listings
              </h2>
              <Link href="/browse" className="text-sm font-bold text-[#8C6239] hover:underline">View All Inventory</Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="aspect-square bg-black/5 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.slice(0, 12).map(item => (
                  <ListingCard key={item.listing.id} data={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border rounded-xl shadow-sm">
                <p className="text-[#2A2A2A]/60">No active listings in your region.</p>
              </div>
            )}
          </div>

          {/* Business Sidebar */}
          <aside className="w-full lg:w-80 space-y-8">
            <div className="bg-white border border-black/5 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#2A2A2A] mb-4 flex items-center gap-2 uppercase tracking-tight text-sm">
                <TrendingUp className="w-4 h-4 text-[#8C6239]" /> Market Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#F7F5EF] rounded-lg border border-black/5">
                  <p className="text-xs text-black/50 uppercase font-bold mb-1">Market Average</p>
                  <p className="text-2xl font-display font-bold text-[#003F3A]">
                    ${globalPrices?.averagePrice.toLocaleString() || "0.00"}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-black/40 uppercase">Demand Ranking</p>
                  {trendingCrops?.map((crop, idx) => (
                    <div key={crop.cropName} className="flex items-center justify-between text-sm">
                      <span className="text-[#2A2A2A]/80 font-medium">{crop.cropName}</span>
                      <span className="text-[#8C6239] font-bold">#{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#003F3A] text-white rounded-xl p-6 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-[#D8C9A3] mb-4" />
              <h3 className="font-bold text-lg mb-2">Trade with Confidence</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Every transaction on AgriBridge is backed by our verified farmer network and secure logistics partnerships.
              </p>
              <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white font-bold">
                Verification Details
              </Button>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer / Trust Section */}
      <section className="bg-white border-t border-black/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-black/30 uppercase tracking-[0.2em] mb-8">Trusted by Trade Partners Worldwide</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
             {/* Simple placeholders for mature brands */}
             <div className="font-display font-black text-xl italic">AGRI-CORP</div>
             <div className="font-display font-black text-xl italic">GLOBAL-FOODS</div>
             <div className="font-display font-black text-xl italic">TRADE-LINK</div>
             <div className="font-display font-black text-xl italic">ECO-FARM</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>{children}</span>;
}
