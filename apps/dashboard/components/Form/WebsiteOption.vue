<script setup lang="ts">
import type { WebsiteType } from "~/pages/brand/index.vue";
import type { AddBrandWebsiteInputState } from "../Brand/Website.vue";

// const id = defineModel<string>("id");
const addBrandWebsiteInputState = defineModel<AddBrandWebsiteInputState>(
  "addBrandWebsiteInputState"
);

defineProps<{
  websites: WebsiteType[];
}>();

const websiteClicked = (website: WebsiteType): void => {
  if (addBrandWebsiteInputState.value) {
    console.warn("asdasd");
    addBrandWebsiteInputState.value.selectedWebsite = website;
  }
};
</script>
<template>
  <div
    v-for="(website, i) in websites"
    :key="i"
    :class="`col-6 md:col-4 xl:col-3 mb-2 px-2 border-gray-400 ${
      website.id === addBrandWebsiteInputState?.selectedWebsite?.id &&
      'border-2'
    }`"
    style="border-radius: 12px"
    @click="websiteClicked(website)"
  >
    <Image v-if="website.thumbnail" :alt="website.websiteName">
      <template #image>
        <img
          :src="website.thumbnail"
          style="width: 100%; border-radius: 12px"
        />
      </template>
    </Image>
    <p>{{ website.websiteName }}</p>
  </div>
</template>
