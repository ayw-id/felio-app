<template>
  <div class="w-full">
    <!-- Hero section -->
    <section
      class="bg-trading-tools relative max-w-full sm:mx-4 xl:mx-20 my-0 shadow sm:rounded-2xl overflow-hidden"
    >
      <div class="w-full py-16 flex flex-col items-center">
        <div
          data-aos="fade-up"
          class="relative w-full flex flex-col lg:flex-row items-center justify-center space-y-12 lg:space-y-0 px-4 xl:px-10 mt-16 sm:mt-8"
        >
          <img
            data-aos="fade-up"
            data-aos-once="true"
            src="~/assets/img/feliostore/thumb-template2.png"
            style="width: 720px"
            class="-mt-4"
            alt=""
          />
        </div>
        <h2
          data-aos="flip-down"
          class="text-3xl sm:text-4xl font-semibold text-center"
        >
          {{ $t("home.felioSite.professionalWebsite.1") }} <br />{{
            $t("home.felioSite.professionalWebsite.2")
          }}
          <span class="text-header-gradient">{{
            $t("home.felioSite.professionalWebsite.3")
          }}</span>
        </h2>
        <p
          data-aos="fade-down"
          data-aos-once="true"
          data-aos-delay="300"
          class="paragraph hidden text-center sm:block pt-8 pb-4"
        >
          {{ $t("home.felioSite.createWebsites.1") }} <br />{{
            $t("home.felioSite.createWebsites.2")
          }}
        </p>
        <div
          data-aos="fade-up"
          data-aos-once="true"
          data-aos-delay="700"
          class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-2"
        >
          <BaseButton
            class="max-w-full px-8 py-4 bg-gradient-to-r from-[#468ef9] to-[#0c66ee] border border-[#0c66ee] text-white"
            @click="openWebBuilder"
          >
            {{ $t("home.felioSite.buildWebsiteBtn") }}
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-left" class="col-span-12 lg:col-span-7 sm:hidden">
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/page-type1.png"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
        <div
          data-aos="fade-right"
          class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20"
        >
          <h2 class="text-4xl font-semibold">
            {{ $t("home.felioSite.buildCustomerTrust.title") }}
          </h2>
          <p class="paragraph">
            {{ $t("home.felioSite.buildCustomerTrust.1") }}
          </p>
          <p class="paragraph">
            {{ $t("home.felioSite.buildCustomerTrust.2") }}
          </p>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-7 hidden sm:block"
        >
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/page-type1.png"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
      </BaseSection>
    </section>

    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-right" class="col-span-12 lg:col-span-7">
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/getting-started2.png"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20"
        >
          <h2 class="text-4xl font-semibold">
            {{ $t("home.felioSite.maximizeCreativity.title") }}
          </h2>
          <p class="paragraph">
            {{ $t("home.felioSite.maximizeCreativity.1") }}
          </p>
          <p class="paragraph">
            {{ $t("home.felioSite.maximizeCreativity.2") }}
          </p>
        </div>
      </BaseSection>
    </section>

    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-left" class="col-span-12 lg:col-span-7 sm:hidden">
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/sales-growth6.png"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
        <div
          data-aos="fade-right"
          class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20"
        >
          <h2 class="text-4xl font-semibold">
            {{ $t("home.felioSite.increaseTraffic.title") }}
          </h2>
          <p class="paragraph">
            {{ $t("home.felioSite.increaseTraffic.1") }}
          </p>
          <p class="paragraph">
            {{ $t("home.felioSite.increaseTraffic.2") }}
          </p>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-7 hidden sm:block"
        >
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/sales-growth6.png"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
      </BaseSection>
    </section>

    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-right" class="col-span-12 lg:col-span-7">
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/accept-payment.png"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20"
        >
          <h2 class="text-4xl font-semibold">
            {{ $t("home.felioSite.receivePayment.title") }}
          </h2>
          <p class="paragraph">
            {{ $t("home.felioSite.receivePayment.1") }}
          </p>
          <p class="paragraph">
            {{ $t("home.felioSite.receivePayment.2") }}
          </p>
        </div>
      </BaseSection>
    </section>

    <!-- Credit card section -->
    <!-- <section class="w-full my-36">
      <BaseSection style="align-items: center;">
        <div data-aos="fade-right" class="col-span-12 lg:col-span-7">
          <div class="w-full">
            <img :src="require('~/assets/img/nefa-cc.webp')" class="w-[95%]" alt="" />
          </div>
        </div>
        <div data-aos="fade-left" class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20">
          <h2 class="text-4xl font-semibold">
            Lebih Dekat Dengan Pelangganmu
          </h2>
          <p class="paragraph">Pantau traffic dan data pelangganmu untuk mengetahui apa yang mereka mau.</p>
          <p class="paragraph">Saat websitemu sudah dipublish, fitur analitycs akan otomatis aktif</p>
        </div>
      </BaseSection>
    </section> -->

    <!-- Advanced trading tools section -->
    <section
      class="bg-trading-tools relative max-w-full sm:mx-4 my-20 py-16 shadow rounded-2xl overflow-hidden"
    >
      <div
        class="relative max-w-screen-xl px-4 sm:px-2 mx-auto grid grid-cols-12 gap-x-6"
        style="align-items: center"
      >
        <LandingDomainImage class="sm:hidden" />
        <div
          data-aos="fade-right"
          class="col-span-12 lg:col-span-6 space-y-8 sm:space-y-6 px-4 sm:px-6 mt-8"
        >
          <h2 class="text-4xl font-semibold">
            {{ $t("home.felioSite.domainBrand.title") }}
          </h2>
          <div class="space-y-2" style="">
            <p class="paragraph text-sm xl:text-base">
              {{ $t("home.felioSite.domainBrand.1") }}
            </p>
            <p class="paragraph text-sm xl:text-base">
              {{ $t("home.felioSite.domainBrand.2") }}
            </p>
          </div>
        </div>
        <LandingDomainImage data-aos="fade-left" class="hidden sm:block" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const openWebBuilder = (): void => {
  window.location.href = config.public.baseUrl as string;
};
</script>
<style scoped>
.text-header-gradient {
  background: rgb(57, 132, 244);
  background: linear-gradient(
    169.4deg,
    #3984f4 -6.01%,
    #0cd3ff 36.87%,
    #2f7cf0 78.04%,
    #0e65e8 103.77%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.bg-partner {
  background: url("../../assets/img/partner/background.png");
  background-size: cover;
  background-position: center;
}
.bg-trading-tools {
  background: url("../../assets/img/bg-trading-tools.webp");
  background-size: cover;
  background-position: center;
}
.max-h-0 {
  max-height: 0;
}
</style>
