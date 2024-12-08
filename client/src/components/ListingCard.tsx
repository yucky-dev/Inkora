import { Link } from "wouter";
import { type z } from "zod";
import { type listingWithFarmerSchema } from "@shared/routes";
import { MapPin, Sprout, Star, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ListingWithFarmer = z.infer<typeof listingWithFarmerSchema>;

export function ListingCard({ data }: { data: ListingWithFarmer }) {
  const { listing, farmer, farm } = data;
  const isAvailable = listing.status === "Available";

  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className={`
        bg-card rounded-2xl overflow-hidden border transition-all duration-300
        hover:shadow-xl hover:-translate-y-1 h-full flex flex-col
        ${listing.boosted ? 'border-secondary/50 shadow-md shadow-secondary/10' : 'border-border hover:border-primary/30 hover:shadow-primary/5'}
      `}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {listing.imageUrl ? (
            <img 
              src={listing.imageUrl} 
              alt={listing.cropName} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent/20">
              <Sprout className="w-16 h-16 text-primary/30" />
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground hover:bg-white border-none shadow-sm">
              {listing.category}
            </Badge>
            {!isAvailable && (
              <Badge variant="destructive" className="shadow-sm">Sold Out</Badge>
            )}
          </div>

          {listing.boosted && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm border-none gap-1 py-1">
                <Star className="w-3.5 h-3.5 fill-current" /> Promoted
              </Badge>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {listing.cropName}
            </h3>
            <div className="text-right">
              <p className="font-bold text-lg text-primary">${Number(listing.price).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground font-medium">per {listing.unit}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="font-medium bg-muted px-2 py-0.5 rounded-md text-foreground">
              {Number(listing.quantity).toLocaleString()} {listing.unit}
            </span>
            {listing.harvestDate && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(listing.harvestDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {farmer.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold flex items-center gap-1 text-foreground">
                  {farmer.name}
                  {farmer.isVerified && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {farm?.lga || farmer.state}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
