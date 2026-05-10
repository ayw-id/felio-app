<script setup lang="ts">
import { ref } from "vue";
import AppMenuItem from "./AppMenuItem.vue";
import { useMainStore } from "~/stores/main";
import { getNavMenus } from "~/utils/utilsFunction";
import type { parentMenuType } from "~/types/navigation";

const mainStore = useMainStore();

const menus = ref<parentMenuType[]>([]);

watch(
  [() => mainStore.userPermissions],
  async ([permissions]) => {
    menus.value = getNavMenus(mainStore.availableServices, permissions || []);
  },
  { immediate: false }
);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menus" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
    <!-- <li>
      <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
        <img
          src="/layout/images/banner-primeblocks.png"
          alt="Prime Blocks"
          class="w-full mt-3"
        />
      </a>
    </li> -->
  </ul>
</template>

<style lang="scss" scoped></style>
