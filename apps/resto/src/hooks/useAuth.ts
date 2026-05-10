import { useMutation } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { type InputProps } from "./types";

const authEndPoint = "resto/auth/";

export const useAuth = () => {
  const { post } = useApi();
  const authMutation = useMutation({
    mutationFn: async (data: InputProps) => {
      const res = await post(
        `${authEndPoint}${data.path}`,
        data.payload,
        false
      );
      return res.data;
    },
  });

  return {
    authMutation: authMutation.mutate,
  };
};
