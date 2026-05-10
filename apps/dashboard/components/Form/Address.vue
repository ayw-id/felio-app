<script setup lang="ts">
import { formType, inputFieldType } from "~/types/formType";
import { showCustomToast } from "~/utils/utilsFunction";
import type { fetchAddressListType } from "~/types/fetchData";
import type { addressType } from "~/types/addressData";
import type { authType } from "~/types/authData";
import type { selectedShippingServiceType } from "~/types/shippingData";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();

// const id = defineModel<string>("id");
const address = defineModel<string>("address");
const idDistrict = defineModel<string>("idDistrict");
const province = defineModel<string>("province");
const city = defineModel<string>("city");
const district = defineModel<string>("district");
const shippingServices = defineModel<string>("shippingServices");

const props = defineProps<{
  availableShippingAddress?: string[];
  showShippingInput: boolean;
}>();

const timoutStart = ref<boolean>(false);
const addressQuery = ref<string>("");
const isLoading = ref<boolean>(false);
const addressList = ref<addressType[]>([]);
const dataAuth = ref<authType | null>(null);
const selectedAddress = ref<addressType | null>(
  !idDistrict.value
    ? null
    : {
        idDistrict: idDistrict.value ?? "",
        province: province.value ?? "",
        city: city.value ?? "",
        district: district.value ?? "",
      }
);

const addressQueryMutation = computed({
  async set(val: string) {
    addressQuery.value = val;
    if (!timoutStart.value) {
      const timeoutProcess = setTimeout(async () => {
        if (addressQuery.value.length >= 3) {
          await getAddress();
        }
        clearTimeout(timeoutProcess);
      }, 1000);
    }
    timoutStart.value = true;
  },
  get() {
    return addressQuery.value;
  },
});

const shippingServicesMutation = computed(() => {
  if (!props.availableShippingAddress?.length) {
    return [];
  }
  const arrayShippingService: string[] = !shippingServices.value
    ? []
    : shippingServices.value
        .split(",")
        .map((service) => service.replace(" ", ""));

  return props.availableShippingAddress.map((availableService) => {
    return {
      service: availableService,
      isSelected: !!arrayShippingService.find(
        (selectedService) => selectedService === availableService
      ),
    };
  });
});

const getAddress = async (): Promise<void> => {
  if (!dataAuth.value) {
    const dataAuth_ = localStorage.getItem(storageNames.sellerToken as string);
    if (dataAuth_) {
      const parsedDataAuth = JSON.parse(dataAuth_);
      if (parsedDataAuth) {
        dataAuth.value = parsedDataAuth;
      }
    }
  }

  const body = new FormData();
  body.append("query", (addressQuery.value as string) || "");

  const response = await $fetch(
    `${runtimeConfig.public.sellerApi}address/search`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${dataAuth.value?.token || ""}`,
      },
      body,
    }
  );

  isLoading.value = false;
  timoutStart.value = false;

  if (!response) {
    showCustomToast(toast);
  } else {
    const dataBind: fetchAddressListType | null = JSON.parse(
      response as string
    );

    if (dataBind) {
      if (!dataBind.success) {
        showCustomToast(toast, dataBind.msg);
      } else {
        addressList.value = dataBind.data.address;
      }
    } else {
      showCustomToast(toast);
    }
  }
};

const selectDistrict = (address: addressType): void => {
  selectedAddress.value = address;
  idDistrict.value = address.idDistrict;
  province.value = address.province;
  city.value = address.city;
  district.value = address.district;
};

const removeSelectedAddress = (): void => {
  addressQuery.value = "";
  addressList.value = [];
  selectedAddress.value = null;
  idDistrict.value = "";
  province.value = "";
  city.value = "";
  district.value = "";
};

const selectService = (service: selectedShippingServiceType): void => {
  const arrayShippingService: string[] = !shippingServices.value
    ? []
    : shippingServices.value
        .split(",")
        .map((service) => service.replace(" ", ""));
  let newServices: string[] = [];
  if (arrayShippingService.find((selected) => selected === service.service)) {
    newServices = arrayShippingService.filter(
      (selected) => selected !== service.service
    );
  } else {
    newServices = [...arrayShippingService, ...[service.service]];
  }

  let newServicesStr = "";
  newServices.forEach((selected) => {
    newServicesStr += `${newServicesStr ? "," : ""}${selected}`;
  });
  shippingServices.value = newServicesStr;
};
</script>
<template>
  <div v-if="!selectedAddress" class="col-12">
    <CustomForm
      :type="formType.input"
      id="address"
      :inputType="inputFieldType.text"
      label="Provinsi / Kota / Kecamatan"
      v-model:modelData="addressQueryMutation"
    ></CustomForm>
  </div>
  <div v-if="!selectedAddress && addressList.length" class="col-12">
    <div
      v-for="(address, i) in addressList"
      :key="i"
      @click="selectDistrict(address)"
      class="card flex flex-column mx-0 my-1 p-4"
    >
      <p class="mb-0">
        {{ address.district }}, {{ address.city }}, {{ address.province }}
      </p>
    </div>
  </div>

  <div v-if="selectedAddress" class="col-12">
    <div class="card flex flex-column mx-0 my-1 p-4 bg-green-50">
      <div class="flex justify-content-end">
        <Button
          @click="removeSelectedAddress()"
          outlined
          severity="danger"
          icon="pi pi-times"
        ></Button>
      </div>
      <p class="mb-0">
        {{ selectedAddress.district }}, {{ selectedAddress.city }},
        {{ selectedAddress.province }}
      </p>
    </div>
  </div>
  <div v-if="selectedAddress" class="col-12 mt-2">
    <CustomForm
      :type="formType.inputField"
      id="address"
      :inputType="inputFieldType.number"
      label="Alamat Lengkap"
      v-model:modelData="address"
    ></CustomForm>
  </div>
  <div
    v-if="selectedAddress && props.showShippingInput"
    class="col-12 mt-2 mb-2"
  >
    <Button
      v-for="(service, i) in shippingServicesMutation"
      :key="i"
      severity="info"
      rounded
      :label="service.service"
      :outlined="!service.isSelected"
      class="mr-2"
      @click="selectService(service)"
    ></Button>
  </div>
</template>
