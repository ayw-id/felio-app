<script setup lang="ts">
import type { WebsiteType } from "~/pages/brand/index.vue";
import { useMainStore } from "~/stores/main";

const mainStore = useMainStore();

const props = defineProps<{
  website: WebsiteType;
  isLoading: boolean;
  removeWebsite: () => void;
}>();

const goToWebsite = (): void => {
  if (props.website.lastPublishedUpdate || props.website.isPublished) {
    const anchor = document.createElement("a");
    anchor.href = props.website.websiteDomain;
    anchor.target = "_blank";
    anchor.click();
  }
};
</script>
<template>
  <div class="col-6 mb-2 px-2">
    <Image v-if="website.thumbnail" alt="Image">
      <template #image>
        <img
          :src="website.thumbnail"
          style="width: 100%; border-radius: 12px"
        />
      </template>
    </Image>
  </div>
  <div class="col-6">
    <p class="mb-0 text-sm">Title Website</p>
    <p class="text-xl">{{ website.websiteName }}</p>
    <p class="mb-0 text-sm">Domain Website</p>
    <p
      class="text-xl"
      :style="`${
        website.lastPublishedUpdate || website.isPublished
          ? 'text-decoration: underline;'
          : ''
      }`"
      @click="goToWebsite()"
    >
      {{ website.websiteDomain }}
    </p>
    <p class="mb-0 text-sm">Terakhir Diupdate</p>
    <p class="text-xl">
      {{ website.lastPublishedUpdate || website.lastUpdate }}
    </p>
  </div>
  <div
    v-if="
      mainStore.userPermissions?.some((perm) => perm === 'brand-website:delete')
    "
    class="col-12 text-center mt-2"
  >
    <Button
      type="button"
      :loading="isLoading"
      label="Hapus Website Dari Brand"
      severity="danger"
      class="w-4"
      @click="removeWebsite()"
    ></Button>
  </div>
</template>
