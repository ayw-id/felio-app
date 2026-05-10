import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import type { HomeStatsResponse } from "@/types/home";

export function useHomeStats() {
  const { post } = useApi();

  return useQuery<HomeStatsResponse>({
    queryKey: ["homeStats"],
    queryFn: () => post("/resto/dashboard", {}),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}
