<script setup>
import list from "@/composables/auth-list-query.js";
import Stats from "@/graphql/query/admin/stats.gql";

definePageMeta({
  title: "Dashboard",
  description: "Dashboard page description",
  keywords: "dashboard, page, description",
  layout: "home",
});

/*----------- Fetch analytic data -----------*/
const analytics = ref([]);

const featuredAnalytics = ref([]);

const rawDataForCharts = ref(null);

const { onResult, loading, refetch } = list(Stats, {});

onResult(({ data }) => {
  rawDataForCharts.value = data;
  const sheger_aggregate_cards = data?.sheger_aggregate_cards;
  if (sheger_aggregate_cards?.length >= 0)
    analytics.value.push({
      title: "Total",
      value: sheger_aggregate_cards[0]?.totals,
      icon: "lucide:users",
      subject: "Users",
      trend:
        sheger_aggregate_cards[0]?.rate_change_percentage >= 0 ? "up" : "down",

      trendValue: sheger_aggregate_cards[0]?.rate_change_percentage + "%",
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
      trendValue: sheger_aggregate_cards[1]?.rate_change_percentage + "%",
    });

  if (sheger_aggregate_cards?.length >= 2)
    analytics.value.push({
      title: "Running",
      value: sheger_aggregate_cards[2]?.new_totals,
      icon: "lucide:megaphone",
      subject: "Advertisement",
      trend:
        sheger_aggregate_cards[2]?.rate_change_percentage >= 0 ? "up" : "down",
      trendValue: sheger_aggregate_cards[2]?.rate_change_percentage + "%",
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
</script>

<template>
  <div>
    <!-- Featured Analytics -->
    <div class="grid grid-cols-4" v-if="!loading">
      <div class="grid grid-cols-3 col-span-3 gap-5">
        <div
          v-for="(featuredAnalytic, index) in featuredAnalytics"
          :key="index"
          class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-[10px] shadow-sm"
        >
          <div class="flex items-center gap-x-3">
            <div>
              <Icon :name="featuredAnalytic.icon" class="w-8 h-8" />
            </div>
            <div>
              <h3>{{ featuredAnalytic.title }}</h3>
              <!-- <p class="mt-3 text-xs text-sheger-gray-100">
              Last Featured: {{ featuredAnalytic.last_featured }}
            </p> -->
            </div>
          </div>
          <div>
            <p class="text-2xl font-medium">
              {{ featuredAnalytic.value }}
            </p>
          </div>
        </div>
      </div>
      <!-- TODO Z: Add range date picker -->
      <div></div>
    </div>

    <!-- Analytics -->
    <div class="grid grid-cols-4 gap-5 mt-10" v-if="!loading">
      <div
        v-for="(analytic, index) in analytics"
        :key="index"
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
            class="flex items-center justify-center w-12 h-8 text-xs text-sheger-green-600 bg-sheger-green-50 rounded-[10px]"
          >
            <Icon :name="'eva:arrow-upward-outline'" class="w-4 h-4" />
            <span class="ml-1">{{ analytic.trendValue }}</span>
          </div>
          <div
            v-else-if="analytic.trend === 'down'"
            class="flex items-center justify-center w-12 h-8 text-xs text-white bg-red-500 rounded-[10px]"
          >
            <Icon :name="'eva:arrow-downward-outline'" class="w-4 h-4" />
            <span class="ml-1">{{ analytic.trendValue }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div
      class="grid grid-cols-2 gap-5 mt-10"
      v-if="!loading && rawDataForCharts != null"
    >
      <DashboardUserSignupChart
        :rawData="rawDataForCharts?.sheger_daily_user_signups"
      />
      <DashboardTotalAdViewChart
        :rawData="rawDataForCharts?.sheger_daily_add_views"
      />
      <DashboardUserEngagementChart
        :rawData="rawDataForCharts?.sheger_daily_user_engagment"
      />
      <DashboardPlaceViewChart
        :rawData="rawDataForCharts?.sheger_daily_visitor_by_categories"
      />
    </div>
    <div v-else>loading</div>
  </div>
</template>
