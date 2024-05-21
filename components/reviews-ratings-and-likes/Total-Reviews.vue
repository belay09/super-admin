<script setup>
/**-------------------------Imports------------------------- */
import formatNumberToShow from "~/helpers/format-number-to-show";
const props = defineProps({
  totalReviews: {
    type: Number,
    required: true,
  },

  textClass: {
    type: String,
    required: false,
    default: "text-sheger_brown-200 dark:text-white",
  },
});
</script>

<template>
  <p class="secondary-text whitespace-nowrap" :class="textClass">
    {{ formatNumberToShow(totalReviews) }} Reviews
  </p>
</template>
