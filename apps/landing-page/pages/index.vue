<template>
  <div v-if="!isLoading" class="w-full">
    <!-- Hero section -->
    <HomeSection1 id="landing-hero" class="pt-32" />

    <!-- Section 2 -->
    <HomeSection2 />

    <!-- Section 3 -->
    <HomeFelioSite id="felio-site" />

    <!-- Section 4 -->
    <HomeFelioStore id="felio-store" />

    <!-- Section 5 -->
    <!-- <HomeFelioAgent id="felio-agent" /> -->

    <!-- Section 6 -->
    <HomeSection6 />

    <!-- Help -->
    <HomeNeedHelp id="need-help" />

    <div class="w-full my-10 flex justify-center">
      <NuxtLink
        href="#landing-hero"
        data-aos="flip-down"
        data-aos-delay="150"
        class="px-6 py-3 flex items-center space-x-2 bg-[#FAFAFA] hover:bg-gray-100 hover:shadow-md border border-[#DDDDDD] rounded-md text-gray-700"
        @click="scrollTo('#landing-hero')"
      >
        <span>{{ $t("general.backToTop") }}</span>
        <MdiIcon :size="20" icon="mdiArrowUp" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storageNames } from "~/utils/constants";
interface FetchData extends fetchDataType {
  success: number;
  msg: string;
}

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const { locale, setLocale } = useI18n();

const { scrollToAnchor } = useAnchorScroll({
  toTop: {
    scrollOptions: {
      behavior: "smooth",
      offsetTop: 0,
    },
  },
});

const isLoading = ref<boolean>(true);

const trackLink = async (): Promise<void> => {
  let code = "";
  let platform = "";
  if (route.query.lp) {
    code = route.query.lp;
    platform = "lp";
  } else if (route.query.app) {
    code = route.query.app;
    platform = "app";
  } else if (route.query.builder) {
    code = route.query.builder;
    platform = "builder";
  } else if (route.query.agent) {
    code = route.query.agent;
    platform = "agent";
  } else if (route.query.dstore) {
    code = route.query.dstore;
    platform = "dstore";
  } else if (route.query.resto) {
    code = route.query.resto;
    platform = "resto";
  }
  if (code && platform) {
    try {
      const res = await $fetch(
        `${runtimeConfig.public.marketingAPI}tracker/updateCount/${platform}/${code}`
      );

      const dataBind: FetchData | null = JSON.parse(res);
      if (dataBind) {
        if (dataBind.success === 1) {
          localStorage.setItem(
            storageNames.authRedirect,
            platform.toUpperCase()
          );
          window.location.href = runtimeConfig.public.baseUrl;
        }
      }
    } catch (error) {
      console.warn("error", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const localCode = localStorage.getItem("LOCALE-CODE");
  if (localCode && localCode !== locale.value) {
    setLocale(localCode);
  }

  await trackLink();
});

const scrollTo = (id: string): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  scrollToAnchor(id);
};
</script>
<style>
.cover-gradient-2 {
  background: linear-gradient(
    169.4deg,
    #e76f511a -6.01%,
    #aff4611a 36.87%,
    #0fe89c1a 78.04%,
    rgba(65, 14, 232, 0.1) 103.77%
  );
}
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
.bg-partner {
  background: url("../assets/img/partner/background.png");
  background-size: cover;
  background-position: center;
}
.bg-trading-tools {
  background: url("../assets/img/bg-trading-tools.webp");
  background-size: cover;
  background-position: center;
}
.max-h-0 {
  max-height: 0;
}
</style>
