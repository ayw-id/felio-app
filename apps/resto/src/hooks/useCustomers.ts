import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { type Order } from "@/pages/Orders";

export function useCustomers(isOrder = true, isFetchingEnable?: boolean) {
  const { post, idBranch, token } = useApi();
  const queryClient = useQueryClient();

  // Get list of customers
  const getCustomers = useQuery<Order[]>({
    queryKey: ["customers", idBranch],
    enabled: !!idBranch && !!token && isFetchingEnable,
    queryFn: async () => {
      const res = await post("/resto/customer", { isOrder });
      return res.data.customers;
    },
  });

  return {
    getCustomers,
  };
}
