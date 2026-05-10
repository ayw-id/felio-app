import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type RawMaterial, StockTransaction } from "src/pages/Stock";
import { useApi } from "@/hooks/useApi";

export const useStock = () => {
  const queryClient = useQueryClient();
  const { post, token, idBranch } = useApi();

  const stockQuery = useQuery<RawMaterial[]>({
    queryKey: ["stock", idBranch],
    enabled: !!idBranch && !!token,
    queryFn: async () => {
      const res = await post("resto/stock", {});
      return res.data;
    },
  });

  const saveStockMutation = useMutation({
    mutationFn: async (data: Omit<RawMaterial, "id" | "lastPurchaseDate">) => {
      const res = await post("resto/stock/save", data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["stock", idBranch]);
    },
  });

  return {
    stockQuery,
    saveStock: saveStockMutation.mutate,
    isSaving: saveStockMutation.isLoading,
  };
};
