<template>
  <h1>
    Coba <v-chip>{{ textVal || 'bbb' }}</v-chip>
  </h1>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

<script setup lang="ts">
// import { ref, inject } from 'vue'
import { inject } from 'vue'
const props = defineProps<{
  btnText?: String
}>()

const textProvided = inject('baseButtonProvide') as string
const textVal = textProvided || props.btnText

// const imgProvided = injsect('baseImgProvide') as string;
// const imgVal = imgProvided ?? props.customImg;
// const imgSRC = ref(imgVal)
</script>
