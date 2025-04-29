import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTrendingCrops, usePriceInsights } from "@/hooks/use-analytics";
import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { ShoppingBag, Globe, Zap, ShieldCheck } from "lucide-react";

import heroImage from "@assets/file_00000000f0cc724682dcecf9a5ed3e54_1772886433508.png";

export default function Home() {
  const { data: trendingCrops } = useTrendingCrops();
  const { data: listings, isLoading } = useListings();
  const { data: globalPrices } = usePriceInsights();

  const featuredListings = listings?.filter(l => l.listing.boosted).slice(0, 4) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5EF]">
      {/* Mature Business Header/Hero with Amazing Agricultural Band Background */}
      <section className="relative pt-32 pb-24 overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Diligence and Integrity in Agriculture" 
            className="w-full h-full object-cover brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003F3A]/80 via-[#003F3A]/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D8C9A3]/10 text-[#D8C9A3] text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md border border-[#D8C9A3]/20">
              <ShieldCheck className="w-4 h-4" /> Diligence • Integrity • Trust
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 leading-[1.1] drop-shadow-sm">
              The Professional <br/>
              Standard in <span className="text-[#D8C9A3]">Agri-Trade.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl leading-relaxed font-medium drop-shadow-sm">
              Inkora establishes a foundation of integrity, connecting institutional buyers with verified farmers through a transparent, high-standard exchange platform.
            </p>
            <div className="flex flex-wrap gap-5">
              <Button size="lg" asChild className="bg-[#D8C9A3] text-[#003F3A] hover:bg-[#D8C9A3]/90 h-16 px-10 rounded-md font-bold transition-all shadow-2xl text-lg">
                <Link href="/browse">Enter Marketplace</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/40 hover:bg-white/10 text-white h-16 px-10 rounded-md font-bold transition-all backdrop-blur-md text-lg">
                <Link href="/auth">Farmer Registration</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Marketplace Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Content Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-10 border-b border-black/10 pb-6">
              <h2 className="text-3xl font-display font-bold text-[#2A2A2A] flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-[#8C6239]" /> Verified Listings
              </h2>
              <Link href="/browse" className="text-sm font-bold text-[#8C6239] hover:underline uppercase tracking-widest">Market Directory</Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="aspect-square bg-black/5 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {listings.slice(0, 12).map(item => (
                  <ListingCard key={item.listing.id} data={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-black/5 rounded-xl shadow-sm">
                <p className="text-[#2A2A2A]/60">No active verified listings at this time.</p>
              </div>
            )}
          </div>

          {/* Business Sidebar */}
          <aside className="w-full lg:w-80 space-y-10">
            <div className="bg-white border border-black/5 rounded-xl p-8 shadow-sm">
              <h3 className="font-bold text-[#2A2A2A] mb-6 flex items-center gap-2 uppercase tracking-[0.1em] text-xs">
                <Zap className="w-4 h-4 text-[#8C6239]" /> Market Data
              </h3>
              <div className="space-y-6">
                <div className="p-5 bg-[#F7F5EF] rounded-lg border border-black/5">
                  <p className="text-[10px] text-black/50 uppercase font-black mb-2 tracking-widest">Global Index</p>
                  <p className="text-3xl font-display font-bold text-[#003F3A]">
                    ${globalPrices?.averagePrice.toLocaleString() || "0.00"}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Priority Crops</p>
                  {trendingCrops?.map((crop, idx) => (
                    <div key={crop.cropName} className="flex items-center justify-between text-sm border-b border-black/5 pb-2">
                      <span className="text-[#2A2A2A]/80 font-bold">{crop.cropName}</span>
                      <span className="text-[#8C6239] font-black italic">TOP {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#003F3A] text-white rounded-xl p-8 shadow-2xl relative overflow-hidden">
               <Globe className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10" />
              <ShieldCheck className="w-10 h-10 text-[#D8C9A3] mb-6" />
              <h3 className="font-bold text-xl mb-3">Institutional Integrity</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-8">
                Our platform enforces strict compliance and quality standards to ensure every trade is executed with complete transparency.
              </p>
              <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white font-bold h-12">
                Compliance Standards
              </Button>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer / Trust Section */}
      <section className="bg-white border-t border-black/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em] mb-12">Verified Global Trade Partners</p>
          <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale contrast-125">
             <div className="font-display font-black text-2xl tracking-tighter">AGRI-STRAT</div>
             <div className="font-display font-black text-2xl tracking-tighter">CORP-GRAIN</div>
             <div className="font-display font-black text-2xl tracking-tighter">TERRA-EX</div>
             <div className="font-display font-black text-2xl tracking-tighter">PRIME-HARVEST</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>{children}</span>;
}
