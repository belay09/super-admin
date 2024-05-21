<script setup>
import { Carousel, Slide } from "vue3-carousel";
import useNotify from "@/use/notify";

const props = defineProps({
  type: {
    type: String,
    required: true,
    default: "hotels",
  },
  place: {
    type: Object,
    required: true,
  },
  imageLengthToShow: {
    type: Number,
    default: 6,
  },
  showCarsoul: {
    type: Boolean,
    default: true,
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

/**---------------------Image Filter-------------------- */

const imagesToShow = ref([]);

function filterImage() {
  let tempImages = props.place.placeMedias.filter(
    (placeMedia) => placeMedia.isImage == true
  );
  imagesToShow.value = tempImages.slice(0, props.imageLengthToShow);
}
filterImage();

const featuredMedia = computed(() => {
  return props.place.featured_medias?.url || imagesToShow.value[0]?.media.url;
});

/**---------------------Add featured media to imageToShow-------------- */

if (props.place.featured_medias) {
  imagesToShow.value.unshift({
    media: { url: props.place.featured_medias.url },
  });
}

/*-----------------------------Detail link------------------------- */
const detailLink = computed(() => {
  return "/" + props.place?.type?.toLowerCase() + "/" + props.place.id;
});

/*-----------------------------Carsoul------------------------- */
const currentSlide = ref(0);

let timer = null;
const hovered = ref(false);

/**
 * Starts a timer that increments the current slide value every 1.5 seconds.
 *
 * @return {undefined} There is no return value.
 */
const startTimer = () => {
  hovered.value = true;
  timer = setInterval(() => {
    if (currentSlide.value == imagesToShow.value.length - 1) {
      cancelTimer();
    }
    currentSlide.value++;
  }, 1500);
};
/**
 * Cancels the timer and sets the hovered value to false.
 *
 * @param {none} - No parameters.
 * @return {none} - No return value.
 */
const cancelTimer = () => {
  clearInterval(timer);
  hovered.value = false;
};

/*....................Window resize.............*/
const windowSize = ref(null);
onMounted(() => {
  windowSize.value = window.innerWidth;
  window.onresize = () => {
    windowSize.value = window.innerWidth;
  };
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
  <NuxtLink
    :to="detailLink"
    class="relative block w-full min-w-[20rem] sm:min-w-[25rem] max-w-[30rem] iphone5:h-[24rem] lg:h-[30rem]"
  >
    <div
      class="relative w-full"
      @mouseenter="startTimer"
      @mouseleave="cancelTimer"
    >
      <p
        v-show="hovered && imagesToShow.length > 1"
        class="absolute right-6 top-6 px-2 border rounded-full bg-black z-40 text-white bg-opacity-70"
      >
        {{ currentSlide + 1 }} / {{ imagesToShow.length }} pictures
      </p>
      <div class="w-full mx-auto">
        <div class="z-10">
          <NuxtImg
            v-if="!showCarsoul"
            :src="featuredMedia || '/images/static/placeholder1.jpeg'"
            class="w-full max-w-[30rem] iphone5:h-[24rem] lg:h-[30rem] rounded-lg object-cover object-center"
            :alt="place.name + ' image'"
            loading="lazy"
          />
          <Carousel
            v-else
            :settings="{
              snapAlign: 'center',
              itemsToShow: 1,
            }"
            v-model="currentSlide"
          >
            <Slide
              v-for="(placeMedia, index) in imagesToShow"
              :key="index"
              class="w-full"
            >
              <NuxtImg
                :src="placeMedia?.media.url"
                class="w-full max-w-[30rem] iphone5:h-[24rem] lg:h-[30rem] rounded-lg object-cover object-center"
                :alt="place.name + ' image'"
                loading="lazy"
              />
            </Slide>
          </Carousel>
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
            :show-all-stars="windowSize >= 768"
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
            class=""
            :ambiances="place.placeAmbiances"
          ></TagsAmbiance>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
