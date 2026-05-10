<template>
  <Toast />
  <div
    v-if="isLoading"
    class="text-center"
    style="height: 400px; align-content: center"
  >
    <ProgressSpinner />
  </div>
  <div v-else class="w-full grid justify-content-center mt-8">
    <div class="col-12 text-center">
      <Avatar
        :image="`${runtimeConfig.public.baseUrl}/layout/images/favicon.png`"
        class="flex-shrink-0"
        style="width: 80px; height: 80px"
        shape="circle"
      />
      <!-- <h2 class="text-2xl font-bold text-center mb-4">
        Gabung Ke Waiting List
      </h2>
      <p class="text-gray-600 text-center mb-2">
        Pilih layanan yang cocok untuk usaha/bisnis Anda dan dapatkan lifetime
        discount!
      </p> -->
    </div>
    <div class="col-12 xl:col-5">
      <Card class="m-4">
        <template #content>
          <div class="text-center">
            <h3 class="text-left">#FelioBuilder</h3>
            <p class="text-left mb-1">
              🚀 Bikin website profesional tanpa coding
            </p>
            <p class="text-left">🚀 Beli domain murah</p>
            <p class="text-left mb-1">
              🎯 Cocok buat freelancer yang menyediakan jasa bikin buat client
            </p>
            <p class="text-left">
              🎯 Cocok buat business owner yang ingin punya landing page
              profesional
            </p>
            <Button
              label="Masuk Sekarang"
              class="w-full lg:w-8 my-2 bg-indigo-700"
              rounded
              size="large"
              @click="goTo(ServiceType.websiteBuilder)"
            ></Button>
          </div>
        </template>
      </Card>
    </div>

    <div class="col-12 xl:col-5">
      <Card class="m-4">
        <template #content>
          <div class="text-center">
            <h3 class="text-left">#FelioStore</h3>
            <p class="text-left mb-1">
              🚀 Jualan produk fisik dengan toko online, atur produk, stok, dan
              varian dengan mudah
            </p>
            <p class="text-left mb-1">
              🚀 Tersedia layanan pengiriman seperti JNE, JNT, LION, dst
            </p>
            <p class="text-left mb-1">
              🚀 Tersedia layanan pembayaran seperti E-wallet (OVO, Dana,
              ShopeePay), VA, dst
            </p>
            <p class="text-left">
              🚀 Sudah termasuk #FelioBuilder (Web Builder)
            </p>
            <p class="text-left">
              🎯 Cocok buat business owner yang ingin kembangkan brand dan
              tingkatkan penjualan
            </p>
            <Button
              label="Masuk Sekarang"
              class="w-full lg:w-8 my-2"
              severity="success"
              rounded
              size="large"
              @click="goTo(ServiceType.store)"
            ></Button>
          </div>
        </template>
      </Card>
    </div>

    <div class="col-12 xl:col-5">
      <Card class="m-4">
        <template #content>
          <div class="text-center">
            <h3 class="text-left">#FelioAgent</h3>
            <p class="text-left mb-1">
              🚀 Atur level agen dan halaman registrasi reseller
            </p>
            <p class="text-left mb-1">
              🚀 Kelola komisi per produk atau per kategori
            </p>
            <p class="text-left mb-1">🚀 Kelola dan pantau performa reseller</p>
            <p class="text-left">
              🚀 Sudah termasuk #FelioStore & #FelioBuilder
            </p>
            <p class="text-left">
              🎯 Cocok buat brand yang ingin kelola tim reseller dengan mudah
            </p>
            <Button
              label="Masuk Sekarang"
              class="w-full lg:w-8 my-2"
              severity="danger"
              rounded
              size="large"
              @click="goTo(ServiceType.agent)"
            ></Button>
          </div>
        </template>
      </Card>
    </div>

    <div class="col-12 xl:col-5">
      <Card class="m-4">
        <template #content>
          <div class="text-center">
            <h3 class="text-left">#FelioDigitalProduct</h3>
            <p class="text-left mb-1">
              🚀 Jualan produk digital seperti E-book, E-course, jasa
              konsultasi, event, dst
            </p>
            <p class="text-left mb-1">
              🚀 Bikin Link Bio untuk profile IG dan TikTok
            </p>
            <p class="text-left mb-1">
              🚀 Tersedia layanan pembayaran seperti E-wallet (OVO, Dana,
              ShopeePay), VA, dst
            </p>
            <p class="text-left">
              🚀 Sudah termasuk #FelioBuilder (Web Builder)
            </p>
            <p class="text-left">
              🎯 Cocok buat business owner yang ingin kembangkan brand dan
              tingkatkan penjualan
            </p>
            <Button
              label="Masuk Sekarang"
              class="w-full lg:w-8 my-2"
              severity="info"
              rounded
              size="large"
              @click="goTo(ServiceType.digitalProduct)"
            ></Button>
          </div>
        </template>
      </Card>
    </div>

    <div class="col-12 xl:col-5">
      <Card class="m-4">
        <template #content>
          <div class="text-center">
            <h3 class="text-left">#FelioResto</h3>
            <p class="text-left mb-1">🚀 Kelola cabang resto dengan mudah</p>
            <p class="text-left mb-1">
              🚀 Kelola menu, karyawan, hingga pesanan
            </p>
            <p class="text-left mb-1">
              🚀 Tersedia fitur tagihan untuk dibayar nanti
            </p>
            <p class="text-left">🚀 Sudah termasuk #FelioPos</p>
            <p class="text-left">🎯 Cocok buat bisnis restoran dan catering</p>
            <Button
              label="Masuk Sekarang"
              class="w-full lg:w-8 my-2"
              rounded
              severity="warning"
              size="large"
              @click="goTo(ServiceType.resto)"
            ></Button>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ServiceType, verifyServiceAccount } from "~/services/Auth";
