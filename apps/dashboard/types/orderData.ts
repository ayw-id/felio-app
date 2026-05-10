export interface OrderType {
  id?: string;
  code?: string;
  status?: "CREATED" | "CANCELED" | "DONE";
  grandTotal?: number;
  productImages?: string[];
  paidAt?: string;
}
