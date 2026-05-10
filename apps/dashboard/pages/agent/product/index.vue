<template>
  <div v-if="dataAuth" class="grid p-fluid">
    <div
      v-if="isLoading"
      class="text-center"
      style="height: 400px; align-content: center"
    >
      <ProgressSpinner />
    </div>
    <div v-if="!isLoading" class="col-12">
      <div class="card">
        <Toolbar
          v-if="
            mainStore.userPermissions?.some(
              (perm) =>
                perm === 'agent-product:add' || perm === 'agent-product:delete'
            )
          "
          class="mb-4"
        >
          <template #start>
            <Button
              v-if="
                mainStore.userPermissions?.some(
                  (perm) => perm === 'agent-product:add'
                )
              "
              @click="openForm()"
              label="Tambah"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
            ></Button>
            <Button
              v-if="
                mainStore.userPermissions?.some(
                  (perm) => perm === 'agent-product:delete'
                )
              "
              label="Hapus"
              icon="pi pi-trash"
              severity="danger"
              @click="openDeleteDialog(selectedProducts)"
              :disabled="!selectedProducts || !selectedProducts.length"
            ></Button>
          </template>
        </Toolbar>
        <DataTable
          :value="
            agentProducts.map((product, index) => ({
              ...product,
              id: index,
            }))
          "
          :loading="isLoading"
          lazy
          paginator
          :rows="pagination.limit"
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
              class="flex flex-wrap gap-2 align-items-center justify-content-between"
            >
              <h4 class="m-0">Atur Komisi Produk</h4>
              <IconField class="col-12 sm:col-6 md:col-4" iconPosition="left">
                <InputIcon>
                  <i class="pi pi-search"></i>
                </InputIcon>
                <InputText v-model="filterMutation" placeholder="Search..." />
              </IconField>
            </div>
          </template>
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column
            field="dateAdded"
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
                  v-if="data.imageThumb"
                  :alt="data.name"
                  :src="data.imageThumb"
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
          <Column field="commissions" header="Komisi">
            <template #body="{ data }">
              <div
                v-for="(commission, i) in data.commissions.filter((commission: AgentCommissionProduct) => commission.status === CommissionStatus.ACTIVE)"
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
                  v-if="
                    mainStore.userPermissions?.some(
                      (perm) => perm === 'agent-product:edit'
                    )
                  "
                  label="Atur Komisi"
                  style="width: 120px"
                  severity="info"
                  @click="showUpdateCommissionDialog(data)"
                ></Button>
                <Button
                  v-if="
                    mainStore.userPermissions?.some(
                      (perm) => perm === 'agent-product:delete'
                    )
                  "
                  icon="pi pi-trash"
                  severity="danger"
                  @click="openDeleteDialog([data])"
                ></Button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  <CustomDialogUI
    v-model:dialogState="commissionStateDialog.showDialog"
    v-model:productCommissionsState="commissionStateDialog.state"
    header="Atur Komisi"
    :width="40"
    :type="dialogType.form"
    :isLoading="commissionStateDialog.isLoading"
    successButtonText="Simpan"
    successButtonColor="success"
    :cancelButtonAction="
      () => {
        commissionStateDialog.showDialog = false;
      }
    "
    :successButtonAction="onSaveCommission"
  ></CustomDialogUI>

  <CustomDialogUI
    v-model:dialogState="deleteDialog.showDialog"
    header="Anda Yakin Ingin Menghapus Produk Ini ?"
    :width="40"
    :type="dialogType.confirm"
    :isLoading="deleteDialog.isLoading"
    successButtonText="Hapus"
    successButtonColor="danger"
    :cancelButtonAction="
      () => {
        deleteDialog.showDialog = false;
      }
    "
    :successButtonAction="onDeleteProducts"
  ></CustomDialogUI>

  <Toast />
</template>

