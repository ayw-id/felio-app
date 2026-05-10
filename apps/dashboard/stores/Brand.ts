import type { BrandType } from "~/types/brandData";

interface stateType {
  brands: BrandType[];
  selectedBrand: BrandType | null;
}

const stateValue: stateType = {
  brands: [],
  selectedBrand: null,
};

export const useBrandStore = defineStore("brand", {
  state: () => stateValue,
  actions: {
    saveBrands(brands: BrandType[]) {
      this.brands = brands;
    },
    setSelectedBrand(brand: BrandType) {
      this.selectedBrand = brand;
    },
  },
});
