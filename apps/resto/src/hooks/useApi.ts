import { useToken } from "@/contexts/TokenContext";
import { useResto } from "@/contexts/RestoContext";
import { useLogs } from "@/hooks/useLogs";

export const baseUrl = import.meta.env.VITE_API;

export function useApi(onErrorLog?: (error: any) => void) {
  const { selectedBranch, selectedBrand } = useResto();
  const logMutation = useLogs();
  const { token } = useToken();
  const idBranch = selectedBranch?.id ?? "";
  const idBrand = selectedBrand?.id ?? "";

  async function post<T = any>(
    path: string,
    payload: any,
    includeIdBranch = true
  ): Promise<T> {
    const body = JSON.stringify({
      ...payload,
      ...(includeIdBranch ? { idBranch } : null),
    });
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!res.ok) {
        const errorData = {
          message: `HTTP ${res.status} - ${res.statusText}`,
          path,
          body,
        };
        logMutation({
          endpoint: path,
          payload: body,
          response: await res.text(),
        });
        throw new Error(errorData.message);
      }

      const json = await res.json();
      if (json.success !== 1) {
        const errorData = { message: json.msg || "API error", path, body };
        logMutation({
          endpoint: path,
          payload: body,
          response: JSON.stringify(json),
        });
        throw new Error(errorData.message);
      }

      return json;
    } catch (err) {
      logMutation({
        endpoint: path,
        payload: body,
        response: err.message,
      });
      throw err;
    }
  }

  return { post, token, idBranch, idBrand };
}
