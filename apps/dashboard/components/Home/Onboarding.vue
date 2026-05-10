<script setup lang="ts">
import type { serviceOnboardingObjType } from "~/types/fetchData";
import { countryCode, onboardingLabel } from "~/utils/constants";
const props = defineProps<{
  steps: serviceOnboardingObjType[];
  nextBtnPressed: () => void;
  optBtnPressed: () => void;
  isOnboardingLoading: boolean;
  messageInfo: string;
  formWidth: number;
}>();
const active = defineModel("activeStep");
const email = defineModel("email");
const phone = defineModel("phone");
const selectedCountryCode = defineModel("countryCode");
const name = defineModel("name");
const getOnboardingLabel = (label: string): string => {
  switch (label) {
    case "dataCompletion":
      return "Data sudah dilengkapi";
    case "dataVerification":
      return "Data telah terverifikasi";
    case "brandInformation":
      return "Data sudah dilengkapi";
    case "addProduct":
      return "Produk sudah ada";
    case "publishWebsite":
      return "Website sudah ada";
  }

  return "";
};

const getOnboardingButtonLabel = (label: string): string => {
  switch (label) {
    case "dataVerification":
      return "Verifikasi Sekarang";
    case "brandInformation":
      return "Lengkapi Data";
    case "addProduct":
      return "Tambah Produk Sekarang";
    case "publishWebsite":
      return "Bikin Website Sekarang";
  }

  return "";
};
</script>
<template>
  <Stepper v-model:activeStep="active" orientation="vertical">
    <StepperPanel v-for="(step, i) in props.steps" :key="i" header="Header II">
      <template #header="{ clickCallback }">
        <button
          class="bg-transparent border-none inline-flex flex-column gap-2"
          @click="clickCallback"
        >
          <span>
            <Avatar
              v-if="step.status"
              class="bg-primary"
              icon="pi pi-check"
            ></Avatar>
            <Avatar v-else class="">{{ i + 1 }}</Avatar>
            {{
              onboardingLabel.find((label) => label.key === step.label)?.label
            }}
          </span>
        </button>
      </template>
      <template #content="{ prevCallback, nextCallback }">
        <div class="flex flex-column">
          <div
            v-if="step.fields?.length"
            class="border-2 border-dashed flex-column surface-border border-round surface-ground flex-auto flex font-medium py-2"
          >
            <div
              v-if="step.fields?.find((field) => field.field === 'email')"
              class="px-4 my-2 col-12"
              :class="`md:col-${formWidth}`"
            >
              <label
                for="email1"
                class="block text-900 text-xl font-medium mb-2"
                >Email</label
              >
              <p v-if="step.status">{{ email }}</p>
              <InputText
                v-if="!step.status"
                id="email1"
                v-model="email"
                type="text"
                placeholder="Email address"
                class="w-full"
                inputClass="w-full"
                style="padding: 1rem; height: 4rem"
              />
            </div>
            <div
              v-if="step.fields?.find((field) => field.field === 'phone')"
              class="px-4 my-2 col-12"
              :class="`md:col-${formWidth}`"
            >
              <label
                for="phone1"
                class="block text-900 text-xl font-medium mb-2"
                >Phone</label
              >
              <p v-if="step.status">
                {{ (selectedCountryCode as countryCodeType)?.dialCode }}
                {{ phone }}
              </p>
              <div class="flex flex-row">
                <Dropdown
                  v-if="!step.status"
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
                  v-if="!step.status"
                  id="phone1"
                  v-model="phone"
                  type="text"
                  placeholder="Phone Number (81XXXXXX)"
                  class="w-full mb-3"
                  inputClass="w-full"
                  style="padding: 1rem; height: 4rem"
                />
              </div>
            </div>

            <div
              v-if="step.fields?.find((field) => field.field === 'name')"
              class="px-4 my-2 col-12"
              :class="`md:col-${formWidth}`"
            >
              <label for="name1" class="block text-900 text-xl font-medium mb-2"
                >Name</label
              >
              <p v-if="step.status">{{ name }}</p>
              <InputText
                v-if="!step.status"
                id="name1"
                v-model="name"
                type="text"
                placeholder="Fullname"
                class="w-full mb-3"
                inputClass="w-full"
                style="padding: 1rem; height: 4rem"
              />
            </div>
          </div>

          <div
            class="border-2 border-dashed flex-column surface-border border-round surface-ground flex-auto flex font-medium py-2"
          >
            <div class="px-4 my-2 col-12 md:col-12">
              {{ step.msg }}
            </div>
            <div
              v-if="messageInfo"
              style="color: blue"
              class="px-4 my-2 col-12 md:col-12"
            >
              {{ messageInfo }}
            </div>
            <div
              v-if="step.status"
              style="color: #54aeff"
              class="px-4 my-2 col-12 md:col-12"
            >
              {{ getOnboardingLabel(step.label) }}
            </div>
            <Button
              v-if="!step.status && getOnboardingButtonLabel(step.label)"
              :loading="isOnboardingLoading"
              class="w-3 mx-4"
              :label="getOnboardingButtonLabel(step.label)"
              @click="props.optBtnPressed()"
            ></Button>
          </div>
        </div>
        <div class="flex py-4 gap-2">
          <!-- <Button :loading="isOnboardingLoading" label="Back" severity="secondary" @click="prevCallback"></Button> -->
          <Button
            :loading="isOnboardingLoading"
            label="Next"
            @click="props.nextBtnPressed()"
          ></Button>
        </div>
      </template>
    </StepperPanel>
    <!-- <StepperPanel header="Header III">
        <template #content="{ prevCallback }">
            <div class="flex flex-column h-12rem">
                <div class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
            </div>
            <div class="flex py-4">
                <Button label="Back" severity="secondary" @click="prevCallback"></Button>
            </div>
        </template>
    </StepperPanel> -->
  </Stepper>
</template>
