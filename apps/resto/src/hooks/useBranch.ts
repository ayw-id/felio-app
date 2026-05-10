import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { useLogs } from "@/hooks/useLogs";
import { useResto } from "@/contexts/RestoContext";

const saveEndpoint = "resto/branch/save";
const changeStatusEndpoint = "resto/branch/changeStatus";

export function useBranch(type: "menu" | "package", isFetchingEnable: boolean) {
  const { post } = useApi();
  const logMutation = useLogs();
  const { selectedBrand } = useResto();
  const qc = useQueryClient();

  const saveBranch = useMutation({
    mutationFn: async (payload: any) => {
      const res = await post(saveEndpoint, payload, false);
      return true;
    },
    onSuccess: () => {
      try {
        qc.invalidateQueries({ queryKey: ["branches", selectedBrand?.id] });
      } catch (error: any) {
        logMutation({
          endpoint: saveEndpoint,
          payload: "",
          response: error.message,
        });
      }
    },
  });

  const changeStatusBranch = useMutation({
    mutationFn: async (payload: any) => {
      const res = await post(changeStatusEndpoint, payload, false);
      return true;
    },
    onSuccess: () => {
      try {
        qc.invalidateQueries({ queryKey: ["branches", selectedBrand?.id] });
      } catch (error: any) {
        logMutation({
          endpoint: changeStatusEndpoint,
          payload: "",
          response: error.message,
        });
      }
    },
  });

  return {
    saveBranch: saveBranch.mutate,
    changeStatusBranch: changeStatusBranch.mutate,
  };
}
