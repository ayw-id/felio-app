<template>
  <div class="w-full">
    <!-- Hero section -->
    <section id="hero" class="w-full lg:pt-48 pt-32">
      <BaseSection>
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          src="~/assets/img/pattern/ellipse-1.png"
          class="hidden sm:block absolute bottom-12 xl:bottom-16 left-4 xl:left-0 w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          src="~/assets/img/pattern/ellipse-2.png"
          class="hidden sm:block absolute top-4 sm:top-10 right-64 sm:right-96 xl:right-[32rem] w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          src="~/assets/img/pattern/ellipse-3.png"
          class="hidden sm:block absolute bottom-56 right-24 w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          src="~/assets/img/pattern/star.png"
          class="hidden sm:block absolute top-20 sm:top-28 right-16 lg:right-0 lg:left-[30rem] w-8"
        />
      </BaseSection>
    </section>

    <section
      class="max-w-2xl mx-2 sm:mx-auto px-4 sm:px-6 lg:px-0 py-6 sm:py-8 rounded-[2.25rem] sm:rounded-x transform lg:-translate-y-12 lg:mb-48"
    >
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 class="text-2xl font-bold text-center mb-4">
          Gabung Ke Waiting List
        </h2>
        <p class="text-gray-600 text-center mb-6">
          Pilih layanan yang cocok untuk usaha/bisnis Anda dan dapatkan lifetime
          discount!
        </p>

        <div class="space-y-2">
          <label class="block font-medium">Email Anda:</label>
          <input
            type="email"
            v-model="state.email"
            required
            class="w-full p-2 border rounded"
            placeholder="xx@gmail.com"
          />
        </div>

        <div class="space-y-2 mt-8">
          <label class="block font-medium">Nama Anda:</label>
          <input
            type="text"
            v-model="state.name"
            required
            class="w-full p-2 border rounded"
            placeholder="Nama Anda"
          />
        </div>

        <div class="space-y-2 mt-8">
          <label class="block font-medium">Pilih Layanan:</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              :class="
                state.selectedServices.includes('digital_product')
                  ? 'bg-blue-100'
                  : ''
              "
              class="service-card border p-4 rounded-lg shadow-sm"
              @click="toggleSelection('digital_product')"
            >
              <h3 class="font-semibold">Jualan Produk Digital</h3>
              <p class="text-sm text-gray-600">
                Online Course, PDF, Webinar, dan lainnya.
              </p>
            </div>
            <div
              :class="
                state.selectedServices.includes('agent_management')
                  ? 'bg-blue-100'
                  : ''
              "
              class="service-card border p-4 rounded-lg shadow-sm"
              @click="toggleSelection('agent_management')"
            >
              <h3 class="font-semibold">Agen Management</h3>
              <p class="text-sm text-gray-600">
                Kelola reseller, pantau performa penjualan, atur level dan
                komisi.
              </p>
            </div>
            <div
              :class="
                state.selectedServices.includes('whatsapp_management')
                  ? 'bg-blue-100'
                  : ''
              "
              class="service-card border p-4 rounded-lg shadow-sm"
              @click="toggleSelection('whatsapp_management')"
            >
              <h3 class="font-semibold">WhatsApp Management</h3>
              <p class="text-sm text-gray-600">
                Kelola kontak, buat custom message, kirim blast messages.
              </p>
            </div>
            <div
              :class="
                state.selectedServices.includes('pos') ? 'bg-blue-100' : ''
              "
              class="service-card border p-4 rounded-lg shadow-sm"
              @click="toggleSelection('pos')"
            >
              <h3 class="font-semibold">Point Of Sales</h3>
              <p class="text-sm text-gray-600">
                Aplikasi kasir yang mudah digunakan.
              </p>
            </div>
            <div
              :class="
                state.selectedServices.includes('restaurant_catering')
                  ? 'bg-blue-100'
                  : ''
              "
              class="service-card border p-4 rounded-lg shadow-sm"
              @click="toggleSelection('restaurant_catering')"
            >
              <h3 class="font-semibold">Restoran & Katering</h3>
              <p class="text-sm text-gray-600">
                Kelola menu dan paket katering, terima pesanan, dan masih banyak
                lagi.
              </p>
            </div>
            <div
              :class="
                state.selectedServices.includes('pharmacy_clinic')
                  ? 'bg-blue-100'
                  : ''
              "
              class="service-card border p-4 rounded-lg shadow-sm"
              @click="toggleSelection('pharmacy_clinic')"
            >
              <h3 class="font-semibold">Farmasi & Klinik Management</h3>
              <p class="text-sm text-gray-600">
                Kelola stok obat, penjadwalan pasien, dan resep obat.
              </p>
            </div>
          </div>

          <div
            :class="
              state.selectedServices.includes('others') ? 'bg-blue-100' : ''
            "
            style="margin-top: 12px; margin-bottom: 12px"
            class="service-card border p-4 rounded-lg shadow-sm"
            @click="toggleSelection('others')"
          >
            <h3 class="font-semibold">Lainnya</h3>
            <p class="text-sm text-gray-600"></p>
          </div>

          <label
            v-if="state.selectedServices.includes('others')"
            class="block font-medium"
            style="margin-top: 24px; margin-bottom: -12px"
            >Silahkan masukkan layanan yang Anda inginkan</label
          >
          <input
            v-if="state.selectedServices.includes('others')"
            v-model="state.otherService"
            type="text"
            style="margin-top: 24px; margin-bottom: 24px"
            class="w-full p-2 border rounded"
            placeholder="Cth: CRM, Aplikasi keungan, dst..."
          />
        </div>

        <p v-if="error" class="font-semibold text-red-500 my-6">{{ error }}</p>

        <button
          @click="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          {{ isLoading ? "Loading ..." : "Gabung Sekarang !" }}
        </button>
      </div>
    </section>

    <!-- Success Popup -->
    <div
      :class="showPopup ? 'flex' : 'hidden'"
      class="fixed inset-0 items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 class="text-xl font-bold mb-2">Thank You!</h3>
        <p class="text-gray-600 mb-4">
          You've successfully joined the waiting list.
        </p>
        <button
          @click="closePopup()"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { fetchDataType } from "~/components/home/SubscribeNewsLetter.vue";

