<script setup>
import { useField } from "vee-validate";
import Visible from "@/plugins/visible";
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
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
  hideDetail: {
    type: Boolean,
    default: false,
    required: false,
  },
  trailingIcon: {
    type: [String, Function],
    default: undefined,
    required: false,
  },
  leadingText: {
    type: String,
    default: "",
    required: false,
  },
  leadingTextClass: {
    type: String,
    default: "",
    required: false,
  },
  leadingIcon: {
    type: [String],
    default: undefined,
    required: false,
  },
  min: String,
  max: String,
  rules: {
    type: [String, Object],
    default: "",
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  class: String,
  iconLeadingClass: String,
  iconTrailingClass: String,
  placeholderStyle: String,
  iconBackground: Boolean,
  mainDiv: String,
});
const emit = defineEmits(["update:modelValue", "onFocus", "onBlur", "search"]);

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const type = ref(props.type);

const set = (event) => {
  emit("update:modelValue", event.target.value);
};

const togglePassword = () => {
  if (type.value === "password") {
    type.value = "text";
    return;
  }
  if (type.value === "text") {
    type.value = "password";
  }
};

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = props.type == "number" ? Number(newVal) : newVal;
  }
);
</script>
<template>
  <div :class="mainDiv">
    <div class="flex gap-x-1">
      <slot name="label"></slot>
    </div>
    <div
      class="relative rounded-md overflow-clip font-body shadow-sm group"
      :class="props.class"
    >
      <slot name="leading" />
      <slot name="trailing" />
      <Icon
        v-if="props.leadingIcon"
        :name="leadingIcon"
        class="absolute px-3 text-gray-500"
        size="45"
      />
      <p
        v-if="props.leadingText != ''"
        :class="[
          props.leadingTextClass != ''
            ? props.leadingTextClass
            : 'text-sheger_brown-200 dark:text-sheger_light_gray-400 text-sm',
        ]"
        class="absolute top-[13px] left-4"
      >
        {{ props.leadingText }}
      </p>

      <input
        v-model="inputValue"
        @input="set($event)"
        @change="set($event)"
        @focus="emit('onFocus')"
        @blur="emit('onBlur')"
        @keyup.enter="emit('search')"
        :min="min"
        :max="max"
        :type="type"
        :name="props.name"
        step="any"
        :id="id"
        :class="[
          errorMessage
            ? 'border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-[1px]  border-gray-300  focus:border-primary-300 focus:ring-0 disabled:bg-gray-100 disabled:cursor-not-allowed',
          props.iconLeadingClass ? props.iconLeadingClass : '',
          props.leadingIcon ? 'pl-10' : '',
          props.leadingText != '' ? 'pl-14' : '',
          props.trailingIcon ? 'pr-0' : '',
          props.class ? props.class : '',
          props.placeholderStyle
            ? props.placeholderStyle
            : ' placeholder-sheger_brown-200 dark:placeholder-sheger_light_gray-400 ',
          props.trailingIcon ? 'pr-7' : '',
          props.type == 'password' ? 'pr-7' : '',
          'block w-full rounded-md font-body py-3  focus:outline-none ',
        ]"
        class="block w-full rounded-md font-body py-3 focus:outline-none secondary-text primary-background"
        :placeholder="props.placeholder"
        aria-invalid="true"
        aria-describedby="email-error"
        :disabled="props.disabled"
      />
      <div
        v-if="props.type == 'password'"
        class="absolute inset-y-0 right-0 flex items-center pr-3 hover:cursor-pointer"
        @click="togglePassword()"
      >
        <Icon
          class="h-5 w-5"
          :class="
            props.iconTrailingClass ? props.iconTrailingClass : 'secondary-text'
          "
          :name="props.trailingIcon"
        ></Icon>
      </div>
      <div
        v-else-if="props.trailingIcon"
        @click="emit('search')"
        class="absolute inset-y-0 right-0 flex items-center pr-3 hover:cursor-pointer"
      >
        <Icon class="text-gray-500" :name="props.trailingIcon" size="20"></Icon>
      </div>
    </div>
    <p
      class="col-span-5 mt-1 font-body text-sm text-red-600 duration-300 transition-all"
      :class="errorMessage ? 'h-5' : 'h-0'"
      id="email-error"
      :visible="errorMessage"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
