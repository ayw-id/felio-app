<template>
  <div v-if="dataAuth" class="grid p-fluid">
    <div
      v-if="isLoading"
      class="text-center w-full"
      style="height: 400px; align-content: center"
    >
      <ProgressSpinner />
    </div>
    <div v-if="!isLoading" class="col-12">
      <AgentProductFormProducts
        :save="save"
        :fetchProducts="fetchProducts"
        :isLoading="isLoading"
        :categories="categories"
        :agentLevels="agentLevels"
        :stateData="{
          products,
          pagination,
        }"
        :filterCategory="filterCategory"
        :changeStateData="changeProductFormState"
      ></AgentProductFormProducts>
    </div>
    <!-- <div v-if="!isLoading && steps === 0" class="col-12">
      <AgentProductFormProducts
        :next="next"
        :fetchProducts="fetchProducts"
        :isLoading="isLoading"
        :stateData="{
          products,
          pagination
        }"
        :changeStateData="changeProductFormState"
      ></AgentProductFormProducts>
    </div> -->
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type {
  ProductCommissionInput,
  ProductFormStateData,
} from "~/components/Agent/ProductForm/Products.vue";
import {
  CommissionStatus,
  CommissionType,
  ProductFormOrderBy,
  type AgentLevel,
  type ProductCategory,
  type SearchProductResult,
} from "~/types/agentData";
import type { authType } from "~/types/authData";
import type {
  FetchAgentLevelType,
  fetchDataType,
  FetchProductsAndCategories,
} from "~/types/fetchData";
import { useBrandStore } from "~/stores/Brand";

export interface Pagination {
  isLoading: boolean;
  limit: number;
  page: number;
  querySearch: string;
  orderBy: ProductFormOrderBy;
  orderDirection: "asc" | "desc";
  idCategory: string;
  totalRecord: number;
}

const toast = useToast();
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const brandStore = useBrandStore();

const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(true);

const agentLevels = ref<AgentLevel[]>([]);
const products = ref<SearchProductResult[]>([]);
const categories = ref<ProductCategory[]>([]);
const pagination = ref<Pagination>({
  isLoading: false,
  limit: 25,
  page: 1,
  querySearch: "",
  orderBy: ProductFormOrderBy.product,
  orderDirection: "asc",
  idCategory: "",
  totalRecord: 0,
});

const save = async (selectedProducts: SearchProductResult[]): Promise<void> => {
  // prevent duplication
  const newSelectedProducts: SearchProductResult[] = [];
  selectedProducts.forEach((product) => {
    if (!newSelectedProducts.some((p) => p.id === product.id)) {
      newSelectedProducts.push(product);
    }
  });

  const productsInput: ProductCommissionInput[] = newSelectedProducts.map(
    (product) => {
      return {
        id: product.id,
        commissions: (product.commissions || []).map((commission) => {
          return {
            idLevelAgent: commission.id,
            commission: commission.commission,
            commissionType: commission.commissionType,
            isActive: commission.commission > 0,
          };
        }),
      };
    }
  );

  if (productsInput.length) {
    isLoading.value = true;
    const body = new FormData();
    body.append("products", JSON.stringify(productsInput));
    body.append("idBrand", brandStore.selectedBrand?.id);

    const response = await $fetch(
      `${runtimeConfig.public.agentMerchantApi}product/saveProducts`,
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${dataAuth.value?.token}`,
        },
        body,
      }
    );

    isLoading.value = false;

    if (!response) {
      showCustomToast(toast);
    } else {
      const dataBind: fetchDataType | null = JSON.parse(response as string);

      if (dataBind) {
        if (!dataBind.success) {
          showCustomToast(toast, dataBind.msg);
        } else {
          router.back();
        }
      } else {
        showCustomToast(toast);
      }
    }
  }
};

const changeProductFormState = (data: ProductFormStateData): void => {
  products.value = data.products;
  pagination.value = data.pagination;
};

const filterCategory = async (category: ProductCategory): Promise<void> => {
  pagination.value = {
    ...pagination.value,
    idCategory: category.id,
    page: 1,
    orderBy: ProductFormOrderBy.product,
    orderDirection: "asc",
  };

  await fetchProducts();
};

const fetchAgentLevels = async (): Promise<void> => {
  isLoading.value = true;
  const response = await $fetch(
    `${runtimeConfig.public.agentMerchantApi}agentLevel`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: FetchAgentLevelType | null = JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        agentLevels.value = dataBind.data.agentLevels;
        await fetchProducts(true);
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const fetchProducts = async (init?: boolean): Promise<void> => {
  isLoading.value = true;
  const body = new FormData();
  body.append("init", init ? "1" : "0");
  body.append("limit", pagination.value.limit + "");
  body.append("page", pagination.value.page + "");
  body.append("querySearch", pagination.value.querySearch + "");
  body.append("orderBy", pagination.value.orderBy + "");
  body.append("orderDirection", pagination.value.orderDirection + "");
  body.append("idCategory", pagination.value.idCategory + "");

  const response = await $fetch(
    `${runtimeConfig.public.agentMerchantApi}product/searchProduct`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: FetchProductsAndCategories | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        products.value = dataBind.data.products.map((product) => {
          return {
            ...product,
            commissions: agentLevels.value.map((level) => {
              return {
                id: level.id,
                commission: level.commission,
                commissionType: CommissionType.PERCENTAGE,
                commissionTypeDropDown: {
                  id: 1,
                  name: "Persentase",
                },
                title: level.title,
                status: CommissionStatus.ACTIVE,
              };
            }),
          };
        });
        if (!categories.value.length) {
          categories.value = dataBind.data.categories;
        }
        pagination.value.totalRecord = dataBind.data.totalProduct;
      }
    } else {
      showCustomToast(toast);
    }
  }
};

onMounted(async () => {
  const auth = getAuthData();

  if (auth) {
    dataAuth.value = auth;

    if (!agentLevels.value.length) {
      await fetchAgentLevels();
    } else {
      await fetchProducts(true);
    }
  } else {
    window.location.href = runtimeConfig.public.baseUrl + "auth/login";
  }
});
</script>
