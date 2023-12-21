<script setup>
const props = defineProps({
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
      class="flex items-center space-x-2 secondary-border px-6 py-3 rounded-md"
    >
      <span
        class="bg-primary-100 rounded-full w-8 h-8 flex justify-center items-center text-primary-600"
      >
        {{ placeTypeItem.total }}</span
      >
      <span>{{ placeTypeItem.name }}</span>
    </div>
  </div>
</template>
