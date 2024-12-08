import { useParams } from "wouter";
import { useListing, useRecordView } from "@/hooks/use-listings";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, MessageCircle, Clock, CheckCircle, Package, Scale, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ListingDetail() {
  const { id } = useParams();
  const listingId = parseInt(id || "0");
  const { data, isLoading } = useListing(listingId);
  const recordView = useRecordView();

  useEffect(() => {
    if (listingId) {
      recordView.mutate(listingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-8">
        <Skeleton className="h-8 w-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-[400px] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Listing not found</h1>
        <p className="text-muted-foreground mt-4 mb-8">This listing may have been removed or is no longer available.</p>
        <Button asChild><Link href="/browse">Back to Browse</Link></Button>
      </div>
    );
  }

  const { listing, farmer, farm } = data;
  const whatsappUrl = `https://wa.me/${farmer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${farmer.name},%20I%20am%20interested%20in%20your%20${listing.cropName}%20listing%20on%20AgriBridge.`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/browse" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Col: Image & Farm Details */}
        <div className="space-y-8">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted border relative shadow-lg">
            {listing.imageUrl ? (
              <img src={listing.imageUrl} alt={listing.cropName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-accent/20">
                <Package className="w-24 h-24 text-primary/20 mb-4" />
                <span className="text-muted-foreground font-medium">No image provided</span>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-background/90 text-foreground backdrop-blur-md border-none shadow-sm text-sm px-3 py-1">
                {listing.category}
              </Badge>
              {listing.status !== "Available" && (
                <Badge variant="destructive" className="shadow-sm text-sm px-3 py-1">Sold Out</Badge>
              )}
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-xl mb-4">About the Farm</h3>
            {farm ? (
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1"><Scale className="w-4 h-4" /> Farm Size</p>
                  <p className="font-semibold text-foreground">{farm.farmSize}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> Location</p>
                  <p className="font-semibold text-foreground">{farm.lga}, {farmer.state}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1 flex items-center gap-1"><Sprout className="w-4 h-4" /> Main Crops</p>
                  <p className="font-semibold text-foreground">{farm.mainCrops}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic">Detailed farm profile not provided.</p>
            )}
          </div>
        </div>

        {/* Right Col: Details & Action */}
        <div className="flex flex-col">
          <div className="mb-2 text-sm text-primary font-bold tracking-wider uppercase">
            {listing.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-4">
            {listing.cropName}
          </h1>
          
          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-bold text-primary">${Number(listing.price).toLocaleString()}</span>
            <span className="text-lg text-muted-foreground font-medium pb-1">per {listing.unit}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10 border-y border-border py-6">
            <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-background rounded-lg p-2 shadow-sm border"><Package className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Available Quantity</p>
                <p className="font-bold text-lg">{Number(listing.quantity).toLocaleString()} {listing.unit}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-background rounded-lg p-2 shadow-sm border"><Clock className="w-5 h-5 text-secondary" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Harvest Date</p>
                <p className="font-bold text-lg">
                  {listing.harvestDate ? new Date(listing.harvestDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Farmer Card */}
          <div className="bg-card border rounded-2xl p-6 shadow-lg shadow-black/5 mb-8 flex-1">
            <h3 className="font-display font-bold text-lg mb-6 text-foreground">Seller Information</h3>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary/20">
                {farmer.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-xl flex items-center gap-2">
                  {farmer.name}
                  {farmer.isVerified && <CheckCircle className="w-5 h-5 text-primary" />}
                </h4>
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" /> {farmer.state} State
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full h-14 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-[#25D366]/20 group">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Chat on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full h-14 text-lg border-2 hover:bg-muted">
                <a href={`tel:${farmer.phone}`}>
                  <Phone className="w-5 h-5 mr-2" /> Call Farmer
                </a>
              </Button>
            </div>
            
            {!farmer.isVerified && (
              <div className="mt-6 p-4 bg-secondary/10 text-secondary-foreground rounded-xl text-sm flex gap-3 items-start">
                <div className="shrink-0 mt-0.5"><ShieldCheck className="w-5 h-5 opacity-70" /></div>
                <p>This farmer has not yet been verified by AgriBridge. Always conduct due diligence before making payments.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
