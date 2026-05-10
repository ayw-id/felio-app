<script setup lang="ts">
import AppTopbar from "./AppTopbar.vue";
import AppFooter from "./AppFooter.vue";
import AppSidebar from "./AppSidebar.vue";
import { useLayout } from "./composables/layout";

import { useMainStore } from "~/stores/main";
import { getNavMenus } from "~/utils/utilsFunction";

import type {
  fetchAvailableServiceType,
  fetchMerchantAccountType,
  fetchSendMessageType,
  FetchEmployeePermissions,
} from "~/types/fetchData";

import ProgressSpinner from "primevue/progressspinner";

import type { parentMenuType } from "~/types/navigation";
import type { authType } from "~/types/authData";

import { storageNames } from "~/utils/constants";
import { useBrandStore } from "~/stores/Brand";
import { apiRequest } from "~/services/APIService";

const toast = useToast();
const runtimeConfig = useRuntimeConfig();
const mainStore = useMainStore();
const route = useRoute();
const router = useRouter();
const brandStore = useBrandStore();

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref(null);

const dataAuth = ref<authType | null>(null);
const dataAuthTemp = ref<authType | null>(null);
const selectedMenu = ref<parentMenuType | null>(null);
const otherPaths = ref<parentMenuType[]>([
  {
    label: "Login",
    to: "/auth/login",
  },
  {
    label: "Registrasi",
    to: "/auth/registration",
  },
  {
    label: "Lupa Password",
    to: "/auth/forgot-password",
  },
  {
    icon: "mdi-account",
    label: "Akun Saya",
    to: "/account",
    redirect: false,
  },
  {
    label: "Verifikasi Akun",
    to: "/account/verification",
  },
  {
    label: "Registrasi Event",
    to: "/auth/register_event",
  },
]);
const title = ref<string>("Dashboard");
const authPath = ref<string[]>([
  "/auth/login",
  "/auth/login/",
  "/auth/registration",
  "/auth/registration/",
  "/auth/forgot-password",
  "/auth/forgot-password/",
  "/auth/register_event",
  "/auth/register_event/",
]);
const loading = ref<boolean>(true);
const loadingMenu = ref<boolean>(true);

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener();
  } else {
    unbindOutsideClickListener();
  }
});

const hideLayout = computed(() => {
  return ['/auth/login', '/auth/login/'].includes(route.path);
});

