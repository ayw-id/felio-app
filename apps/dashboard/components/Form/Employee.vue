<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();

// const id = defineModel<string>("id");
const address = defineModel<string>("address");
const name = defineModel<string>("name");
const email = defineModel<string>("email");
const phone = defineModel<string>("phone");
</script>
<template>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="name"
      :inputType="inputFieldType.text"
      label="Nama"
      v-model:modelData="name"
    ></CustomForm>
  </div>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="email"
      :inputType="inputFieldType.text"
      label="E-mail"
      v-model:modelData="email"
    ></CustomForm>
  </div>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="phone"
      :inputType="inputFieldType.text"
      label="No. Handphone"
      v-model:modelData="phone"
    ></CustomForm>
  </div>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="address"
      :inputType="inputFieldType.text"
      label="Alamat"
      v-model:modelData="address"
    ></CustomForm>
  </div>
</template>
