<script setup lang="ts">
import { ref } from "vue";
import { dialogType } from "~/types/formType";
import type { ProductWholesaleType } from "~/types/productData";

// Props
const props = defineProps<{
  tiers: ProductWholesaleType[];
}>();

// Emits
const emit = defineEmits([
  "update:wholesaleTiers",
  "update:wholesaleTiersToDelete",
]);

const selectedTierItem = ref<ProductWholesaleType | null>(null);
const showFormTierItemState = ref<boolean>(false);
const selectedWholesaleTierIndex = ref<number>(-1);

const isFormButtonLoading = ref<boolean>(false);

const saveTier = (): void => {
  if (selectedWholesaleTierIndex.value !== -1) {
    emit(
      "update:wholesaleTiers",
      props.tiers.map((tier, index) => {
        return index === selectedWholesaleTierIndex.value
          ? selectedTierItem.value
          : tier;
      })
    );
  } else {
    emit("update:wholesaleTiers", [...props.tiers, selectedTierItem.value]);
  }

  showFormTierItemState.value = false;
};

const showFormTierItem = (index?: number): void => {
  if (index !== undefined) {
    selectedTierItem.value = JSON.parse(JSON.stringify(props.tiers[index]));
    selectedWholesaleTierIndex.value = index;
  } else {
    selectedTierItem.value = {
      isActive: true,
      minQty: 0,
      pricePerUnit: 0,
    };
    selectedWholesaleTierIndex.value = -1;
  }
  showFormTierItemState.value = true;
};

const removeItem = (index: number): void => {
  emit("update:wholesaleTiersToDelete", props.tiers[index].id);
  const tiers = JSON.parse(JSON.stringify(props.tiers));
  emit(
    "update:wholesaleTiers",
    tiers.filter((tier: any, idx: number) => idx !== index)
  );
};
</script>

<template>
  <label class="mb-4 text-lg font-medium">Produk Grosir</label>
  <div class="p-3 mb-3 border rounded-lg">
    <div v-for="(item, index) in tiers" :key="index" class="card">
      <div class="grid" style="align-items: center; justify-content: center">
        <div class="col-6 md:col-7">
          <p class="mb-0">Min Qty: {{ item.minQty }}</p>
          <p class="mb-0">
            Harga Per Unit: Rp.{{ getAmount(item.pricePerUnit) }}
          </p>
        </div>
        <div class="col-6 md:col-5">
          <div class="grid">
            <Button
              label="Ubah"
              class="col-12 md:col-6 p-button-info"
              @click="showFormTierItem(index)"
            />
            <Button
              label="Hapus"
              class="col-12 md:col-6 p-button-danger"
              @click="removeItem(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-content-center">
    <Button
      :label="isFormButtonLoading ? 'Loading..' : 'Tambah Harga Grosir'"
      icon="pi pi-plus"
      class="w-full md:w-5"
      :loading="isFormButtonLoading"
      @click="showFormTierItem()"
    ></Button>
  </div>
  <CustomDialogUI
    v-if="selectedTierItem"
    v-model:dialogState="showFormTierItemState"
    header="Produk Grosir"
    :width="32"
    :type="dialogType.form"
    :cancelButtonAction="() => (showFormTierItemState = false)"
    :successButtonAction="saveTier"
    v-model:tierItemModel="selectedTierItem"
  ></CustomDialogUI>

  <Toast />
</template>
