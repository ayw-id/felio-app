import type { SimpleProductType } from "~/types/productData";
export enum SpecialRule {
  newest = "newest",
  bestSeller = "bestSeller",
  higestRating = "higestRating",
  mostSearched = "mostSearched",
  custom = "custom",
}

export interface CategoryType {
  id: string;
  name: string;
  isSpecial: boolean;
  specialRule?: SpecialRule;
  code: string;
  image?: string;
  imageThumb?: string;
  size?: number;
  height?: number;
  width?: number;
  type?: string;
  totalProduct: number;
  products?: SimpleProductType[];
}
