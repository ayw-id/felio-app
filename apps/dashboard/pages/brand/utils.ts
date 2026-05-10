import {
  FormType,
  type BrandInputState,
  type BrandType,
} from "~/types/brandData";
import { type DialogDataState } from "./index.vue";
import type { userAddressWithAvailableServicesType } from "~/types/addressData";
import type { InitFormType } from "./types";

export enum InputType {
  name = "Brand Name",
  email = "Email Perusahaan",
  phone = "Company Phone Number",
  address = "Company Address",
  ig = "Instagram",
  fb = "Facebook",
  twitter = "Twitter",
  tiktok = "Tiktok",
  otherSocial = "OTHER_SOCIAL",
  shopee = "Shopee",
  tokopedia = "Tokopedia",
  bukalapak = "Bukalapak",
  blibli = "Blibli",
  lazada = "Lazada",
  otherMP = "OTHER_MP",
}

export const defaultDataBrand: BrandType = {
  id: "",
  idSeller: "",
  name: "",
  email: "",
  phone: "",
  callingCode: "",
  websiteBrand: [],
  logo: {
    size: 0,
    image: "",
    isCircle: true,
  },
  brandAddress: {
    idDistrict: "",
    district: "",
    city: "",
    province: "",
    address: "",
  },
  followingMerchants: [],
  totalFollowingMerchant: 0,
  instagram: "",
  facebook: "",
  twitter: "",
  tiktok: "",
  otherSocials: [],
  shopee: "",
  tokopedia: "",
  bukalapak: "",
  blibli: "",
  lazada: "",
  otherMPs: [],
};

export const validateSaveBrandData = (
  dialogDataState: DialogDataState,
  dialogInputState: BrandInputState,
  brand: BrandType
): string => {
  let error: string = "";
  switch (dialogDataState.type) {
    case InputType.name:
      brand.name = dialogInputState.data;
      break;
    case InputType.email:
      brand.email = dialogInputState.data;
      break;
    case InputType.phone:
      brand.phone = dialogInputState.data;
      brand.callingCode = dialogInputState.countryCode?.dialCode || "+62";
      break;
    case InputType.address:
      brand.brandAddress = {
        idDistrict: dialogInputState.addressInputState?.idDistrict || "",
        district: dialogInputState.addressInputState?.district || "",
        province: dialogInputState.addressInputState?.province || "",
        city: dialogInputState.addressInputState?.city || "",
        address: dialogInputState.addressInputState?.address || "",
      };
      break;
    case InputType.ig:
      if (isValidURL(dialogInputState.data)) {
        brand.instagram = dialogInputState.data;
      } else {
        error = "Link tidak valid";
      }
      break;
    case InputType.fb:
      if (isValidURL(dialogInputState.data)) {
        brand.facebook = dialogInputState.data;
      } else {
        error = "Link tidak valid";
      }
      break;
    case InputType.twitter:
      if (isValidURL(dialogInputState.data)) {
        brand.twitter = dialogInputState.data;
      } else {
        error = "Link tidak valid";
      }
      break;
    case InputType.tiktok:
      if (isValidURL(dialogInputState.data)) {
        brand.tiktok = dialogInputState.data;
      } else {
        error = "Link tidak valid";
      }
      break;
    case InputType.otherSocial:
      if (dialogInputState.title) {
        if (isValidURL(dialogInputState.data)) {
          if (dialogInputState.index === undefined) {
            brand.otherSocials.push({
              social: dialogInputState.title,
              link: dialogInputState.data,
            });
          } else {
            brand.otherSocials[dialogInputState.index] = {
              social: dialogInputState.title,
              link: dialogInputState.data,
            };
          }
        } else {
          error = "Link tidak valid";
        }
      } else {
        error = "Nama social media belum diisi";
      }
      break;
    case InputType.shopee:
      if (isValidURL(dialogInputState.data)) {
        brand.shopee = dialogInputState.data;
      } else {
        error = "Link tidak valid";
      }
      break;
    case InputType.tokopedia:
      if (isValidURL(dialogInputState.data)) {
        brand.tokopedia = dialogInputState.data;
      } else {
        error = "Link tidak valid";
      }
      break;
    case InputType.bukalapak:
      if (isValidURL(dialogInputState.data)) {
        brand.bukalapak = dialogInputState.data;
      } else {
        error = "Link tidak valid";
      }
      break;
    case InputType.blibli:
      if (isValidURL(dialogInputState.data)) {
        brand.blibli = dialogInputState.data;
      } else {
        error = "Link tidak valid";
      }
      break;
    case InputType.lazada:
      if (isValidURL(dialogInputState.data)) {
        brand.lazada = dialogInputState.data;
      } else {
        error = "Link tidak valid";
      }
      break;
    case InputType.otherMP:
      if (dialogInputState.title) {
        if (isValidURL(dialogInputState.data)) {
          if (dialogInputState.index === undefined) {
            brand.otherMPs.push({
              marketPlace: dialogInputState.title,
              link: dialogInputState.data,
            });
          } else {
            brand.otherMPs[dialogInputState.index] = {
              marketPlace: dialogInputState.title,
              link: dialogInputState.data,
            };
          }
        } else {
          error = "Link tidak valid";
        }
      } else {
        error = "Nama market place belum diisi";
      }
      break;
  }

  return error;
};

