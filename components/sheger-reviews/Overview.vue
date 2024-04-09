<script setup>
import getReviewMediasQuery from "@/graphql/query/medias/reviewMedias.gql";
import addReviewMediaMutation from "@/graphql/mutations/medias/addReviewMedia.gql";

import useNotify from "@/use/notify";

/**-------------------------Globals------------------------- */
const { notify } = useNotify();

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});

/*...................Place medias data fetch.............*/
const mediasFilter = ref({
  reviewId: {
    _eq: props.review.id,
  },
});
const mediasLimit = ref(100);
const mediasOffset = ref(0);
const mediasSort = ref([{}]);
const medias = ref([]);
const {
  onResult: mediasOnResult,
  onError: mediasOnError,
  loading: mediasLoading,
  refetch: mediasRefetch,
} = authListQuery(
  getReviewMediasQuery,
  mediasFilter,
  mediasSort,
  mediasOffset,
  mediasLimit
);

mediasOnResult((result) => {
  if (result.data?.reviewMedias) {
    medias.value = result.data?.reviewMedias;
  }
});
mediasOnError((error) => {});

/*-------------------------Add Review Media ------------------------------*/
const selectedGalleryImages = ref([]);

const {
  mutate: addReviewMedia,
  onError: addReviewMediaError,
  onDone: addReviewMediaDone,
  loading: addReviewMediaLoading,
} = authMutation(addReviewMediaMutation);

const addReviewMediaHandler = () => {
  const reviewMedia = selectedGalleryImages.value.map((imageUrl) => {
    return {
      media: {
        data: {
          url: imageUrl,
        },
      },
      reviewId: props.review.id,
    };
  });

  addReviewMedia({
    reviewMediaInput: reviewMedia,
  });
};

addReviewMediaDone(() => {
  notify({
    title: "Image added successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  openUploadFilesModal.value = false;
  mediasRefetch();
  selectedGalleryImages.value = [];
});

addReviewMediaError((error) => {
  notify({
    title: "Something went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const openUploadFilesModal = ref(false);
</script>

<template>
  <HFileUploadModal
    @uploadDone="addReviewMediaHandler"
    v-model:openModal="openUploadFilesModal"
    v-model="selectedGalleryImages"
    :fileLimit="10"
  />
  <div class="grid grid-cols-4">
    <!-- ----------------------Left side--------------------- -->
    <div class="flex flex-col col-span-3 pt-2 space-y-6">
      <UiTagsPlaceReviewDishTags :tags="review.review_tags" />
      <!-- ---------------------Review description----------------- -->
      <p class="max-w-2xl secondary-text">{{ review.description }}</p>

      <!-- --------------------Review sides---------------------- -->
      <div v-if="review.sides">
        <p class="py-2 text-2xl font-medium dark:text-white">Sides</p>
        <p class="dark:text-sheger_light_gray-400">
          {{ review.sides }}
        </p>
      </div>

      <!-- -------------------------Review Drink------------------- -->
      <div v-if="review.review_drink" class="w-full">
        <p class="my-4 text-2xl font-medium dark:text-white">Goes well with</p>
        <div class="flex items-center space-x-4 xl:space-x-6">
          <img
            class="object-cover w-72"
            src="/images/temporary/default-drink-image.png"
            alt="Negus drink"
          />
          <div class="flex flex-col iphone5:space-y-2 xl:space-y-4">
            <h3 class="text-4xl font-medium dark:text-white">
              {{ review.review_drink?.drink?.title }}
            </h3>
            <p class="dark:text-sheger_light_gray-400">
              {{ review.review_drink?.drink?.description }}
            </p>
            <p class="dark:text-sheger_light_gray-400">
              ETB {{ review.review_drink?.drink?.price }}
            </p>
          </div>
        </div>
      </div>

      <!-- ------------------------Review menus-------------------- -->
      <div class="flex flex-col gap-4 py-4">
        <UiCardsMenu
          v-for="menuReview in review.menu_reviews"
          :key="menuReview.id"
          :menu="menuReview.menu"
        ></UiCardsMenu>
      </div>
    </div>

    <!-- ----------------------Right side--------------------- -->

    <div class="col-span-1 pl-8 border-l">
      <!-- ------------------Sheger video------------------ -->

      <ShegerReviewsReviewVideo
        v-if="review.youtubeVideoUrl"
        :video-url="review.youtubeVideoUrl"
      />
      <!-- --------------Gallery and upload image---------------- -->
      <div>
        <div class="flex items-center justify-between py-6">
          <p class="text-xl">
            Gallery
            <span class="text-sheger-gray-100"
              >({{ medias?.length }} Pictures)</span
            >
          </p>
          <button
            @click="openUploadFilesModal = true"
            class="px-4 py-2 rounded-md secondary-border"
          >
            Upload
          </button>
        </div>

        <div
          class="flex flex-col max-h-screen space-y-3 overflow-scroll scroll"
        >
          <div v-for="reviewMedia in medias" :key="reviewMedia.id">
            <Places-Gallery
              v-if="reviewMedia?.isImage"
              :media="reviewMedia"
              type="review"
              @on-deleted="mediasRefetch()"
            >
            </Places-Gallery>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
