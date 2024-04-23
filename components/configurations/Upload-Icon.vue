<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: String,
  },
});

const selectedIcon = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    selectedIcon.value = newVal;
  }
);

watch(
  () => selectedIcon.value,
  (newVal) => {
    emit("update:modelValue", newVal);
  }
);

// const image
const open = ref(false);
</script>
<template>
  <ModalsModal v-model="open">
    <template #header>
      <h1 class="text-2xl">Select Icon</h1>
    </template>
    <template #content>
      <div class="">
        <HIconPeaker v-model="selectedIcon" @close="open = false" />
      </div>
    </template>
  </ModalsModal>

  <button
    type="button"
    @click="open = true"
    class="z-20 absolute inset-y-0 left-0 flex items-center px-8 bg-gray-300 w-24"
  >
    <img :src="selectedIcon" width="35" v-if="selectedIcon" />
    <Icon v-else name="heroicons:cloud-arrow-up" class="text-2xl" />
  </button>
</template>
