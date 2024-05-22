<script setup>
const emit = defineEmits(["showGallery"]);
const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="relative hidden lg:block">
    <!-- -----------------------------Images----------------------- -->
    <PlaceAndReviewMultiImageCarousel
      :images="review.review_medias"
      class="hidden lg:block"
    ></PlaceAndReviewMultiImageCarousel>

    <div
      class="flex flex-col space-y-4 absolute bottom-0 rounded-xl px-4 w-full pl-16 py-6 bg-no-repeat bg-center bg-cover bg-[url('/images/static/full-gradient.png')]"
    >
      <div class="relative">
        <!-- --------------------Name and Icon -->
        <div class="flex absolute -top-[75px] items-end space-x-4">
          <img
            :src="review.place.light_logo?.url"
            alt="place logo"
            class="object-contain p-1 bg-white rounded-full w-24 h-24"
          />
          <div class="flex items-center gap-x-3">
            <p class="text-white text-2xl font-bold">{{ review.place.name }}</p>
            <div class="flex justify-end items-center">
              <PlaceAndReview-LikeAndBookmarkForSmallSize
                type="place"
                :id="review.place.id"
                negative-style="text-white "
                :show-bookmark-count="true"
                bookmarkCountStyle="!text-white"
              >
              </PlaceAndReview-LikeAndBookmarkForSmallSize>
            </div>
          </div>
        </div>
      </div>

      <!---------------------- Rating, Like and Review-------------- -->
      <div class="flex gap-x-2 md:gap-x-4 items-center pt-4">
        <ReviewsRatingsAndLikesRatingAverage
          class="pr-4"
          :rating="review.place?.place_aggregate_summary?.avgRating || 0"
          text-class=" lg:pl-4  lg:text-white"
          :rating-size="24"
          @rating-selected="showAddPlaceReviewModal = true"
        ></ReviewsRatingsAndLikesRatingAverage>

        <ReviewsRatingsAndLikesTotalReviews
          class="px-4 border-l"
          text-class=" lg:text-white "
          :total-reviews="
            review.place?.place_aggregate_summary?.sumReviews || 0
          "
        >
        </ReviewsRatingsAndLikesTotalReviews>

        <ReviewsRatingsAndLikesTotalLikes
          class="px-4 border-l"
          :total-likes="review.place?.place_aggregate_summary?.sumLikes || 0"
          text-class=" lg:text-white "
        ></ReviewsRatingsAndLikesTotalLikes>
      </div>

      <!--................... location and price....................... -->

      <div class="flex items-center gap-x-4">
        <!-- ---------------------location -->

        <div class="flex items-center space-x-2 py-1">
          <Icon
            name="uil:map-pin-alt"
            class="shrink-0 font-medium text-white text-xl"
          />

          <p
            v-if="review.place_location"
            class="whitespace-nowrap text-xl font-medium text-white"
          >
            <span class="decoration-sheger_brown-200 underline leading"
              >{{ review.place_location?.area?.name }},
              {{ review.place_location?.city?.name }}</span
            >
          </p>
        </div>

        <!-- ---------------------price------------------- -->

        <div class="flex items-center space-x-2 text-white">
          <Icon name="heroicons:currency-dollar" class="text-3xl text-white" />
          <p class="text-xl underline">
            {{ review.place?.place_aggregate_summary?.minDishPrice }} -
            {{ review.place?.place_aggregate_summary?.maxDishPrice }} ETB
          </p>
        </div>
      </div>

      <!-- ---------------------Ambiance---------------- -->

      <div
        v-if="review.place?.placeAmbiances?.length > 0"
        class="flex items-center gap-x-4"
      >
        <img
          class="w-8 h-8 object-cover"
          src="/images/static/ambiance.png"
          alt=" ambiance icon"
        />
        <TagsAmbiance
          class=""
          :ambiances="review.place?.placeAmbiances"
        ></TagsAmbiance>
      </div>
    </div>

    <!-- ---------------------------Image gallery show button----------------------- -->
    <button
      @click="emit('showGallery')"
      v-if="review.review_medias?.length > 0"
      class="flex justify-center space-x-2 border py-3 absolute right-20 bottom-10 rounded-md bg-white px-4"
    >
      <Icon
        name="fluent:image-multiple-32-regular"
        size="22"
        color="black"
        class="gray"
      />
      <p class="font-medium block">See all Images</p>
    </button>
  </div>
</template>
