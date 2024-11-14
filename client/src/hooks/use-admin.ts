import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: [api.admin.users.path],
    queryFn: async () => {
      const res = await fetch(api.admin.users.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      return parseWithLogging(api.admin.users.responses[200], data, "admin.users");
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: [api.admin.stats.path],
    queryFn: async () => {
      const res = await fetch(api.admin.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      return parseWithLogging(api.admin.stats.responses[200], data, "admin.stats");
    },
  });
}

export function useVerifyFarmer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.verifyFarmer.path, { id });
      const res = await fetch(url, {
        method: api.admin.verifyFarmer.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to verify farmer");
      return api.admin.verifyFarmer.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.users.path] });
    },
  });
}
