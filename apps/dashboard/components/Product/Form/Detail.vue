<template>
  <div id="productDetail" class="card grid mx-0">
    <label class="mb-4 text-lg font-medium">Detail Produk</label>
    <CustomForm
      :type="formType.input"
      id="productName"
      :inputType="inputFieldType.text"
      label="Nama Produk"
      v-model:modelData="productName"
    ></CustomForm>

    <CustomForm
      :type="formType.dropdown"
      id="category"
      placeholder="Pilih Kategori"
      label="Kategori"
      v-model:modelData="selectedCategory"
      :dropdownOptions="categoryReference"
    ></CustomForm>

    <CustomForm
      :type="formType.input"
      id="price"
      :disabled="disabledDetail || type === 'bundle'"
      :inputType="inputFieldType.text"
      label="Harga Produk"
      v-model:modelData="price"
    ></CustomForm>

    <CustomForm
      :type="formType.input"
      id="weight"
      :disabled="disabledDetail || type === 'bundle'"
      :inputType="inputFieldType.text"
      label="Berat Produk (gram)"
      v-model:modelData="weight"
    ></CustomForm>

    <!-- <CustomForm
      :type="formType.input"
      id="stock"
      :disabled="disabledDetail"
      :inputType="inputFieldType.text"
      label="Stok produk (pcs)"
      v-model:modelData="stock"
    ></CustomForm> -->

    <CustomForm
      :type="formType.inputField"
      id="description"
      label="Deskripsi Produk"
      v-model:modelData="description"
    ></CustomForm>
  </div>
</template>

<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";
import type { categoryType } from "~/types/productData";

const productName = defineModel<string>("productName");
const selectedCategory = defineModel<categoryType>("selectedCategory");
const price = defineModel<string>("price");
const weight = defineModel<string>("weight");
// const stock = defineModel<string>("stock");
const description = defineModel<string>("description");

defineProps<{
  categoryReference: categoryType[];
  disabledDetail: boolean;
  type: "bundle" | "single";
}>();
</script>
