<script setup lang="ts">
import type { authType } from "~/types/authData";
import { getAuthData, showCustomToast } from "~/utils/utilsFunction";
import type {
  fetchDataBrandType,
  FetchSaveDataBrandType,
} from "~/types/fetchData";
import { dialogType } from "~/types/formType";
import type { BrandType, BrandInputState } from "~/types/brandData";
import { FormType } from "~/types/brandData";
import type { ProfileBrandType } from "~/types/userData";
import {
  defaultDataBrand,
  getSaveDataBrandBody,
  initializeForm,
  InputType,
  validateSaveBrandChanges,
  validateSaveBrandData,
} from "./utils";
import type { websiteType } from "~/types/websiteData";
import { getBrands, saveBrand } from "~/services/BrandServices";
import { useBrandStore } from "~/stores/Brand";
import { useMainStore } from "~/stores/main";

export interface WebsiteType extends websiteType {
  lastPublishedUpdate?: string;
  isPublished?: boolean;
}

export interface DialogDataState {
  showCustomDialog: boolean;
  showAddressDialog: boolean;
  title: string;
  type: InputType;
}

interface LeaveConfirmationDialog {
  show: boolean;
  to?: any;
}

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const router = useRouter();
const brandStore = useBrandStore();
const mainStore = useMainStore();

const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(false);
const dataChanged = ref<boolean>(false);
const needReload = ref<boolean>(false);
const leaveConfirmationDialog = ref<LeaveConfirmationDialog>({
  show: false,
});

const selectedBrand = ref<BrandType | null>(null);
const profile = ref<ProfileBrandType | null>(null);

const dialogInputState = ref<BrandInputState>({
  data: "",
  countryCode: null,
  type: FormType.basic,
});

const dialogDataState = ref<DialogDataState>({
  showCustomDialog: false,
  showAddressDialog: false,
  title: "",
  type: InputType.name,
});

const getDataBrand = async (): Promise<void> => {
  const { success, msg, data } = await getBrands({
    token: dataAuth.value?.token,
  });

  isLoading.value = false;

  if (success) {
    brandStore.saveBrands(data.brands);
  } else {
    showCustomToast(toast, msg);
  }
};

const openForm = (type: InputType, index?: number): void => {
  const {
    data,
    callingCode,
    formType,
    titleInput,
    titleDialog,
    addressInputState,
  } = initializeForm(type, selectedBrand.value, index);

  dialogInputState.value.title = titleInput;
  dialogInputState.value.data = data;
  dialogInputState.value.countryCode = callingCode;
  dialogInputState.value.type = formType;
  dialogInputState.value.index = index;
  dialogInputState.value.addressInputState = addressInputState;

  dialogDataState.value.title = titleDialog;
  dialogDataState.value.type = type;
  dialogDataState.value.showCustomDialog = type !== InputType.address;
  dialogDataState.value.showAddressDialog = type === InputType.address;
};

const saveData = (): void => {
  if (!selectedBrand.value) {
    selectedBrand.value = defaultDataBrand;
  }
  const error = validateSaveBrandData(
    dialogDataState.value,
    dialogInputState.value,
    selectedBrand.value
  );

  if (error) {
    showCustomToast(toast, error);
  } else {
    dialogDataState.value.showCustomDialog = false;
    dialogDataState.value.showAddressDialog = false;
    dataChanged.value = true;
  }
};

const deleteOtherData = (type: InputType, index: number): void => {
  if (brand.value) {
    if (type === InputType.otherSocial) {
      brand.value.otherSocials.splice(index, 1);
    } else if (type === InputType.otherMP) {
      brand.value.otherMPs.splice(index, 1);
    }
    dataChanged.value = true;
  }
};

const saveChanges = async (): Promise<void> => {
  const error = validateSaveBrandChanges(selectedBrand.value);
  if (error) {
    showCustomToast(toast, error);
  } else {
    const body = getSaveDataBrandBody(selectedBrand.value);

    isLoading.value = false;

    const { success, msg, data } = await saveBrand({
      token: dataAuth.value?.token,
      body,
    });

    if (success) {
      if (!selectedBrand.value?.id && data.idBrand) {
        needReload.value = true;
        selectedBrand.value.id = data.idBrand;
      }
      showCustomToast(toast, "", true);
      needReload.value = true;
      dataChanged.value = false;
    } else {
      showCustomToast(toast, msg);
    }
  }
};

