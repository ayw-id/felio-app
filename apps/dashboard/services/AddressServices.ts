import type { addressType } from "~/types/addressData";
import type { FetchInputDataType } from "~/types/fetchData";
import { apiRequest } from "./APIService";

export const getAddress = async (
  inputData: FetchInputDataType
): Promise<{
  success: boolean;
  message?: string;
  userAddress?: addressType[];
}> => {
  const runtimeConfig = useRuntimeConfig();

  const { success, msg, data } = await apiRequest(
    `${runtimeConfig.public.sellerApi}address`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${inputData.token}`,
      },
      body: inputData.body,
    }
  );

  return {
    success,
    message: msg,
    userAddress: success ? (data as addressType[]) : [],
  };
};
