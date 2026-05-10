<template>
  <section
    class="max-w-screen-xl mx-2 sm:mx-auto px-4 sm:px-6 lg:px-0 py-6 pb-20 sm:py-8 rounded-[2.25rem] sm:rounded-xl bg-white shadow-lg sm:shadow-md transform lg:-translate-y-12"
  >
    <h3
      data-aos="fade-right"
      data-aos-once="true"
      class="text-[2.5rem] sm:text-5xl xl:text-6xl font-bold capitalize sm:pl-8 xl:pl-10"
    >
      {{ $t("home.hero.efficient.1") }} <br />{{ $t("home.hero.efficient.2") }}
      <span class="text-header-gradient">{{
        $t("home.hero.efficient.3")
      }}</span>
    </h3>
    <div
      class="w-full flex flex-col lg:flex-row items-center justify-center sm:mt-4 xl:mt-6"
    >
      <HomeSection2Item
        data-aos="fade-up"
        :title="`🔥 ${$t('home.hero.innovativeFeature.title')}`"
        :description="$t('home.hero.innovativeFeature.desc')"
        class="xl:border-r border-gray-200 lg:px-8"
      />
      <HomeSection2Item
        data-aos="fade-up"
        :title="`💎 ${$t('home.hero.budget.title')}`"
        :description="$t('home.hero.budget.desc')"
        class="xl:border-r border-gray-200 lg:px-8"
      />
      <HomeSection2Item
        data-aos="fade-up"
        :title="`🚀 ${$t('home.hero.dataSecurity.title')}`"
        :description="$t('home.hero.dataSecurity.desc')"
        class="xl:border-r border-gray-200 lg:px-8"
      />

      <!-- <HomeSection2Item
        data-aos="fade-up"
        title="🔥 Laporan Bisnis Lengkap"
        description="Butuh laporan yang komperhensif ?. Tenang, Felio.ID menyediakan fitur laporan yang bisa Kamu custom sendiri !"
        class="xl:border-r border-gray-200 lg:px-8"
      />

      <HomeSection2Item
        data-aos="fade-up"
        :title="`🚀 ${$t('home.hero.intergratedSystem.title')}`"
        :description="$t('home.hero.intergratedSystem.desc')"
        class="xl:border-r border-gray-200 lg:px-8"
      />
      <HomeSection2Item
        data-aos="fade-up"
        title="🚀 Tim Support Berpengalaman"
        description="Ada masalah dengan layanan kami?. Dengan tim support kami yang berpengalaman, semua kendala Kamu akan kami atasi dengan segera !"
        class="xl:border-r border-gray-200 lg:px-8"
      /> -->
    </div>
  </section>
</template>
<script>
export default {
  name: "HomeSection2",
  props: {},
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
