import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useProgress() {
  return useQuery({
    queryKey: [api.progress.list.path],
    queryFn: async () => {
      const res = await fetch(api.progress.list.path);
      if (!res.ok) throw new Error("Failed to fetch progress");
      return api.progress.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ category, value }: { category: string; value: number }) => {
      const url = buildUrl(api.progress.update.path, { category });
      const res = await fetch(url, {
        method: api.progress.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return api.progress.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.progress.list.path] }),
  });
}