export const initializeForm = (
  type: string,
  brand: BrandType | null,
  index?: number
): InitFormType => {
  let data = "";

  let callingCode: countryCodeType | null | undefined = null;
  let formType = FormType.basic;
  let titleInput: string | undefined;
  let titleDialog: string = type;
  let addressInputState: userAddressWithAvailableServicesType | undefined;
  switch (type) {
    case InputType.name:
      data = brand?.name || "";
      break;
    case InputType.email:
      data = brand?.email || "";
      break;
    case InputType.phone:
      data = brand?.phone || "";
      callingCode = countryCode.find(
        (code) => code.dialCode === (brand?.callingCode || "+62")
      );
      callingCode = !callingCode ? null : callingCode;
      formType = FormType.phone;
      break;
    case InputType.address:
      addressInputState = {
        idDistrict: brand?.brandAddress?.idDistrict || "",
        province: brand?.brandAddress?.province || "",
        city: brand?.brandAddress?.city || "",
        district: brand?.brandAddress?.district || "",
        address: brand?.brandAddress?.address || "",
        showShippingInput: false,
      };
      formType = FormType.address;
      break;
    case InputType.ig:
      data = brand?.instagram || "";
      break;
    case InputType.fb:
      data = brand?.facebook || "";
      break;
    case InputType.twitter:
      data = brand?.twitter || "";
      break;
    case InputType.tiktok:
      data = brand?.tiktok || "";
      break;
    case InputType.otherSocial:
      data = index === undefined ? "" : brand?.otherSocials[index].link || "";
      titleInput =
        index === undefined ? undefined : brand?.otherSocials[index].social;
      titleDialog = "Social Media";
      formType = FormType.basicWithTitle;
      break;
    case InputType.shopee:
      data = brand?.shopee || "";
      break;
    case InputType.tokopedia:
      data = brand?.tokopedia || "";
      break;
    case InputType.bukalapak:
      data = brand?.bukalapak || "";
      break;
    case InputType.blibli:
      data = brand?.blibli || "";
      break;
    case InputType.lazada:
      data = brand?.lazada || "";
      break;
    case InputType.otherMP:
      data = index === undefined ? "" : brand?.otherMPs[index].link || "";
      titleInput =
        index === undefined ? undefined : brand?.otherMPs[index].marketPlace;
      titleDialog = "Market Place";
      formType = FormType.basicWithTitle;
      break;
  }

  return {
    data,
    callingCode,
    formType,
    titleInput,
    titleDialog,
    addressInputState,
  };
};

export const validateSaveBrandChanges = (brand?: BrandType | null): string => {
  let error: string = "";

  if (!brand?.logo.image) {
    error = "Logo belum dipilih";
  } else if (!brand.name) {
    error = "Nama brand belum diisi";
  } else if (!brand.email) {
    error = "Email brand belum diisi";
  } else if (!/.+@.+/.test(brand.email as string)) {
    error = "Email brand tidak valid";
  } else if (
    !brand.callingCode ||
    !countryCode.find((code) => code.dialCode === brand?.callingCode)
  ) {
    error = "Country code tidak valid";
  } else if (!brand.phone) {
    error = "Nomor handphone perusahaan belum diisi";
  } else if (
    !reformatPhoneNumber(
      brand.phone,
      countryCode.find((code) => code.dialCode === brand?.callingCode)
    )
  ) {
    error = "Nomor handphone perusahaan tidak valid";
  } else if (!brand.brandAddress?.address || !brand.brandAddress?.idDistrict) {
    error = "Alamat perusahaan belum diisi";
  }

  return error;
};

export const getSaveDataBrandBody = (brand?: BrandType | null): FormData => {
  const body = new FormData();
  if (brand?.id) {
    body.append("idBrand", brand.id as string);
  }
  body.append("logo", JSON.stringify(brand?.logo));
  body.append("name", brand?.name as string);
  body.append("email", brand?.email as string);
  body.append("callingCode", brand?.callingCode as string);
  body.append(
    "phone",
    reformatPhoneNumber(
      brand?.phone || "",
      countryCode.find((code) => code.dialCode === brand?.callingCode)
    ) as string
  );
  body.append("idDistrict", brand?.brandAddress.idDistrict as string);
  body.append("address", brand?.brandAddress.address as string);
  body.append("instagram", (brand?.instagram as string) || "");
  body.append("facebook", (brand?.facebook as string) || "");
  body.append("twitter", (brand?.twitter as string) || "");
  body.append("tiktok", (brand?.tiktok as string) || "");
  body.append("otherSocials", JSON.stringify(brand?.otherSocials));

  body.append("shopee", (brand?.shopee as string) || "");
  body.append("tokopedia", (brand?.tokopedia as string) || "");
  body.append("bukalapak", (brand?.bukalapak as string) || "");
  body.append("blibli", (brand?.blibli as string) || "");
  body.append("lazada", (brand?.lazada as string) || "");
  body.append("otherMps", JSON.stringify(brand?.otherMPs));

  return body;
};
