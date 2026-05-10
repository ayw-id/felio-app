<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType } from "~/types/authData";
import { showCustomToast } from "~/utils/utilsFunction";
import type { fetchGetProductsType, fetchDataType } from "~/types/fetchData";
import type { productType } from "~/types/productData";
import { useProductFormStore } from "~/stores/productForm";
import { dialogType } from "~/types/formType";
import { useBrandStore } from "~/stores/Brand";
import { apiRequest } from "~/services/APIService";
import { useMainStore } from "~/stores/main";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const router = useRouter();
const productStore = useProductFormStore();
const mainStore = useMainStore();

const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(true);
const products = ref<productType[]>([]);
const searchQuery = ref<string>("");
const appliedQuery = ref<string>("");
const offset = ref<number>(0);
const orderBy = ref<string>("");
const orderDirection = ref<string>("");
const selectedCategory = ref<string>("");
const limit = ref<number>(10);
const totalRecords = ref<number>(0);
const selectedProducts = ref<productType[]>([]);
const selectAll = ref<boolean>(false);
const timeoutStarted = ref<boolean>(false);
const deleteProductsDialog = ref<boolean>(false);
const tableLoading = ref<boolean>(false);
const brandStore = useBrandStore();

const filterMutation = computed({
  set(val: string) {
    searchQuery.value = val;

    if (!timeoutStarted.value) {
      setTimeout(async () => {
        timeoutStarted.value = false;
        if (searchQuery.value !== appliedQuery.value) {
          offset.value = 0;
          appliedQuery.value = searchQuery.value;
          selectedProducts.value = [];
          await getProducts();
        }
      }, 2000);
    }

    timeoutStarted.value = true;
  },
  get() {
    return searchQuery.value;
  },
});

const getProducts = async (): Promise<void> => {
  if (brandStore.selectedBrand?.id) {
    isLoading.value = true;
    tableLoading.value = true;

    const body = new FormData();
    body.append("idBrand", brandStore.selectedBrand.id as string);
    body.append("searchQuery", searchQuery.value as string);
    body.append("offset", offset.value + "");
    body.append("limit", limit.value + "");
    body.append("orderBy", orderBy.value as string);
    body.append("orderDirection", orderDirection.value as string);
    body.append("idCategory", selectedCategory.value as string);
    body.append("getRating", "1");

    const response = await apiRequest<fetchGetProductsType>(
      `${runtimeConfig.public.sellerApi}product/getProducts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${dataAuth.value?.token}`,
        },
        body,
      }
    );

    isLoading.value = false;
    tableLoading.value = false;

    if (!response.success) {
      showCustomToast(toast, response.msg);
    } else if (response.data) {
      totalRecords.value = response.data.totalRecords;
      products.value = response.data.products;
    }
  }
};

const onPage = async (page: number): Promise<void> => {
  selectedProducts.value = [];
  offset.value = page * limit.value;
  tableLoading.value = true;
  await getProducts();
};

const onSort = async (data: {
  sortField: string;
  sortOrder: number;
}): Promise<void> => {
  selectedProducts.value = [];
  offset.value = 0;
  const sortField =
    data.sortField === "productName"
      ? "product"
      : data.sortField === "categoryName"
      ? "category"
      : data.sortField;

  if (sortField === orderBy.value) {
    orderDirection.value = orderDirection.value === "asc" ? "desc" : "asc";
  } else {
    orderBy.value = sortField;
    orderDirection.value = "asc";
  }
  tableLoading.value = true;
  await getProducts();
};

const onSelectAllChange = (isChecked: boolean): void => {
  selectAll.value = isChecked;
  if (selectAll.value) {
    selectedProducts.value = products.value;
  } else {
    selectedProducts.value = [];
  }
};

const deleteProduct = async (): Promise<void> => {
  deleteProductsDialog.value = false;
  isLoading.value = true;
  let productIds: string[] = [];
  if (selectedProducts.value?.length) {
    productIds = selectedProducts.value.map((product) => product.id);
  }
  const body = new FormData();
  body.append("products", JSON.stringify(productIds));

  const response = await apiRequest<fetchDataType>(
    `${runtimeConfig.public.sellerApi}product/deleteProducts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  isLoading.value = false;
  tableLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else {
    await getProducts();
  }
};

const goToProductForm = (data: {
  path: string;
  product?: productType;
}): void => {
  productStore.setIdProduct(data.product?.id || "-");
  let destination = `/product/${data.path}`;

  if (data.product?.id) {
    destination += `/${data.product.id}`;
  }
  router.push(destination);
  // window.location.href = destination;
};

watch(
  [() => brandStore.selectedBrand, () => dataAuth.value?.token],
  async (newBrand) => {
    if (newBrand && dataAuth.value?.token) {
      await getProducts();
    }
  },
  { immediate: false }
);

onMounted(async () => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    const parsedDataAuth = JSON.parse(dataAuth_);
    if (parsedDataAuth) {
      dataAuth.value = parsedDataAuth;
    }
  }
});
</script>
<template>
  <div
    v-if="isLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template #start>
            <Button
              v-if="
                mainStore.userPermissions?.some(
                  (perm) => perm === 'product:add'
                )
              "
              @click="goToProductForm({ path: 'form' })"
              label="Tambah Produk"
              icon="pi pi-plus"
              severity="success"
              style="width: 180px"
              class="mr-2"
            ></Button>
            <Button
              v-if="
                mainStore.userPermissions?.some(
                  (perm) => perm === 'product:delete'
                )
              "
              label="Hapus Produk"
              icon="pi pi-trash"
              severity="danger"
              style="width: 180px"
              @click="deleteProductsDialog = true"
              :disabled="!selectedProducts || !selectedProducts.length"
            ></Button>
          </template>
          <!-- <template #end>
              <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
              <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
          </template> -->
        </Toolbar>
        <ProductList
          :products="products"
          :tableLoading="tableLoading"
          :limit="limit"
          :totalRecords="totalRecords"
          :selectAll="selectAll"
          @update:page="onPage"
          @update:sort="onSort"
          @select:all="onSelectAllChange"
          @redirect:product="goToProductForm"
          v-model:offset="offset"
          v-model:selectedProducts="selectedProducts"
          v-model:filter="filterMutation"
          showActions
        />
      </div>
    </div>
  </div>
  <CustomDialogUI
    v-model:dialogState="deleteProductsDialog"
    header="Hapus Produk"
    :width="25"
    :type="dialogType.confirm"
    description="Anda yakin ingin menghapus produk"
    cancelButtonText="Tidak"
    :cancelButtonAction="() => (deleteProductsDialog = false)"
    successButtonText="Ya"
    successButtonColor="danger"
    :successButtonAction="deleteProduct"
  ></CustomDialogUI>
  <Toast />
</template>
