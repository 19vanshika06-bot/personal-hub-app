import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertJournalEntry } from "@shared/schema";

export function useJournal() {
  return useQuery({
    queryKey: [api.journal.list.path],
    queryFn: async () => {
      const res = await fetch(api.journal.list.path);
      if (!res.ok) throw new Error("Failed to fetch journal entries");
      return api.journal.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertJournalEntry) => {
      const validated = api.journal.create.input.parse(data);
      const res = await fetch(api.journal.create.path, {
        method: api.journal.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to create journal entry");
      return api.journal.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.journal.list.path] }),
  });
}
