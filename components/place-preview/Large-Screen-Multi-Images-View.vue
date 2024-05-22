<script setup>
const emit = defineEmits(["showGalleryModal"]);
const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  place: {
    type: Object,
    required: true,
  },
});

/*-------------------Main location-----------------*/

const mainLocation = computed(() => {
  return (
    props.place.placeLocations.find(
      (placeLocation) => placeLocation.isMainLocation
    ) || props.place.placeLocations[0]
  );
});
const openGalleryModal = (currentImageToShow) => {
  emit("showGalleryModal", currentImageToShow);
};

const imagesToShow = ref(props.images.slice(0, 8));

const showAddReviewModal = ref(false);
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
    class="px-4 samsg:px-5 md:px-8 xl:px-12 2xl:px-[100px] hidden lg:block relative"
  >
    <div class="relative rounded-lg overflow-hidden">
      <PlaceAndReviewMultiImageCarousel
        :images="imagesToShow"
        class="hidden lg:block"
      ></PlaceAndReviewMultiImageCarousel>
      <div
        class="flex flex-col space-y-2 absolute bottom-0 rounded-xl px-4 w-full pl-16 pb-6 pt-6 bg-no-repeat bg-center bg-cover bg-[url('/images/static/full-gradient.png')]"
      >
        <div class="relative">
          <!-- --------------------Name and Icon -->
          <div class="flex absolute -top-[75px] items-end space-x-4">
            <img
              :src="place.light_logo?.url"
              alt="place logo"
              class="object-contain p-1 bg-white rounded-full w-24 h-24"
            />
            <div class="flex items-center gap-x-3">
              <p class="text-white text-2xl font-bold">{{ place.name }}</p>
              <div class="flex justify-end items-center">
                <PlaceAndReview-LikeAndBookmarkForSmallSize
                  type="place"
                  :id="place.id"
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
        <div class="flex gap-x-2 md:gap-x-4 pt-6 items-center">
          <ReviewsRatingsAndLikesRatingAverage
            class="pr-4"
            :rating="place.place_aggregate_summary?.avgRating || 0"
            text-class=" lg:pl-4  lg:text-white"
            :rating-size="24"
            @rating-selected="showAddReviewModal = true"
          ></ReviewsRatingsAndLikesRatingAverage>

          <ReviewsRatingsAndLikesTotalReviews
            class="px-4 border-l"
            text-class=" lg:text-white "
            :total-reviews="place.place_aggregate_summary?.sumReviews || 0"
          >
          </ReviewsRatingsAndLikesTotalReviews>

          <ReviewsRatingsAndLikesTotalLikes
            class="px-4 border-l"
            text-class=" lg:text-white "
          ></ReviewsRatingsAndLikesTotalLikes>
        </div>

        <!--................... location and price....................... -->

        <div class="flex items-center gap-x-4">
          <!-- ---------------------location----------- -->
          <div class="flex items-center space-x-2 py-1">
            <Icon
              name="uil:map-pin-alt"
              class="shrink-0 font-medium text-white text-xl"
            />

            <p class="whitespace-nowrap text-xl font-medium text-white">
              <span
                v-if="mainLocation"
                class="decoration-sheger_brown-200 underline leading"
                >{{ mainLocation.area?.name }},
                {{ mainLocation.city?.name }}</span
              >
            </p>
          </div>

          <!-- ---------------------price------------------- -->

          <div class="flex items-center space-x-2 text-white">
            <Icon
              name="heroicons:currency-dollar"
              class="text-3xl text-white"
            />
            <p class="text-xl underline">
              {{ place.place_aggregate_summary?.minDishPrice }} -
              {{ place.place_aggregate_summary?.maxDishPrice }} ETB
            </p>
          </div>
        </div>

        <!-- ---------------------Ambiance---------------- -->

        <div
          v-if="place?.placeAmbiances?.length > 0"
          class="flex items-center gap-x-4"
        >
          <img
            class="w-8 h-8 object-cover"
            src="/images/static/ambiance.png"
            alt=" ambiance icon"
          />
          <PlaceAndReviewAmbiance
            class=""
            :ambiances="place.placeAmbiances"
          ></PlaceAndReviewAmbiance>
        </div>
      </div>
    </div>

    <div
      @click="emit('showGalleryModal')"
      class="flex justify-center space-x-2 border py-3 absolute right-32 bottom-10 cursor-pointer rounded-md bg-white px-4"
    >
      <Icon
        name="fluent:image-multiple-32-regular"
        size="22"
        color="black"
        class="gray"
      />
      <p class="font-medium">See all Images</p>
    </div>
  </div>
</template>
