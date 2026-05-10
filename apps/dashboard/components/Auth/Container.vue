<script setup lang="ts">
import { ref } from "vue";
import { storageNames, countryCode } from "~/utils/constants";
import type { ProderT } from "universal-social-auth/dist/providers";
// Button Method 1
import { Providers } from "universal-social-auth";
import type { fetchAuthType } from "~/types/fetchData";
import type { authType } from "~/types/authData";
import { useToast } from "primevue/usetoast";
import { showCustomToast, reformatPhoneNumber } from "~/utils/utilsFunction";
import {
  validateLogin,
  validateRegistration,
  validateEmployeeLogin,
} from "~/pages/auth/authValidation";
import type { ToastMessageOptions } from "primevue/toast";
import type { AgentBrand, AgentRegistrationType } from "~/types/agentData";
import {
  getUserProfile,
  processResponse,
  signInWithSocial,
} from "~/services/Auth";
import { apiRequest } from "~/services/APIService";

const OTP_EXP = 90_000; // 90 sec in ms
const OTP_KEY = "STORE_OTP_EXPIRES"; // localStorage key
const EMAIL_KEY = "STORE_EMAIL_EXPIRES";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const props = defineProps<{
  isPreview: boolean;
  agentBrand?: AgentBrand | null;
  agentRegistrationPage?: AgentRegistrationType;
  merchantCode?: string;
  onBoard: (
    token: authType,
    tokenGuest: authType | null,
    isEmployee?: boolean
  ) => void;
}>();

const logoUrl = computed(() => {
  return `${runtimeConfig.public.baseUrl}/layout/images/favicon.png`;
});

const inputLoginState = ref({
  email: "",
  password: "",
  rememberMe: "false",
});
const isLoading = ref(false);

const defaultCountryCode: countryCodeType | undefined = countryCode.find(
  (data) => data.code === "ID"
);

const isEmployeePage = ref<boolean>(false);
const remainingOTP = ref<number>(0);
const employeeLoginStep = ref<string>("email");

const inputEmployeeLoginState = ref({
  email: "",
  password: "",
  password1: "",
  otp: "",
});

const inputRegisterState = ref({
  name: "",
  email: "",
  countryCode: defaultCountryCode,
  phone: "",
  password: "",
  password1: "",
  rememberMe: "false",
});

const loginPage = ref(true);

const { $Oauth } = useNuxtApp();

const getdataGuest = computed(() => {
  const guest = localStorage.getItem(storageNames.cvr as string);
  if (guest && guest !== "" && guest !== "null" && guest !== "undefined") {
    return JSON.parse(guest);
  }
  return null;
});

const checkToken = (): void => {
  setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = localStorage.getItem(storageNames.sellerToken);
    console.warn(`Token ${token ? "exists" : ""}`);
    if (token) {
      window.location.href = "https://felio.id/app/";
    } else {
      checkToken();
    }
  }, 3000);
};

const authProvider = (provider: string): void => {
  localStorage.setItem(
    storageNames.merchantCode as string,
    props.merchantCode ?? ""
  );
  checkToken();

  const ProData = Providers[provider] as ProderT;
  $Oauth
    .authenticate(provider, ProData)
    .then(async (response) => {
      if (response.code) {
        const responseProccess = await processResponse(
          provider,
          response.code as string
        );
        if (!responseProccess.success) {
          showCustomToast(toast, responseProccess.message);
        } else {
          const responseProfile = await getUserProfile(
            provider,
            responseProccess.data?.accessToken || "",
            responseProccess.data?.idToken
          );
          if (!responseProfile.success) {
            showCustomToast(toast, responseProfile.message);
          } else {
            const dataGuest = getdataGuest;
            const responseSignUp = await signInWithSocial(
              provider,
              responseProfile.data,
              dataGuest
            );
            if (!responseSignUp.success) {
              showCustomToast(toast, responseSignUp.message);
            } else if (responseSignUp.data) {
              props.onBoard(
                responseSignUp.data.token,
                responseSignUp.data.tokenGuest
              );
            }
          }
        }
      }
    })
    .catch((error: Error) => {
      console.log({ error });
    });
};

