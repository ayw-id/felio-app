<script setup lang="ts">
import { ref } from "vue";
import { dialogType, formType, inputFieldType } from "~/types/formType";
import type { ProductBundleItemType, productType } from "~/types/productData";
import { useBrandStore } from "~/stores/Brand";
import { apiRequest } from "~/services/APIService";
import type { fetchGetProductsType } from "~/types/fetchData";
import type { BundleProductModels } from "~/components/Form/BundleSelectProductItem.vue";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const brandStore = useBrandStore();

// Props
const props = defineProps<{
  token: string;
  selectedProductsBundle: ProductBundleItemType[];
  bundleItemsToDelete: string[];
  idProduct: string;
}>();

const productTypeModel = defineModel<"bundle" | "single">("productType");
const bundleDiscountType = defineModel<"percent" | "amount">(
  "bundleDiscountType"
);
const bundleDiscountValue = defineModel<number>("bundleDiscountValue");

// Emits
const emit = defineEmits([
  "update:selectedProductsBundle",
  "update:bundleItemsToDelete",
]);

const isFormButtonLoading = ref<boolean>(false);
const searchQuery = ref<string>("");
const appliedQuery = ref<string>("");
const offset = ref<number>(0);
const orderBy = ref<string>("");
const orderDirection = ref<"asc" | "desc">("asc");
const selectedCategory = ref<string>("");
const limit = ref<number>(10);
const totalRecords = ref<number>(0);
const selectedProducts = ref<productType[]>([]);
const selectedProductBundleIndex = ref<number>(-1);
const selectedBundleQty = ref<number>(0);
const selectAll = ref<boolean>(false);
const tableLoading = ref<boolean>(false);
const products = ref<productType[]>([]);
const showFormBundleItemState = ref<boolean>(false);

const isActive = computed({
  set(val: boolean) {
    productTypeModel.value = val ? "bundle" : "single";
  },
  get() {
    return productTypeModel.value === "bundle";
  },
});

const isPercent = computed<boolean>({
  set(val: boolean) {
    bundleDiscountType.value = val ? "percent" : "amount";
  },
  get() {
    return bundleDiscountType.value === "percent";
  },
});

const bundleProductModelsMutation = computed<BundleProductModels>({
  set(val: BundleProductModels) {
    searchQuery.value = val.searchQuery;
    appliedQuery.value = val.appliedQuery;
    offset.value = val.offset;
    orderBy.value = val.orderBy;
    orderDirection.value = val.orderDirection;
    limit.value = val.limit;
    selectAll.value = val.selectAll;
    // selectedProducts.value = val.selectedProducts;
    tableLoading.value = val.tableLoading;
    isFormButtonLoading.value = val.isLoading;
  },
  get() {
    return {
      searchQuery: searchQuery.value,
      appliedQuery: appliedQuery.value,
      offset: offset.value,
      orderBy: orderBy.value,
      orderDirection: orderDirection.value,
      limit: limit.value,
      selectAll: selectAll.value,
      // selectedProducts: selectedProducts.value,
      tableLoading: tableLoading.value,
      isLoading: isFormButtonLoading.value,
    };
  },
});
const bundleDiscountValueMutation = computed({
  set(val: string) {
    bundleDiscountValue.value = parseFloat(val);
  },
  get() {
    return bundleDiscountValue.value + "";
  },
});
const selectedBundleQtyMutation = computed({
  set(val: string) {
    selectedBundleQty.value = parseFloat(val);
  },
  get() {
    return selectedBundleQty.value + "";
  },
});

const saveSelectedProducts = (): void => {
  emit("update:selectedProductsBundle", [
    ...props.selectedProductsBundle,
    ...selectedProducts.value.map((prod) => ({
      idProduct: prod.id,
      qty: 0,
      name: prod.productName,
      image: prod.images?.length ? prod.images[0] : "",
      price: prod.price,
      weight: prod.weight,
      categoryName: prod.categoryName,
    })),
  ]);

  showFormBundleItemState.value = false;
};

