<template>
  <footer class="max-w-screen-xl px-8 mx-auto">
    <div class="w-full border-y border-[#DDDDDD]">
      <div
        class="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
      >
        <div
          class="md:w-full lg:w-full w-full sm:w-1/2 xl:w-fit flex flex-col sm:flex-row sm:px-6 py-6 sm:py-12 sm:space-x-10 sm:border-r-0 border-[#DDDDDD]"
        >
          <div class="sm:hidden xl:block mb-6 sm:mb-0">
            <a href="#">
              <img
                src="~/assets/img/logo/favicon.png"
                class="w-24 -mt-2"
                alt="Felio Logo"
              />
            </a>
          </div>
          <ul class="space-y-4">
            <NavLink name="Felio.ID" url="#" />
            <NavLink name="#FelioSite" url="#" />
            <NavLink name="#FelioStore" url="#" />
            <NavLink name="#FelioAgent" url="#" />
          </ul>
        </div>
        <div
          class="md:w-full lg:w-full lg:border-r w-full sm:w-1/2 xl:w-fit sm:px-16 py-6 sm:py-12 border-t sm:border-t xl:border-r border-[#DDDDDD]"
        >
          <ul class="space-y-4">
            <NavLink :name="$t('footer.aboutUs')" url="#" />
            <NavLink :name="$t('footer.contactUs')" url="#" />
            <NavLink :name="$t('footer.article')" url="#" />
          </ul>
        </div>
        <div
          class="md:w-full md:border-t lg:w-full w-full sm:w-1/2 xl:w-fit sm:px-16 py-6 sm:py-12 border-t sm:border-t-0 sm:border-r-0 border-[#DDDDDD]"
        >
          <ul class="space-y-4">
            <NavLink :name="$t('footer.privacyPolicy')" url="/privacy-policy" />
            <NavLink :name="$t('footer.terms')" url="/terms-condition" />
            <NavLink name="FAQ" url="#" />
          </ul>
        </div>
        <div
          class="md:w-full md:border-t lg:w-full sm:px-10 py-6 sm:py-12 w-full sm:w-1/2 xl:w-[22rem] space-y-4 sm:border-t border-[#DDDDDD]"
        >
          <h5
            class="text-sm font-medium text-[#666666] focus:outline-none focus:shadow-outline"
          >
            {{ $t("footer.newsletter") }}
          </h5>
          <p
            class="text-sm text-[#666666] focus:outline-none focus:shadow-outline"
          >
            {{ $t("footer.dontMissImportantInfo") }} <b>Felio.ID</b>
          </p>
          <div class="flex items-center space-x-2">
            <button
              @click="emit('showNewsletter')"
              class="bg-blue-gradient px-4 py-4 sm:py-3 rounded-md text-white hover:shadow-md transition duration-300"
            >
              Join Newsletter
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="py-8 sm:py-4 text-center text-sm text-[#666666] hover:text-gray-900"
    >
      &copy; Copyright 2022 Felio.ID. All rights reserved | Designed by NEFA LLC
    </div>
  </footer>
</template>
<script setup lang="ts">
const emit = defineEmits(["showNewsletter"]);
</script>
