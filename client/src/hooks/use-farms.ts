import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertFarm } from "@shared/schema";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useMyFarm() {
  return useQuery({
    queryKey: [api.farms.getMine.path],
    queryFn: async () => {
      const res = await fetch(api.farms.getMine.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch farm profile");
      const data = await res.json();
      return parseWithLogging(api.farms.getMine.responses[200], data, "farms.getMine");
    },
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertFarm) => {
      const validated = api.farms.create.input.parse(data);
      const res = await fetch(api.farms.create.path, {
        method: api.farms.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.farms.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create farm");
      }
      return api.farms.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.farms.getMine.path] });
    },
  });
}