import type { authType } from "~/types/authData";
import { getAuthTempData, getAuthData } from "~/utils/utilsFunction";
import { storageNames } from "~/utils/constants";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const dataTempAuth = ref<authType | null>(null);
const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(true);

const goTo = async (service: ServiceType): Promise<void> => {
  if (!dataTempAuth.value?.token && !dataAuth.value) {
    localStorage.removeItem(storageNames.tempSellerToken as string);
    window.location.href = runtimeConfig.public.baseUrl + "auth/login";
  } else {
    isLoading.value = true;
    const response = await verifyServiceAccount(
      service,
      dataAuth.value?.token || dataTempAuth.value.token
    );
    isLoading.value = false;

    if (!response.success && !response.data?.serviceToken) {
      showCustomToast(toast, response.message);
    } else {
      if (response.data?.isStoreUser || service === ServiceType.agent) {
        localStorage.setItem(
          storageNames.sellerToken as string,
          JSON.stringify(dataTempAuth.value)
        );
      }
      localStorage.removeItem(storageNames.tempSellerToken as string);
      localStorage.removeItem(storageNames.authRedirect);

      handleRedirect(service, JSON.stringify(response.data?.serviceToken));
    }
  }
};

const handleRedirect = (service: ServiceType, tokenJSON = "") => {
  if (service === ServiceType.websiteBuilder) {
    if (tokenJSON) {
      localStorage.setItem(storageNames.builderToken as string, tokenJSON);
    }
    window.location.href = `${runtimeConfig.public.rootUrl}web-builder/`;
  } else if (service === ServiceType.store) {
    window.location.href = runtimeConfig.public.baseUrl;
  } else if (service === ServiceType.agent) {
    window.location.href = `${runtimeConfig.public.baseUrl}agent/`;
  } else if (service === ServiceType.digitalProduct) {
    if (tokenJSON) {
      localStorage.setItem(
        storageNames.productDigitalToken as string,
        tokenJSON
      );
    }
    window.location.href = `${runtimeConfig.public.rootUrl}dstore/`;
  } else if (service === ServiceType.resto) {
    if (tokenJSON) {
      localStorage.setItem(storageNames.restoToken as string, tokenJSON);
    }
    window.location.href = `${runtimeConfig.public.rootUrl}resto/`;
  } else if (service === ServiceType.aiContent) {
    if (tokenJSON) {
      localStorage.setItem(storageNames.contentToken as string, tokenJSON);
    }
    window.location.href = `${runtimeConfig.public.rootUrl}ai-content/`;
  }
};

onMounted(() => {
  dataAuth.value = getAuthData();
  dataTempAuth.value = getAuthTempData();
  const authRedirect = localStorage.getItem(storageNames.authRedirect);

  if (authRedirect === "DSTORE") {
    goTo(ServiceType.digitalProduct);
  } else if (authRedirect === "AGENT") {
    goTo(ServiceType.agent);
  } else if (authRedirect === "BUILDER") {
    goTo(ServiceType.websiteBuilder);
  } else if (authRedirect === "RESTO") {
    goTo(ServiceType.resto);
  } else if (authRedirect === "STORE") {
    goTo(ServiceType.store);
  } else if (authRedirect === "AI-CONTENT") {
    goTo(ServiceType.aiContent);
  }

  isLoading.value = false;
});
</script>
