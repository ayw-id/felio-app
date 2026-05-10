<script setup lang="ts">
import { storageNames } from "~/utils/constants";
import type { authType } from "~/types/authData";
import { showCustomToast, formatDateLocal } from "~/utils/utilsFunction";
import { useProductFormStore } from "~/stores/productForm";
import { formType, inputFieldType } from "~/types/formType";
import type {
  ProductStock,
  TransformedProductOptionStock,
} from "~/types/productData";
import { useBrandStore } from "~/stores/Brand";
import StockService from "~/services/StockService";

// Hooks
const toast = useToast();
const route = useRoute();
const router = useRouter();
const brandStore = useBrandStore();
const productStore = useProductFormStore();

// variable declarations
const idProduct = ref<string>("");
const productStock = ref<ProductStock | null>(null);
const transformedProductStock = ref<TransformedProductOptionStock[] | null>(
  null
);
const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(true);
const adjustForm = ref({
  type: {
    id: "in" as "in" | "out",
    name: "Masuk",
  },
  notes: "",
  stock: 0,
  pricePerUnit: 0,
  expiredDate: null as Date | null,
});

const typeOptions = [
  { name: "Masuk", id: "in" },
  { name: "Keluar", id: "out" },
];

// Helper Functions
// const addOptionToAdjust = (opt: TransformedProductOptionStock) => {
//   const existing = adjustForm.value.options.find((o) => o.idOpt0 === opt.id);
//   if (existing) {
//     existing.stock = opt.stock;
//     existing.pricePerUnit = opt.price;
//   } else {
//     adjustForm.value.options.push({
//       idOpt0: opt.id,
//       stock: opt.stock,
//       pricePerUnit: opt.price,
//     });
//   }
// };

// Access API Functions
const getStock = async (): Promise<void> => {
  if (!dataAuth.value) return;

  const response = await StockService.getStock(dataAuth.value, {
    idProduct: (idProduct.value as string) || "",
    idBrand: brandStore.selectedBrand?.id ?? "",
  });

  isLoading.value = false;

  if (!response.success) {
    showCustomToast(toast, response.message);
  } else if (response.data) {
    productStock.value = response.data.productStock;
    if (productStock.value.productOptions) {
      transformedProductStock.value = StockService.transformProductOptionStocks(
        productStock.value.productOptions
      );
    }
  }
};

const adjustStock = async (): Promise<void> => {
  if (!dataAuth.value) return;

  const expiredDate = formatDateLocal(adjustForm.value.expiredDate);
  const payload: {
    idBrand: string;
    idProduct: string;
    notes: string;
    type: "in" | "out";
    expiredDate?: string | null;
    stock?: number;
    pricePerUnit?: number;
    options?: Array<{
      idOpt0: number;
      dOpt0: number;
      stock: number;
      pricePerUnit: number;
      expiredDate?: string | null;
    }>;
  } = {
    idBrand: brandStore.selectedBrand?.id ?? "",
    idProduct: idProduct.value,
    notes: adjustForm.value.notes,
    type: adjustForm.value.type.id,
    expiredDate,
  };

  if (
    transformedProductStock.value &&
    transformedProductStock.value.length > 0
  ) {
    payload.options = transformedProductStock.value
      .map((opt) => ({
        idOpt0: opt.id,
        stock: parseInt((opt.adjustedStock ?? 0) + ""),
        pricePerUnit: parseInt((opt.pricePerUnit ?? 0) + ""),
        dOpt0: 0,
        expiredDate: opt.expiredDate ? formatDateLocal(opt.expiredDate) : null,
      }))
      .filter((opt) => opt.stock > 0);
  } else {
    payload.stock = adjustForm.value.stock;
    payload.pricePerUnit = adjustForm.value.pricePerUnit;
  }

  isLoading.value = true;

  const response = await StockService.saveStock(dataAuth.value, payload);

  isLoading.value = false;

  if (response.success) {
    showCustomToast(toast, "Stok berhasil disesuaikan!", true);
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/product");
    }
  } else {
    showCustomToast(toast, response.message);
  }
};
// End Access API Functions

