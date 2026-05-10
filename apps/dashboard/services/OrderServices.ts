import type { OrderType } from "~/types/orderData";
import type { FetchInputDataType, FetchOrders } from "~/types/fetchData";

export const getOrders = async (
  inputData: FetchInputDataType
): Promise<{
  success: boolean;
  message?: string;
  orders?: OrderType[];
}> => {
  const runtimeConfig = useRuntimeConfig();

  const response = await $fetch(`${runtimeConfig.public.sellerApi}order`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${inputData.token}`,
    },
    body: inputData.body,
  });

  if (!response) {
    return {
      success: false,
    };
  } else {
    const dataBind: FetchOrders | null = JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        return {
          success: false,
          message: dataBind.msg,
        };
      } else {
        return {
          success: true,
          orders: dataBind.data?.orders,
        };
      }
    } else {
      return {
        success: false,
      };
    }
  }
};
