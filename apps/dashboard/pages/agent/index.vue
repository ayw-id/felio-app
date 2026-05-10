<template>
  <div v-if="dataAuth" class="grid p-fluid">
    <div
      v-if="!loadingAgents && requirement"
      class="col-12 bg-red-200 p-3 mx-3 mt-2"
      style="border-radius: 12px"
    >
      <div class="col-12">
        <p class="text-2xl mb-0">
          <strong>{{ requirement.title }}</strong>
        </p>
      </div>
      <div v-if="requirement.endPoint" class="col-2 mt-2">
        <Button
          :label="requirement.btnText"
          @click="goToRequirementPage"
          type="button"
        ></Button>
      </div>
    </div>
    <div
      v-if="!loadingAgents && (!requirement || requirement?.tab)"
      class="col-12 mb-4"
    >
      <div class="col-12 lg:col-6">
        <ButtonGroup>
          <Button
            @click="setCurrentTab(AgentTab.agent)"
            label="Reseller"
            severity="info"
            :text="currentTab !== AgentTab.agent"
          ></Button>
          <Button
            @click="setCurrentTab(AgentTab.level)"
            label="Level Agen"
            severity="info"
            :text="currentTab !== AgentTab.level"
          ></Button>
          <Button
            @click="setCurrentTab(AgentTab.registrationPage)"
            label="Halaman Registrasi"
            severity="info"
            :text="currentTab !== AgentTab.registrationPage"
          ></Button>
        </ButtonGroup>
      </div>
    </div>
    <div
      v-if="!loadingAgents && (!requirement || requirement?.tab)"
      class="col-12"
    >
      <div class="card">
        <AgentLevel
          v-if="currentTab === AgentTab.level"
          :dataAuth="dataAuth"
          :stateData="{
            agentLevels,
          }"
          :is-loading="loadingAgentLevel"
          :change-state-data="changeLevelStateData"
        ></AgentLevel>

        <AgentRegistrationPage
          v-if="currentTab === AgentTab.registrationPage && agentBrand"
          :agent-levels="agentLevels"
          :dataAuth="dataAuth"
          :agentBrand="agentBrand"
          :stateData="{
            agentRegistrationPageForm: agentRegistrationPageFormState,
          }"
          :is-loading="loadingAgentLevel"
          :change-state-data="changeRegistrationPageStateData"
          :saveRegistrationPage="saveRegistrationPage"
        ></AgentRegistrationPage>
      </div>
    </div>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { AgentLevelStateData } from "~/components/Agent/Level.vue";
import type { AgentRegistrationPageStateData } from "~/components/Agent/RegistrationPage.vue";
import {
  type AgentBrand,
  AgentRegistrationPageStatus,
  type AgentLevel,
  type AgentRegistrationType,
} from "~/types/agentData";
import type { authType } from "~/types/authData";
import type {
  FetchAgentLevelType,
  FetchAgentRegistrationPage,
  FetchAgents,
  fetchDataType,
} from "~/types/fetchData";
import { apiRequest } from "~/services/APIService";
import { useBrandStore } from "~/stores/Brand";

enum AgentTab {
  agent,
  level,
  registrationPage,
}

const toast = useToast();
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const brandStore = useBrandStore();

const dataAuth = ref<authType | null>(null);
const requirement = ref<{
  data: string;
  title: string;
  btnText: string;
  endPoint: string;
  tab: AgentTab | null;
} | null>(null);
const currentTab = ref<AgentTab>(AgentTab.agent);
const agentLevels = ref<AgentLevel[]>([]);
const loadingAgentLevel = ref<boolean>(false);
const agentRegistrationPageFormState = ref<AgentRegistrationType>({
  isChanged: false,
  idAgentLevel: "",
  title: "",
  requirements: "",
  registrationFee: 0,
  hasExpiredDate: false,
  expiredDate: null,
  status: AgentRegistrationPageStatus.ACTIVE,
});
const agentBrand = ref<AgentBrand | null>(null);
const loadingAgentRegistrationPage = ref<boolean>(false);

const loadingAgents = ref<boolean>(true);

const setCurrentTab = async (agentTab: AgentTab): Promise<void> => {
  currentTab.value = agentTab;
  if (agentTab === AgentTab.level && !agentLevels.value.length) {
    await fetchAgentLevels();
  } else if (
    agentTab === AgentTab.registrationPage &&
    (!agentRegistrationPageFormState.value.title || !agentBrand.value)
  ) {
    await fetchRegistrationPage();
  }
};

