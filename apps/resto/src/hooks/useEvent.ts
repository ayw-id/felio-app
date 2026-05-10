import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { InputProps } from "./types";

export interface EventType {
  id?: string;
  name: string;
  type: "type" | "location";
}

const supplierEndpoint = "resto/supplier/";

export const useEvent = (isFetchingEnable: boolean) => {
  const { post, token, idBranch, idBrand } = useApi();
  const queryClient = useQueryClient();

  const getEvents = useQuery<EventType[]>({
    queryKey: ["events", idBrand],
    enabled: !!idBrand && !!token && isFetchingEnable,
    queryFn: async () => {
      const res = await post("resto/order/getEventData", { idBrand });
      return res.data.events;
    },
  });

  const refetchEvents = () => {
    getEvents.refetch();
  };

  useEffect(() => {
    if (idBrand && isFetchingEnable) {
      getEvents.refetch();
    }
  }, [idBrand]);

  return {
    getEvents,
    isLoading: getEvents.isLoading,
    refetchEvents,
  };
};
