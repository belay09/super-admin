<script setup>
import formatNumber from "@/helpers/format-number-to-show";
const props = defineProps({
  review: {
    type: Number,
    required: true,
    default: 0,
  },

  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  like: {
    type: Number,
    required: true,
    default: 0,
  },
});
</script>

<template>
  <div class="flex items-center gap-x-6">
    <!-- ----------------Rating ----------------------->
    <div class="flex items-center gap-2">
      <Icon name="iwwa:star" class="w-6 h-6" />
      <p class="">
        {{ rating + 0 }}/5
        <span class="pl-2">({{ formatNumber(review) }} reviews)</span>
      </p>
    </div>
    <div>
      <p class="">|</p>
    </div>
    <!-- -----------------Like ----------------------->
    <div class="flex items-center gap-2">
      <Icon name="heroicons:heart-solid" class="w-6 h-6" />
      <p class="">{{ formatNumber(like) }} <span class="">Likes</span></p>
    </div>
  </div>
</template>
