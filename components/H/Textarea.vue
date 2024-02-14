<script setup>
import { useField } from "vee-validate";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: undefined,
  },
  name: {
    type: String,
    default: undefined,
    required: true,
  },
  id: {
    type: String,
    default: undefined,
    required: false,
  },
  type: {
    type: String,
    default: "text",
    required: false,
  },
  maxlength: {
    type: Number,
    default: 400,
    required: false,
  },
  placeholder: {
    type: String,
    default: undefined,
    required: false,
  },
  label: {
    type: String,
    default: undefined,
    required: false,
  },
  labelClass: {
    type: String,
    default: () => "",
    required: false,
  },
  trailingIcon: {
    type: Function,
    default: undefined,
    required: false,
  },
  rows: {
    type: Number,
    default: 6,
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  placeholderStyle: {
    type: String,
    default: "",
    required: false,
  },

  showLength: {
    type: Boolean,
    default: false,
  },
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
  <div>
    <!-- -------------------Label----------------- -->
    <div class="mb-2">
      <slot name="label"></slot>
      <label
        :class="[props.labelClass, 'text-sheger-gray-100  ']"
        v-if="props.label"
        :for="props.id ? props.id : ''"
      >
        {{ props.label }}
      </label>
    </div>
    <div class="mt-1 relative rounded-md shadow-sm">
      <textarea
        v-model="inputValue"
        @input="set($event)"
        :type="type"
        :name="name"
        :rows="rows"
        :maxlength="maxlength"
        :id="id"
        :class="[
          errorMessage
            ? 'border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-[1px]  border-gray-300 group-hover:border-new-tale focus:border-new-tale focus:ring-0 disabled:bg-gray-100 disabled:cursor-not-allowed',
          props.placeholderStyle
            ? props.placeholderStyle
            : ' placeholder-sheger_brown-200 dark:placeholder-sheger_light_gray-400',
        ]"
        class="block w-full rounded-md p-2 secondary-border placeholder-gray-500 focus:outline-none py-3 focus:border-gray-800 focus:ring-0 scroll-bar"
        :placeholder="placeholder"
        aria-invalid="true"
        aria-describedby="email-error"
      />
      <p
        v-if="showLength"
        class="absolute right-0 mt-2 text-sm text-gray-400"
        id="email-error"
      >
        {{ (inputValue?.length || 0) + "/" + maxlength }} &nbsp;
      </p>
    </div>
    <p
      :visible="errorMessage"
      :class="errorMessage ? 'h-5' : 'h-0'"
      class="mt-2 text-sm text-red-600"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
