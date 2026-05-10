<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType } from "~/types/authData";
import { showCustomToast, getAmount } from "~/utils/utilsFunction";
import type { StockHistoryType } from "~/types/productData";
import type {
  DataTableFilterEvent,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primevue/datatable";
import { useBrandStore } from "~/stores/Brand";
import StockServices from "~/services/StockService";

const toast = useToast();
const brandStore = useBrandStore();

const dataAuth = ref<authType | null>(null);
const isLoading = ref(true);
const tableLoading = ref(false);

const stocks = ref<StockHistoryType[]>([]);
const searchQuery = ref<string>("");
const appliedQuery = ref<string>("");
const offset = ref<number>(0);
const orderBy = ref<string>("");
const orderDirection = ref<string>("");
const limit = ref(10);
const totalRecords = ref(0);

const timeoutStarted = ref(false);

const filterMutation = computed({
  set(val: string) {
    searchQuery.value = val;
    if (!timeoutStarted.value) {
      setTimeout(async () => {
        timeoutStarted.value = false;
        if (searchQuery.value !== appliedQuery.value) {
          offset.value = 0;
          appliedQuery.value = searchQuery.value;
          await getStockHistory();
        }
      }, 600);
    }
    timeoutStarted.value = true;
  },
  get() {
    return searchQuery.value;
  },
});

const getStockHistory = async (): Promise<void> => {
  if (!brandStore.selectedBrand?.id || !dataAuth.value?.token) return;

  isLoading.value = true;
  tableLoading.value = true;

  const response = await StockServices.getStockHistories(dataAuth.value, {
    idBrand: brandStore.selectedBrand.id,
    page: offset.value / limit.value + 1,
    limit: limit.value,
    search: appliedQuery.value,
    orderBy: orderBy.value,
    orderDirection: orderDirection.value,
  });

  isLoading.value = false;
  tableLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.message);
  } else if (response.data) {
    totalRecords.value = response.data.totalRecords;
    stocks.value = response.data.stockHistories;
  }
};

const onPage = async (event: DataTablePageEvent): Promise<void> => {
  offset.value = event.page * limit.value;
  await getStockHistory();
};

const onSort = async (event: DataTableSortEvent): Promise<void> => {
  offset.value = 0;
  orderBy.value = event.sortField as string;
  orderDirection.value = event.sortOrder === 1 ? "asc" : "desc";
  await getStockHistory();
};

const onFilter = (event: DataTableFilterEvent): void => {
  console.warn(event);
};

watch(
  [() => brandStore.selectedBrand, () => dataAuth.value?.token],
  async () => {
    await getStockHistory();
  },
  { immediate: false }
);

onMounted(() => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    dataAuth.value = JSON.parse(dataAuth_);
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
            <h4 class="m-0">Riwayat Stok</h4>
          </template>
          <template #end>
            <IconField class="col-12 sm:col-6 md:col-4" iconPosition="left">
              <InputIcon>
                <i class="pi pi-search"></i>
              </InputIcon>
              <InputText v-model="filterMutation" placeholder="Search..." />
            </IconField>
          </template>
        </Toolbar>

        <DataTable
          :value="stocks"
          :loading="tableLoading"
          lazy
          paginator
          :rows="limit"
          v-model:first="offset"
          :rowsPerPageOptions="[10, 25, 50]"
          :totalRecords="totalRecords"
          dataKey="id"
          @page="onPage"
          @sort="onSort"
          @filter="onFilter"
          tableStyle="min-width: 75rem"
        >
          <!-- Columns -->
          <Column field="date" header="Tanggal" sortable>
            <template #body="{ data }">
              {{ new Date(data.date).toLocaleDateString() }}
            </template>
          </Column>

          <Column field="productName" header="Produk" sortable />

          <Column field="type" header="Tipe" sortable>
            <template #body="{ data }">
              <Tag
                :value="data.type === 'in' ? 'Masuk' : 'Keluar'"
                :severity="data.type === 'in' ? 'success' : 'danger'"
              />
            </template>
          </Column>

          <Column field="subType" header="Sub-Tipe" sortable />

          <Column field="qty" header="Qty" sortable>
            <template #body="{ data }">
              {{ getAmount(data.qty, false) }}
            </template>
          </Column>

          <Column field="usedQty" header="Terpakai" sortable>
            <template #body="{ data }">
              {{ getAmount(data.usedQty, false) }}
            </template>
          </Column>

          <Column field="pricePerUnit" header="Harga/Unit" sortable>
            <template #body="{ data }">
              {{ getAmount(data.pricePerUnit, true) }}
            </template>
          </Column>

          <Column field="reference" header="Referensi" sortable />
          <Column field="notes" header="Catatan" />

          <Column field="expiredDate" header="Kadaluarsa" sortable>
            <template #body="{ data }">
              <span v-if="data.expiredDate">{{
                new Date(data.expiredDate).toLocaleDateString()
              }}</span>
              <span v-else>-</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