const fetchRegistrationPage = async (): Promise<void> => {
  loadingAgentRegistrationPage.value = true;

  const body = new FormData();
  body.append("idBrand", brandStore.selectedBrand?.id as string);

  const response = await apiRequest<FetchAgentRegistrationPage>(
    `${runtimeConfig.public.agentMerchantApi}agentSettings/getRegistrationSettings`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  loadingAgentRegistrationPage.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else if (response.data) {
    if (response.data.agentRegistrationPage) {
      agentRegistrationPageFormState.value =
        response.data.agentRegistrationPage;
    }

    agentBrand.value = response.data.brand;
  }
};

const goToRequirementPage = (): void => {
  if (requirement.value?.endPoint) {
    router.push(requirement.value.endPoint);
  }
};

const saveRegistrationPage = async (): Promise<void> => {
  loadingAgentRegistrationPage.value = true;
  const body = new FormData();
  body.append(
    "idLevelAgent",
    (agentRegistrationPageFormState.value.idAgentLevel || "") as string
  );
  body.append(
    "requirements",
    agentRegistrationPageFormState.value.requirements as string
  );
  body.append(
    "registrationFee",
    (agentRegistrationPageFormState.value.registrationFee || "0") as string
  );
  body.append(
    "hasExpiredDate",
    agentRegistrationPageFormState.value.hasExpiredDate ? "1" : "0"
  );
  body.append(
    "expiredDate",
    (agentRegistrationPageFormState.value.expiredDate || "") as string
  );

  body.append("idBrand", brandStore.selectedBrand?.id as string);

  const response = await apiRequest<fetchDataType>(
    `${runtimeConfig.public.agentMerchantApi}agentSettings/saveRegistrationSetting`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  loadingAgentRegistrationPage.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else {
    showCustomToast(toast, "Data berhasi disimpan", true);
    agentRegistrationPageFormState.value.isChanged = false;
  }
};

const changeRegistrationPageStateData = (
  stateData: AgentRegistrationPageStateData
): void => {
  if (stateData.agentRegistrationPageForm) {
    agentRegistrationPageFormState.value = stateData.agentRegistrationPageForm;

    if (requirement.value?.data === "agentRegistrationPage") {
      requirement.value = null;
    }
  }
};

const changeLevelStateData = async (
  stateData: AgentLevelStateData
): Promise<void> => {
  agentLevels.value = stateData.agentLevels;
  if (
    stateData.agentLevels.length &&
    requirement.value?.data === "agentLevel"
  ) {
    await fetchAgents();
  }
};

const fetchAgentLevels = async (): Promise<void> => {
  loadingAgentLevel.value = true;

  const body = new FormData();
  body.append("idBrand", brandStore.selectedBrand?.id as string);

  const response = await apiRequest<FetchAgentLevelType>(
    `${runtimeConfig.public.agentMerchantApi}agentLevel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  loadingAgentLevel.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else if (response.data) {
    agentLevels.value = response.data.agentLevels;
  }
};

const fetchAgents = async (): Promise<void> => {
  requirement.value = null;

  const body = new FormData();
  body.append("idBrand", brandStore.selectedBrand?.id as string);

  const response = await apiRequest<FetchAgents>(
    `${runtimeConfig.public.agentMerchantApi}agent`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  loadingAgents.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else if (response.data) {
    let reqTitle = "";
    let reqBtnText = "";
    let endPoint = "";
    let tab = null;
    let requirementData = "";
    if (response.data.requirement) {
      requirementData = response.data.requirement;
      if (response.data.requirement === "brand") {
        endPoint = "/brand";
        reqTitle = "Silahkan lengkapi data brand Anda terlebih dahulu";
        reqBtnText = "Lengkapi Data Brand";
      } else if (response.data.requirement === "product") {
        endPoint = "/product";
        reqTitle = "Silahkan buat produk Anda terlebih dahulu";
        reqBtnText = "Tambah Produk";
      } else if (response.data.requirement === "agentProduct") {
        endPoint = "/agent/product";
        reqTitle = "Silahkan tambahkan komisi pada produk Anda terlebih dahulu";
        reqBtnText = "Buat Komisi Produk";
      } else if (response.data.requirement === "agentLevel") {
        reqTitle = "Silahkan buat level agen/reseller";
        tab = AgentTab.level;
      }
    } else {
      if (response.data.brand) {
        agentBrand.value = response.data.brand;
      }
      if (response.data.agentLevels?.length) {
        agentLevels.value = response.data.agentLevels;
      }
      if (response.data.agentRegistrationPage) {
        agentRegistrationPageFormState.value =
          response.data.agentRegistrationPage;
      } else {
        requirementData = "agentRegistrationPage";
        reqTitle = "Silahkan buat halaman pendaftaran agen/reseller";
        tab = AgentTab.registrationPage;
      }
    }

    if (requirementData) {
      requirement.value = {
        data: requirementData,
        title: reqTitle,
        btnText: reqBtnText,
        endPoint,
        tab,
      };
    }

    if (tab) {
      await setCurrentTab(tab);
    }
  }
};

watch(
  [() => brandStore.selectedBrand, () => dataAuth.value?.token],
  async (newBrand) => {
    if (newBrand && dataAuth.value?.token) {
      await fetchAgents();
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
