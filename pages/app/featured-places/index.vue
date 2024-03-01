<script setup>
/**-----------------------------------imports----------------------------- */
import placeFeaturedAggregateQuery from "@/graphql/query/aggregate/place-featured-aggregate.gql";
import placesQuery from "@/graphql/query/places/list.gql";

import useNotify from "@/use/notify";

/*----------------------------Global Variables---------------------------*/
const { notify } = useNotify();

/**--------------------Tab data-------------------- */
const tabs = ref([
  {
    name: "Weekly Recommended",
    value: "WEEKLY_RECOMMENDED_PLACE",
    length: 0,
  },
  {
    name: "Seasonal",
    value: "SEASONAL_PLACE",
    length: 0,
  },
  {
    name: "Recently Opened",
    value: "RECENTLY_OPENED_PLACE",
    length: 0,
  },
]);

const currentTabIndex = ref(0);
const currentTab = computed(() => {
  return tabs.value[currentTabIndex.value];
});
/*...................Aggregate data fetch.............*/
const orderBy = ref([{}]);
const {
  onResult: aggregateOnResult,
  onError: aggregateOnError,
  loading: aggregateLoading,
  refetch: aggregateReFetch,
} = authListQuery(placeFeaturedAggregateQuery, {}, orderBy, 0, 7);

aggregateOnResult((result) => {
  if (result.data) {
    tabs.value.forEach((tab) => {
      tab.length = result.data?.[tab.value]?.aggregate?.count;
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

/***---------------------Places data fetch--------------------- */
const placeSortItems = ref([
  {
    name: "Name",
    levels: ["name"],
  },

  {
    name: "View",
    levels: ["view_count"],
  },
  {
    name: "Rating",
    levels: ["place_aggregate_summary", "avgRating"],
  },
  {
    name: "Like",
    levels: ["place_aggregate_summary", "sumLikes"],
  },

  {
    name: "Price",
    levels: ["place_aggregate_summary", "avgDishPrice"],
  },

  {
    name: "Created At",
    levels: ["createdAt"],
  },
]);

const selectedSort = ref("Created At");
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const places = ref([]);
const limit = ref(6);
const length = ref(0);
const pageTracker = ref(1);
const search = ref("");

/***-------------------------Compute offset------------------------- */
const offset = computed(() => {
  return (pageTracker.value - 1) * limit.value;
});
const totalPage = computed(() => {
  return Math.ceil(length.value / limit.value);
});

watch(currentTabIndex, () => {
  pageTracker.value = 1;
});

/**-------------------Compute filter when tab change and search---------------- */
const filter = computed(() => {
  let query = {};
  query._and = [
    {
      featured_places: {
        _and: [
          {
            isActive: {
              _eq: true,
            },
          },
          {
            featured_place_type: {
              value: {
                _eq: tabs.value[currentTabIndex.value].value,
              },
            },
          },
        ],
      },
    },
    {
      name: {
        _ilike: `%${search.value}%`,
      },
    },
  ];
  return query;
});

// TODO order by
const { onResult, onError, loading, refetch } = authListQuery(
  placesQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.places) {
    places.value = result.data.places;
    length.value = result.data.placesAggregate?.aggregate?.count;
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

definePageMeta({
  layout: "home",
});
</script>
<template>
  <div class="w-full">
    <!-- ---------search and filter and btn--------- -->

    <div class="relative">
      <div class="flex absolute top-2 right-0">
        <div class="secondary-flex-row">
          <H-Textfield
            name="search"
            type="text"
            placeholder="Search here"
            trailing-icon="uil:search"
            v-model="search"
          ></H-Textfield>
          <!------------------------- sort -------------------------->
          <H-Sort
            v-model:selected="selectedSort"
            v-model="sort"
            :items="placeSortItems"
          ></H-Sort>
        </div>
      </div>
    </div>

    <div class="pt-10"></div>

    <H-Tab :tabs="tabs" v-model:current-tab-index="currentTabIndex">
      <template v-slot:tab="{ tabData }">
        <div class="secondary-flex-row">
          <span class="text-xl">{{ tabData.tab?.name }}</span>
          <span
            :class="{ 'bg-primary-100': tabData.isActive }"
            class="px-1.5 py-0.5 rounded-lg border bg-gray-200"
            >{{ tabData.tab?.length }}</span
          >
        </div>
      </template>

      <template #WEEKLY_RECOMMENDED_PLACE>
        <div>
          <FeaturedPlaces-List
            :places="places"
            :total-page="totalPage"
            v-model:model-value="pageTracker"
            :current-tab="currentTab"
            @refetch="refetch()"
          />
          <HPaginate
            :items-per-page="limit"
            v-model:offset="offset"
            :total-data="length"
            v-model="pageTracker"
            class="w-full pt-16"
          ></HPaginate>
          <HZeroResult
            class="py-8"
            v-if="!loading && length == 0"
          ></HZeroResult>
        </div>
      </template>
      <template #SEASONAL_PLACE>
        <div>
          <FeaturedPlaces-List
            :places="places"
            :total-page="totalPage"
            v-model:model-value="pageTracker"
            :current-tab="currentTab"
            @refetch="refetch()"
          />
          <HPaginate
            :items-per-page="limit"
            v-model:offset="offset"
            :total-data="length"
            v-model="pageTracker"
            class="w-full pt-16"
          ></HPaginate>
          <HZeroResult
            class="py-8"
            v-if="!loading && length == 0"
          ></HZeroResult>
        </div>
      </template>
      <template #RECENTLY_OPENED_PLACE>
        <div>
          <FeaturedPlaces-List
            :places="places"
            :total-page="totalPage"
            v-model:model-value="pageTracker"
            :current-tab="currentTab"
            @refetch="refetch()"
          />
          <HPaginate
            :items-per-page="limit"
            v-model:offset="offset"
            :total-data="length"
            v-model="pageTracker"
            class="w-full pt-16"
          ></HPaginate>
          <HZeroResult
            class="py-8"
            v-if="!loading && length == 0"
          ></HZeroResult>
        </div>
      </template>
    </H-Tab>
  </div>
</template>
