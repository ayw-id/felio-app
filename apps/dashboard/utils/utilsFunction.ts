import { navMenus } from "~/utils/constants";
import type { availableServicesType, parentMenuType } from "~/types/navigation";

import { toastSeverity, toastSummary } from "~/types/systemNotification";
import type { ToastServiceMethods } from "primevue/toastservice";
import parsePhoneNumber from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import type { authType, builderAuthType } from "~/types/authData";

export const getOrderStatus = (
  status: "CREATED" | "CANCELED" | "DONE"
): string => {
  return status === "DONE"
    ? "Selesai"
    : status === "CANCELED"
    ? "Dibatalkan"
    : "Pesanan Baru";
};

export const isValidURL = (link: string): boolean => {
  const res = link.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
  );
  return !!res;
};

export const reformatPhoneNumber = (
  phone: string,
  countryCode?: countryCodeType
): string => {
  if (!countryCode?.dialCode) {
    return "";
  }
  const parsedPhoneNumber = parsePhoneNumber(
    phone,
    countryCode.code as CountryCode
  );
  if (!parsedPhoneNumber?.isValid()) {
    return "";
  }
  let phoneNumber = parsedPhoneNumber
    .formatInternational()
    .replace(countryCode.dialCode as string, "");
  phoneNumber = phoneNumber.replaceAll(" ", "");

  return phoneNumber;
};

export const getAmount = (amount: number, useCurrency?: boolean): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  return formatter.format(amount).replace("IDR", useCurrency ? "Rp." : "");
};

export const getNavMenus = (
  availableServices: availableServicesType | null = null,
  permissions?: string[]
): parentMenuType[] => {
  let filteredMenus: parentMenuType[] = [];
  if (availableServices) {
    filteredMenus = navMenus.filter((menu) => {
      const hasSite = menu.premiumFeature?.some(
        (feature) => feature === "FelioSite"
      );
      const hasStore = menu.premiumFeature?.some(
        (feature) => feature === "FelioStore"
      );
      const hasAgent = menu.premiumFeature?.some(
        (feature) => feature === "FelioAgent"
      );

      return (
        !menu.premiumFeature ||
        (availableServices.websiteBuilder && hasSite) ||
        (availableServices.store && hasStore) ||
        (availableServices.agent && hasAgent)
      );
    });
  } else {
    filteredMenus = navMenus;
  }

  let filteredPermissionMenus: parentMenuType[] = [];
  if (permissions !== undefined) {
    filteredMenus.forEach((menu) => {
      if (["Home", "Informasi", "Layanan Lain"].some((d) => d === menu.label)) {
        filteredPermissionMenus.push(menu);
      } else if (menu.items?.length) {
        const items = menu.items.filter((item) => {
          if (!item.permissions?.length) return true;
          return item.permissions.some((perm) =>
            permissions.includes(perm as string)
          );
        });

        if (items.length > 0) {
          filteredPermissionMenus.push({
            ...menu,
            items,
          });
        }
      }
    });
  } else {
    filteredPermissionMenus = filteredMenus;
  }

  return filteredPermissionMenus;
};

export const showCustomToast = (
  toast: ToastServiceMethods,
  msg: string = "",
  isSuccess?: boolean
): void => {
  if (isSuccess) {
    toast.add({
      severity: toastSeverity.success,
      summary: toastSummary.success,
      detail: msg,
      life: 3000,
    });
  } else {
    if (msg) {
      toast.add({
        severity: toastSeverity.warn,
        summary: toastSummary.warn,
        detail: msg,
        life: 3000,
      });
    } else {
      toast.add({
        severity: toastSeverity.error,
        summary: toastSummary.error,
        detail: "Ooops.. Koneksi Internet Kurang Stabil",
        life: 3000,
      });
    }
  }
};

export const getAuthData = (): authType | null => {
  const mainStore = useMainStore();

  if (mainStore.authData) return mainStore.authData;

  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    const parsedDataAuth: authType | null = JSON.parse(dataAuth_);
    if (parsedDataAuth) mainStore.setAuthData(parsedDataAuth);
    return parsedDataAuth;
  }

  return null;
};

export const getAuthTempData = (): authType | null => {
  const dataAuth_ = localStorage.getItem(
    storageNames.tempSellerToken as string
  );
  if (dataAuth_) {
    const parsedDataAuth: authType | null = JSON.parse(dataAuth_);
    if (parsedDataAuth?.token) return parsedDataAuth;
  }

  return null;
};

export const getBuilderAuthData = (): builderAuthType | null => {
  const mainStore = useMainStore();

  if (mainStore.builderData) return mainStore.builderData;
  const dataAuth_ = localStorage.getItem(storageNames.builderToken as string);
  if (dataAuth_) {
    const parsedDataAuth: builderAuthType | null = JSON.parse(dataAuth_);
    if (parsedDataAuth) mainStore.setBuilderData(parsedDataAuth);
    return parsedDataAuth;
  }

  return null;
};

export const formatDateLocal = (date: Date | null): string | null => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months start at 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
