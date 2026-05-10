<script setup lang="ts">
import { DomainType, type ExtensionDataType } from "~/types/websiteData";
import { formType } from "~/types/formType";
import type { SubdomainPriceType } from "~/types/fetchData";

const runtimeConfig = useRuntimeConfig();

const props = defineProps<{
  extensionList: ExtensionDataType[];
  subdomainPrice: SubdomainPriceType | null;
  isLoading: boolean;
  addDomain: () => void;
}>();

const selectedDomainType = ref<DomainType | undefined>(DomainType.domain);
const domainName = defineModel<string>("hostName");
const error = ref<string>("");

const setSelectedDomainType = (domainType: DomainType): void => {
  domainName.value = "";
  if (selectedDomainType.value !== domainType) {
    selectedDomainType.value = domainType;
  } else {
    selectedDomainType.value = undefined;
  }
};

const goToDomainSearch = (): void => {
  const anchor = document.createElement("a");
  anchor.href = (runtimeConfig.public.webBuilderUrl ?? "") + "domain-search";
  anchor.target = "_blank";
  anchor.click();
};

const submitData = (): void => {
  if (props.subdomainPrice) {
    error.value = "";
    if (!domainName.value?.length) {
      error.value = "Silahkan masukkan nama subdomain anda";
    } else if (domainName.value.length > props.subdomainPrice.maxChars) {
      error.value = "Maximal karakter: " + props.subdomainPrice.maxChars;
    } else if (!/^[a-zA-Z0-9_-]+$/.test(domainName.value)) {
      error.value = "Terdapat karakter spesial di nama domain Anda";
    } else {
      props.addDomain();
    }
  }
};
</script>
<template>
  <div class="col-12">
    <p class="text-3xl">
      <b>Top Domain</b> <span class="text-xl">(cth: <b>example</b>.com)</span>
      <Button
        @click="setSelectedDomainType(DomainType.domain)"
        :icon="`pi pi-angle-${
          selectedDomainType === DomainType.domain ? 'up' : 'down'
        }`"
        :severity="
          selectedDomainType === DomainType.domain ? 'secondary' : 'primary'
        "
      ></Button>
    </p>
    <div v-if="selectedDomainType === DomainType.domain" class="grid">
      <div
        v-for="(extension, i) in props.extensionList"
        :key="i"
        class="col-2 p-1"
      >
        <div
          class="border-cyan-700 border-1 rounded-xl p-1"
          style="border-radius: 12px"
        >
          <p class="font-bold text-2xl text-center">
            {{ extension.extension }}
          </p>
          <p
            v-if="extension.discountPrice"
            class="text-center line-through mb-0"
          >
            {{ getAmount(extension.price, true) }}
          </p>
          <p class="font-bold text-xl text-center mb-0">
            {{ getAmount(extension.discountPrice || extension.price, true) }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="selectedDomainType === DomainType.domain"
      class="col-12 mt-1 text-center"
    >
      <Button
        type="button"
        :loading="isLoading"
        label="Dapatkan Domain"
        severity="primary"
        class="w-3"
        @click="goToDomainSearch()"
      ></Button>
    </div>
  </div>
  <div v-if="subdomainPrice" class="col-12 mt-4">
    <p class="text-3xl">
      <b>Sub Domain</b>
      <span class="text-xl">(cth: <b>example</b>.felio.id)</span>
      <Button
        @click="setSelectedDomainType(DomainType.subDomain)"
        :icon="`pi pi-angle-${
          selectedDomainType === DomainType.subDomain ? 'up' : 'down'
        }`"
        :severity="
          selectedDomainType === DomainType.subDomain ? 'secondary' : 'primary'
        "
      ></Button>
    </p>

    <div v-if="selectedDomainType === DomainType.subDomain" class="grid">
      <p class="ml-2">
        Registrasi subdomain hanya
        <b>{{ getAmount(subdomainPrice.price, true) }}</b>
      </p>
      <CustomForm
        :type="formType.input"
        append=".felio.id"
        placeholder="Nama subdomain"
        label="Sub Domain"
        v-model:modelData="domainName"
      ></CustomForm>
      <p v-if="error" class="text-red-500 ml-2 -mt-4">{{ error }}</p>
    </div>

    <div
      v-if="selectedDomainType === DomainType.subDomain"
      class="col-12 mt-1 text-center"
    >
      <Button
        type="button"
        :loading="isLoading"
        label="Dapatkan Sub Domain"
        severity="primary"
        class="w-3"
        @click="submitData()"
      ></Button>
    </div>
  </div>
</template>
