<script setup>
import GetPlaceReports from "@/graphql/query/reports/getPlaceReports.gql";
import GetReviewReports from "@/graphql/query/reports/getReviewReviewReports.gql";
import list from "@/composables/auth-list-query";

/***---------------------Tab--------------------- */

const tabs = computed(() => {
  return [
    {
      name: "Pending",
      value: "Pending",
      length: numberOfPending.value,
    },
    {
      name: "Addressed",
      value: "Addressed",
      length: numberOfAddressed.value,
    },
  ];
});

definePageMeta({
  layout: "home",
});

const currentActiveTabIndex = ref(0);

const selectedFilter = ref("place");

const totalItems = ref(0);

const limit = ref(10);

const page = ref(1);

const offset = computed(() => {
  return (page.value - 1) * limit.value;
});

const filter = computed(() => {
  return {
    isAddressed: { _eq: currentActiveTabIndex.value === 1 },
  };
});

const numberOfAddressed = ref(0);
const numberOfPending = ref(0);

/**--------------------Sort---------- */
const reportSortItems = ref([
  {
    name: "Name",
    levels: ["user", "fullName"],
  },

  {
    name: "Reported At",
    levels: ["createdAt"],
  },
]);

const selectedSort = ref("Reported At");
const sort = ref[{ createdAt: "DESC_NULLS_LAST" }];

/***--------------------- Fetch place review reports --------------------- */
const placeReviewReportEnabled = computed(() => {
  return selectedFilter.value === "place";
});
const placeReviewReports = ref([]);
const {
  onResult: onPlaceReportResult,
  refetch: refetchPlaceReports,
  loading: loadingPlaceReports,
} = list(
  GetPlaceReports,
  filter,
  sort,
  ref(0),
  ref(100),
  placeReviewReportEnabled
);

onPlaceReportResult(({ data }) => {
  placeReviewReports.value = data?.placeReviewReport;
  totalItems.value = data?.length?.aggregate?.count;
  numberOfAddressed.value = data?.addressed?.aggregate?.count;
  numberOfPending.value = data?.pending?.aggregate?.count;
});

/***--------------------- Fetch place review reports --------------------- */
const reviewReportEnabled = computed(() => {
  return selectedFilter.value === "review";
});

const reviewReports = ref([]);
const {
  onResult: onReviewReportResult,
  loading: loadingReviewReports,
  refetch: refetchReviewReports,
} = list(GetReviewReports, filter, sort, ref(0), ref(100), reviewReportEnabled);

onReviewReportResult(({ data }) => {
  reviewReports.value = data?.reviewReviewReports;
  totalItems.value = data?.length?.aggregate?.count;
  numberOfAddressed.value = data?.addressed?.aggregate?.count;
  numberOfPending.value = data?.pending?.aggregate?.count;
});
</script>

<template>
  <div class="relative flex flex-col w-full h-full pl-10 pr-16">
    <!-- ---------search and filter--------- -->
    <div class="relative">
      <div class="absolute right-0 flex">
        <div class="secondary-flex-row">
          <H-Listselect
            name="filter"
            :items="[
              { name: 'Place', id: 'place' },
              { name: 'Review', id: 'review' },
            ]"
            v-model="selectedFilter"
            class="!w-20 !px-3 !py-3 !box-content cursor-pointer"
          ></H-Listselect>
          <H-Textfield
            name="search"
            type="text"
            placeholder="Search here"
            trailing-icon="uil:search"
          ></H-Textfield>
          <!------------------------- sort -------------------------->
          <H-Sort
            v-model:selected="selectedSort"
            v-model="sort"
            :items="reportSortItems"
          ></H-Sort>
        </div>
      </div>
    </div>

    <!-- ----------------Tab------------------ -->
    <div class="h-full">
      <H-Tab :tabs="tabs" v-model:current-tab-index="currentActiveTabIndex">
        <template v-slot:tab="{ tabData }">
          <div class="py-3 secondary-flex-row">
            <span class="text-xl">{{ tabData.tab?.name }}</span>
            <span
              :class="{ 'bg-primary-100': tabData.isActive }"
              class="px-1.5 py-0.5 rounded-lg border bg-gray-200"
              >{{ tabData.tab?.length }}</span
            >
          </div>
        </template>
      </H-Tab>

      <div v-if="reviewReportEnabled">
        <div class="flex items-center justify-between mt-5">
          <p class="text-xl font-medium text-sheger-gray-100">
            Showing
            {{ reviewReports?.length }}/{{ limit }}
            reports
          </p>
        </div>
        <Reports-ReviewList
          :items="reviewReports"
          @refetch="refetchReviewReports"
          :loading="loadingReviewReports"
        ></Reports-ReviewList>
      </div>
      <div v-if="placeReviewReportEnabled">
        <div class="flex items-center justify-between mt-5">
          <p class="text-xl font-medium text-sheger-gray-100">
            Showing
            {{ placeReviewReports?.length }}/{{ limit }}
            reports
          </p>
        </div>
        <Reports-PlaceList
          :items="placeReviewReports"
          @refetch="refetchPlaceReports"
          :loading="loadingPlaceReports"
        ></Reports-PlaceList>
      </div>
    </div>

    <div class="bottom-0 stick">
      <HPaginate
        v-model="page"
        :items-per-page="limit"
        :total-data="totalItems"
      />
    </div>
  </div>
</template>
