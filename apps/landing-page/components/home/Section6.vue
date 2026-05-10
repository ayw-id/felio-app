<template>
  <section
    class="bg-trading-tools relative max-w-full sm:mx-4 xl:mx-10 my-24 shadow sm:rounded-2xl overflow-hidden"
  >
    <div class="w-full py-16 flex flex-col items-center">
      <h2
        data-aos="flip-down"
        class="text-3xl sm:text-4xl font-semibold text-center"
      >
        {{ $t("home.cta.title") }}
      </h2>
      <div
        data-aos="fade-up"
        class="relative w-full flex flex-col lg:flex-row items-center justify-center space-y-12 lg:space-y-0 px-4 xl:px-10 mt-16 sm:mt-8"
      >
        <div
          class="max-w-[280px] xl:max-w-[363px] space-y-6 sm:space-y-3 text-center"
        >
          <BaseButton
            @click="redirectLogin"
            class="max-w-full px-8 py-4 bg-gradient-to-r from-[#468ef9] to-[#0c66ee] border border-[#0c66ee] text-white"
          >
            {{ $t("home.cta.btn") }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const redirectLogin = (): void => {
  window.location.href = config.public.baseUrl;
};
</script>
<style scoped>
.text-gradient-agent {
  background: #9bafd9;
  background: linear-gradient(
    169.4deg,
    #9bafd9 -6.01%,
    #103783 36.87%,
    #1dbde6 78.04%,
    #432371 103.77%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
