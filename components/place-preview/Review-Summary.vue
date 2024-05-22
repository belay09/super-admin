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
  </div>
</template>
