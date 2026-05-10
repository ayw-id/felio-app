<template>
  <section id="need-help" class="w-full my-24">
    <BaseSection>
      <LandingBuyTradeImage class="sm:hidden mb-8" />
      <div
        data-aos="fade-right"
        class="col-span-12 lg:col-span-6 mt-4 xl:mt-20 space-y-6 px-4"
      >
        <h2 class="text-4xl font-semibold sm:pr-8 xl:pr-12">
          {{ $t("home.contactUsSection.contactUs") }}
        </h2>
        <p class="paragraph">
          {{ $t("home.contactUsSection.shareYourThought") }}<br />{{
            $t("home.contactUsSection.fillTheForm")
          }}
        </p>
        <div class="space-y-6 lg:pr-12">
          <div class="flex items-center space-x-4">
            <div
              class="w-full flex items-center relative px-5 py-3 border border-[#0c66ee] rounded-xl"
            >
              <span
                class="text-sm font-medium pr-5 py-3 text-[#0c66ee] border-r border-[#0c66ee]"
              >
                {{ $t("home.contactUsSection.name") }}
              </span>
              <input
                type="text"
                class="w-full text-lg font-medium text-right border-none ring-0 focus:outline-none focus:ring-0"
                :name="$t('home.contactUsSection.name')"
                v-model="name"
              />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div
              class="w-full flex items-center relative px-5 py-3 border border-[#0c66ee] rounded-xl"
            >
              <span
                class="text-sm font-medium pr-5 py-3 text-[#0c66ee] border-r border-[#0c66ee]"
              >
                {{ $t("home.contactUsSection.email") }}
              </span>
              <input
                type="text"
                class="w-full text-lg font-medium text-right border-none ring-0 focus:outline-none focus:ring-0"
                :name="$t('home.contactUsSection.email')"
                v-model="email"
              />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div
              class="w-full flex items-center relative px-5 py-3 border border-[#0c66ee] rounded-xl"
            >
              <span
                class="text-sm font-medium pr-5 py-3 text-[#0c66ee] border-r border-[#0c66ee]"
              >
                {{ $t("home.contactUsSection.phone") }}
              </span>
              <input
                type="text"
                class="w-full text-lg font-medium text-right border-none ring-0 focus:outline-none focus:ring-0"
                :name="$t('home.contactUsSection.phone')"
                v-model="phone"
              />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div
              class="w-full flex items-center relative px-5 py-3 border border-[#0c66ee] rounded-xl"
            >
              <span
                class="text-sm font-medium pr-5 py-3 text-[#0c66ee] border-r border-[#0c66ee]"
              >
                {{ $t("home.contactUsSection.company") }}
              </span>
              <input
                type="text"
                class="w-full text-lg font-medium text-right border-none ring-0 focus:outline-none focus:ring-0"
                :name="$t('home.contactUsSection.company')"
                v-model="company"
              />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div
              class="w-full flex items-center relative px-5 py-3 border border-[#0c66ee] rounded-xl"
            >
              <span
                class="text-sm font-medium pr-5 py-3 text-[#0c66ee] border-r border-[#0c66ee]"
              >
                {{ $t("home.contactUsSection.question") }}
              </span>
              <textarea
                type="text"
                class="w-full text-lg font-medium text-right border-none ring-0 focus:outline-none focus:ring-0"
                :name="$t('home.contactUsSection.question')"
                v-model="message"
              ></textarea>
            </div>
          </div>
          <p
            v-if="responseMessage.status !== 'NOTSUBMITTED'"
            :style="`color: ${
              responseMessage.status === 'SUCCESS' ? 'teal' : 'red'
            }`"
          >
            {{
              `${$t(
                `home.contactUsSection.${
                  responseMessage.status === "ERROR"
                    ? "failedResponse"
                    : "successResponse"
                }`
              )}. ${responseMessage.message}`
            }}
          </p>

          <BaseButton
            @click="submitQuestion"
            :disabled="disableSubmit"
            :class="disableSubmit ? 'bg-gray-400' : 'bg-blue-gradient'"
            class="w-full px-5 py-4 text-white text-base font-medium"
            >{{ $t("home.contactUsSection.send") }}</BaseButton
          >
        </div>
      </div>
      <LandingBuyTradeImage data-aos="fade-left" class="hidden sm:block" />
    </BaseSection>
  </section>
</template>

<script setup lang="ts">
import type { fetchDataType } from "./SubscribeNewsLetter.vue";

const runtimeConfig = useRuntimeConfig();

const isLoading = ref<boolean>(false);
const responseMessage = ref<{
  message: string;
  status: "NOTSUBMITTED" | "SUCCESS" | "ERROR";
}>({
  message: "",
  status: "NOTSUBMITTED",
});

const name = ref<string>("");
const email = ref<string>("");
const phone = ref<string>("");
const company = ref<string>("");
const message = ref<string>("");

const disableSubmit = computed(() => {
  return isLoading.value || !email.value || !name.value || !message.value;
});

const submitQuestion = async (): Promise<void> => {
  isLoading.value = true;
  const body = new FormData();
  body.append("email", (email.value as string).trim());
  body.append("name", (name.value as string).trim());
  body.append("phone", (phone.value as string).trim());
  body.append("company", (company.value as string).trim());
  body.append("message", (message.value as string).trim());

  const response = await $fetch(
    `${runtimeConfig.public.marketingAPI}qna/addMessage`,
    {
      method: "post",
      body,
    }
  );

  isLoading.value = false;

  responseMessage.value.message = "";

  if (response) {
    const dataBind: fetchDataType | null = JSON.parse(response as string);

    if (dataBind) {
      if (dataBind.success) {
        responseMessage.value = {
          message: "",
          status: "SUCCESS",
        };
      } else {
        responseMessage.value = {
          message: dataBind.msg,
          status: "ERROR",
        };
      }
    }
  } else {
    responseMessage.value = {
      message: "",
      status: "ERROR",
    };
  }
};
</script>
