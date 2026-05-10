<template>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      :inputType="inputFieldType.text"
      label="Level Agent Name"
      v-model:modelData="title"
    ></CustomForm>
  </div>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      :inputType="inputFieldType.number"
      label="Commission (%)"
      v-model:modelData="commissionMutation"
    ></CustomForm>
  </div>
  <div v-if="error" class="12">
    <p class="text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";

const title = defineModel<string>("title");
const commission = defineModel<number>("commission");
defineProps<{
  error: string;
}>();

const commissionMutation = computed({
  set(val: string) {
    commission.value = parseFloat(val);
  },
  get() {
    return commission.value + "";
  },
});
</script>
