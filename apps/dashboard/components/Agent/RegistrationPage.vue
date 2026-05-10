<template>
  <div
    v-if="isLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-if="!isLoading" class="col-12">
    <div v-if="agentBrand" class="grid bg-yellow-100 p-3">
      <div class="col-12">
        <p class="text-2xl">
          <strong>Bagikan halaman registrasi ke calon reseller Anda</strong>
        </p>
      </div>
      <div class="col-12">
        <p>
          Link Registrasi:
          <strong>{{
            `${runtimeConfig.public.baseUrl}auth/login?merchantPage=${agentBrand?.code}`
          }}</strong>
        </p>
      </div>
      <div class="col-2">
        <Button
          label="Copy"
          @click="copyRegistrationPage"
          type="button"
        ></Button>
      </div>
    </div>

    <div v-if="agentBrand" class="grid mt-4">
      <div class="col-12"></div>
      <div class="col-12 sm:col-5 lg:col-6 xl:col-3 pt-2">
        <h4>Atur Halaman Registrasi Reseller/Agen</h4>
      </div>
      <div v-if="agentBrand" class="col-12 sm:col-3 lg:col-2">
        <Button
          label="Preview"
          @click="
            () => {
              title = selectedAgentLevel?.name || '';
              preview = true;
            }
          "
          type="button"
          outlined
        ></Button>
      </div>
    </div>
  </div>
  <div v-if="!isLoading && agentBrand" cols="12">
    <CustomForm
      :type="formType.dropdown"
      :dropdownOptions="
        agentLevels.map((level) => ({
          id: level.id,
          name: level.title,
        }))
      "
      label="Level Agen"
      v-model:modelData="selectedAgentLevel"
    ></CustomForm>
    <CustomForm
      :type="formType.inputField"
      label="Requirements"
      v-model:modelData="requirements"
    ></CustomForm>
    <CustomForm
      :type="formType.input"
      :input-type="inputFieldType.number"
      label="Registration Fee"
      v-model:modelData="registrationFee"
    ></CustomForm>

    <div class="flex items-center mb-4">
      <input
        type="checkbox"
        @change="changeHasExpiredDate()"
        :value="hasExpiredDate"
        :checked="hasExpiredDate"
        inputId="expired-date"
      />
      <label for="expired-date" class="ml-2">Has Expired Date</label>
    </div>

    <Calendar
      v-if="hasExpiredDate"
      v-model="expiredDate"
      class="w-full mb-4"
      showIcon
    />

    <Button
      v-if="
        stateData.agentRegistrationPageForm.isChanged &&
        mainStore.userPermissions?.some(
          (perm) => perm === 'agent-registration-page:edit'
        )
      "
      label="Simpan"
      @click="saveRegistrationPage"
      class="w-2"
      severity="success"
    ></Button>

    <Dialog
      v-model:visible="preview"
      modal
      header="Preview Halaman Registrasi"
      :style="{ width: '90vw' }"
    >
      <div class="grid">
        <div class="col-12 md:col-6 overflow-hidden bg-red-50" style="">
          <div class="flex flex-column w-full p-4 md:p-8">
            <AgentPreviewRegistrationPage
              :logo="agentBrand.logo"
              :title="title"
              :expiredDate="expiredDate.toLocaleDateString('en-CA')"
              :hasExpiredDate="hasExpiredDate"
              :requirements="requirements"
              :registrationFee="parseInt(registrationFee)"
            />
          </div>
        </div>

        <AuthContainer
          :agent-brand="agentBrand"
          :agentRegistrationPage="stateData.agentRegistrationPageForm"
          :is-preview="true"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {
  type AgentBrand,
  type AgentLevel,
  type AgentRegistrationType,
} from "~/types/agentData";
import type { authType } from "~/types/authData";
import { formType, inputFieldType } from "~/types/formType";
import { useMainStore } from "~/stores/main";

export interface AgentRegistrationPageStateData {
  agentRegistrationPageForm: AgentRegistrationType;
}

interface SelectedAgetLevel {
  id: string;
  name: string;
}

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const mainStore = useMainStore();

const props = defineProps<{
  dataAuth: authType;
  isLoading: boolean;
  agentBrand: AgentBrand;
  stateData: AgentRegistrationPageStateData;
  agentLevels: AgentLevel[];
  changeStateData: (stateData: AgentRegistrationPageStateData) => void;
  saveRegistrationPage: () => void;
}>();

const selectedAgentLevel = computed({
  set(val: SelectedAgetLevel | null) {
    props.changeStateData({
      agentRegistrationPageForm: {
        ...props.stateData.agentRegistrationPageForm,
        idAgentLevel: val?.id ?? "",
        isChanged: true,
      },
    });
  },
  get() {
    const agentLevel = props.agentLevels.find(
      (level) =>
        level.id === props.stateData.agentRegistrationPageForm.idAgentLevel
    );
    return agentLevel
      ? {
          id: agentLevel.id,
          name: agentLevel.title,
        }
      : null;
  },
});

const title = computed({
  set(val: string) {
    props.changeStateData({
      agentRegistrationPageForm: {
        ...props.stateData.agentRegistrationPageForm,
        title: val,
        isChanged: true,
      },
    });
  },
  get() {
    return props.stateData.agentRegistrationPageForm.title;
  },
});

const requirements = computed({
  set(val: string) {
    props.changeStateData({
      agentRegistrationPageForm: {
        ...props.stateData.agentRegistrationPageForm,
        requirements: val.replace(/\n/g, "<br>"),
        isChanged: true,
      },
    });
  },
  get() {
    return props.stateData.agentRegistrationPageForm.requirements.replace(
      /<br\s*\/?>/gi,
      "\n"
    );
  },
});

const copyRegistrationPage = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  window.navigator.clipboard.writeText(
    `${runtimeConfig.public.baseUrl}auth/login?merchantPage=${props.agentBrand.code}`
  );
  showCustomToast(toast, "Link registrasi berhasi di copy", true);
};

const registrationFee = computed({
  set(val: string) {
    props.changeStateData({
      agentRegistrationPageForm: {
        ...props.stateData.agentRegistrationPageForm,
        registrationFee: parseInt(val),
        isChanged: true,
      },
    });
  },
  get() {
    return props.stateData.agentRegistrationPageForm.registrationFee + "";
  },
});

const hasExpiredDate = computed({
  set(val: boolean) {
    props.changeStateData({
      agentRegistrationPageForm: {
        ...props.stateData.agentRegistrationPageForm,
        hasExpiredDate: val,
        isChanged: true,
      },
    });
  },
  get() {
    return props.stateData.agentRegistrationPageForm.hasExpiredDate;
  },
});

const changeHasExpiredDate = (): void => {
  if (!hasExpiredDate.value) {
    expiredDate.value = new Date();
  }
  hasExpiredDate.value = !hasExpiredDate.value;
};

const expiredDate = computed({
  set(val: Date) {
    props.changeStateData({
      agentRegistrationPageForm: {
        ...props.stateData.agentRegistrationPageForm,
        expiredDate: val.toLocaleDateString(),
        isChanged: true,
      },
    });
  },
  get() {
    return new Date(
      (props.stateData.agentRegistrationPageForm.expiredDate || "") as string
    );
  },
});

const preview = ref<boolean>(false);
</script>
