import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, MapPin, ShieldCheck, ThumbsUp, Package, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingCard } from "@/components/ListingCard";

export default function SellerProfile() {
  const { id } = useParams();
  const sellerId = parseInt(id || "0");

  const { data, isLoading } = useQuery<{ user: any; listings: any[] }>({
    queryKey: ["/api/sellers", sellerId],
    queryFn: () => fetch(`/api/sellers/${sellerId}`).then(r => r.json()),
    enabled: !!sellerId,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="aspect-square rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Seller not found.</p>
        <Link href="/browse" className="text-primary font-bold mt-4 inline-block">← Back to Browse</Link>
      </div>
    );
  }

  const { user, listings } = data;
  const totalVotes = (user.deliverySpeedVotes || 0) + (user.performanceVotes || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/browse" className="inline-flex items-center gap-2 text-sm font-bold text-[#8C6239] hover:underline mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </Link>

      {/* Seller Card */}
      <div className="bg-[#003F3A] text-white rounded-2xl p-8 mb-10 shadow-xl">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#D8C9A3]/20 flex items-center justify-center text-3xl font-display font-black text-[#D8C9A3] shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl font-display font-bold">{user.name}</h1>
              {user.isVerified && (
                <Badge className="bg-[#D8C9A3]/20 text-[#D8C9A3] border-[#D8C9A3]/30 text-xs">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-white/70 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span>{user.state}</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-black mb-1">Role</p>
                <p className="font-bold text-[#D8C9A3]">{user.role}</p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-black mb-1">Delivery Votes</p>
                <p className="font-bold flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-[#D8C9A3]" /> {user.deliverySpeedVotes || 0}
                </p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-black mb-1">Performance Votes</p>
                <p className="font-bold flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#D8C9A3]" /> {user.performanceVotes || 0}
                </p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-black mb-1">Total Ratings</p>
                <p className="font-bold">{totalVotes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div>
        <h2 className="text-xl font-display font-bold text-[#2A2A2A] flex items-center gap-2 mb-6 pb-4 border-b border-black/10">
          <Package className="w-5 h-5 text-[#8C6239]" />
          Active Listings ({listings.length})
        </h2>

        {listings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-black/5">
            <p className="text-muted-foreground">No active listings from this seller.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((item: any) => (
              <ListingCard key={item.listing.id} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
