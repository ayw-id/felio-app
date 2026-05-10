<script setup lang="ts">
import type { BrandType } from "~/types/brandData";

const toast = useToast();

defineProps<{
  brand: BrandType;
  openBrandDetail: (brand: BrandType) => void;
}>();
</script>
<template>
  <div
    class="card hover:shadow-lg cursor-pointer text-center"
    @click="openBrandDetail(brand)"
  >
    <p>{{ brand.name }}</p>
    <Avatar
      :shape="!brand ? 'circle' : brand.logo.isCircle ? 'circle' : 'square'"
      :style="`width: 3rem; height: 3rem; background-color: ${
        brand?.logo.image ? 'white' : '#eaeaea'
      }`"
    >
      <div
        v-if="!brand?.logo.image"
        class="w-full h-full flex flex-collumn justify-content-end align-items-end"
      ></div>
      <Image v-else :src="brand?.logo.image"></Image>
    </Avatar>
  </div>
</template>