<script setup lang="ts">
import type {
  DataTableFilterEvent,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primevue/datatable";
import { ref, onMounted } from "vue";
import type {
  CommissionDialogState,
  ProductCommissionInput,
} from "~/components/Agent/ProductForm/Products.vue";
import {
  type AgentLevel,
  CommissionStatus,
  CommissionType,
  type AgentCommissionProduct,
  type AgentProductType,
} from "~/types/agentData";
import type { authType } from "~/types/authData";
import type {
  FetchAgentProductAndCategory,
  fetchDataType,
} from "~/types/fetchData";
import { dialogType } from "~/types/formType";
import { apiRequest } from "~/services/APIService";
import { useBrandStore } from "~/stores/Brand";
import { useMainStore } from "~/stores/main";

enum OrderBy {
  id = "id",
  product = "product",
  category = "category",
}

const toast = useToast();
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const brandStore = useBrandStore();
const mainStore = useMainStore();

const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(true);
const pagination = ref<{
  isLoading: boolean;
  limit: number;
  page: number;
  querySearch: string;
  orderBy: OrderBy;
  orderDirection: "asc" | "desc";
  idCategory: string;
  totalRecord: number;
}>({
  isLoading: false,
  limit: 10,
  page: 1,
  querySearch: "",
  orderBy: OrderBy.id,
  orderDirection: "desc",
  idCategory: "",
  totalRecord: 0,
});
const selectAll = ref<boolean>(false);
const agentProducts = ref<AgentProductType[]>([]);
const selectedProducts = ref<AgentProductType[]>([]);
const timeoutStarted = ref<boolean>(false);
const appliedQuery = ref<string>("");
const agentLevels = ref<AgentLevel[]>([]);
const commissionStateDialog = ref<CommissionDialogState>({
  showDialog: false,
  isLoading: false,
  state: {
    idProduct: "",
    productName: "",
    productImage: "",
    commissions: [],
  },
});

const deleteDialog = ref<{
  showDialog: boolean;
  isLoading: boolean;
  idProducts: string[];
}>({
  showDialog: false,
  isLoading: false,
  idProducts: [],
});

const openForm = (): void => {
  router.push("/agent/product/form");
};

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
          await fetchProducts();
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
  pagination.value.page = event.page;
  pagination.value.isLoading = true;
  await fetchProducts();
};

const onSort = async (event: DataTableSortEvent): Promise<void> => {
  selectedProducts.value = [];
  pagination.value.page = 1;
  console.warn("event.sortField", event.sortField);
  if (
    (pagination.value.orderBy === OrderBy.id &&
      event.sortField === "dateAdded") ||
    (pagination.value.orderBy === OrderBy.product && event.sortField === "name")
  ) {
    pagination.value.orderDirection =
      pagination.value.orderDirection === "asc" ? "desc" : "asc";
  } else {
    pagination.value.orderDirection = "asc";
  }
  pagination.value.orderBy =
    event.sortField === "name" ? OrderBy.product : OrderBy.id;
  pagination.value.orderDirection = event.sortOrder === 1 ? "asc" : "desc";
  pagination.value.isLoading = true;
  await fetchProducts();
};

const onFilter = (event: DataTableFilterEvent): void => {
  console.warn(event);
};

const onSelectAllChange = (data: any): void => {
  selectAll.value = data.checked;
  if (selectAll.value) {
    selectedProducts.value = agentProducts.value.map((product, index) => ({
      ...product,
      id: index,
    }));
  } else {
    selectedProducts.value = [];
  }
};

const onRowSelect = (data: any): void => {
  if (agentProducts.value?.length) {
    selectedProducts.value.push(agentProducts.value[data.index]);
  }
};

const onRowUnselect = (data: any): void => {
  if (agentProducts.value?.length) {
    selectedProducts.value.splice(data.index, 1);
  }
};

const showUpdateCommissionDialog = async (
  product: AgentProductType
): Promise<void> => {
  const commissions: AgentCommissionProduct[] = agentLevels.value.map(
    (level) => {
      const commission = product.commissions.find(
        (commission) => commission.id === level.id
      );
      const commissionType = commission
        ? commission.commissionType
        : CommissionType.PERCENTAGE;
      return {
        id: level.id,
        commission: commission ? commission.commission : 0,
        commissionType,
        commissionTypeDropDown:
          commissionType === CommissionType.PERCENTAGE
            ? {
                id: 1,
                name: "Persentase",
              }
            : {
                id: 2,
                name: "Flat",
              },
        title: level.title,
        status: commission ? commission.status : CommissionStatus.NOT_ACTIVE,
      };
    }
  );

  commissionStateDialog.value = {
    showDialog: true,
    state: {
      idProduct: product.idProduct,
      productName: product.name,
      productImage: product.thumbImage,
      commissions,
    },
  };
};

