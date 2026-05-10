<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";

const roleName = defineModel<string>("roleName");
</script>
<template>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="roleName"
      :inputType="inputFieldType.text"
      label="Nama Role Baru"
      v-model:modelData="roleName"
    ></CustomForm>
  </div>
</template>
