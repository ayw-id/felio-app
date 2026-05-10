<script setup lang="ts">
import { defaultDataBrand, InputType } from "~/pages/brand/utils";
import type { BrandType } from "~/types/brandData";
import { showCustomToast } from "~/utils/utilsFunction";
import { useMainStore } from "~/stores/main";

const mainStore = useMainStore();
const brand = defineModel<BrandType | null>("brand");
const dataChanged = defineModel<boolean>("dataChanged");

const toast = useToast();

defineProps<{
  openForm: (inputType: InputType) => void;
}>();

const onUploadImage = async (event: any): Promise<void> => {
  const file = event.files[0];
  const reader = new FileReader();
  const blob = await fetch(file.objectURL as URL).then(
    async (r): Promise<Blob> => await r.blob()
  ); // blob:url

  if (blob.size / 1024 / 1024 > 4) {
    showCustomToast(toast, "Gambar maksimal 4MB");
  } else {
    reader.readAsDataURL(blob);

    reader.onloadend = function () {
      const base64data = reader.result;
      if (brand.value) {
        brand.value.logo = {
          image: base64data as string,
          size: blob.size,
          isCircle: brand.value.logo.isCircle,
        };

        if (!brand.value.logo) {
          brand.value = defaultDataBrand;
        }
      }

      dataChanged.value = true;
    };
  }
};

const clickImageUploader = (): void => {
  if (
    document.getElementsByTagName("input")?.length &&
    mainStore.userPermissions?.some((perm) => perm === "brand-info:edit")
  ) {
    document.getElementsByTagName("input")[0].click();
  }
};
</script>
<template>
  <div class="col-12">
    <div class="card grid">
      <div class="col-12 flex justify-content-center">
        <Avatar
          @click="clickImageUploader()"
          :shape="!brand ? 'circle' : brand.logo.isCircle ? 'circle' : 'square'"
          :style="`width: 8rem; height: 8rem; background-color: ${
            brand?.logo.image ? 'white' : '#eaeaea'
          }`"
        >
          <div
            v-if="!brand?.logo.image"
            class="w-full h-full flex flex-collumn justify-content-end align-items-end"
          >
            <Icon
              class="pi pi-pencil"
              style="color: rgb(14 165 233); font-size: 1.5rem"
            ></Icon>
          </div>
          <Image v-else :src="brand?.logo.image"></Image>
        </Avatar>

        <FileUpload
          style="display: none"
          mode="basic"
          auto
          class="bg-blue-400"
          name="demo[]"
          url="/api/upload"
          accept="image/*"
          customUpload
          @uploader="onUploadImage($event)"
        />
      </div>
      <div class="col-12 flex flex-column m-4">
        <Label class="text-md"
          >Brand Name
          <Icon
            v-if="
              mainStore.userPermissions?.some(
                (perm) => perm === 'brand-info:edit'
              )
            "
            @click="openForm(InputType.name)"
            class="pi pi-pencil"
            shape="circle"
            style="color: rgb(14 165 233)"
          ></Icon
        ></Label>
        <p class="text-xl font-medium">{{ brand?.name || "-" }}</p>

        <Label class="text-md"
          >Email Perusahaan
          <Icon
            v-if="
              mainStore.userPermissions?.some(
                (perm) => perm === 'brand-info:edit'
              )
            "
            @click="openForm(InputType.email)"
            class="pi pi-pencil"
            shape="circle"
            style="color: rgb(14 165 233)"
          ></Icon
        ></Label>
        <p class="text-xl font-medium">{{ brand?.email || "-" }}</p>

        <Label class="text-md"
          >Company Phone Number
          <Icon
            v-if="
              mainStore.userPermissions?.some(
                (perm) => perm === 'brand-info:edit'
              )
            "
            @click="openForm(InputType.phone)"
            class="pi pi-pencil"
            shape="circle"
            style="color: rgb(14 165 233)"
          ></Icon
        ></Label>
        <p class="text-xl font-medium">
          {{
            !brand?.phone
              ? "-"
              : (brand?.callingCode ? brand.callingCode + " " : "") +
                brand.phone
          }}
        </p>

        <Label class="text-md"
          >Alamat Kantor
          <Icon
            v-if="
              mainStore.userPermissions?.some(
                (perm) => perm === 'brand-info:edit'
              )
            "
            @click="openForm(InputType.address)"
            class="pi pi-pencil"
            shape="circle"
            style="color: rgb(14 165 233)"
          ></Icon
        ></Label>
        <p
          :class="`text-xl font-medium ${
            brand?.brandAddress?.address ? 'mb-0' : ''
          }`"
        >
          {{
            !brand?.brandAddress?.address
              ? "-"
              : `${brand.brandAddress.province}, ${brand.brandAddress.city}, ${brand.brandAddress.district}`
          }}
        </p>
        <p v-if="brand?.brandAddress?.address" class="text-xl font-medium">
          {{ brand.brandAddress.address }}
        </p>

        <Label
          v-if="brand?.followingMerchants.length"
          class="text-lg font-medium"
          >Agent</Label
        >
        <AvatarGroup v-if="brand?.followingMerchants.length">
          <Avatar
            v-for="(merchant, i) in brand.followingMerchants"
            :key="i"
            size="large"
            shape="circle"
          >
            <Image :src="merchant.logo"></Image>
          </Avatar>
          <Avatar
            v-if="brand.totalFollowingMerchant > 6"
            :label="`+${
              brand.totalFollowingMerchant - brand.followingMerchants.length
            }`"
            shape="circle"
            size="large"
          />
        </AvatarGroup>
      </div>
    </div>
  </div>
</template>
