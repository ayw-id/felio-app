<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType } from "~/types/authData";
import { showCustomToast } from "~/utils/utilsFunction";
import { useCategoryStore } from "~/stores/category";
import { formType, inputFieldType } from "~/types/formType";
import { SpecialRule } from "~/types/categoryData";
import { useBrandStore } from "~/stores/Brand";

// Hooks
const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const brandStore = useBrandStore();
// End Hooks

// Refs
const dataAuth = ref<authType | null>(null);
// End Refs

// Computed
const categoryNameMutation = computed({
  set(val: string) {
    categoryStore.changeDataCategory({
      name: val,
    });
  },
  get() {
    return categoryStore.formState.name;
  },
});

const detailCategoryStatus = computed(
  () =>
    categoryNameMutation.value &&
    (!categoryStore.formState.isSpecial ||
      (categoryStore.formState.isSpecial &&
        categoryStore.formState.specialRule !== SpecialRule.custom) ||
      (categoryStore.formState.isSpecial &&
        categoryStore.formState.specialRule === SpecialRule.custom &&
        categoryStore.formState.products?.length))
);
// End Computed

// Functions
const saveCategory = async (): Promise<void> => {
  await categoryStore.saveCategory(
    {
      url: (runtimeConfig.public.sellerApi || "") as string,
      token: dataAuth.value?.token || "",
      toast,
    },
    brandStore.selectedBrand?.id
  );

  const processor = setTimeout(() => {
    if (categoryStore.formSaveSuccess) {
      router.back();
    }
    clearTimeout(processor);
  }, 1000);
};

// img
const deleteImage = (): void => {
  categoryStore.changeDataCategory({
    image: {
      src: "",
      size: 0,
    },
  });
};

const onUploadImage = async (event: any): Promise<void> => {
  const file = event.files[0];
  const reader = new FileReader();
  const imageData = await fetch(file.objectURL as URL).then(
    async (
      r
    ): Promise<{
      blob: Blob;
      width: number;
      height: number;
    }> => {
      const imgBlob = await r.blob();
      const bitmap = await createImageBitmap(imgBlob);
      const { height, width } = bitmap;
      bitmap.close();

      return {
        blob: imgBlob,
        width,
        height,
      };
    }
  ); // blob:url

  if (imageData.blob.size / 1024 / 1024 > 4) {
    showCustomToast(toast, "Gambar maksimal 4MB");
  } else {
    reader.readAsDataURL(imageData.blob);

    reader.onloadend = function () {
      const base64data = reader.result;

      categoryStore.changeDataCategory({
        image: {
          src: base64data as string,
          size: imageData.blob.size,
          type: imageData.blob.type,
          width: imageData.width,
          height: imageData.height,
        },
      });
    };
  }
};
// End Functions

// Access API Functions

// End Access API Functions

// Mounted Function
onMounted(async () => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    const parsedDataAuth = JSON.parse(dataAuth_);
    if (parsedDataAuth) {
      dataAuth.value = parsedDataAuth;
    }
  }
});

watch(
  [() => brandStore.selectedBrand, () => dataAuth.value?.token],
  async (newBrand) => {
    if (
      newBrand &&
      dataAuth.value?.token &&
      !categoryStore.formState?.id &&
      route.query.id
    ) {
      const body = new FormData();
      body.append("idCategory", route.query.id as string);
      await categoryStore.getCategory(
        {
          url: (runtimeConfig.public.sellerApi || "") as string,
          token: dataAuth.value?.token || "",
          toast,
          body,
        },
        brandStore.selectedBrand?.id
      );
    }
  },
  { immediate: false }
);

// End Mounted Function
</script>
<template>
  <div
    v-if="categoryStore.formLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else class="grid p-fluid mt-0">
    <div class="col-12 xl:col-8">
      <div id="detailCategory" class="card grid mx-0">
        <label class="mb-4 text-lg font-medium">Detail Kategori</label>
        <CustomForm
          :type="formType.input"
          id="categoryName"
          :inputType="inputFieldType.text"
          label="Nama Kategori"
          v-model:modelData="categoryNameMutation"
        ></CustomForm>
      </div>

      <div id="categoryImage" class="card flex flex-column mx-0">
        <label class="mb-4 text-lg font-medium">Gambar Kategori</label>
        <div v-if="categoryStore.formState.image" class="grid">
          <div class="col-12 md:col-3 lg:col-2">
            <Image :src="categoryStore.formState.image" width="100%"></Image>
            <div>
              <Button
                @click="deleteImage()"
                outlined
                icon="pi pi-trash"
                severity="danger"
              ></Button>
            </div>
          </div>
        </div>
        <div v-else class="flex justify-content-center mt-4">
          <FileUpload
            mode="basic"
            auto
            chooseLabel="Gambar Kategori"
            class="bg-blue-400"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            customUpload
            @uploader="onUploadImage($event)"
          />
        </div>
      </div>
      <div class="card flex mx-0 justify-content-center">
        <Button
          @click="saveCategory()"
          :disabled="!detailCategoryStatus"
          :loading="categoryStore.formLoading"
          label="Simpan Kategori"
          class="lg:w-4"
          icon="pi pi-save"
        ></Button>
      </div>
    </div>
  </div>

  <Toast />
</template>
