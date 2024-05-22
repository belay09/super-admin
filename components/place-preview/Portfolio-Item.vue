<script setup>
import { format } from "date-fns";

const props = defineProps({
  portfolio: {
    type: Object,
    required: true,
  },
});

/**---------------------Images to show--------------- */
let imagesToShow = props.portfolio?.portfolioMedias?.slice(0, 5);
</script>

<template>
  <div
    class="p-4 samsg:p-5 md:p-8 xl:p-8 flex flex-col space-y-8 border rounded-lg"
  >
    <div
      class="flex flex-col space-y-2 md:flex-row md:justify-between md:space-x-4 md:items-center"
    >
      <p class="xl:text-xl dark:text-white">
        {{ props.portfolio?.title }}
      </p>
      <p
        class="text-sheger_brown-200 dark:text-sheger_light_gray-400 whitespace-nowrap"
      >
        {{ format(new Date(portfolio.date), " dd MMM, yyyy") }}
      </p>
    </div>
    <div class="w-full overflow-x-scroll scroll">
      <div
        class="flex flex-nowrap gap-x-4 xl:grid xl:grid-cols-4 2xl:grid-cols-5"
      >
        <img
          v-for="(image, index) in imagesToShow"
          :key="index"
          class="object-cover object-center h-64 w-full max-w-[15rem]"
          :src="image.media?.url"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>
