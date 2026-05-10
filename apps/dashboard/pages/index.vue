<script setup lang="ts">
import { useLayout } from "@/layouts/composables/layout";
import type {
  fetchDashboardGetActionType,
  fetchDashboardGetServiceOnboardingStepsType,
  serviceOnboardingObjType,
  fetchDashboardGetStoreOverviewType,
  storeOverview,
  fetchDashboardGetRecentSalesType,
  fetchDataType,
  recentSalesType,
  fieldObj,
  fetchDashboardGetSalesOverviewType,
  salesOverviewDatasetType,
  bestSellingProductType,
} from "~/types/fetchData";
import type { authType } from "~/types/authData";
import { validateBasicData } from "~/pages/auth/authValidation";
import type { basicDataType } from "~/pages/auth/authValidation";
import { countryCode } from "~/utils/constants";
const { isDarkTheme } = useLayout();
const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const router = useRouter();

// global
const isLoading = ref<boolean>(true);
const isOnboardingLoading = ref<boolean>(false);
// auth
const dataAuth = ref<authType | null>(null);
// onboarding - FelioStore
const isFelioStoreReady = ref<boolean>(false);
const felioStoreOnboardingSteps = ref<serviceOnboardingObjType[]>([]);
const felioStoreOnboardingStep = ref<number>(0);
// profile form
const isNameRequired = ref<boolean>(false);
const isEmailRequired = ref<boolean>(false);
const isPhoneRequired = ref<boolean>(false);
// onboarding - FelioSite
const isFelioSiteReady = ref<boolean>(false);
const felioSiteOnboardingSteps = ref<serviceOnboardingObjType[]>([]);
const felioSiteOnboardingStep = ref<number>(1);
//
const name = ref<string>("");
const email = ref<string>("");
const phone = ref<string>("");
const onboardingMessageInfo = ref<string>("");
const callingCode = ref<countryCodeType | null>(null);
// requiredRules: [(v) => !!v || 'This Field is required'],
// emailRules: [
//   (v) => !!v || 'E-mail is required',
//   (v) => /.+@.+/.test(v) || 'E-mail must be valid',
// ],
const isProfileLoading = ref<boolean>(false);
// requiredRules: [(v) => !!v || 'This Field is required']
// section 1
// needActions: [],

const dataStoreOverview = ref<storeOverview | null>(null);
const recentSales = ref<recentSalesType[]>([]);

interface salesOverviewType {
  labels: string[];
  datasets: salesOverviewDatasetType[];
}
const salesOverview = reactive<salesOverviewType>({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [],
});

const bestSellingProducts = ref<bestSellingProductType[]>([]);

const items = ref([
  { label: "Add New", icon: "pi pi-fw pi-plus" },
  { label: "Remove", icon: "pi pi-fw pi-minus" },
]);
const lineOptions = ref(null);

const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const applyLightTheme = (): any => {
  lineOptions.value = {
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
    },
  };
};

const applyDarkTheme = (): any => {
  lineOptions.value = {
    plugins: {
      legend: {
        labels: {
          color: "#ebedef",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ebedef",
        },
        grid: {
          color: "rgba(160, 167, 181, .3)",
        },
      },
      y: {
        ticks: {
          color: "#ebedef",
        },
        grid: {
          color: "rgba(160, 167, 181, .3)",
        },
      },
    },
  };
};

