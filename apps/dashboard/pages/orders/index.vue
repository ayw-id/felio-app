<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType } from "~/types/authData";
import type { productType } from "~/types/productData";
import type {
  DataTableFilterEvent,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primevue/datatable";
import type { CategoryType } from "~/types/categoryData";
import { useCategoryStore } from "~/stores/category";
import { dialogType } from "~/types/formType";
import { getOrders } from "~/services/OrderServices";
import type { OrderType } from "~/types/orderData";
import { getAmount, getOrderStatus } from "~/utils/utilsFunction";
import { useBrandStore } from "~/stores/Brand";

export interface OrderDetailState {
  selectedOrder: OrderType | null;
}

export interface OrderDetailDialog {
  showDialog: boolean;
  isLoading?: boolean;
  state: OrderDetailState;
}

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const categoryStore = useCategoryStore();
const brandStore = useBrandStore();

const dataAuth = ref<authType | null>(null);
const orders = ref<OrderType[]>([]);
const orderDetailDialog = ref<OrderDetailDialog>({
  showDialog: false,
  state: {
    selectedOrder: null,
  },
});

const searchQuery = ref<string>("");
const isLoading = ref<boolean>(true);
const appliedQuery = ref<string>("");
const page = ref<number>(0);
const orderBy = ref<string>("");
const orderDirection = ref<string>("");
const limit = ref<number>(10);
const totalRecords = ref<number>(0);
const selectAll = ref<boolean>(false);
const timeoutStarted = ref<boolean>(false);

const getCustomerOrders = async (): Promise<void> => {
  const body = new FormData();
  body.append("searchQuery", searchQuery.value || "");
  body.append("page", (page.value || 0) + "");
  body.append("limit", (limit.value || 10) + "");
  body.append("orderBy", orderBy.value || "");
  body.append("orderDirection", orderDirection.value || "");
  body.append("idBrand", brandStore.selectedBrand?.id);

  const response = await getOrders({
    url: (runtimeConfig.public.sellerApi || "") as string,
    token: dataAuth.value?.token || "",
    toast,
    body,
  });

  isLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.message);
  } else {
    orders.value = response.orders;
  }
};

const filterMutation = computed({
  set(val: string) {
    searchQuery.value = val;

    if (!timeoutStarted.value) {
      setTimeout(async () => {
        timeoutStarted.value = false;
        if (searchQuery.value !== appliedQuery.value) {
          appliedQuery.value = searchQuery.value;
          selectedCategories.value = [];
          await getCustomerOrders();
        }
      }, 2000);
    }

    timeoutStarted.value = true;
  },
  get() {
    return searchQuery.value;
  },
});

const onPage = async (event: DataTablePageEvent): Promise<void> => {
  selectedCategories.value = [];
  page.value = event.page;
  await getCustomerOrders();
};

const onSort = async (event: DataTableSortEvent): Promise<void> => {
  selectedCategories.value = [];
  page.value = 0;
  orderBy.value =
    event.sortField === "productName"
      ? "product"
      : event.sortField === "categoryName"
      ? "category"
      : (event.sortField as string);
  orderDirection.value = event.sortOrder === 1 ? "asc" : "desc";
  await getCustomerOrders();
};

const onFilter = (event: DataTableFilterEvent): void => {
  console.warn(event);
};

const onSelectAllChange = (data: any): void => {
  selectAll.value = data.checked;
  if (selectAll.value) {
    selectedCategories.value = categoryStore.categories;
  } else {
    selectedCategories.value = [];
  }
};

const onRowSelect = (data: any): void => {
  if (products.value?.length) {
    selectedCategories.value.push(categoryStore.categories[data.index]);
  }
};

const onRowUnselect = (data: any): void => {
  if (products.value?.length) {
    selectedCategories.value.splice(data.index, 1);
  }
};

