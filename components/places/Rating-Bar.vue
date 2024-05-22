<script setup>
const props = defineProps({
  rate: {
    type: Array,
    required: true,
  },
});
</script>
<template>
  <div class="flex items-center p-2" v-for="dummy in rate" :key="index">
    <div class="item-center w-1/5">
      <Nuxt-Rating :rating-value="dummy.rating"></Nuxt-Rating>
    </div>
    <div class="item-center w-1/2 mx-3">
      <ShegerReviews-Bar :value="dummy.barValue" :total="dummy.barTotal" />
    </div>
    <div class="items-center mx-3">({{ dummy.barValue }})</div>
  </div>
</template>