const { locale, setLocale } = useI18n();
const runtimeConfig = useRuntimeConfig();

const error = ref<string>("");
const isLoading = ref<boolean>(false);
const showPopup = ref<boolean>(false);

const state = reactive<{
  email: string;
  name: string;
  selectedServices: string[];
  otherService: string;
}>({
  email: "",
  name: "",
  selectedServices: [],
  otherService: "",
});

const submit = async (): Promise<void> => {
  error.value = "";
  if (!state.selectedServices.length) {
    error.value = "Anda belum memilih layanan";
  }

  if (!error.value && !state.email) {
    error.value = "Anda belum memasukkan email";
  }

  if (!error.value && !state.name) {
    error.value = "Anda belum memasukkan nama Anda";
  }

  if (
    !error.value &&
    state.selectedServices.includes("others") &&
    !state.otherService
  ) {
    error.value = "Anda belum memasukkan layanan yang Anda inginkan";
  }

  if (!error.value) {
    isLoading.value = true;
    const body = new FormData();
    body.append("selectedServices", JSON.stringify(state.selectedServices));
    body.append("otherService", state.otherService.trim());
    body.append("email", state.email.trim());
    body.append("name", state.name.trim());

    const response = await $fetch(
      `${runtimeConfig.public.marketingAPI as string}newsletter/addSubscriber`,
      {
        method: "post",
        body,
      }
    );

    isLoading.value = false;

    error.value = "";

    if (response) {
      const dataBind: fetchDataType | null = JSON.parse(response as string);

      if (dataBind) {
        if (dataBind.success) {
          showPopup.value = true;
        } else {
          error.value = dataBind.msg;
        }
      }
    } else {
      error.value = "Something went wrong";
    }
  }
};

const closePopup = (): void => {
  state.email = "";
  state.selectedServices = [];
  state.otherService = "";
  error.value = "";
  showPopup.value = false;
};

const toggleSelection = (param: string): void => {
  const index = state.selectedServices.findIndex(
    (service) => service === param
  );
  if (index >= 0) {
    state.selectedServices.splice(index, 1);
  } else {
    state.selectedServices.push(param);
  }
};

onMounted(async () => {
  const localCode = localStorage.getItem("LOCALE-CODE");
  if (localCode && localCode !== locale.value) {
    await setLocale(localCode);
  }
});
</script>
