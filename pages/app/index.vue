<script setup>
import custom from "@/composables/custom-query.js";
import Stats from "@/graphql/query/admin/stats.gql";

definePageMeta({
  title: "Dashboard",
  description: "Dashboard page description",
  keywords: "dashboard, page, description",
  layout: "home",
});

const dateRangeValue = ref([
  new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 12,
    new Date().getDate()
  ),
  new Date(),
]);

/*----------- Fetch analytic data -----------*/
const analytics = ref([]);

const featuredAnalytics = ref([]);

const rawDataForCharts = ref(null);

const filter = computed(() => ({
  start_date: dateRangeValue.value[0],
  end_date: dateRangeValue.value[1],
}));

const { onResult, loading, refetch } = custom(Stats, filter);

onResult(({ data }) => {
  let singups = [...data.sheger_daily_user_signups];
  singups.sort((a, b) => {
    // Convert date strings to Date objects for comparison
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Compare the dates
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  });

  let adViews = [...data.sheger_daily_add_views];
  adViews.sort((a, b) => {
    // Convert date strings to Date objects for comparison
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Compare the dates
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  });

  let userEngagements = [...data.sheger_daily_user_engagment];
  userEngagements.sort((a, b) => {
    // Convert date strings to Date objects for comparison
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Compare the dates
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  });

  let placeViews = [...data.sheger_daily_visitor_by_categories];
  placeViews.sort((a, b) => {
    // Convert date strings to Date objects for comparison
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Compare the dates
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  });

  rawDataForCharts.value = {
    sheger_daily_user_signups: singups,
    sheger_daily_add_views: adViews,
    sheger_daily_user_engagment: userEngagements,
    sheger_daily_visitor_by_categories: placeViews,
  };

  const sheger_aggregate_cards = data?.sheger_aggregate_cards;

  analytics.value = [];
  featuredAnalytics.value = [];
  if (sheger_aggregate_cards?.length >= 0)
    analytics.value.push({
      title: "Total",
      value: sheger_aggregate_cards[0]?.totals,
      icon: "lucide:users",
      subject: "Users",
      trend:
        sheger_aggregate_cards[0]?.rate_change_percentage >= 0 ? "up" : "down",

      trendValue:
        sheger_aggregate_cards[0]?.rate_change_percentage?.toFixed(2) + "%",
    });

  if (sheger_aggregate_cards?.length >= 0)
    analytics.value.push({
      title: "New",
      value: sheger_aggregate_cards[0]?.new_totals,
      icon: "lucide:user-plus",
      subject: "Users",
    });

  if (sheger_aggregate_cards?.length >= 1)
    analytics.value.push({
      title: "Total",
      value: sheger_aggregate_cards[1]?.new_totals,
      icon: "uil:shop",
      subject: "Places",
      trend:
        sheger_aggregate_cards[1]?.rate_change_percentage >= 0 ? "up" : "down",
      trendValue:
        sheger_aggregate_cards[1]?.rate_change_percentage?.toFixed(2) + "%",
    });

  if (sheger_aggregate_cards?.length >= 2)
    analytics.value.push({
      title: "Running",
      value: sheger_aggregate_cards[2]?.new_totals,
      icon: "lucide:megaphone",
      subject: "Advertisement",
      trend:
        sheger_aggregate_cards[2]?.rate_change_percentage >= 0 ? "up" : "down",
      trendValue:
        sheger_aggregate_cards[2]?.rate_change_percentage?.toFixed(2) + "%",
    });

  featuredAnalytics.value.push({
    title: "Weekly Recommendation",
    value: data.weekly_recommended?.aggregate?.count,
    icon: "lucide:calendar-range",
    last_featured: "2 days ago",
  });

  featuredAnalytics.value.push({
    title: "Seasonal Places",
    value: data.seasonal_places?.aggregate?.count,
    icon: "lucide:cloud-sun-rain",
    last_featured: "2 days ago",
  });

  featuredAnalytics.value.push({
    title: "Recently Opened",
    value: data.recently_opened?.aggregate?.count,
    icon: "lucide:door-open",
    last_featured: "2 days ago",
  });
});

