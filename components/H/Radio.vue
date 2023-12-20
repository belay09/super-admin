<script setup>
import { useField } from "vee-validate";
import Visible from "@/plugins/visible";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: undefined,
  },
  items: Array,
  name: {
    type: String,
    default: undefined,
    required: true,
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  class: {
    type: String,
  },
  label: {
    type: String,
    default: undefined,
    required: false,
  },
  labelClass: {
    type: String,
  },
  disabled: Boolean,
});

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const set = (event) => {
  emit("update:modelValue", event.target.value);
};
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);
</script>
<template>
  <label :class="labelClass" :for="label" class="block">{{ label }} </label>
  <div :class="props.class" class="flex">
    <div
      class="relative flex items-start flex-wrap"
      :class="item.class"
      v-for="item in props.items"
      :key="item.value"
    >
      <div class="flex items-center h-5">
        <input
          v-model="inputValue"
          @input="set"
          :id="item.value"
          :aria-describedby="item.label"
          :disabled="props.disabled"
          :name="props.name"
          type="radio"
          :value="item.value"
          :class="[
            errorMessage
              ? 'focus:ring-red-500  h-4 w-4 focus:border-red-500 rounded-full text-sm  cursor-pointer'
              : 'focus:ring-primary-600 h-4 w-4  border-secondary rounded-full text-sm cursor-pointer',
            props.disabled
              ? 'pointer-events-none text-gray-400 focus:ring-gray-400'
              : 'text-primary-600',
          ]"
        />
      </div>
      <div class="ml-3 text-sm mr-2">
        <label
          :for="item.value"
          :class="labelClass"
          class="font-sm text-secondary cursor-pointer"
        >
          {{ item.label }}
        </label>
        <p v-if="item.description" class="text-secondary text-sm">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
  <p :visible="errorMessage" class="mt-2 text-sm text-red-600" id="email-error">
    {{ errorMessage }} &nbsp;
  </p>
</template>
