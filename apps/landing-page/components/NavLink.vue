<template>
  <li class="w-full">
    <NuxtLink
      v-if="!externalLink"
      class="md:px-4 py-2 text-sm bg-transparent rounded-lg text-[#666666] hover:text-gray-900 focus:outline-none focus:shadow-outline"
      :to="url"
    >
      {{ name }}
    </NuxtLink>
    <a
      v-else
      :href="url"
      :target="`${newTab ? '_blank' : ''}`"
      class="md:px-4 py-2 text-sm bg-transparent rounded-lg text-[#666666] hover:text-gray-900 focus:outline-none focus:shadow-outline"
    >
      {{ name }}</a
    >
  </li>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    externalLink: {
      type: Boolean,
      default: false,
    },
    newTab: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
