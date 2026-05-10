export interface menuType {
  label: string;
  icon?: string;
  redirect?: boolean;
  type?: string;
  to?: string;
  permissions?: string[];
}

export interface parentMenuType extends menuType {
  label: string;
  premiumFeature?: string[];
  items?: menuType[];
  separator?: boolean;
  icon?: string;
  color?: string;
  to?: string;
}

export interface availableServicesType {
  store: boolean;
  websiteBuilder: boolean;
  agent?: boolean;
}