watch(
  isDarkTheme,
  (val) => {
    if (val) {
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  },
  { immediate: true }
);

const getAction = async (): Promise<void> => {
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}dashboard/getAction`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDashboardGetActionType | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        // console.warn(dataBind.data);
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const getServiceOnboardingSteps = async (): Promise<void> => {
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}services/getServiceOnboardingSteps`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDashboardGetServiceOnboardingStepsType | null =
      JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        felioStoreOnboardingSteps.value = dataBind.data.store;
        isFelioStoreReady.value = !dataBind.data.store.find(
          (data) => !data.status
        );
        if (!isFelioStoreReady.value) {
          for (let a = 0; a < felioStoreOnboardingSteps.value.length; a++) {
            const a_ = felioStoreOnboardingSteps.value[a];
            if (a_?.fields?.length) {
              for (let b = 0; b < a_.fields.length; b++) {
                const b_ = a_.fields[b];
                if (a_.fields[b].field === "email") {
                  email.value = a_.fields[b].email || "";
                } else if (a_.fields[b].field === "phone") {
                  phone.value = a_.fields[b].phone || "";
                } else if (a_.fields[b].field === "name") {
                  name.value = a_.fields[b].name || "";
                } else if (a_.fields[b].field === "calling_code") {
                  callingCode.value =
                    countryCode.find(
                      (code) => code.dialCode === b_.callingCode
                    ) || null;
                }
              }
            }
          }
        }
        felioSiteOnboardingSteps.value = dataBind.data.site;
        isFelioSiteReady.value = !dataBind.data.site.find(
          (data) => !data.status
        );

        let storeStep = 0;
        for (let a = 0; a < felioStoreOnboardingSteps.value.length; a++) {
          const a_ = felioStoreOnboardingSteps.value[a];
          if (!a_.status) {
            storeStep = a;
            break;
          }
        }

        felioStoreOnboardingStep.value = storeStep;
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const getOverview = async (): Promise<void> => {
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}dashboard/getStoreOverview`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDashboardGetStoreOverviewType | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        dataStoreOverview.value = dataBind.data;
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const getRecentSales = async (): Promise<void> => {
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}dashboard/getRecentSales`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDashboardGetRecentSalesType | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        recentSales.value = dataBind.data.recentSales;
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const getSalesOverView = async (): Promise<void> => {
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}dashboard/getSalesOverview`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDashboardGetSalesOverviewType | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        salesOverview.datasets = dataBind.data.datasets;
        bestSellingProducts.value = dataBind.data.bestSellingProduct;
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const onboardingNextStep = (): void => {
  let nextStep = -1;
  for (
    let a = felioStoreOnboardingStep.value + 1;
    a < felioStoreOnboardingSteps.value.length - 1;
    a++
  ) {
    if (!felioStoreOnboardingSteps.value[a].status) {
      nextStep = a;
      break;
    }
  }
  if (nextStep === -1) {
    for (let a = 0; a < felioStoreOnboardingStep.value; a++) {
      if (!felioStoreOnboardingSteps.value[a].status) {
        nextStep = a;
        break;
      }
    }
  }
  if (nextStep === -1) {
    isFelioStoreReady.value = true;
  } else {
    felioStoreOnboardingStep.value = nextStep;
  }
};

const updateProfile = async (
  service: string,
  fields?: fieldObj[]
): Promise<void> => {
  let updateData = true;
  if (service === "store") {
    if (
      felioStoreOnboardingSteps.value[felioStoreOnboardingStep.value].status
    ) {
      felioStoreOnboardingStep.value++;
      updateData = false;
    }
  } else if (service === "site") {
    if (felioSiteOnboardingSteps.value[felioSiteOnboardingStep.value].status) {
      felioSiteOnboardingStep.value++;
      updateData = false;
    }
  }
  if (updateData && fields) {
    const requiredData: basicDataType | null = {};
    for (let a = 0; a < fields.length; a++) {
      const a_ = fields[a];
      if (a_.field === "email") {
        requiredData.email = email.value;
      } else if (a_.field === "name") {
        requiredData.name = name.value;
      } else if (a_.field === "phone" && callingCode.value) {
        requiredData.phone = phone.value;
        requiredData.countryCode = callingCode.value;
      }
    }
    const validation = validateBasicData(requiredData);

    if (validation) {
      toast.add(validation);
    } else {
      isOnboardingLoading.value = true;

      const formData = new FormData();
      for (let a = 0; a < fields.length; a++) {
        const a_ = fields[a];
        if (a_.field === "email") {
          formData.append("email", email.value as string);
        } else if (a_.field === "name") {
          formData.append("name", name.value as string);
        } else if (a_.field === "phone" && callingCode.value) {
          formData.append("phone", phone.value as string);
          formData.append(
            "calling_code",
            callingCode.value.dialCode.replace("+", "") as string
          );
        }
      }

      const response = await $fetch(
        `${runtimeConfig.public.sellerApi}brand/saveProfile`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${dataAuth.value?.token}`,
          },
          body: formData,
        }
      );

      isOnboardingLoading.value = false;

      if (!response) {
        showCustomToast(toast);
      } else {
        const dataBind: fetchDataType | null = JSON.parse(response as string);

        if (dataBind) {
          if (!dataBind.success) {
            showCustomToast(toast, dataBind.msg);
          } else {
            felioStoreOnboardingSteps.value[
              felioStoreOnboardingStep.value
            ].status = true;
            onboardingNextStep();
          }
        } else {
          showCustomToast(toast);
        }
      }
    }
  }
};

