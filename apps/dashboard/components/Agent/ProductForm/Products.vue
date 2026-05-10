<template>
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <Button
          @click="save(selectedProducts ?? [])"
          label="Simpan"
          icon="pi pi-plus"
          severity="success"
          class="mr-2"
          :disabled="!selectedProducts || !selectedProducts.length"
        ></Button>
      </template>
    </Toolbar>

    <Chip
      v-for="(category, i) in categories"
      :key="i"
      :label="category.name"
      class="m-1"
      :class="
        stateData.pagination.idCategory === category.id ? 'bg-green-100' : ''
      "
      @click="filterCategory(category)"
    />

    <DataTable
      :value="stateData.products"
      :loading="isLoading"
      lazy
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      ref="dt"
      dataKey="id"
      :totalRecords="pagination.totalRecord"
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
          class="flex flex-wrap gap-2 align-items-center justify-content-between mt-4"
        >
          <h4 class="m-0">Pilih Produk</h4>
          <IconField class="col-12 sm:col-6 md:col-4" iconPosition="left">
            <InputIcon>
              <i class="pi pi-search"></i>
            </InputIcon>
            <InputText v-model="filterMutation" placeholder="Search..." />
          </IconField>
        </div>
        <p class="text-red-500">
          Silahkan tekan kotak centang pada produk yang ingin Anda simpan
        </p>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column
        field="createdAt"
        header="Created At"
        filterField="id"
        filterMatchMode="startsWith"
        sortable
      ></Column>
      <Column
        field="name"
        header="Nama"
        filterField="product"
        filterMatchMode="startsWith"
        sortable
      >
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <img
              v-if="data.image"
              :alt="data.name"
              :src="data.image"
              style="width: 32px"
            />
            <span>{{ data.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="price" header="Harga">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <span>{{ getAmount(data.price, false) }}</span>
          </div>
        </template>
      </Column>
      <Column field="stock" header="Stok"></Column>
      <Column field="commissions" header="Komisi">
        <template #body="{ data }">
          <div
            v-for="(commission, i) in data.commissions || []"
            :key="i"
            class="flex align-items-center gap-2"
          >
            <span
              >{{ commission.title }}:
              {{
                commission.commissionType === CommissionType.PERCENTAGE
                  ? commission.commission + "%"
                  : getAmount(commission.commission, false)
              }}</span
            >
          </div>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <Button
              label="Atur Komisi"
              style="width: 120px"
              severity="info"
              @click="showCommissionDialog(data)"
            ></Button>
          </div>
        </template>
      </Column>
    </DataTable>

    <CustomDialogUI
      v-model:dialogState="commissionStateDialog.showDialog"
      v-model:productCommissionsState="commissionStateDialog.state"
      header="Atur Komisi"
      :width="40"
      :type="dialogType.form"
      successButtonText="Simpan"
      successButtonColor="success"
      :cancelButtonAction="
        () => {
          commissionStateDialog.showDialog = false;
        }
      "
      :successButtonAction="onSaveTempCommission"
    ></CustomDialogUI>
  </div>
</template>

<script setup lang="ts">
import type {
  DataTableFilterEvent,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primevue/datatable";
import type { Pagination } from "~/pages/agent/product/form.vue";
import {
  CommissionStatus,
  CommissionType,
  ProductFormOrderBy,
  type AgentCommissionProduct,
  type AgentLevel,
  type ProductCategory,
  type SearchProductResult,
} from "~/types/agentData";
import { dialogType } from "~/types/formType";
import type { OrderType } from "~/types/orderData";

export interface ProductFormStateData {
  products: SearchProductResult[];
  pagination: Pagination;
}

export interface CommissionInput {
  idLevelAgent: string;
  commission: number;
  commissionType: CommissionType;
  isActive: boolean;
}

export interface ProductCommissionInput {
  id: string;
  commissions: CommissionInput[];
}

export interface CommissionState {
  idProduct: string;
  productName: string;
  productImage: string;
  commissions: AgentCommissionProduct[];
  selectedOrder: OrderType | null;
}

export interface CommissionDialogState {
  showDialog: boolean;
  isLoading?: boolean;
  state: CommissionState;
}

const props = defineProps<{
  save: (selectedProducts: SearchProductResult[]) => void;
  fetchProducts: () => void;
  isLoading: boolean;
  stateData: ProductFormStateData;
  categories: ProductCategory[];
  agentLevels: AgentLevel[];
  filterCategory: (category: ProductCategory) => void;
  changeStateData: (data: ProductFormStateData) => void;
}>();
const selectedProducts = defineModel<SearchProductResult[]>("selectedProducts");
const selectAll = ref<boolean>(false);
const timeoutStarted = ref<boolean>(false);
const appliedQuery = ref<string>("");

const commissionStateDialog = ref<CommissionDialogState>({
  showDialog: false,
  state: {
    idProduct: "",
    productName: "",
    productImage: "",
    commissions: [],
  },
});

const pagination = computed({
  set(data: Pagination) {
    props.changeStateData({
      ...props.stateData,
      pagination: data,
    });
  },
  get() {
    return props.stateData.pagination;
  },
});

const filterMutation = computed({
  set(val: string) {
    pagination.value.querySearch = val;

    if (!timeoutStarted.value) {
      setTimeout(async () => {
        timeoutStarted.value = false;
        if (pagination.value.querySearch !== appliedQuery.value) {
          pagination.value.page = 1;
          appliedQuery.value = pagination.value.querySearch;
          selectedProducts.value = [];
          props.fetchProducts();
        }
      }, 2000);
    }

    timeoutStarted.value = true;
  },
  get() {
    return pagination.value.querySearch;
  },
});

const onPage = async (event: DataTablePageEvent): Promise<void> => {
  selectedProducts.value = [];
  if (pagination.value) {
    pagination.value.page = event.page;
    pagination.value.isLoading = true;
  }
  props.fetchProducts();
};

const onSort = async (event: DataTableSortEvent): Promise<void> => {
  selectedProducts.value = [];
  if (pagination.value) {
    pagination.value.page = 1;
    if (
      (pagination.value.orderBy === ProductFormOrderBy.product &&
        event.sortField === "name") ||
      (pagination.value.orderBy === ProductFormOrderBy.id &&
        event.sortField === "createdAt")
    ) {
      pagination.value.orderDirection =
        pagination.value.orderDirection === "asc" ? "desc" : "asc";
    } else {
      pagination.value.orderDirection = "asc";
    }
    pagination.value.orderBy =
      event.sortField === "name"
        ? ProductFormOrderBy.product
        : ProductFormOrderBy.id;
    pagination.value.isLoading = true;
  }
  props.fetchProducts();
};

const onFilter = (event: DataTableFilterEvent): void => {
  console.warn(event);
};

const onSelectAllChange = (data: any): void => {
  selectAll.value = data.checked;
  if (selectAll.value) {
    selectedProducts.value = props.stateData.products;
  } else {
    selectedProducts.value = [];
  }
};

const onRowSelect = (data: any): void => {
  if (props.stateData.products.length && selectedProducts.value) {
    selectedProducts.value.push(props.stateData.products[data.index]);
  }
};

const onRowUnselect = (data: any): void => {
  if (props.stateData.products.length && selectedProducts.value) {
    selectedProducts.value.splice(data.index as number, 1);
  }
};

const showCommissionDialog = (data: SearchProductResult): void => {
  let commissions: AgentCommissionProduct[] = props.agentLevels.map((level) => {
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
  });

  const commissionData = (
    JSON.parse(
      JSON.stringify(props.stateData.products)
    ) as SearchProductResult[]
  ).find((product) => product.id === data.id);
  if (commissionData?.commissions) {
    commissions = commissionData.commissions;
  }

  commissionStateDialog.value = {
    showDialog: true,
    state: {
      idProduct: data.id,
      productName: data.name,
      productImage: data.image,
      commissions,
    },
  };
};

const onSaveTempCommission = (): void => {
  props.changeStateData({
    ...props.stateData,
    products: props.stateData.products.map((product) => {
      const commissions =
        product.id === commissionStateDialog.value.state.idProduct
          ? (JSON.parse(
              JSON.stringify(commissionStateDialog.value.state.commissions)
            ) as AgentCommissionProduct[])
          : product.commissions;
      return {
        ...product,
        commissions: commissions?.map((commission) => {
          return {
            ...commission,
            commission: parseFloat(
              (commission.commission + "").replace(",", ".")
            ),
            commissionType:
              commission.commissionTypeDropDown?.id === 1
                ? CommissionType.PERCENTAGE
                : CommissionType.FLAT,
          };
        }),
      };
    }),
  });
  commissionStateDialog.value.showDialog = false;
};
</script>
