<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";
import type { ProductPreOrder } from "~/types/productData";

const initPreOrder: ProductPreOrder = {
  isActive: true,
  isLimitingQtyEnabled: false,
  availableFrom: new Date(),
  availableUntil: new Date(),
  isInstallmentEnabled: false,
  downPayment: 0,
  fulfillmentDate: new Date(),
  shippingDate: new Date(),
};

const preOrderModel = defineModel<ProductPreOrder | undefined>("preOrderModel");

const isActive = computed<boolean>({
  set(val: boolean) {
    preOrderModel.value = val ? initPreOrder : undefined;
  },
  get() {
    return !!preOrderModel.value;
  },
});

const limitQty = computed<string>({
  set(val: string) {
    const qty = parseInt(val || "0");
    if (preOrderModel.value) {
      preOrderModel.value.limitQty = qty;
    } else {
      preOrderModel.value = {
        ...initPreOrder,
        limitQty: qty,
      };
    }
  },
  get() {
    return (preOrderModel.value?.limitQty ?? 0) + "";
  },
});

const downPayment = computed<string>({
  set(val: string) {
    const dp = parseInt(val);
    if (preOrderModel.value) {
      preOrderModel.value.downPayment = dp;
    } else {
      preOrderModel.value = {
        ...initPreOrder,
        downPayment: dp,
      };
    }
  },
  get() {
    return (preOrderModel.value?.downPayment ?? 0) + "";
  },
});
</script>

<template>
  <label class="mb-4 text-lg font-medium">Setting Pre-Order</label>
  <div class="grid">
    <div class="col-12 flex align-items-center">
      <CustomForm
        :type="formType.switch"
        v-model:modelData="isActive"
        :label="`Pre-Order ${isActive ? '' : 'Tidak'} Aktif`"
      />
    </div>
  </div>
  <div v-if="preOrderModel" class="grid">
    <div class="col-12 md:col-6">
      <CustomForm
        :type="formType.calendar"
        v-model:modelData="preOrderModel.availableFrom"
        label="Order Dibuka"
        dateFormat="yy-mm-dd"
        showIcon
      />
    </div>

    <div class="col-12 md:col-6">
      <CustomForm
        :type="formType.calendar"
        v-model:modelData="preOrderModel.availableUntil"
        label="Order Ditutup"
        dateFormat="yy-mm-dd"
        showIcon
      />
    </div>

    <div class="col-12">
      <CustomForm
        :type="formType.switch"
        v-model:modelData="preOrderModel.isLimitingQtyEnabled"
        :label="`Limit Qty ${
          preOrderModel.isLimitingQtyEnabled ? '' : 'Tidak'
        } Aktif`"
      />
      <CustomForm
        v-if="preOrderModel.isLimitingQtyEnabled"
        :type="formType.input"
        v-model:modelData="limitQty"
        label="Qty Produk Yang Akan Dijual"
        showIcon
      />
    </div>

    <div class="col-12">
      <CustomForm
        :type="formType.switch"
        v-model:modelData="preOrderModel.isInstallmentEnabled"
        :label="`Terapkan Down Payment ${
          preOrderModel.isInstallmentEnabled ? '' : 'Tidak'
        } Aktif`"
      />
    </div>

    <div v-if="preOrderModel.isInstallmentEnabled" class="col-12 md:col-6">
      <CustomForm
        :type="formType.input"
        :inputType="inputFieldType.number"
        v-model:modelData="downPayment"
        mode="currency"
        currency="IDR"
        locale="id-ID"
        label="Down Payment"
      />
    </div>

    <div v-if="preOrderModel.isInstallmentEnabled" class="col-12 md:col-6">
      <CustomForm
        :type="formType.calendar"
        v-model:modelData="preOrderModel.fulfillmentDate"
        label="Tanggal Pelunasan"
        dateFormat="yy-mm-dd"
        showIcon
      />
    </div>

    <div class="col-12">
      <CustomForm
        :type="formType.calendar"
        v-model:modelData="preOrderModel.shippingDate"
        label="Tanggal Pengiriman"
        dateFormat="yy-mm-dd"
        showIcon
      />
    </div>
  </div>
</template>
