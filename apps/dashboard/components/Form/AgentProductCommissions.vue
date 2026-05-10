<template>
  <div class="col-12">
    <div class="text-center">
      <img
        v-if="productCommissionsState?.productImage"
        :src="productCommissionsState.productImage"
        class="rounded-2xl"
        style="width: 80%; border-radius: 12px"
      />
    </div>

    <h3 class="text-center mb-4 mt-2">
      {{ productCommissionsState?.productName }}
    </h3>
    <div
      v-for="(commission, i) in productCommissionsState?.commissions"
      :key="i"
    >
      <p>
        <strong>{{ commission.title }}</strong>
      </p>
      <div class="grid">
        <div class="col-6">
          <CustomForm
            :type="formType.input"
            :inputType="inputFieldType.text"
            label="Level Agent Name"
            v-model:modelData="commission.commission"
          ></CustomForm>
        </div>

        <div class="col-6">
          <CustomForm
            :type="formType.dropdown"
            label="Level Agent Name"
            :dropdownOptions="commissionTypeOptions"
            v-model:modelData="commission.commissionTypeDropDown"
          ></CustomForm>
        </div>
      </div>
    </div>
  </div>
  <!-- <div v-if="error" class="12">
    <p class="text-red-500">{{ error }}</p>
  </div> -->
</template>

<script setup lang="ts">
import {
  formType,
  inputFieldType,
  type dropdownOptionsType,
} from "~/types/formType";
import type { CommissionState } from "../Agent/ProductForm/Products.vue";

const commissionTypeOptions: dropdownOptionsType[] = [
  {
    id: 1,
    name: "Persentase",
  },
  {
    id: 2,
    name: "Flat",
  },
];
const productCommissionsState = defineModel<CommissionState>(
  "productCommissionsState"
);
// defineProps<{
//   error: string;
// }>();
</script>