const verifyData = async (): Promise<void> => {
  isOnboardingLoading.value = true;
  const body = new FormData();
  body.append("verificationType", "email");
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}auth/sendEmailOtp`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
      body,
    }
  );

  isOnboardingLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDataType | null = JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        onboardingMessageInfo.value =
          "Link verifikasi sudah terkirim ke e-mail Anda. Silahkan periksa e-mail Anda.";
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const checkVerificationStatus = async (service: string): Promise<void> => {
  isOnboardingLoading.value = true;
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}auth/checkVerificationStatus`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isOnboardingLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDataType | null = JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        felioStoreOnboardingSteps.value[felioStoreOnboardingStep.value].status =
          true;
        onboardingNextStep();
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const checkBrandInfo = async (): Promise<void> => {
  isOnboardingLoading.value = true;
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}brand/checkDataBrand`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isOnboardingLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDataType | null = JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        felioStoreOnboardingSteps.value[felioStoreOnboardingStep.value].status =
          true;
        onboardingNextStep();
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const checkHasProduct = async (): Promise<void> => {
  isOnboardingLoading.value = true;
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}product/checkSellerHasProduct`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isOnboardingLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDataType | null = JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        felioStoreOnboardingSteps.value[felioStoreOnboardingStep.value].status =
          true;
        onboardingNextStep();
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const checkHasWebsite = async (): Promise<void> => {
  isOnboardingLoading.value = true;
  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}brand/checkSellerHasWebsite`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  isOnboardingLoading.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchDataType | null = JSON.parse(response as string);

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        felioStoreOnboardingSteps.value[felioStoreOnboardingStep.value].status =
          true;
        onboardingNextStep();
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const storeNextBtnPressed = async (): Promise<void> => {
  onboardingMessageInfo.value = "";
  switch (
    felioStoreOnboardingSteps.value[felioStoreOnboardingStep.value].label
  ) {
    case "dataCompletion":
      await updateProfile(
        "store",
        felioStoreOnboardingSteps.value[felioStoreOnboardingStep.value]
          .fields as fieldObj[] | undefined
      );
      break;
    case "dataVerification":
      await checkVerificationStatus("store");
      break;
    case "brandInformation":
      await checkBrandInfo();
      break;
    case "addProduct":
      await checkHasProduct();
      break;
    case "publishWebsite":
      await checkHasWebsite();
      break;
  }
};

const siteNextBtnPressed = async (): Promise<void> => {
  onboardingMessageInfo.value = "";
  switch (felioSiteOnboardingSteps.value[felioSiteOnboardingStep.value].label) {
    case "dataCompletion":
      await updateProfile(
        "store",
        felioSiteOnboardingSteps.value[felioSiteOnboardingStep.value].fields as
          | fieldObj[]
          | undefined
      );
      break;
    case "dataVerification":
      await checkVerificationStatus("site");
      break;
    case "publishWebsite":
      break;
  }
};

const storeOnboardOptBtnPressed = async (): Promise<void> => {
  onboardingMessageInfo.value = "";
  switch (
    felioStoreOnboardingSteps.value[felioStoreOnboardingStep.value].label
  ) {
    case "dataVerification":
      await verifyData();
      break;
    case "brandInformation":
      router.push("/brand");
      break;
    case "addProduct":
      router.push("/product");
      break;
    case "publishWebsite":
      router.push("/website");
      break;
  }
};

const siteOnboardOptBtnPressed = async (): Promise<void> => {
  onboardingMessageInfo.value = "";
  switch (
    felioStoreOnboardingSteps.value[felioStoreOnboardingStep.value].label
  ) {
    case "dataVerification":
      await verifyData();
      break;
    case "publishWebsite":
      break;
  }
};

onMounted(async () => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    const parsedDataAuth = JSON.parse(dataAuth_);
    if (parsedDataAuth) {
      dataAuth.value = parsedDataAuth;

      await Promise.all([
        getServiceOnboardingSteps(),
        getAction(),
        getOverview(),
        getRecentSales(),
        getSalesOverView(),
      ]);
    }
  }
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
  <div v-else class="grid">
    <div
      v-if="!isFelioStoreReady && felioStoreOnboardingSteps.length"
      :class="`col-${felioSiteOnboardingSteps.length ? '6' : '12'}`"
    >
      <div class="card mb-0">
        <HomeOnboarding
          v-model:activeStep="felioStoreOnboardingStep"
          v-model:email="email"
          v-model:phone="phone"
          v-model:countryCode="callingCode"
          v-model:name="name"
          :isOnboardingLoading="isOnboardingLoading"
          :nextBtnPressed="storeNextBtnPressed"
          :optBtnPressed="storeOnboardOptBtnPressed"
          :messageInfo="onboardingMessageInfo"
          :steps="felioStoreOnboardingSteps"
          :formWidth="felioSiteOnboardingSteps.length ? 12 : 6"
        ></HomeOnboarding>
      </div>
    </div>
    <div
      v-if="!isFelioSiteReady && felioSiteOnboardingSteps.length"
      :class="`col-${felioStoreOnboardingSteps.length ? '6' : '12'}`"
    >
      <div class="card mb-0">
        <HomeOnboarding
          v-model:activeStep="felioSiteOnboardingStep"
          :isOnboardingLoading="isOnboardingLoading"
          :nextBtnPressed="siteNextBtnPressed"
          :optBtnPressed="siteOnboardOptBtnPressed"
          :steps="felioSiteOnboardingSteps"
          :formWidth="felioStoreOnboardingSteps.length ? 12 : 6"
        ></HomeOnboarding>
      </div>
    </div>
    <HomeOverview
      title="Revenue"
      :titleValue="`Rp ${dataStoreOverview?.revenue?.yearly || 0}`"
      :subTitle="`Rp ${dataStoreOverview?.revenue?.monthly || 0}`"
      appendText=" since last month"
      icon="pi pi-chart-bar"
      colorIcon="text-orange-500"
    ></HomeOverview>

    <HomeOverview
      title="Orders"
      :titleValue="`${dataStoreOverview?.totalInvoice?.yearly || 0}`"
      :subTitle="`${dataStoreOverview?.totalInvoice?.monthly || 0}`"
      appendText=" this month"
      icon="pi pi-shopping-cart"
      colorIcon="text-blue-500"
    ></HomeOverview>

    <HomeOverview
      title="Customers"
      :titleValue="`${dataStoreOverview?.totalCustomers?.yearly || 0}`"
      :subTitle="`${dataStoreOverview?.totalCustomers?.monthly || 0}`"
      appendText=" this month"
      icon="pi pi-user"
      colorIcon="text-cyan-500"
    ></HomeOverview>

    <HomeOverview
      title="Ratings"
      :titleValue="`${dataStoreOverview?.totalRatings?.yearly || '0.0'}`"
      :subTitle="`${dataStoreOverview?.totalRatings?.monthly || '0.0'}`"
      appendText=" reviews this month"
      icon="pi pi-comment"
      colorIcon="text-purple-500"
    ></HomeOverview>

    <div class="col-12 xl:col-6">
      <HomeRecentSales :recentSales="recentSales"></HomeRecentSales>
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Best Selling Products</h5>
          <!-- <div>
            <Button
              icon="pi pi-ellipsis-v"
              class="p-button-text p-button-plain p-button-rounded"
              @click="$refs.menu2.toggle($event)"
            ></Button>
            <Menu ref="menu2" :popup="true" :model="items"></Menu>
          </div> -->
        </div>
        <p>No data found</p>
        <!-- <ul class="list-none p-0 m-0">
          <li
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
          >
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                >Space T-Shirt</span
              >
              <div class="mt-1 text-600">Clothing</div>
            </div>
            <div class="mt-2 md:mt-0 flex align-items-center">
              <div
                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style="height: 8px"
              >
                <div class="bg-orange-500 h-full" style="width: 50%"></div>
              </div>
              <span class="text-orange-500 ml-3 font-medium">%50</span>
            </div>
          </li>
          <li
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
          >
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                >Portal Sticker</span
              >
              <div class="mt-1 text-600">Accessories</div>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style="height: 8px"
              >
                <div class="bg-cyan-500 h-full" style="width: 16%"></div>
              </div>
              <span class="text-cyan-500 ml-3 font-medium">%16</span>
            </div>
          </li>
          <li
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
          >
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                >Supernova Sticker</span
              >
              <div class="mt-1 text-600">Accessories</div>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style="height: 8px"
              >
                <div class="bg-pink-500 h-full" style="width: 67%"></div>
              </div>
              <span class="text-pink-500 ml-3 font-medium">%67</span>
            </div>
          </li>
          <li
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
          >
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                >Wonders Notebook</span
              >
              <div class="mt-1 text-600">Office</div>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style="height: 8px"
              >
                <div class="bg-green-500 h-full" style="width: 35%"></div>
              </div>
              <span class="text-green-500 ml-3 font-medium">%35</span>
            </div>
          </li>
          <li
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
          >
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                >Mat Black Case</span
              >
              <div class="mt-1 text-600">Accessories</div>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style="height: 8px"
              >
                <div class="bg-purple-500 h-full" style="width: 75%"></div>
              </div>
              <span class="text-purple-500 ml-3 font-medium">%75</span>
            </div>
          </li>
          <li
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
          >
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                >Robots T-Shirt</span
              >
              <div class="mt-1 text-600">Clothing</div>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style="height: 8px"
              >
                <div class="bg-teal-500 h-full" style="width: 40%"></div>
              </div>
              <span class="text-teal-500 ml-3 font-medium">%40</span>
            </div>
          </li>
        </ul> -->
      </div>
    </div>
    <div class="col-12 xl:col-6">
      <div class="card">
        <h5>Sales Overview</h5>
        <p v-if="!salesOverview.datasets.length">No data found</p>
        <Chart
          v-else
          type="line"
          :data="salesOverview"
          :options="lineOptions"
        />
      </div>
      <div class="card">
        <div class="flex align-items-center justify-content-between mb-4">
          <h5>Notifications</h5>
          <!-- <div>
            <Button
              icon="pi pi-ellipsis-v"
              class="p-button-text p-button-plain p-button-rounded"
              @click="$refs.menu1.toggle($event)"
            ></Button>
            <Menu ref="menu1" :popup="true" :model="items"></Menu>
          </div> -->
        </div>
        <p>No notification</p>
        <!-- <span class="block text-600 font-medium mb-3">TODAY</span>
        <ul class="p-0 mx-0 mt-0 mb-4 list-none">
          <li
            class="flex align-items-center py-2 border-bottom-1 surface-border"
          >
            <div
              class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0"
            >
              <i class="pi pi-dollar text-xl text-blue-500"></i>
            </div>
            <span class="text-900 line-height-3"
              >Richard Jones
              <span class="text-700"
                >has purchased a blue t-shirt for
                <span class="text-blue-500">79$</span></span
              >
            </span>
          </li>
          <li class="flex align-items-center py-2">
            <div
              class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0"
            >
              <i class="pi pi-download text-xl text-orange-500"></i>
            </div>
            <span class="text-700 line-height-3"
              >Your request for withdrawal of
              <span class="text-blue-500 font-medium">2500$</span> has been
              initiated.</span
            >
          </li>
        </ul>

        <span class="block text-600 font-medium mb-3">YESTERDAY</span>
        <ul class="p-0 m-0 list-none">
          <li
            class="flex align-items-center py-2 border-bottom-1 surface-border"
          >
            <div
              class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0"
            >
              <i class="pi pi-dollar text-xl text-blue-500"></i>
            </div>
            <span class="text-900 line-height-3"
              >Keyser Wick
              <span class="text-700"
                >has purchased a black jacket for
                <span class="text-blue-500">59$</span></span
              >
            </span>
          </li>
          <li
            class="flex align-items-center py-2 border-bottom-1 surface-border"
          >
            <div
              class="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0"
            >
              <i class="pi pi-question text-xl text-pink-500"></i>
            </div>
            <span class="text-900 line-height-3"
              >Jane Davis
              <span class="text-700"
                >has posted a new questions about your product.</span
              >
            </span>
          </li>
        </ul> -->
      </div>
      <!-- <div
        class="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
        style="
          border-radius: 1rem;
          background: linear-gradient(
              0deg,
              rgba(0, 123, 255, 0.5),
              rgba(0, 123, 255, 0.5)
            ),
            linear-gradient(92.54deg, #1c80cf 47.88%, #ffffff 100.01%);
        "
      >
        <div>
          <div class="text-blue-100 font-medium text-xl mt-2 mb-3">
            TAKE THE NEXT STEP
          </div>
          <div class="text-white font-medium text-5xl">Try PrimeBlocks</div>
        </div>
        <div class="mt-4 mr-auto md:mt-0 md:mr-0">
          <a
            href="https://www.primefaces.org/primeblocks-vue"
            class="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised"
          >
            Get Started
          </a>
        </div>
      </div> -->
    </div>
  </div>
  <Toast />
</template>
