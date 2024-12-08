import { usePriceInsights } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PriceInsightWidget({ cropName }: { cropName?: string }) {
  const { data, isLoading } = usePriceInsights(cropName);

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Market Insights <Skeleton className="h-4 w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="bg-gradient-to-br from-card to-accent/10 border-accent/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          Market Insights {cropName && <span className="text-foreground normal-case">— {cropName}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold font-display text-foreground">
            ${data.averagePrice.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-muted-foreground">avg</span>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingDown className="w-4 h-4 text-secondary" />
            Min: <span className="font-semibold text-foreground">${data.minPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-primary" />
            Max: <span className="font-semibold text-foreground">${data.maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
