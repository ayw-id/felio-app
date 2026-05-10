<script setup lang="ts">
const props = defineProps<{
  title: string;
  titleValue: string;
  icon: string;
  colorIcon: string;
  subTitle: string;
  appendText: string;
}>();
</script>
<template>
  <div class="col-12 lg:col-6 xl:col-3">
    <div class="card mb-0">
      <div class="flex justify-content-between mb-3">
        <div>
          <span class="block text-500 font-medium mb-3">{{ props.title }}</span>
          <div class="text-900 font-medium text-xl">{{ props.titleValue }}</div>
        </div>
        <div
          class="flex align-items-center justify-content-center bg-orange-100 border-round"
          style="width: 2.5rem; height: 2.5rem"
        >
          <i :class="`${props.icon} ${props.colorIcon}`" class="text-xl"></i>
        </div>
      </div>
      <span class="text-green-500 font-medium">{{ props.subTitle }}</span>
      <span class="text-500">{{ props.appendText }}</span>
    </div>
  </div>
</template>