watch(rawDataForCharts, () => {
  console.log(rawDataForCharts.value, "rawDataForCharts");
});
</script>

<template>
  <div>
    <!-- Featured Analytics -->
    <div class="grid grid-cols-4 gap-5" v-if="!loading" :key="dateRangeValue">
      <div
        v-for="(featuredAnalytic, index) in featuredAnalytics"
        :key="index + 'featuredAnalytic'"
        class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-[10px] shadow-sm"
      >
        <div class="flex items-center gap-x-3">
          <div>
            <Icon :name="featuredAnalytic.icon" class="w-8 h-8" />
          </div>
          <div>
            <h3>{{ featuredAnalytic.title }}</h3>
          </div>
        </div>
        <div>
          <p class="text-2xl font-medium">
            {{ featuredAnalytic.value }}
          </p>
        </div>
      </div>
      <div>
        <H-RangeDatePicker inputClass="!py-5" v-model="dateRangeValue" />
      </div>
    </div>
    <!-- Skeleton Loader for Featured Analytics -->
    <div class="grid grid-cols-4 gap-5" v-else>
      <SkeletonLoaderDashboardCard v-for="i in 4" :key="i" />
    </div>

    <!-- Analytics -->
    <div
      class="grid grid-cols-4 gap-5 mt-10"
      v-if="!loading"
      :key="dateRangeValue"
    >
      <div
        v-for="(analytic, index) in analytics"
        :key="index + 'analytic'"
        class="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-[10px] shadow-sm"
      >
        <div class="flex items-center gap-x-5">
          <div
            class="box-content flex items-center justify-center w-12 h-12 rounded bg-primary-100"
          >
            <Icon :name="analytic.icon" class="w-6 h-6 text-primary-600" />
          </div>
          <div class="space-y-1">
            <h3 class="text-sm text-sheger-gray-400">{{ analytic.title }}</h3>
            <p class="text-3xl font-medium">{{ analytic.value }}</p>
            <p class="text-sm text-sheger-gray-100">
              {{ analytic.subject }}
            </p>
          </div>
        </div>
        <div v-if="analytic.trend">
          <div
            v-if="analytic.trend === 'up'"
            class="flex items-center justify-center w-16 h-8 text-xs text-sheger-green-600 bg-sheger-green-50 rounded-[10px]"
          >
            <Icon :name="'eva:arrow-upward-outline'" class="w-4 h-4" />
            <span class="ml-1">{{ analytic.trendValue }}</span>
          </div>
          <div
            v-else
            class="flex items-center justify-center w-16 h-8 text-xs text-white bg-red-500 rounded-[10px]"
          >
            <Icon :name="'eva:arrow-downward-outline'" class="w-4 h-4" />
            <span class="ml-1">{{
              analytic.trendValue >= 0
                ? analytic?.trendValue
                : analytic?.trendValue?.replace("-", "")
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton Loader for Analytics -->
    <div class="grid grid-cols-4 gap-5 mt-10" v-else>
      <SkeletonLoaderDashboardCard v-for="i in 4" :key="i" />
    </div>

    <!-- Charts -->
    <div
      class="grid grid-cols-2 gap-5 mt-10"
      v-if="!loading && rawDataForCharts != null"
    >
      <Dashboard-UserSignupChart
        :rawData="rawDataForCharts?.sheger_daily_user_signups"
        :key="rawDataForCharts"
      />
      <Dashboard-TotalAdViewChart
        :rawData="rawDataForCharts?.sheger_daily_add_views"
        :key="rawDataForCharts"
      />
      <Dashboard-UserEngagementChart
        :rawData="rawDataForCharts?.sheger_daily_user_engagment"
        :key="rawDataForCharts"
      />
      <Dashboard-PlaceViewChart
        :rawData="rawDataForCharts?.sheger_daily_visitor_by_categories"
        :key="rawDataForCharts"
      />
    </div>

    <!-- Skeleton Loader for Charts -->
    <div class="grid grid-cols-2 gap-5 mt-10" v-else>
      <SkeletonLoaderDashboardChart v-for="i in 4" :key="i" />
    </div>
  </div>
</template>
