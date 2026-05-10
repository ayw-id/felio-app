import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

export function usePurchases() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const { post, token, idBranch } = useApi();

  const getPurchases = useQuery({
    queryKey: ["purchases", idBranch],
    enabled: !!idBranch && !!token,
    queryFn: async () => {
      const res = await post("resto/stock/getPurchases", {
        page,
        limit,
      });

      return res.data.purchases;
    },
  });

  const createPurchase = useMutation({
    mutationFn: async (payload: any) => {
      const res = await post("resto/stock/purchase", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases", idBranch] });
    },
  });

  const confirmPurchase = useMutation({
    mutationFn: async ({ idPurchase }: { idPurchase: string }) => {
      const res = await post("resto/stock/confirmPurchaseOrder", {
        idPurchase,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases", idBranch] });
    },
  });

  const cancelPurchase = useMutation({
    mutationFn: async ({ idPurchase }: { idPurchase: string }) => {
      const res = await post("resto/stock/cancelPurchaseOrder", { idPurchase });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases", idBranch] });
    },
  });

  return {
    getPurchases,
    createPurchase: createPurchase.mutate,
    confirmPurchase: confirmPurchase.mutate,
    cancelPurchase: cancelPurchase.mutate,
    page,
    setPage,
    limit,
    setLimit,
  };
}