definePageMeta({
  layout: false,
});

const login = async (): Promise<void> => {
  if (!isLoading.value) {
    const validation: ToastMessageOptions | null = validateLogin(
      inputLoginState.value
    );
    if (validation) {
      toast.add(validation);
    } else {
      isLoading.value = true;
      const dataGuest = getdataGuest;
      const formData = new FormData();
      formData.append("email", inputLoginState.value.email);
      formData.append("password", inputLoginState.value.password);
      formData.append(
        "guest",
        dataGuest.value === null ? "" : (dataGuest.value.token as string)
      );
      if (props.merchantCode) {
        formData.append("brandCode", props.merchantCode);
      }
      const response = await $fetch(
        `${runtimeConfig.public.sellerApi}auth/login`,
        {
          method: "post",
          body: formData,
        }
      );

      isLoading.value = false;
      if (!response) {
        showCustomToast(toast);
      } else {
        const dataBind: fetchAuthType | null = JSON.parse(response as string);
        if (dataBind) {
          if (!dataBind.success) {
            showCustomToast(toast, dataBind.msg as string);
          } else {
            if (dataBind.data.lastAccessedService) {
              localStorage.setItem(
                storageNames.authRedirect as string,
                dataBind.data.lastAccessedService as string
              );
            }

            props.onBoard(
              dataBind.data.token as authType,
              dataBind.data.token_guest as authType
            );
          }
        } else {
          showCustomToast(toast);
        }
      }
    }
  }
};

const register = async (): Promise<void> => {
  if (!isLoading.value) {
    const validation: ToastMessageOptions | null = validateRegistration(
      inputRegisterState.value
    );
    if (validation) {
      toast.add(validation);
    } else {
      isLoading.value = true;
      const dataGuest = getdataGuest;
      const formData = new FormData();
      formData.append("name", inputRegisterState.value.name);
      formData.append("email", inputRegisterState.value.email);
      formData.append(
        "callingCode",
        (inputRegisterState.value.countryCode?.dialCode || "") as string
      );
      formData.append(
        "phone",
        reformatPhoneNumber(
          inputRegisterState.value.phone || "",
          inputRegisterState.value.countryCode
        ) as string
      );
      formData.append("password", inputRegisterState.value.password);
      formData.append(
        "guest",
        dataGuest.value === null ? "" : (dataGuest.value.token as string)
      );
      if (props.merchantCode) {
        formData.append("brandCode", props.merchantCode);
      }

      const response = await $fetch(
        `${runtimeConfig.public.api}auth/register`,
        {
          method: "post",
          body: formData,
        }
      );

      isLoading.value = false;
      if (!response) {
        showCustomToast(toast);
      } else {
        const dataBind: fetchAuthType | null = JSON.parse(response as string);
        if (dataBind) {
          if (dataBind.success) {
            props.onBoard(
              dataBind.data.token as authType,
              dataBind.data.token_guest as authType
            );
          } else {
            showCustomToast(toast, dataBind.msg);
          }
        } else {
          showCustomToast(toast);
        }
      }
    }
  }
};

const submitEmployeeEmail = async (): Promise<void> => {
  const body = new FormData();
  body.append("email", inputEmployeeLoginState.value.email);

  const response = await apiRequest<fetchGetProductsType>(
    `${runtimeConfig.public.sellerApi}auth/employeeLogin`,
    {
      method: "POST",
      body,
    }
  );

  isLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else {
    if (response.data?.submitOTP) {
      // persist 90‑second window
      const expires = Date.now() + OTP_EXP;
      localStorage.setItem(OTP_KEY, String(expires));
      localStorage.setItem(EMAIL_KEY, inputEmployeeLoginState.value.email);
      remainingOTP.value = OTP_EXP;
      employeeLoginStep.value = "otp";

      startInterval();
    } else if (
      response.data?.isAdmin === undefined &&
      response.data?.submitOTP === undefined
    ) {
      employeeLoginStep.value = "password";
    }
  }
};