const deleteCategories = async (): Promise<void> => {
  deleteCategoriesDialog.value = false;
  // isLoading.value = true;
  let categoryIds: string[] = [];
  if (selectedCategories.value?.length) {
    categoryIds = selectedCategories.value.map((category) => category.id);
  }
  await categoryStore.deleteCategories({
    url: (runtimeConfig.public.sellerApi || "") as string,
    token: dataAuth.value?.token || "",
    toast,
    idCategories: categoryIds,
  });

  deleteCategoriesDialog.value = false;
  await getCustomerOrders();
};

const goToCategoryForm = (category?: CategoryType): void => {
  if (category) {
    categoryStore.setCategoryToUpdate(category);
  } else {
    categoryStore.resetForm();
  }

  window.location.href = `${runtimeConfig.public.baseUrl}product/category/form${
    category ? "?id=" : ""
  }${category?.id || ""}`;
};

watch(
  [() => brandStore.selectedBrand, () => dataAuth.value?.token],
  async (newBrand) => {
    if (newBrand && dataAuth.value?.token) {
      getCustomerOrders();
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

const showOrder = (idOrder: string) => {
  const selectedOrder = orders.value.find((order) => order.id === idOrder);
  if (selectedOrder) {
    orderDetailDialog.value = {
      ...orderDetailDialog.value,
      showDialog: true,
      state: {
        ...orderDetailDialog.value.state,
        selectedOrder,
      },
    };
  }
};
</script>
<template>
  <div
    v-if="categoryStore.pageLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <DataTable
          :value="orders"
          :loading="isLoading"
          lazy
          paginator
          :rows="limit"
          ref="dt"
          dataKey="id"
          :totalRecords="totalRecords"
          @page="onPage($event)"
          @sort="onSort($event)"
          @filter="onFilter($event)"
          v-model:selection="selectedCategories"
          :selectAll="selectAll"
          @select-all-change="onSelectAllChange"
          @row-select="onRowSelect"
          @row-unselect="onRowUnselect"
          tableStyle="min-width: 75rem"
        >
          <template #header>
            <div
              class="flex flex-wrap gap-2 align-items-center justify-content-between"
            >
              <h4 class="m-0">Manage Orders</h4>
              <IconField class="col-4" iconPosition="left">
                <InputIcon>
                  <i class="pi pi-search"></i>
                </InputIcon>
                <InputText v-model="filterMutation" placeholder="Search..." />
              </IconField>
            </div>
          </template>
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column
            field="code"
            header="Invoice"
            filterField="name"
            filterMatchMode="contains"
            :sortable="orders.length"
          >
          </Column>
          <Column
            field="productImages"
            header="Products"
            filterField="totalProduct"
            filterMatchMode="contains"
            :sortable="orders.length"
          >
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <img
                  v-for="(image, i) in data.productImages"
                  :alt="image"
                  :src="image"
                  style="width: 32px"
                />
              </div>
            </template>
          </Column>
          <Column
            field="grandTotal"
            header="Total"
            filterField="totalProduct"
            filterMatchMode="contains"
            :sortable="orders.length"
          >
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <p>{{ getAmount(data.grandTotal) }}</p>
              </div>
            </template>
          </Column>
          <Column
            field="paidAt"
            header="Tanggal Pembayaran"
            filterField="totalProduct"
            filterMatchMode="contains"
            :sortable="orders.length"
          >
          </Column>
          <Column
            field="status"
            header="Status"
            filterField="isActive"
            filterMatchMode="contains"
            :sortable="categoryStore.categories.length > 0"
          >
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <span>{{ getOrderStatus(data.status) }}</span>
              </div>
            </template>
          </Column>

          <Column header="Actions">
            <template #body="{ data }">
              <div class="flex flex-wrap align-items-center gap-2">
                <Button
                  label="Lihat Pesanan"
                  raised
                  severity="default"
                  class="w-full"
                  @click="showOrder(data.id)"
                ></Button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <CustomDialogUI
      v-model:dialogState="orderDetailDialog.showDialog"
      header="Detail Pesanan"
      :width="40"
      :type="dialogType.form"
      :orderDetailState="orderDetailDialog.state"
    ></CustomDialogUI>
  </div>
  <Toast />
</template>
