import { storageNames } from "@/utils/constants";

export interface AuthData {
  token: string;
  idSeller?: string;
}

export const getAuthData = (): AuthData | null => {
  const data = localStorage.getItem(storageNames.productDigitalToken);
  if (data) {
    const dataAuth = JSON.parse(data);
    if (dataAuth) {
      return dataAuth as AuthData;
    }
  }

  return null;
};

export const getBuilderToken = (): AuthData | null => {
  const data = localStorage.getItem(storageNames.builderToken);
  if (data) {
    const dataAuth = JSON.parse(data);
    if (dataAuth) {
      return dataAuth as AuthData;
    }
  }

  return null;
};

export const activateBuilderAccount = async ({ token, baseUrl }) => {
  const response = await fetch(`${baseUrl}auth/activateBuilderAccount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to activate builder account");
  }

  return await response.json();
};

export const verifyServiceAccount = async ({ token, baseUrl, service }) => {
  const response = await fetch(`${baseUrl}services/verifyServiceAccount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      service,
      origin: "dstore",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to verify service account");
  }

  return await response.json();
};
