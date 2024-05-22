<script setup>
const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div
    class="w-full xl:border-l xl:pl-10 2xl:pl-12 xl:overflow-y-scroll xl:mt-8 scroll z-10 duration-500 dark:border-darkBorder"
    :class="`xl:max-h-[150vh]`"
  >
    <!-- ---------------Review tiktok and instagram links-------- -->
    <div class="flex items-center gap-x-6 pt-4 lg:pt-0">
      <NuxtLink
        v-if="review.tiktokUrl"
        :to="review.tiktokUrl"
        target="_blank"
        class="flex items-center space-x-2 border rounded-lg py-1 lg:py-2 px-4"
      >
        <Icon name="ic:sharp-tiktok" class="text-2xl text-primary-600" />
        <p class="text-primary-600">Tiktok</p>
      </NuxtLink>
      <NuxtLink
        v-if="review.instagramUrl"
        :to="review.instagramUrl"
        target="_blank"
        class="flex items-center space-x-2 border rounded-lg py-1 lg:py-2 px-4"
      >
        <Icon name="skill-icons:instagram" class="text-2xl text-primary-600" />
        <p class="text-primary-600">Instagram</p>
      </NuxtLink>
    </div>
    <h1 class="text-2xl py-4 font-medium dark:text-white">Sheger Review</h1>

    <!-- -----------------------Review video-------------------- -->
    <Place-And-Review-SummaryVideo
      v-if="review.youtubeVideoUrl"
      :video-url="review.youtubeVideoUrl"
    />

    <!-- ------------------Show reviews Summary--------------- -->
    <div class="py-6 w-full flex flex-col gap-y-6">
      <ReviewsRatingsAndLikesRatingAverage
        class="pr-4"
        :rating="review.place_sheger_review?.rate || 0"
        :show-all-stars="true"
        text-class=" pl-2 text-gray-500 font-medium"
        :rating-size="24"
        :readonly="true"
      ></ReviewsRatingsAndLikesRatingAverage>
    </div>

    <!-- ---------------------------Sheger Review Rating------------ -->

    <div
      v-if="review.place_sheger_review"
      class="flex flex-col gap-y-4 pt-2 pb-6 border-b transition-all duration-300"
    >
      <div
        v-for="serviceReview in review.place_sheger_review
          ?.place_sheger_review_by_services"
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full"
      >
        <!-- -----------_Service name----------- -->
        <div class="flex items-center space-x-4">
          <img
            v-if="serviceReview?.review_category.icon?.lightIconUrl"
            :src="serviceReview?.review_category.icon?.lightIconUrl"
            class="w-8 h-8 object-cover object-center"
            alt=" icon image"
          />
          <p
            class="whitespace-nowrap text-sm text-sheger_dark_gray-100 dark:text-white"
          >
            {{ serviceReview.review_category?.name }}
          </p>
        </div>
        <!-- -----------_Rating----------- -->
        <ReviewsRatingsAndLikesRatingAverage
          class="pr-4"
          :rating="serviceReview.rate || 0"
          :show-all-stars="true"
          text-class=" pl-2 text-gray-500 font-medium"
          :rating-size="24"
        ></ReviewsRatingsAndLikesRatingAverage>
      </div>

      <div>
        <p class="secondary-text !text-lg">Comment</p>
        <p>
          {{ review.place_sheger_review?.comment }}
        </p>
      </div>
    </div>
  </div>
</template>
