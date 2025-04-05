import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertListing, type UpdateListingRequest } from "@shared/schema";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useListings(filters?: {
  search?: string;
  category?: string;
  state?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  return useQuery({
    queryKey: [api.listings.list.path, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.category && filters.category !== "All") params.append("category", filters.category);
      if (filters?.state && filters.state !== "All") params.append("state", filters.state);
      if (filters?.minPrice) params.append("minPrice", filters.minPrice);
      if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice);

      const url = `${api.listings.list.path}${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch listings");
      const data = await res.json();
      return parseWithLogging(api.listings.list.responses[200], data, "listings.list");
    },
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: [api.listings.getMine.path],
    queryFn: async () => {
      const res = await fetch(api.listings.getMine.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch my listings");
      const data = await res.json();
      return parseWithLogging(api.listings.getMine.responses[200], data, "listings.getMine");
    },
  });
}

export function useListing(id: number) {
  return useQuery({
    queryKey: [api.listings.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.listings.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch listing");
      const data = await res.json();
      return parseWithLogging(api.listings.get.responses[200], data, "listings.get");
    },
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertListing) => {
      const validated = api.listings.create.input.parse(data);
      const res = await fetch(api.listings.create.path, {
        method: api.listings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.listings.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create listing");
      }
      return api.listings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.listings.getMine.path] });
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: UpdateListingRequest }) => {
      const validated = api.listings.update.input.parse(updates);
      const url = buildUrl(api.listings.update.path, { id });
      const res = await fetch(url, {
        method: api.listings.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update listing");
      return api.listings.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.listings.getMine.path] });
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.listings.get.path, variables.id] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.listings.delete.path, { id });
      const res = await fetch(url, {
        method: api.listings.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete listing");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.listings.getMine.path] });
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
    },
  });
}

export function useRecordView() {
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.listings.recordView.path, { id });
      const res = await fetch(url, { method: api.listings.recordView.method });
      if (!res.ok) return null;
      return api.listings.recordView.responses[200].parse(await res.json());
    },
  });
}

export function useUpvoteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, type }: { userId: number; type: 'deliverySpeed' | 'performance' }) => {
      const url = buildUrl(api.votes.upvote.path, { id: userId });
      const res = await fetch(url, {
        method: api.votes.upvote.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to upvote");
      return api.votes.upvote.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.listings.get.path] });
    },
  });
}
