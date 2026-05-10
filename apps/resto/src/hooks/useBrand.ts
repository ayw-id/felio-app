import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { useLogs } from "@/hooks/useLogs";

export function useBrand(type: "menu" | "package", isFetchingEnable: boolean) {
  const { post } = useApi();
  const logMutation = useLogs();
  const qc = useQueryClient();

  const saveBrand = useMutation({
    mutationFn: async (payload: any) => {
      const res = await post("resto/brand/save", payload);
      return true;
    },
    onSuccess: () => {
      try {
        qc.invalidateQueries({ queryKey: ["brands"] });
      } catch (error: any) {
        logMutation({
          endpoint: "resto/brand/save",
          payload: "",
          response: error.message,
        });
      }
    },
  });

  return {
    saveBrand: saveBrand.mutate,
  };
}
