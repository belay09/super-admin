<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeTypeItems: {
    type: Array,
  },
});
</script>

<template>
  <div class="flex items-center space-x-6 py-5">
    <div
      v-for="placeTypeItem in placeTypeItems"
      :key="placeTypeItem.name"
      class="flex items-center space-x-2 secondary-border px-6 py-3 rounded-md hover:cursor-pointer"
      :class="{
        'lg:border-primary-600': placeTypeItem.id == modelValue,
      }"
      @click="emit('update:modelValue', placeTypeItem.id)"
    >
      <span
        class="bg-primary-100 rounded-full w-8 h-8 flex justify-center items-center text-primary-600"
      >
        {{ placeTypeItem.total }}</span
      >
      <span
        :class="{
          'text-primary-600': placeTypeItem.id == modelValue,
        }"
        >{{ placeTypeItem.name }}</span
      >
    </div>
  </div>
</template>
