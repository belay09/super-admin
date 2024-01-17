<script setup>
import placeAdListsQuery from "@/graphql/query/place-ads/list.gql";
import placeAdsAggregateQuery from "@/graphql/query/aggregate/place-ads-aggregate.gql";

import useNotify from "@/use/notify";

const { notify } = useNotify();
const emit = defineEmits(["edit"]);
const props = defineProps({
  makeRefetch: {
    type: Boolean,
    default: false,
  },
});

const placeTypeItems = ref([
  {
    name: "Hotels",
    id: "HOTELS",
    total: 0,
  },
  {
    name: "Restaurants",
    id: "RESTAURANTS",
    total: 0,
  },
  {
    name: "Cafes",
    id: "CAFES",
    total: 0,
  },
  {
    name: "Caterings",
    id: "CATERINGS",
    total: 0,
  },
]);

/*...................Aggregate data fetch.............*/

const orderBy = ref([{}]);
const {
  onResult: aggregateOnResult,
  onError: aggregateOnError,
  loading: aggregateLoading,
  refetch: aggregateReFetch,
} = authListQuery(placeAdsAggregateQuery, {}, orderBy, 0, 7);

aggregateOnResult((result) => {
  if (result.data) {
    placeTypeItems.value.forEach((placeType) => {
      placeType.total = result.data?.[placeType.id]?.aggregate?.count;
    });
  }
});
aggregateOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/***---------------------Place ads data fetch--------------------- */

const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const placeAds = ref([]);
const limit = ref(100);
const length = ref(0);
const search = ref("");
const offset = ref(0);

const placeType = ref("All");
/***-------------------------Compute offset------------------------- */

/**-------------------Compute filter when tab change and search---------------- */
const filter = computed(() => {
  let query = {};
  query._and = [
    {
      _or: [
        {
          place: {
            name: {
              _ilike: `%${search.value}%`,
            },
          },
        },
        {
          slogan: {
            _ilike: `%${search.value}%`,
          },
        },
      ],
    },
  ];

  if (placeType.value !== "All") {
    query._and.push({
      place: {
        type: {
          _eq: placeType.value,
        },
      },
    });
  }
  return query;
});

const { onResult, onError, loading, refetch } = authListQuery(
  placeAdListsQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.placeAds) {
    placeAds.value = result.data.placeAds;
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

// refresh
function refresh() {
  refetch();
  aggregateReFetch();
}

watch(
  () => props.makeRefetch,
  (newVal) => {
    if (newVal) {
      refresh();
    }
  }
);
</script>

<template>
  <div class="col-span-2 pl-10">
    <div class="flex items-center justify-between">
      <h3
        @click="placeType = 'All'"
        class="text-2xl font-medium hover:cursor-pointer"
      >
        4 Ads Running
      </h3>
      <div class="secondary-flex-row">
        <H-Textfield
          name="search"
          type="text"
          placeholder="Search here"
          trailing-icon="uil:search"
          v-model="search"
        ></H-Textfield>
        <!-- <div class="border rounded-md py-3 px-4">
          <Icon
            name="heroicons-outline:adjustments"
            class="text-2xl cursor-pointer z-30"
          />
        </div> -->
      </div>
    </div>

    <!-- -------------------Ad space place type total places ------------- -->

    <AdSpacePlaceLength
      v-model:model-value="placeType"
      :placeTypeItems="placeTypeItems"
    ></AdSpacePlaceLength>

    <!-- -------------------Add ad space list-------------------- -->
    <!-- ad-space-default -->
    <div class="h-screen overflow-y-scroll scroll">
      <div class="grid grid-cols-2 gap-6">
        <UiCardsPlaceAdItem
          v-for="placeAd in placeAds"
          :key="placeAd.id"
          :placeAd="placeAd"
          @onDelete="refresh"
          @edit="emit('edit', placeAd.id)"
        >
        </UiCardsPlaceAdItem>
      </div>
      <p
        class="py-4 text-2xl font-medium"
        v-if="!loading && placeAds.length == 0"
      >
        Zero Result
      </p>
      <HLoading v-if="loading"></HLoading>
    </div>
  </div>
</template>
