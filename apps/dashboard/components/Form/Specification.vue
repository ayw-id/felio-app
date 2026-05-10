<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";

const specTitle = defineModel("specTitle");
const specDetail = defineModel("specDetail");

const specDetailMutation = computed({
  set(val) {
    let description = "";
    for (let a = 0; a < (val as string).length; a++) {
      const desc = (val as string)[a];
      description +=
        desc.charCodeAt(0) === 13 || desc.charCodeAt(0) === 10 ? "<br>" : desc;
    }
    specDetail.value = description;
  },
  get() {
    const splittedSpecDetail = specDetail.value
      ? (specDetail.value as string).split("<br>")
      : [specDetail.value];
    let newSpecDetail = "";
    splittedSpecDetail.forEach((item, key) => {
      if (key < splittedSpecDetail.length - 1) {
        // eslint-disable-next-line no-multi-str
        newSpecDetail +=
          (item as string) +
          "\n\
";
      } else {
        newSpecDetail += item as string;
      }
    });
    return newSpecDetail;
  },
});
</script>
<template>
  <div class="col-12">
    <CustomForm
      :type="formType.input"
      id="specTitle"
      :inputType="inputFieldType.text"
      label="Title Spesifikasi"
      v-model:modelData="specTitle"
    ></CustomForm>
  </div>

  <div class="col-12">
    <CustomForm
      :type="formType.inputField"
      id="specDetail"
      label="Detail Spesifikasi"
      v-model:modelData="specDetailMutation"
    ></CustomForm>
  </div>
</template>
