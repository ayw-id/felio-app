<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";
import { showCustomToast, getOrderStatus } from "~/utils/utilsFunction";
import type { fetchAddressListType } from "~/types/fetchData";
import type { addressType } from "~/types/addressData";
import type { authType } from "~/types/authData";
import type { selectedShippingServiceType } from "~/types/shippingData";
import type { OrderType } from "~/types/orderData";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const childRedistributionState = defineModel<Record<string, number>>(
  "childRedistributionState"
);

const props = defineProps<{
  productOptionRedistributionStockProps: transformedValueOptionsType;
}>();
</script>
<template>
  <div class="flex flex-column w-full">
    <p class="mb-0">
      Varian: <b>{{ productOptionRedistributionStockProps.label }}</b>
    </p>
    <p>Stok Tersedia: {{ productOptionRedistributionStockProps.stock }}</p>
    <div
      v-for="(child, idx) in productOptionRedistributionStockProps.children ||
      []"
      :key="idx"
    >
      <div
        v-for="(opt, i) in child.children || []"
        :key="i"
        class="mb-3 w-full"
      >
        <CustomForm
          :type="formType.input"
          :inputType="inputFieldType.number"
          :label="opt.label"
          :isNumber="true"
          v-model:modelData="
            childRedistributionState[
              `${
                opt.i2 !== undefined
                  ? opt.i2
                  : opt.i1 !== undefined
                  ? opt.i1
                  : opt.i0
              }`
            ]
          "
        ></CustomForm>
      </div>
    </div>
  </div>
</template>
