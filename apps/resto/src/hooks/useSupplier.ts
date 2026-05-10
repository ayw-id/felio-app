import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { type InputProps } from "./types";

export interface Contact {
  name: string;
  phone: string;
  email?: string;
}

export interface SupplierType {
  id?: string;
  name: string;
  contactPersons: Contact[];
  status: "active" | "inactive";
  createdAt?: string;
}

const supplierEndpoint = "resto/supplier/";

export const useSupplier = (isFetchingEnable: boolean) => {
  const { post, token, idBranch, idBrand } = useApi();
  const queryClient = useQueryClient();

  const getSuppliers = useQuery<SupplierType[]>({
    queryKey: ["suppliers", idBrand],
    enabled: !!idBrand && !!token && isFetchingEnable,
    queryFn: async () => {
      const res = await post("resto/supplier", { idBrand });
      return res.data.suppliers;
    },
  });

  const refetchSupplier = () => {
    getSuppliers.refetch();
  };

  useEffect(() => {
    if (idBrand && isFetchingEnable) {
      getSuppliers.refetch();
    }
  }, [idBrand]);

  const supplierMutation = useMutation({
    mutationFn: async (input: InputProps) => {
      const res = await post(`${supplierEndpoint}${input.path}`, {
        ...input.payload,
        idBrand,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers", idBrand] });
    },
  });

  return {
    getSuppliers,
    isLoading: getSuppliers.isLoading,
    refetchSupplier,
    isSaving: supplierMutation.isLoading,
    supplierMutation: supplierMutation.mutate,
  };
};
