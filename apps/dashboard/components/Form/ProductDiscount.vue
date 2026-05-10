<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";
import type { ProductDiscountType } from "~/types/productData";

const productDiscountState = defineModel<ProductDiscountType>(
  "productDiscountState"
);

const isPercent = computed({
  set(val: boolean) {
    if (productDiscountState.value) {
      productDiscountState.value.type = val ? "percent" : "amount";
    } else {
      productDiscountState.value = {
        isActive: true,
        title: "",
        type: val ? "percent" : "amount",
        value: 0,
        startDate: null,
        endDate: null,
      };
    }
  },
  get() {
    return productDiscountState.value?.type === "percent";
  },
});

const valueMutation = computed({
  set(val: string) {
    if (val !== "" && productDiscountState.value) {
      productDiscountState.value.value = parseInt(val.replaceAll(",", ""));
    }
  },
  get() {
    return (productDiscountState.value?.value ?? "") + "";
  },
});
</script>

<template>
  <div v-if="productDiscountState" class="grid">
    <!-- Active -->
    <div class="col-12 flex align-items-center">
      <CustomForm
        :type="formType.switch"
        v-model:modelData="productDiscountState.isActive"
        :label="`Status: ${
          productDiscountState.isActive ? 'Aktif' : 'Tidak Aktif'
        }`"
      />
    </div>

    <!-- Title -->
    <div class="col-12">
      <CustomForm
        :type="formType.input"
        :inputType="inputFieldType.text"
        v-model:modelData="productDiscountState.title"
        label="Title"
      />
    </div>

    <!-- Type -->
    <!-- <div class="col-12 md:col-6">
      <CustomForm
        :type="formType.dropdown"
        v-model:modelData="typeMutation"
        :dropdownOptions="[
          { name: 'Persen', id: 'percent' },
          { name: 'Nominal', id: 'amount' },
        ]"
        label="Tipe Diskon"
      />
    </div> -->

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
          productDiscountState.type === 'percent'
            ? inputFieldType.number
            : inputFieldType.text
        "
        v-model:modelData="valueMutation"
        :mode="productDiscountState.type === 'amount' ? 'currency' : 'decimal'"
        currency="IDR"
        locale="id-ID"
        :label="
          productDiscountState.type === 'amount'
            ? 'Nominal Diskon'
            : 'Persentase Diskon'
        "
      />
    </div>

    <!-- Start Date -->
    <div class="col-12 md:col-6">
      <CustomForm
        :type="formType.calendar"
        v-model:modelData="productDiscountState.startDate"
        label="Tanggal Mulai Diskon"
        dateFormat="yy-mm-dd"
        showIcon
      />
    </div>

    <!-- End Date -->
    <div class="col-12 md:col-6">
      <CustomForm
        :type="formType.calendar"
        v-model:modelData="productDiscountState.endDate"
        label="Tanggal Berakhir Diskon"
        dateFormat="yy-mm-dd"
        showIcon
      />
    </div>
  </div>
</template>
