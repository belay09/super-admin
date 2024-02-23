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

    <div v-if="aggregateLoading" class="flex items-center space-x-6 py-5">
      <!-- Skeleton loader for place type items -->
      <div
        v-for="index in 4"
        :key="index"
        class="skeleton-container flex items-center space-x-2 border rounded-md px-6 py-3"
      >
        <!-- Place type skeleton -->
        <div class="skeleton w-8 h-8 rounded-full"></div>
        <!-- Place type name skeleton -->
        <div class="skeleton w-20 h-12"></div>
      </div>
    </div>
    <AdSpacePlaceLength
      v-else
      v-model:model-value="placeType"
      :placeTypeItems="placeTypeItems"
    ></AdSpacePlaceLength>

    <!-- -------------------Add ad space list-------------------- -->
    <!-- ad-space-default -->
    <div class="h-screen overflow-y-scroll scroll">
      <div v-if="loading" class="grid grid-cols-2 gap-6">
        <div v-for="i in 4" class="rounded-lg border skeleton-container">
          <!-- Skeleton loader for the card body -->
          <div class="skeleton w-full h-32 rounded-t-lg"></div>

          <!-- Skeleton loader for the card body -->
          <div class="flex flex-col space-y-4 py-4 px-5">
            <!-- Place name and logo skeleton -->
            <div class="secondary-flex-row items-center space-x-4">
              <!-- Place logo skeleton -->
              <div class="skeleton w-8 h-8 rounded-full"></div>
              <!-- Place name skeleton -->
              <div class="skeleton w-1/2 h-6"></div>
            </div>
            <!-- Place type skeleton -->
            <div class="skeleton w-1/4 h-6"></div>
            <!-- Slogan title skeleton -->
            <div class="skeleton w-3/4 h-8"></div>
            <!-- Description skeleton -->
            <div class="skeleton w-full h-20"></div>
            <!-- Date skeleton -->
            <div class="primary-flex-row items-center space-x-2">
              <div class="skeleton w-6 h-6 rounded-full"></div>
              <div class="skeleton w-1/4 h-6"></div>
            </div>
          </div>

          <!-- Skeleton loader for the card footer -->
          <div class="grid grid-cols-2 px-10 py-4 gap-x-4 border-t">
            <!-- Edit button skeleton -->
            <div class="skeleton w-2/3 h-10"></div>
            <!-- Delete button skeleton -->
            <div class="skeleton w-2/3 h-10"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 gap-6">
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
    </div>
  </div>
</template>
