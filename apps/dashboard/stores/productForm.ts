interface stateType {
  idProduct: string;
}

const stateValue: stateType = {
  idProduct: "",
};

export const useProductFormStore = defineStore("productForm", {
  state: () => stateValue,
  // getters: {
  //   navMenus(): availableServicesType | null {
  //     return this.availableServices;
  //   },
  // },
  actions: {
    setIdProduct(idProduct: string) {
      this.idProduct = idProduct;
    },
  },
});
