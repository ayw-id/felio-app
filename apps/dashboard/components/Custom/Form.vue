<script setup lang="ts">
import { formType } from "~/types/formType";
import type { inputFieldType, dropdownOptionsType } from "~/types/formType";
const props = defineProps<{
  type: formType;
  id?: string;
  inputType?: inputFieldType;
  placeholder?: string;
  label: string;
  dropdownOptions?: dropdownOptionsType[];
  showDropdownClear?: boolean;
  append?: string;
  disabled?: boolean;
  mode?: "decimal" | "currency";
  min?: number;
  locale?: string;
  currency?: string;
}>();

const modelData = defineModel<any>("modelData");
</script>
<template>
  <div
    v-if="props.type === formType.switch"
    class="col-12 mb-2 flex items-center gap-2"
  >
    <span>{{ props.label }}</span>
    <InputSwitch v-model="modelData" />
  </div>
  <div v-else class="col-12 mb-2">
    <label v-if="!!props.label">{{ props.label }}</label>

    <Calendar
      v-if="props.type === formType.calendar"
      v-model="modelData"
      dateFormat="yy-mm-dd"
      :class="`w-full ${props.label && 'mt-2'}`"
      style="height: 48px"
      showIcon
    />

    <FloatLabel
      v-else
      :class="`w-full input-append ${props.label && 'mt-2'}`"
      :style="`height: ${props.type === formType.inputField ? 80 : 48}px;`"
    >
      <InputNumber
        v-if="mode === 'currency'"
        v-model="modelData"
        mode="currency"
        currency="IDR"
        locale="id-ID"
        class="w-full"
        :min="props.min"
      />

      <InputText
        v-if="
          props.type === formType.input && !props.append && mode !== 'currency'
        "
        :id="props.id"
        v-model="modelData"
        :type="props.inputType"
        :disabled="disabled"
        :placeholder="props.placeholder || props.label || ''"
        class="w-full"
        :mode="mode"
        :currency="currency"
        :locale="locale"
        style="padding: 1rem"
        :min="props.min"
      />

      <input
        v-if="props.type === formType.input && props.append"
        :id="props.id"
        v-model="modelData"
        :type="props.inputType"
        :disabled="disabled"
        :placeholder="props.placeholder || props.label || ''"
        class="w-full"
      />
      <span v-if="props.type === formType.input && props.append">{{
        props.append
      }}</span>

      <Dropdown
        v-if="props.type === formType.dropdown"
        v-model="modelData"
        :options="props.dropdownOptions || []"
        :showClear="props.showDropdownClear"
        filter
        optionLabel="name"
        :placeholder="props.placeholder || props.label || ''"
        class="w-full"
        style="padding: 0.5rem"
      >
        <template #value="dropdownProps">
          <div v-if="dropdownProps.value" class="flex align-items-center">
            <div>{{ dropdownProps.value.name }}</div>
          </div>
          <span v-else>
            {{ dropdownProps.placeholder }}
          </span>
        </template>
        <template #option="dropdownProps">
          <div
            v-if="dropdownProps.option.id !== 0"
            class="flex align-items-center"
          >
            <div>{{ dropdownProps.option.name }}</div>
          </div>
          <div v-else class="flex align-items-center">
            <Button :label="dropdownProps.option.name"></Button>
          </div>
        </template>
      </Dropdown>

      <Textarea
        v-if="props.type === formType.inputField"
        class="w-full"
        style="height: 80px"
        v-model="modelData"
        autoResize
        rows="5"
        cols="30"
      ></Textarea>
    </FloatLabel>
  </div>
</template>

<style>
.input-append {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  width: "fit-content";
}
.input-append input {
  border: none;
  padding: 8px;
  outline: "none";
  /* width: 240px; */
}
.input-append span {
  background: #eee;
  padding: 8px;
  align-content: center;
  white-space: nowrap;
}
</style>
