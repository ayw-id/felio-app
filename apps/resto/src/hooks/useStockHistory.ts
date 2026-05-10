import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type StockTransaction } from "src/pages/Stock";
import { useApi } from "@/hooks/useApi";

export const useStockHistory = () => {
  const queryClient = useQueryClient();
  const [pageHistory, setPageHistory] = useState<number>(1);
  const [limitHistory, setLimitHistory] = useState<number>(10);
  const { post, token, idBranch } = useApi();

  const stockHistoryQuery = useQuery<StockTransaction[]>({
    queryKey: ["stockHistory", idBranch],
    enabled: !!idBranch,
    queryFn: async () => {
      const res = await post("resto/stock/getStockHistory", {
        page: pageHistory,
        limit: limitHistory,
      });
      return res.data.stockHistories;
    },
  });

  const adjustStockMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await post("resto/stock/adjustStock", payload);
      return res;
    },
  });

  useEffect(() => {
    stockHistoryQuery.refetch();
  }, [pageHistory, limitHistory]);

  return {
    stockHistoryQuery,
    pageHistory,
    setPageHistory,
    limitHistory,
    setLimitHistory,
    adjustStock: adjustStockMutation.mutate,
  };
};
