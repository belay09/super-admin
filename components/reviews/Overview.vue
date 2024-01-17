<script setup>
import getReviewMediasQuery from "@/graphql/query/medias/reviewMedias.gql";

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
</script>

<template>
  <div class="grid grid-cols-4">
    <!-- ----------------------Left side--------------------- -->
    <div class="flex flex-col space-y-6 pt-2 col-span-3">
      <!-- ---------------------Review description----------------- -->
      <p class="max-w-2xl secondary-text">
        {{ review.description }}
      </p>

      <!-- --------------------Review sides---------------------- -->
      <div v-if="review.sides">
        <p class="text-2xl py-2 dark:text-white font-medium">Sides</p>
        <p class="dark:text-sheger_light_gray-400">
          {{ review.sides }}
        </p>
      </div>

      <!-- -------------------------Review prepare time------------- -->
      <div v-if="review.timeToPrepare">
        <p class="text-2xl dark:text-white font-medium">Times to prepare</p>
        <p class="dark:text-sheger_light_gray-400">
          {{ review.timeToPrepare }} Minutes
        </p>
      </div>

      <!-- -------------------------Review Drink------------------- -->
      <div v-if="review.review_drink" class="w-full">
        <p class="text-2xl my-4 dark:text-white font-medium">Goes well with</p>
        <div class="flex space-x-4 xl:space-x-6 items-center">
          <img
            class="object-cover w-72"
            src="/images/temporary/default-drink-image.png"
            alt="Negus drink"
          />
          <div class="flex flex-col iphone5:space-y-2 xl:space-y-4">
            <h3 class="font-medium text-4xl dark:text-white">
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
    </div>

    <!-- ----------------------Right side--------------------- -->

    <div class="col-span-1 pl-8 border-l">
      <!-- --------------Gallery and upload image---------------- -->
      <div>
        <div class="flex items-center justify-between py-6">
          <p class="text-xl">
            Gallery
            <span class="text-sheger-gray-100"
              >({{ medias?.length }} Pictures)</span
            >
          </p>
          <button class="secondary-border py-2 px-4 rounded-md">Upload</button>
        </div>

        <div
          class="flex flex-col space-y-3 max-h-screen overflow-scroll scroll"
        >
          <Places-Gallery
            v-for="reviewMedia in medias"
            :key="reviewMedia.id"
            :media="reviewMedia"
            type="review"
            @on-deleted="mediasRefetch()"
          >
          </Places-Gallery>
        </div>
      </div>
    </div>
  </div>
</template>
