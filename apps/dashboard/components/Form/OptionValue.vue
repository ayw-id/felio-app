<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";
const optTitle = defineModel<string>("optTitle");
const optPrice = defineModel<number>("optPrice");
const optWeight = defineModel<number>("optWeight");
// const optStock = defineModel<number>("optStock");

const priceMutation = computed({
  set(val) {
    optPrice.value = parseInt(val as string);
  },
  get() {
    return optPrice.value;
  },
});

const weightMutation = computed({
  set(val) {
    optWeight.value = parseInt(val as string);
  },
  get() {
    return optWeight.value;
  },
});

// const stockMutation = computed({
//   set(val) {
//     optStock.value = parseInt(val as string);
//   },
//   get() {
//     return optStock.value;
//   },
// });
</script>
<template>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="optTitle"
      :inputType="inputFieldType.text"
      label="Option Produk"
      v-model:modelData="optTitle"
    ></CustomForm>
  </div>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="price"
      :inputType="inputFieldType.number"
      label="Harga Produk"
      v-model:modelData="priceMutation"
    ></CustomForm>
  </div>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="price"
      :inputType="inputFieldType.number"
      label="Berat Produk (gram)"
      v-model:modelData="weightMutation"
    ></CustomForm>
  </div>
  <!-- <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="price"
      :inputType="inputFieldType.number"
      label="Stok Produk"
      v-model:modelData="stockMutation"
    ></CustomForm>
  </div> -->
</template>
