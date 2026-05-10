<template>
  <div id="productSpecification" class="card flex flex-column mx-0">
    <label class="mb-4 text-lg font-medium">Spesifikasi Produk</label>
    <div
      v-for="(specification, i) in specifications"
      :key="i"
      class="grid mb-4 py-0 px-0 card"
    >
      <div class="col-2 md:col-1">
        <Button
          @click="editSpecification(i)"
          outlined
          icon="pi pi-pencil"
        ></Button>
        <Button
          @click="deleteSpecification(i)"
          severity="danger"
          outlined
          icon="pi pi-trash"
        ></Button>
      </div>
      <div class="col-10 md:col-11 grid">
        <div class="col-12">
          <label class="mb-4 text-md font-medium">{{
            specification.title
          }}</label>
        </div>
        <div class="col-12 pb-0">
          <span v-html="specification.description"></span>
        </div>
      </div>
    </div>

    <div class="flex justify-content-center">
      <Button
        @click="editSpecification()"
        label="Tambah Spesifikasi"
        severity="info"
        class="w-full md:w-5"
        icon="pi pi-plus"
      ></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { productSpecificationType } from "~/types/productData";

const props = defineProps<{
  specifications: productSpecificationType[];
  editSpecification: (i?: number) => void;
  deleteSpecification: (i: number) => void;
}>();
</script>
