import type {
  brandAddress,
  userAddressWithAvailableServicesType,
} from "./addressData";
import type { websiteType } from "./websiteData";
export interface FollowingMerchantType {
  idMerchant: string;
  logo: string;
}

export interface SocialLinkType {
  social: string;
  link: string;
}

export interface MarketPlaceLinkType {
  marketPlace: string;
  link: string;
}

export interface brandLogo {
  image: string;
  size: number;
  isCircle: boolean;
}

export interface BrandType {
  id: string;
  idSeller: string;
  name: string;
  email: string;
  phone: string;
  callingCode: string;
  logo: brandLogo;
  brandAddress: brandAddress;
  followingMerchants: FollowingMerchantType[];
  totalFollowingMerchant: number;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  tiktok: string | null;
  otherSocials: SocialLinkType[];
  shopee: string | null;
  tokopedia: string | null;
  bukalapak: string | null;
  blibli: string | null;
  lazada: string | null;
  otherMPs: MarketPlaceLinkType[];
  websiteBrand: websiteType[];
}

export enum FormType {
  basic = "BASIC",
  phone = "PHONE",
  basicWithTitle = "BASIC_WITH_TITLE",
  address = "ADDRESS",
}

export interface BrandInputState {
  title?: string;
  data: string;
  countryCode: countryCodeType | null;
  type: FormType;
  index?: number;
  addressInputState?: userAddressWithAvailableServicesType;
}
