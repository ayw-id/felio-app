<script setup lang="ts">
const email = defineModel<string>("email");
const password = defineModel<string>("password");
const rememberMe = defineModel<string>("rememberMe");

defineProps<{
  isPreview: boolean;
}>();
definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <label for="email1" class="block text-900 text-xl font-medium mb-2"
      >Email</label
    >
    <InputText
      id="email1"
      v-model="email"
      type="text"
      placeholder="Email address"
      class="w-full md:w-30rem mb-5"
      style="padding: 1rem"
      :disabled="isPreview"
    />

    <label for="password1" class="block text-900 font-medium text-xl mb-2"
      >Password</label
    >
    <Password
      id="password1"
      v-model="password"
      toggleMask
      placeholder="Password"
      class="w-full mb-3"
      inputClass="w-full"
      :feedback="false"
      :inputStyle="{ padding: '1rem' }"
      :disabled="isPreview"
    ></Password>

    <div class="flex align-items-center justify-content-between mb-5 gap-5">
      <div class="flex align-items-center">
        <Checkbox
          id="rememberme1"
          v-model="rememberMe"
          binary
          class="mr-2"
        ></Checkbox>
        <label for="rememberme1">Remember me</label>
      </div>
      <a
        v-if="!isPreview"
        class="font-medium no-underline ml-2 text-right cursor-pointer"
        style="color: var(--primary-color)"
        >Forgot password?</a
      >
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
