<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";
import { FormType } from "~/types/brandData";
import { countryCode } from "~/utils/constants";
import type { countryCodeType } from "~/utils/constants";

const props = defineProps<{
  title: string;
  brandFormType: FormType;
}>();
const titleData = defineModel<string | undefined>("titleData");
const data = defineModel<string>("data");
const selectedCountryCode = defineModel<countryCodeType | null>("countryCode");
</script>
<template>
  <div class="col-12">
    <CustomForm
      v-if="props.brandFormType === FormType.basicWithTitle"
      :type="formType.input"
      id="title"
      :inputType="inputFieldType.text"
      :label="`Nama ${props.title}`"
      v-model:modelData="titleData"
    ></CustomForm>

    <CustomForm
      v-if="
        props.brandFormType === FormType.basic ||
        props.brandFormType === FormType.basicWithTitle ||
        props.brandFormType === FormType.address
      "
      :type="formType.input"
      id="data"
      :inputType="inputFieldType.text"
      :label="`${
        props.brandFormType === FormType.basicWithTitle ? 'Link ' : ''
      }${props.title}`"
      v-model:modelData="data"
    ></CustomForm>

    <div v-if="props.brandFormType === FormType.phone" class="flex flex-row">
      <Dropdown
        v-model="selectedCountryCode"
        :options="countryCode"
        optionLabel="flag"
        placeholder="Select Country Code"
        class="w-full md:w-7rem mr-2 mb-2"
        style="padding: 0.8rem; height: 4rem"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <div>{{ slotProps.value.flag }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <img
              :alt="slotProps.option.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`"
              style="width: 18px"
            />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>

      <InputText
        id="phone1"
        v-model="data"
        type="text"
        placeholder="Phone Number (81XXXXXX)"
        class="w-full mb-3"
        inputClass="w-full"
        style="padding: 1rem; height: 4rem"
      />
    </div>
  </div>
</template>
