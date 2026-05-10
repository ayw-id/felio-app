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
            src="~/assets/img/feliostore/online-shop.png"
            style="width: 560px"
            class="-mt-4"
            alt=""
          />
        </div>
        <h2
          data-aos="flip-down"
          class="text-3xl sm:text-4xl font-semibold text-center"
        >
          {{ $t("home.felioStore.maximizeSales.1") }} <br />{{
            $t("home.felioStore.maximizeSales.2")
          }}
          <span class="text-header-gradient">{{
            $t("home.felioStore.maximizeSales.3")
          }}</span>
        </h2>
        <div
          data-aos="fade-up"
          data-aos-once="true"
          data-aos-delay="700"
          class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-2"
        >
          <BaseButton
            class="max-w-full px-8 py-4 bg-gradient-to-r from-[#468ef9] to-[#0c66ee] border border-[#0c66ee] text-white"
            @click="redirectLogin"
          >
            {{ $t("home.felioStore.buildOnlieStoreBtn") }}
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-left" class="col-span-12 lg:col-span-7 sm:hidden">
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/stock-products.png"
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
            {{ $t("home.felioStore.manageBusiness.title") }}
          </h2>
          <p class="paragraph">
            {{ $t("home.felioStore.manageBusiness.desc") }}
          </p>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-7 hidden sm:block"
        >
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/stock-products.png"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
      </BaseSection>
    </section>

    <!-- Credit card section -->
    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-right" class="col-span-12 lg:col-span-7">
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/shipping-payment.png"
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
            {{ $t("home.felioStore.serveCustomer.title") }}
          </h2>
          <p class="paragraph">
            {{ $t("home.felioStore.serveCustomer.desc") }}
          </p>
        </div>
      </BaseSection>
    </section>

    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-left" class="col-span-12 lg:col-span-7 sm:hidden">
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/products3.png"
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
            {{ $t("home.felioStore.productPromo.title") }}
          </h2>
          <p class="paragraph">
            {{ $t("home.felioStore.productPromo.desc") }}
          </p>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-7 hidden sm:block"
        >
          <div class="w-full">
            <img
              src="~/assets/img/feliostore/products3.png"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
      </BaseSection>
    </section>

    <!-- <section class="w-full my-36">
      <BaseSection style="align-items: center;">
        <div data-aos="fade-right" class="col-span-12 lg:col-span-7">
          <div class="w-full">
            <img src="~/assets/img/nefa-cc.webp" class="w-[95%]" alt="" />
          </div>
        </div>
        <div data-aos="fade-left" class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20">
          <h2 class="text-4xl font-semibold">
            Jangkau Lebih Banyak Calon Pembeli
          </h2>
          <p class="paragraph">Bangun tim resellermu biar penjualanmu makin maksimal. Cukup aktifkan fitur #FelioAgent, dan mulai kelola tim resellermu dengan mudah dan efisien.</p>
        </div>
      </BaseSection>
    </section> -->

    <section
      class="bg-trading-tools relative max-w-full sm:mx-4 my-20 py-16 shadow rounded-2xl overflow-hidden"
    >
      <div
        class="relative max-w-screen-xl px-4 sm:px-2 mx-auto grid grid-cols-12 gap-x-6"
        style="align-items: center"
      >
        <LandingCustomerRelationshipImage data-aos="fade-right" />
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-6 space-y-8 sm:space-y-6 px-4 sm:px-6 mt-8"
        >
          <h2 class="text-4xl font-semibold">
            {{ $t("home.felioStore.closerToCustomer.title") }}
          </h2>
          <div class="space-y-2" style="">
            <p class="paragraph text-sm xl:text-base">
              {{ $t("home.felioStore.closerToCustomer.1") }}
            </p>
            <p class="paragraph text-sm xl:text-base">
              {{ $t("home.felioStore.closerToCustomer.2") }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="w-full my-10 flex justify-center">
      <NuxtLink
        href="#navbar"
        class="px-6 py-3 flex items-center space-x-2 bg-[#FAFAFA] hover:bg-gray-100 hover:shadow-md border border-[#DDDDDD] rounded-md text-gray-700"
        data-aos="flip-down"
        data-aos-delay="150"
        @click="scrollTo('#navbar')"
      >
        <span>{{ $t("general.backToTop") }}</span>
        <MdiIcon :size="20" icon="mdiArrowUp" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { scrollToAnchor } = useAnchorScroll({
  toTop: {
    scrollOptions: {
      behavior: "smooth",
      offsetTop: 0,
    },
  },
});
const scrollTo = (id: string): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  scrollToAnchor(id);
};

const redirectLogin = (): void => {
  window.location.href = config.public.baseUrl;
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
