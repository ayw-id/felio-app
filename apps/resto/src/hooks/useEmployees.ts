import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { type InputProps } from "./types";

interface ApiEmployee {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  role?: string;
}

interface SaveEmployeeInput {
  idEmployee?: string;
  name: string;
  address: string;
  phone: string;
}

type EmployeeParams = "admin" | "employee" | undefined;

const employeeEndPoint = "resto/employee/";

export const useEmployees = (type?: EmployeeParams) => {
  const { post, token, idBranch, idBrand } = useApi();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery<ApiEmployee[]>({
    queryKey: ["employees", type, idBranch],
    enabled: !!idBranch && !!token,
    queryFn: async () => {
      const res = await post("resto/employee", {
        ...(type ? { params: type } : {}),
      });

      return res.data.employees;
    },
  });

  const refetchEmployee = () => {
    refetch();
  };

  useEffect(() => {
    if (idBranch) {
      refetch();
    }
  }, [idBranch]);

  const employeeMutation = useMutation({
    mutationFn: async (input: InputProps) => {
      const res = await post(`${employeeEndPoint}${input.path}`, input.payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees", idBranch] });
    },
  });

  return {
    data: data ?? [],
    isLoading,
    isError,
    employeeMutation: employeeMutation.mutate,
    refetchEmployee,
  };
};
