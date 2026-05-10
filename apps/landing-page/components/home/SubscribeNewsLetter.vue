<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg relative max-w-md">
      <button
        class="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        @click="emit('close')"
      >
        ✖
      </button>
      <h2 class="text-gray-800 text-xl font-extrabold">
        🚀 {{ $t("home.newsletter.title") }}
      </h2>
      <p class="text-gray-600 text-base leading-relaxed mt-6">
        {{ $t("home.newsletter.description") }}
      </p>

      <div class="flex items-center space-x-4 mt-8">
        <div
          class="w-full flex items-center relative px-5 py-3 border border-blue-600 rounded-xl"
        >
          <span
            class="text-sm font-medium pr-5 py-3 text-blue-600 border-r border-blue-600"
          >
            Name
          </span>
          <input
            v-model="formData.name"
            type="text"
            class="w-full text-lg font-medium text-right border-none ring-0 focus:outline-none focus:ring-0"
            placeholder="Your Name"
          />
        </div>
      </div>

      <div class="flex items-center space-x-4 mt-4 mb-4">
        <div
          class="w-full flex items-center relative px-5 py-3 border border-blue-600 rounded-xl"
        >
          <span
            class="text-sm font-medium pr-5 py-3 text-blue-600 border-r border-blue-600"
          >
            Email
          </span>
          <input
            v-model="formData.email"
            type="email"
            class="w-full text-lg font-medium text-right border-none ring-0 focus:outline-none focus:ring-0"
            placeholder="Your Email"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="disableSubmit"
        :class="disableSubmit ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'"
        class="w-full text-white py-3 px-6 rounded-md text-base font-medium transition mt-4"
        @click="submitForm"
      >
        {{ isLoading ? "Loading..." : "Subscribe Now" }}
      </button>

      <p class="text-gray-500 text-sm mt-3">
        No spam, just valuable updates. Unsubscribe anytime.
      </p>

      <p class="text-red-500 text-sm mt-3">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface fetchDataType {
  success: number;
  msg: string;
}

const runtimeConfig = useRuntimeConfig();

const emit = defineEmits(["submit", "close"]);

const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");

const formData = ref<{ name?: string; email: string; message?: string }>({
  name: "",
  email: "",
});

const disableSubmit = computed(() => {
  return isLoading.value || !formData.value.email || !formData.value.name;
});

// Handle Form Submission
const submitForm = async (): Promise<void> => {
  isLoading.value = true;
  const body = new FormData();
  body.append("email", (formData.value.email as string).trim());
  body.append("name", (formData.value.name as string).trim());

  const response = await $fetch(
    `${runtimeConfig.public.marketingAPI}newsletter/addSubscriber`,
    {
      method: "post",
      body,
    }
  );

  isLoading.value = false;

  errorMessage.value = "";

  if (response) {
    const dataBind: fetchDataType | null = JSON.parse(response as string);

    if (dataBind) {
      if (dataBind.success) {
        emit("submit", formData.value);
      } else {
        errorMessage.value = dataBind.msg;
      }
    }
  } else {
    errorMessage.value = "Something went wrong";
  }
};
</script>
