<script setup>
import { Carousel, Slide } from "vue3-carousel";
import useNotify from "@/use/notify";
import { useAuthStore } from "@/stores/auth";

const { notify } = useNotify();
const router = useRouter();
const authStore = useAuthStore();
const emit = defineEmits(["like", "bookmark", "share"]);

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
  imageLengthToShow: {
    type: Number,
    default: 5,
  },
});

/**------------------------Is Liked and Bookmarked--------- */

const isLiked = ref(props.review?.is_review_liked || false);
const isBookmarked = ref(props.review?.is_review_book_marked || false);
const itemBookmarkCount = ref(props.review.reviewAggregate?.aggregate?.count);
const itemLikeCount = ref(props.review.review_aggregate_summary?.sumLikes || 0);

watchEffect(() => {
  isLiked.value = props.review?.is_review_liked || false;
  isBookmarked.value = props.review?.is_review_book_marked || false;
  itemBookmarkCount.value = props.review.reviewAggregate?.aggregate?.count;
  itemLikeCount.value = props.review.review_aggregate_summary?.sumLikes || 0;
});

provide("isLiked", isLiked);
provide("isBookmarked", isBookmarked);
provide("itemBookmarkCount", itemBookmarkCount);
provide("itemLikeCount", itemLikeCount);

/*---------------------Images to show---------------------- */

const imagesToShow = ref([]);

function filterImage() {
  let tempImages = props.review.review_medias.filter(
    (reviewMedia) => reviewMedia.isImage == true
  );
  imagesToShow.value = tempImages.slice(0, props.imageLengthToShow);
}
filterImage();

if (props.review.featured_image?.url) {
  imagesToShow.value.unshift({
    isImage: true,
    media: {
      url: props.review.featured_image?.url,
    },
  });
}

/*---------------------Carousel---------------------- */
const currentSlide = ref(0);

/*---------------------Scrolling---------------------- */
let timer = null;
const hovered = ref(false);

const startTimer = () => {
  hovered.value = true;
  timer = setInterval(() => {
    // Code to execute periodically
    if (currentSlide.value < imagesToShow.value.length - 1) {
      currentSlide.value++;
    }
  }, 1500);
};

const cancelTimer = () => {
  clearInterval(timer);
  hovered.value = false;
};
</script>

<template>
  <NuxtLink
    @mouseenter="startTimer"
    @mouseleave="cancelTimer"
    :to="`/reviews/${review.id}`"
    class="relative rounded-lg border block w-full min-w-[20rem] lg:min-w-[25rem] max-w-[28rem] mx-auto dark:border-none dark:bg-sheger_brown-100 hover:border-primary-600"
  >
    <p
      v-show="hovered && imagesToShow.length > 1"
      class="absolute right-6 top-6 px-2 border rounded-full bg-black z-40 text-white bg-opacity-50"
    >
      {{ currentSlide + 1 }} / {{ imagesToShow.length }}
    </p>
    <div class="w-full mx-auto">
      <div class="z-10">
        <Carousel
          :settings="{
            snapAlign: 'center',
            itemsToShow: 1,
          }"
          v-model="currentSlide"
        >
          <Slide v-if="imagesToShow?.length === 0">
            <div class="h-48 w-full bg-sheger_brown-200 rounded-t-lg"></div>
          </Slide>
          <Slide
            v-for="image in imagesToShow"
            :key="image?.media?.url"
            class=""
          >
            <img
              v-if="image.isImage"
              :src="image?.media?.url"
              class="w-full h-48 object-cover object-center rounded-t-lg"
              alt="place image"
              loading="lazy"
            />
          </Slide>
        </Carousel>
      </div>
    </div>
    <div class="flex flex-col space-y-4 p-5">
      <div class="flex justify-between items-center">
        <p class="text-2xl font-medium dark:text-white">
          {{ review.title }} {{ isLiked }} {{ review?.is_review_liked }}
        </p>

        <PlaceAndReview-LikeAndBookmarkForSmallSize
          type="review"
          :id="review.id"
          :show-bookmark-count="true"
          bookmark-count-style=" !dark:text-white"
        >
        </PlaceAndReview-LikeAndBookmarkForSmallSize>
      </div>

      <TagsPlaceReviewDishTags
        :tags="review.review_tags"
        item-class="dark:iphone5:bg-sheger_brown-200"
      ></TagsPlaceReviewDishTags>

      <div class="flex items-center space-x-1">
        <ReviewsRatingsAndLikesRatingAverage
          class="pr-4"
          :rating="review.place_sheger_review?.rate || 0"
          text-class=""
          :show-all-stars="true"
          :readonly="true"
        ></ReviewsRatingsAndLikesRatingAverage>

        <ReviewsRatingsAndLikesTotalLikes
          class="px-4 border-l border-gray-500"
        ></ReviewsRatingsAndLikesTotalLikes>
      </div>
      <div class="flex items-center space-x-4">
        <img
          class="w-12 h-12 object-contain object-center"
          :src="review?.place?.light_logo?.url"
          alt="place logo"
        />
        <p class="md:text-xl dark:text-white">{{ review.place?.name }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.tag-scroll::-webkit-scrollbar {
  display: none;
}
</style>
