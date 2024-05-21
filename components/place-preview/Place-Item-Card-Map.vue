<script setup>
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },

  index: {
    type: Number,
    required: true,
  },

  isSelected: {
    type: Boolean,
    default: false,
  },
});

/**-------------------------------Is Liked and Bookmarked--------- */
const isLiked = ref(props.place?.is_place_liked || false);
const isBookmarked = ref(props.place?.is_place_book_marked || false);
const itemBookmarkCount = ref(7);
const itemLikeCount = ref(props.place.place_aggregate_summary?.sumLikes || 0);

watchEffect(() => {
  isBookmarked.value = props.place.is_place_book_marked;
  isLiked.value = props.place.is_place_liked;
  itemLikeCount.value = props.place.place_aggregate_summary?.sumLikes || 0;
  itemBookmarkCount.value = 4;
});
provide("isLiked", isLiked);
provide("isBookmarked", isBookmarked);
provide("itemBookmarkCount", itemBookmarkCount);
provide("itemLikeCount", itemLikeCount);

const openMap = inject("openMap");
const imagesToShow = ref([]);
function filterImage() {
  let tempImages = props.place.placeMedias.filter(
    (placeMedia) => placeMedia.isImage == true
  );
  imagesToShow.value = tempImages.slice(0, 1);
}
filterImage();
const featuredMedia = computed(() => {
  return props.place.featured_medias?.url || imagesToShow.value[0]?.media.url;
});

/*-----------------------------Detail link------------------------- */
const detailLink = computed(() => {
  return "/" + props.place?.type?.toLowerCase() + "/" + props.place.id;
});

const showAddReviewModal = ref(false);
const openAddReviewModal = () => {
  // showAddReviewModal.value = true;
};

/*-------------------Main location-----------------*/

const mainLocation = computed(() => {
  return (
    props.place.placeLocations.find(
      (placeLocation) => placeLocation.isMainLocation
    ) || props.place.placeLocations[0]
  );
});
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
    :id="`place-${index}`"
    @click="openMap(index)"
    :class="isSelected ? ' border-primary-600 ' : '  border-transparent'"
    class="relative border-4 rounded-lg block w-full min-w-[20rem] sm:min-w-[25rem] max-w-[30rem] min-h-[20rem] hover:cursor-pointer transition-all"
  >
    <div class="relative w-full">
      <div class="w-full mx-auto">
        <div class="z-10">
          <NuxtImg
            :src="featuredMedia || '/images/static/placeholder1.jpeg'"
            class="w-full max-w-[30rem] h-[20rem] rounded-lg object-cover object-center"
            :alt="place.name + ' image'"
            loading="lazy"
          />
        </div>
      </div>
      <div
        class="absolute bottom-0 z-30 pb-4 rounded-lg px-4 w-full flex flex-col bg-no-repeat bg-center bg-cover space-y-2 bg-[url('/images/static/card-shadow.png')]"
      >
        <div class="relative">
          <!-- --------------------Name and Icon -->
          <div class="flex absolute -top-[20px] items-end space-x-4">
            <img
              :src="place.light_logo?.url"
              alt="place logo"
              class="object-contain p-1 bg-white rounded-full w-10 h-10"
            />
            <p class="text-white text-2xl font-bold">{{ place.name }}</p>
          </div>
        </div>

        <div class="flex justify-end items-center">
          <PlaceAndReview-LikeAndBookmarkForSmallSize
            type="place"
            :id="place.id"
            :bookmarked="isBookmarked"
            :liked="isLiked"
            negative-style="text-white "
            :show-bookmark-count="true"
            bookmarkCountStyle="!text-white"
          >
          </PlaceAndReview-LikeAndBookmarkForSmallSize>
        </div>

        <div class="flex items-center space-x-1">
          <ReviewsRatingsAndLikesRatingAverage
            class="pr-4"
            :rating="place.place_aggregate_summary?.avgRating || 0"
            text-class=" iphone5:text-white"
            :show-all-stars="true"
            @rating-selected="openAddReviewModal"
          ></ReviewsRatingsAndLikesRatingAverage>

          <ReviewsRatingsAndLikesTotalLikes
            class="px-4 border-l"
            text-class=" iphone5:text-white"
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

            <p class="whitespace-nowrap font-medium text-white">
              <span
                v-if="mainLocation"
                class="decoration-sheger_brown-200 leading"
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
          <TagsAmbiance
            item-class="!py-1.5"
            :ambiances="place.placeAmbiances"
          ></TagsAmbiance>
        </div>
      </div>
    </div>
  </div>
</template>