const containerClass = computed(() => {
  return {
    "layout-theme-light": !layoutConfig.darkTheme.value,
    "layout-theme-dark": layoutConfig.darkTheme.value,
    "layout-overlay": layoutConfig.menuMode.value === "overlay",
    "layout-static": layoutConfig.menuMode.value === "static",
    "layout-static-inactive":
      layoutState.staticMenuDesktopInactive.value &&
      layoutConfig.menuMode.value === "static",
    "layout-overlay-active": layoutState.overlayMenuActive.value,
    "layout-mobile-active": layoutState.staticMenuMobileActive.value,
    "p-ripple-disabled": !layoutConfig.ripple.value,
  };
});
const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive.value = false;
        layoutState.staticMenuMobileActive.value = false;
        layoutState.menuHoverActive.value = false;
      }
    };
    document.addEventListener("click", outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener("click", outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event: any): boolean => {
  const sidebarEl = document.querySelector(".layout-sidebar");
  const topbarEl = document.querySelector(".layout-menu-button");

  return !(
    sidebarEl?.isSameNode(event.target as Node | null) ??
    sidebarEl?.contains(event.target as Node | null) ??
    topbarEl?.isSameNode(event.target as Node | null) ??
    topbarEl?.contains(event.target as Node | null)
  );
};

const getMenus = computed(() => getNavMenus(mainStore.availableServices));

// const getProfile = computed(
//   () => `${runtimeConfig.public.urlAssets}images/person1.png`
// );

const getAvailableServices = async (): Promise<void> => {
  const data = await $fetch(
    `${runtimeConfig.public.sellerApi}services/getAvailableService`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token}`,
      },
    }
  );

  loading.value = false;
  loadingMenu.value = false;

  if (!data) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchAvailableServiceType | null = JSON.parse(
      data as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        mainStore.setAvailableServices(dataBind.data);
      }
    } else {
      showCustomToast(toast);
    }
  }
};

// const menuClicked = (menu: parentMenuType, param: number): void => {
//   if (param === 0) {
//     selectedMenu.value = menu;
//   }
//   if (menu.to) {
//     if (menu.redirect) {
//       window.location.href = `${process.env.WEBSITE_URL}${menu.to}`;
//     } else {
//       router.push(menu.to);
//     }

//     selectedMenu.value = null;
//   }
// };

const checkAgentMerchant = async (): Promise<void> => {
  const authToken: string = dataAuth.value?.token || "";
  const data = await $fetch(
    `${runtimeConfig.public.agentMerchantApi}auth/getMerchantAccount`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  loading.value = false;

  if (!data) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchMerchantAccountType | null = JSON.parse(
      data as string
    );
    if (dataBind) {
      if (dataBind.success === 0) {
        showCustomToast(toast, dataBind.msg);
      } else if (dataBind.success === 1) {
        if (dataAuth.value) {
          dataAuth.value.tokenAgentMerchant = dataBind.data?.newMerchantToken;
        }

        localStorage.setItem("dataAuth", JSON.stringify(dataAuth));
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const getDataAuth = (): void => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    const parsedDataAuth = JSON.parse(dataAuth_);
    if (parsedDataAuth) {
      dataAuth.value = parsedDataAuth;
    }
  }
};

const getDataAuthTemp = (): void => {
  const auth = localStorage.getItem(storageNames.tempSellerToken as string);
  if (auth) {
    const parsedAuth = JSON.parse(auth);
    if (parsedAuth) {
      dataAuthTemp.value = parsedAuth;
    }
  }
};

const joinAgent = async (token: string): Promise<void> => {
  const body = new FormData();
  const authToken: string = dataAuth.value?.token || "";
  body.append("token", authToken);
  body.append("join_agent_token", token);
  const { data, error } = await useFetch(
    `${runtimeConfig.agentMemberApi}auth/register_member`,
    {
      body,
    }
  );

  if (error.value) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchSendMessageType | null = JSON.parse(
      data.value as string
    );
    if (dataBind) {
      if (dataBind.success === 1) {
        removeJoinAgentToken();
        window.location.href = `${runtimeConfig.public.rootUrl}/my-shop/brand`;
      } else if (dataBind.success === 2) {
        removeJoinAgentToken();
        showCustomToast(toast, dataBind.msg);
      } else {
        showCustomToast(toast, dataBind.msg);
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const removeJoinAgentToken = (): void => {
  const felioLocalStorage = localStorage.getItem("felioLocalStorage");
  let parsedFelioLocalStorage = null;
  if (felioLocalStorage) {
    parsedFelioLocalStorage = JSON.parse(felioLocalStorage);
    if (parsedFelioLocalStorage) {
      delete parsedFelioLocalStorage.join_agent_token;
    }
  }
  localStorage.setItem(
    "felioLocalStorage",
    JSON.stringify(parsedFelioLocalStorage)
  );
};

// const goToProfile = (): void => {
//   let exist = false;
//   for (let a = 0; a < otherPaths.value.length; a++) {
//     if (otherPaths.value[a].to === "/account") {
//       exist = true;
//     }
//   }
//   if (exist) {
//     router.push("/account");
//   } else {
//     window.location.href = `${runtimeConfig.public.rootUrl}/account`;
//   }
// };

const changeTitle = (path: string): void => {
  title.value = "";
  getMenus.value.forEach((item, key) => {
    if (item.to === path && item.redirect === false) {
      title.value = item.label;
    }
    // else if (item.child !== null) {
    //   item.child?.forEach((item1, key1) => {
    //     if (item1.to === path && item1.redirect === false) {
    //       title.value = item1.title;
    //     }
    //   });
    // }
  });
  if (title.value === "") {
    for (let a = 0; a < otherPaths.value.length; a++) {
      if (path === otherPaths.value[a].to) {
        title.value = otherPaths.value[a].label;
      }
    }
  }
  title.value = title.value === "" ? "Felio.id" : title.value;
};

const trackLink = async (): Promise<void> => {
  const code = route.query.c || ("" as string);
  if (code) {
    await useFetch(
      `${runtimeConfig.public.marketingApi}tracker/updateCountByCode/${code}`
    );
  }
};

const getAgentMerchantProfile = async (): Promise<void> => {
  // get data and then store it to agentMerchantStore
};

const getAgentMemberProfile = async (): Promise<void> => {
  // get data and then store it to agentMemberStore
};

const getPermissionList = async (): Promise<void> => {
  if (brandStore.selectedBrand?.id) {
    const body = new FormData();
    body.append("idBrand", brandStore.selectedBrand.id as string);

    const response = await apiRequest<FetchEmployeePermissions>(
      `${runtimeConfig.public.sellerApi}employee/getEmployeePermissions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${dataAuth.value?.token}`,
        },
        body,
      }
    );

    if (!response.success) {
      showCustomToast(toast, response.msg);
    } else if (response.data) {
      mainStore.setUserPermissions(response.data.permissions);
    }
  }
};

watch(
  [() => brandStore.selectedBrand, () => dataAuth.value?.token],
  async (newBrand) => {
    if (newBrand && dataAuth.value?.token) {
      await getPermissionList();
    }
  },
  { immediate: false }
);

onMounted(async () => {
  await trackLink();
  getDataAuth();
  getDataAuthTemp();
  router.beforeEach((to, from, next) => {
    if (to.path === "/faq") {
      changeTitle(to.path as string);
      next();
    } else if (authPath.value.includes(to.path as string)) {
      if (!dataAuth.value) {
        changeTitle(to.path as string);
        next();
      } else {
        changeTitle("/");
        next("/");
      }
    } else if (dataAuth.value) {
      changeTitle(to.path as string);
      next();
    } else {
      changeTitle("/auth/login");
      next("/auth/login");
    }
  });

  if (!dataAuth.value) {
    if (!dataAuthTemp.value && !authPath.value.includes(route.path as string)) {
      window.location.href = `${runtimeConfig.public.baseUrl}auth/login`;
    } else if (dataAuthTemp.value && !route.path.includes("/auth/services")) {
      window.location.href = `${runtimeConfig.public.baseUrl}auth/services`;
    }
  } else {
    const authRedirect = localStorage.getItem(
      storageNames.authRedirect as string
    );
    if (authRedirect) {
      if (
        !route.path.includes("/auth/services") &&
        ["DSTORE", "AGENT", "BUILDER", "RESTO"].includes(authRedirect)
      ) {
        window.location.href = `${runtimeConfig.public.baseUrl}auth/services`;
      }
    } else {
      if (
        authPath.value.includes(route.path as string) ||
        route.path.includes("/auth/services")
      ) {
        router.push("/");
      } else {
        // getChatToken();
        // getAllMessages();
        const promise = [
          getAvailableServices(),
          getAgentMerchantProfile(),
          getAgentMemberProfile(),
        ];
        // only member area
        const felioLocalStorage = localStorage.getItem("felioLocalStorage");
        if (felioLocalStorage) {
          const parsedFelioLocalStorage = JSON.parse(felioLocalStorage);
          if (parsedFelioLocalStorage) {
            if (parsedFelioLocalStorage.joinAgentToken) {
              promise.push(
                joinAgent(parsedFelioLocalStorage.joinAgentToken as string)
              );
              promise.push(checkAgentMerchant());
            }
          }
        } else {
          promise.push(checkAgentMerchant());
        }

        await Promise.all(promise);
      }
    }
  }

  loading.value = false;
});
</script>

<template>
  <div
    v-if="loading"
    class="text-center"
    style="height: 400px; align-content: center"
    :class="containerClass"
  >
    <ProgressSpinner />
  </div>

  <div v-else class="layout-wrapper" :class="dataAuth ? containerClass : ''">
    <app-topbar v-if="dataAuth && !hideLayout"></app-topbar>
    <div v-if="dataAuth && !hideLayout" class="layout-sidebar">
      <app-sidebar></app-sidebar>
    </div>
    <div :class="dataAuth && !hideLayout ? 'layout-main-container' : ''">
      <div class="layout-main">
        <router-view></router-view>
      </div>
      <app-footer v-if="dataAuth && !hideLayout"></app-footer>
    </div>
    <!-- <app-config></app-config> -->
    <div class="layout-mask"></div>
  </div>
  <Toast />
</template>

<style lang="scss" scoped></style>
