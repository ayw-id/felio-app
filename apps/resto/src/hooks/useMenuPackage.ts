import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

export function useMenuPackage(
  type: "menu" | "package",
  isFetchingEnable: boolean
) {
  const queryClient = useQueryClient();
  const { post, token, idBranch } = useApi();

  const getMenuPackage = useQuery({
    queryKey: ["menuPackages", idBranch, type],
    enabled: !!idBranch && !!token && isFetchingEnable,
    queryFn: async () => {
      const res = await post("resto/menuPackage", {
        type,
      });

      return type === "menu" ? res.data?.menus : res.data?.packages;
    },
  });

  const saveMenuPackage = useMutation({
    mutationFn: async (payload: any) => {
      const res = await post(
        `resto/menuPackage/save${type === "menu" ? "Menu" : "Package"}`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["menuPackages", idBranch, type],
      });
    },
  });

  return {
    getMenuPackage,
    saveMenuPackage: saveMenuPackage.mutate,
  };
}
