<script setup lang="ts">
import type { WebsiteType } from "~/pages/brand/index.vue";
import type { fetchDataType, fetchGetWebsitesType } from "~/types/fetchData";
import { dialogType } from "~/types/formType";
import type { BrandType } from "~/types/brandData";
import { useMainStore } from "~/stores/main";

export interface AddBrandWebsiteInputState {
  selectedWebsite: WebsiteType | null;
  websites?: WebsiteType[];
  isLoading: boolean;
}

interface DialogAddBrandWebsiteState {
  showDialog: boolean;
  inputState: AddBrandWebsiteInputState;
}

export interface BrandWebsiteDetailDataState {
  website: WebsiteType | null;
  isLoading: boolean;
  removeWebsite: () => void;
}

interface DialogBrandWebsiteDetail {
  showDialog: boolean;
  dataState: BrandWebsiteDetailDataState;
}

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const mainStore = useMainStore();

const props = defineProps<{
  idBrand?: BrandType;
  websites: WebsiteType[];
  addWebsite: (website: WebsiteType, idBrand?: string) => void;
  removeWebsite: (idWebsite: string) => void;
}>();

const dialogAddBrandWebsiteState = ref<DialogAddBrandWebsiteState>({
  showDialog: false,
  inputState: {
    isLoading: false,
    selectedWebsite: null,
  },
});

const removeWebsiteBrand = async (): Promise<void> => {
  if (dialogDetailState.value.dataState.website) {
    dialogDetailState.value.dataState.isLoading = true;
    const auth = getAuthData();

    const body = new FormData();
    body.append(
      "idWebsite",
      (dialogDetailState.value.dataState.website.id || "") as string
    );

    const response = await $fetch(
      `${runtimeConfig.public.sellerApi}brand/removeWebsite`,
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
        body,
      }
    );

    dialogDetailState.value.dataState.isLoading = false;

    if (!response) {
      showCustomToast(toast);
    } else {
      const dataBind: fetchDataType | null = JSON.parse(response as string);

      if (dataBind) {
        if (!dataBind.success) {
          showCustomToast(toast, dataBind.msg);
        } else {
          props.removeWebsite(
            (dialogDetailState.value.dataState.website?.id || "") as string
          );
          dialogDetailState.value.showDialog = false;
          dialogAddBrandWebsiteState.value.inputState.websites = [];
        }
      } else {
        showCustomToast(toast);
      }
    }
  }
};

const dialogDetailState = ref<DialogBrandWebsiteDetail>({
  showDialog: false,
  dataState: {
    website: null,
    isLoading: false,
    removeWebsite: removeWebsiteBrand,
  },
});

const openWebsiteList = async (): Promise<void> => {
  if (dialogAddBrandWebsiteState.value.inputState.websites?.length) {
    dialogAddBrandWebsiteState.value.showDialog = true;
  } else {
    dialogAddBrandWebsiteState.value.inputState.isLoading = true;
    const auth = getAuthData();

    const response = await $fetch(
      `${runtimeConfig.public.sellerApi}brand/getAvailableWebsites`,
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      }
    );

    dialogAddBrandWebsiteState.value.inputState.isLoading = false;

    if (!response) {
      showCustomToast(toast);
    } else {
      const dataBind: fetchGetWebsitesType | null = JSON.parse(
        response as string
      );

      if (dataBind) {
        if (!dataBind.success) {
          showCustomToast(toast, dataBind.msg);
        } else {
          dialogAddBrandWebsiteState.value = {
            showDialog: true,
            inputState: {
              ...dialogAddBrandWebsiteState.value.inputState,
              websites: dataBind.data.websites,
            },
          };
        }
      } else {
        showCustomToast(toast);
      }
    }
  }
};

const setWebsiteBrand = async (): Promise<void> => {
  if (dialogAddBrandWebsiteState.value.inputState.selectedWebsite) {
    dialogAddBrandWebsiteState.value.inputState.isLoading = true;
    const auth = getAuthData();

    const body = new FormData();
    body.append(
      "idWebsite",
      (dialogAddBrandWebsiteState.value.inputState.selectedWebsite.id ||
        "") as string
    );
    if (props.idBrand) {
      body.append("idBrand", props.idBrand);
    }

    const response = await $fetch(
      `${runtimeConfig.public.sellerApi}brand/setWebsite`,
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
        body,
      }
    );

    dialogAddBrandWebsiteState.value.inputState.isLoading = false;

    if (!response) {
      showCustomToast(toast);
    } else {
      const dataBind: fetchDataType | null = JSON.parse(response as string);

      if (dataBind) {
        if (!dataBind.success) {
          showCustomToast(toast, dataBind.msg);
        } else {
          props.addWebsite(
            dialogAddBrandWebsiteState.value.inputState.selectedWebsite,
            dataBind.data.idBrand
          );
          dialogAddBrandWebsiteState.value.inputState.websites =
            dialogAddBrandWebsiteState.value.inputState.websites?.filter(
              (web) =>
                web.id !==
                dialogAddBrandWebsiteState.value.inputState.selectedWebsite?.id
            );
          dialogAddBrandWebsiteState.value.showDialog = false;
        }
      } else {
        showCustomToast(toast);
      }
    }
  }
};

const showDetailWebsite = (website: WebsiteType): void => {
  dialogDetailState.value = {
    showDialog: true,
    dataState: {
      ...dialogDetailState.value.dataState,
      website,
    },
  };
};
</script>
<template>
  <div class="col-12">
    <div class="card grid">
      <div class="col-12 flex justify-content-center">
        <h3>Website</h3>
      </div>
      <div
        v-for="(website, i) in websites"
        :key="i"
        class="col-6 md:col-4 xl:col-3 mb-2 px-2"
        @click="showDetailWebsite(website)"
      >
        <Image v-if="website.thumbnail" alt="Image">
          <template #image>
            <img
              :src="website.thumbnail"
              style="width: 100%; border-radius: 12px"
            />
          </template>
        </Image>
        <p class="mt-2">{{ website.websiteName }}</p>
      </div>
      <div class="col-12 flex-auto flex-column m-4 text-center">
        <Button
          v-if="
            mainStore.userPermissions?.some(
              (perm) => perm === 'brand-website:add'
            )
          "
          label="Tambah Website"
          raised
          severity="info"
          class="w-2"
          :loading="dialogAddBrandWebsiteState.inputState.isLoading"
          @click="openWebsiteList()"
        ></Button>
      </div>
    </div>
  </div>

  <CustomDialogUI
    v-model:dialogState="dialogAddBrandWebsiteState.showDialog"
    v-model:addBrandWebsiteInputState="dialogAddBrandWebsiteState.inputState"
    header="Pilih Website"
    :width="80"
    :type="dialogType.form"
    :isLoading="dialogAddBrandWebsiteState.inputState.isLoading"
    cancelButtonText="Batal"
    :cancelButtonAction="() => (dialogAddBrandWebsiteState.showDialog = false)"
    successButtonText="Simpan"
    :successButtonAction="() => setWebsiteBrand()"
  ></CustomDialogUI>

  <CustomDialogUI
    v-model:dialogState="dialogDetailState.showDialog"
    v-model:brand-website-detail="dialogDetailState.dataState"
    header="Detail Website"
    :width="60"
    :type="dialogType.form"
  ></CustomDialogUI>
</template>
