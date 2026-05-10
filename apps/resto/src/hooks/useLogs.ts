import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "@/hooks/useApi";
import { useToken } from "@/contexts/TokenContext";

interface WriteLogInput {
  endpoint: string;
  payload: string;
  response: string;
}

export const useLogs = () => {
  const { token } = useToken();
  const mutation = useMutation({
    mutationFn: async (payload: WriteLogInput) => {
      const res = await fetch(`${baseUrl}resto/log/write`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return mutation.mutate;
};