const submitEmployeeOTP = async (): Promise<void> => {
  const body = new FormData();
  body.append("otp", inputEmployeeLoginState.value.otp);
  body.append("email", inputEmployeeLoginState.value.email);

  const response = await apiRequest<fetchGetProductsType>(
    `${runtimeConfig.public.sellerApi}auth/verifyOTP`,
    {
      method: "POST",
      body,
    }
  );

  isLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else {
    localStorage.removeItem(OTP_KEY); // done with OTP
    localStorage.removeItem(EMAIL_KEY); // done with OTP
    employeeLoginStep.value = "setPassword";
  }
};

const submitEmployeePassword = async (): Promise<void> => {
  const body = new FormData();
  body.append("password", inputEmployeeLoginState.value.password);
  body.append("email", inputEmployeeLoginState.value.email);

  const response = await apiRequest<fetchGetProductsType>(
    `${runtimeConfig.public.sellerApi}auth/registerPassword`,
    {
      method: "POST",
      body,
    }
  );

  isLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else {
    props.onBoard(response.data.token as authType, null, true);
  }
};

const verifyEmployeePassword = async (): Promise<void> => {
  const body = new FormData();
  body.append("password", inputEmployeeLoginState.value.password);
  body.append("email", inputEmployeeLoginState.value.email);

  const response = await apiRequest<fetchGetProductsType>(
    `${runtimeConfig.public.sellerApi}auth/verifyPassword`,
    {
      method: "POST",
      body,
    }
  );

  isLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.msg);
  } else {
    props.onBoard(response.data.token as authType, null, true);
  }
};

const employeeLogin = async (): Promise<void> => {
  if (!isLoading.value) {
    const validation: ToastMessageOptions | null = validateEmployeeLogin(
      inputEmployeeLoginState.value,
      employeeLoginStep.value
    );
    console.warn("validation", validation);
    if (validation) {
      toast.add(validation);
    } else {
      isLoading.value = true;
      if (employeeLoginStep.value === "email") {
        await submitEmployeeEmail();
      } else if (employeeLoginStep.value === "otp") {
        await submitEmployeeOTP();
      } else if (employeeLoginStep.value === "setPassword") {
        await submitEmployeePassword();
      } else if (employeeLoginStep.value === "password") {
        await verifyEmployeePassword();
      }
    }
  }
};

const startInterval = (): void => {
  const id = setInterval(() => {
    if (remainingOTP.value <= 1000) {
      localStorage.removeItem(OTP_KEY);
      localStorage.removeItem(EMAIL_KEY);
      clearInterval(id);
      return 0;
    } else {
      remainingOTP.value -= 1000;
    }
  }, 1000);
};

onMounted(() => {
  const exp = Number(localStorage.getItem(OTP_KEY) ?? 0);
  const email = localStorage.getItem(EMAIL_KEY);

  if (Date.now() < exp) {
    employeeLoginStep.value = "otp";
    inputEmployeeLoginState.value.email = email ?? "";

    // restore remaining countdown
    remainingOTP.value = exp - Date.now();

    startInterval();
  } else {
    // clear old keys
    localStorage.removeItem(OTP_KEY);
    localStorage.removeItem(EMAIL_KEY);
    remainingOTP.value = 0;
  }
});
</script>

