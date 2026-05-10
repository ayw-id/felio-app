<template>
  <v-row class="pa-4 justify-center mt-12">
    <v-col cols="12" xs="12" class="text-center">
      <v-progress-circular indeterminate :size="size" :color="color"></v-progress-circular>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const props = defineProps<{
  size?: number
  color?: string
}>()

const size = props.size || 100
const color = props.color || 'primary'
</script>
