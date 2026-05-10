<template>
  <section id="hero" class="w-full pb-24">
    <BaseSection>
      <div
        class="col-span-12 lg:col-span-6 mt-12 xl:mt-10 space-y-4 sm:space-y-6 px-6 text-center sm:text-left"
      >
        <!-- <span data-aos="fade-right" data-aos-once="true" class="text-base text-gradient font-semibold uppercase"
          >Sign Up Today</span
        > -->
        <h1
          data-aos="fade-right"
          data-aos-once="true"
          class="text-[2.5rem] sm:text-4xl xl:text-5xl font-bold leading-tight capitalize sm:pr-8 xl:pr-10"
        >
          {{ $t("home.hero.header.1") }}
          <span class="text-header-gradient">{{
            $t("home.hero.header.2")
          }}</span>
          {{ $t("home.hero.header.3") }}
        </h1>
        <p
          data-aos="fade-down"
          data-aos-once="true"
          data-aos-delay="300"
          class="paragraph hidden sm:block"
        >
          {{ $t("home.hero.efficientlyHandlingBusiness") }}
        </p>
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
            {{ $t("home.hero.startNow") }}
          </BaseButton>
          <!-- <BaseButton
            class="max-w-full px-6 py-4 bg-inherit text-gradient border border-[#0c66ee] flex items-center justify-center"
          >
            <span>Download App</span>
            <ChevronDownIcon :size="20" class="mt-1 text-[#0c66ee]" />
          </BaseButton> -->
        </div>
      </div>
      <div class="hidden sm:block col-span-12 lg:col-span-6">
        <div class="w-full">
          <img
            data-aos="fade-up"
            data-aos-once="true"
            src="~/assets/img/feliostore/hero-animation2.gif"
            class="-mt-4"
            style="border-radius: 24px"
            alt=""
          />
        </div>
      </div>
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
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const redirectLogin = (): void => {
  window.location.href = config.public.baseUrl as string;
};
</script>
<style scoped>
.text-header-gradient {
  background: #3984f4;
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
</style>
