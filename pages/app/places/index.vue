<script setup>
/**-----------------------------------imports----------------------------- */
import placeStatusAggregateQuery from "@/graphql/query/aggregate/place-status-aggregate.gql";
import placesQuery from "@/graphql/query/places/list.gql";
import useNotify from "@/use/notify";

/*----------------------------Global Variables---------------------------*/

/**--------------------Tab data-------------------- */
const { notify } = useNotify();
const tabs = ref([
  {
    name: "Active",
    value: "ACTIVE",
    length: 0,
  },
  {
    name: "Pending",
    value: "PENDING",
    length: 0,
  },
  {
    name: "Draft",
    value: "DRAFT",
    length: 0,
  },
  {
    name: "Closed",
    value: "CLOSED",
    length: 0,
  },
  {
    name: "Suspended",
    value: "SUSPENDED",
    length: 0,
  },
]);

const currentTabIndex = ref(0);

/*...................Aggregate data fetch.............*/

const orderBy = ref([{}]);
const {
  onResult: aggregateOnResult,
  onError: aggregateOnError,
  loading: aggregateLoading,
  refetch: aggregateReFetch,
} = authListQuery(placeStatusAggregateQuery, {}, orderBy, 0, 7);

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

/***---------------------Place data fetch--------------------- */

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
      status: {
        _eq: tabs.value[currentTabIndex.value].value,
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

provide("refetch", () => {
  refetch();
  aggregateReFetch();
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
            v-model="search"
            name="search"
            type="text"
            placeholder="Search here"
            trailing-icon="uil:search"
          ></H-Textfield>
          <div class="border rounded-md py-3 px-4">
            <Icon
              name="heroicons-outline:adjustments"
              class="text-2xl cursor-pointer z-30"
            />
          </div>
          <nuxt-link
            to="places/register-new-place"
            class="primary-button block bg-primary-600"
          >
            <Icon
              name="lucide:building-2"
              class="text-xl text-white"
              color=""
            />
            <span class="text-white">Register New Place</span>
          </nuxt-link>
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
      <template #ACTIVE>
        <div>
          <PlacesList
            :places="places"
            :total-page="totalPage"
            v-model:model-value="pageTracker"
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
      <template #PENDING>
        <div>
          <PlacesList
            :places="places"
            :total-page="totalPage"
            v-model:model-value="pageTracker"
          />
          <HPaginate
            :items-per-page="limit"
            v-model:offset="offset"
            :total-data="length"
            class="w-full pt-16"
          ></HPaginate>
          <HZeroResult
            class="py-8"
            v-if="!loading && length == 0"
          ></HZeroResult>
        </div>
      </template>
      <template #DRAFT>
        <div>
          <PlacesList
            :places="places"
            :total-page="totalPage"
            v-model:model-value="pageTracker"
          />
          <HPaginate
            :items-per-page="limit"
            v-model:offset="offset"
            :total-data="length"
            class="w-full pt-16"
          ></HPaginate>
          <HZeroResult
            class="py-8"
            v-if="!loading && length == 0"
          ></HZeroResult>
        </div>
      </template>
      <template #CLOSED>
        <div>
          <PlacesList
            :places="places"
            :total-page="totalPage"
            v-model:model-value="pageTracker"
          />
          <HPaginate
            :items-per-page="limit"
            v-model:offset="offset"
            :total-data="length"
            class="w-full pt-16"
          ></HPaginate>
          <HZeroResult
            class="py-8"
            v-if="!loading && length == 0"
          ></HZeroResult>
        </div>
      </template>
      <template #SUSPENDED>
        <div>
          <PlacesList
            :places="places"
            :total-page="totalPage"
            v-model:model-value="pageTracker"
          />
          <HPaginate
            :items-per-page="limit"
            v-model:offset="offset"
            :total-data="length"
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
