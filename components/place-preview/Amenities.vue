<script setup>
import getPlacesAmenitiesQuery from "@/graphql/query/places/getPlaceAmenities.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();

const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});

/*...................Place amenities data fetch.............*/
const filter = ref({
  placeId: {
    _eq: props.place.id,
  },
});
const limit = ref(6);
const offset = ref(0);
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const amenities = ref([]);
const length = ref(0);

const { onResult, onError, loading, fetchMore } = authListQuery(
  getPlacesAmenitiesQuery,
  filter,
  sort,
  offset,
  limit
);

onResult((result) => {
  if (result.data?.placeAmenities) {
    amenities.value = result.data?.placeAmenities;
    length.value = result.data?.placeAmenitiesAggregate.aggregate.count;
  }
});
onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/*----------------------------Fetch more for small screen--------------------------------------*/

const lastFetched = ref(new Date().getTime());
/**
 * Calls the fetchMore function to retrieve more data if the user scrolls.
 *
 * @return {undefined} No return value.
 */
const callFetchMore = () => {
  if (loading.value || new Date().getTime() - lastFetched.value < 1000) return;
  lastFetched.value = new Date().getTime();

  let newOffest = offset.value + amenities.value.length;
  fetchMore({
    variables: {
      offset: newOffest,
    },
    /**
     * Updates the query result with the new data obtained from a fetchMore operation.
     *
     * @param {object} previousResult - The previous result of the query.
     * @param {object} fetchMoreResult - The new result obtained from the fetchMore operation.
     * @return {object} The updated query result with the merged amenities.
     */
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) return previousResult;

      const mergedAmenities = fetchMoreResult.amenities
        ? [...previousResult.amenities, ...fetchMoreResult.amenities]
        : previousResult.amenities;

      return {
        ...fetchMoreResult,
        amenities: mergedAmenities,
      };
    },
  });
};
</script>

<template>
  <div>
    <HProgress
      v-if="loading"
      height="h-[3px]"
      class="absolute -top-5 hidden lg:block"
    ></HProgress>
    <div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6"
      >
        <PlacePreviewAmenityItemCard
          v-for="amenity in amenities"
          :key="amenity"
          :amenity="amenity"
        ></PlacePreviewAmenityItemCard>
      </div>
      <div class="py-6">
        <HPaginate
          v-if="length > 0"
          v-model:offset="offset"
          :items-per-page="limit"
          :total-data="length"
          class="w-full pt-16 hidden lg:block"
        ></HPaginate>
      </div>
    </div>
    <p class="py-6 text-2xl" v-if="!loading && length == 0">No data found</p>
    <div v-show="loading" class="py-6">
      <HLoading class="lg:hidden"></HLoading>
    </div>

    <button
      v-show="!loading && amenities.length < length"
      class="py-3 border rounded-md block w-full my-6 lg:hidden"
      @click="callFetchMore"
    >
      See More
    </button>
  </div>
</template>
