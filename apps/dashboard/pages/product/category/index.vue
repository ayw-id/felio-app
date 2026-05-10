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
import { useBrandStore } from "~/stores/Brand";
import { useMainStore } from "~/stores/main";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const categoryStore = useCategoryStore();
const mainStore = useMainStore();

const dataAuth = ref<authType | null>(null);
const products = ref<productType[]>([]);
const searchQuery = ref<string>("");
const appliedQuery = ref<string>("");
const page = ref<number>(0);
const orderBy = ref<string>("");
const orderDirection = ref<string>("");
const limit = ref<number>(10);
const totalRecords = ref<number>(0);
const selectedCategories = ref<CategoryType[]>([]);
const selectAll = ref<boolean>(false);
const timeoutStarted = ref<boolean>(false);
const deleteCategoriesDialog = ref<boolean>(false);
const brandStore = useBrandStore();

const getCategories = async (): Promise<void> => {
  const body = new FormData();
  body.append("searchQuery", searchQuery.value || "");
  body.append("page", (page.value || 0) + "");
  body.append("limit", (limit.value || 10) + "");
  body.append("orderBy", orderBy.value || "");
  body.append("orderDirection", orderDirection.value || "");
  body.append("idBrand", brandStore.selectedBrand?.id || "");
  await categoryStore.getCategories({
    url: (runtimeConfig.public.sellerApi || "") as string,
    token: dataAuth.value?.token || "",
    toast,
    body,
  });
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
          await getCategories();
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
  await getCategories();
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
  await getCategories();
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
  await getCategories();
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
      await getCategories();
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
    v-if="categoryStore.pageLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <Toolbar
          v-if="
            mainStore.userPermissions?.some(
              (perm) =>
                perm === 'product-category:add' ||
                perm === 'product-category:delete'
            )
          "
          class="mb-4"
        >
          <template #start>
            <Button
              v-if="
                mainStore.userPermissions?.some(
                  (perm) => perm === 'product-category:add'
                )
              "
              @click="goToCategoryForm()"
              label="Tambah Kategori Baru"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
            ></Button>
            <Button
              v-if="
                mainStore.userPermissions?.some(
                  (perm) => perm === 'product-category:delete'
                )
              "
              label="Hapus Kategori"
              icon="pi pi-trash"
              severity="danger"
              @click="deleteCategoriesDialog = true"
              :disabled="!selectedCategories || !selectedCategories.length"
            ></Button>
          </template>
          <!-- <template #end>
              <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
              <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
          </template> -->
        </Toolbar>
        <DataTable
          :value="categoryStore.categories"
          :loading="categoryStore.tableLoading"
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
              <h4 class="m-0">Manage Categories</h4>
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
            field="name"
            header="Name"
            filterField="name"
            filterMatchMode="contains"
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
          <Column
            field="totalProduct"
            header="Total Product"
            filterField="totalProduct"
            filterMatchMode="contains"
            sortable
          >
          </Column>
          <Column
            field="isActive"
            header="Status"
            filterField="isActive"
            filterMatchMode="contains"
          >
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <span>{{ data.isActive ? "Active" : "Not Active" }}</span>
              </div>
            </template>
          </Column>
          <Column header="Actions">
            <template #body="{ data }">
              <div
                v-if="
                  mainStore.userPermissions?.some(
                    (perm) => perm === 'product-category:edit'
                  )
                "
                class="flex align-items-center gap-2"
              >
                <Button
                  label="Edit"
                  raised
                  severity="info"
                  class="w-full"
                  @click="goToCategoryForm(data)"
                ></Button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  <CustomDialogUI
    v-model:dialogState="deleteCategoriesDialog"
    header="Hapus Produk"
    :width="25"
    :type="dialogType.confirm"
    description="Anda yakin ingin menghapus produk"
    cancelButtonText="Tidak"
    :cancelButtonAction="() => (deleteCategoriesDialog = false)"
    successButtonText="Ya"
    successButtonColor="danger"
    :successButtonAction="() => deleteCategories()"
  ></CustomDialogUI>
  <Toast />
</template>
