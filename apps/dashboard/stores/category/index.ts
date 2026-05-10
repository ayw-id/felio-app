import { SpecialRule, type CategoryType } from "~/types/categoryData";
import type {
  FetchInputDataType,
  FetchDataCategoriesType,
  FetchDataCategoryType,
  fetchDataType,
} from "~/types/fetchData";

export interface GetCategoryInputType extends FetchInputDataType {
  id: string;
}

export interface DeleteCategoriesInputType extends FetchInputDataType {
  idCategories: string[];
}

interface ImageType {
  src: string;
  size: number;
  width?: number;
  height?: number;
  type?: string;
}

interface CategoryInputState {
  name?: string;
  image?: ImageType;
  formLoading?: boolean;
  isSpecial?: boolean;
}

interface stateType {
  pageLoading: boolean;
  tableLoading: boolean;
  categories: CategoryType[];
  totalRecords: number;
  formLoading: boolean;
  formSaveSuccess: boolean;
  formState: CategoryType;
}

const stateValue: stateType = {
  categories: [],
  totalRecords: 0,
  pageLoading: false,
  tableLoading: false,
  formLoading: false,
  formSaveSuccess: false,
  formState: {
    id: "",
    name: "",
    isSpecial: false,
    code: "",
    totalProduct: 0,
  },
};

export const useCategoryStore = defineStore("category", {
  state: () => stateValue,
  // getters: {
  //   navMenus(): availableServicesType | null {
  //     return this.availableServices;
  //   },
  // },
  actions: {
    async getCategories(inputData: FetchInputDataType) {
      this.tableLoading = true;

      const response = await $fetch(`${inputData.url}category`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${inputData.token}`,
        },
        body: inputData.body,
      });

      this.tableLoading = false;

      if (!response) {
        showCustomToast(inputData.toast);
      } else {
        const dataBind: FetchDataCategoriesType | null = JSON.parse(
          response as string
        );

        if (dataBind) {
          if (!dataBind.success) {
            showCustomToast(inputData.toast, dataBind.msg);
          } else {
            this.categories = dataBind.data.categories;
            this.totalRecords = dataBind.data.totalRecords;
          }
        } else {
          showCustomToast(inputData.toast);
        }
      }
    },
    async getCategory(inputData: FetchInputDataType, idBrand?: string) {
      const response = await $fetch(
        `${inputData.url}category/getCategory${idBrand && "/" + idBrand}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${inputData.token}`,
          },
          body: inputData.body,
        }
      );

      this.pageLoading = false;
      this.tableLoading = false;

      if (!response) {
        showCustomToast(inputData.toast);
      } else {
        const dataBind: FetchDataCategoryType | null = JSON.parse(
          response as string
        );

        if (dataBind) {
          if (!dataBind.success) {
            showCustomToast(inputData.toast, dataBind.msg);
          } else {
            this.formState = dataBind.data.category;
          }
        } else {
          showCustomToast(inputData.toast);
        }
      }
    },
    async saveCategory(inputData: FetchInputDataType, idBrand: string) {
      this.formSaveSuccess = false;
      this.formLoading = true;
      const body = new FormData();
      body.append("categoryName", this.formState.name as string);
      if (this.formState.id) {
        body.append("idCategory", this.formState.id as string);
      }
      body.append("idBrand", idBrand);

      if (this.formState.image) {
        body.append(
          "image",
          JSON.stringify({
            src: this.formState.image,
            size: this.formState.size,
            height: this.formState.height,
            width: this.formState.width,
            type: this.formState.type,
          })
        );
      }

      const response = await $fetch(`${inputData.url}category/save`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${inputData.token}`,
        },
        body,
      });

      this.formLoading = false;

      if (!response) {
        this.formSaveSuccess = false;
        showCustomToast(inputData.toast);
      } else {
        const dataBind: fetchDataType | null = JSON.parse(response as string);
        if (dataBind) {
          if (!dataBind.success) {
            this.formSaveSuccess = false;
            showCustomToast(inputData.toast, dataBind.msg);
          } else {
            this.formSaveSuccess = true;
          }
        } else {
          this.formSaveSuccess = false;
          showCustomToast(inputData.toast);
        }
      }
    },
    async deleteCategories(inputData: DeleteCategoriesInputType) {
      this.pageLoading = true;
      const body = new FormData();
      body.append("categories", JSON.stringify(inputData.idCategories));

      const response = await $fetch(
        `${inputData.url}category/deleteCategories`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${inputData.token}`,
          },
          body,
        }
      );

      this.pageLoading = false;

      if (!response) {
        this.formSaveSuccess = false;
        showCustomToast(inputData.toast);
      } else {
        const dataBind: fetchDataType | null = JSON.parse(response as string);

        if (dataBind) {
          if (!dataBind.success) {
            this.formSaveSuccess = false;
            showCustomToast(inputData.toast, dataBind.msg);
          }
        } else {
          this.formSaveSuccess = false;
          showCustomToast(inputData.toast);
        }
      }
    },
    setCategoryToUpdate(category: CategoryType) {
      this.formState = category;
    },
    changeDataCategory(data: CategoryInputState) {
      if (data.name !== undefined) {
        this.formState.name = data.name;
      }
      if (data.image?.src !== undefined) {
        this.formState.image = data.image.src;
        this.formState.size = data.image.size;
        this.formState.width = data.image.width;
        this.formState.height = data.image.height;
        this.formState.type = data.image.type;
        this.formState.imageThumb = "";
      }
      if (data.formLoading !== undefined) {
        this.formLoading = data.formLoading;
      }
      if (data.isSpecial !== undefined) {
        this.formState.isSpecial = data.isSpecial;
      }
    },
    resetCategory() {
      this.categories = [];
    },
    resetForm() {
      this.formState = {
        id: "",
        name: "",
        isSpecial: false,
        code: "",
        totalProduct: 0,
        specialRule: SpecialRule.custom,
        image: "",
        imageThumb: "",
      };
      this.formLoading = false;
    },
  },
});
