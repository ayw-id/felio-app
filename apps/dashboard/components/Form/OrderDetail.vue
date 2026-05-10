<script setup lang="ts">
import { getOrderStatus } from "~/utils/utilsFunction";
import type { OrderType } from "~/types/orderData";

defineProps<{
  selectedOrder: OrderType | null;
}>();
</script>
<template>
  <div v-if="selectedOrder" class="flex flex-column gap-3">
    <p class="mb-0"><strong>Invoice:</strong> {{ selectedOrder.code }}</p>
    <p class="mb-0">
      <strong>Total:</strong> {{ getAmount(selectedOrder.grandTotal ?? 0) }}
    </p>
    <p v-if="selectedOrder.status" class="mb-0">
      <strong>Status:</strong> {{ getOrderStatus(selectedOrder.status) }}
    </p>
    <p class="mb-0">
      <strong>Tanggal Pembayaran:</strong> {{ selectedOrder.paidAt }}
    </p>

    <h4>Products</h4>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(image, i) in selectedOrder.productImages"
        :key="i"
        class="flex flex-column align-items-center"
      >
        <img :src="image" :alt="image" style="width: 60px" />
      </div>
    </div>
  </div>
</template>