const confirmRedirect = (): void => {
  dataChanged.value = false;
  leaveConfirmationDialog.value.show = false;
  router.push(leaveConfirmationDialog.value.to.fullPath);
};

onBeforeRouteLeave((to, from, next) => {
  if (dataChanged.value) {
    leaveConfirmationDialog.value = {
      show: true,
      to,
    };
    next(false);
  } else {
    next();
  }
});

onMounted(() => {
  window.addEventListener("beforeunload", function (event) {
    if (dataChanged.value) {
      // Cancel the event
      event.preventDefault();
      // Chrome requires returnValue to be set
      event.returnValue = "";

      // Show alert
      alert("Are you sure you want to leave this page?");
    }
  });

  const auth = getAuthData();

  if (auth) {
    dataAuth.value = auth;
  }
});

const addWebsite = (website: WebsiteType, idBrand?: string): void => {
  if (selectedBrand.value?.websiteBrand) {
    selectedBrand.value = {
      ...selectedBrand.value,
      websiteBrand: [website, ...selectedBrand.value.websiteBrand],
      id: idBrand,
    };
    needReload.value = true;
  }
};

const removeWebsite = (idWebsite: string, idBrand?: string): void => {
  if (idBrand && !selectedBrand.value?.id) {
    needReload.value = true;
    selectedBrand.value.id = idBrand;
  }
  if (selectedBrand.value?.websiteBrand) {
    selectedBrand.value.websiteBrand = selectedBrand.value.websiteBrand.filter(
      (web) => web.id !== idWebsite
    );
  }
};

const openBrandDetail = (brand: BrandType): void => {
  selectedBrand.value = JSON.parse(JSON.stringify(brand));
};

