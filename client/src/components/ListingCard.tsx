import { Link } from "wouter";
import { type z } from "zod";
import { type listingWithFarmerSchema } from "@shared/routes";
import { MapPin, Sprout, CheckCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ListingWithFarmer = z.infer<typeof listingWithFarmerSchema>;

export function ListingCard({ data, linkTo }: { data: ListingWithFarmer; linkTo?: string }) {
  const { listing, farmer, farm } = data;
  const isAvailable = listing.status === "Available";
  const href = linkTo ?? `/seller/${farmer.id}`;

  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-lg overflow-hidden border border-black/5 hover:border-black/10 transition-all duration-200 h-full flex flex-col shadow-sm hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-[#F7F5EF]">
          {listing.imageUrl ? (
            <img 
              src={listing.imageUrl} 
              alt={listing.cropName} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Sprout className="w-12 h-12 text-[#003F3A]/10" />
            </div>
          )}
          
          {listing.boosted && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-[#8C6239] text-white border-none text-[10px] uppercase tracking-tighter py-0 px-2 h-5">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-1">
            <p className="font-bold text-[#2A2A2A] text-lg">${Number(listing.price).toLocaleString()}</p>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 rounded border border-green-100">
              <Zap className="w-3 h-3 text-green-700" />
              <span className="text-[10px] font-black text-green-700 uppercase tracking-tighter">Live</span>
            </div>
          </div>
          <h3 className="text-sm text-[#2A2A2A]/80 font-medium line-clamp-1 mb-2">
            {listing.cropName}
          </h3>

          <div className="mt-auto flex items-center gap-1.5 text-[11px] text-[#2A2A2A]/50 font-bold uppercase tracking-tight">
            <MapPin className="w-3 h-3" />
            <span>{farmer.state}</span>
            <span>•</span>
            <span>{listing.unit}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
