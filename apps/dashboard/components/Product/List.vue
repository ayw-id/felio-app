<script setup lang="ts">
import type { productType } from "~/types/productData";
import type {
  DataTableFilterEvent,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primevue/datatable";
import { useMainStore } from "~/stores/main";

const mainStore = useMainStore();

defineProps<{
  products: productType[];
  tableLoading: boolean;
  limit: number;
  totalRecords: number;
  selectAll: boolean;
  showActions?: boolean;
}>();

const emit = defineEmits([
  "update:page",
  "update:sort",
  "select:all",
  "redirect:product",
]);

const offset = defineModel<number>("offset");
const selectedProducts = defineModel<productType[]>("selectedProducts");
const filter = defineModel<string>("filter");

const onPage = async (event: DataTablePageEvent): Promise<void> => {
  emit("update:page", event.page);
};
const onSort = async (event: DataTableSortEvent): Promise<void> => {
  emit("update:sort", {
    sortField: event.sortField,
    sortOrder: event.sortOrder,
  });
};
const onFilter = (event: DataTableFilterEvent): void => {
  console.warn(event);
};
const onSelectAllChange = (data: any): void => {
  emit("select:all", data.checked);
};

const onRowSelect = (data: any): void => {
  // emit('select:row', data.index);
};

const onRowUnselect = (data: any): void => {
  // emit('unselect:row', data.index);
};

const goToProductForm = (path: string, product?: productType): void => {
  emit("redirect:product", {
    path,
    product,
  });
};
</script>
<template>
  <DataTable
    :value="products"
    :loading="tableLoading"
    lazy
    paginator
    :rows="limit"
    v-model:first="offset"
    :rowsPerPageOptions="[10, 25, 50]"
    ref="dt"
    dataKey="id"
    :totalRecords="totalRecords"
    @page="onPage($event)"
    @sort="onSort($event)"
    @filter="onFilter($event)"
    v-model:selection="selectedProducts"
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
        <h4 class="m-0">Atur Produk</h4>
        <IconField class="col-12 sm:col-6 md:col-4" iconPosition="left">
          <InputIcon>
            <i class="pi pi-search"></i>
          </InputIcon>
          <InputText v-model="filter" placeholder="Search..." />
        </IconField>
      </div>
    </template>
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column
      field="productName"
      header="Nama"
      filterField="product"
      filterMatchMode="startsWith"
      sortable
    >
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <img
            :alt="data.productName"
            :src="data.images?.length ? data.images[0] : ''"
            style="width: 32px"
          />
          <span>{{ data.productName }}</span>
        </div>
      </template>
    </Column>
    <Column
      field="type"
      header="Tipe"
      filterField="type"
      filterMatchMode="contains"
      sortable
    >
    </Column>
    <Column
      field="categoryName"
      header="Kategori"
      filterField="category"
      filterMatchMode="contains"
      sortable
    >
    </Column>
    <Column field="stock" header="Stok" sortable>
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <span>{{ getAmount(data.stock, false) }}</span>
        </div>
      </template>
    </Column>
    <Column
      field="price"
      header="Harga"
      filterField="price"
      filterMatchMode="contains"
      sortable
    >
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <span>{{ getAmount(data.price, true) }}</span>
        </div>
      </template>
    </Column>
    <Column field="sold" header="Terjual" sortable>
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <span>{{ getAmount(data.sold, false) }}</span>
        </div>
      </template>
    </Column>
    <Column field="rating" header="Rating"> </Column>
    <Column field="status_" header="Status" filterField="status"> </Column>
    <Column v-if="showActions" header="Actions">
      <template #body="{ data }">
        <div class="flex flex-wrap">
          <div
            v-if="
              mainStore.userPermissions?.some((perm) => perm === 'product:edit')
            "
            class="flex align-items-center gap-2 mx-1"
          >
            <Button
              label="Edit"
              severity="info"
              style="width: 120px"
              @click="goToProductForm('form', data)"
            ></Button>
          </div>

          <div
            v-if="
              mainStore.userPermissions?.some(
                (perm) => perm === 'product-stock:adjust-stock'
              ) && data.type !== 'bundle'
            "
            class="flex align-items-center gap-2 mx-1"
          >
            <Button
              label="Atur Stock"
              outlined
              style="width: 120px"
              @click="goToProductForm('form-stock', data)"
            ></Button>
          </div>
        </div>
      </template>
    </Column>
  </DataTable>
</template>
