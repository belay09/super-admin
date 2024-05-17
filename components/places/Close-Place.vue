<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
const date = ref(null);
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-x-4">
      <HDatePicker></HDatePicker>
      <VueDatePicker
        time-picker
        :range="{ disableTimeRangeValidation: true }"
        placeholder="Select Time"
        v-model="date"
      ></VueDatePicker>

      <HCheckBox></HCheckBox>

      <button true>
        <Icon
          name="icon-park-outline:add-one"
          class="text-3xl text-primary-600"
        />
      </button>
    </div>
  </div>
</template>
