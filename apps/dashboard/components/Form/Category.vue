<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";

const categoryName = defineModel<string>("categoryName");
</script>
<template>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="categoryName"
      :inputType="inputFieldType.text"
      label="Nama Kategori Baru"
      v-model:modelData="categoryName"
    ></CustomForm>
  </div>
</template>
