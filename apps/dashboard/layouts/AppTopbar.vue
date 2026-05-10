<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useLayout } from "./composables/layout";
import { useRouter } from "vue-router";
import { storageNames, builderStorageNames } from "~/utils/constants";
import { getBrands } from "~/services/BrandServices";
import { getAuthData, showCustomToast } from "~/utils/utilsFunction";
import type { authType } from "~/types/authData";
import type { BrandType } from "~/types/brandData";
import { useBrandStore } from "~/stores/Brand";

const { onMenuToggle } = useLayout();
const toast = useToast();
const outsideClickListener = ref(null);
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const topbarState = ref(false);
const brandStore = useBrandStore();
const brands = ref<BrandType[]>([]);
const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(true);
const selectedBrand = ref<BrandType | null>(null);

onMounted(() => {
  bindOutsideClickListener();
});
onBeforeUnmount(() => {
  unbindOutsideClickListener();
});
const logoUrl = computed(() => {
  return `${runtimeConfig.public.baseUrl}/layout/images/favicon.png`;
});

const onTopBarMenuButton = (): void => {
  setTimeout(() => {
    topbarState.value = !topbarState.value;
  }, 200);
};

// const onSettingsClick = async (): Promise<void> => {
//   topbarState.value = false;
//   await router.push("/utilities/documentation");
// };

const topbarMenuClasses = computed(() => {
  return {
    "layout-topbar-menu-mobile-active": topbarState.value,
  };
});

const bindOutsideClickListener = (): void => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarState.value = false;
      }
    };

    document.addEventListener("click", outsideClickListener.value);
  }
};

const unbindOutsideClickListener = (): void => {
  if (outsideClickListener.value) {
    document.removeEventListener("click", outsideClickListener);
    outsideClickListener.value = null;
  }
};

const isOutsideClicked = (event: any): boolean => {
  if (!topbarState.value) return false;
  const sidebarEl = document.querySelector(".layout-topbar-menu");
  const topbarEl = document.querySelector(".layout-topbar-menu-button");

  return !(
    sidebarEl?.isSameNode(event.target as Node | null) ??
    sidebarEl?.contains(event.target as Node | null) ??
    topbarEl?.isSameNode(event.target as Node | null) ??
    topbarEl?.contains(event.target as Node | null)
  );
};

const logout = (): void => {
  Object.values(storageNames).forEach((key) => {
    localStorage.removeItem(key);
  });

  Object.values(builderStorageNames).forEach((key) => {
    localStorage.removeItem(key);
  });

  window.location.href = `${runtimeConfig.public.baseUrl}auth/login`;
};

const getDataBrand = async (): Promise<void> => {
  if (!dataAuth.value) return;
  const body = new FormData();
  if (selectedBrand.value?.id) {
    body.append("selectedBrand", selectedBrand.value.id as string);
  }

  const { success, msg, data } = await getBrands({
    token: dataAuth.value.token,
    body,
  });

  isLoading.value = false;

  if (!success) {
    showCustomToast(toast, msg);
  } else if (data) {
    brands.value = data.brands;
    brandStore.saveBrands(data.brands);
    if (data.brands.length) {
      if (!selectedBrand.value?.id) {
        selectedBrand.value = data.brands[0];
        localStorage.setItem(
          storageNames.storeSelectedBrandId as string,
          JSON.stringify(selectedBrand.value)
        );
        brandStore.setSelectedBrand(data.brands[0]);
      } else {
        const _selectedBrand = data.brands.find(
          (brand) => brand.id === selectedBrand.value?.id
        );
        if (_selectedBrand) {
          selectedBrand.value = _selectedBrand;
        }
      }
    }
  }
};

const onBrandChange = (): void => {
  if (selectedBrand.value) {
    localStorage.setItem(
      storageNames.storeSelectedBrandId as string,
      JSON.stringify(selectedBrand.value)
    );
    brandStore.setSelectedBrand(selectedBrand.value);
  }
};

onMounted(async () => {
  const auth = getAuthData();

  const savedSelectedBrand = localStorage.getItem(
    storageNames.storeSelectedBrandId as string
  );
  if (savedSelectedBrand) {
    const parsed = JSON.parse(savedSelectedBrand);
    selectedBrand.value = parsed;
    brandStore.setSelectedBrand(parsed);
  }

  if (auth) {
    dataAuth.value = auth;
    await getDataBrand();
  }
});
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img :src="logoUrl" alt="logo" />
      <!-- <span>Felio.ID</span> -->
    </router-link>

    <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle()"
    >
      <i class="pi pi-bars"></i>
    </button>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      @click="onTopBarMenuButton()"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <Dropdown
      v-if="brands.length"
      v-model="selectedBrand"
      :options="brands"
      optionLabel="name"
      placeholder="Select Brand"
      class="mr-3"
      @change="onBrandChange"
    />

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-calendar"></i>
        <span>Calendar</span>
      </button> -->
      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button>
      <!-- <button @click="onSettingsClick()" class="p-link layout-topbar-button">
        <i class="pi pi-sign-out"></i>
        <span>Logout</span>
      </button> -->
      <button @click="logout()" class="p-link layout-topbar-button">
        <i class="pi pi-sign-out"></i>
        <span>Logout</span>
      </button>
    </div>
  </div>
  <Toast />
</template>

<style lang="scss" scoped></style>
