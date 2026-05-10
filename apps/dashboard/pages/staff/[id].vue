<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { apiRequest } from "~/services/APIService";
import type {
  EmployeeDetail,
  RoleMaster,
  roleFormType,
  AvailablePermissionGroup,
  PermissionType,
  RolePermissionMaster,
} from "~/types/employeeData";
import type {
  fetchDataType,
  FetchEmployeeDetailResponse,
  FetchRoles,
} from "~/types/fetchData";
import { useBrandStore } from "~/stores/Brand";
import { showCustomToast } from "~/utils/utilsFunction";
import { dialogType, formType } from "~/types/formType";
import type { authType } from "~/types/authData";

const route = useRoute();
const toast = useToast();
const dataAuth = ref<authType | null>(null);
const brandStore = useBrandStore();
const employee = ref<EmployeeDetail | null>(null);
const availablePermissions = ref<AvailablePermissionGroup[]>([]);
// Track selected predefined role
const selectedRole = ref<RoleMaster | null>(null);
const predefinedRoles = ref<RoleMaster[]>([]);
const showResetButton = ref<boolean>(false);
const selectedBrands = ref<string[]>([]);

const runtimeConfig = useRuntimeConfig();
const isLoading = ref<boolean>(true);
const roleFormDialogState = ref<boolean>(false);
const dialogLoadingState = ref<boolean>(false);

const newRole = ref<roleFormType>({
  roleName: "",
});

const haveDifferentPermission = (): boolean => {
  const set1 = new Set(
    selectedRole.value?.permissions?.map((p) => p.permissionName)
  );
  const set2 = new Set(
    selectedRole.value?.originalPermissions?.map((p) => p.permissionName)
  );

  if (set1.size !== set2.size) return true;

  for (const perm of set1) {
    if (!set2.has(perm)) return true;
  }

  return false; // means they are the same
};

// fetch employee detail
const fetchEmployeeDetail = async (): Promise<void> => {
  const id = route.params.id as string;
  if (!id) return;

  const body = new FormData();
  body.append("idEmployee", id);
  body.append("idBrand", brandStore.selectedBrand?.id as string);
  body.append(
    "idBrands",
    JSON.stringify(brandStore.brands?.map((brand) => brand.id))
  );

  const response = await apiRequest<FetchEmployeeDetailResponse>(
    `${useRuntimeConfig().public.sellerApi}employee/detail`,
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
    employee.value = response.data.employee;
    selectedBrands.value = response.data.employee.brands.map(
      (brand) => brand.idBrand
    );
  }

  await fetchRoles();
};

// fetch role master + available permissions
const fetchRoles = async (): Promise<void> => {
  const body = new FormData();
  if (employee.value?.role?.idRoleMaster) {
    body.append("idRoleMaster", employee.value.role.idRoleMaster as string);
  }

  const res = await apiRequest<FetchRoles>(
    `${runtimeConfig.public.sellerApi}employee/getRoles`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${dataAuth.value?.token}` },
      body,
    }
  );

  if (!res.success) {
    showCustomToast(toast, res.msg);
  } else if (res.data) {
    availablePermissions.value = res.data.availablePermissions;
    predefinedRoles.value = res.data.predefinedRoles;
  }

  // If employee already has a role, preselect it
  const roleMaster = predefinedRoles.value?.find(
    (role) => role.idRoleMaster === employee.value?.role?.idRoleMaster
  );
  if (roleMaster) {
    selectedRole.value = {
      ...roleMaster,
      permissions: (employee.value?.role?.permissions || []).map((perm) => {
        return {
          permissionName: perm,
        };
      }),
      originalPermissions: roleMaster.permissions,
    };

    if (haveDifferentPermission()) {
      showResetButton.value = true;
    }
  }
};

const resetPermission = (): void => {
  if (selectedRole.value) {
    if (!selectedRole.value.originalPermissions?.length) {
      selectedRole.value.permissions = [];
    } else {
      selectedRole.value.permissions = JSON.parse(
        JSON.stringify(selectedRole.value.originalPermissions)
      );
    }
  }

  showResetButton.value = false;
};

const assignBrands = async (): Promise<void> => {
  if (!selectedBrands.value.length) {
    showCustomToast(toast, "Silahkan pilih brand");
    return;
  }
  isLoading.value = true;

  const id = route.params.id as string;
  if (!id) return;

  const body = new FormData();
  body.append("idEmployee", id);
  body.append("idBrands", JSON.stringify(selectedBrands.value));

  const res = await apiRequest<fetchDataType>(
    `${runtimeConfig.public.sellerApi}employee/assignBrands`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${dataAuth.value?.token}` },
      body,
    }
  );

  isLoading.value = false;

  if (res.success) {
    showCustomToast(toast, "Simpan brand berhasil", true);
  } else {
    showCustomToast(toast, res.msg);
  }
};

