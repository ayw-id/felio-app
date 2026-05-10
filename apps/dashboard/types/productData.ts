import type { userAddressType } from "./addressData";
import type { selectedShippingServiceType } from "./shippingData";

export interface productOptionValueType {
  id: number;
  realId?: number;
  option: string;
  price: number;
  weight: number;
  children: productOptionType | null;
  needRedistribute?: boolean;
  redistributedQty?: number;
  stock?: number;
  expiredDate?: Date | null;
}

export interface productOptionType {
  title: string;
  options: productOptionValueType[];
}

export interface productSpecificationType {
  id: string;
  title: string;
  description: string;
}

export interface SimpleProductType {
  id: string;
  productName: string;
  images?: productImage[];
}

export interface ProductBundleItemType {
  id?: string;
  idProduct: string;
  qty: number;
  name: string;
  image: string;
  price: number;
  categoryName: string;
  weight: number;
}

export interface ProductBundleType {
  items: ProductBundleItemType[];
  bundleDiscountType: "percent" | "amount";
  bundleDiscountValue: number;
}

export interface ProductDiscountType {
  id?: string;
  title: string;
  isActive: boolean;
  type: "percent" | "amount";
  value: number;
  startDate: Date | null;
  endDate: Date | null;
}

export interface ProductWholesaleType {
  id?: string;
  isActive: boolean;
  minQty: number;
  pricePerUnit: number;
}

export interface ProductPreOrder {
  isActive: boolean;
  isLimitingQtyEnabled?: boolean;
  limitQty?: number;
  availableFrom: Date;
  availableUntil: Date;
  isInstallmentEnabled?: boolean;
  downPayment?: number;
  fulfillmentDate?: Date;
  shippingDate: Date;
}

export interface productType extends SimpleProductType {
  code?: string;
  categoryName?: string;
  status?: number;
  price: number;
  weight?: number;
  stock?: number;
  description?: string;
  idCategory?: number;
  idAddress?: string;
  isActive?: number;
  productOptions: productOptionType | null;
  selected?: boolean;
  rating?: number;
  sold?: number;
  shippingServices?: string[];
  specifications?: productSpecificationType[];
  // bundle
  type: "single" | "bundle";
  bundleItemsToDelete?: string[];
  bundle?: ProductBundleType;
  discountsToDelete?: string[];
  discounts: ProductDiscountType[];
  wholesaleTiers: ProductWholesaleType[];
  wholesaleTiersToDelete?: string[];
  preOrder?: ProductPreOrder;
}

export interface productImage {
  id: string;
  image: string;
  size: number;
  order: number;
  type?: string;
  width?: number;
  height?: number;
}

export interface categoryType {
  id: string | number;
  name: string;
}

export interface formReferencesType {
  categories: categoryType[];
  categoryNames: string[];
  addresses: userAddressType[];
  shippingServices: selectedShippingServiceType[];
}

export interface categoryFormType {
  categoryName: string;
}

export interface productOptionsIndexesType {
  i0?: number;
  i1?: number;
  i2?: number;
  addNewData: boolean;
}

export interface optionHeaderFormType {
  title: string;
}

export interface optionValueFormType {
  option: string;
  price: number;
  weight: number;
  stock?: number;
}

export interface transformedValueOptionsType {
  key: string;
  label: string;
  price: number;
  weight: number;
  stock: number;
  i0?: number;
  i1?: number;
  i2?: number;
  isLast?: boolean;
  needRedistribute?: boolean;
  children: transformedHeaderOptionsType[] | null;
}

export interface transformedHeaderOptionsType {
  key: string;
  label: string;
  i0?: number;
  i1?: number;
  i2?: number;
  children: transformedValueOptionsType[] | null;
}

export interface ProductStock {
  stock: number;
  name: string;
  productOptions: productOptionType | null;
}

export interface TransformedProductOptionStock {
  id: number;
  option: string; // concatenated string like "Green / XL / Japanese"
  stock: number;
  price: number;
  weight: number;
  adjustedStock?: number;
  pricePerUnit?: number;
  expiredDate?: Date | null;
}

export interface StockHistoryType {
  id: string;
  idProduct: string;
  type: "in" | "out";
  reference: string;
  qty: number;
  usedQty: number;
  pricePerUnit: number;
  date: string;
  notes: string;
  productName: string;
  expiredDate: string | null;
  subType:
    | "purchase"
    | "usage"
    | "adjustment_in"
    | "adjustment_out"
    | "initialization"
    | "redistribute";
}
