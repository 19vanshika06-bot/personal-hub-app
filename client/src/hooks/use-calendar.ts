import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertCalendarDay } from "@shared/schema";

export function useCalendar() {
  return useQuery({
    queryKey: [api.calendar.list.path],
    queryFn: async () => {
      const res = await fetch(api.calendar.list.path);
      if (!res.ok) throw new Error("Failed to fetch calendar days");
      return api.calendar.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCalendarDay) => {
      const validated = api.calendar.update.input.parse(data);
      const res = await fetch(api.calendar.update.path, {
        method: api.calendar.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to update calendar day");
      return api.calendar.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.calendar.list.path] }),
  });
}
