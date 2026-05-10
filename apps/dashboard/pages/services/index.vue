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
            <h3 class="text-left">#FelioAI</h3>
            <p class="text-left mb-1">
              🚀 Tersedia beragam AI model untuk bikin gambar dan video dengan AI
            </p>
            <p class="text-left mb-1">
              🚀 Generate gambar mulai dari Rp.300 dan video mulai dari Rp.2000
            </p>
            <p class="text-left mb-1">
              🚀 Biaya kredit masih mahal, bisa coba pake freepik API. Hanya Rp.35,000 perbulan, gratis generate sebanyak-banyaknya
            </p>
            <p class="text-left">
              🎯 Cocok buat content creator, affilator, hingga business owner
            </p>
            <Button
              label="Masuk Sekarang"
              class="w-full lg:w-8 my-2"
              style="background-color: black"
              severity="info"
              rounded
              size="large"
              @click="goTo(ServiceType.aiContent)"
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
              severity="warning"
              rounded
              size="large"
              @click="goTo(ServiceType.resto)"
            ></Button>
          </div>
        </template>
      </Card>
    </div>

    <div class="col-12 xl:col-5">
      <Card class="m-4">
        <template #content>
          <div class="text-center">
            <h3 class="text-left">#FelioPos</h3>
            <p class="text-left mb-1">
              🚀 Aplikasi kasir yang simple dan minimalis
            </p>
            <p class="text-left mb-1">
              🚀 Kelola pesanan dan terima pembayaran dengan aman dan mudah
            </p>
            <p class="text-left mb-1">🚀 Kelola tagihan untuk dibayar nanti</p>
            <p class="text-left">
              🚀 Sudah termasuk #FelioStore untuk kelola produk
            </p>
            <p class="text-left">
              🎯 Cocok buat toko offline seperti restoran, minimarket, dan
              lainnya
            </p>
            <Button
              label="Coming Soon"
              class="w-full lg:w-8 my-2"
              disabled
              severity="secondary"
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
            <h3 class="text-left">#FelioAffiliate</h3>
            <p class="text-left mb-1">
              🚀 Gabung jadi member affiliate untuk pasarkan layanan felio dan
              produk merchant
            </p>
            <p class="text-left mb-1">
              🚀 Kelola dan pantau performa link yang dishare, serta data client
              yang berhasil diajak
            </p>
            <p class="text-left mb-1">
              🚀 Terima komisi untuk setiap transaksi dari client yang berhasil
              diajak
            </p>
            <p class="text-left">
              🎯 Cocok buat Anda yang ingin punya penghasilan tambahan sebagai
              affiliator
            </p>
            <Button
              label="Coming Soon"
              class="w-full lg:w-8 my-2"
              disabled
              severity="secondary"
              rounded
              size="large"
              @click="goTo(ServiceType.agent)"
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
import { getAuthData } from "~/utils/utilsFunction";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const dataAuth = ref<authType | null>(null);
const isLoading = ref<boolean>(false);

const goTo = async (service: ServiceType): Promise<void> => {
  isLoading.value = true;
  const response = await verifyServiceAccount(service, dataAuth.value?.token || '');
  isLoading.value = false;

  if (!response.success && !response.data?.serviceToken) {
    showCustomToast(toast, response.message);
  } else {
    if (service === ServiceType.websiteBuilder) {
      localStorage.setItem(
        storageNames.contentToken as string,
        JSON.stringify(response.data?.serviceToken)
      );
      window.location.href = `${runtimeConfig.public.rootUrl}web-builder/`;
    } else if (service === ServiceType.store) {
      window.location.href = runtimeConfig.public.baseUrl;
    } else if (service === ServiceType.agent) {
      window.location.href = `${runtimeConfig.public.baseUrl}agent/`;
    } else if (service === ServiceType.digitalProduct) {
      localStorage.setItem(
        storageNames.productDigitalToken as string,
        JSON.stringify(response.data?.serviceToken)
      );
      window.location.href = `${runtimeConfig.public.rootUrl}dstore/`;
    } else if (service === ServiceType.resto) {
      localStorage.setItem(
        storageNames.restoToken as string,
        JSON.stringify(response.data?.serviceToken)
      );
      window.location.href = `${runtimeConfig.public.rootUrl}resto/`;
    } else if (service === ServiceType.aiContent) {
      localStorage.setItem(
        storageNames.aiContentToken as string,
        JSON.stringify(response.data?.serviceToken)
      );
      window.location.href = `${runtimeConfig.public.rootUrl}ai-content/`;
    }
  }
};

onMounted(() => {
  dataAuth.value = getAuthData();
});
</script>
