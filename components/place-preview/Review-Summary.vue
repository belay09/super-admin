<script setup>
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});

/**---------------------Place Video--------------------- */
const placeVideo = computed(() => {
  if (props.place?.youtubeVideoUrl) {
    return props.place?.youtubeVideoUrl;
  } else {
    return props.place?.placeMedias?.find((placeMedia) => !placeMedia.isImage)
      ?.media?.url;
  }
});

const showAddReviewModal = ref(false);
const showServiceReview = ref(false);
</script>
<template>
  <!-- ------------------Add review modal---------------- -->

  <ModalsModal :auto-close="true" v-model="showAddReviewModal">
    <template #content>
      <Place-AddPlaceReview
        @close="showAddReviewModal = false"
        :place="place"
      ></Place-AddPlaceReview>
    </template>
  </ModalsModal>

  <div
    class="w-full xl:border-l xl:pl-10 2xl:pl-12 xl:overflow-y-scroll xl:my-8 scroll z-10 duration-500 dark:border-darkBorder"
    :class="`xl:max-h-[160vh] flex flex-col gap-y-6`"
  >
    <h1 class="text-2xl font-medium dark:text-white">Place Summary</h1>

    <!-- -----------------------Place tags------------------ -->

    <TagsPlaceReviewDishTags
      itemClass="!bg-primary-100 "
      :tags="place.placeTags"
    ></TagsPlaceReviewDishTags>

    <!-- -----------------------Review video-------------------- -->
    <Place-And-Review-SummaryVideo v-if="placeVideo" :video-url="placeVideo" />

    <!-- ------------------Show reviews aggregate and post review button---------------- -->
    <PlaceAggregateAndPostReviewButton
      :place="place"
      :total-reviews="place.placeReviewsAggregate?.aggregate?.count || 0"
      :rating="place.place_aggregate_summary?.avgRating || 0"
      @post-review="showAddReviewModal = true"
    ></PlaceAggregateAndPostReviewButton>

    <!-- -----------------------Review by service---------------------- -->
    <div class="max-h-[30rem] overflow-y-scroll scroll">
      <p class="dark:text-white">Public Review</p>
      <div
        v-if="place.review_average_rating_by_category"
        class="flex flex-col gap-y-4 pt-2 pb-6 border-b transition-all duration-300"
      >
        <div
          v-for="service in place.review_average_rating_by_category"
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full"
        >
          <!-- -----------_Service name----------- -->
          <div class="flex items-center space-x-4">
            <img
              v-if="service?.icon"
              :src="service?.icon"
              class="w-8 h-8 object-cover object-center"
              alt=" icon image"
            />
            <p
              class="whitespace-nowrap text-sm text-sheger_dark_gray-100 dark:text-white"
            >
              {{ service.category_name }}
            </p>
          </div>
          <!-- -----------_Rating----------- -->

          <ReviewsRatingsAndLikesRatingAverage
            class="pr-4"
            :rating="service.average_rating || 0"
            :show-all-stars="true"
            text-class=" pl-2 text-gray-500 font-medium"
            :rating-size="24"
          ></ReviewsRatingsAndLikesRatingAverage>
        </div>
      </div>
    </div>
  </div>
</template>
