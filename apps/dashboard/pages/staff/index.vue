<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType } from "~/types/authData";
import { showCustomToast } from "~/utils/utilsFunction";
import type { FetchEmployeesResponse, fetchDataType } from "~/types/fetchData";
import type { EmployeeListItem, EmployeeInputType } from "~/types/employeeData";
import { useBrandStore } from "~/stores/Brand";
import { apiRequest } from "~/services/APIService";
import { useMainStore } from "~/stores/main";
import { dialogType } from "~/types/formType";

const initEmployeeData: EmployeeInputType = {
  id: "",
  email: "",
  name: "",
  address: "",
  phone: "",
};

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const router = useRouter();
const brandStore = useBrandStore();
const mainStore = useMainStore();

const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(true);
const tableLoading = ref<boolean>(false);
const employees = ref<EmployeeListItem[]>([]);
const searchQuery = ref<string>("");
const appliedQuery = ref<string>(""); // used for debounce
const timeoutStarted = ref<boolean>(false);
const dialogLoadingState = ref<boolean>(false);

// employee form
const addEmployeeDialogState = ref<boolean>(false);
const employeeInputState = ref<EmployeeInputType>(initEmployeeData);

const limit = ref<number>(10);
const offset = ref<number>(0);
const totalRecords = ref<number>(0);

const filterMutation = computed({
  set(val: string) {
    searchQuery.value = val;
    if (!timeoutStarted.value) {
      setTimeout(async () => {
        timeoutStarted.value = false;
        if (searchQuery.value !== appliedQuery.value) {
          offset.value = 0;
          appliedQuery.value = searchQuery.value;
          await getEmployees();
        }
      }, 500); // shorter debounce (500ms feels better for search)
    }
    timeoutStarted.value = true;
  },
  get() {
    return searchQuery.value;
  },
});

const getEmployees = async (): Promise<void> => {
  if (!brandStore.selectedBrand?.id || !dataAuth.value?.token) return;

  isLoading.value = true;
  tableLoading.value = true;

  const body = new FormData();
  body.append("idBrand", brandStore.selectedBrand?.id as string);
  body.append("searchQuery", appliedQuery.value as string);

  const response = await apiRequest<FetchEmployeesResponse>(
    `${runtimeConfig.public.sellerApi}employee`,
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
    employees.value = response.data.employees || [];
    // totalRecords.value = response.data.total || employees.value.length;
  }
};

const editEmployee = (employee: any): void => {
  router.push(`/staff/${employee.id}`);
};

const deleteEmployee = (employee: any): void => {
  console.log("Delete employee", employee);
  // open confirm dialog then call delete API
};

const saveEmployee = async (): Promise<void> => {
  dialogLoadingState.value = true;

  const body = new FormData();
  body.append("idBrand", brandStore.selectedBrand?.id as string);
  body.append("email", employeeInputState.value.email as string);
  body.append("name", employeeInputState.value.name as string);
  body.append("address", employeeInputState.value.address as string);
  body.append("phone", employeeInputState.value.phone as string);

  const response = await apiRequest<fetchDataType>(
    `${runtimeConfig.public.sellerApi}employee/save`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  dialogLoadingState.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else {
    addEmployeeDialogState.value = false;
    await getEmployees();
  }
};

const showEmployeeForm = (): void => {
  employeeInputState.value = initEmployeeData;
  addEmployeeDialogState.value = true;
};

// Refresh employees when brand or token changes
watch(
  [() => brandStore.selectedBrand, () => dataAuth.value?.token],
  async ([brand, token]) => {
    if (brand?.id && token) await getEmployees();
  },
  { immediate: false }
);

// Load auth token on mount
onMounted(() => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) dataAuth.value = JSON.parse(dataAuth_);
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
        <Toolbar
          v-if="
            mainStore.userPermissions?.some(
              (perm) => perm === 'employee-data:add'
            )
          "
          class="mb-4"
        >
          <template #start>
            <Button
              @click="showEmployeeForm()"
              label="Tambah Karyawan Baru"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
            ></Button>
          </template>
        </Toolbar>
        <DataTable
          :value="employees"
          :loading="tableLoading"
          lazy
          paginator
          :rows="limit"
          v-model:first="offset"
          :rowsPerPageOptions="[10, 25, 50]"
          dataKey="id"
          :totalRecords="totalRecords"
          tableStyle="min-width: 75rem"
        >
          <template #header>
            <div
              class="flex flex-wrap gap-2 align-items-center justify-content-between"
            >
              <h4 class="m-0">Daftar Karyawan</h4>
              <IconField class="col-12 sm:col-6 md:col-4" iconPosition="left">
                <InputIcon>
                  <i class="pi pi-search"></i>
                </InputIcon>
                <InputText
                  v-model="filterMutation"
                  placeholder="Cari karyawan..."
                />
              </IconField>
            </div>
          </template>

          <!-- Employee Columns -->
          <Column field="name" header="Nama" sortable></Column>
          <Column field="email" header="Email" sortable></Column>
          <Column field="phone" header="Telepon"></Column>
          <Column field="address" header="Alamat"></Column>
          <Column
            field="createdAt"
            header="Tanggal Bergabung"
            sortable
          ></Column>

          <Column field="role.roleName" header="Role">
            <template #body="{ data }">
              <span>{{ data.role?.roleName }}</span>
            </template>
          </Column>

          <!-- <Column header="Brands">
            <template #body="{ data }">
              <ul class="m-0 p-0" style="list-style: none">
                <li v-for="brand in data.brands" :key="brand.idBrand">
                  <Tag severity="info" :value="brand.name" class="mr-1 mb-1" />
                </li>
              </ul>
            </template>
          </Column> -->

          <!-- Actions -->
          <Column header="Actions">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  size="small"
                  severity="info"
                  @click="editEmployee(data)"
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  size="small"
                  severity="danger"
                  @click="deleteEmployee(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  <CustomDialogUI
    v-model:dialogState="addEmployeeDialogState"
    :header="`Tambah Pegawai`"
    :width="48"
    :type="dialogType.form"
    :cancelButtonAction="() => (addEmployeeDialogState = false)"
    :successButtonAction="saveEmployee"
    v-model:employee-input-state="employeeInputState"
    :isLoading="dialogLoadingState"
  ></CustomDialogUI>
  <Toast />
</template>
