<template>
  <nav
    id="navbar"
    class="fixed cover-gradient-navbar z-10 w-full text-neutral-800"
  >
    <div
      class="flex flex-col max-w-screen-xl px-8 mx-auto lg:items-center lg:justify-between lg:flex-row"
    >
      <div
        class="flex flex-col lg:flex-row items-center space-x-4 xl:space-x-8"
      >
        <div
          class="w-full flex flex-row items-center justify-between py-2"
          style="height: 80px"
        >
          <div>
            <NuxtLink to="/"
              ><img
                src="~/assets/img/logo/favicon.png"
                style="height: 48px"
                alt="Felio Logo"
            /></NuxtLink>
          </div>
          <div>
            <button
              class="rounded-lg lg:hidden focus:outline-none focus:shadow-outline"
              style="height: 32px; width: 32px"
              @click="open = !open"
            >
              <MdiIcon
                v-if="!open"
                :size="24"
                icon="mdiSegment"
                style="width: 100%"
              />
              <MdiIcon v-else :size="24" icon="mdiClose" style="width: 100%" />
            </button>
          </div>
        </div>
        <ul
          :class="[open ? 'flex' : 'hidden lg:flex']"
          class="w-full h-auto flex flex-col flex-grow lg:items-center pb-4 lg:pb-0 lg:justify-end lg:flex-row origin-top duration-300 xl:space-x-2 space-y-3 lg:space-y-0"
        >
          <li class="relative group">
            <button
              class="md:px-4 py-2 text-sm bg-transparent rounded-lg text-[#666666] hover:text-gray-900 focus:outline-none focus:shadow-outline flex items-center"
              @click="dropdownToggler"
              @blur="dropdownToggler"
            >
              <span>{{ $t("navbar.feature.title") }}</span>
              <MdiIcon
                :size="16"
                :icon="dropdownNavbar ? 'mdiChevronUp' : 'mdiChevronDown'"
              />
              <!-- <MdiIcon v-else :size="14" icon="mdiChevronDown" /> -->
            </button>
            <transition name="transform-fade-down">
              <ul
                v-if="dropdownNavbar"
                class="flex lg:absolute flex-col max-w-42 py-1 lg:bg-white rounded-md lg:shadow-md pl-2 lg:pl-0"
              >
                <li
                  v-for="item in items"
                  :key="item.title"
                  style="width: 300px; padding: 12px 16px 12px 16px"
                >
                  <NuxtLink
                    :href="`${item.page}`"
                    class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                    @click="scrollTo(item.page)"
                  >
                    <p
                      style="
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 8px;
                      "
                    >
                      {{ item.title }}
                    </p>
                    {{ $t(item.subTitle) }}
                  </NuxtLink>

                  <!-- <button style="text-align: left" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                    <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px">{{ item.title }}</p>
                    {{ item.subTitle }}
                  </button> -->
                </li>
              </ul>
            </transition>
          </li>
          <NavLink :name="$t('navbar.pricing')" url="/pricing" />
          <NavLink
            :name="$t('navbar.blog')"
            url="https://felio.id/blog/"
            external-link
            new-tab
          />
          <NavLink :name="$t('navbar.support')" url="/#need-help" />

          <li class="relative group">
            <button
              class="md:px-4 py-2 text-sm bg-transparent rounded-lg text-[#666666] hover:text-gray-900 focus:outline-none focus:shadow-outline flex items-center"
              @click="langToggler"
              @blur="langToggler"
            >
              <span>{{ locale.toUpperCase() }}</span>
              <MdiIcon
                :size="16"
                :icon="langNavbar ? 'mdiChevronUp' : 'mdiChevronDown'"
              />
              <!-- <MdiIcon v-else :size="14" icon="mdiChevronDown" /> -->
            </button>
            <transition name="transform-fade-down">
              <ul
                v-if="langNavbar"
                class="flex lg:absolute flex-col max-w-42 py-1 lg:bg-white rounded-md lg:shadow-md pl-2 lg:pl-0"
              >
                <li style="width: 300px; padding: 12px 16px 12px 16px">
                  <NuxtLink
                    class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                    @click="switchLang('id')"
                  >
                    {{ "ID" }}
                  </NuxtLink>

                  <!-- <button style="text-align: left" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                    <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px">{{ item.title }}</p>
                    {{ item.subTitle }}
                  </button> -->
                </li>
                <li style="width: 300px; padding: 12px 16px 12px 16px">
                  <NuxtLink
                    class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                    @click="switchLang('en')"
                  >
                    {{ "EN" }}
                  </NuxtLink>

                  <!-- <button style="text-align: left" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                    <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px">{{ item.title }}</p>
                    {{ item.subTitle }}
                  </button> -->
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </div>
      <div :class="[open ? 'flex' : 'hidden lg:flex']" class="space-x-3">
        <!-- <base-button class="px-8 xl:px-10 py-3 mt-2 bg-inherit text-gradient border border-[#0c66ee]">
          Login
        </base-button> -->
        <base-button
          class="px-8 xl:px-10 py-3 my-2 bg-gradient-to-r from-[#468ef9] to-[#0c66ee] text-white"
          @click="redirectLogin"
        >
          {{ $t("navbar.login") }}
        </base-button>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
const { locale, setLocale } = useI18n();
const config = useRuntimeConfig();
const { scrollToAnchor } = useAnchorScroll({
  toTop: {
    scrollOptions: {
      behavior: "smooth",
      offsetTop: 0,
    },
  },
});

const items = [
  {
    title: "#FelioSite",
    subTitle: "navbar.feature.1.subtitle",
    page: "#felio-site",
  },
  {
    title: "#FelioStore",
    subTitle: "navbar.feature.2.subtitle",
    page: "#felio-store",
  },
  // {
  //   title: '#FelioAgent',
  //   subTitle: 'Pantau Performa Dan Atur Komisi Tim Agen Dan Reseller',
  //   page: '/#felio-agent'
  // },
  // {
  //   title: '#FelioAdmin',
  //   subTitle: 'Jualan Di Market Place, Social Media, Dan Kelola Chat',
  //   page: '/'
  // },
  // {
  //   title: '#FelioForBusiness',
  //   subTitle: 'CRM, Accounting, Kelola Tim Dan Karyawan',
  //   page: '/'
  // }
];

const open = ref<boolean>(false);
const dropdownNavbar = ref<boolean>(false);
const langNavbar = ref<boolean>(false);

const scrollTo = (id: string): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  scrollToAnchor(id);
};
const redirectLogin = (): void => {
  window.location.href = config.public.baseUrl as string;
};
const dropdownToggler = (): void => {
  dropdownNavbar.value = !dropdownNavbar.value;
};
const langToggler = (): void => {
  langNavbar.value = !langNavbar.value;
};
const switchLang = (lang: string): void => {
  localStorage.setItem("LOCALE-CODE", lang);
  setLocale(lang);
};
</script>
