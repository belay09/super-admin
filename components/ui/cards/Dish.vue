<script setup>
import { formatDistance, format } from "date-fns";

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div
    class="relative rounded-xl border block min-w-[24rem] w-full max-w-[28rem]"
  >
    <div class="w-full mx-auto">
      <img
        :src="menu.media.url"
        class="rounded-t-xl h-[181px] w-full object-cover"
      />
    </div>
    <div class="flex flex-col space-y-2 p-5">
      <div>
        <div class="flex justify-between items-center">
          <p class="text-lg font-medium secondary-text">ETB {{ menu.price }}</p>
        </div>
      </div>
      <p class="text-2xl font-medium">{{ menu.title }}</p>

      <UiTagsPlaceReviewDishTags :tags="menu.menuTags" />

      <!-- ------------------Preparation time------------- -->
      <div class="flex space-x-4 items-start">
        <Icon
          name="uil:stopwatch"
          class="text-black text-xl lg:text-3xl dark:text-white"
        />
        <div>
          <p class="primary-text lg:text-base">Preparation Time</p>
          <p class="primary-text lg:text-base">
            {{ menu.timeToPrepare }} Minutes
          </p>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <Icon
            name="uis:calender"
            class="text-sheger_dark_gray-100 dark:text-white"
          />
          <p
            class="whitespace-nowrap text-sm text-sheger_dark_gray-100 dark:text-white"
          >
            Updated:
            {{ format(new Date(menu.updatedAt), " dd MMM, yyyy") }}
          </p>
        </div>

        <!-- ---------------------------Review link------------------- -->
        <NuxtLink
          v-if="menu.menu_reviews?.length > 0 && menu.menu_reviews[0]?.review"
          :to="`/app/sheger-reviews/${menu.menu_reviews[0].review.id}`"
        >
          <Icon name="pajamas:live-preview" class="text-primary-600 text-2xl" />
        </NuxtLink>
      </div>

      <!-- <div class="flex items-center space-x-1"></div> -->
    </div>
  </div>
</template>
