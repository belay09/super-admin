<script setup>
import getReviewsQuery from "@/graphql/query/reviews/list.gql";

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
  similarReviews: {
    type: Array,
  },
});
</script>

<template>
  <!-- -------------------------About review--------------------- -->
  <div class="flex flex-col space-y-6 pt-2 pr-8">
    <div
      class="flex flex-col gap-y-4 lg:flex-row lg:gap-y-0 lg:gap-x-12 justify-between"
    >
      <!-- --------------   Review description  and sponsored drinks---------------- -->

      <p class="lg:flex-1 secondary-text">
        {{ review.description }}
      </p>

      <div class="flex-1" v-if="review.review_drink">
        <p class="text-2xl dark:text-white mb-4">
          <Icon name="bx:drink" class="text-inherit text-2xl" /> Goes well with
        </p>
        <div class="flex space-x-4 xl:space-x-6 items-center">
          <img
            class="object-cover iphone5:w-36 iphone5:h-36 lg:w-52 lg:h-52"
            :src="review.review_drink?.drink?.media?.url"
            :alt="review.review_drink?.drink?.media?.url + 'image'"
          />
          <div class="flex flex-col iphone5:space-y-2 xl:space-y-4">
            <h3 class="font-medium text-4xl dark:text-white">
              {{ review.review_drink?.drink?.title }}
            </h3>
            <p class="dark:text-sheger_light_gray-400">
              {{ review.review_drink?.drink?.description }}
            </p>
            <p class="dark:text-sheger_light_gray-400">
              ETB {{ review.review_drink?.drink?.price }}
            </p>
          </div>
        </div>
      </div>

      <!-- -----------------------------Sponsored drinks ---------------- -->
    </div>

    <!-- ---------------------Review Dishes----------------- -->

    <div v-if="review.menu_reviews?.length > 0">
      <p class="font-medium text-xl dark:text-white">
        <Icon name="bx:dish" class="text-inherit text-2xl" /> Review Menus
      </p>
      <div class="w-full overflow-x-scroll scroll my-6">
        <div class="flex space-x-4 lg:space-x-6 w-full">
          <PlacePreviewDishLargeItemCard
            class="dark:bg-sheger_brown-100"
            v-for="reviewMenu in review.menu_reviews"
            :key="reviewMenu.menu.id"
            :menu="reviewMenu.menu"
            :showPlace="false"
          ></PlacePreviewDishLargeItemCard>
        </div>
      </div>
    </div>
  </div>
</template>
