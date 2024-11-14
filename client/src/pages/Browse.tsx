import { useState } from "react";
import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, FilterX, Leaf } from "lucide-react";

export default function Browse() {
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    state: "All",
    minPrice: "",
    maxPrice: "",
  });

  const [activeFilters, setActiveFilters] = useState(filters);
  const { data: listings, isLoading } = useListings(activeFilters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    const cleared = { search: "", category: "All", state: "All", minPrice: "", maxPrice: "" };
    setFilters(cleared);
    setActiveFilters(cleared);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full md:w-72 shrink-0">
        <div className="bg-card border rounded-2xl p-6 sticky top-24 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold">Filters</h2>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground h-8 px-2">
              <FilterX className="w-4 h-4 mr-1" /> Clear
            </Button>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Crop name..." 
                  className="pl-9"
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={filters.category} onValueChange={v => setFilters({...filters, category: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Food crop">Food Crop</SelectItem>
                  <SelectItem value="Cash crop">Cash Crop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location (State)</label>
              <Input 
                placeholder="e.g. Kano" 
                value={filters.state === "All" ? "" : filters.state}
                onChange={e => setFilters({...filters, state: e.target.value || "All"})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range (₦)</label>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  value={filters.minPrice}
                  onChange={e => setFilters({...filters, minPrice: e.target.value})}
                />
                <span className="text-muted-foreground">-</span>
                <Input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.maxPrice}
                  onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">Apply Filters</Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Marketplace</h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? "Loading..." : `${listings?.length || 0} listings found`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[360px] bg-muted rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(item => (
              <ListingCard key={item.listing.id} data={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-dashed rounded-2xl mt-4">
            <Leaf className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">No crops found</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              We couldn't find any listings matching your current filters. Try adjusting your search criteria.
            </p>
            <Button variant="outline" className="mt-6" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