// Mounted Function
onMounted(async () => {
  const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
  if (dataAuth_) {
    dataAuth.value = JSON.parse(dataAuth_);
  }
});

watch(
  [() => brandStore.selectedBrand, () => dataAuth.value?.token],
  async ([brand, token]) => {
    if (brand && token) {
      if (productStore.idProduct) {
        idProduct.value = productStore.idProduct;
        // reset store
        productStore.setIdProduct("");
      } else if (route.params.id) {
        idProduct.value = route.params.id as string;
      }
      await getStock();
    }
  },
  { immediate: false }
);

// End Mounted Function
</script>
<template>
  <div
    v-if="isLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else class="grid p-fluid mt-0">
    <div class="col-12">
      <div class="card mx-0">
        <h3>Atur Stok Produk</h3>

        <div class="flex flex-wrap mt-4 card">
          <div class="xl:col-6">
            <CustomForm
              :type="formType.input"
              :inputType="inputFieldType.text"
              v-model:modelData="adjustForm.notes"
              label="Catatan"
            ></CustomForm>
          </div>
          <div class="xl:col-6">
            <CustomForm
              :type="formType.dropdown"
              v-model:modelData="adjustForm.type"
              :dropdownOptions="typeOptions"
              label="Tipe Penyesuaian"
            ></CustomForm>
          </div>
        </div>

        <div v-if="transformedProductStock && transformedProductStock.length">
          <DataTable
            :value="transformedProductStock"
            class="p-datatable-sm card"
            responsiveLayout="scroll"
            tableStyle="min-width: 68rem"
          >
            <Column field="option" header="Opsi" />
            <Column header="Stok Saat Ini" field="stock" />
            <Column header="Stok">
              <template #body="{ data }">
                <CustomForm
                  :type="formType.input"
                  :inputType="inputFieldType.number"
                  mode="decimal"
                  v-model:modelData="data.adjustedStock"
                  :min="0"
                ></CustomForm>
              </template>
            </Column>
            <Column header="Harga Pokok Penjualan/Unit">
              <template #body="{ data }">
                <CustomForm
                  :type="formType.input"
                  :inputType="inputFieldType.text"
                  mode="currency"
                  currency="IDR"
                  locale="id-ID"
                  v-model:modelData="data.pricePerUnit"
                  :min="0"
                ></CustomForm>
              </template>
            </Column>
            <Column
              v-if="adjustForm.type.id === 'in'"
              header="Tanggal Kadaluarsa (Opsional)"
            >
              <template #body="{ data }">
                <CustomForm
                  :type="formType.calendar"
                  v-model:modelData="data.expiredDate"
                ></CustomForm>
              </template>
            </Column>
          </DataTable>
        </div>

        <div v-else>
          <div class="flex flex-wrap mb-3 card">
            <div class="col-12">
              <p>
                Stok saat ini: <b>{{ productStock?.stock ?? 0 }} unit</b>
              </p>
            </div>
            <div
              :class="`xl:col-${adjustForm.type.id === 'in' ? 4 : 6} col-12`"
            >
              <CustomForm
                :type="formType.input"
                :inputType="inputFieldType.number"
                mode="decimal"
                v-model:modelData="adjustForm.stock"
                :min="0"
                label="Stok"
              ></CustomForm>
            </div>
            <div
              :class="`xl:col-${adjustForm.type.id === 'in' ? 4 : 6} col-12`"
            >
              <CustomForm
                :type="formType.input"
                :inputType="inputFieldType.text"
                mode="currency"
                currency="IDR"
                locale="id-ID"
                v-model:modelData="adjustForm.pricePerUnit"
                :min="0"
                label="HPP"
              ></CustomForm>
            </div>
            <div v-if="adjustForm.type.id === 'in'" class="xl:col-4 col-12">
              <CustomForm
                :type="formType.calendar"
                v-model:modelData="adjustForm.expiredDate"
                label="Tanggal Kadaluarsa (Optional)"
              ></CustomForm>
            </div>
          </div>
        </div>

        <Button
          label="Simpan Penyesuaian"
          icon="pi pi-check"
          class="p-button-success w-full mt-4"
          @click="adjustStock"
        ></Button>
      </div>
    </div>
  </div>
  <Toast />
</template>