const back = async (): void => {
  if (needReload.value) {
    isLoading.value = true;
    await getDataBrand();
  }

  selectedBrand.value = null;
  dataChanged.value = false;
};
</script>
<template>
  <div
    v-if="isLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else-if="!selectedBrand" class="grid">
    <div
      v-if="
        mainStore.userPermissions?.some((perm) => perm === 'brand-info:add')
      "
      class="col-12"
    >
      <div class="card grid">
        <div class="col-12 flex flex-column">
          <Button
            @click="
              selectedBrand = JSON.parse(JSON.stringify(defaultDataBrand))
            "
            severity="default"
            class="w-2"
            icon="pi pi-plus"
            label="Tambah Brand"
          ></Button>
        </div>
      </div>
    </div>

    <div
      v-for="(brand, i) in brandStore.brands"
      :key="i"
      class="col-12 md:col-4 lg:col-2"
    >
      <BrandBox :brand="brand" :openBrandDetail="openBrandDetail" />
    </div>
  </div>
  <div v-if="selectedBrand" class="mt-2 grid p-fluid">
    <div class="col-12">
      <div class="card grid">
        <div class="col-12 flex flex-column">
          <Button
            @click="back()"
            severity="default"
            class="w-2"
            style="background-color: black"
            label="Kembali"
          ></Button>
        </div>
      </div>
    </div>
    <BrandData
      v-model:brand="selectedBrand"
      v-model:data-changed="dataChanged"
      :open-form="openForm"
    />
    <BrandWebsite
      :idBrand="selectedBrand?.id"
      :websites="selectedBrand?.websiteBrand || []"
      :add-website="addWebsite"
      :remove-website="removeWebsite"
    />
    <div class="col-12">
      <div class="card grid">
        <div class="col-12 flex flex-column m-4">
          <Label class="text-md"
            >Instagram
            <Icon
              @click="openForm(InputType.ig)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">
            {{ selectedBrand?.instagram || "-" }}
          </p>
        </div>
        <div class="col-12 flex flex-column m-4">
          <Label class="text-md"
            >Facebook
            <Icon
              @click="openForm(InputType.fb)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">
            {{ selectedBrand?.facebook || "-" }}
          </p>
        </div>
        <div class="col-12 flex flex-column m-4">
          <Label class="text-md"
            >Twitter
            <Icon
              @click="openForm(InputType.twitter)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">{{ selectedBrand?.twitter || "-" }}</p>
        </div>
        <div class="col-12 flex flex-column m-4">
          <Label class="text-md"
            >Tiktok
            <Icon
              @click="openForm(InputType.tiktok)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">{{ selectedBrand?.tiktok || "-" }}</p>
        </div>
        <div
          v-for="(social, i) in selectedBrand?.otherSocials || []"
          :key="i"
          class="col-12 flex flex-column m-4"
        >
          <Label class="text-md"
            >{{ social.social }}
            <Icon
              @click="openForm(InputType.otherSocial, i)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">{{ social.link }}</p>
          <Button
            @click="deleteOtherData(InputType.otherSocial, i)"
            severity="danger"
            label="Hapus"
            class="w-1"
          ></Button>
        </div>
        <div class="col-12 flex flex-column m-4">
          <Button
            @click="openForm(InputType.otherSocial)"
            severity="info"
            outlined
            class="w-3"
            label="Tambah Link Social Media"
          ></Button>
        </div>
      </div>
    </div>
    <div class="col-12" :class="`${dataChanged && 'mb-8'}`">
      <div class="card grid">
        <div class="col-12 flex flex-column m-4">
          <Label class="text-md"
            >Shopee
            <Icon
              @click="openForm(InputType.shopee)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">{{ selectedBrand?.shopee || "-" }}</p>
        </div>
        <div class="col-12 flex flex-column m-4">
          <Label class="text-md"
            >Tokopedia
            <Icon
              @click="openForm(InputType.tokopedia)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">
            {{ selectedBrand?.tokopedia || "-" }}
          </p>
        </div>
        <div class="col-12 flex flex-column m-4">
          <Label class="text-md"
            >Bukalapak
            <Icon
              @click="openForm(InputType.bukalapak)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">
            {{ selectedBrand?.bukalapak || "-" }}
          </p>
        </div>
        <div class="col-12 flex flex-column m-4">
          <Label class="text-md"
            >Blibli
            <Icon
              @click="openForm(InputType.blibli)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">{{ selectedBrand?.blibli || "-" }}</p>
        </div>
        <div class="col-12 flex flex-column m-4">
          <Label class="text-md"
            >Lazada
            <Icon
              @click="openForm(InputType.lazada)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">{{ selectedBrand?.lazada || "-" }}</p>
        </div>
        <div
          v-for="(mp, i) in selectedBrand?.otherMPs || []"
          :key="i"
          class="col-12 flex flex-column m-4"
        >
          <Label class="text-md"
            >{{ mp.marketPlace }}
            <Icon
              @click="openForm(InputType.otherMP, i)"
              class="pi pi-pencil"
              shape="circle"
              style="color: rgb(14 165 233)"
            ></Icon
          ></Label>
          <p class="text-xl font-medium">{{ mp.link }}</p>
          <Button
            @click="deleteOtherData(InputType.otherMP, i)"
            severity="danger"
            label="Hapus"
            class="w-1"
          ></Button>
        </div>
        <div class="col-12 flex flex-column m-4">
          <Button
            @click="openForm(InputType.otherMP)"
            severity="info"
            outlined
            class="w-3"
            label="Tambah Link Market Place"
          ></Button>
        </div>
      </div>
    </div>
    <div
      v-if="dataChanged"
      style="position: fixed; bottom: 0; left: 50%"
      class="card w-3 pb-2 flex justify-content-center"
    >
      <Button
        @click="saveChanges()"
        label="Simpan Perubahan"
        class="w-full"
      ></Button>
    </div>
  </div>
  <CustomDialogUI
    v-model:dialogState="dialogDataState.showCustomDialog"
    v-model:brandInputState="dialogInputState"
    :header="dialogDataState.title"
    :width="25"
    :type="dialogType.form"
    cancelButtonText="Batal"
    :cancelButtonAction="() => (dialogDataState.showCustomDialog = false)"
    successButtonText="Simpan"
    :successButtonAction="() => saveData()"
  ></CustomDialogUI>

  <CustomDialogUI
    v-model:dialogState="dialogDataState.showAddressDialog"
    :header="`Alamat Kantor`"
    :width="48"
    :type="dialogType.form"
    :cancelButtonAction="() => (dialogDataState.showAddressDialog = false)"
    :successButtonAction="saveData"
    v-model:address-input-state="dialogInputState.addressInputState"
  ></CustomDialogUI>

  <CustomDialogUI
    v-model:dialogState="leaveConfirmationDialog.show"
    header="Tinggalkan Halaman ?"
    :width="25"
    :type="dialogType.confirm"
    cancelButtonText="Tidak"
    :cancelButtonAction="() => (leaveConfirmationDialog.show = false)"
    successButtonText="Ya"
    :successButtonAction="() => confirmRedirect()"
  ></CustomDialogUI>
  <Toast />
</template>