const assignPermissions = async (): Promise<void> => {
  if (!selectedRole.value?.permissions.length) {
    showCustomToast(toast, "Silahkan pilih hak akses");
    return;
  }
  isLoading.value = true;

  const id = route.params.id as string;
  if (!id) return;

  const body = new FormData();
  body.append("idEmployee", id);
  body.append("idBrand", brandStore.selectedBrand?.id as string);
  body.append(
    "role",
    JSON.stringify({
      ...selectedRole.value,
      permissions: selectedRole.value.permissions.map(
        (permission) => permission.permissionName
      ),
    })
  );

  const res = await apiRequest<fetchDataType>(
    `${runtimeConfig.public.sellerApi}employee/assignPermissions`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${dataAuth.value?.token}` },
      body,
    }
  );

  isLoading.value = false;

  if (res.success) {
    showCustomToast(toast, "Simpan hak akses berhasil", true);
    showResetButton.value = false;
  } else {
    showCustomToast(toast, res.msg);
  }
};

watch(
  [
    () => brandStore.selectedBrand,
    () => brandStore.brands,
    () => dataAuth.value?.token,
  ],
  async ([brand, brands, token]) => {
    if (brand && brands.length && token) {
      await fetchEmployeeDetail();
    }
  },
  { immediate: false }
);

onMounted(() => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    dataAuth.value = JSON.parse(dataAuth_);
  }
});

const toggleBrand = (idBrand: string): void => {
  if (selectedBrands.value.some((brand) => brand === idBrand)) {
    selectedBrands.value = selectedBrands.value.filter(
      (brand) => brand !== idBrand
    );
  } else {
    selectedBrands.value.push(idBrand);
  }
};

const togglePermission = (groupType: PermissionType, perm: string): void => {
  const [title, action] = perm.split(":");

  if (selectedRole.value) {
    // current permissions for this title
    const currentPerms = selectedRole.value.permissions.filter((p) =>
      p.permissionName.startsWith(title + ":")
    );

    if (action === "view") {
      // user clicked view directly
      if (currentPerms?.some((p) => p.permissionName === perm)) {
        // remove only if no other actions exist
        const hasOther = currentPerms.some(
          (p) => !p.permissionName.endsWith(":view")
        );
        if (!hasOther) {
          selectedRole.value.permissions =
            selectedRole.value.permissions.filter(
              (p) => p.permissionName !== perm
            );
        }
      } else {
        selectedRole.value.permissions.push({
          idRolePermissionMaster: "",
          permissionName: perm,
          type: groupType,
        });
      }
    } else {
      // clicked add/edit/etc.
      if (currentPerms.some((p) => p.permissionName === perm)) {
        // remove action
        selectedRole.value.permissions = selectedRole.value.permissions.filter(
          (p) => p.permissionName !== perm
        );

        // if no other actions left, keep view optional
        const stillHasOther = selectedRole.value.permissions.some(
          (p) =>
            p.permissionName.startsWith(title + ":") &&
            !p.permissionName.endsWith(":view")
        );
        if (!stillHasOther) {
          // allow view to be unchecked later (don’t auto-remove it)
        }
      } else {
        // add action
        selectedRole.value.permissions.push({
          idRolePermissionMaster: "",
          permissionName: perm,
          type: groupType,
        });

        // ensure view exists
        if (
          !selectedRole.value.permissions.some(
            (p) => p.permissionName === `${title}:view`
          )
        ) {
          selectedRole.value.permissions.push({
            idRolePermissionMaster: "",
            permissionName: `${title}:view`,
            type: groupType,
          });
        }
      }
    }
  }

  showResetButton.value = haveDifferentPermission();
};

const selectedRoleMutation = computed({
  set(data: any) {
    if (data.id === 0) {
      showRoleForm();
    } else {
      const roleMaster = predefinedRoles.value.find(
        (role) => role.idRoleMaster === data.id
      );
      selectedRole.value = roleMaster ?? null;
      showResetButton.value = false;
    }
  },
  get() {
    if (!predefinedRoles.value.length) {
      return null;
    }

    const roleMaster = predefinedRoles.value.find(
      (role) => role.idRoleMaster === selectedRole.value?.idRoleMaster
    );

    if (!roleMaster) {
      return null;
    }

    return {
      id: roleMaster.idRoleMaster,
      name: roleMaster.roleName,
    };
  },
});

const showRoleForm = (): void => {
  roleFormDialogState.value = true;
};

const addRole = (): void => {
  selectedRole.value = {
    idRoleMaster: "",
    roleName: newRole.value.roleName,
    permissions: [],
  };

  predefinedRoles.value.push(selectedRole.value);
  roleFormDialogState.value = false;
  showResetButton.value = false;
};

const togglePermissionGroup = (
  groupType: PermissionType,
  title: string,
  actions: string[]
): void => {
  // build full permissions under this title
  const perms = actions.map((action) => `${title}:${action}`);

  if (selectedRole.value) {
    const allChecked = perms.every((perm) =>
      selectedRole.value?.permissions.some((p) => p.permissionName === perm)
    );

    if (allChecked) {
      // remove all
      selectedRole.value.permissions = selectedRole.value.permissions.filter(
        (p: RolePermissionMaster) => !perms.includes(p.permissionName as string)
      );
    } else {
      // add missing
      perms.forEach((perm) => {
        if (
          selectedRole.value &&
          !selectedRole.value.permissions.some((p) => p.permissionName === perm)
        ) {
          selectedRole.value.permissions.push({
            idRolePermissionMaster: "",
            permissionName: perm,
            type: groupType,
          });
        }
      });
    }
  }

  showResetButton.value = haveDifferentPermission();
};

const togglePermissionType = (
  groupType: PermissionType,
  groupPermissions: Array<{ title: string; actions: string[] }>
): void => {
  // flatten all actions under this group type
  const perms = groupPermissions.flatMap((perm) =>
    perm.actions.map((action) => `${perm.title}:${action}`)
  );

  if (selectedRole.value) {
    const allChecked = perms.every((perm) =>
      selectedRole.value?.permissions.some((p) => p.permissionName === perm)
    );

    if (allChecked) {
      // remove all
      selectedRole.value.permissions = selectedRole.value.permissions.filter(
        (p) => !perms.includes(p.permissionName as string)
      );
    } else {
      // add missing
      perms.forEach((perm) => {
        if (
          selectedRole.value &&
          !selectedRole.value.permissions.some((p) => p.permissionName === perm)
        ) {
          selectedRole.value.permissions.push({
            idRolePermissionMaster: "",
            permissionName: perm,
            type: groupType,
          });
        }
      });
    }
  }

  showResetButton.value = haveDifferentPermission();
};
</script>

<template>
  <div v-if="employee" class="grid p-fluid mt-0">
    <div class="col-12">
      <div id="productDetail" class="card mx-0">
        <h2 class="text-xl font-bold mb-2">{{ employee.name }}</h2>
        <p class="text-gray-600 mb-0">{{ employee.email }}</p>
        <p class="text-gray-600">{{ employee.phone }}</p>

        <h3 class="capitalize font-semibold mt-6">Brand</h3>
        <div class="mt-4">
          <div class="flex flex-wrap gap-4 mb-4">
            <label
              v-for="brand in brandStore.brands"
              :key="brand.id"
              class="flex items-center space-x-2"
            >
              <input
                type="checkbox"
                :value="`${brand.id}`"
                :checked="selectedBrands.some((b) => b === brand.id)"
                @change="toggleBrand(brand.id)"
              />
              <span>{{ brand.name }}</span>
            </label>
          </div>
        </div>

        <Button
          label="Simpan Perubahan Brand"
          :disabled="isLoading"
          size="small"
          class="mt-4 w-4"
          severity="info"
          @click="assignBrands()"
        />

        <h3 class="capitalize font-semibold mt-6">Hak Akses</h3>

        <!-- Predefined Role Dropdown -->
        <div class="my-4 w-4">
          <CustomForm
            :type="formType.dropdown"
            id="category"
            placeholder="Pilih Role"
            label="Role"
            v-model:modelData="selectedRoleMutation"
            :dropdownOptions="[
              {
                id: 0,
                name: 'Tambah Role',
              },
              ...(predefinedRoles || []).map((role) => {
                return {
                  id: role.idRoleMaster,
                  name: role.roleName,
                };
              }),
            ]"
          ></CustomForm>
          <Button
            v-if="showResetButton"
            label="Reset"
            :disabled="isLoading"
            size="small"
            class="w-4"
            style="backgroundcolor: black"
            severity="default"
            @click="resetPermission()"
          />
        </div>

        <div
          v-for="group in selectedRole ? availablePermissions : []"
          :key="group.type"
          class="mt-4"
        >
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              :checked="
                group.permissions.every((perm) =>
                  perm.actions.every((action) =>
                    selectedRole?.permissions.some(
                      (p) => p.permissionName === `${perm.title}:${action}`
                    )
                  )
                )
              "
              @change="togglePermissionType(group.type, group.permissions)"
            />
            <h4 class="text-lg font-semibold" style="margin-top: 12px">
              {{ group.type }}
            </h4>
          </div>

          <div v-for="perm in group.permissions" :key="perm.title" class="ml-4">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="
                  perm.actions.every((action) =>
                    selectedRole?.permissions.some(
                      (p) => p.permissionName === `${perm.title}:${action}`
                    )
                  )
                "
                @change="
                  togglePermissionGroup(group.type, perm.title, perm.actions)
                "
              />
              <p class="font-medium mb-2" style="margin-top: 6px">
                <b>{{ perm.title }}</b>
              </p>
            </div>

            <div class="flex flex-wrap gap-4 mb-4 ml-4">
              <label
                v-for="action in perm.actions"
                :key="action"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="`${perm.title}:${action}`"
                  :checked="
                    selectedRole?.permissions.some(
                      (permission) =>
                        permission.permissionName === `${perm.title}:${action}`
                    )
                  "
                  :disabled="
                    action === 'view' &&
                    selectedRole?.permissions.some(
                      (p) =>
                        p.permissionName.startsWith(`${perm.title}:`) &&
                        !p.permissionName.endsWith(':view')
                    )
                  "
                  @change="
                    togglePermission(group.type, `${perm.title}:${action}`)
                  "
                />
                <span>{{ action }}</span>
              </label>
            </div>
          </div>
        </div>

        <Button
          v-if="selectedRole"
          label="Simpan Perubahan Hak Akses"
          :disabled="isLoading"
          size="small"
          class="mt-4 w-4"
          severity="info"
          @click="assignPermissions()"
        ></Button>
      </div>
    </div>
  </div>
  <CustomDialogUI
    v-model:dialogState="roleFormDialogState"
    header="Role Baru"
    :width="48"
    :type="dialogType.form"
    :cancelButtonAction="() => (roleFormDialogState = false)"
    :successButtonAction="addRole"
    v-model:roleInputState="newRole"
    :isLoading="dialogLoadingState"
  ></CustomDialogUI>

  <Toast />
</template>
