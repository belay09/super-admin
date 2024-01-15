<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Number,
    default: () => 1,
  },
  totalPage: {
    type: Number,
    default: undefined,
    required: false,
  },
});

const pageTracker = ref(props.modelValue);
watch(
  () => props.modelValue,
  (newVal) => {
    pageTracker.value = newVal;
  }
);

function pageUp() {
  if (props.modelValue < props.totalPage) {
    console.log("page up", props.totalPage, props.modelValue);
    pageTracker.value = pageTracker.value + 1;
    emit("update:modelValue", props.modelValue + 1);
  }
}

// page down
function pageDown() {
  if (props.modelValue > 1) {
    pageTracker.value = pageTracker.value - 1;
    emit("update:modelValue", props.modelValue - 1);
  }
}
</script>

<template>
  <div class="primary-flex-row">
    <p class="text-sheger-gray-100">Showing</p>

    <div class="teritary-flex-row secondary-border rounded-md px-4">
      <span>{{ totalPage > 0 ? pageTracker : 0 }}</span>
      <div class="flex flex-col">
        <button
          :disabled="totalPage == 0 || pageTracker === totalPage"
          @click="pageUp"
          class="chevron-icon"
        >
          <Icon name="tabler:chevron-up" class="text-lg" color="" />
        </button>
        <button
          :disabled="totalPage == 0 || pageTracker === 1"
          @click="pageDown"
          class="chevron-icon"
        >
          <Icon name="tabler:chevron-down" class="text-lg" color="" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chevron-icon {
  @apply self-start leading-none disabled:text-gray-300;
}
</style>