const getProducts = async (): Promise<void> => {
  if (brandStore.selectedBrand?.id) {
    isFormButtonLoading.value = true;
    tableLoading.value = true;

    const body = new FormData();
    body.append("idBrand", brandStore.selectedBrand.id as string);
    body.append("searchQuery", searchQuery.value);
    body.append("offset", offset.value + "");
    body.append("limit", limit.value + "");
    body.append("orderBy", orderBy.value);
    body.append("orderDirection", orderDirection.value);
    body.append("idCategory", selectedCategory.value);
    body.append("getRating", "1");
    body.append("excludeBundle", "1");

    let excludeProducts = [props.idProduct];
    if (props.selectedProductsBundle.length) {
      excludeProducts = [
        ...excludeProducts,
        ...props.selectedProductsBundle.map((prod) => prod.idProduct),
      ];
    }

    body.append("excludeProducts", JSON.stringify(excludeProducts));

    const response = await apiRequest<fetchGetProductsType>(
      `${runtimeConfig.public.sellerApi}product/getProducts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
        body,
      }
    );

    isFormButtonLoading.value = false;
    tableLoading.value = false;

    if (!response.success) {
      showCustomToast(toast, response.msg);
    } else if (response.data) {
      totalRecords.value = response.data.totalRecords;
      products.value = response.data.products;
      showFormBundleItemState.value = true;
    }
  }
};

const showFormBundleItem = async (): Promise<void> => {
  await getProducts();
};

const changeQty = async (index: number): Promise<void> => {
  selectedBundleQty.value = props.selectedProductsBundle[index].qty;
  selectedProductBundleIndex.value = index;
};

const removeItem = (index: number): void => {
  emit("update:bundleItemsToDelete", props.selectedProductsBundle[index].id);
  const selectedProductsBundle: ProductBundleItemType[] = JSON.parse(
    JSON.stringify(props.selectedProductsBundle)
  );
  emit(
    "update:selectedProductsBundle",
    selectedProductsBundle.filter((prod, idx) => idx !== index)
  );
};

const saveQty = (): void => {
  if (selectedProductBundleIndex.value >= 0) {
    const selectedProductsBundle: ProductBundleItemType[] = JSON.parse(
      JSON.stringify(props.selectedProductsBundle)
    );
    selectedProductsBundle[selectedProductBundleIndex.value].qty =
      selectedBundleQty.value;
    emit("update:selectedProductsBundle", selectedProductsBundle);

    selectedProductBundleIndex.value = -1;
  }
};
</script>

<template>
  <label class="mb-4 text-lg font-medium">Produk Bundle</label>
  <div class="grid">
    <div class="col-12 flex align-items-center">
      <CustomForm
        :type="formType.switch"
        v-model:modelData="isActive"
        :label="`${isActive ? 'Produk Bundle' : 'Produk Satuan'}`"
      />
    </div>
  </div>
  <div v-if="isActive" class="grid">
    <!-- Value -->
    <div class="col-12">
      <CustomForm
        :type="formType.switch"
        v-model:modelData="isPercent"
        :label="`Tipe Diskon: ${isPercent ? 'Persen' : 'Nominal'}`"
      />
      <CustomForm
        :type="formType.input"
        :inputType="
          bundleDiscountType === 'percent'
            ? inputFieldType.number
            : inputFieldType.text
        "
        v-model:modelData="bundleDiscountValueMutation"
        :mode="bundleDiscountType === 'amount' ? 'currency' : 'decimal'"
        currency="IDR"
        locale="id-ID"
        :label="
          bundleDiscountType === 'amount'
            ? 'Nominal Diskon Bundle'
            : 'Persentase Diskon Bundle'
        "
      />
    </div>
  </div>
  <div v-if="isActive" class="p-3 mb-3 border rounded-lg">
    <div class="grid">
      <div
        v-for="(item, index) in selectedProductsBundle"
        :key="index"
        class="col-12 md:col-6"
      >
        <div class="card" :class="`${index % 2 === 0 ? 'mr-1' : 'ml-1'}`">
          <img
            v-if="item.image"
            :alt="item.name"
            :src="item.image"
            style="width: 48px"
          />
          <p class="mb-0">
            <b>{{ item.name }}</b> Rp.{{ getAmount(item.price) }}
          </p>
          <p class="mb-0">{{ item.categoryName }}</p>
          <p class="mb-0">Berat: {{ item.weight }} gr</p>
          <p class="mb-0">Quantity: {{ item.qty }}</p>
          <hr v-if="selectedProductBundleIndex === index" />
          <CustomForm
            v-if="selectedProductBundleIndex === index"
            :type="formType.input"
            :inputType="inputFieldType.number"
            v-model:modelData="selectedBundleQtyMutation"
            label="Bundle Qty"
          />
          <Button
            v-if="selectedProductBundleIndex === index"
            icon="pi pi-save"
            label="Simpan Qty"
            class="col-12 p-button-success mt-3"
            @click="saveQty()"
          />
          <Button
            v-if="selectedProductBundleIndex !== index"
            icon="pi pi-pencil"
            label="Ubah Qty"
            class="col-12 p-button-info mt-3"
            @click="changeQty(index)"
          />
          <Button
            v-if="selectedProductBundleIndex !== index"
            icon="pi pi-trash"
            label="Hapus"
            class="col-12 p-button-danger mt-3"
            @click="removeItem(index)"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-if="isActive" class="flex justify-content-center">
    <Button
      :label="isFormButtonLoading ? 'Loading..' : 'Tambah Produk Bundle'"
      icon="pi pi-plus"
      class="w-full md:w-5"
      :loading="isFormButtonLoading"
      @click="showFormBundleItem()"
    ></Button>
  </div>
  <CustomDialogUI
    v-model:dialogState="showFormBundleItemState"
    header="Pilih Produk"
    :width="86"
    :type="dialogType.form"
    :cancelButtonAction="() => (showFormBundleItemState = false)"
    :successButtonAction="saveSelectedProducts"
    v-model:bundleProductModels="bundleProductModelsMutation"
    :bundleProductProps="{
      getProducts,
      products,
      totalRecords,
      selectedProducts,
      setSelectedProducts: (products: productType[]) => {
        selectedProducts = JSON.parse(JSON.stringify(products));
      }
    }"
  ></CustomDialogUI>

  <Toast />
</template>
