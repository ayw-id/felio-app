import type {
  FetchInputDataType,
  fetchDataBrandType,
  SaveDataBrandType,
} from "~/types/fetchData";
import { apiRequest } from "./APIService";
import type { ApiResponse } from "./APIService";

export const getBrands = async (
  inputData: FetchInputDataType
): Promise<ApiResponse<fetchDataBrandType>> => {
  const runtimeConfig = useRuntimeConfig();

  const response = await apiRequest<fetchDataBrandType>(
    `${runtimeConfig.public.sellerApi}brand`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${inputData.token}`,
      },
      ...(inputData.body
        ? {
            body: inputData.body,
          }
        : null),
    }
  );

  return response;
};

export const saveBrand = async (
  inputData: FetchInputDataType
): Promise<ApiResponse<SaveDataBrandType>> => {
  const runtimeConfig = useRuntimeConfig();

  const response = await apiRequest<SaveDataBrandType>(
    `${runtimeConfig.public.sellerApi}brand/saveDataBrand`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${inputData.token}`,
      },
      body: inputData.body,
    }
  );

  return response;
};
