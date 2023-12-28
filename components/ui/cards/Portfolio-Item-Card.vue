<script setup>
defineProps({
  portfolio: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="border p-5 py-8 flex flex-col gap-3 border-sheger-gray-300 rounded-lg">
    <div class="text-lg font-medium">{{ portfolio.title }}</div>
    <div class="text-sm font-light">{{ portfolio.date }}</div>

    <div class="flex gap-5">
      <img
        v-for="(image, index) in portfolio.images"
        :key="index"
        :src="image"
        class="w-[181px] h-[229px] rounded-lg object-cover"
        alt=""
      />
    </div>
  </div>
</template>
