<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  status: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: "All",
  },
});

const currentStatus = ref(props.modelValue);
function changeState(state) {
  currentStatus.value = state;
  emit("update:modelValue", state);
}
</script>

<template>
  <div class="flex items-center border rounded-lg self-start">
    <button
      @click="changeState(state)"
      class="py-2 px-6 secondary-text font-medium"
      :class="[
        currentStatus == state ? 'bg-primary-600 lg:text-white' : '',
        index == 0 ? 'rounded-l-lg' : '',
        index == status.length - 1 ? 'rounded-r-lg' : '',
      ]"
      v-for="(state, index) in status"
      :key="state"
    >
      {{ state }}
    </button>
  </div>
</template>
