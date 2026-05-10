<script setup lang="ts">
import { ref } from "vue";
import { dialogType } from "~/types/formType";
import type { ProductDiscountType } from "~/types/productData";
import { getAmount } from "~/utils/utilsFunction";
import moment from "moment";

// Props
const props = defineProps<{
  discounts: ProductDiscountType[];
}>();

// Emits
const emit = defineEmits(["update:discounts", "delete:discounts"]);

const discountState = ref<ProductDiscountType>({
  title: "",
  isActive: true,
  type: "percent",
  value: 0,
  startDate: null,
  endDate: null,
});
const selectedDiscountTypeState = ref<{
  id: "percent" | "amount";
  name: string;
}>({
  id: "percent",
  name: "Persen",
});
const selectedIndex = ref<number>(-1);

const showDiscountForm = ref<boolean>(false);

const saveDiscount = (): void => {
  const tempDiscounts = JSON.parse(JSON.stringify(props.discounts));
  if (selectedIndex.value === -1) {
    tempDiscounts.push({
      ...discountState.value,
      type: selectedDiscountTypeState.value.id,
    });
  } else {
    tempDiscounts[selectedIndex.value] = {
      ...discountState.value,
      type: selectedDiscountTypeState.value.id,
    };
  }
  emit("update:discounts", tempDiscounts);

  showDiscountForm.value = false;
};

const showForm = (index = -1): void => {
  if (index === -1) {
    discountState.value = {
      title: "",
      isActive: true,
      type: "percent",
      value: 0,
      startDate: null,
      endDate: null,
    };

    selectedDiscountTypeState.value = {
      id: "percent",
      name: "Persen",
    };
  } else {
    discountState.value = props.discounts[index];

    selectedDiscountTypeState.value =
      props.discounts[index].type === "percent"
        ? {
            id: "percent",
            name: "Persen",
          }
        : {
            id: "amount",
            name: "Nominal",
          };
  }

  selectedIndex.value = index;

  showDiscountForm.value = true;
};

// Remove discount row
const removeDiscount = (index: number): void => {
  if (props.discounts[index]?.id) {
    emit("delete:discounts", props.discounts[index].id);
  }
  const tempDiscounts = JSON.parse(JSON.stringify(props.discounts));
  tempDiscounts.splice(index, 1);
  emit("update:discounts", tempDiscounts);
};
</script>

<template>
  <label class="mb-4 text-lg font-medium">Diskon Produk</label>
  <div
    v-for="(discount, index) in discounts"
    :key="index"
    class="p-3 mb-3 border rounded-lg"
  >
    <span class="flex flex-wrap">
      <p class="mb-0 mt-1 mr-2">
        {{ discount.title }}
        <b
          >(-
          {{
            discount.type === "percent"
              ? `${discount.value}%`
              : `Rp.${getAmount(discount.value)}`
          }})</b
        >
      </p>
      <Chip
        :label="discount.isActive ? 'Aktif' : 'Tidak Aktif'"
        class="m-1"
        :class="discount.isActive ? 'bg-green-100' : ''"
      />
    </span>
    <p v-if="discount.startDate && discount.endDate" class="mb-0">
      Tanggal berlaku: {{ moment(discount.startDate).format("YYYY-MM-DD") }} -
      {{ moment(discount.endDate).format("YYYY-MM-DD") }}
    </p>

    <div class="flex flex-wrap">
      <div class="col-6 pr-1">
        <Button
          icon="pi pi-pencil"
          label="Ubah"
          class="p-button-info mt-3"
          @click="showForm(index)"
        />
      </div>
      <div class="col-6 pl-1">
        <Button
          icon="pi pi-trash"
          label="Hapus"
          class="p-button-danger mt-3"
          @click="removeDiscount(index)"
        />
      </div>
    </div>
  </div>
  <div class="flex justify-content-center">
    <Button
      label="Tambah Diskon"
      icon="pi pi-plus"
      class="w-full md:w-5"
      @click="showForm()"
    />
  </div>
  <CustomDialogUI
    v-model:dialogState="showDiscountForm"
    header="Diskon Produk"
    :width="32"
    :type="dialogType.form"
    :cancelButtonAction="() => (showDiscountForm = false)"
    :successButtonAction="saveDiscount"
    v-model:productDiscountState="discountState"
  ></CustomDialogUI>
</template>
