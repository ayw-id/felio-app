import type { SubdomainPriceType } from "./fetchData";

export interface websiteType {
  id: string;
  websiteName: string;
  logo: string;
  colorDisplay: string;
  thumbnail: string;
  websiteDomain: string;
  websiteDomainMask: string;
  websiteDomainStatus: string;
  alternativeDomain: string;
  alternativeDomainStatus: string;
  templateURL: string;
  templateURLStatus: string;
  lastUpdate: string;
}

export enum DomainType {
  domain = "domain",
  subDomain = "sub-domain",
  path = "path",
}

export enum DomainStatusType {
  pending = "pending",
  active = "active",
  expired = "expired",
}

export interface DomainStateType {
  domainName: string;
  hostName: string;
  domainType: DomainType;
  domainExtension: string;
  extensionList: ExtensionDataType[];
  subdomainPrice: SubdomainPriceType | null;
  isLoading: boolean;
  addDomain: () => void;
}

export interface DomainDataType extends DomainStateType {
  id: string;
  status: DomainStatusType;
  expiredDate: string;
  dateAdded: string;
  dateModified: string;
}

export interface ExtensionDataType {
  extension: string;
  discountPrice: number;
  price: number;
}
