export interface shippingServiceType {
  service: string;
}

export interface selectedShippingServiceType extends shippingServiceType {
  isSelected?: boolean;
}
