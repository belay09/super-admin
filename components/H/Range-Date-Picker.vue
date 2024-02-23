<script setup>
import { ref, onMounted } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => {
      const startDate = new Date();
      const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
      return [startDate, endDate];
    },
  },
  name: {
    type: String,
    default: "date_range",
  },
  id: String,
  rules: {
    type: [String, Object],
  },
  label: String,
  labelClass: {
    type: [String, Object],
  },
  placeholder: String,
  disabled: Boolean,
  wrapperClass: {
    type: [String, Object],
    default: "",
  },
  inputClass: {
    type: [String, Object],
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const { value: inputValue, errorMessage } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

watch(inputValue, (newVal) => {
  set(newVal);
});

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);

const set = (value) => {
  emit("update:modelValue", value);
};

const format = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" };

  const formattedDate1 = date[0].toLocaleDateString("en-US", options);
  const formattedDate2 = date[1].toLocaleDateString("en-US", options);

  return `${formattedDate1} - ${formattedDate2}`;
};
</script>

<template>
  <div :class="wrapperClass" class="w-full space-y-2">
    <label v-if="label" :class="labelClass">
      {{ label }}
    </label>
    <slot name="label" />
    <VueDatePicker
      v-model="inputValue"
      range
      calendarCellClassName="bg-white"
      :input-class-name="inputClass"
      :format="format"
      auto-apply
      @cleared="
        inputValue = [
          new Date(),
          new Date(new Date().setDate(new Date().getDate() + 7)),
        ]
      "
      :class="[
        errorMessage
          ? 'border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 group-hover:border-new-tale focus:border-new-tale focus:ring-new-tale disabled:bg-gray-100 disabled:cursor-not-allowed rounded-md shadow-sm font-body border mb-2',
        ,
      ]"
    />

    <p>
      <span v-if="errorMessage" class="text-red-500">{{ errorMessage }}</span>
    </p>
  </div>
</template>
<style>
.dp__range_start,
.dp__range_end {
  @apply bg-primary-600 text-white  rounded-full;
}

.dp__range_between {
  @apply bg-primary-100  rounded-full;
}

.dp__button_bottom {
  @apply hidden;
}
</style>
