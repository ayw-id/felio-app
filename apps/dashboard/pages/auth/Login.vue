<script setup lang="ts">
import { ref } from "vue";
import AppConfig from "@/layouts/AppConfig.vue";
import { storageNames } from "~/utils/constants";
// Button Method 1
import type { authType } from "~/types/authData";
import { useToast } from "primevue/usetoast";
import { showCustomToast } from "~/utils/utilsFunction";
import type { AgentBrand, AgentRegistrationType } from "~/types/agentData";
import { fetchAgentRegistrationPage } from "~/services/AgentServices";
import {
  processResponse,
  getUserProfile,
  signInWithSocial,
} from "~/services/Auth";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const route = useRoute();
const isLoading = ref(false);

const getdataGuest = computed(() => {
  const guest = localStorage.getItem(storageNames.cvr as string);
  if (guest && guest !== "" && guest !== "null" && guest !== "undefined") {
    return JSON.parse(guest);
  }
  return null;
});

const agentBrand = ref<AgentBrand | null>();
const agentRegistrationPage = ref<AgentRegistrationType>();
const brandCode = ref<string>("");
const isAiContentUser = ref<boolean>(false);

onMounted(async () => {
  const authRedirect = localStorage.getItem(storageNames.authRedirect as string);
  console.log('authRedirect', authRedirect)
  if (authRedirect === 'AI-CONTENT') {
    isAiContentUser.value = true;
  }
  const merchantPage = route.query.merchantPage as string;
  if (merchantPage) {
    brandCode.value = merchantPage;
    isLoading.value = true;
    const response = await fetchAgentRegistrationPage(merchantPage);
    isLoading.value = false;
    if (!response.success) {
      showCustomToast(toast, response.message);
    } else {
      if (response.agentBrand) {
        agentBrand.value = response.agentBrand;
      }
      if (response.agentRegistrationPage) {
        agentRegistrationPage.value = response.agentRegistrationPage;
      }
    }
  }
  const provider = route.query.provider;
  const code = route.query.code;
  if (provider && code) {
    const responseProccess = await processResponse(
      provider as string,
      code as string
    );
    if (!responseProccess.success) {
      showCustomToast(toast, responseProccess.message);
    } else {
      const responseProfile = await getUserProfile(
        provider as string,
        responseProccess.data?.accessToken || "",
        responseProccess.data?.idToken
      );
      if (!responseProfile.success) {
        showCustomToast(toast, responseProfile.message);
      } else {
        const dataGuest = getdataGuest;
        const responseSignUp = await signInWithSocial(
          provider as string,
          responseProfile.data,
          dataGuest
        );
        if (!responseSignUp.success) {
          showCustomToast(toast, responseSignUp.message);
        } else if (responseSignUp.data) {
          onBoard(responseSignUp.data.token, responseSignUp.data.tokenGuest);
        }
      }
    }
  }
});

definePageMeta({
  // layout: false,
});

const onBoard = (
  token: authType,
  tokenGuest?: authType,
  isEmployee?: boolean
): void => {
  localStorage.removeItem(storageNames.sellerToken as string);

  localStorage.setItem(
    storageNames.tempSellerToken as string,
    JSON.stringify(token)
  );

  if (tokenGuest) {
    localStorage.setItem(
      storageNames.cvr as string,
      JSON.stringify(tokenGuest)
    );
  }
  localStorage.removeItem(storageNames.merchantCode as string);

  if (isEmployee) {
    localStorage.setItem(storageNames.authRedirect as string, "STORE");
  }

  window.location.href =
    (runtimeConfig.public.baseUrl as string) + "auth/services";
};
</script>

<template>
  <Toast />
  <div
    v-if="isLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else class="grid">
    <div
      v-if="agentBrand && agentRegistrationPage"
      class="col-12 md:col-6 overflow-hidden bg-red-50"
      style=""
    >
      <div class="flex flex-column w-full p-4 md:p-8">
        <AgentPreviewRegistrationPage
          :logo="agentBrand.logo"
          :title="agentRegistrationPage.title"
          :expiredDate="
            new Date(
              agentRegistrationPage.expiredDate || ''
            ).toLocaleDateString('en-CA')
          "
          :hasExpiredDate="agentRegistrationPage.hasExpiredDate"
          :requirements="agentRegistrationPage.requirements"
          :registrationFee="agentRegistrationPage.registrationFee"
        />
      </div>
    </div>

    <AuthContainer
      :process-response="processResponse"
      :agent-brand="agentBrand"
      :agentRegistrationPage="agentRegistrationPage"
      :merchant-code="brandCode"
      :is-preview="false"
      :isAiContentUser="isAiContentUser"
      :onBoard="onBoard"
    />
  </div>

  <AppConfig simple />
  <Toast />
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}
.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
