<script setup>
import { useField } from "vee-validate";
import { toGregorian } from "ethiopian-date";

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
      '<svg xmlns="http://www.w3.org/2000/svg" style="color:#00B4DF;transform:scale(.5)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
    required: false,
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  class: String,
  placeholderStyle: String,
  hideDetail: Boolean,
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
const etdate = ref("");
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);

const input = (e) => {
  emit("update:modelValue", e.target.value);
};
const convert = (input) => {
  const [year, month, date] = input.target.value.split("-");

  if (year && month && date) {
    const [etyear, etmonth, etday] = toGregorian(
      parseInt(year),
      parseInt(month),
      parseInt(date)
    );

    inputValue.value = `${etyear}-${etmonth < 10 ? "0" + etmonth : etmonth}-${
      etday < 10 ? "0" + etday : etday
    }`;
    emit("update:modelValue", inputValue.value);
  }
};

const clear = () => {
  inputValue.value = "";
  emit("update:modelValue", undefined);
};
</script>

<template>
  <div :class="props.class">
    <slot name="label"></slot>

    <div class="flex">
      <div class="flex-grow">
        <div class="relative rounded-md shadow-sm">
          <input
            v-model="inputValue"
            :disabled="disabled"
            :style="
              disabled
                ? 'background: #f3f4f6'
                : `background: white url('data:image/svg+xml,${svgIcon}') right no-repeat;`
            "
            type="date"
            @input="input($event)"
            @change="input($event)"
            :id="id"
            :min="minDate"
            :max="maxDate"
            :class="[
              props.disabled
                ? 'focus:ring-gray-200  focus:border-gray-200 hover:border-gray-50 border-gray-100'
                : '',
              errorMessage
                ? 'focus:ring-red-500 focus:border-red-500 hover:border-red-500 border-red-500'
                : 'focus:ring-primary-600  focus:border-primary-600 hover:border-primary-600 border-gray-300 border-1',
              props.placeholderStyle
                ? props.placeholderStyle
                : ' placeholder-gray-500',
              disabled ? ' bg-gray-100 !cursor-not-allowed' : '',
            ]"
            class="block w-full text-secondary placeholder-primary-600 focus:outline-none text-base rounded-md"
            aria-invalid="true"
            aria-describedby="date-error"
            :placeholder="props.placeholder"
          />
          <div
            v-if="inputValue"
            @click="clear"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon
              name="ion:close-outline"
              size="25"
              class="text-gray-500 cursor-pointer"
            />
          </div>
        </div>
        <p
          v-if="!props.hideDetail"
          :visible="errorMessage"
          class="mt-2 text-sm text-red-600"
          id="email-error"
        >
          {{ errorMessage }} &nbsp;
        </p>
      </div>
      <HeadlessPopover class="relative flex-grow-0 z-10">
        <HeadlessPopoverButton class="bg-white shadow-md p-2 font-bold"
          >🇪🇹</HeadlessPopoverButton
        >
        <HeadlessPopoverPanel
          class="w-60 absolute z-10 bg-white shadow rounded-md p-4 border self-center"
        >
          <input
            v-model="etdate"
            @input="convert($event)"
            @change="convert($event)"
            :autocomplete="props.autocomplete"
            :min="min"
            :max="max"
            :name="props.name"
            step="any"
            :id="id"
            class="block w-full text-secondary focus:outline-none text-base rounded-md font-body"
            placeholder="ዓመት-ወር-ቀን"
            aria-invalid="true"
            :disabled="props.disabled"
          />
        </HeadlessPopoverPanel>
      </HeadlessPopover>
    </div>
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
