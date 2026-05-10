<template>
  <div id="productVariant" class="card flex flex-column mx-0">
    <label class="mb-4 text-lg font-medium">Varian Produk</label>
    <div v-if="hasProductOption" class="">
      <div :class="`flex mb-2`" style="justify-content: center">
        <div class="w-full flex flex-column">
          <!-- First layer header -->
          <h3 class="mt-3 mb-0 text-center">
            {{ transformedOpt[0].label }}
          </h3>
          <!-- First layer header buttons -->
          <div class="flex flex-column" style="align-items: center">
            <div style="text-align: center">
              <Button
                @click="modifyOption(false, true)"
                class="mt-2"
                style="width: 40px; height: 40px"
                outlined
                icon="pi pi-pencil"
              ></Button>
              <Button
                @click="showDeleteOptConfirmation(transformedOpt[0])"
                class="mt-2"
                severity="danger"
                style="width: 40px; height: 40px"
                outlined
                icon="pi pi-trash"
              ></Button>
            </div>

            <Button
              @click="modifyOption(true, false)"
              class="mt-4"
              style="width: 240px"
              :label="`Tambah opsi (${transformedOpt[0].label})`"
            ></Button>
          </div>
          <hr />
          <!-- First layer options -->
          <div class="grid p-fluid">
            <div
              v-for="(opt0, i0) in transformedOpt[0].children || []"
              class="col-12 xl:col-3"
              :key="i0"
            >
              <div
                class="card"
                :style="`padding: 12px; ${
                  selectedIndexes.i0 === i0 && 'background-color: black'
                }`"
              >
                <p
                  class="mb-0 text-center"
                  :style="`${selectedIndexes.i0 === i0 && 'color: white'}`"
                >
                  <b>{{ opt0.label }}</b>
                </p>
                <p
                  class="mb-0 text-center"
                  :style="`${selectedIndexes.i0 === i0 && 'color: white'}`"
                >
                  {{ getAmount(opt0.price, true) }}
                </p>
                <p
                  class="mb-0 text-center"
                  :style="`${selectedIndexes.i0 === i0 && 'color: white'}`"
                >
                  {{ opt0.weight }} gr
                </p>
                <p
                  class="mb-0 text-center"
                  :style="`${selectedIndexes.i0 === i0 && 'color: white'}`"
                >
                  {{ opt0.stock || opt0.redistributedQty || 0 }} unit
                </p>
                <!-- Option buttons first layer -->
                <div class="flex flex-column" style="align-items: center">
                  <div style="text-align: center">
                    <Button
                      @click="modifyOption(false, false, i0)"
                      class="mt-2 mr-1"
                      style="width: 40px; height: 40px"
                      outlined
                      icon="pi pi-pencil"
                    ></Button>
                    <Button
                      @click="showDeleteOptConfirmation(opt0)"
                      class="mt-2 ml-1"
                      severity="danger"
                      style="width: 40px; height: 40px"
                      outlined
                      icon="pi pi-trash"
                    ></Button>
                  </div>

                  <Button
                    v-if="
                      opt0.needRedistribute &&
                      opt0.children?.length &&
                      opt0.children[0].children?.length
                    "
                    @click="openRedistributeDialog(opt0)"
                    class="w-full mt-2"
                    outlined
                    :label="`Redistribusi Stok`"
                  ></Button>

                  <Button
                    @click="showDetail(i0)"
                    class="w-full mt-2"
                    style="border: none"
                    :style="`background-color: ${
                      selectedIndexes.i0 === i0 ? 'white' : 'black'
                    }; color: ${selectedIndexes.i0 === i0 ? 'black' : 'white'}`"
                    :label="`Detail`"
                  ></Button>
                </div>
              </div>
            </div>
          </div>
          <!-- second layer -->
          <div v-if="selectedIndexes.i0 >= 0">
            <hr />
            <div
              v-if="!transformedOpt[0].children[selectedIndexes.i0]?.children"
              class="flex justify-content-center"
            >
              <Button
                @click="modifyOption(true, true, selectedIndexes.i0)"
                severity="info"
                label="Tambah Varian Produk"
                class="lg:w-4"
                icon="pi pi-plus"
              ></Button>
            </div>

            <div v-else>
              <!-- Second layer header -->
              <h3 class="mt-3 mb-0 text-center">
                {{
                  transformedOpt[0].children[selectedIndexes.i0].children[0]
                    .label
                }}
              </h3>
              <!-- Second layer header buttons -->
              <div class="flex flex-column" style="align-items: center">
                <div style="text-align: center">
                  <Button
                    @click="modifyOption(false, true, selectedIndexes.i0)"
                    class="mt-2"
                    style="width: 40px; height: 40px"
                    outlined
                    icon="pi pi-pencil"
                  ></Button>
                  <Button
                    @click="
                      showDeleteOptConfirmation(
                        transformedOpt[0].children[selectedIndexes.i0]
                          .children[0]
                      )
                    "
                    class="mt-2"
                    severity="danger"
                    style="width: 40px; height: 40px"
                    outlined
                    icon="pi pi-trash"
                  ></Button>
                </div>

                <Button
                  @click="modifyOption(true, false, selectedIndexes.i0)"
                  class="mt-4"
                  style="width: 240px"
                  :label="`Tambah opsi (${
                    transformedOpt[0].children[selectedIndexes.i0].children[0]
                      .label
                  })`"
                ></Button>
              </div>
              <hr />
              <!-- Second layer options -->
              <div class="grid p-fluid">
                <div
                  v-for="(opt1, i1) in transformedOpt[0].children[
                    selectedIndexes.i0
                  ].children[0]?.children || []"
                  class="col-12 xl:col-3"
                  :key="i1"
                >
                  <div
                    class="card"
                    :style="`padding: 12px; ${
                      selectedIndexes.i1 === i1 && 'background-color: black'
                    }`"
                  >
                    <p
                      class="mb-0 text-center"
                      :style="`${selectedIndexes.i1 === i1 && 'color: white'}`"
                    >
                      <b>{{ opt1.label }}</b>
                    </p>
                    <p
                      class="mb-0 text-center"
                      :style="`${selectedIndexes.i1 === i1 && 'color: white'}`"
                    >
                      {{ getAmount(opt1.price, true) }}
                    </p>
                    <p
                      class="mb-0 text-center"
                      :style="`${selectedIndexes.i1 === i1 && 'color: white'}`"
                    >
                      {{ opt1.weight }} gr
                    </p>
                    <p
                      class="mb-0 text-center"
                      :style="`${selectedIndexes.i1 === i1 && 'color: white'}`"
                    >
                      {{ opt1.stock || opt1.redistributedQty || 0 }} unit
                    </p>
                    <!-- Second layer option buttons -->
                    <div class="flex flex-column" style="align-items: center">
                      <div style="text-align: center">
                        <Button
                          @click="
                            modifyOption(false, false, selectedIndexes.i0, i1)
                          "
                          class="mt-2 mr-1"
                          style="width: 40px; height: 40px"
                          outlined
                          icon="pi pi-pencil"
                        ></Button>
                        <Button
                          @click="showDeleteOptConfirmation(opt1)"
                          class="mt-2 ml-1"
                          severity="danger"
                          style="width: 40px; height: 40px"
                          outlined
                          icon="pi pi-trash"
                        ></Button>
                      </div>

                      <Button
                        v-if="
                          opt1.needRedistribute &&
                          opt1.children?.length &&
                          opt1.children[0].children?.length
                        "
                        @click="openRedistributeDialog(opt1)"
                        class="w-full mt-2"
                        outlined
                        :label="`Redistribusi Stok`"
                      ></Button>

                      <Button
                        @click="showDetail(selectedIndexes.i0, i1)"
                        class="w-full mt-2"
                        style="border: none"
                        :style="`background-color: ${
                          selectedIndexes.i1 === i1 ? 'white' : 'black'
                        }; color: ${
                          selectedIndexes.i1 === i1 ? 'black' : 'white'
                        }`"
                        :label="`Detail`"
                      ></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Third layer -->
          <div v-if="selectedIndexes.i1 >= 0">
            <hr />
            <div
              v-if="
                !transformedOpt[0].children[selectedIndexes.i0]?.children ||
                !transformedOpt[0].children[selectedIndexes.i0]?.children[0]
                  ?.children[selectedIndexes.i1]?.children
              "
              class="flex justify-content-center"
            >
              <Button
                @click="
                  modifyOption(
                    true,
                    true,
                    selectedIndexes.i0,
                    selectedIndexes.i1
                  )
                "
                severity="info"
                label="Tambah Varian Produk"
                class="lg:w-4"
                icon="pi pi-plus"
              ></Button>
            </div>

            <div v-else>
              <!-- Third layer header -->
              <h3 class="mt-3 mb-0 text-center">
                {{
                  transformedOpt[0].children[selectedIndexes.i0].children[0]
                    .children[selectedIndexes.i1].children[0].label
                }}
              </h3>
              <!-- Third layer header buttons -->
              <div class="flex flex-column" style="align-items: center">
                <div style="text-align: center">
                  <Button
                    @click="
                      modifyOption(
                        false,
                        true,
                        selectedIndexes.i0,
                        selectedIndexes.i1
                      )
                    "
                    class="mt-2"
                    style="width: 40px; height: 40px"
                    outlined
                    icon="pi pi-pencil"
                  ></Button>
                  <Button
                    @click="
                      showDeleteOptConfirmation(
                        transformedOpt[0].children[selectedIndexes.i0]
                          .children[0].children[selectedIndexes.i1].children[0]
                      )
                    "
                    class="mt-2"
                    severity="danger"
                    style="width: 40px; height: 40px"
                    outlined
                    icon="pi pi-trash"
                  ></Button>
                </div>

                <Button
                  @click="
                    modifyOption(
                      true,
                      false,
                      selectedIndexes.i0,
                      selectedIndexes.i1
                    )
                  "
                  class="mt-4"
                  style="width: 240px"
                  :label="`Tambah opsi (${
                    transformedOpt[0].children[selectedIndexes.i0].children[0]
                      .children[selectedIndexes.i1].children[0].label
                  })`"
                ></Button>
              </div>
              <hr />
              <!-- Third layer options -->
              <div class="grid p-fluid">
                <div
                  v-for="(opt2, i2) in transformedOpt[0].children[
                    selectedIndexes.i0
                  ].children[0].children[selectedIndexes.i1].children[0]
                    .children || []"
                  class="col-12 xl:col-3"
                  :key="i2"
                >
                  <div class="card" style="padding: 12px">
                    <p class="mb-0 text-center" style="">
                      <b>{{ opt2.label }}</b>
                    </p>
                    <p class="mb-0 text-center" style="">
                      {{ getAmount(opt2.price, true) }}
                    </p>
                    <p class="mb-0 text-center" style="">
                      {{ opt2.weight }} gr
                    </p>
                    <p class="mb-0 text-center" style="">
                      {{ opt2.stock || opt2.redistributedQty || 0 }} unit
                    </p>
                    <!-- Third layer option buttons -->
                    <div class="flex flex-column" style="align-items: center">
                      <div style="text-align: center">
                        <Button
                          @click="
                            modifyOption(
                              false,
                              false,
                              selectedIndexes.i0,
                              selectedIndexes.i1,
                              i2
                            )
                          "
                          class="mt-2 mr-1"
                          style="width: 40px; height: 40px"
                          outlined
                          icon="pi pi-pencil"
                        ></Button>
                        <Button
                          @click="showDeleteOptConfirmation(opt2)"
                          class="mt-2 ml-1"
                          severity="danger"
                          style="width: 40px; height: 40px"
                          outlined
                          icon="pi pi-trash"
                        ></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!hasProductOption" class="flex justify-content-center">
      <Button
        @click="modifyOption(true, true)"
        severity="info"
        label="Tambah Varian Produk"
        class="lg:w-4"
        icon="pi pi-plus"
      ></Button>
    </div>
  </div>
  <CustomDialogUI
    v-model:dialogState="showRedistribute"
    header="Redistribusi Stok"
    :width="32"
    :type="dialogType.form"
    :cancelButtonAction="() => (showRedistribute = false)"
    :successButtonAction="confirmRedistribution"
    :parentOption="parentOption"
    v-model:childRedistributionState="childRedistribution"
  ></CustomDialogUI>
</template>

<script setup lang="ts">
import type {
  transformedHeaderOptionsType,
  transformedValueOptionsType,
} from "~/types/productData";
import { dialogType } from "~/types/formType";

interface Indexes {
  i0: number;
  i1: number;
  i2: number;
}

const initIndexes: Indexes = {
  i0: -1,
  i1: -1,
  i2: -1,
};

const showRedistribute = ref(false);
const parentOption = ref<transformedValueOptionsType | null>(null);
const childRedistribution = ref<Record<string, number>>({});

const emit = defineEmits<
  (
    e: "redistribute",
    payload: {
      i0?: number;
      i1?: number;
      i2?: number;
      children: Array<{ index: number; qty: number }>;
    }
  ) => void
>();

defineProps<{
  hasProductOption: boolean;
  transformedOpt?: transformedHeaderOptionsType[] | undefined;
  modifyOption: (
    addNewData: boolean,
    isHeader: boolean,
    i0?: number,
    i1?: number,
    i2?: number
  ) => void;
  showDeleteOptConfirmation: (
    key: transformedHeaderOptionsType | transformedValueOptionsType
  ) => void;
  // redistribute: (parentId: number, children: {idChild: number, qty: number}[]) => void,
}>();

const selectedIndexes = ref<Indexes>(initIndexes);

const showDetail = (i0?: number, i1?: number, i2?: number) => {
  selectedIndexes.value = {
    i0: i0 ?? -1,
    i1: i1 ?? -1,
    i2: i2 ?? -1,
  };
};

const openRedistributeDialog = (option: transformedValueOptionsType) => {
  parentOption.value = option;
  childRedistribution.value = {};
  if (option.children?.length) {
    (option.children[0].children || []).forEach((child: any) => {
      let index = "";
      if (child.i0 !== undefined) {
        index = child.i0 + "";
      }
      if (child.i1 !== undefined) {
        index = child.i1 + "";
      }
      if (child.i2 !== undefined) {
        index = child.i2 + "";
      }
      childRedistribution.value[index] = 0;
    });
  }
  showRedistribute.value = true;
};

const confirmRedistribution = () => {
  const totalQty = Object.values(childRedistribution.value).reduce(
    (a, b) => a + (parseInt(b) || 0),
    0
  );

  if (totalQty > (parentOption.value?.stock || 0)) {
    alert("Total redistribution exceeds parent stock!");
    return;
  }

  // Emit redistribution to parent (for API call)
  emit("redistribute", {
    i0: parentOption.value?.i0,
    i1: parentOption.value?.i1,
    i2: parentOption.value?.i2,
    children: Object.entries(childRedistribution.value).map(([id, qty]) => ({
      index: id,
      qty: parseInt(qty + ""),
    })),
  });

  showRedistribute.value = false;
};
</script>
