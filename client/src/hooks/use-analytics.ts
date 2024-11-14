import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useTrendingCrops() {
  return useQuery({
    queryKey: [api.analytics.trendingCrops.path],
    queryFn: async () => {
      const res = await fetch(api.analytics.trendingCrops.path);
      if (!res.ok) throw new Error("Failed to fetch trending crops");
      const data = await res.json();
      return parseWithLogging(api.analytics.trendingCrops.responses[200], data, "analytics.trendingCrops");
    },
  });
}

export function usePriceInsights(cropName?: string) {
  return useQuery({
    queryKey: [api.analytics.priceInsights.path, cropName],
    queryFn: async () => {
      const url = cropName 
        ? `${api.analytics.priceInsights.path}?cropName=${encodeURIComponent(cropName)}`
        : api.analytics.priceInsights.path;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch price insights");
      const data = await res.json();
      return parseWithLogging(api.analytics.priceInsights.responses[200], data, "analytics.priceInsights");
    },
  });
}