<template>
  <Toast />
  <div
    :class="agentBrand && agentRegistrationPage ? '' : 'min-w-screen'"
    class="col-12 md:col-6 surface-ground flex align-items-center justify-content-center min-h-screen overflow-hidden"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <Avatar
        :image="logoUrl"
        class="mb-5 flex-shrink-0"
        style="width: 80px; height: 80px"
        shape="circle"
      />

      <div class="flex flex-row mt-4">
        <Button
          label="Pemilik Bisnis"
          class="py-3 text-xl mx-1 mb-2"
          style="width: 160px"
          :outlined="isEmployeePage"
          :disabled="isPreview"
          @click="isEmployeePage = false"
        ></Button>

        <Button
          label="Pegawai / Staff"
          class="py-3 text-xl mx-1 mb-2"
          style="width: 160px"
          :outlined="!isEmployeePage"
          :disabled="isPreview"
          @click="isEmployeePage = true"
        ></Button>
      </div>
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(
            180deg,
            var(--primary-color) 10%,
            rgba(33, 150, 243, 0) 30%
          );
        "
      >
        <div
          class="w-full surface-card py-8 px-5 sm:px-8"
          style="border-radius: 53px"
        >
          <!-- <div class="text-center mb-5">
            <img
              src="/demo/images/login/avatar.png"
              alt="Image"
              height="50"
              class="mb-3"
            />
            <div class="text-900 text-3xl font-medium mb-3">
              Welcome, Isabel!
            </div>
            <span class="text-600 font-medium">Sign in to continue</span>
          </div> -->

          <AuthLogin
            v-if="loginPage && !isEmployeePage"
            v-model:email="inputLoginState.email"
            v-model:password="inputLoginState.password"
            v-model:rememberMe="inputLoginState.rememberMe"
            :is-preview="isPreview"
          ></AuthLogin>

          <AuthRegister
            v-else-if="!isEmployeePage"
            v-model:name="inputRegisterState.name"
            v-model:countryCode="inputRegisterState.countryCode"
            v-model:phone="inputRegisterState.phone"
            v-model:email="inputRegisterState.email"
            v-model:password="inputRegisterState.password"
            v-model:password1="inputRegisterState.password1"
            v-model:rememberMe="inputRegisterState.rememberMe"
            :is-preview="isPreview"
          ></AuthRegister>

          <AuthEmployeeLogin
            v-else
            v-model:email="inputEmployeeLoginState.email"
            v-model:password="inputEmployeeLoginState.password"
            v-model:password1="inputEmployeeLoginState.password1"
            v-model:otp="inputEmployeeLoginState.otp"
            :is-preview="isPreview"
            :remaining="remainingOTP"
            :step="employeeLoginStep"
          ></AuthEmployeeLogin>

          <Button
            :label="loginPage || isEmployeePage ? 'Masuk' : 'Daftar'"
            class="w-full p-3 text-xl"
            :disabled="isPreview || isLoading"
            @click="
              isEmployeePage
                ? employeeLogin()
                : loginPage
                ? login()
                : register()
            "
          ></Button>

          <div v-if="!isEmployeePage" class="text-center mt-4">
            <label class="block text-900 text-3xl text-center mb-2"
              >Atau {{ loginPage ? "masuk" : "daftar" }} dengan</label
            >
            <Button
              icon="pi pi-google"
              label="Gmail"
              raised
              severity="warning"
              class="mb-2 mt-4 mr-2 text-lg self-center content-center"
              :disabled="isPreview"
              @click="authProvider('google')"
            ></Button>
            <Button
              icon="pi pi-facebook"
              label="Facebook"
              raised
              severity="info"
              class="mb-2 mt-4 mr-2 text-lg self-center content-center"
              :disabled="isPreview"
              @click="authProvider('facebook')"
            ></Button>
          </div>

          <div v-if="!isEmployeePage" class="text-center mt-4">
            <Button
              style="color: black"
              text
              class="font-medium no-underline text-md ml-2 text-right cursor-pointer"
              @click="loginPage = !loginPage"
            >
              {{ loginPage ? "Belum punya akun? Daftar " : "Punya akun? Masuk "
              }}<b class="ml-1" style="color: var(--primary-color)">di sini</b>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
