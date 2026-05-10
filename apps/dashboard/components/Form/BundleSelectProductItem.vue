<script setup lang="ts">
import type { productType } from "~/types/productData";
export interface BundleProductProps {
  getProducts: () => void;
  products: productType[];
  totalRecords: number;
  selectedProducts: productType[];
  setSelectedProducts: (selectedProducts: productType[]) => void;
}

export interface BundleProductModels {
  searchQuery: string;
  appliedQuery: string;
  offset: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  limit: number;
  selectAll: boolean;
  tableLoading: boolean;
  isLoading: boolean;
}

const timeoutStarted = ref<boolean>(false);

const props = defineProps<{
  bundleProductProps: BundleProductProps;
}>();

const bundleSelectProductItemModel = defineModel<BundleProductModels>(
  "bundleSelectProductItemModel"
);

const filterMutation = computed({
  set(val: string) {
    if (bundleSelectProductItemModel.value) {
      const bundleSelectProductItemModel_ = JSON.parse(
        JSON.stringify(bundleSelectProductItemModel.value)
      );
      bundleSelectProductItemModel_.searchQuery = val;

      if (!timeoutStarted.value) {
        setTimeout(async () => {
          timeoutStarted.value = false;
          if (
            bundleSelectProductItemModel_ &&
            bundleSelectProductItemModel_.searchQuery !==
              bundleSelectProductItemModel_.appliedQuery
          ) {
            bundleSelectProductItemModel_.offset = 0;
            bundleSelectProductItemModel_.appliedQuery =
              bundleSelectProductItemModel_.searchQuery;
            bundleSelectProductItemModel_.selectedProducts = [];
            props.bundleProductProps.getProducts();
          }
        }, 2000);
      }
    }

    timeoutStarted.value = true;
  },
  get() {
    return bundleSelectProductItemModel.value?.searchQuery ?? "";
  },
});

const selectedProductsMutation = computed({
  set(val: productType[]) {
    props.bundleProductProps.setSelectedProducts(val);
  },
  get() {
    return props.bundleProductProps.selectedProducts;
  },
});

const onPage = async (page: number): Promise<void> => {
  if (bundleSelectProductItemModel.value) {
    const bundleSelectProductItemModel_ = JSON.parse(
      JSON.stringify(bundleSelectProductItemModel.value)
    );
    bundleSelectProductItemModel_.selectedProducts = [];
    bundleSelectProductItemModel_.offset =
      page * bundleSelectProductItemModel_.limit;
    bundleSelectProductItemModel_.tableLoading = true;
    props.bundleProductProps.getProducts();
  }
};

const onSort = async (data: {
  sortField: string;
  sortOrder: number;
}): Promise<void> => {
  if (bundleSelectProductItemModel.value) {
    const bundleSelectProductItemModel_ = JSON.parse(
      JSON.stringify(bundleSelectProductItemModel.value)
    );
    bundleSelectProductItemModel_.selectedProducts = [];
    bundleSelectProductItemModel_.offset = 0;
    const sortField =
      data.sortField === "productName"
        ? "product"
        : data.sortField === "categoryName"
        ? "category"
        : data.sortField;

    if (sortField === bundleSelectProductItemModel_.orderBy) {
      bundleSelectProductItemModel_.orderDirection =
        bundleSelectProductItemModel_.orderDirection === "asc" ? "desc" : "asc";
    } else {
      bundleSelectProductItemModel_.orderBy = sortField;
      bundleSelectProductItemModel_.orderDirection = "asc";
    }
    bundleSelectProductItemModel_.tableLoading = true;
    bundleSelectProductItemModel.value = bundleSelectProductItemModel_;
    props.bundleProductProps.getProducts();
  }
};

const onSelectAllChange = (isChecked: boolean): void => {
  if (bundleSelectProductItemModel.value) {
    bundleSelectProductItemModel.value.selectAll = isChecked;
    props.bundleProductProps.setSelectedProducts(
      isChecked ? props.bundleProductProps.products : []
    );
  }
};
</script>
<template>
  <h4 v-if="!bundleSelectProductItemModel">Props not found</h4>
  <div
    v-else-if="bundleSelectProductItemModel.isLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else class="grid p-fluid">
    <ProductList
      :products="bundleProductProps.products"
      :tableLoading="bundleSelectProductItemModel.tableLoading"
      :limit="bundleSelectProductItemModel.limit"
      :totalRecords="bundleProductProps.totalRecords"
      :selectAll="bundleSelectProductItemModel.selectAll"
      @update:page="onPage"
      @update:sort="onSort"
      @select:all="onSelectAllChange"
      v-model:offset="bundleSelectProductItemModel.offset"
      v-model:selectedProducts="selectedProductsMutation"
      v-model:filter="filterMutation"
    />
  </div>
  <Toast />
</template>
