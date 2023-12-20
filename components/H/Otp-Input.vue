<script setup>
const props = defineProps({
  fields: {
    type: [Number, String],
  },
});
const emit = defineEmits(["update:modelValue"]);
const firstInputEl = ref(null);
const data = ref([]);

watch(
  () => data,
  (newVal) => {
    if (
      newVal.value != "" &&
      newVal.value.length === props.fields &&
      !newVal.value.includes("")
    ) {
      emit("update:modelValue", newVal.value.join(""));
    } else {
      emit("update:modelValue", null);
    }
  },
  { deep: true }
);

const handleOtpInput = (e) => {
  if (e.data && e.target.nextElementSibling) {
    e.target.nextElementSibling.focus();
  } else if (e.data == null && e.target.previousElementSibling) {
    e.target.previousElementSibling.focus();
  }
};

const handlePaste = (e) => {
  const pasteData = e.clipboardData.getData("text");
  let nextEl = firstInputEl.value[0].nextElementSibling;
  for (let i = 1; i < pasteData.length; i++) {
    if (nextEl) {
      data.value[i] = pasteData[i];
      nextEl = nextEl.nextElementSibling;
    }
  }
};
</script>

<template>
  <div class="otp w-full flex justify-around" @input="handleOtpInput">
    <template v-for="field in fields" :key="field">
      <input
        v-model="data[field - 1]"
        ref="firstInputEl"
        type="text"
        maxlength="1"
        :class="{
          'border-primary-600 ring-primary-600':
            data[field - 1] && data[field - 1] != '',
        }"
        class="border rounded w-10 h-10 text-center focus:border-primary-600 focus:ring-primary-600 bg-transparent dark:text-white"
        @paste="field === 1 && handlePaste($event)"
      />
    </template>
  </div>
</template>
<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
