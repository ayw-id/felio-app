<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";
const headerOpt = defineModel<string>("headerOpt");
</script>
<template>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="headerOpt"
      :inputType="inputFieldType.text"
      label="Title Produk Varian"
      v-model:modelData="headerOpt"
    ></CustomForm>
  </div>
</template>
