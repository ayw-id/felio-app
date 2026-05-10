<template>
  <div
    class="w-full lg:w-1/3 mt-6 lg:mt-0 overflow-hidden space-y-6"
    v-bind="$attrs"
  >
    <div class="w-full flex items-center">
      <span class="font-medium">{{ title }}</span>
    </div>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div
          class="px-2 sm:px-6 py-2 align-middle inline-block min-w-full overflow-hidden"
        >
          <p class="text-left text-sm font-medium text-gray-500">
            {{ description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "HomeSection2Item",
  props: {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
};
</script>
