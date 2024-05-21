<script setup>
import placesQuery from "@/graphql/query/places/list.gql";
import useNotify from "@/use/notify";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const { notify } = useNotify();

const props = defineProps({
  type: {
    type: String,
    default: "Hotels",
  },
});

/**-------------------Common variable for popular and recommended places----------- */
const limit = ref(12);
const offset = ref(0);
const sort = ref([
  {
    place_aggregate_summary: {
      avgRating: "DESC_NULLS_LAST",
    },
  },
  {
    view_count: "DESC_NULLS_LAST",
  },
]);

/**--------------------Recommended Place variables------------------ */
const recommendedPlaces = ref([]);
const recommendedFilter = computed(() => {
  return {
    _and: [
      { type: { _eq: props.type.toUpperCase() } },
      { shegerRecommendationId: { _isNull: false } },
      {
        status: {
          _eq: "ACTIVE",
        },
      },
    ],
  };
});

/**--------------------Popular Place variables------------------ */
const popularPlaces = ref([]);
const popularFilter = computed(() => {
  return {
    _and: [
      {
        status: {
          _eq: "ACTIVE",
        },
      },
      {
        type: { _eq: props.type.toUpperCase() },
      },
    ],
  };
});

/**----------------------First load ssr data fetch---------------------- */
//1. Recommended places data fetch
const { data: recommendedPlacesData } = await useAsyncQuery(placesQuery, {
  limit: limit.value,
  filter: recommendedFilter.value,
});

if (recommendedPlacesData.value?.places) {
  recommendedPlaces.value = recommendedPlacesData.value.places;
}

// //2 Popular places data fetch
const { data: popularPlacesData } = await useAsyncQuery(placesQuery, {
  limit: limit.value,
  filter: popularFilter.value,
});

if (popularPlacesData.value?.places) {
  popularPlaces.value = popularPlacesData.value.places;
}

/**----------------------Client side data fetch---------------------- */
// 1. Recommended places data fetch
const recommendedFetchEnabled = ref(authStore.isLoggedIn);

const {
  onResult: recommendedResult,
  onError: recommendedError,
  loading: recommendedLoading,
} = anonymousListQuery(
  placesQuery,
  recommendedFilter,
  sort,
  offset,
  limit,
  authStore.isLoggedIn,
  recommendedFetchEnabled
);

recommendedResult((result) => {
  if (result.data?.places) {
    recommendedPlaces.value = result.data.places;
  }
});

recommendedError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

// 2. Popular places data fetch
const popularFetchEnabled = ref(authStore.isLoggedIn);
const {
  onResult: popularResult,
  onError: popularError,
  loading: popularLoading,
} = anonymousListQuery(
  placesQuery,
  popularFilter,
  sort,
  offset,
  limit,
  authStore.isLoggedIn,
  popularFetchEnabled
);

popularResult((result) => {
  if (result.data?.places) {
    popularPlaces.value = result.data.places;
  }
});

popularError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});
</script>

<template>
  <div>
    <!-- body -->
    <div
      class="iphone5:pt-20 lg:pt-[140px] xl:pt-[170px] lg:px-8 xl:px-12 2xl:px-[100px]"
    >
      <div class="w-full">
        <PlaceAddSpace :type="type" />
      </div>
    </div>

    <div class="iphone5:px-4 py-4 samsg:px-5 md:px-8 xl:px-12 2xl:px-[100px]">
      <!-- -------------popular   places---------------------- -->
      <div class="iphone5:pt-6 xl:pt-16 2xl:pt-40 w-full min-h-[20rem]">
        <p
          class="text-xl xl:text-2xl font-medium dark:text-white iphone5:py-2 md:py-10"
        >
          Recommended {{ type }}
        </p>
        <div class="iphone5:pt-8 md:py-10">
          <CarouselPlace
            :show-pagination="false"
            :show-navigation="true"
            :type="type.toLowerCase()"
            :places="recommendedPlaces"
          ></CarouselPlace>
        </div>
      </div>

      <!-- ------------------------recommended places ------------------->
      <div class="2xl:pt-20">
        <p
          class="text-xl xl:text-2xl font-medium dark:text-white iphone5:py-6 md:py-10"
        >
          Popular {{ type }}
        </p>
        <div class="iphone5:pt-8 md:py-10">
          <CarouselPlace
            :show-pagination="false"
            :show-navigation="true"
            :type="type.toLowerCase()"
            :places="popularPlaces"
          ></CarouselPlace>
        </div>
      </div>
    </div>
  </div>
</template>
