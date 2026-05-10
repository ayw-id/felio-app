export interface ApiResponse<T> {
  success: boolean;
  msg?: string;
  data?: T;
}

interface LogInputType {
  endpoint: string;
  payload?: string;
  response?: string;
  headers?: {
    Authorization: string;
  };
}

interface RequestAPI {
  method: "POST" | "GET";
  headers?: {
    Authorization: string;
  };
  body?: any;
}

export const apiRequest = async <T>(
  url: string,
  options: RequestAPI
): Promise<ApiResponse<T>> => {
  try {
    const response: string = await $fetch(url, options);
    const parsedResponse: ApiResponse<T> = JSON.parse(response);

    if (!parsedResponse.success) {
      await recordLog({
        endpoint: url,
        payload: JSON.stringify(options.body),
        response,
        headers: options.headers,
      });
    }

    return {
      success: !!parsedResponse.success,
      msg: parsedResponse.msg,
      data: parsedResponse.data,
    };
  } catch (error: any) {
    await recordLog({
      endpoint: url,
      payload: JSON.stringify(options.body),
      response: JSON.stringify(error),
      headers: options.headers,
    });
    console.error("API error:", error);
    return {
      success: false,
      msg: error?.message || "Unexpected error occurred",
    };
  }
};

const recordLog = async (data: LogInputType): Promise<void> => {
  try {
    const runtimeConfig = useRuntimeConfig();
    const body = new FormData();
    body.append("endpoint", data.endpoint);
    body.append("payload", data.payload ?? "");
    body.append("response", data.response ?? "");

    const response = await $fetch(
      `${runtimeConfig.public.sellerApi}log/write`,
      {
        method: "POST",
        headers: data.headers,
        body,
      }
    );
    console.warn("response", response);
  } catch (error: any) {
    console.warn("error", error);
  }
};
