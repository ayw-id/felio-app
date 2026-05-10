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
    throw new Error("Failed to upload file");
  }

  return await response.json();
};
