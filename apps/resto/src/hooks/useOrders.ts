import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { type Order } from "@/pages/Orders";

interface UseOrderParams {
  idOrder?: string;
  idCustomer?: string;
  disabled?: boolean;
}
export function useOrders(params?: UseOrderParams) {
  const { post, idBranch, token } = useApi();
  const queryClient = useQueryClient();

  // Get list of orders
  const getOrders = useQuery<Order[]>({
    queryKey: ["orders", idBranch],
    enabled: !!idBranch && !!token && !params?.disabled,
    queryFn: async () => {
      const res = await post(
        "/resto/order",
        params?.idCustomer ? { idCustomer: params.idCustomer } : {}
      );
      return res.data.orders;
    },
  });

  // Get order detail
  const getOrderDetail = useQuery<Order>({
    queryKey: ["orderDetail", params?.idOrder],
    enabled: !!idBranch && !!params?.idOrder,
    queryFn: async () => {
      const res = await post(
        "/resto/order/detail",
        params?.idOrder ? { idOrder: params.idOrder } : {}
      );
      return res.data.order;
    },
  });

  // Save order (create or edit)
  const saveOrder = useMutation({
    mutationFn: async (payload: any) => {
      const res = await post("/resto/order/save", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", idBranch] });
    },
  });

  // Change order status
  const changeOrderStatus = useMutation({
    mutationFn: async (payload) => {
      const res = await post("/resto/order/changeStatus", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", idBranch] });
      queryClient.invalidateQueries({ queryKey: ["orderDetail", idBranch] });
    },
  });

  // Pay installment
  const payOrder = useMutation({
    mutationFn: async (data: { idInstallment: string }) => {
      const res = await post("/resto/order/pay", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", idBranch] });
      queryClient.invalidateQueries({ queryKey: ["orderDetail", idBranch] });
    },
  });

  return {
    getOrders,
    getOrderDetail,
    saveOrder: saveOrder.mutate,
    changeOrderStatus: changeOrderStatus.mutate,
    payOrder: payOrder.mutate,
  };
}
