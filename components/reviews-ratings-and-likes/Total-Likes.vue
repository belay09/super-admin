<script setup>
/**-------------------------Imports------------------------- */
import formatNumberToShow from "~/helpers/format-number-to-show";
const props = defineProps({
  textClass: {
    type: String,
    required: false,
    default: "text-sheger_brown-200 dark:text-white",
  },
});

const itemLikeCount = inject("itemLikeCount");
</script>

<template>
  <div class="flex items-center space-x-2">
    <Icon name="teenyicons:heart-solid" class="text-primary-600 md:text-lg" />
    <p class="secondary-text whitespace-nowrap" :class="textClass">
      {{ formatNumberToShow(itemLikeCount || 0) }}
    </p>
  </div>
</template>
