export interface addressType {
  id?: string;
  idDistrict: string;
  district: string;
  city: string;
  province: string;
  isActive?: boolean;
}

export interface brandAddress extends addressType {
  address: string;
}

export interface userAddressType {
  id?: string;
  idDistrict: string;
  address: string;
  shippingServices?: string;
  province: string;
  city: string;
  district: string;
  showShippingInput: boolean;
}

export interface userAddressWithAvailableServicesType extends userAddressType {
  availableServices?: string[];
}