const openDeleteDialog = (data: AgentProductType[]): void => {
  deleteDialog.value = {
    showDialog: true,
    isLoading: false,
    idProducts: data.map((d) => d.idProduct),
  };
};

const onDeleteProducts = async (): Promise<void> => {
  deleteDialog.value.isLoading = true;
  const body = new FormData();
  body.append("products", JSON.stringify(deleteDialog.value.idProducts));
  body.append("idBrand", brandStore.selectedBrand?.id as string);

  const response = await apiRequest<fetchDataType>(
    `${runtimeConfig.public.agentMerchantApi}product/deleteProducts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  deleteDialog.value.isLoading = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else {
    const newProducts: AgentProductType[] = [];
    agentProducts.value.forEach((product) => {
      if (
        !deleteDialog.value.idProducts.some(
          (idProduct) => idProduct === product.idProduct
        )
      ) {
        newProducts.push(product);
      }
    });
    agentProducts.value = JSON.parse(JSON.stringify(newProducts));
    selectedProducts.value = [];
    selectAll.value = false;
    deleteDialog.value = {
      showDialog: false,
      isLoading: false,
      idProducts: [],
    };
    await fetchProducts();
  }
};

const onSaveCommission = async (): Promise<void> => {
  // sanitize data
  commissionStateDialog.value.state.commissions =
    commissionStateDialog.value.state.commissions.map((commission) => {
      const commissionAmount = parseFloat(
        (commission.commission + "").replace(",", ".")
      );
      return {
        ...commission,
        commission: commissionAmount,
        commissionType:
          commission.commissionTypeDropDown?.id === 1
            ? CommissionType.PERCENTAGE
            : CommissionType.FLAT,
        isActive: commissionAmount > 0,
      };
    });

  const productsInput: ProductCommissionInput = {
    id: commissionStateDialog.value.state.idProduct,
    commissions: commissionStateDialog.value.state.commissions.map(
      (commission) => {
        return {
          idLevelAgent: commission.id,
          commission: commission.commission,
          commissionType: commission.commissionType,
          isActive: commission.commission > 0,
        };
      }
    ),
  };

  commissionStateDialog.value.isLoading = true;
  const body = new FormData();
  body.append("products", JSON.stringify([productsInput]));
  body.append("idBrand", brandStore.selectedBrand?.id as string);

  const response = await apiRequest<fetchDataType>(
    `${runtimeConfig.public.agentMerchantApi}product/saveProducts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  commissionStateDialog.value.isLoading = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else {
    const index = agentProducts.value.findIndex(
      (product) =>
        product.idProduct === commissionStateDialog.value.state.idProduct
    );
    if (index >= 0) {
      agentProducts.value[index].commissions =
        commissionStateDialog.value.state.commissions.map((commission) => {
          return {
            ...commission,
            status:
              commission.commission > 0
                ? CommissionStatus.ACTIVE
                : CommissionStatus.NOT_ACTIVE,
          };
        });
    }
    commissionStateDialog.value.showDialog = false;
  }
};

const fetchProducts = async (): Promise<void> => {
  const body = new FormData();
  body.append("limit", pagination.value.limit + "");
  body.append("page", pagination.value.page + "");
  body.append("querySearch", pagination.value.querySearch + "");
  body.append("orderBy", pagination.value.orderBy + "");
  body.append("orderDirection", pagination.value.orderDirection + "");
  body.append("idCategory", pagination.value.idCategory + "");
  body.append("idBrand", brandStore.selectedBrand?.id as string);

  const response = await apiRequest<FetchAgentProductAndCategory>(
    `${runtimeConfig.public.agentMerchantApi}product`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  isLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else if (response.data) {
    agentProducts.value = response.data.products;
    agentLevels.value = response.data.agentLevels;
    pagination.value.totalRecord = response.data.totalProduct;
  }
};

watch(
  [() => brandStore.selectedBrand, () => dataAuth.value?.token],
  async (newBrand) => {
    if (newBrand && dataAuth.value?.token) {
      await fetchProducts();
    }
  },
  { immediate: false }
);

onMounted(async () => {
  const auth = getAuthData();

  if (auth) {
    dataAuth.value = auth;
  } else {
    window.location.href = runtimeConfig.public.baseUrl + "auth/login";
  }
});
</script>
