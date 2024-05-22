<script setup>
/*----------------------------Imports---------------------------*/
import getReviewQuery from "@/graphql/query/reviews/item.gql";
import getReviewsQuery from "@/graphql/query/reviews/list.gql";

import useNotify from "@/use/notify";

/*----------------------------Global Variables---------------------------*/
const emits = defineEmits(["update:modelValue", "confirm"]);

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
const route = useRoute();
const router = useRouter();

const isBookmarked = ref(false);
const isLiked = ref(false);

const { notify } = useNotify();

/*...................Review detail data fetch.............*/

const review = ref(null);
const imagesToShow = ref([]);

const placeMainLocation = ref(null);

const {
  onResult: reviewOnResult,
  onError: reviewOnError,
  loading: reviewLoading,
} = authItemQuery(getReviewQuery, route.params.id);

reviewOnResult((result) => {
  if (result.data?.reviewsByPk) {
    review.value = result.data.reviewsByPk;
    imagesToShow.value = result.data.reviewsByPk.review_medias.slice(0, 8);

    // place main location

    placeMainLocation.value =
      result.data?.reviewsByPk.place?.placeLocations.find(
        (placeLocation) => placeLocation.isMainLocation
      ) || review.value?.place.placeLocations[0];
  }
});

reviewOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**-----------------Similar Reviews data fetch-------------------- */
const similarReviews = ref([]);
const limit = ref(6);
const offset = ref(0);

const filter = computed(() => {
  const query = {};
  query._and = [];
  // query._and.push({
  //   id: {
  //     _neq: props.review.id,
  //   },
  // });
  // query._and.push({
  //   status: {
  //     _eq: "PUBLISHED",
  //   },
  // });

  // query._and.push({
  //   review_tags: {
  //     tagId: {
  //       _in: props.review?.review_tags.map((tag) => tag.tag.id) || [],
  //     },
  //   },
  // });
  return query;
});
const sort = ref([
  { review_aggregate_summary: { avgRating: "DESC_NULLS_LAST" } },
]);

const { onResult, onError, loading, fetchMore } = authListQuery(
  getReviewsQuery,
  filter,
  sort,
  offset,
  limit
);

onResult((result) => {
  if (result.data?.reviews) {
    similarReviews.value = result.data?.reviews;
  }
});

/*---------------------------------Image gallery------------------------*/
const showGalleryModal = ref(false);
const galleryModalCurrentImage = ref("");
const openGalleryModal = (currentImageToShow) => {
  galleryModalCurrentImage.value = currentImageToShow;
  showGalleryModal.value = true;
};

const open = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});
</script>

