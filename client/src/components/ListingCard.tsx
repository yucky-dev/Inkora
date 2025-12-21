import { Link } from "wouter";
import { type z } from "zod";
import { type listingWithFarmerSchema } from "@shared/routes";
import { MapPin } from "lucide-react";

type ListingWithFarmer = z.infer<typeof listingWithFarmerSchema>;

export function ListingCard({ data, linkTo }: { data: ListingWithFarmer; linkTo?: string }) {
  const { listing, farmer, farm } = data;
  const isAvailable = listing.status === "Available";
  const href = linkTo ?? `/seller/${farmer.id}`;

  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden border border-black/8 hover:border-black/15 hover:shadow-lg transition-all duration-200 h-full flex flex-col">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#F0EDE6]">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.cropName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#E8E4DC]">
              <span className="text-4xl">🌾</span>
            </div>
          )}

          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest">Sold</span>
            </div>
          )}

          {listing.boosted && (
            <div className="absolute top-2 left-2">
              <span className="bg-[#8C6239] text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Info — Facebook Marketplace style */}
        <div className="p-3 flex flex-col gap-0.5">
          {/* Price — most prominent */}
          <p className="text-[#1c1c1c] font-black text-[1.1rem] leading-tight">
            ${Number(listing.price).toLocaleString()}
            <span className="text-xs font-semibold text-[#606060] ml-1">/ {listing.unit}</span>
          </p>

          {/* Title */}
          <h3 className="text-[#1c1c1c] text-sm font-semibold leading-snug line-clamp-2 mt-0.5">
            {listing.cropName}
            <span className="text-[#606060] font-normal"> · {listing.category}</span>
          </h3>

          {/* Location — clearly highlighted */}
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-[#606060] shrink-0" />
            <span className="text-xs text-[#606060] font-medium truncate">
              {farm?.lga ? `${farm.lga}, ` : ""}{farmer.state}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
