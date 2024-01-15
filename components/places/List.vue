<script setup>
defineProps({
  featured: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div class="flex flex-col space-y-8 py-6">
    <div class="flex items-center justify-between">
      <p class="text-xl font-medium">Showing 9/12</p>
      <H-Limit></H-Limit>
    </div>
    <div class="grid grid-cols-3 gap-4 w-[85%]">
      <UiCardsPlace />
      <UiCardsPlace />
      <UiCardsPlace />
      <UiCardsPlace />
      <UiCardsPlace />
    </div>
    <HPaginate
      v-modeloffset="0"
      :items-per-page="8"
      :total-data="100"
      class="w-full pt-16"
    ></HPaginate>
  </div>
</template>
