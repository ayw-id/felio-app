<script setup lang="ts">
import { countryCode } from "~/utils/constants";
const name = defineModel<string>("name");
const email = defineModel<string>("email");
const phone = defineModel<string>("phone");
const password = defineModel<string>("password");
const password1 = defineModel<string>("password1");
const rememberMe = defineModel<string>("rememberMe");
const selectedCountryCode = defineModel<countryCodeType>("countryCode");
defineProps<{
  isPreview: boolean;
}>();

definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <label for="name1" class="block text-900 text-xl font-medium mb-2"
      >Full Name</label
    >
    <InputText
      id="name1"
      v-model="name"
      type="text"
      placeholder="Full Name"
      class="w-full mb-5"
      inputClass="w-full"
      style="padding: 1rem"
      :disabled="isPreview"
    />

    <label for="email1" class="block text-900 text-xl font-medium mb-2"
      >Phone Number</label
    >
    <Dropdown
      v-model="selectedCountryCode"
      :options="countryCode"
      optionLabel="flag"
      placeholder="Select Country Code"
      class="w-full md:w-6rem mr-2 mb-2"
      style="padding: 0.5rem"
      :disabled="isPreview"
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
      v-model="phone"
      type="text"
      placeholder="Phone Number (81XXXXXX)"
      class="w-full md:w-30rem mb-5"
      inputClass="w-full"
      style="padding: 1rem"
      :disabled="isPreview"
    />

    <label for="email1" class="block text-900 text-xl font-medium mb-2"
      >Email</label
    >
    <InputText
      id="email1"
      v-model="email"
      type="text"
      placeholder="Email address"
      class="w-full mb-3"
      inputClass="w-full"
      style="padding: 1rem"
      :disabled="isPreview"
    />

    <label for="password1" class="block text-900 font-medium text-xl mb-2 mt-4"
      >Password</label
    >
    <Password
      id="password1"
      v-model="password"
      toggleMask
      placeholder="Password"
      class="w-full mb-3"
      inputClass="w-full"
      :inputStyle="{ padding: '1rem' }"
      :disabled="isPreview"
    ></Password>

    <label for="password2" class="block text-900 font-medium text-xl mb-2 mt-4"
      >Re-Type Password</label
    >
    <Password
      id="password2"
      v-model="password1"
      toggleMask
      placeholder="Password"
      class="w-full mb-3"
      inputClass="w-full"
      :inputStyle="{ padding: '1rem' }"
      :feedback="false"
      :disabled="isPreview"
    ></Password>

    <div
      v-if="!isPreview"
      class="flex align-items-center justify-content-between mb-5 mt-2 gap-5"
    >
      <div class="flex align-items-center">
        <Checkbox
          id="rememberme1"
          v-model="rememberMe"
          binary
          class="mr-2"
        ></Checkbox>
        <label for="rememberme1">Remember me</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}
.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
