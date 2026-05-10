<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";
import type { ProductWholesaleType } from "~/types/productData";

const tierItemModel = defineModel<ProductWholesaleType>("tierItemModel");

const qtyMutation = computed({
  set(val: string) {
    if (tierItemModel.value?.minQty !== undefined) {
      tierItemModel.value.minQty = parseInt(val);
    }
  },
  get() {
    return (tierItemModel.value?.minQty || 0) + "";
  },
});

const priceMutation = computed({
  set(val: string) {
    if (tierItemModel.value?.pricePerUnit !== undefined) {
      tierItemModel.value.pricePerUnit = parseFloat(val);
    }
  },
  get() {
    return (tierItemModel.value?.pricePerUnit || 0) + "";
  },
});
</script>
<template>
  <CustomForm
    :type="formType.input"
    :inputType="inputFieldType.number"
    v-model:modelData="qtyMutation"
    label="QTY"
  />

  <CustomForm
    :type="formType.input"
    :inputType="inputFieldType.number"
    v-model:modelData="priceMutation"
    mode="currency"
    currency="IDR"
    locale="id-ID"
    label="Harga Per Unit"
  />
</template>
