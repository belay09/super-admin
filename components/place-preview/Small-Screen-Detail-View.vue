<script setup>
/**----------------------Imports------------------------ */
import useNotify from "@/use/notify";
import { useAuthStore } from "@/stores/auth";

const { notify } = useNotify();
/*--------------------------Globals----------------------- */
const router = useRouter();
const route = useRoute();
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});

/*--------------------------Main location---------------------------*/
const mainLocation = computed(() => {
  return (
    props.place.placeLocations.find(
      (placeLocation) => placeLocation.isMainLocation
    ) || props.place?.placeLocations[0]
  );
});

/**---------------------Featured Image---------------------- */
const featuredImage = computed(() => {
  if (props.place && props.place.featured_medias) {
    return props.place.featured_medias?.url;
  } else if (props.place && props.place.placeMedias) {
    return props.place.placeMedias[0].url;
  }
  return "";
});

/**--------------------Story view--------------------- */

const goToStoryView = () => {
  router.push(`/places/story-view/${route.params.id}`);
};

/*............Modal............*/
const showSmallScreenDetail = ref(false);

/*....................Window resize.............*/
const windowSize = ref(null);
onMounted(() => {
  windowSize.value = window.innerWidth;
  window.onresize = () => {
    windowSize.value = window.innerWidth;
  };
});
</script>

<template>
  <div class="p-4 samsg:px-5 md:px-8">
    <div class="relative lg:hidden" @click="showSmallScreenDetail = true">
      <img
        v-if="featuredImage && featuredImage !== ''"
        :draggable="false"
        class="w-full h-72 object-cover object-center"
        :src="featuredImage"
        alt="place image"
        loading="lazy"
      />
      <img
        v-else
        :draggable="false"
        class="w-full h-72 object-cover object-center"
        src="/images/temporary/default-place.png"
        alt="place image"
        loading="lazy"
      />
      <button
        @click="router.back()"
        class="absolute bg-gray-900 bg-opacity-40 top-5 left-4 w-7 h-7 flex flex-col justify-center items-center rounded-full"
      >
        <Icon
          name="heroicons:chevron-left-20-solid"
          class="text-white hidden md:block text-lg"
        />
      </button>
      <button @click="goToStoryView" class="absolute bottom-5 right-4 w-7 h-7">
        <Icon name="uil:focus" class="text-white hidden md:block text-lg" />
      </button>
    </div>

    <div class="flex flex-col space-y-4 lg:hidden pt-6">
      <div class="flex justify-between">
        <p class="text-2xl font-medium dark:text-white">{{ place.name }}</p>

        <div class="flex items-center space-x-2">
          <PlaceAndReview-LikeAndBookmarkForSmallSize
            type="place"
            :id="place.id"
            :bookmarked="place?.is_place_book_marked || false"
            :liked="place?.is_place_liked || false"
          >
          </PlaceAndReview-LikeAndBookmarkForSmallSize>
          <PlaceAndReview-ShareForSmallScreen :name="place.name" type="place" />
        </div>
      </div>

      <div class="flex items-center">
        <ReviewsRatingsAndLikesRatingAverage
          class="pr-4"
          :rating="place.place_aggregate_summary?.avgRating || 0"
          text-class=" "
          :show-all-stars="windowSize > 768 ? true : false"
        ></ReviewsRatingsAndLikesRatingAverage>

        <ReviewsRatingsAndLikesTotalReviews
          class="px-4 border-l border-gray-500"
          text-class="iphone5:secondary-text"
          :total-reviews="place.placeReviewsAggregate?.aggregate?.count || 0"
        >
        </ReviewsRatingsAndLikesTotalReviews>

        <ReviewsRatingsAndLikesTotalLikes
          class="px-4 border-l border-gray-500"
          :total-likes="place.place_aggregate_summary?.sumLikes || 0"
          text-class=" "
        ></ReviewsRatingsAndLikesTotalLikes>
      </div>
      <div class="flex items-center space-x-2 py-1">
        <Icon
          name="uil:map-pin-alt"
          class="text-sheger_brown-200 shrink-0 font-medium text-lg dark:text-sheger_light_gray-400"
        />

        <p
          class="whitespace-nowrap text-sm md:text-lg font-medium text-sheger_brown-200 dark:text-sheger_light_gray-400"
        >
          <span
            v-if="mainLocation"
            class="decoration-sheger_brown-200 underline leading"
            >{{ mainLocation.area?.name }}, {{ mainLocation.city?.name }}</span
          >

          <span> -{{ place.placeLocations?.length }} Braches</span>
        </p>
      </div>
      <div
        class="flex items-center space-x-2 text-sheger_brown-200 dark:text-white"
      >
        <Icon
          name="heroicons:currency-dollar"
          class="text-sheger_brown-200 md:text-lg dark:text-white"
        />
        <p>
          {{ place.place_aggregate_summary?.minDishPrice }} -
          {{ place.place_aggregate_summary?.maxDishPrice }} ETB
        </p>
      </div>
    </div>
  </div>
</template>
