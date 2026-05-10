<script setup lang="ts">
import type { recentSalesType } from "~/types/fetchData";
const props = defineProps<{
  recentSales: recentSalesType[];
}>();
</script>
<template>
  <div class="card">
    <h5>Recent Sales</h5>
    <p v-if="!props?.recentSales?.length">No data found</p>
    <DataTable
      v-if="props?.recentSales?.length"
      :value="props?.recentSales"
      :rows="5"
      :paginator="true"
      responsiveLayout="scroll"
    >
      <Column style="width: 15%">
        <template #header> Image </template>
        <template #body="slotProps">
          <img
            :src="slotProps.data.image"
            :alt="slotProps.data.image"
            width="50"
            class="shadow-2"
          />
        </template>
      </Column>
      <Column
        field="name"
        header="Name"
        :sortable="true"
        style="width: 35%"
      ></Column>
      <Column
        field="status"
        header="Status"
        :sortable="true"
        style="width: 35%"
      >
        <template #body="slotProps">
          {{ slotProps.data.status }}
        </template>
      </Column>
      <Column style="width: 15%">
        <template #header> View </template>
        <template #body="slotProps">
          <NuxtLink
            :to="`/invoice/?id=${slotProps.data.idInvoice}`"
            target="_blank"
            rel="noopener"
          >
            <Button
              icon="pi pi-search"
              type="button"
              class="p-button-text"
            ></Button>
          </NuxtLink>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