<template>
  <ModalsModal body-class="h-screen w-screen !p-2 " v-model="open">
    <template #content>
      <div
        class="w-full h-[900px] overflow-y-auto relative first-letter:bg-white"
      >
        <!-- --------------------------------------Cancel and confirm-------------------------------- -->
        <div
          class="flex items-center justify-between my-2 xl:px-12 2xl:px-[100px]"
        >
          <button
            class="primary-button border flex items-center gap-4"
            @click="open = false"
          >
            <Icon name="uil:arrow-left" class="w-6 h-6" />
            Back
          </button>

          <button
            class="primary-button border flex items-center gap-4 text-white bg-primary-600"
            @click="emits('confirm')"
          >
            Confirm
          </button>
        </div>

        <div
          v-if="review && !reviewLoading"
          class="py-16 px-4 samsg:px-5 md:px-8 xl:px-12 2xl:px-[100px]"
        >
          <div class="">
            <ReviewPreviewLargeScreenReviewPlace
              @showGallery="showGalleryModal = true"
              :review="review"
            ></ReviewPreviewLargeScreenReviewPlace>
          </div>

          <div
            class="pt-6 flex iphone5:flex-col lg:flex-row justify-between w-full"
          >
            <!-- --------------------------About review ----------------------- -->
            <div class="flex flex-col space-y-6 lg:w-2/3">
              <div class="flex justify-between space-x-4">
                <p class="text-3xl font-medium dark:text-white">
                  {{ review.title }}
                </p>

                <div class="flex items-center space-x-2">
                  <PlaceAndReview-LikeAndBookmarkForSmallSize
                    class="lg:hidden"
                    type="review"
                    :id="review.id"
                    :name="review?.title || ''"
                  >
                  </PlaceAndReview-LikeAndBookmarkForSmallSize>
                </div>
              </div>

              <!-- ----------------Review place ------------------------ -->
              <div class="flex items-center space-x-4 lg:hidden">
                <div class="flex items-center space-x-4">
                  <img
                    class="w-12 h-12 object-contain"
                    :src="review.place.light_logo?.url"
                    :alt="review.place?.name"
                  />
                  <p class="text-2xl font-medium dark:text-white">
                    {{ review.place?.name }}
                  </p>
                </div>

                <!-- -----------------------Recommended tag if place is recommended ------------------ -->
                <p
                  v-if="review.place?.shegerRecommendationId"
                  class="hidden lg:block px-6 rounded-full border dark:text-white"
                >
                  Recommended
                </p>
              </div>

              <!-- ---------------------------Rating and reviews------------------------ -->

              <div class="flex items-center space-x-1">
                <ReviewsRatingsAndLikesRatingAverage
                  class="pr-4"
                  :rating="review.place_sheger_review?.rate || 0"
                  text-class=""
                  :show-all-stars="true"
                  @rating-selected="showAddReviewReviewModal = true"
                ></ReviewsRatingsAndLikesRatingAverage>

                <ReviewsRatingsAndLikesTotalLikes
                  class="px-4 border-l border-gray-500"
                  :total-likes="review.review_aggregate_summary?.sumLikes || 0"
                  text-class=""
                ></ReviewsRatingsAndLikesTotalLikes>
              </div>

              <!-- ---------------------------Review tags------------------------ -->

              <ReviewsTags :review-tags="review.review_tags"></ReviewsTags>

              <!-- -------------------------Tabs when small screen----------------------- -->

              <!-- ---------------------------Reviews overview when large screen-------------------------- -->
              <ReviewPreviewOverview
                :review="review"
                class="hidden lg:block"
              ></ReviewPreviewOverview>
            </div>

            <!-- ---------------------------Likes and bookmark with Sheger review when large screen-------------------------- -->
            <div class="hidden lg:flex flex-col w-[34.5%]">
              <PlaceAndReview-LikeBookmarkShareButtons
                :id="route.params.id"
                type="review"
                :bookmarked="isBookmarked"
                :liked="isLiked"
                :total-likes="review?.review_aggregate_summary?.sumLikes || 0"
                :name="review?.title || ''"
              ></PlaceAndReview-LikeBookmarkShareButtons>

              <ReviewPreview-ReviewSummary
                :review="review"
              ></ReviewPreview-ReviewSummary>
            </div>
          </div>

          <!-- ---------------------Similar Reviews----------------- -->

          <div v-if="similarReviews?.length > 0">
            <p class="font-medium text-xl dark:text-white">
              <Icon name="uil:star" class="text-inherit text-2xl" /> Similar
              Reviews
            </p>
            <div class="w-full overflow-x-scroll scroll my-6">
              <div class="flex space-x-4 lg:space-x-6 w-full">
                <PlacePreviewReviewItemCard
                  class="dark:bg-sheger_brown-100"
                  v-for="review in similarReviews"
                  :key="review.id"
                  :review="review"
                ></PlacePreviewReviewItemCard>
              </div>
            </div>
          </div>

          <PlaceAndReview-Gallery
            :images="
              review.review_medias?.filter((reviewMedia) => reviewMedia.isImage)
            "
            :current-image-to-show="galleryModalCurrentImage"
            v-model="showGalleryModal"
            v-if="showGalleryModal"
          ></PlaceAndReview-Gallery>
        </div>
        <div class="w-full h-screen" v-else>
          <HLoading></HLoading>
        </div>
      </div>
    </template>
  </ModalsModal>
</template>
