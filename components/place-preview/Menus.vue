<script setup>
import getPlacesMenuQuery from "@/graphql/query/menu/list.gql";

const props = defineProps({
  placeId: {
    type: String,
    required: true,
  },
});

/*...................Place menus data fetch.............*/
const filter = ref({
  placeId: {
    _eq: props.placeId,
  },
});
const limit = ref(6);
const offset = ref(0);
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const menus = ref([]);
const length = ref(0);

const { onResult, onError, loading, fetchMore } = authListQuery(
  getPlacesMenuQuery,
  filter,
  sort,
  offset,
  limit
);

onResult((result) => {
  if (result.data?.menus) {
    menus.value = result.data?.menus;
    length.value = result.data?.menusAggregate?.aggregate?.count;
  }
});
onError((error) => {});

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

  let newOffest = offset.value + menus.value.length;
  fetchMore({
    variables: {
      offset: newOffest,
    },
    /**
     * Updates the query result with the new data obtained from a fetchMore operation.
     *
     * @param {object} previousResult - The previous result of the query.
     * @param {object} fetchMoreResult - The new result obtained from the fetchMore operation.
     * @return {object} The updated query result with the merged menus.
     */
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) return previousResult;

      const mergedPlaces = fetchMoreResult.menus
        ? [...previousResult.menus, ...fetchMoreResult.menus]
        : previousResult.menus;

      return {
        ...fetchMoreResult,
        menus: mergedPlaces,
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
      class="absolute -top-1 hidden lg:block"
    ></HProgress>
    <div class="flex flex-col gap-4 py-4">
      <PlacePreviewPlaceMenuItemCard
        v-for="menu in menus"
        :key="menu"
        :menu="menu"
      ></PlacePreviewPlaceMenuItemCard>
    </div>
    <HPaginate
      v-model:offset="offset"
      :items-per-page="limit"
      :total-data="length"
      class="w-[89%] pt-16 hidden lg:block"
    ></HPaginate>

    <div v-if="loading" class="py-6">
      <HLoading class="lg:hidden"></HLoading>
    </div>

    <button
      v-else-if="!loading && menus.length < length"
      class="py-3 border rounded-md block w-full my-6 lg:hidden dark:text-white"
      @click="callFetchMore"
    >
      See More
    </button>
  </div>
</template>
