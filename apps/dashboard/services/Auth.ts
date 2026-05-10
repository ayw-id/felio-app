import qs from "qs";
import type { authType } from "~/types/authData";
import type { fetchAuthType, VerifyServiceAccount } from "~/types/fetchData";
import { apiRequest } from "./APIService";

export enum ServiceType {
  websiteBuilder = "websiteBuilder",
  store = "store",
  agent = "agent",
  digitalProduct = "digitalProduct",
  resto = "resto",
  aiContent = "aiContent",
}

export const processResponse = async (
  provider: string,
  code: string
): Promise<{
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    idToken: string;
  };
}> => {
  const runtimeConfig = useRuntimeConfig();
  if (provider === "google") {
    // url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.code}`
    const formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("client_id", runtimeConfig.public.googleClientId as string);
    formData.append(
      "client_secret",
      runtimeConfig.public.googleClientSecret as string
    );
    formData.append(
      "redirect_uri",
      runtimeConfig.public.googleRedirectUrl as string
    );

    const response = await $fetch(
      `https://accounts.google.com/o/oauth2/token`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response) {
      return {
        success: false,
      };
    } else {
      const dataBind: any | null = response;
      if (dataBind) {
        return {
          success: true,
          data: {
            accessToken: dataBind?.access_token as string,
            idToken: dataBind?.id_token as string,
          },
        };
      } else {
        return {
          success: false,
        };
      }
    }
  } else {
    const response = await $fetch(
      `https://graph.facebook.com/oauth/access_token?client_id=${
        runtimeConfig.public.facebookClientId
      }&redirect_uri=${encodeURI(
        runtimeConfig.public.facebookRedirectUrl as string
      )}&client_secret=${
        runtimeConfig.public.facebookClientSecret
      }&code=${code}`,
      {
        method: "get",
      }
    );

    if (!response) {
      return {
        success: false,
      };
    } else {
      const dataBind: any | null = response;
      if (dataBind) {
        return {
          success: true,
          data: {
            accessToken: dataBind?.access_token as string,
            idToken: dataBind?.id as string,
          },
        };
      } else {
        return {
          success: false,
        };
      }
    }
  }
};

export const getUserProfile = async (
  provider: string,
  accessToken: string,
  id: string = ""
): Promise<{
  success: boolean;
  message?: string;
  data?: any;
}> => {
  console.warn(`accessToken ${accessToken ? "exists" : "not exists"}`);
  let url = "";
  if (provider === "facebook") {
    const data = {
      fields: "id,email,last_name,first_name",
      access_token: accessToken.toString(),
    };
    url = `https://graph.facebook.com/v4.0/me?${qs.stringify(data)}`;
  } else {
    url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
  }

  const response = await $fetch(url, {
    method: "get",
  });

  if (!response) {
    return {
      success: false,
    };
  } else {
    const dataBind: any | null = response;
    if (dataBind) {
      return {
        success: true,
        data: id
          ? {
              ...dataBind,
              id,
            }
          : dataBind,
      };
    } else {
      return {
        success: false,
      };
    }
  }
};

export const signInWithSocial = async (
  provider: string,
  userProfile: any,
  dataGuest: any
): Promise<{
  success: boolean;
  message?: string;
  data?: {
    token: authType;
    tokenGuest: authType;
  };
}> => {
  const runtimeConfig = useRuntimeConfig();
  const formData = new FormData();
  const merchantCode = localStorage.getItem(
    storageNames.merchantCode as string
  );
  formData.append("userProfile", JSON.stringify(userProfile));
  formData.append(
    "guest",
    dataGuest.value === null ? "" : (dataGuest.value.token as string)
  );
  formData.append("brandCode", merchantCode ?? "");
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}auth/signInWithSocial/${provider}`,
    {
      method: "post",
      body: formData,
    }
  );

  if (!response) {
    return {
      success: false,
    };
  } else {
    const dataBind: fetchAuthType | null = JSON.parse(response as string);
    if (dataBind) {
      if (!dataBind.success) {
        return {
          success: false,
          message: dataBind.msg as string,
        };
      } else {
        return {
          success: true,
          data: {
            token: dataBind.data.token as authType,
            tokenGuest: dataBind.data.token_guest as authType,
          },
        };
      }
    } else {
      return {
        success: false,
      };
    }
  }
};

export const verifyServiceAccount = async (
  service: ServiceType,
  token: string
): Promise<{
  success: boolean;
  message?: string;
  data?: {
    serviceToken: {
      token: string;
      idSeller: string;
    };
    isStoreUser: boolean;
  };
}> => {
  const runtimeConfig = useRuntimeConfig();
  const body = new FormData();
  body.append("service", service);
  const { success, msg, data } = await apiRequest<VerifyServiceAccount>(
    `${runtimeConfig.public.sellerApi}services/verifyServiceAccount`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    }
  );

  return {
    success,
    message: msg,
    data,
  };
};
