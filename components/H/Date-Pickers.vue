<script setup>
import { ref, watch } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  modelValue: [String, Date],
  name: {
    type: String,
    default: undefined,
    required: true,
  },
  id: String,
  rules: {
    type: String,
    default: "",
    required: false,
  },
  label: String,
  labelClass: {
    type: String,
    default: () => "",
    required: false,
  },
  placeholder: String,
  disabled: Boolean,
  min: [String, Date],
  max: [String, Date],
  value: {
    type: [String, Date],
    default: () => new Date("01-01-2001"),
    required: false,
  },
  svgIcon: {
    type: String,
    default:
      '<svg xmlns="http://www.w3.org/2000/svg" style="color:#203468;transform:scale(.5)" fill="#203468" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
    required: false,
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  showStar: {
    type: Boolean,
    default: true,
  },

  /*-------------------- Trailing icon-----------------------*/
  trailingIcon: {
    type: String,
    required: false,
    default: undefined,
  },

  trailingIconClass: {
    type: String,
    required: false,
    default: "",
  },
  trailingIconContainerClass: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const minDate = ref(props.min);
const maxDate = ref(props.max);

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);

const input = (e) => {
  emit("update:modelValue", e.target.value);
};
</script>

<template>
  <div>
    <div class="w-full mb-2">
      <slot name="label"></slot>
      <label
        :class="[props.labelClass, 'text-sheger-gray-100  ']"
        v-if="props.label"
        :for="props.id ? props.id : ''"
      >
        {{ props.label }}
      </label>
    </div>
    <div class="relative w-full rounded-md shadow-sm">
      <input
        v-model="inputValue"
        :disabled="disabled"
        :style="`background: white url('data:image/svg+xml,${svgIcon}') right no-repeat;`"
        type="date"
        @input="input($event)"
        @change="input($event)"
        :id="id"
        :min="minDate"
        :max="maxDate"
        :class="[
          errorMessage
            ? 'focus:ring-red-500 focus:border-red-500 hover:border-red-500 border-red-500'
            : 'focus:ring-primary-600  focus:border-primary-600 hover:border-primary-600-2 secondary-border',
          props.disabled
            ? 'bg-gray-100 border-gray-200 hover:border-gray-200 text-gray-400 pointer-events-none shadow-none'
            : ' focus:ring-1',
        ]"
        class="block w-full py-3 text-base rounded-md text-secondary placeholder-primary-600 focus:outline-none focus:border-gray-800 focus:ring-0"
        aria-invalid="true"
        aria-describedby="date-error"
      />

      <!-- --------------------Trailing icon-------------------- -->
      <div
        v-if="props.trailingIcon"
        class="absolute inset-y-0 right-0 flex items-center pr-3 hover:cursor-pointer"
        :class="props.trailingIconContainerClass"
      >
        <Icon
          class="text-xl"
          :class="props.trailingIconClass"
          :name="props.trailingIcon"
        ></Icon>
      </div>
    </div>

    <p
      :visible="errorMessage"
      class="mt-2 text-sm text-red-600"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>

<style scoped>
[type="date"]::-webkit-inner-spin-button {
  display: none;
}
[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  opacity: 0;
  padding: 5px;
  width: 100%;
  cursor: pointer;
}
</style>
