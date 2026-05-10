<template>
  <Toolbar
    v-if="mainStore.userPermissions?.some((perm) => perm === 'agent-level:add')"
    class="mb-4"
  >
    <template #start>
      <Button
        @click="openForm()"
        label="Tambah Level Agen"
        icon="pi pi-plus"
        severity="success"
        class="mr-2"
      ></Button>
    </template>
  </Toolbar>
  <DataTable
    :value="stateData.agentLevels"
    :loading="isLoading"
    lazy
    ref="dt"
    dataKey="id"
    tableStyle="min-width: 75rem"
  >
    <template #header>
      <div
        class="flex flex-wrap gap-2 align-items-center justify-content-between"
      >
        <h4 class="m-0">Atur Level Agen</h4>
      </div>
    </template>
    <Column field="title" header="Title" />
    <Column field="commission" header="Commission (%)" />
    <Column field="status" header="Status" />
    <Column header="Actions">
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <Button
            v-if="
              mainStore.userPermissions?.some(
                (perm) => perm === 'agent-level:edit'
              )
            "
            icon="pi pi-pencil"
            severity="info"
            @click="openForm(data)"
          ></Button>
          <Button
            v-if="
              mainStore.userPermissions?.some(
                (perm) => perm === 'agent-level:delete'
              )
            "
            icon="pi pi-trash"
            severity="danger"
            @click="openDeleteForm(data)"
          ></Button>
        </div>
      </template>
    </Column>
  </DataTable>
  <CustomDialogUI
    v-model:dialogState="agentLevelState.showDialog"
    v-model:agentLevelState="agentLevelState"
    :isLoading="agentLevelState.isLoading"
    :header="agentLevelState.data.id ? 'Edit Level Agen' : 'Add Level Agent'"
    :width="30"
    :type="dialogType.form"
    :cancelButtonAction="cancelLevelAgentForm"
    :successButtonAction="handleSubmit"
  ></CustomDialogUI>

  <CustomDialogUI
    v-model:dialogState="deleteAgentLevelState.showDialog"
    v-model:deleteAgentLevelState="deleteAgentLevelState"
    :isLoading="deleteAgentLevelState.isLoading"
    header="Hapus Level Agent"
    :description="`Anda yakin ingin menghapus ${deleteAgentLevelState.data?.title} dari level agen ?`"
    :width="34"
    :type="dialogType.confirm"
    successButtonText="Hapus"
    successButtonColor="danger"
    :cancelButtonAction="cancelDeleteLevelAgentForm"
    :successButtonAction="handleDeleteButton"
  ></CustomDialogUI>
  <Toast />
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  AgentLevelStatus,
  type AgentLavelStateType,
  type AgentLevel,
} from "~/types/agentData";
import type { authType } from "~/types/authData";
import type { fetchDataType, SaveAgentLevelType } from "~/types/fetchData";
import { dialogType } from "~/types/formType";
import { useBrandStore } from "~/stores/Brand";
import { useMainStore } from "~/stores/main";

export interface AgentLevelStateData {
  agentLevels: AgentLevel[];
}

const toast = useToast();
const runtimeConfig = useRuntimeConfig();
const brandStore = useBrandStore();
const mainStore = useMainStore();

const props = defineProps<{
  dataAuth: authType;
  isLoading: boolean;
  stateData: AgentLevelStateData;
  changeStateData: (stateData: AgentLevelStateData) => void;
}>();

const agentLevels = computed({
  set(data: AgentLevel[]) {
    props.changeStateData({
      ...props.stateData,
      agentLevels: data,
    });
  },
  get() {
    return props.stateData.agentLevels;
  },
});

const agentLevelState = ref<AgentLavelStateType>({
  showDialog: false,
  error: "",
  data: {
    id: "",
    title: "",
    commission: "",
    status: AgentLevelStatus.ACTIVE,
    agentTotal: 0,
  },
  isLoading: false,
});
const deleteAgentLevelState = ref<{
  showDialog: boolean;
  data: AgentLevel | null;
  error: string;
  isLoading: boolean;
}>({
  showDialog: false,
  data: null,
  error: "",
  isLoading: false,
});

const openDeleteForm = (agentLevel: AgentLevel): void => {
  deleteAgentLevelState.value = {
    ...deleteAgentLevelState.value,
    showDialog: true,
    data: agentLevel,
  };
};

const cancelDeleteLevelAgentForm = (): void => {
  deleteAgentLevelState.value.showDialog = false;
};

const handleDeleteButton = async (): Promise<void> => {
  deleteAgentLevelState.value.isLoading = false;

  const body = new FormData();
  body.append("id", (deleteAgentLevelState.value.data?.id || "") as string);
  body.append("idBrand", brandStore.selectedBrand?.id);
  const response = await $fetch(
    `${runtimeConfig.public.agentMerchantApi}agentLevel/deleteAgentLevel`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${props.dataAuth?.token}`,
      },
      body,
    }
  );

  deleteAgentLevelState.value.isLoading = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDataType | null = JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        deleteAgentLevelState.value.error = dataBind.msg;
      } else {
        agentLevels.value = props.stateData.agentLevels.filter(
          (level) => level.id !== deleteAgentLevelState.value.data?.id
        );
        deleteAgentLevelState.value = {
          ...deleteAgentLevelState.value,
          data: null,
          showDialog: false,
          error: "",
        };
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const openForm = (agentLevel?: AgentLevel): void => {
  agentLevelState.value = {
    ...agentLevelState.value,
    showDialog: true,
    data: agentLevel || {
      id: "",
      title: "",
      commission: "",
      status: AgentLevelStatus.ACTIVE,
      agentTotal: 0,
    },
  };
};

const cancelLevelAgentForm = (): void => {
  agentLevelState.value.showDialog = false;
};

const saveAgentLevel = async (): Promise<void> => {
  agentLevelState.value.isLoading = false;

  const body = new FormData();
  body.append("id", agentLevelState.value.data.id as string);
  body.append("idBrand", brandStore.selectedBrand?.id as string);
  body.append("title", agentLevelState.value.data.title as string);
  body.append("commission", agentLevelState.value.data.commission as string);
  body.append("status", agentLevelState.value.data.status as string);
  const response = await $fetch(
    `${runtimeConfig.public.agentMerchantApi}agentLevel/saveAgentLevel`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${props.dataAuth?.token}`,
      },
      body,
    }
  );

  agentLevelState.value.isLoading = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: SaveAgentLevelType | null = JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        agentLevelState.value.error = dataBind.msg;
      } else {
        if (dataBind.data?.idAgentLevel && !agentLevelState.value.data.id) {
          agentLevels.value.push(agentLevelState.value.data);
        } else if (agentLevelState.value.data.id) {
          agentLevels.value = agentLevels.value.map((level) =>
            level.id === agentLevelState.value.data.id
              ? agentLevelState.value.data
              : level
          );
        }
        agentLevelState.value = {
          ...agentLevelState.value,
          showDialog: false,
          error: "",
        };
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const handleSubmit = async (): Promise<void> => {
  let error = "";
  if (!agentLevelState.value.data.title) {
    error = "Title is required";
  }

  agentLevelState.value.error = error;
  if (!error) {
    await saveAgentLevel();
  }
};
</script>
